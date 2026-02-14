const { runAsync } = require('../database');
const bcrypt = require('bcryptjs');

async function seedUsers() {
    try {
        const hashedPassword = await bcrypt.hash('12345678', 10);
        await runAsync(
            'INSERT INTO users (name, email, phone, password, is_admin) VALUES (?, ?, ?, ?, ?)',
            ['Test User', 'mhmd12@gmail.com', '1234567890', hashedPassword, 0]
        );
        console.log('✅ Test user created: mhmd12@gmail.com / 12345678');
    } catch (error) {
        if (!error.message.includes('UNIQUE constraint failed')) {
            console.error('Error seeding users:', error);
        }
    }
}

async function seedProducts() {
    const products = [
        {
            name: 'MacBook Pro 16"',
            category: 'laptops',
            price: 2499,
            description: 'Powerful laptop with M1 Pro chip',
            image_url: 'https://via.placeholder.com/300x200?text=MacBook+Pro',
            stock: 10
        },
        {
            name: 'Dell XPS 13',
            category: 'laptops',
            price: 1299,
            description: 'Compact and powerful ultrabook',
            image_url: 'https://via.placeholder.com/300x200?text=Dell+XPS',
            stock: 15
        },
        {
            name: 'iMac 27"',
            category: 'desktops',
            price: 1799,
            description: 'All-in-one desktop with stunning display',
            image_url: 'https://via.placeholder.com/300x200?text=iMac',
            stock: 8
        },
        {
            name: 'Gaming Mouse',
            category: 'peripherals',
            price: 79,
            description: 'High precision gaming mouse',
            image_url: 'https://via.placeholder.com/300x200?text=Gaming+Mouse',
            stock: 50
        },
        {
            name: 'Mechanical Keyboard',
            category: 'peripherals',
            price: 149,
            description: 'Premium mechanical keyboard',
            image_url: 'https://via.placeholder.com/300x200?text=Keyboard',
            stock: 30
        },
        {
            name: 'USB-C Cable',
            category: 'accessories',
            price: 19,
            description: 'Fast charging USB-C cable',
            image_url: 'https://via.placeholder.com/300x200?text=USB-C+Cable',
            stock: 100
        }
    ];

    try {
        for (const product of products) {
            await runAsync(
                'INSERT INTO products (name, category, price, description, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)',
                [product.name, product.category, product.price, product.description, product.image_url, product.stock]
            );
        }
        console.log('✅ Sample products added to database');
    } catch (error) {
        console.error('Error seeding products:', error);
    }
}

module.exports = { seedProducts, seedUsers };
