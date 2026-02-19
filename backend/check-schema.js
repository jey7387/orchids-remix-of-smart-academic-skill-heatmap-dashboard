const pool = require('./config/db');

async function checkSchema() {
  try {
    const res = await pool.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'users\' ORDER BY ordinal_position');
    console.log('Users table structure:');
    res.rows.forEach(row => console.log(`- ${row.column_name}: ${row.data_type}`));
    
    const dataRes = await pool.query('SELECT * FROM users LIMIT 5');
    console.log('\nSample data:');
    console.log(dataRes.rows);
    
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

checkSchema();
