import mongoose from "mongoose";

const DetectionLogSchema = new mongoose.Schema({
  // Session tracking
  sessionId: { 
    type: String, 
    required: true,
    index: true 
  },
  userId: { 
    type: String,
    index: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  
  // What COCO-SSD detected
  cocoDetections: [{
    class: String,
    score: Number
  }],
  
  // What user actually selected
  userSelection: {
    deviceType: String,         // Value from dropdown
    deviceLabel: String,        // Display name
    wasFromAI: Boolean,         // Did they pick an AI suggestion?
    manualEntry: Boolean,       // Did they skip photo entirely?
    aiSuggestionMatched: Boolean // Did AI correctly predict their choice?
  },
  
  // Performance metrics
  performance: {
    inferenceTime: Number,      // How long COCO took (ms)
    modelLoadTime: Number,      // Time to load model (ms)
    imageSize: {
      width: Number,
      height: Number
    }
  },
  
  // Device context
  deviceInfo: {
    userAgent: String,
    isMobile: Boolean
  }
});

// Indexes for common queries
DetectionLogSchema.index({ timestamp: -1 });
DetectionLogSchema.index({ 'userSelection.deviceType': 1 });
DetectionLogSchema.index({ 'userSelection.aiSuggestionMatched': 1 });

// Don't export as default to match other models
export default mongoose.models.DetectionLog || mongoose.model("DetectionLog", DetectionLogSchema);