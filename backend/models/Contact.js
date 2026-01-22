const { runAsync, getAsync, allAsync } = require('../database');

class Contact {
    static async create(name, email, phone, subject, message) {
        const result = await runAsync(
            'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, subject, message]
        );
        return result.id;
    }

    static async getAll() {
        return await allAsync('SELECT * FROM contacts ORDER BY created_at DESC');
    }

    static async getById(id) {
        return await getAsync('SELECT * FROM contacts WHERE id = ?', [id]);
    }

    static async markAsRead(id) {
        await runAsync('UPDATE contacts SET is_read = 1 WHERE id = ?', [id]);
    }

    static async delete(id) {
        await runAsync('DELETE FROM contacts WHERE id = ?', [id]);
    }

    static async getUnreadCount() {
        const result = await getAsync('SELECT COUNT(*) as count FROM contacts WHERE is_read = 0');
        return result.count;
    }
}

module.exports = Contact;
