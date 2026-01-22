const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { runAsync, getAsync, allAsync } = require('../database');

class User {
    static async create(name, email, phone, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await runAsync(
            'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
            [name, email, phone, hashedPassword]
        );
        return result.id;
    }

    static async findByEmail(email) {
        return await getAsync(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
    }

    static async findById(id) {
        return await getAsync(
            'SELECT id, name, email, phone, is_admin, created_at FROM users WHERE id = ?',
            [id]
        );
    }

    static async getAll() {
        return await allAsync(
            'SELECT id, name, email, phone, is_admin, created_at FROM users'
        );
    }

    static async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    static async generateToken(user) {
        return jwt.sign(
            { id: user.id, email: user.email, is_admin: user.is_admin },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
    }

    static async makeAdmin(userId) {
        await runAsync(
            'UPDATE users SET is_admin = 1 WHERE id = ?',
            [userId]
        );
    }

    static async updatePassword(userId, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await runAsync(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, userId]
        );
    }

    static async updateProfile(userId, { name, phone }) {
        if (name && phone) {
            await runAsync('UPDATE users SET name = ?, phone = ? WHERE id = ?', [name, phone, userId]);
        } else if (name) {
            await runAsync('UPDATE users SET name = ? WHERE id = ?', [name, userId]);
        } else if (phone) {
            await runAsync('UPDATE users SET phone = ? WHERE id = ?', [phone, userId]);
        }
    }
}

module.exports = User;
