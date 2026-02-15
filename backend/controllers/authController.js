const User = require('../models/User');
const { sendEmail } = require('../utils/mailer');

exports.signup = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create user
        const userId = await User.create(name, email, phone, password);
        const user = await User.findById(userId);

        // Send welcome email to the new user
        await sendEmail(
            email,
            '🎉 Welcome to TechHub - Registration Successful!',
            `<!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                    .header h1 { margin: 0; font-size: 28px; }
                    .content { padding: 30px; }
                    .welcome-text { font-size: 18px; color: #333; margin-bottom: 20px; }
                    .user-info { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .user-info p { margin: 8px 0; color: #555; }
                    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin-top: 20px; }
                    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #888; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🛍️ Welcome to TechHub!</h1>
                    </div>
                    <div class="content">
                        <p class="welcome-text">Hello <strong>${name}</strong>,</p>
                        <p>Thank you for joining TechHub! Your account has been successfully created.</p>
                        
                        <div class="user-info">
                            <h3>📋 Your Account Details:</h3>
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                            <p><strong>Registration Date:</strong> ${new Date().toLocaleString()}</p>
                        </div>
                        
                        <p>You can now:</p>
                        <ul>
                            <li>Browse our amazing products</li>
                            <li>Add items to your cart</li>
                            <li>Track your orders</li>
                            <li>Enjoy exclusive member benefits</li>
                        </ul>
                        
                        <p style="text-align: center;">
                            <a href="#" class="button">Start Shopping Now</a>
                        </p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} TechHub. All rights reserved.</p>
                        <p>If you didn't create this account, please ignore this email.</p>
                    </div>
                </div>
            </body>
            </html>`
        );

        // Send signup notification email to admin
        await sendEmail(
            process.env.EMAIL_USER,
            '🎉 New User Signup - TechHub',
            `<h2>New User Registration</h2>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
             <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>`
        );

        res.status(201).json({
            message: 'User created successfully',
            user: user
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await User.validatePassword(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = await User.generateToken(user);

        // Update last login timestamp
        await User.updateLastLogin(user.id);

        // Send login notification email to admin
        await sendEmail(
            process.env.EMAIL_USER,
            '👤 User Login - TechHub',
            `<h2>User Login Notification</h2>
             <p><strong>User:</strong> ${user.name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>`
        );

        res.json({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                is_admin: user.is_admin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (newPassword) {
            const validPassword = await User.validatePassword(currentPassword, user.password);
            if (!validPassword) {
                return res.status(400).json({ error: 'Current password is incorrect' });
            }
            await User.updatePassword(req.user.id, newPassword);
        }

        if (name || phone) {
            await User.updateProfile(req.user.id, { name, phone });
        }

        const updatedUser = await User.findById(req.user.id);
        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createAdmin = async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user.is_admin) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { name, email, phone, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create admin user
        const userId = await User.create(name, email, phone, password);
        
        // Set as admin
        await User.makeAdmin(userId);
        
        const user = await User.findById(userId);

        // Send welcome email
        await sendEmail(
            email,
            '🎉 Admin Account Created - TechHub',
            `<!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; }
                    .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; }
                    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #888; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Admin Account Created</h1>
                    </div>
                    <div class="content">
                        <p>Hello <strong>${name}</strong>,</p>
                        <p>An admin account has been created for you at TechHub.</p>
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Role:</strong> Administrator</p>
                            <p><strong>Created:</strong> ${new Date().toLocaleString()}</p>
                        </div>
                        <p>You now have full access to the admin dashboard and can manage:</p>
                        <ul>
                            <li>Products & Inventory</li>
                            <li>Orders & Customers</li>
                            <li>Offers & Promotions</li>
                            <li>Other Administrator Accounts</li>
                        </ul>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} TechHub. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>`
        );

        res.status(201).json({
            message: 'Admin created successfully',
            user: user
        });
    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user.is_admin) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const userId = req.params.id;

        // Don't allow deleting yourself
        if (parseInt(userId) === parseInt(req.user.id)) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        const db = require('../database');
        await db.runAsync('DELETE FROM users WHERE id = ?', [userId]);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAdminStats = async (req, res) => {
    try {
        const stats = await User.getStats();
        res.json(stats);
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Generate reset token
        const crypto = require('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour

        // Save token to database
        const db = require('../database');
        await db.runAsync(
            'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
            [user.id, resetToken, resetExpires]
        );

        // Send reset email
        await sendEmail(
            email,
            '🔒 Password Reset Request - TechHub',
            `<!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; }
                    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
                    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #888; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔒 Password Reset</h1>
                    </div>
                    <div class="content">
                        <p>Hello <strong>${user.name}</strong>,</p>
                        <p>We received a request to reset your password. Click the button below to create a new password:</p>
                        <p style="text-align: center;">
                            <a href="http://localhost:3000/reset-password.html?token=${resetToken}" class="button">Reset Password</a>
                        </p>
                        <p>This link will expire in 1 hour.</p>
                        <p>If you didn't request a password reset, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} TechHub. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>`
        );

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const db = require('../database');

        // Find valid reset token
        const resetRecord = await db.getAsync(
            'SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW() AND used = 0',
            [token]
        );

        if (!resetRecord) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        // Update password
        await User.updatePassword(resetRecord.user_id, password);

        // Mark token as used
        await db.runAsync('UPDATE password_resets SET used = 1 WHERE id = ?', [resetRecord.id]);

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Address management
exports.getAddresses = async (req, res) => {
    try {
        const db = require('../database');
        const addresses = await db.allAsync('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC', [req.user.id]);
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addAddress = async (req, res) => {
    try {
        const db = require('../database');
        const { type, name, phone, street, apartment, city, state, zip, country, is_default } = req.body;

        if (is_default) {
            await db.runAsync('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [req.user.id]);
        }

        const result = await db.runAsync(
            `INSERT INTO addresses (user_id, type, name, phone, street, apartment, city, state, zip, country, is_default) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [req.user.id, type, name, phone, street, apartment, city, state, zip, country, is_default ? 1 : 0]
        );

        res.status(201).json({ message: 'Address added', id: result.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const db = require('../database');
        const { type, name, phone, street, apartment, city, state, zip, country, is_default } = req.body;

        if (is_default) {
            await db.runAsync('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [req.user.id]);
        }

        await db.runAsync(
            `UPDATE addresses SET type = ?, name = ?, phone = ?, street = ?, apartment = ?, city = ?, state = ?, zip = ?, country = ?, is_default = ? 
             WHERE id = ? AND user_id = ?`,
            [type, name, phone, street, apartment, city, state, zip, country, is_default ? 1 : 0, req.params.id, req.user.id]
        );

        res.json({ message: 'Address updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        const db = require('../database');
        await db.runAsync('DELETE FROM addresses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Address deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.setDefaultAddress = async (req, res) => {
    try {
        const db = require('../database');
        await db.runAsync('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [req.user.id]);
        await db.runAsync('UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Default address updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
