const { runAsync, getAsync, allAsync } = require('../database');

class Wishlist {
    static async add(userId, productId) {
        // Check if already exists
        const existing = await getAsync(
            'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
        if (existing) return existing.id;

        const result = await runAsync(
            'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
            [userId, productId]
        );
        return result.id;
    }

    static async remove(userId, productId) {
        await runAsync(
            'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
    }

    static async getByUser(userId) {
        return await allAsync(
            `SELECT w.*, p.name, p.price, p.image_url, p.category, p.stock,
                    (SELECT o.offer_price FROM offers o WHERE o.product_id = p.id AND o.is_active = 1 
                     AND date(o.start_date) <= date('now') AND date(o.end_date) >= date('now') LIMIT 1) as offer_price
             FROM wishlist w 
             JOIN products p ON w.product_id = p.id 
             WHERE w.user_id = ? 
             ORDER BY w.created_at DESC`,
            [userId]
        );
    }

    static async isInWishlist(userId, productId) {
        const result = await getAsync(
            'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
        return !!result;
    }

    static async clear(userId) {
        await runAsync('DELETE FROM wishlist WHERE user_id = ?', [userId]);
    }
}

module.exports = Wishlist;
