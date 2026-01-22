const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', productController.getAll);
router.get('/categories', productController.getCategories);
router.get('/category/:category', productController.getByCategory);
router.get('/:id', productController.getById);

// Admin only routes
router.post('/', authenticateToken, adminOnly, productController.createProduct);
router.put('/:id', authenticateToken, adminOnly, productController.updateProduct);
router.delete('/:id', authenticateToken, adminOnly, productController.deleteProduct);

module.exports = router;
