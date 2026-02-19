const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function fixAllStudentPasswords() {
  try {
    console.log('🔧 Fixing all student passwords to "student123"...\n');
    
    // Get all students
    const studentsRes = await pool.query('SELECT id, name, email FROM users WHERE role = \'student\'');
    
    for (const student of studentsRes.rows) {
      // Generate consistent password
      const password = 'student123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Update student password
      await pool.query(
        'UPDATE users SET password = $1 WHERE id = $2',
        [hashedPassword, student.id]
      );
      
      console.log(`✅ Updated ${student.name} (${student.email})`);
    }
    
    console.log('\n📋 All Student Credentials:');
    studentsRes.rows.forEach(student => {
      console.log(`${student.email} → student123`);
    });
    
    console.log('\n🎉 All student passwords fixed!');
    console.log('All students can now login with: student123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixAllStudentPasswords();
