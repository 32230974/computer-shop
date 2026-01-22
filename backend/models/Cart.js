const { runAsync, getAsync, allAsync } = require('../database');

class Cart {
    static async addItem(userId, productId, quantity = 1) {
        // Check if item already in cart
        const existing = await getAsync(
            'SELECT id FROM cart_items WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        if (existing) {
            await runAsync(
                'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                [quantity, userId, productId]
            );
        } else {
            await runAsync(
                'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [userId, productId, quantity]
            );
        }
    }

    static async getItems(userId) {
        return await allAsync(
            `SELECT c.*, p.name, p.price, p.image_url 
             FROM cart_items c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ?`,
            [userId]
        );
    }

    static async removeItem(userId, productId) {
        await runAsync(
            'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
    }

    static async clearCart(userId) {
        await runAsync('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    }

    static async getCartTotal(userId) {
        const result = await getAsync(
            `SELECT SUM(c.quantity * p.price) as total 
             FROM cart_items c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ?`,
            [userId]
        );
        return result?.total || 0;
    }
}

module.exports = Cart;
