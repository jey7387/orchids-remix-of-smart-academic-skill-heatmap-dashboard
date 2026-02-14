const bcrypt = require('bcryptjs');
const pool = require('./config/db');

async function test() {
  const result = await pool.query("SELECT * FROM users WHERE email = 'alice@student.com'");
  const user = result.rows[0];
  console.log('User found:', !!user);
  console.log('Hash from DB:', user.password);
  const valid = await bcrypt.compare('password123', user.password);
  console.log('Password valid:', valid);
  process.exit(0);
}

test().catch(e => { console.error(e); process.exit(1); });
