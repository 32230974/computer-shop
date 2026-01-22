const Review = require('../models/Review');

exports.createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user.id;

        if (!productId || !rating) {
            return res.status(400).json({ error: 'Product ID and rating are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const reviewId = await Review.create(userId, productId, rating, comment);

        res.status(201).json({
            message: 'Review submitted successfully',
            reviewId
        });
    } catch (error) {
        if (error.message.includes('already reviewed')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.getProductReviews = async (req, res) => {
    try {
        const productId = req.params.productId;
        const reviews = await Review.getByProduct(productId);
        const stats = await Review.getAverageRating(productId);

        res.json({
            reviews,
            ...stats
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const reviews = await Review.getByUser(userId);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const reviewId = req.params.id;
        const userId = req.user.id;

        await Review.update(reviewId, userId, rating, comment);
        res.json({ message: 'Review updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const userId = req.user.id;

        await Review.delete(reviewId, userId);
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
