require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB, getDBMode } = require('./config/db');

// Connect Database
connectDB();

const app = express();

// Security Middlewares
app.use(helmet());

// CORS Setup (Configure for production correctly)
app.use(cors({
  origin: '*', // In production, restrict this to the frontend domains
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiter: max 200 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 200,
  message: { msg: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api/', limiter);

// Body Parser Middleware
app.use(express.json({ limit: '2mb' })); // Support base64 image canvas data uploads up to 2mb

// Route Handlers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/designs', require('./routes/designs'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/themes', require('./routes/themes'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin-logs', require('./routes/adminLogs'));
app.use('/api/ai', require('./routes/ai'));

// Basic Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: getDBMode() ? 'Mock DB (Offline Fallback)' : 'MongoDB Connected (Atlas/Local)',
    timestamp: new Date()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Something went wrong on the server!' });
});

// Port Binding
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🌸 Custom Blossom server running on port ${PORT}`);
  console.log(`📡 Database mode: ${getDBMode() ? 'Local In-Memory Mock Store' : 'Active MongoDB Server'}`);
});
