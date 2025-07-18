"use client";

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';

export default function AddItem() {
  const router = useRouter();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Simplified form data - just device type, room, name, and date
  const [formData, setFormData] = useState({
    name: '',
    deviceType: '',
    room: '',
    dateLastChanged: new Date().toISOString().split('T')[0],
    expectedDuration: 365 // Will auto-update based on device type
  });

  // Single device types array - much simpler!
  const deviceTypes = [
    // Safety Devices
    { value: 'smoke_detector', label: '🔥 Smoke Detector', duration: 365, category: 'safety' },
    { value: 'carbon_monoxide_detector', label: '💨 Carbon Monoxide Detector', duration: 365, category: 'safety' },
    
    // HVAC & Filters
    { value: 'ac_filter', label: '🌬️ AC Filter', duration: 90, category: 'hvac' },
    { value: 'furnace_filter', label: '🏠 Furnace Filter', duration: 180, category: 'hvac' },
    { value: 'air_purifier_filter', label: '💨 Air Filter', duration: 180, category: 'hvac' },
    
    // Electronics & Remotes
    { value: 'tv_remote', label: '📺 Remote', duration: 540, category: 'battery' },
    { value: 'wireless_mouse', label: '🖱️ Wireless Mouse', duration: 540, category: 'battery' },
    { value: 'garage_door_remote', label: '🚗 Garage Door Remote', duration: 730, category: 'battery' },
    
    // Appliances
    { value: 'dishwasher_filter', label: '🍽️ Dishwasher Filter', duration: 180, category: 'appliance' },
    { value: 'refrigerator_filter', label: '❄️ Refrigerator Filter', duration: 180, category: 'appliance' },
    { value: 'dryer_vent', label: '👕 Dryer Vent', duration: 365, category: 'appliance' },
    
    // Other Common Items
    { value: 'flashlight', label: '🔦 Flashlight', duration: 180, category: 'battery' },
    { value: 'other', label: '📦 Other Device', duration: 365, category: 'other' }
  ];

  // Rooms array (same as before)
  const rooms = [
    { value: 'kitchen', label: '🍳 Kitchen' },
    { value: 'living_room', label: '🛋️ Living Room' },
    { value: 'bedroom', label: '🛏️ Bedroom' },
    { value: 'bathroom', label: '🚿 Bathroom' },
    { value: 'basement', label: '🏠 Basement' },
    { value: 'garage', label: '🚗 Garage' },
    { value: 'office', label: '💻 Office' },
    { value: 'dining_room', label: '🍽️ Dining Room' },
    { value: 'laundry_room', label: '🧺 Laundry Room' },
    { value: 'attic', label: '📦 Attic' },
    { value: 'outdoor', label: '🌳 Outdoor' },
    { value: 'other', label: '📍 Other' }
  ];

  // Start camera (same as before)
  const startCamera = useCallback(async () => {
    console.log('🚀 START CAMERA CLICKED!');
    try {
      console.log('Setting loading to true...');
      setIsLoading(true);
      
      setIsCameraActive(true);
      
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment'
        } 
      });
      
      console.log('Camera stream received:', stream);
      setCameraStream(stream);
      
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
      setIsCameraActive(false);
    } finally {
      console.log('Setting loading to false...');
      setIsLoading(false);
    }
  }, []);

  // Stop camera (same as before)
  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setIsCameraActive(false);
    }
  }, [cameraStream]);

  // Capture photo (same as before)
  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0);
      
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageDataUrl);
      
      stopCamera();
    }
  }, [stopCamera]);

  // Retake photo (same as before)
  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Handle form input changes - SIMPLIFIED!
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-update duration when device type changes
      if (name === 'deviceType') {
        const selectedDevice = deviceTypes.find(d => d.value === value);
        if (selectedDevice) {
          newData.expectedDuration = selectedDevice.duration;
        }
      }
      
      return newData;
    });
  };

  const analyzePhoto = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    try {
      console.log('Loading EfficientDet model...');
      
      // Load EfficientDet D0 model (fastest one)
      const modelUrl = 'https://tfhub.dev/tensorflow/efficientdet/d0/1';
      const model = await tf.loadGraphModel(modelUrl, {fromTFHub: true});
      
      // Create image element from captured photo
      const img = new Image();
      img.onload = async () => {
        console.log('Analyzing image with EfficientDet...');
        
        // Preprocess image for EfficientDet
        const tensor = tf.browser.fromPixels(img)
          .resizeNearestNeighbor([512, 512]) // EfficientDet D0 input size
          .expandDims(0)
          .div(255.0);
        
        // Run prediction
        const predictions = await model.predict(tensor).data();
        console.log('EfficientDet predictions:', predictions);
        
        // For now, let's just see what we get
        setDetectedObjects([{class: 'EfficientDet result', score: 0.99}]);
        
        tensor.dispose();
      };
      img.src = capturedImage;
      
    } catch (error) {
      console.error('Error with EfficientDet:', error);
      alert('Error analyzing photo with EfficientDet');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit form - updated for new structure
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

    if (!formData.deviceType) {
      alert('Please select a device type!');
      return;
    }

    if (!formData.room) {
      alert('Please select a room!');
      return;
    }

    setIsLoading(true);
    
    try {
      // Get device info for API compatibility
      const selectedDevice = deviceTypes.find(d => d.value === formData.deviceType);
      
      // Prepare data for your existing API
      const apiData = {
        name: formData.name,
        room: formData.room,
        dateLastChanged: formData.dateLastChanged,
        expectedDuration: formData.expectedDuration,
        image: capturedImage,
        
        // Map to your existing API structure
        category: selectedDevice?.category || 'other',
        itemType: formData.deviceType,
        
        // For backward compatibility
        ...(selectedDevice?.category === 'battery' && {
          batteryType: formData.deviceType
        }),
        ...(selectedDevice?.category !== 'battery' && {
          maintenanceType: formData.deviceType
        })
      };

      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
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
    <main className="min-h-screen p-4 pb-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <span>←</span> Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Item</h1>
          <div></div>
        </div>

        {/* Camera Section - SAME AS BEFORE */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">📷 Take a Photo</h2>
          
          {!isCameraActive && !capturedImage && (
            <div className="text-center">
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gray-400 text-lg">📷 Camera Preview</span>
              </div>
              <button
                onClick={startCamera}
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
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
              <div className="flex gap-2 justify-center mb-4">
                <button
                  onClick={retakePhoto}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  📷 Retake Photo
                </button>
                <button
                  onClick={analyzePhoto}
                  disabled={isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
                >
                  {isAnalyzing ? 'Analyzing...' : '🔍 Analyze Photo'}
                </button>
              </div>
              
              {detectedObjects.length > 0 && (
                <div className="text-left bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">🤖 AI Detected:</h3>
                  {detectedObjects.map((obj, index) => (
                    <div key={index} className="text-sm">
                      {obj.class} ({Math.round(obj.score * 100)}% confident)
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/* SIMPLIFIED FORM - The magic happens here! */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold mb-4">📝 Item Details</h2>
          
          {/* SINGLE DEVICE DROPDOWN - Replaces category + type complexity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What device is this? *
            </label>
            <select
              name="deviceType"
              value={formData.deviceType}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select device type</option>
              {deviceTypes.map(device => (
                <option key={device.value} value={device.value}>
                  {device.label} ({device.duration} days)
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Expected lifespan is automatically set based on device type
            </p>
          </div>

          {/* Room Selection - Same as before */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Which room? *
            </label>
            <select
              name="room"
              value={formData.room}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select room</option>
              {rooms.map(room => (
                <option key={room.value} value={room.value}>
                  {room.label}
                </option>
              ))}
            </select>
          </div>

          {/* Item Name - Improved placeholders */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name this item *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={
                formData.deviceType === 'smoke_detector' ? 'e.g., Kitchen Smoke Detector' :
                formData.deviceType === 'tv_remote' ? 'e.g., Living Room TV Remote' :
                formData.deviceType === 'ac_filter' ? 'e.g., Main Floor AC Filter' :
                formData.deviceType === 'dishwasher_filter' ? 'e.g., Kitchen Dishwasher Filter' :
                'e.g., Living Room Game Controller'
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Give it a name you&apos;ll recognize (include room if helpful)
            </p>
          </div>

          {/* Date Last Changed - Same as before */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              When did you last change/service this? *
            </label>
            <input
              type="date"
              name="dateLastChanged"
              value={formData.dateLastChanged}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Expected Duration - Auto-filled, editable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected lifespan (days)
            </label>
            <input
              type="number"
              name="expectedDuration"
              value={formData.expectedDuration}
              onChange={handleInputChange}
              min="1"
              max="3650"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Automatically set based on device type, but you can adjust it
            </p>
          </div>

          {/* Submit Button - Same as before */}
          <button
            type="submit"
            disabled={isLoading || !capturedImage}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : '💾 Save Item'}
          </button>
        </form>
      </div>
    </main>
  );
}