const express = require('express');
const WasteRequest = require('../models/WasteRequest');
const ScanHistory = require('../models/ScanHistory');
const router = express.Router();

/**
 * GET /api/stats
 * Returns aggregated analytics for the admin dashboard
 */
router.get('/stats', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [totalCount, pendingCount, collectedTodayCount, byCategory, byStatus, last14Days, aiTotalScans, aiByCategory, aiCorrections] =
      await Promise.all([
        // Total requests
        WasteRequest.countDocuments(),

        // Pending requests
        WasteRequest.countDocuments({ status: 'Pending' }),

        // Collected today
        WasteRequest.countDocuments({ status: 'Collected', preferredDate: today }),

        // Breakdown by category
        WasteRequest.aggregate([
          { $group: { _id: '$wasteCategory', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),

        // Breakdown by status
        WasteRequest.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),

        // Requests created per day for the last 14 days
        WasteRequest.aggregate([
          {
            $match: {
              createdAt: { $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        
        // AI Total Scans
        ScanHistory.countDocuments(),
        
        // AI Scans by Category (unwinding items)
        ScanHistory.aggregate([
          { $unwind: '$items' },
          { $group: { _id: '$items.category', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        
        // AI Accuracy / Corrections
        ScanHistory.aggregate([
          { $unwind: '$items' },
          { $match: { 'items.isCorrected': true } },
          { $group: { 
              _id: { original: '$items.category', corrected: '$items.correctedCategory' }, 
              count: { $sum: 1 } 
          }},
          { $sort: { count: -1 } }
        ])
      ]);

    // Find most common category
    const mostCommonCategory = byCategory[0]?._id || 'N/A';

    res.json({
      total: totalCount,
      pending: pendingCount,
      collectedToday: collectedTodayCount,
      mostCommonCategory,
      byCategory: byCategory.map((c) => ({ name: c._id, count: c.count })),
      byStatus: byStatus.map((s) => ({ name: s._id, count: s.count })),
      last14Days: last14Days.map((d) => ({ date: d._id, count: d.count })),
      aiStats: {
        totalScans: aiTotalScans,
        byCategory: aiByCategory.map((c) => ({ name: c._id, count: c.count })),
        corrections: aiCorrections.map(c => ({
          original: c._id.original,
          corrected: c._id.corrected,
          count: c.count
        }))
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
