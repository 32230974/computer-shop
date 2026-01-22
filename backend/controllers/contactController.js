const Contact = require('../models/Contact');
const { sendEmail } = require('../utils/mailer');

exports.submitContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        const contactId = await Contact.create(name, email, phone, subject, message);

        // Send notification email to admin
        await sendEmail(
            process.env.EMAIL_USER,
            `📩 New Contact Message: ${subject || 'No Subject'}`,
            `<h2>New Contact Form Submission</h2>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
             <p><strong>Subject:</strong> ${subject || 'Not provided'}</p>
             <p><strong>Message:</strong></p>
             <p>${message}</p>
             <hr>
             <p><small>Received at: ${new Date().toLocaleString()}</small></p>`
        );

        // Send confirmation to user
        await sendEmail(
            email,
            '✅ We received your message - TechHub',
            `<h2>Thank you for contacting us!</h2>
             <p>Dear ${name},</p>
             <p>We have received your message and will get back to you within 24-48 hours.</p>
             <p><strong>Your message:</strong></p>
             <blockquote style="background: #f9f9f9; padding: 15px; border-left: 4px solid #667eea;">${message}</blockquote>
             <p>Best regards,<br>TechHub Team</p>`
        );

        res.status(201).json({
            message: 'Your message has been sent successfully!',
            contactId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.getAll();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.getById(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        await Contact.markAsRead(req.params.id);
        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        await Contact.delete(req.params.id);
        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUnreadCount = async (req, res) => {
    try {
        const count = await Contact.getUnreadCount();
        res.json({ unreadCount: count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
