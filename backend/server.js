const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const offerRoutes = require('./routes/offers');
const wishlistRoutes = require('./routes/wishlist');
const reviewRoutes = require('./routes/reviews');
const contactRoutes = require('./routes/contact');
const { initializeDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from parent directory
app.use(express.static(path.join(__dirname, '..')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date() });
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

// Initialize database and start server
async function startServer() {
    try {
        await initializeDatabase();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 TechHub Server running on http://localhost:${PORT}`);
            console.log(`🌐 Website available at: http://localhost:${PORT}`);
            console.log(`📧 Email notifications: ${process.env.EMAIL_USER || 'Not configured'}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err.message);
        process.exit(1);
    }
}

startServer();
