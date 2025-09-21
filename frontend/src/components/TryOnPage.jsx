import React, { useState } from "react";
import { ArrowLeft, Upload, Camera, Link, Wand2, Download, Share2, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TryOnPage = () => {
  const [personImage, setPersonImage] = useState(null);
  const [clothingInput, setClothingInput] = useState("");
  const [clothingImage, setClothingImage] = useState(null);
  const [inputType, setInputType] = useState("url"); // 'url' or 'upload'
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [processingTime, setProcessingTime] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePersonImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPersonImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClothingImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setClothingImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!personImage) {
      toast({
        title: "Missing person image",
        description: "Please upload your photo first.",
        variant: "destructive",
      });
      return;
    }

    if (inputType === "url" && !clothingInput.trim()) {
      toast({
        title: "Missing clothing URL",
        description: "Please enter a clothing product URL.",
        variant: "destructive",
      });
      return;
    }

    if (inputType === "upload" && !clothingImage) {
      toast({
        title: "Missing clothing image",
        description: "Please upload a clothing image.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const requestData = {
        person_image: personImage,
      };

      if (inputType === "url") {
        requestData.clothing_url = clothingInput.trim();
      } else {
        requestData.clothing_image = clothingImage;
      }

      const response = await axios.post(`${API}/virtual-tryon`, requestData);

      if (response.data.success) {
        setResult(response.data.result_image);
        setProcessingTime(response.data.processing_time);
        
        toast({
          title: "Success!",
          description: `Virtual try-on generated in ${response.data.processing_time}`,
        });
      } else {
        throw new Error("Generation failed");
      }
    } catch (error) {
      console.error("Generation error:", error);
      
      let errorMessage = "Failed to generate virtual try-on. Please try again.";
      
      // Provide specific error messages based on the error
      if (error.response?.status === 400) {
        const detail = error.response?.data?.detail || "";
        if (detail.includes("clothing images found")) {
          errorMessage = "Could not find clothing images at this URL. Try:\n• Using a direct product page URL\n• Uploading the clothing image directly\n• Using a different retailer's website";
        } else if (detail.includes("blocking")) {
          errorMessage = "This website is blocking our requests. Please:\n• Upload the clothing image directly instead\n• Try a different product URL";
        } else if (detail.includes("Invalid")) {
          errorMessage = "Invalid image format. Please upload a clear JPG or PNG image.";
        } else {
          errorMessage = detail || errorMessage;
        }
      }
      
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      const link = document.createElement('a');
      link.href = result;
      link.download = `tryon-result-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (navigator.share && result) {
      try {
        // Convert base64 to blob for sharing
        const response = await fetch(result);
        const blob = await response.blob();
        const file = new File([blob], `tryon-result-${Date.now()}.png`, { type: 'image/png' });

        await navigator.share({
          title: 'My Virtual Try-On Result',
          text: 'Check out my virtual try-on result from TryOnAI!',
          files: [file]
        });
      } catch (error) {
        // Fallback to copying the image URL
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Share link copied to clipboard.",
        });
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Virtual Try-On Studio</h1>
            <p className="text-gray-600 mt-2">Upload your photo and see how clothes look on you instantly</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Person Image Upload */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Camera className="h-5 w-5 text-purple-600" />
                  <Label className="text-lg font-semibold">Upload Your Photo</Label>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  {personImage ? (
                    <div className="space-y-4">
                      <img 
                        src={personImage} 
                        alt="Your photo" 
                        className="w-40 h-40 object-cover rounded-lg mx-auto"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => setPersonImage(null)}
                        size="sm"
                      >
                        Change Photo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <Label htmlFor="person-upload" className="cursor-pointer">
                          <span className="text-purple-600 hover:text-purple-700 font-medium">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </Label>
                        <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                      </div>
                      <Input
                        id="person-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePersonImageUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Clothing Input */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Wand2 className="h-5 w-5 text-purple-600" />
                  <Label className="text-lg font-semibold">Choose Clothing</Label>
                </div>

                {/* Input Type Selector */}
                <div className="flex space-x-4">
                  <Button
                    variant={inputType === "url" ? "default" : "outline"}
                    onClick={() => setInputType("url")}
                    size="sm"
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Product URL
                  </Button>
                  <Button
                    variant={inputType === "upload" ? "default" : "outline"}
                    onClick={() => setInputType("upload")}
                    size="sm"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </div>

                {inputType === "url" ? (
                  <div className="space-y-2">
                    <Input
                      placeholder="https://www.uniqlo.com/us/en/products/E467024-000/00"
                      value={clothingInput}
                      onChange={(e) => setClothingInput(e.target.value)}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500">
                      Paste a link to any clothing product. Works best with: Uniqlo, Target, Walmart. If it doesn't work, try uploading the image directly.
                    </p>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                    {clothingImage ? (
                      <div className="space-y-4">
                        <img 
                          src={clothingImage} 
                          alt="Clothing item" 
                          className="w-32 h-32 object-cover rounded-lg mx-auto"
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => setClothingImage(null)}
                          size="sm"
                        >
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                        <div>
                          <Label htmlFor="clothing-upload" className="cursor-pointer">
                            <span className="text-purple-600 hover:text-purple-700 font-medium">
                              Upload clothing image
                            </span>
                          </Label>
                          <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                        </div>
                        <Input
                          id="clothing-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleClothingImageUpload}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 text-lg font-semibold rounded-lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating Your Try-On...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5 mr-2" />
                  Generate Virtual Try-On
                </>
              )}
            </Button>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Your Virtual Try-On</Label>
                  {processingTime && (
                    <span className="text-sm text-gray-500">Generated in {processingTime}</span>
                  )}
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
                  {isProcessing ? (
                    <div className="space-y-4">
                      <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto" />
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-700">Generating your virtual try-on...</p>
                        <p className="text-sm text-gray-500">This may take a few seconds</p>
                      </div>
                    </div>
                  ) : result ? (
                    <div className="space-y-4 w-full">
                      <img 
                        src={result} 
                        alt="Virtual try-on result" 
                        className="max-w-full max-h-96 object-contain mx-auto rounded-lg shadow-lg"
                      />
                      <div className="flex space-x-4 justify-center">
                        <Button
                          onClick={handleDownload}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          onClick={handleShare}
                          variant="outline"
                          size="sm"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                        <Wand2 className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-700">Ready to see the magic?</p>
                        <p className="text-sm text-gray-500">Upload your photo and choose clothing to get started</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900">💡 Tips for best results:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use clear, well-lit photos with good contrast</li>
                  <li>• Face the camera directly for better fitting</li>
                  <li>• For URLs: Use direct product pages (not search results)</li>
                  <li>• If URL fails: Save the clothing image and upload directly</li>
                  <li>• Avoid busy backgrounds in your photos</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryOnPage;