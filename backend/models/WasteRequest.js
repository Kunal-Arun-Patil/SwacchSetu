const mongoose = require('mongoose');

const wasteRequestSchema = new mongoose.Schema(
  {
    requestId: { type: String, unique: true, required: true },
    userName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    wasteCategory: {
      type: String,
      required: true,
      enum: ['Organic', 'Recyclable', 'E-Waste', 'Hazardous', 'General'],
    },
    quantity: { type: String, required: true }, // e.g. "2-3 bags"
    preferredDate: { type: String, required: true },
    preferredTime: { type: String, required: true },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Scheduled', 'In Progress', 'Collected', 'Cancelled'],
      default: 'Pending',
    },
    collectorNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

// Index for fast queries
wasteRequestSchema.index({ phone: 1 });
wasteRequestSchema.index({ status: 1 });
wasteRequestSchema.index({ wasteCategory: 1 });
wasteRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('WasteRequest', wasteRequestSchema);
