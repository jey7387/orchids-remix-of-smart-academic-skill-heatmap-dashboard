const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function updateJeyCredentials() {
  try {
    console.log('🔧 Updating jey credentials...\n');
    
    // Update jeyalaks@bitsathy.ac.in with correct password
    const hashedPassword = await bcrypt.hash('student123', 10);
    await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedPassword, 'jeyalaks@bitsathy.ac.in']
    );
    
    console.log('✅ Updated jeyalaks@bitsathy.ac.in with password: student123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateJeyCredentials();
