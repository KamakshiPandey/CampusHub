
const { Message, User, Chat } = require('../models');
const sendEmail = require('../utils/mailer');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinChat', (chatId) => {
      socket.join('chat_' + chatId);
    });

    socket.on('sendMessage', async (data) => {
      try {
        const { chatId, senderId, content } = data;
        const message = await Message.create({ chatId, senderId, content });
        const fullMessage = await Message.findByPk(message.id, {
          include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] }],
        });
        io.to('chat_' + chatId).emit('newMessage', fullMessage);

        const chat = await Chat.findByPk(chatId);
        if (chat) {
          const recipientId = chat.user1Id === senderId ? chat.user2Id : chat.user1Id;
          const recipient = await User.findByPk(recipientId);
          if (recipient?.email) {
            sendEmail(
              recipient.email,
              'New message on CampusHub',
              '<h2>You have a new message</h2><p><strong>' + fullMessage.sender.name + '</strong> sent you: "' + content + '"</p><p>Log in to CampusHub to reply.</p>'
            );
          }
        }
      } catch (err) {
        console.error('Socket message error:', err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = socketHandler;
