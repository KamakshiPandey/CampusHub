
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { createReview, getReviewsForUser, getUserPublicProfile } = require('../controllers/reviewController');

router.post('/', protect, createReview);
router.get('/user/:userId', getReviewsForUser);
router.get('/profile/:userId', getUserPublicProfile);

module.exports = router;
