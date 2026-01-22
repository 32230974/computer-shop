const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    try {
        const { name, category, price, description, image_url, stock } = req.body;

        if (!name || !category || !price) {
            return res.status(400).json({ error: 'Name, category, and price required' });
        }

        const productId = await Product.create(name, category, price, description, image_url, stock);
        const product = await Product.findById(productId);

        res.status(201).json({
            message: 'Product created successfully',
            product: product
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const products = await Product.getAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getByCategory = async (req, res) => {
    try {
        const products = await Product.getByCategory(req.params.category);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Product.getCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { name, category, price, description, image_url, stock } = req.body;
        await Product.update(req.params.id, name, category, price, description, image_url, stock);
        const product = await Product.findById(req.params.id);
        res.json({ message: 'Product updated', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.delete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
