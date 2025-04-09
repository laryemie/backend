// job-skill-backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/requests');
const workerRoutes = require('./routes/workers');
const chatRoutes = require('./routes/chats');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Update to your frontend URL in production (e.g., https://job-skill-frontend.netlify.app)
    methods: ['GET', 'POST'],
  },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Socket.IO for real-time chat
io.on('connection', (socket) => {
  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
  });

  socket.on('sendMessage', async ({ chatId, message, senderId }) => {
    try {
      const Chat = require('./models/Chat');
      const chat = await Chat.findById(chatId);
      if (!chat) return;

      chat.messages.push({ sender: senderId, message });
      await chat.save();

      io.to(chatId).emit('receiveMessage', { sender: senderId, message });
    } catch (err) {
      console.error(err);
    }
  });
});

// Use the port provided by Render (or fallback to 5000 for local development)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));