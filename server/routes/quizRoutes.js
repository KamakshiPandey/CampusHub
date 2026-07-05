
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { submitQuiz, getMyQuiz } = require('../controllers/quizController');

router.post('/', protect, submitQuiz);
router.get('/', protect, getMyQuiz);

module.exports = router;
