
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Roommate = sequelize.define('Roommate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  budget: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  moveInDate: {
    type: DataTypes.DATEONLY,
  },
  genderPreference: {
    type: DataTypes.STRING,
    defaultValue: 'any',
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  status: {
    type: DataTypes.ENUM('open', 'closed'),
    defaultValue: 'open',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

Roommate.belongsTo(User, { foreignKey: 'userId', as: 'poster' });

module.exports = Roommate;
