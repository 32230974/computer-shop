const { runAsync, getAsync, allAsync } = require('../database');

class Offer {
    static async create(productId, offerPrice, discountPercent, startDate, endDate, title, description) {
        const result = await runAsync(
            `INSERT INTO offers (product_id, offer_price, discount_percent, start_date, end_date, title, description) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [productId, offerPrice, discountPercent, startDate, endDate, title, description]
        );
        return result.id;
    }

    static async findById(id) {
        return await getAsync(
            `SELECT o.*, p.name as product_name, p.price as original_price, p.image_url, p.category 
             FROM offers o 
             JOIN products p ON o.product_id = p.id 
             WHERE o.id = ?`,
            [id]
        );
    }

    static async getAll() {
        return await allAsync(
            `SELECT o.*, p.name as product_name, p.price as original_price, p.image_url, p.category 
             FROM offers o 
             JOIN products p ON o.product_id = p.id 
             ORDER BY o.created_at DESC`
        );
    }

    static async getActive() {
        return await allAsync(
            `SELECT o.*, p.name as product_name, p.price as original_price, p.image_url, p.category, p.description as product_description
             FROM offers o 
             JOIN products p ON o.product_id = p.id 
             WHERE o.is_active = 1 
             AND date(o.start_date) <= date('now') 
             AND date(o.end_date) >= date('now')
             ORDER BY o.discount_percent DESC`
        );
    }

    static async update(id, productId, offerPrice, discountPercent, startDate, endDate, title, description, isActive) {
        await runAsync(
            `UPDATE offers SET product_id=?, offer_price=?, discount_percent=?, start_date=?, end_date=?, 
             title=?, description=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
            [productId, offerPrice, discountPercent, startDate, endDate, title, description, isActive, id]
        );
    }

    static async delete(id) {
        await runAsync('DELETE FROM offers WHERE id = ?', [id]);
    }

    static async toggleActive(id) {
        await runAsync(
            'UPDATE offers SET is_active = NOT is_active, updated_at=CURRENT_TIMESTAMP WHERE id = ?',
            [id]
        );
    }
}

module.exports = Offer;
