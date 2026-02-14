const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

let pool;
let useInMemory = false;

// In-memory storage for serverless deployment (when MySQL is not available)
const inMemoryDB = {
    users: [],
    products: [
        { id: 1, name: 'Gaming Laptop Pro', description: 'High-performance gaming laptop with RTX 4080', price: 1999.99, category: 'Laptops', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400', stock: 10, featured: 1 },
        { id: 2, name: 'Mechanical Keyboard RGB', description: 'Premium mechanical keyboard with RGB lighting', price: 149.99, category: 'Accessories', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400', stock: 25, featured: 1 },
        { id: 3, name: 'Ultra-Wide Monitor 34"', description: '34 inch curved ultra-wide monitor 144Hz', price: 599.99, category: 'Monitors', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', stock: 15, featured: 1 },
        { id: 4, name: 'Wireless Gaming Mouse', description: 'Professional wireless gaming mouse 25000 DPI', price: 79.99, category: 'Accessories', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', stock: 30, featured: 0 },
        { id: 5, name: 'RTX 4090 Graphics Card', description: 'NVIDIA GeForce RTX 4090 24GB GDDR6X', price: 1599.99, category: 'Components', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400', stock: 5, featured: 1 },
        { id: 6, name: 'Gaming Headset 7.1', description: 'Surround sound gaming headset with noise cancellation', price: 129.99, category: 'Accessories', image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=400', stock: 20, featured: 0 }
    ],
    cart: [],
    orders: [],
    wishlist: [],
    reviews: [],
    contacts: [],
    offers: [
        { id: 1, title: 'Summer Sale', description: '20% off on all laptops', discount: 20, code: 'SUMMER20', active: 1 },
        { id: 2, title: 'Free Shipping', description: 'Free shipping on orders over $100', discount: 0, code: 'FREESHIP', active: 1 }
    ]
};

async function initializeDatabase() {
    // Check if MySQL environment variables are set
    const hasMySQL = process.env.MYSQLHOST || process.env.MYSQL_HOST || process.env.MYSQL_URL || process.env.DB_HOST;
    
    if (!hasMySQL) {
        console.log('⚠️ No MySQL configuration found - using in-memory storage');
        console.log('📦 Demo mode: Data will reset on server restart');
        useInMemory = true;
        // Add test user to in-memory storage
        const hashedPassword = await bcrypt.hash('12345678', 10);
        inMemoryDB.users.push({
            id: 1,
            name: 'Test User',
            email: 'mhmd12@gmail.com',
            phone: '1234567890',
            password: hashedPassword,
            is_admin: 0,
            created_at: new Date().toISOString()
        });
        console.log('✅ Test user created: mhmd12@gmail.com / 12345678');
        return;
    }

    const dbConfig = {
        host: process.env.MYSQLHOST || process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.MYSQLPORT || process.env.MYSQL_PORT || process.env.DB_PORT || '3306'),
        user: process.env.MYSQLUSER || process.env.MYSQL_USER || process.env.DB_USER || 'root',
        password: process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
        database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || process.env.DB_NAME || 'techhub',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };

    console.log('🔧 Connecting to database at:', dbConfig.host + ':' + dbConfig.port);

    try {
        if (process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL) {
            const connectionUrl = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;
            pool = mysql.createPool(connectionUrl);
        } else {
            pool = mysql.createPool(dbConfig);
        }

        const connection = await pool.getConnection();
        console.log('✅ Connected to MySQL database');
        connection.release();
    } catch (err) {
        console.error('⚠️ MySQL connection failed, falling back to in-memory storage:', err.message);
        useInMemory = true;
        // Add test user to in-memory storage
        const hashedPassword = await bcrypt.hash('12345678', 10);
        inMemoryDB.users.push({
            id: 1,
            name: 'Test User',
            email: 'mhmd12@gmail.com',
            phone: '1234567890',
            password: hashedPassword,
            is_admin: 0,
            created_at: new Date().toISOString()
        });
        console.log('✅ Test user created: mhmd12@gmail.com / 12345678');
    }
}

async function runAsync(query, params = []) {
    if (useInMemory) {
        return { id: Date.now(), changes: 1 };
    }
    try {
        const [result] = await pool.execute(query, params);
        return { id: result.insertId, changes: result.affectedRows };
    } catch (err) {
        throw err;
    }
}

async function getAsync(query, params = []) {
    if (useInMemory) {
        return handleInMemoryQuery(query, params, 'get');
    }
    try {
        const [rows] = await pool.execute(query, params);
        return rows[0] || null;
    } catch (err) {
        throw err;
    }
}

async function allAsync(query, params = []) {
    if (useInMemory) {
        return handleInMemoryQuery(query, params, 'all');
    }
    try {
        const [rows] = await pool.execute(query, params);
        return rows;
    } catch (err) {
        throw err;
    }
}

function handleInMemoryQuery(query, params, type) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('from products')) {
        if (lowerQuery.includes('where id')) {
            return type === 'get' ? inMemoryDB.products.find(p => p.id == params[0]) : [inMemoryDB.products.find(p => p.id == params[0])].filter(Boolean);
        }
        if (lowerQuery.includes('featured')) {
            return inMemoryDB.products.filter(p => p.featured === 1);
        }
        if (lowerQuery.includes('category')) {
            return inMemoryDB.products.filter(p => p.category === params[0]);
        }
        return type === 'get' ? inMemoryDB.products[0] : inMemoryDB.products;
    }
    
    if (lowerQuery.includes('from users')) {
        if (lowerQuery.includes('where email')) {
            return type === 'get' ? inMemoryDB.users.find(u => u.email === params[0]) : [];
        }
        if (lowerQuery.includes('where id')) {
            return type === 'get' ? inMemoryDB.users.find(u => u.id == params[0]) : [];
        }
        return type === 'get' ? null : inMemoryDB.users;
    }
    
    if (lowerQuery.includes('from offers')) {
        return type === 'get' ? inMemoryDB.offers[0] : inMemoryDB.offers;
    }
    
    if (lowerQuery.includes('from cart')) {
        const userId = params[0];
        const userCart = inMemoryDB.cart.filter(c => c.user_id == userId);
        return type === 'get' ? userCart[0] : userCart;
    }
    
    if (lowerQuery.includes('from wishlist')) {
        const userId = params[0];
        return inMemoryDB.wishlist.filter(w => w.user_id == userId);
    }
    
    if (lowerQuery.includes('from orders')) {
        const userId = params[0];
        return inMemoryDB.orders.filter(o => o.user_id == userId);
    }
    
    if (lowerQuery.includes('from reviews')) {
        return inMemoryDB.reviews;
    }
    
    return type === 'get' ? null : [];
}

// Functions to add data in memory
function addUser(user) {
    user.id = inMemoryDB.users.length + 1;
    inMemoryDB.users.push(user);
    return user;
}

function addToCart(item) {
    item.id = inMemoryDB.cart.length + 1;
    inMemoryDB.cart.push(item);
    return item;
}

function addOrder(order) {
    order.id = inMemoryDB.orders.length + 1;
    inMemoryDB.orders.push(order);
    return order;
}

function getInMemoryDB() {
    return inMemoryDB;
}

function isUsingInMemory() {
    return useInMemory;
}

// For direct database access (used in some controllers)
function getPool() {
    return pool;
}

module.exports = {
    initializeDatabase,
    runAsync,
    getAsync,
    allAsync,
    getPool,
    addUser,
    addToCart,
    addOrder,
    getInMemoryDB,
    isUsingInMemory,
    // Aliases for backwards compatibility
    run: runAsync,
    get: getAsync,
    all: allAsync
};
