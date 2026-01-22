const { runAsync, getAsync, allAsync } = require('../database');

class Product {
    static async create(name, category, price, description, imageUrl, stock) {
        const result = await runAsync(
            'INSERT INTO products (name, category, price, description, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)',
            [name, category, price, description, imageUrl, stock]
        );
        return result.id;
    }

    static async findById(id) {
        return await getAsync(
            'SELECT * FROM products WHERE id = ?',
            [id]
        );
    }

    static async getAll() {
        return await allAsync('SELECT * FROM products ORDER BY category');
    }

    static async getByCategory(category) {
        return await allAsync(
            'SELECT * FROM products WHERE category = ? ORDER BY name',
            [category]
        );
    }

    static async getCategories() {
        return await allAsync(
            'SELECT DISTINCT category FROM products ORDER BY category'
        );
    }

    static async update(id, name, category, price, description, imageUrl, stock) {
        await runAsync(
            'UPDATE products SET name=?, category=?, price=?, description=?, image_url=?, stock=?, updated_at=CURRENT_TIMESTAMP WHERE id=?',
            [name, category, price, description, imageUrl, stock, id]
        );
    }

    static async delete(id) {
        await runAsync('DELETE FROM products WHERE id = ?', [id]);
    }

    static async updateStock(id, quantity) {
        await runAsync(
            'UPDATE products SET stock = stock - ? WHERE id = ?',
            [quantity, id]
        );
    }
}

module.exports = Product;
