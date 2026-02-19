const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function checkJeyUser() {
  try {
    console.log('🔍 Checking jey user in database...\n');
    
    // Check if user exists
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', ['jeyalaks@bitsathy.ac.in']);
    
    if (userRes.rows.length > 0) {
      const user = userRes.rows[0];
      console.log('✅ User found:');
      console.log('  ID:', user.id);
      console.log('  Name:', user.name);
      console.log('  Email:', user.email);
      console.log('  Password hash:', user.password);
      
      // Test password verification
      const isValid = await bcrypt.compare('student123', user.password);
      console.log('  Password verification (student123):', isValid);
      
      if (!isValid) {
        console.log('❌ Password hash is incorrect!');
        
        // Update with correct password
        const newHashedPassword = await bcrypt.hash('student123', 10);
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [newHashedPassword, user.id]);
        console.log('✅ Updated password hash for jey user');
      } else {
        console.log('✅ Password verification successful!');
      }
    } else {
      console.log('❌ User not found in database!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkJeyUser();
