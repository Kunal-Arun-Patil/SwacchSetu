const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const aiService = require('../services/aiService');
const ScanHistory = require('../models/ScanHistory');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'scan-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

/**
 * POST /api/scan-waste
 * Accepts an image, calls Gemini Vision API, returns structured data
 */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Call the Gemini AI Service
    const aiResult = await aiService.classifyImage(req.file.path, req.file.mimetype);

    // If the image is not clear enough, reject cleanly
    if (!aiResult.image_quality_sufficient) {
      return res.status(400).json({ 
        error: `Image quality insufficient: ${aiResult.quality_issue}. Please upload a clearer image.` 
      });
    }

    // Map the items to schema
    const formattedItems = aiResult.items.map(item => ({
      objectDetected: item.object_detected,
      material: item.material,
      category: item.category,
      mappedCategory: item.mappedCategory,
      confidence: item.confidence,
      recyclable: item.recyclable,
      condition: item.condition,
      reason: item.reason,
      recommendation: item.recommendation
    }));

    // Identify user if token exists
    let userId = null;
    if (req.headers.authorization) {
      try {
        const jwt = require('jsonwebtoken');
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (e) {}
    }

    const scanRecord = new ScanHistory({
      userId: userId,
      imageUrl: `/uploads/${req.file.filename}`,
      isWaste: aiResult.is_waste,
      items: formattedItems
    });

    await scanRecord.save();

    res.json({
      scanId: scanRecord._id,
      isWaste: aiResult.is_waste,
      imageUrl: scanRecord.imageUrl,
      items: formattedItems
    });

  } catch (err) {
    console.error('Scan Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error during scan' });
  }
});

/**
 * POST /api/scan-waste/:scanId/item/:itemId/feedback
 * Allows user to manually correct an AI prediction
 */
router.post('/:scanId/item/:itemId/feedback', async (req, res) => {
  try {
    const { correctedCategory, correctedMappedCategory } = req.body;
    
    if (!correctedCategory || !correctedMappedCategory) {
      return res.status(400).json({ error: 'Missing correction data' });
    }

    const scan = await ScanHistory.findById(req.params.scanId);
    if (!scan) return res.status(404).json({ error: 'Scan not found' });

    const item = scan.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Item not found in scan' });

    item.isCorrected = true;
    item.correctedCategory = correctedCategory;
    item.correctedMappedCategory = correctedMappedCategory;

    await scan.save();

    res.json({ success: true, message: 'Feedback recorded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/scan-waste/history
 */
router.get('/history', async (req, res) => {
  try {
    const history = await ScanHistory.find().sort({ createdAt: -1 }).limit(50);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
