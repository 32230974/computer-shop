require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkAdmin() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT id, email, is_admin FROM users WHERE email = 'mhmd12@gmail.com'");
    
    if (result.rows.length > 0) {
      console.log('✅ Admin user found:');
      console.log(result.rows[0]);
    } else {
      console.log('❌ Admin user not found. Creating...');
      
      // Insert admin user
      const insertResult = await client.query(`
        INSERT INTO users (email, password, name, phone, is_admin, created_at)
        VALUES ('mhmd12@gmail.com', '$2a$10$EZqwZEizUJPkCH1x4VJk7.P.ObzhkaWJ9sdq4nHCa5fm480iCV/LC', 'Admin', 'User', true, NOW())
        RETURNING id, email, is_admin
      `);
      
      console.log('✅ Admin user created:');
      console.log(insertResult.rows[0]);
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkAdmin();
