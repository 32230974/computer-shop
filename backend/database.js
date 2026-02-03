const mysql = require('mysql2/promise');

let pool;

async function initializeDatabase() {
    // Railway uses MYSQLHOST, MYSQLPORT, etc. (no underscore)
    // Also support MYSQL_HOST format and local defaults
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

    // Railway provides MYSQL_URL or MYSQL_PUBLIC_URL for direct connection
    if (process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL) {
        const connectionUrl = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;
        pool = mysql.createPool(connectionUrl);
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
