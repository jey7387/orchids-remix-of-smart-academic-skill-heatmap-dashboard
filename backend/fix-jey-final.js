const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function fixJeyFinal() {
  try {
    console.log('🔧 Final fix for jey credentials...\n');
    
    // Get the current user
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', ['jeyalaks@bitsathy.ac.in']);
    
    if (userRes.rows.length > 0) {
      const user = userRes.rows[0];
      console.log('✅ Found user:', user.name);
      console.log('❌ Current hash:', user.password);
      
      // Test if current password works
      const currentTest = await bcrypt.compare('student123', user.password);
      console.log('❌ Current password test:', currentTest);
      
      // Generate correct hash
      const correctHash = await bcrypt.hash('student123', 10);
      console.log('✅ Correct hash should be:', correctHash.substring(0, 20));
      
      // Update with correct hash
      await pool.query(
        'UPDATE users SET password = $1 WHERE email = $2',
        [correctHash, 'jeyalaks@bitsathy.ac.in']
      );
      
      console.log('✅ Updated password hash for jey user');
      console.log('✅ New hash (first 20 chars):', correctHash.substring(0, 20));
    } else {
      console.log('❌ User not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixJeyFinal();
