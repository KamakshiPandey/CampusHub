
const express = require('express');
const cors = require('cors');
const http = require('http');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
require('dotenv').config();
const { syncModels } = require('./models');
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const roommateRoutes = require('./routes/roommateRoutes');
const chatRoutes = require('./routes/chatRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const quizRoutes = require('./routes/quizRoutes');
const socketHandler = require('./sockets/socketHandler');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const server = http.createServer(app);
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

const io = new Server(server, {
  cors: { origin: CLIENT_URL, credentials: true },
});

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300, message: { message: 'Too many requests, please try again later.' } });
app.use('/api/', limiter);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { message: 'Too many login/register attempts, please try again later.' } });
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/roommates', roommateRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/quiz', quizRoutes);

app.get('/', (req, res) => {
  res.send('Campus Marketplace API is running');
});

app.use(notFound);
app.use(errorHandler);

socketHandler(io);

const PORT = process.env.PORT || 5000;

syncModels().then(() => {
  server.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
  });
});
