require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./db/connect');
const itemsRouter = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 4000;

// --- Middleware (bind immediately, don't wait for DB) ---
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use('/api/items', itemsRouter);

// --- Health Check ---
app.get('/health', (_req, res) => {
  const dbState = mongoose.connection.readyState; // 0=disconnected,1=connected
  res.json({
    status: 'ok',
    db: dbState === 1 ? 'connected' : 'connecting',
    timestamp: new Date().toISOString(),
  });
});

// --- 404 Fallback ---
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// --- Start Server immediately ---
app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
});

// --- Connect to MongoDB in background (retries automatically) ---
connectDB();
