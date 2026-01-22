const { runAsync, getAsync, allAsync } = require('../database');

class Review {
    static async create(userId, productId, rating, comment) {
        // Check if user already reviewed this product
        const existing = await getAsync(
            'SELECT * FROM reviews WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
        if (existing) {
            throw new Error('You have already reviewed this product');
        }

        const result = await runAsync(
            'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
            [userId, productId, rating, comment]
        );
        return result.id;
    }

    static async getByProduct(productId) {
        return await allAsync(
            `SELECT r.*, u.name as user_name 
             FROM reviews r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.product_id = ? 
             ORDER BY r.created_at DESC`,
            [productId]
        );
    }

    static async getByUser(userId) {
        return await allAsync(
            `SELECT r.*, p.name as product_name, p.image_url 
             FROM reviews r 
             JOIN products p ON r.product_id = p.id 
             WHERE r.user_id = ? 
             ORDER BY r.created_at DESC`,
            [userId]
        );
    }

    static async getAverageRating(productId) {
        const result = await getAsync(
            'SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE product_id = ?',
            [productId]
        );
        return {
            averageRating: result.avg_rating ? parseFloat(result.avg_rating.toFixed(1)) : 0,
            totalReviews: result.total_reviews
        };
    }

    static async update(id, userId, rating, comment) {
        await runAsync(
            'UPDATE reviews SET rating = ?, comment = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
            [rating, comment, id, userId]
        );
    }

    static async delete(id, userId) {
        await runAsync('DELETE FROM reviews WHERE id = ? AND user_id = ?', [id, userId]);
    }
}

module.exports = Review;
