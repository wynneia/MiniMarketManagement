const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const authMiddleware = require('./middlewares/auth');

// Initialize express app
const app = express();
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(express.static('public'));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', authMiddleware, productRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    service: 'inventory-management',
    uptime: process.uptime()
  });
});

// Frontend routes
const frontendPages = {
  '/': 'dashboard.html',
  '/dashboard': 'dashboard.html',
  '/products': 'products.html',
  '/reports': 'reports.html',
  '/login': 'login.html',
  '/register': 'register.html'
};

// Register all frontend routes
Object.entries(frontendPages).forEach(([route, page]) => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', page));
  });
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  if (req.path.startsWith('/api/')) {
    return res.status(statusCode).json({ error: message });
  }
  res.status(statusCode).send(`<h1>Error: ${message}</h1>`);
});

// Database connection and server startup
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
    });
    console.log('✅ Connected to MongoDB successfully');
    
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`📂 API available at http://localhost:${PORT}/api`);
      console.log(`🌐 Frontend available at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

startServer();