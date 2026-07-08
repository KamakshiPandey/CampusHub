
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  college: { type: DataTypes.STRING },
  avatar: { type: DataTypes.STRING, defaultValue: '' },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
  isBanned: { type: DataTypes.BOOLEAN, defaultValue: false },

  sleepSchedule: { type: DataTypes.ENUM('early_bird', 'night_owl', 'flexible'), allowNull: true },
  cleanliness: { type: DataTypes.ENUM('very_tidy', 'moderate', 'relaxed'), allowNull: true },
  smoking: { type: DataTypes.ENUM('non_smoker', 'smoker', 'no_preference'), allowNull: true },
  pets: { type: DataTypes.ENUM('has_pets', 'no_pets', 'okay_with_pets'), allowNull: true },
  studyHabits: { type: DataTypes.ENUM('silent_study', 'music_ok', 'group_study'), allowNull: true },
  socialLevel: { type: DataTypes.ENUM('introvert', 'balanced', 'extrovert'), allowNull: true },
  guestsFrequency: { type: DataTypes.ENUM('rarely', 'sometimes', 'often'), allowNull: true },
  quizCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  timestamps: true,
});

module.exports = User;
