const bcrypt = require('bcryptjs');
const pool = require('./config/db');

async function seed() {
  const hash = await bcrypt.hash('password123', 10);
  console.log('Hash:', hash);
  await pool.query('UPDATE users SET password = $1', [hash]);
  console.log('Updated all user passwords');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
