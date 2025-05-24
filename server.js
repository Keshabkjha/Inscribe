const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inscribe';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define MongoDB Schema and Model
const drawingSchema = new mongoose.Schema({
  data: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Drawing = mongoose.model('Drawing', drawingSchema);

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  color: String,
  lastActive: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Set environment
const isProduction = process.env.NODE_ENV === 'production';

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"],
      connectSrc: ["'self'"]
    }
  }
}));

// CORS configuration
const corsOptions = {
  origin: isProduction 
    ? ['https://inscribe-lsww.onrender.com'] 
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' })); // Body limit: 10kb
app.use(express.urlencoded({ extended: true }));

// Rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Input validation middleware
const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Initialize Socket.IO with CORS and other security options
const io = new Server(server, {
  cors: corsOptions,
  // Additional security options
  allowEIO3: true,
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  cookie: false
});

// Serve static files from the public directory with cache control
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: isProduction ? '1d' : '0', // Cache static assets for 1 day in production
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store');
    }
  }
}));

// Handle SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Load initial data from MongoDB
let users = [];
let drawingHistory = [];

async function loadInitialData() {
  try {
    // Load active users (last active within 1 hour)
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    users = await User.find({ lastActive: { $gte: oneHourAgo } });
    drawingHistory = await Drawing.find().sort({ timestamp: 1 }).limit(100);
    
    console.log(`Loaded ${users.length} active users and ${drawingHistory.length} drawings`);
  } catch (err) {
    console.error('Error loading initial data:', err);
  }
}

// Call the function to load initial data
loadInitialData();

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// Socket.IO connection handling with error handling and validation
io.on('connection', async (socket) => {
  // Set a connection timeout
  const connectionTimeout = setTimeout(() => {
    socket.disconnect(true);
    console.log(`Connection timeout for socket ${socket.id}`);
  }, 30000); // 30 seconds timeout

  try {
    // Load user data from database or create new user
    let user = await User.findOne({ id: socket.id });
    
    if (!user) {
      // Generate random color for new user
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      user = new User({
        id: socket.id,
        name: `User${Math.floor(1000 + Math.random() * 9000)}`,
        color: color,
        lastActive: new Date()
      });
      
      await user.save();
    } else {
      // Update last active time
      user.lastActive = new Date();
      await user.save();
    }
    
    // Add user to active users list if not already present
    if (!users.some(u => u.id === user.id)) {
      users.push(user);
    }
    
    // Clear timeout on successful connection
    clearTimeout(connectionTimeout);
    
    // Send current state to the new user
    socket.emit('init', {
      users: users.map(u => ({ id: u.id, name: u.name, color: u.color })),
      drawingHistory: drawingHistory.map(d => d.data)
    });
    
    // Notify other users about the new user
    socket.broadcast.emit('userJoined', {
      id: user.id,
      name: user.name,
      color: user.color
    });
    
    console.log(`User connected: ${user.name} (${socket.id})`);
    
    // Handle drawing events
    socket.on('draw', async (data) => {
      try {
        // Save drawing to database
        const drawing = new Drawing({ data });
        await drawing.save();
        
        // Add to in-memory history (keep only last 100 drawings in memory)
        drawingHistory.push(drawing);
        if (drawingHistory.length > 100) {
          drawingHistory.shift();
        }
        
        // Broadcast to all clients
        socket.broadcast.emit('draw', data);
      } catch (err) {
        console.error('Error saving drawing:', err);
      }
    });
    
    // Handle chat messages
    socket.on('chatMessage', (data) => {
      io.emit('chatMessage', {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        message: data.message,
        timestamp: new Date()
      });
    });
    
    // Handle user disconnection
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${user.name} (${socket.id})`);
      
      // Remove user from active users
      users = users.filter(u => u.id !== socket.id);
      
      // Notify other users
      socket.broadcast.emit('userLeft', { id: socket.id });
    });
    
  } catch (err) {
    console.error('Error in socket connection:', err);
    socket.emit('error', { message: 'An error occurred. Please refresh the page.' });
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Server shutting down...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Perform cleanup if needed
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});
