require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testPassword() {
  const client = await pool.connect();
  try {
    // Get user from database
    const result = await client.query("SELECT id, email, password FROM users WHERE email = 'mhmd12@gmail.com'");
    
    if (result.rows.length === 0) {
      console.log('❌ User not found!');
      return;
    }
    
    const user = result.rows[0];
    console.log('User found:', { id: user.id, email: user.email });
    console.log('Password hash in DB:', user.password);
    
    // Test password comparison
    const password = '12345678';
    console.log('\nTesting password:', password);
    
    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password valid?', isValid);
    
    if (!isValid) {
      console.log('\n❌ Password hash does not match!');
      console.log('Generating new hash...');
      
      const newHash = await bcrypt.hash(password, 10);
      console.log('New hash:', newHash);
      
      // Update user with new hash
      await client.query(
        "UPDATE users SET password = $1 WHERE email = $2",
        [newHash, 'mhmd12@gmail.com']
      );
      
      console.log('✅ Password hash updated!');
    } else {
      console.log('✅ Password hash is correct!');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

testPassword();
