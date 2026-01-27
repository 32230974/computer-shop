const mysql = require('mysql2/promise');

let pool;

async function initializeDatabase() {
    // Support both local and Railway MySQL environment variables
    const dbConfig = {
        host: process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || '3306'),
        user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
        password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'techhub',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };

    // Railway provides MYSQL_URL for direct connection
    if (process.env.MYSQL_URL) {
        pool = mysql.createPool(process.env.MYSQL_URL);
    } else {
        pool = mysql.createPool(dbConfig);
    }

    try {
        const connection = await pool.getConnection();
        console.log('✅ Connected to MySQL database');
        connection.release();
    } catch (err) {
        console.error('❌ Database connection error:', err.message);
        throw err;
    }
}

async function runAsync(query, params = []) {
    try {
        const [result] = await pool.execute(query, params);
        return { id: result.insertId, changes: result.affectedRows };
    } catch (err) {
        throw err;
    }
}

async function getAsync(query, params = []) {
    try {
        const [rows] = await pool.execute(query, params);
        return rows[0] || null;
    } catch (err) {
        throw err;
    }
}

async function allAsync(query, params = []) {
    try {
        const [rows] = await pool.execute(query, params);
        return rows;
    } catch (err) {
        throw err;
    }
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
    // Aliases for backwards compatibility
    run: runAsync,
    get: getAsync,
    all: allAsync
};
