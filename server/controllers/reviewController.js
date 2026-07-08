
const { Review, User, Listing } = require('../models');

const recalculateCampusScore = async (userId) => {
  const reviews = await Review.findAll({ where: { revieweeId: userId } });
  if (reviews.length === 0) return;
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const score = Math.round(avg * 20);
  await User.update({ campusScore: score }, { where: { id: userId } });
};

exports.createReview = async (req, res) => {
  try {
    const { revieweeId, listingId, rating, comment } = req.body;

    if (parseInt(revieweeId) === req.user.id) {
      return res.status(400).json({ message: 'You cannot review yourself' });
    }

    if (listingId) {
      const listing = await Listing.findByPk(listingId);
      if (!listing) return res.status(404).json({ message: 'Listing not found' });
      if (listing.status === 'available') {
        return res.status(400).json({ message: 'This transaction has not been completed yet' });
      }
      if (listing.buyerId !== req.user.id) {
        return res.status(403).json({ message: 'Only the confirmed buyer can review this transaction' });
      }
    }

    const existing = await Review.findOne({
      where: { reviewerId: req.user.id, revieweeId, listingId: listingId || null },
    });
    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this transaction' });
    }

    const review = await Review.create({
      reviewerId: req.user.id,
      revieweeId,
      listingId: listingId || null,
      rating,
      comment,
    });

    await recalculateCampusScore(revieweeId);

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

    const user = await User.findByPk(req.params.userId, { attributes: ['campusScore'] });

    res.json({
      reviews,
      avgRating: parseFloat(avgRating),
      count: reviews.length,
      campusScore: user?.campusScore || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserPublicProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      attributes: ['id', 'name', 'college', 'avatar', 'createdAt', 'campusScore'],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.checkReviewEligibility = async (req, res) => {
  try {
    const { listingId, revieweeId } = req.query;
    if (!listingId || !revieweeId) return res.json({ eligible: false });

    const listing = await Listing.findByPk(listingId);
    if (!listing || listing.status === 'available') {
      return res.json({ eligible: false, reason: 'Transaction not completed yet' });
    }
    if (listing.buyerId !== req.user.id) {
      return res.json({ eligible: false, reason: 'You were not confirmed as the buyer' });
    }

    const existing = await Review.findOne({
      where: { reviewerId: req.user.id, revieweeId, listingId },
    });
    if (existing) {
      return res.json({ eligible: false, reason: 'Already reviewed', alreadyReviewed: true });
    }

    res.json({ eligible: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
