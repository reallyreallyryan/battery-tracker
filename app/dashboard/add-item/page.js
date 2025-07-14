"use client";

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function AddItem() {
  const router = useRouter();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    batteryType: 'AA',
    dateLastChanged: new Date().toISOString().split('T')[0],
    expectedDuration: 180 // Default for AA batteries
  });

  // Battery type options with expected durations (in days)
  const batteryTypes = {
    'AA': 180,
    'AAA': 120,
    '9V': 365,
    'CR2032': 730,
    'C': 300,
    'D': 400,
    'CR123A': 365,
    'Other': 180
  };

// Start camera
const startCamera = useCallback(async () => {
    console.log('🚀 START CAMERA CLICKED!');
    try {
      console.log('Setting loading to true...');
      setIsLoading(true);
      
      // Set camera active FIRST so video element gets rendered
      setIsCameraActive(true);
      
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera on mobile
        } 
      });
      
      console.log('Camera stream received:', stream);
      setCameraStream(stream);
      
      // Give React a moment to render the video element
      setTimeout(() => {
        if (videoRef.current) {
          console.log('Video element found, setting stream...');
          videoRef.current.srcObject = stream;
          console.log('Camera should be showing now!');
        } else {
          console.error('❌ Video ref still null after timeout!');
        }
      }, 100);
      
    } catch (error) {
      console.error('❌ Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
      setIsCameraActive(false); // Reset on error
    } finally {
      console.log('Setting loading to false...');
      setIsLoading(false);
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setIsCameraActive(false);
    }
  }, [cameraStream]);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to canvas
      context.drawImage(video, 0, 0);
      
      // Convert to image data
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageDataUrl);
      
      // Stop camera after capture
      stopCamera();
    }
  }, [stopCamera]);

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-update expected duration when battery type changes
      if (name === 'batteryType') {
        newData.expectedDuration = batteryTypes[value];
      }
      
      return newData;
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!capturedImage) {
      alert('Please take a photo first!');
      return;
    }
    
    if (!formData.name.trim()) {
      alert('Please enter an item name!');
      return;
    }

    setIsLoading(true);
    
    try {
        // Save to database via API
        const response = await fetch('/api/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            image: capturedImage,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to save item');
        }
        
        const result = await response.json();
        console.log('Item saved:', result);
        
        alert('Item saved successfully!');
        router.push('/dashboard');
      
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Error saving item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 pb-24 bg-gray-50">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <span>←</span> Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Device</h1>
          <div></div>
        </div>

        {/* Camera Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">📷 Take a Photo</h2>
          
          {!isCameraActive && !capturedImage && (
            <div className="text-center">
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gray-400 text-lg">📷 Camera Preview</span>
              </div>
              <button
                onClick={startCamera}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
              >
                {isLoading ? 'Starting Camera...' : 'Start Camera'}
              </button>
            </div>
          )}

          {isCameraActive && (
            <div className="text-center">
                <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 bg-black rounded-lg mb-4"
                style={{ 
                    objectFit: 'cover'
                }}
                />
              <div className="flex gap-4 justify-center">
                <button
                  onClick={capturePhoto}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg"
                >
                  📸 Capture Photo
                </button>
                <button
                  onClick={stopCamera}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="text-center">
              <img
                src={capturedImage}
                alt="Captured device"
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <button
                onClick={retakePhoto}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                📷 Retake Photo
              </button>
            </div>
          )}

          {/* Hidden canvas for photo capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-4">📝 Device Details</h2>
          
          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Device Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., TV Remote, Game Controller"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Battery Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Battery Type
            </label>
            <select
              name="batteryType"
              value={formData.batteryType}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.keys(batteryTypes).map(type => (
                <option key={type} value={type}>
                  {type} ({batteryTypes[type]} days expected life)
                </option>
              ))}
            </select>
          </div>

          {/* Date Last Changed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Last Changed
            </label>
            <input
              type="date"
              name="dateLastChanged"
              value={formData.dateLastChanged}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Expected Duration (auto-filled but editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Duration (days)
            </label>
            <input
              type="number"
              name="expectedDuration"
              value={formData.expectedDuration}
              onChange={handleInputChange}
              min="1"
              max="3650"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !capturedImage}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : '💾 Save Device'}
          </button>
        </form>
      </div>
    </main>
  );
}