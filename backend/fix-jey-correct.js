const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function fixJeyCorrect() {
  try {
    console.log('🔧 Fixing jey with correct email...\n');
    
    // Update jeyalakshmi.ad23@bitsathy.ac.in with correct password
    const hashedPassword = await bcrypt.hash('student123', 10);
    await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedPassword, 'jeyalakshmi.ad23@bitsathy.ac.in']
    );
    
    console.log('✅ Updated jeyalakshmi.ad23@bitsathy.ac.in with password: student123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixJeyCorrect();
