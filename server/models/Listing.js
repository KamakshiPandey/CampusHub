
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Listing = sequelize.define('Listing', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM('sell', 'rent'), defaultValue: 'sell' },
  condition: { type: DataTypes.STRING, defaultValue: 'used' },
  image: { type: DataTypes.STRING, defaultValue: '' },
  location: { type: DataTypes.STRING },
  latitude: { type: DataTypes.FLOAT, allowNull: true },
  longitude: { type: DataTypes.FLOAT, allowNull: true },
  status: { type: DataTypes.ENUM('available', 'sold', 'rented'), defaultValue: 'available' },
  viewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  lastViewMilestoneEmailed: { type: DataTypes.INTEGER, defaultValue: 0 },
  userId: { type: DataTypes.INTEGER, allowNull: false },
}, {
  timestamps: true,
});

Listing.belongsTo(User, { foreignKey: 'userId', as: 'seller' });

module.exports = Listing;
