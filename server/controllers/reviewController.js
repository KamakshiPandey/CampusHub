
const { Review, User } = require('../models');

exports.createReview = async (req, res) => {
  try {
    const { revieweeId, listingId, rating, comment } = req.body;

    if (parseInt(revieweeId) === req.user.id) {
      return res.status(400).json({ message: 'You cannot review yourself' });
    }

    const existing = await Review.findOne({
      where: { reviewerId: req.user.id, revieweeId, listingId: listingId || null },
    });
    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this user for this listing' });
    }

    const review = await Review.create({
      reviewerId: req.user.id,
      revieweeId,
      listingId: listingId || null,
      rating,
      comment,
    });

    const fullReview = await Review.findByPk(review.id, {
      include: [{ model: User, as: 'reviewer', attributes: ['id', 'name', 'avatar'] }],
    });

    res.status(201).json(fullReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReviewsForUser = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { revieweeId: req.params.userId },
      include: [{ model: User, as: 'reviewer', attributes: ['id', 'name', 'avatar'] }],
      order: [['createdAt', 'DESC']],
    });

    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.json({ reviews, avgRating: parseFloat(avgRating), count: reviews.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserPublicProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      attributes: ['id', 'name', 'college', 'avatar', 'createdAt'],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
