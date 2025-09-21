from fastapi import FastAPI, APIRouter, HTTPException, File, UploadFile, Form
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import base64
import uuid
import aiohttp
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from PIL import Image
import io
import asyncio
from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent
from bs4 import BeautifulSoup
import requests

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class TryOnRequest(BaseModel):
    person_image: str  # base64 encoded
    clothing_url: Optional[str] = None
    clothing_image: Optional[str] = None

class TryOnResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    person_image: str
    clothing_image: str
    result_image: str
    processing_time: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TryOnSession(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    results: List[dict] = []

class ClothingScrapeRequest(BaseModel):
    url: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Utility functions
def validate_image_base64(base64_str: str) -> bool:
    """Validate if the base64 string is a valid image"""
    try:
        if base64_str.startswith('data:image'):
            base64_str = base64_str.split(',')[1]
        
        image_data = base64.b64decode(base64_str)
        image = Image.open(io.BytesIO(image_data))
        # Check if it's a valid image format
        if image.format not in ['JPEG', 'PNG', 'JPG']:
            return False
        return True
    except Exception as e:
        logger.error(f"Image validation error: {e}")
        return False

def convert_image_to_base64(image_url: str) -> str:
    """Download image from URL and convert to base64"""
    try:
        response = requests.get(image_url, timeout=10)
        response.raise_for_status()
        
        image_data = response.content
        base64_str = base64.b64encode(image_data).decode('utf-8')
        return base64_str
    except Exception as e:
        logger.error(f"Error converting image to base64: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to process image from URL: {str(e)}")

async def scrape_clothing_images(url: str) -> List[dict]:
    """Scrape clothing images from a product URL"""
    try:
        # Better headers to avoid being blocked
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }
        
        response = requests.get(url, timeout=15, headers=headers, allow_redirects=True)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        images = []
        
        # Enhanced selectors for different clothing sites
        selectors = [
            # Generic product image selectors
            'img[class*="product"]',
            'img[class*="item"]', 
            'img[class*="main"]',
            'img[class*="hero"]',
            'img[id*="product"]',
            'img[id*="main"]',
            # Common e-commerce platforms
            'img[class*="gallery"]',
            'img[class*="zoom"]',
            'img[class*="thumbnail"]',
            'img[data-testid*="product"]',
            'img[data-cy*="product"]',
            # Fallback - all images in product containers
            '.product img',
            '.item img',
            '.gallery img',
            '[class*="product"] img',
            '[class*="item"] img'
        ]
        
        found_images = set()  # Use set to avoid duplicates
        
        # Try each selector
        for selector in selectors:
            try:
                img_tags = soup.select(selector)
                for img in img_tags[:3]:  # Limit per selector
                    src = img.get('src') or img.get('data-src') or img.get('data-lazy-src') or img.get('data-original')
                    if src and src not in found_images:
                        # Clean up the URL
                        if src.startswith('//'):
                            src = 'https:' + src
                        elif src.startswith('/'):
                            from urllib.parse import urljoin
                            src = urljoin(url, src)
                        
                        # Check if it's likely a product image
                        if (src.startswith('http') and 
                            any(keyword in src.lower() for keyword in ['product', 'item', 'clothing', 'fashion', 'model']) and
                            any(ext in src.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp'])):
                            
                            images.append({
                                'url': src,
                                'alt': img.get('alt', 'Clothing item')
                            })
                            found_images.add(src)
                            
                if len(images) >= 3:  # Stop if we have enough images
                    break
            except Exception as e:
                logger.debug(f"Selector {selector} failed: {e}")
                continue
        
        # If no specific selectors worked, try a broader approach
        if not images:
            all_imgs = soup.find_all('img')
            for img in all_imgs:
                src = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
                if src and src not in found_images:
                    if src.startswith('//'):
                        src = 'https:' + src
                    elif src.startswith('/'):
                        from urllib.parse import urljoin
                        src = urljoin(url, src)
                    
                    # Filter for likely product images
                    if (src.startswith('http') and 
                        any(ext in src.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']) and
                        not any(skip in src.lower() for skip in ['logo', 'icon', 'social', 'footer', 'header', 'nav'])):
                        
                        images.append({
                            'url': src,
                            'alt': img.get('alt', 'Clothing item')
                        })
                        found_images.add(src)
                        
                        if len(images) >= 5:  # Get more images with broad approach
                            break
        
        if not images:
            # Last resort: try to find any reasonable looking images
            all_imgs = soup.find_all('img')
            for img in all_imgs[:10]:  # Check first 10 images
                src = img.get('src') or img.get('data-src')
                if src:
                    if src.startswith('//'):
                        src = 'https:' + src
                    elif src.startswith('/'):
                        from urllib.parse import urljoin
                        src = urljoin(url, src)
                    
                    if src.startswith('http') and any(ext in src.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                        images.append({
                            'url': src,
                            'alt': img.get('alt', 'Image from page')
                        })
                        if len(images) >= 2:
                            break
        
        logger.info(f"Found {len(images)} images from {url}")
        return images
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Request error scraping {url}: {e}")
        # Return a helpful error message instead of raising
        raise HTTPException(
            status_code=400, 
            detail=f"Unable to access the website. This could be due to the site blocking automated requests. Try using a direct image upload instead."
        )
    except Exception as e:
        logger.error(f"Error scraping clothing images from {url}: {e}")
        raise HTTPException(
            status_code=400, 
            detail=f"Failed to extract images from the webpage. Try using a direct image upload instead."
        )

async def generate_virtual_tryon(person_image_b64: str, clothing_image_b64: str) -> str:
    """Generate virtual try-on using Gemini AI"""
    try:
        # Create chat instance with Emergent LLM key
        emergent_key = os.environ.get('EMERGENT_LLM_KEY')
        session_id = str(uuid.uuid4())
        
        chat = LlmChat(
            api_key=emergent_key, 
            session_id=session_id, 
            system_message="You are an AI fashion consultant specialized in virtual try-on technology. Create realistic images of people wearing different clothing items."
        )
        
        # Configure for image generation
        chat.with_model("gemini", "gemini-2.5-flash-image-preview").with_params(modalities=["image", "text"])
        
        # Create the message with both images
        msg = UserMessage(
            text="Create a realistic virtual try-on image by combining these two images: place the clothing item from the second image onto the person in the first image. Make it look natural and realistic, maintaining proper proportions, lighting, and shadows. The result should look like the person is actually wearing the clothing item.",
            file_contents=[
                ImageContent(person_image_b64),
                ImageContent(clothing_image_b64)
            ]
        )
        
        # Generate the try-on result
        text, images = await chat.send_message_multimodal_response(msg)
        
        if images and len(images) > 0:
            return images[0]['data']  # Return the first generated image
        else:
            raise HTTPException(status_code=500, detail="AI failed to generate try-on image")
            
    except Exception as e:
        logger.error(f"Error generating virtual try-on: {e}")
        raise HTTPException(status_code=500, detail=f"Virtual try-on generation failed: {str(e)}")

@api_router.post("/scrape-clothing")
async def scrape_clothing(request: ClothingScrapeRequest):
    """Scrape clothing images from a product URL"""
    try:
        images = await scrape_clothing_images(request.url)
        return {"success": True, "images": images}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Unexpected error in scrape_clothing: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/virtual-tryon")
async def virtual_tryon(request: TryOnRequest):
    """Generate virtual try-on image"""
    import time
    start_time = time.time()
    
    try:
        # Validate person image
        if not validate_image_base64(request.person_image):
            raise HTTPException(status_code=400, detail="Invalid person image format")
        
        clothing_image_b64 = None
        
        # Handle clothing input (either URL or direct image)
        if request.clothing_url and request.clothing_image:
            raise HTTPException(status_code=400, detail="Provide either clothing_url OR clothing_image, not both")
        
        if request.clothing_url:
            # Scrape images from URL and use the first one
            try:
                images = await scrape_clothing_images(request.clothing_url)
                if not images:
                    # Provide helpful fallback message
                    raise HTTPException(
                        status_code=400, 
                        detail="No suitable clothing images found at the URL. Try using a direct image upload or a different product URL."
                    )
                
                # Convert first image to base64
                clothing_image_b64 = convert_image_to_base64(images[0]['url'])
                logger.info(f"Successfully processed clothing from URL: {images[0]['url']}")
                
            except HTTPException as e:
                # Re-raise HTTP exceptions
                raise e
            except Exception as e:
                logger.error(f"Error processing clothing URL: {e}")
                raise HTTPException(
                    status_code=400, 
                    detail="Failed to process clothing from URL. The website might be blocking access or the URL might not contain suitable images. Try uploading the image directly instead."
                )
        
        elif request.clothing_image:
            if not validate_image_base64(request.clothing_image):
                raise HTTPException(status_code=400, detail="Invalid clothing image format")
            clothing_image_b64 = request.clothing_image
        else:
            raise HTTPException(status_code=400, detail="Either clothing_url or clothing_image must be provided")
        
        # Clean base64 strings
        person_clean = request.person_image
        if person_clean.startswith('data:image'):
            person_clean = person_clean.split(',')[1]
            
        clothing_clean = clothing_image_b64
        if clothing_clean.startswith('data:image'):
            clothing_clean = clothing_clean.split(',')[1]
        
        # Generate virtual try-on
        result_image_b64 = await generate_virtual_tryon(person_clean, clothing_clean)
        
        # Calculate processing time
        processing_time = f"{time.time() - start_time:.1f}s"
        
        # Create session and result
        session_id = str(uuid.uuid4())
        result = TryOnResult(
            session_id=session_id,
            person_image=request.person_image,
            clothing_image=clothing_image_b64,
            result_image=result_image_b64,
            processing_time=processing_time
        )
        
        # Save to database
        await db.tryon_results.insert_one(result.dict())
        
        return {
            "success": True,
            "result_image": f"data:image/png;base64,{result_image_b64}",
            "processing_time": processing_time,
            "session_id": session_id
        }
        
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Unexpected error in virtual_tryon: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/sessions/{session_id}")
async def get_session(session_id: str):
    """Get session results"""
    try:
        results = await db.tryon_results.find({"session_id": session_id}).to_list(100)
        
        if not results:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session_results = []
        for result in results:
            session_results.append({
                "id": result["id"],
                "result_image": f"data:image/png;base64,{result['result_image']}",
                "created_at": result["created_at"],
                "processing_time": result.get("processing_time", "Unknown")
            })
        
        return {
            "session_id": session_id,
            "created_at": results[0]["created_at"],
            "results": session_results
        }
        
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error getting session: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()