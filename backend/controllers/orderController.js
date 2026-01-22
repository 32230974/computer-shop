const { runAsync, getAsync, allAsync } = require('../database');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const items = await Cart.getItems(userId);

        if (items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        const total = await Cart.getCartTotal(userId);
        const tax = total * 0.08;
        const grandTotal = total + tax;

        // Create order
        const orderResult = await runAsync(
            'INSERT INTO orders (user_id, total_amount, tax_amount, status) VALUES (?, ?, ?, ?)',
            [userId, total, tax, 'completed']
        );

        const orderId = orderResult.id;

        // Add items to order
        for (let item of items) {
            await runAsync(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price]
            );
            
            // Update product stock
            await Product.updateStock(item.product_id, item.quantity);
        }

        // Clear cart
        await Cart.clearCart(userId);

        res.status(201).json({
            message: 'Order created successfully',
            order: {
                id: orderId,
                user_id: userId,
                items: items,
                total: total,
                tax: tax,
                grandTotal: grandTotal,
                status: 'completed'
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await allAsync(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        // Get items for each order
        for (let order of orders) {
            order.items = await allAsync(
                `SELECT oi.*, p.name, p.category FROM order_items oi
                 JOIN products p ON oi.product_id = p.id
                 WHERE oi.order_id = ?`,
                [order.id]
            );
        }

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const order = await getAsync(
            'SELECT * FROM orders WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        order.items = await allAsync(
            `SELECT oi.*, p.name, p.category FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?`,
            [order.id]
        );

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
