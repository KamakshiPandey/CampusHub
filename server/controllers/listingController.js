
const { Op } = require('sequelize');
const { Listing, User, Chat } = require('../models');
const sendEmail = require('../utils/mailer');

exports.createListing = async (req, res) => {
  try {
    const { title, description, price, category, type, condition, location, latitude, longitude } = req.body;
    const image = req.file ? ('/uploads/' + req.file.filename) : '';

    const listing = await Listing.create({
      title, description, price, category, type, condition, location, image,
      latitude: latitude || null, longitude: longitude || null,
      userId: req.user.id,
    });

    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json([]);
    const listings = await Listing.findAll({
      where: { title: { [Op.like]: '%' + q + '%' }, status: 'available' },
      attributes: ['id', 'title', 'category'],
      limit: 6,
    });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getListings = async (req, res) => {
  try {
    const { search, category, type, minPrice, maxPrice, sort } = req.query;
    const where = { status: 'available' };

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: '%' + search + '%' } },
        { description: { [Op.like]: '%' + search + '%' } },
      ];
    }
    if (category) where.category = category;
    if (type) where.type = type;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    let order = [['createdAt', 'DESC']];
    if (sort === 'price_asc') order = [['price', 'ASC']];
    else if (sort === 'price_desc') order = [['price', 'DESC']];
    else if (sort === 'oldest') order = [['createdAt', 'ASC']];

    const listings = await Listing.findAll({
      where,
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'email', 'avatar'] }],
      order,
    });

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id, {
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'email', 'avatar'] }],
    });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    listing.viewCount += 1;
    await listing.save();

    const milestones = [10, 25, 50, 100, 250, 500];
    const nextMilestone = milestones.find((m) => listing.viewCount >= m && listing.lastViewMilestoneEmailed < m);
    if (nextMilestone && listing.seller?.email) {
      listing.lastViewMilestoneEmailed = nextMilestone;
      await listing.save();
      sendEmail(
        listing.seller.email,
        'Your listing is getting attention!',
        '<h2>Great news, ' + listing.seller.name + '!</h2><p>Your listing "<strong>' + listing.title + '</strong>" has reached <strong>' + nextMilestone + ' views</strong>.</p>'
      );
    }

    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPotentialBuyers = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const chats = await Chat.findAll({
      where: { listingId: listing.id },
      include: [
        { model: User, as: 'user1', attributes: ['id', 'name', 'avatar'] },
        { model: User, as: 'user2', attributes: ['id', 'name', 'avatar'] },
      ],
    });

    const buyers = chats.map((chat) => {
      return chat.user1Id === req.user.id ? chat.user2 : chat.user1;
    });

    res.json(buyers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markAsSold = async (req, res) => {
  try {
    const { buyerId } = req.body;
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    listing.status = listing.type === 'rent' ? 'rented' : 'sold';
    listing.buyerId = buyerId || null;
    await listing.save();

    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const updates = req.body;
    if (req.file) updates.image = '/uploads/' + req.file.filename;

    await listing.update(updates);
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    await listing.destroy();
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyListings = async (req, res) => {
  try {
    const listings = await Listing.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
