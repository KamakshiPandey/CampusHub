
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getOrCreateChat, getMyChats, getMessages, sendMessage,
} = require('../controllers/chatController');

router.post('/', protect, getOrCreateChat);
router.get('/', protect, getMyChats);
router.get('/:chatId/messages', protect, getMessages);
router.post('/message', protect, sendMessage);

module.exports = router;