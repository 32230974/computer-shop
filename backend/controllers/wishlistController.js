const Wishlist = require('../models/Wishlist');

exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        await Wishlist.add(userId, productId);
        const wishlist = await Wishlist.getByUser(userId);

        res.status(201).json({
            message: 'Added to wishlist',
            wishlist
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const productId = req.params.productId;
        const userId = req.user.id;

        await Wishlist.remove(userId, productId);
        const wishlist = await Wishlist.getByUser(userId);

        res.json({
            message: 'Removed from wishlist',
            wishlist
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const wishlist = await Wishlist.getByUser(userId);
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.checkWishlist = async (req, res) => {
    try {
        const productId = req.params.productId;
        const userId = req.user.id;
        const isInWishlist = await Wishlist.isInWishlist(userId, productId);
        res.json({ isInWishlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.clearWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        await Wishlist.clear(userId);
        res.json({ message: 'Wishlist cleared' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
