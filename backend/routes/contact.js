const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Public route
router.post('/', contactController.submitContact);

// Admin routes
router.get('/', authenticateToken, isAdmin, contactController.getAllContacts);
router.get('/unread-count', authenticateToken, isAdmin, contactController.getUnreadCount);
router.get('/:id', authenticateToken, isAdmin, contactController.getContactById);
router.delete('/:id', authenticateToken, isAdmin, contactController.deleteContact);

module.exports = router;
