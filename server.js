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
    origin: ['https://jobskill-app.netlify.app', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['https://jobskill-app.netlify.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token'],
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);      // Line 34
app.use('/api/requests', requestRoutes); // Line 35
app.use('/api/workers', workerRoutes);   // Line 36 (previously the error line)
app.use('/api/chats', chatRoutes);       // Line 37
app.use('/api/payments', paymentRoutes); // Line 38
app.use('/api/admin', adminRoutes);      // Line 39

// Socket.IO for real-time chat
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`Client ${socket.id} joined chat ${chatId}`);
  });

  socket.on('sendMessage', async ({ chatId, message, senderId }) => {
    try {
      const Chat = require('./models/Chat');
      const chat = await Chat.findById(chatId);
      if (!chat) {
        console.log(`Chat ${chatId} not found`);
        return;
      }

      chat.messages.push({ sender: senderId, message });
      await chat.save();

      io.to(chatId).emit('receiveMessage', { sender: senderId, message });
      console.log(`Message sent to chat ${chatId}: ${message}`);
    } catch (err) {
      console.error('Error in sendMessage:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Use the port provided by Render (or fallback to 5000 for local development)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));