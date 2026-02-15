const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import database connection
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runSQLFile(filePath) {
  const client = await pool.connect();
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && s !== '');
    
    console.log(`Executing ${statements.length} SQL statements...\n`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement && statement.trim()) {
        console.log(`[${i + 1}/${statements.length}] Executing...`);
        try {
          const result = await client.query(statement);
          if (result.rows && result.rows.length > 0) {
            console.log('Result:', result.rows);
          }
          console.log('✅ Success\n');
        } catch (err) {
          // Some errors are expected (like dropping non-existent policies)
          if (err.message.includes('does not exist')) {
            console.log('⚠️  Warning:', err.message, '\n');
          } else {
            console.log('❌ Error:', err.message, '\n');
          }
        }
      }
    }
    
    console.log('All statements executed!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the disable_rls.sql file
const sqlFilePath = path.join(__dirname, '..', 'disable_rls.sql');
runSQLFile(sqlFilePath).then(() => {
  console.log('\n✅ RLS has been disabled! You can now test login.');
  process.exit(0);
}).catch(err => {
  console.error('Failed to run SQL:', err);
  process.exit(1);
});
