
const { Op } = require('sequelize');
const { Chat, Message, User } = require('../models');

exports.getOrCreateChat = async (req, res) => {
  try {
    const { otherUserId, listingId, roommateId } = req.body;
    const myId = req.user.id;

    let chat = await Chat.findOne({
      where: {
        [Op.or]: [
          { user1Id: myId, user2Id: otherUserId },
          { user1Id: otherUserId, user2Id: myId },
        ],
      },
    });

    if (!chat) {
      chat = await Chat.create({
        user1Id: myId,
        user2Id: otherUserId,
        listingId: listingId || null,
        roommateId: roommateId || null,
      });
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyChats = async (req, res) => {
  try {
    const myId = req.user.id;
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [{ user1Id: myId }, { user2Id: myId }],
      },
      include: [
        { model: User, as: 'user1', attributes: ['id', 'name', 'avatar'] },
        { model: User, as: 'user2', attributes: ['id', 'name', 'avatar'] },
      ],
      order: [['updatedAt', 'DESC']],
    });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { chatId: req.params.chatId },
      include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] }],
      order: [['createdAt', 'ASC']],
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const message = await Message.create({
      chatId,
      senderId: req.user.id,
      content,
    });
    const fullMessage = await Message.findByPk(message.id, {
      include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] }],
    });
    res.status(201).json(fullMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
