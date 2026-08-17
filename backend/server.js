const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load Environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Attach Socket.io to Express App instance
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Connect to MongoDB Database
connectDB();

// API Routes
app.use('/api/triage', require('./routes/triageRoutes'));
app.use('/api/doctor', require('./routes/doctorRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Tena AI Multilingual Triage & Tele-Diagnostics API',
    mongodb: process.env.MONGODB_URI ? 'Connected (Atlas)' : 'Mock Mode',
    timestamp: new Date().toISOString()
  });
});

// Socket.io Realtime & WebRTC Signaling Logic
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Join Tele-Doctor Consultation Room
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`[Socket.io] Socket ${socket.id} joined WebRTC room: ${roomId}`);
    socket.to(roomId).emit('user_joined', socket.id);
  });

  // WebRTC Offer
  socket.on('webrtc_offer', ({ roomId, offer }) => {
    socket.to(roomId).emit('webrtc_offer', { offer, sender: socket.id });
  });

  // WebRTC Answer
  socket.on('webrtc_answer', ({ roomId, answer }) => {
    socket.to(roomId).emit('webrtc_answer', { answer, sender: socket.id });
  });

  // ICE Candidates
  socket.on('webrtc_ice_candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('webrtc_ice_candidate', { candidate, sender: socket.id });
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 Tena AI Server running on http://localhost:${PORT}`);
  console.log(`🏥 Health Triage API: http://localhost:${PORT}/api/triage/cases`);
  console.log(`===================================================`);
});
