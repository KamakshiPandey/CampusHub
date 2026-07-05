
const sequelize = require('../config/db');
const User = require('./User');
const Listing = require('./Listing');
const Roommate = require('./Roommate');
const Chat = require('./Chat');
const Message = require('./Message');
const Review = require('./Review');

Chat.belongsTo(User, { foreignKey: 'user1Id', as: 'user1' });
Chat.belongsTo(User, { foreignKey: 'user2Id', as: 'user2' });
Chat.hasMany(Message, { foreignKey: 'chatId', as: 'messages' });
Message.belongsTo(Chat, { foreignKey: 'chatId' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

const syncModels = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully.');
    await sequelize.sync({ alter: true });
    console.log('Models synced.');
  } catch (err) {
    console.error('DB connection error:', err);
  }
};

module.exports = { sequelize, User, Listing, Roommate, Chat, Message, Review, syncModels };
