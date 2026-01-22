const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/active', offerController.getActiveOffers);

// Admin routes
router.get('/', authenticateToken, isAdmin, offerController.getAllOffers);
router.get('/:id', offerController.getOfferById);
router.post('/', authenticateToken, isAdmin, offerController.createOffer);
router.put('/:id', authenticateToken, isAdmin, offerController.updateOffer);
router.delete('/:id', authenticateToken, isAdmin, offerController.deleteOffer);
router.patch('/:id/toggle', authenticateToken, isAdmin, offerController.toggleOfferActive);

module.exports = router;
