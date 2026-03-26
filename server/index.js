const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const { createClient, LiveTranscriptionEvents } = require('@deepgram/sdk');
const { generateSummary } = require('./services/ai.service');
const authRoutes = require('./routes/auth');
const meetingRoutes = require('./routes/meetings');
const Meeting = require('./models/Meeting');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://insightly-ai-rosy.vercel.app"
];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true
    }
});


const deepgram = createClient(process.env.DEEPGRAM_API_KEY);


app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);


const MONGO_URI =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/insightly';

console.log("Mongo URI in use:", MONGO_URI);

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    });


io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    console.log('Socket Middleware: Received token:', token ? 'YES' : 'NO');

    if (!token) {
        console.log('Socket Middleware: No token provided');
        return next(new Error('Authentication error: No token'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        console.log('Socket Middleware: Token verified for user:', decoded.user.id);
        socket.user = decoded.user;
        next();
    } catch (err) {
        console.error('Socket Middleware: JWT Verify Error:', err.message);
        next(new Error('Authentication error: Invalid token'));
    }
});


const videoSocketHandler = require('./sockets/videoHandler');
videoSocketHandler(io);

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}, User ID: ${socket.user.id}`);




    socket.on("summarize-to-voice", async (data) => {
        try {
            console.log("DEBUG: Summarize-to-voice request (Gemini summary only)");
            const { text } = data;

            if (!text || text.trim().length < 30) {
                return socket.emit("voice-summary-error", "Not enough content to summarize yet.");
            }

            const summary = await generateSummary(text);

            socket.emit("voice-summary", {
                summary: summary

            });
        } catch (err) {
            console.error("Summarize Error:", err);
            socket.emit("voice-summary-error", "Failed to generate summary");
        }
    });


    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

});



app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).json({
        msg: 'Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});



const PORT = process.env.PORT || 5001;
server.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);
