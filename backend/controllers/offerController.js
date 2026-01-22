const Offer = require('../models/Offer');

exports.createOffer = async (req, res) => {
    try {
        const { productId, offerPrice, discountPercent, startDate, endDate, title, description } = req.body;

        if (!productId || !offerPrice || !discountPercent) {
            return res.status(400).json({ error: 'Product, offer price, and discount percent are required' });
        }

        const offerId = await Offer.create(productId, offerPrice, discountPercent, startDate, endDate, title, description);
        const offer = await Offer.findById(offerId);

        res.status(201).json({
            message: 'Offer created successfully',
            offer
        });
    } catch (error) {
        console.error('Create offer error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllOffers = async (req, res) => {
    try {
        const offers = await Offer.getAll();
        res.json(offers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getActiveOffers = async (req, res) => {
    try {
        const offers = await Offer.getActive();
        res.json(offers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOfferById = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({ error: 'Offer not found' });
        }
        res.json(offer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOffer = async (req, res) => {
    try {
        const { productId, offerPrice, discountPercent, startDate, endDate, title, description, isActive } = req.body;
        await Offer.update(req.params.id, productId, offerPrice, discountPercent, startDate, endDate, title, description, isActive);
        const offer = await Offer.findById(req.params.id);
        res.json({
            message: 'Offer updated successfully',
            offer
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteOffer = async (req, res) => {
    try {
        await Offer.delete(req.params.id);
        res.json({ message: 'Offer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.toggleOfferActive = async (req, res) => {
    try {
        await Offer.toggleActive(req.params.id);
        const offer = await Offer.findById(req.params.id);
        res.json({
            message: 'Offer status toggled',
            offer
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
