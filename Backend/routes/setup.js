const express = require('express');
const router = express.Router();

// Placeholder - setup route
router.get('/', async (req, res) => {
  res.json({ success: true, message: 'Setup route' });
});

module.exports = router;