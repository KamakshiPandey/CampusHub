
const { Op } = require('sequelize');
const { Roommate, User } = require('../models');
const { calculateMatchPercentage } = require('../utils/compatibility');

exports.createRoommate = async (req, res) => {
  try {
    const { title, description, budget, location, moveInDate, genderPreference } = req.body;
    const image = req.file ? ('/uploads/' + req.file.filename) : '';

    const post = await Roommate.create({
      title, description, budget, location, moveInDate, genderPreference, image,
      userId: req.user.id,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRoommates = async (req, res) => {
  try {
    const { search, location, minBudget, maxBudget } = req.query;
    const where = { status: 'open' };

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: '%' + search + '%' } },
        { description: { [Op.like]: '%' + search + '%' } },
      ];
    }
    if (location) where.location = { [Op.like]: '%' + location + '%' };
    if (minBudget || maxBudget) {
      where.budget = {};
      if (minBudget) where.budget[Op.gte] = minBudget;
      if (maxBudget) where.budget[Op.lte] = maxBudget;
    }

    const posts = await Roommate.findAll({
      where,
      include: [{ model: User, as: 'poster', attributes: ['id', 'name', 'email', 'avatar', 'sleepSchedule', 'cleanliness', 'smoking', 'pets', 'studyHabits', 'socialLevel', 'guestsFrequency', 'quizCompleted'] }],
      order: [['createdAt', 'DESC']],
    });

    let currentUser = null;
    if (req.headers.authorization) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
        currentUser = await User.findByPk(decoded.id);
      } catch (e) {}
    }

    const postsWithMatch = posts.map((post) => {
      const plain = post.toJSON();
      if (currentUser && plain.poster) {
        plain.matchPercentage = calculateMatchPercentage(currentUser, plain.poster);
      } else {
        plain.matchPercentage = null;
      }
      return plain;
    });

    res.json(postsWithMatch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRoommateById = async (req, res) => {
  try {
    const post = await Roommate.findByPk(req.params.id, {
      include: [{ model: User, as: 'poster', attributes: ['id', 'name', 'email', 'avatar', 'sleepSchedule', 'cleanliness', 'smoking', 'pets', 'studyHabits', 'socialLevel', 'guestsFrequency', 'quizCompleted'] }],
    });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    let currentUser = null;
    if (req.headers.authorization) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
        currentUser = await User.findByPk(decoded.id);
      } catch (e) {}
    }

    const plain = post.toJSON();
    plain.matchPercentage = currentUser ? calculateMatchPercentage(currentUser, plain.poster) : null;

    res.json(plain);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRoommate = async (req, res) => {
  try {
    const post = await Roommate.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const updates = req.body;
    if (req.file) updates.image = '/uploads/' + req.file.filename;

    await post.update(updates);
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRoommate = async (req, res) => {
  try {
    const post = await Roommate.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await post.destroy();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
