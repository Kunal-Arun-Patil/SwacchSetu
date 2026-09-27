const mongoose = require('mongoose');

const scanItemSchema = new mongoose.Schema({
  objectDetected: { type: String, required: true },
  material: { type: String, required: true },
  category: { type: String, required: true },
  mappedCategory: { type: String, required: true },
  confidence: { type: Number, required: true },
  recyclable: { type: Boolean, required: true },
  condition: { type: String, default: '' },
  reason: { type: String, required: true },
  recommendation: { type: String, required: true },
  
  // Feedback / Correction tracking per item
  isCorrected: { type: Boolean, default: false },
  correctedCategory: { type: String, default: null },
  correctedMappedCategory: { type: String, default: null },
  
  // Link to pickup request if user creates one from this specific item
  pickupRequestId: { type: String, default: null }
});

const scanHistorySchema = new mongoose.Schema(
  {
    userId: { type: String, required: false },
    imageUrl: { type: String, required: true },
    isWaste: { type: Boolean, default: true },
    items: [scanItemSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('ScanHistory', scanHistorySchema);
