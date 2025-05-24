const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const winston = require('winston');
const sanitizeHtml = require('sanitize-html');
require('dotenv').config();

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Add console transport in non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  logger.error('MongoDB connection string is not defined. Please set MONGODB_URI in your .env file');
  process.exit(1);
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
  logger.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

// Connect to the database
connectDB();

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
app.use((err, req, res, _next) => {
  logger.error('Server error:', { 
    error: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });
  res.status(500).json({ error: 'Something went wrong!' });
});

// Validation schemas for route handlers
const validationSchemas = {
  chatMessage: [
    body('message')
      .isString().withMessage('Message must be a string')
      .trim()
      .isLength({ min: 1, max: 500 }).withMessage('Message must be between 1 and 500 characters')
      .escape()
  ],
  drawData: [
    body('x').isNumeric().withMessage('x must be a number'),
    body('y').isNumeric().withMessage('y must be a number'),
    body('color').isString().withMessage('color must be a string'),
    body('size').isNumeric().withMessage('size must be a number')
  ]
};

// Export the validation middleware for use in routes
// Note: This is currently not used but kept for future route validation
// eslint-disable-next-line no-unused-vars
const validate = (schema) => [
  ...(validationSchemas[schema] || []),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation failed', { errors: errors.array() });
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    next();
  }
];

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {}
  });
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
    
    logger.info('Initial data loaded');
  } catch (error) {
    logger.error('Error loading initial data:', { error: error.message });
  }
}

// Call the function to load initial data
loadInitialData().catch(err => {
  logger.error('Failed to load initial data:', err);
});

// Socket.IO connection handling with error handling and validation
io.on('connection', async (socket) => {
  // Set a connection timeout
  const connectionTimeout = setTimeout(() => {
    socket.disconnect(true);
    logger.warn(`Connection timeout for socket ${socket.id}`);
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
    
    logger.info(`User connected: ${user.name} (${socket.id})`);
    
    // Handle drawing events with validation
    socket.on('draw', async (data) => {
      try {
        // Validate drawing data
        if (!data || typeof data !== 'object') {
          logger.warn('Invalid drawing data format');
          return;
        }

        // Create a sanitized copy of the data
        const sanitizedData = {
          x: Number(data.x) || 0,
          y: Number(data.y) || 0,
          color: sanitizeHtml(String(data.color || '#000000')),
          size: Math.max(1, Math.min(Number(data.size) || 5, 50)),
          type: sanitizeHtml(String(data.type || 'draw'))
        };

        // Save drawing to database
        const drawing = new Drawing({ data: sanitizedData });
        await drawing.save();
        
        // Add to in-memory history (keep only last 100 drawings in memory)
        drawingHistory.push(drawing);
        if (drawingHistory.length > 100) {
          drawingHistory.shift();
        }
        
        // Broadcast to all clients
        socket.broadcast.emit('draw', sanitizedData);
      } catch (err) {
        logger.error('Error saving drawing:', { error: err.message, stack: err.stack });
      }
    });
    
    // Handle chat messages with validation and sanitization
    socket.on('chatMessage', (data) => {
      try {
        if (!data || typeof data !== 'object' || !data.message) {
          logger.warn('Invalid chat message format');
          return;
        }

        // Sanitize message
        const sanitizedMessage = sanitizeInput(data.message);
        
        if (!sanitizedMessage.trim()) {
          logger.warn('Empty message after sanitization');
          return;
        }

        const messageData = {
          userId: user.id,
          userName: user.name,
          userColor: user.color,
          message: sanitizedMessage,
          timestamp: new Date()
        };

        // Log the message (without user color for privacy)
        logger.info('Chat message', { 
          userId: user.id, 
          userName: user.name,
          messageLength: sanitizedMessage.length 
        });

        io.emit('chatMessage', messageData);
      } catch (err) {
        logger.error('Error processing chat message:', { error: err.message });
      }
    });
    
    // Handle user disconnection
    socket.on('disconnect', async () => {
      logger.info(`User disconnected: ${user?.name || 'unknown'} (${socket.id})`);
      
      if (user) {
        // Remove user from active users
        users = users.filter(u => u.id !== socket.id);
        
        // Update last active time in database
        try {
          await User.updateOne(
            { id: user.id },
            { $set: { lastActive: new Date() } }
          );
        } catch (err) {
          logger.error('Error updating user last active time:', { error: err.message });
        }
        
        // Notify other users
        socket.broadcast.emit('userLeft', { id: socket.id });
      }
    });
    
  } catch (err) {
    logger.error('Error in socket connection:', { error: err.message, stack: err.stack });
    socket.emit('error', { message: 'An error occurred. Please refresh the page.' });
  }
});

// Handle graceful shutdown
const shutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed.');
      process.exit(0);
    });
  });

  // Force shutdown after 5 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 5000);
};

// Handle different shutdown signals
['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
  process.on(signal, () => shutdown(signal));
});

// Start the server after MongoDB connection is established
const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 3000;
    const serverInstance = server.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server is running on port ${PORT}`, {
        environment: process.env.NODE_ENV || 'development',
        mongoDBConfigured: !!process.env.MONGODB_URI,
        nodeVersion: process.version
      });
    });

    // Handle server errors
    serverInstance.on('error', (error) => {
      logger.error('Server error:', { 
        error: error.message, 
        code: error.code,
        stack: error.stack 
      });
      process.exit(1);
    });

    return serverInstance;
  } catch (error) {
    logger.error('Failed to start server:', { 
      error: error.message, 
      stack: error.stack 
    });
    process.exit(1);
  }
};

// Start the application
startServer();

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', { 
    error: error.message, 
    stack: error.stack 
  });
  // Perform cleanup if needed
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { 
    promise: String(promise), 
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined
  });
});
