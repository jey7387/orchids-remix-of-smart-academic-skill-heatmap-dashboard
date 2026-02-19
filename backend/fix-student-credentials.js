const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function fixStudentCredentials() {
  try {
    console.log('🔧 Fixing student credentials...\n');
    
    // Get all students
    const studentsRes = await pool.query('SELECT id, name, email FROM users WHERE role = \'student\'');
    
    for (const student of studentsRes.rows) {
      // Generate consistent password pattern
      const basePassword = 'student123';
      const newPassword = `${basePassword}`;
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update student with new password
      await pool.query(
        'UPDATE users SET password = $1 WHERE id = $2',
        [hashedPassword, student.id]
      );
      
      console.log(`✅ Updated ${student.name} (${student.email})`);
      console.log(`   New password: ${newPassword}`);
    }
    
    console.log('\n📋 Updated Student Credentials:');
    console.log('student@academic.com → student123');
    console.log('jeyalaks@bitsathy.ac.in → student123');
    console.log('saro@gmail.com → student123');
    console.log('k@gmail.com → student123');
    console.log('kas@gmail.com → student123');
    console.log('kavya@gmail.com → student123');
    console.log('testfinal@user.com → student123');
    console.log('testapi@student.com → student123');
    
    console.log('\n🎉 All student credentials fixed!');
    console.log('All students can now login with: student123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixStudentCredentials();
