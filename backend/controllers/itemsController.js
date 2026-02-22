const mongoose = require('mongoose');
const Item = require('../models/Item');

/**
 * GET /api/items
 * Optional query param: ?search=<string>
 * Returns full list or filtered results (case-insensitive).
 */
const getItems = async (req, res) => {
  // Guard: return 503 if MongoDB hasn't connected yet
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database not ready. Please try again in a moment.',
    });
  }

  try {
    const { search } = req.query;

    if (search !== undefined && typeof search !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid search query parameter.',
      });
    }

    let results;

    if (search && search.trim() !== '') {
      const term = search.trim();
      // Case-insensitive regex search across name, category, description
      const regex = new RegExp(term, 'i');
      results = await Item.find({
        $or: [
          { name: regex },
          { category: regex },
          { description: regex },
        ],
      }).lean();
    } else {
      results = await Item.find({}).lean();
    }

    return res.status(200).json({
      success: true,
      total: results.length,
      data: results,
    });
  } catch (error) {
    console.error('[ItemsController] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

module.exports = { getItems };
