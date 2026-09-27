const express = require('express');
const { v4: uuidv4 } = require('uuid');
const WasteRequest = require('../models/WasteRequest');
const router = express.Router();

/**
 * POST /api/requests
 * Create a new pickup request
 */
router.post('/', async (req, res) => {
  try {
    const { userName, phone, address, wasteCategory, quantity, preferredDate, preferredTime, notes } = req.body;

    if (!userName || !phone || !address || !wasteCategory || !quantity || !preferredDate || !preferredTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const requestId = 'ECO-' + uuidv4().substring(0, 8).toUpperCase();

    const request = new WasteRequest({
      requestId,
      userName,
      phone,
      address,
      wasteCategory,
      quantity,
      preferredDate,
      preferredTime,
      notes: notes || '',
      status: 'Pending',
    });

    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/requests
 * List all requests with optional filters: ?status=&category=&search=&phone=&startDate=&endDate=
 */
router.get('/', async (req, res) => {
  try {
    const { status, category, search, phone, startDate, endDate } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.wasteCategory = category;
    if (phone) filter.phone = phone;

    if (startDate || endDate) {
      filter.preferredDate = {};
      if (startDate) filter.preferredDate.$gte = startDate;
      if (endDate) filter.preferredDate.$lte = endDate;
    }

    if (search) {
      filter.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { requestId: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const requests = await WasteRequest.find(filter).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/requests/:id
 * Get a single request by MongoDB _id or requestId
 */
router.get('/:id', async (req, res) => {
  try {
    const request =
      await WasteRequest.findById(req.params.id).catch(() => null) ||
      await WasteRequest.findOne({ requestId: req.params.id });

    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /api/requests/:id/status
 * Update status and optional collector notes
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, collectorNotes } = req.body;
    const validStatuses = ['Pending', 'Scheduled', 'In Progress', 'Collected', 'Cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const update = { status };
    if (collectorNotes !== undefined) update.collectorNotes = collectorNotes;

    const request = await WasteRequest.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );

    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
