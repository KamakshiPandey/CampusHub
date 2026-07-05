
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validate, roommateRules } = require('../middleware/validators');
const {
  createRoommate, getRoommates, getRoommateById,
  updateRoommate, deleteRoommate,
} = require('../controllers/roommateController');

router.get('/', getRoommates);
router.get('/:id', getRoommateById);
router.post('/', protect, upload.single('image'), roommateRules, validate, createRoommate);
router.put('/:id', protect, upload.single('image'), updateRoommate);
router.delete('/:id', protect, deleteRoommate);

module.exports = router;
