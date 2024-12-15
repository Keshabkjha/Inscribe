const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit'); // To limit requests
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the public directory
app.use(express.static('public'));

// Rate limiter to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Variables for users and drawing history
let users = [];
let drawingHistory = [];

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// Socket.IO event handlers
io.on('connection', (socket) => {
    console.log('New client connected');
    let username = '';

    // Send existing drawing history to the newly connected client
    socket.emit('sync drawing', drawingHistory);

    // Handle drawing data
    socket.on('drawing', (data) => {
        if (drawingHistory.length > 1000) {
            drawingHistory.shift(); // Maintain a fixed history size
        }
        drawingHistory.push(data);
        socket.broadcast.emit('drawing', data);
    });

    // Handle user joining
    socket.on('user joined', (user) => {
        user = sanitizeInput(user);
        if (!user || user.trim() === '') {
            user = `Guest${Math.floor(Math.random() * 10000)}`;
        }

        // Prevent duplicate usernames
        if (users.includes(user)) {
            socket.emit('chat message', { username: 'System', msg: 'Username already taken!' });
            return;
        }

        username = user;
        users.push(username);
        io.emit('chat message', { username: 'System', msg: `${username} has joined!` });
        io.emit('update user count', users.length);
    });

    // Handle chat messages
    socket.on('chat message', (data) => {
        const timestamp = new Date().toLocaleTimeString();
        const message = sanitizeInput(data.msg);

        if (message.length > 500) {
            socket.emit('chat message', { username: 'System', msg: 'Message is too long!' });
            return;
        }

        io.emit('chat message', { username: sanitizeInput(data.username), msg: message, time: timestamp });
    });
    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', sanitizeInput(username));
    });
    
    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        if (username) {
            users = users.filter(user => user !== username);
            io.emit('chat message', { username: 'System', msg: `${username} has left the chat.` });
            io.emit('update user count', users.length);
        }
    });

    // Error handling
    socket.on('error', (err) => {
        console.error('Socket error: ', err.message);
        socket.emit('chat message', { username: 'System', msg: 'An error occurred. Please try again.' });
    });
});

process.on('SIGINT', () => {
    console.log('Server shutting down...');
    server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
    });
});

// Environment variable for PORT
const PORT = process.env.PORT || 3000;

// Start the server
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
