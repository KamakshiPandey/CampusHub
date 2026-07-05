
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const {
  getAllUsers, toggleBanUser, deleteUser,
  getAllListings, deleteAnyListing,
  getAllRoommatePosts, deleteAnyRoommatePost,
  getStats,
} = require('../controllers/adminController');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/ban', toggleBanUser);
router.delete('/users/:id', deleteUser);
router.get('/listings', getAllListings);
router.delete('/listings/:id', deleteAnyListing);
router.get('/roommates', getAllRoommatePosts);
router.delete('/roommates/:id', deleteAnyRoommatePost);

module.exports = router;
