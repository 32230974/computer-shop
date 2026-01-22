const nodemailer = require('nodemailer');

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function sendEmail(to, subject, html) {
    try {
        // If no email configured, just log it
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            console.log('📧 Email notification (not configured):');
            console.log(`   To: ${to}`);
            console.log(`   Subject: ${subject}`);
            return;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.response);
        return info;
    } catch (error) {
        console.error('❌ Email error:', error.message);
        // Don't throw - allow app to continue
        return null;
    }
}

module.exports = { sendEmail };
