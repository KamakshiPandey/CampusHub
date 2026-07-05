
const { User } = require('../models');

exports.submitQuiz = async (req, res) => {
  try {
    const {
      sleepSchedule, cleanliness, smoking, pets,
      studyHabits, socialLevel, guestsFrequency,
    } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update({
      sleepSchedule, cleanliness, smoking, pets,
      studyHabits, socialLevel, guestsFrequency,
      quizCompleted: true,
    });

    res.json({ message: 'Preferences saved', quizCompleted: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyQuiz = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        'sleepSchedule', 'cleanliness', 'smoking', 'pets',
        'studyHabits', 'socialLevel', 'guestsFrequency', 'quizCompleted',
      ],
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
