# TryOnAI Backend Implementation Contracts

## API Contracts

### 1. Virtual Try-On Endpoint
**POST /api/virtual-tryon**
```json
Request:
{
  "person_image": "base64_encoded_image",  // User's photo
  "clothing_url": "https://example.com/shirt.jpg",  // Optional: clothing image URL
  "clothing_image": "base64_encoded_image"  // Optional: direct clothing image
}

Response:
{
  "success": true,
  "result_image": "base64_encoded_result",
  "processing_time": "3.2s",
  "session_id": "uuid-string"
}
```

### 2. Session Management
**GET /api/sessions/{session_id}**
```json
Response:
{
  "session_id": "uuid-string",
  "created_at": "timestamp",
  "results": [
    {
      "id": "result-uuid",
      "result_image": "base64_encoded_result",
      "created_at": "timestamp"
    }
  ]
}
```

### 3. Image Scraping for Clothing URLs
**POST /api/scrape-clothing**
```json
Request:
{
  "url": "https://store.com/product/shirt"
}

Response:
{
  "success": true,
  "images": [
    {
      "url": "https://store.com/images/shirt1.jpg",
      "alt": "Blue cotton shirt"
    }
  ]
}
```

## Mock Data Replacement

### Frontend Mock Data to Replace:
1. **Landing Page**: Keep existing mock data for marketing sections
2. **New Try-On Page**: Replace with actual API calls to backend
3. **Results Display**: Replace with real AI-generated images from nanobanana

## Backend Implementation Plan

### 1. AI Integration
- **nanobanana API**: Use for virtual try-on generation
- **Image Processing**: Handle base64 encoding/decoding
- **Web Scraping**: Extract clothing images from product URLs

### 2. Database Models
```python
# Session model
class TryOnSession:
    session_id: str
    created_at: datetime
    
# Try-On Result model  
class TryOnResult:
    id: str
    session_id: str
    person_image: str  # base64
    clothing_image: str  # base64
    result_image: str  # base64 from nanobanana
    created_at: datetime
```

### 3. File Upload Handling
- Accept images up to 10MB
- Convert to base64 for nanobanana API
- Validate image formats (JPEG, PNG)

## Frontend-Backend Integration

### 1. New Try-On Page Routes
- `/tryon` - Main virtual try-on interface
- `/results/{session_id}` - View try-on results

### 2. Frontend Components to Create
- `TryOnPage.jsx` - Main try-on interface
- `ImageUploader.jsx` - Handle person image upload
- `ClothingSelector.jsx` - Handle clothing URL/image input
- `ResultsDisplay.jsx` - Show AI-generated results
- `SessionManager.jsx` - Manage user sessions

### 3. API Integration Points
- Replace mock data with actual API calls
- Add loading states for AI processing
- Handle error states and retry logic
- Add progress indicators for AI generation

## Required Dependencies

### Backend
- `requests` - For nanobanana API calls and web scraping
- `beautifulsoup4` - For clothing image scraping
- `pillow` - For image processing
- `base64` - For image encoding/decoding

### Frontend  
- File upload components
- Progress indicators
- Image preview components
- Session state management