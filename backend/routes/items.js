const express = require('express');
const { getItems } = require('../controllers/itemsController');

const router = express.Router();

// GET /api/items?search=<optional>
router.get('/', getItems);

module.exports = router;
