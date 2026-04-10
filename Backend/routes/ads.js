const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Ad = require('../models/Ad');
const auth = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all active ads (public)
router.get('/', async (req, res) => {
  try {
    const ads = await Ad.find({ active: true }).sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).send('Server error');
  }
});
 
// POST new ad (admin only)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, link } = req.body;
    let image = '', imagePublicId = '';

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'ohanze-ads' },
          (error, result) => error ? reject(error) : resolve(result)
        ).end(req.file.buffer);
      });
      image = result.secure_url;
      imagePublicId = result.public_id;
    }

    const ad = new Ad({ title, description, image, link, imagePublicId });
    await ad.save();
    res.json({ success: true, ad });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// DELETE ad (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: 'Ad not found' });
    if (ad.imagePublicId) await cloudinary.uploader.destroy(ad.imagePublicId);
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;