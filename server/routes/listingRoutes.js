
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validate, listingRules } = require('../middleware/validators');
const {
  createListing, getListings, getListingById,
  updateListing, deleteListing, getMyListings, getSuggestions,
} = require('../controllers/listingController');

router.get('/', getListings);
router.get('/mine', protect, getMyListings);
router.get('/suggestions', getSuggestions);
router.get('/:id', getListingById);
router.post('/', protect, upload.single('image'), listingRules, validate, createListing);
router.put('/:id', protect, upload.single('image'), updateListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;
