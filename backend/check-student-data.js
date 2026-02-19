const pool = require('./config/db');

async function checkStudentData() {
  try {
    console.log('🔍 Checking student data in database...\n');
    
    // Check if student@academic.com has the new fields
    const result = await pool.query(`
      SELECT id, name, email, year, semester, department, roll_number, batch 
      FROM users 
      WHERE email = 'student@academic.com'
    `);
    
    if (result.rows.length > 0) {
      const student = result.rows[0];
      console.log('✅ Student found:');
      console.log('ID:', student.id);
      console.log('Name:', student.name);
      console.log('Email:', student.email);
      console.log('Year:', student.year);
      console.log('Semester:', student.semester);
      console.log('Department:', student.department);
      console.log('Roll Number:', student.roll_number);
      console.log('Batch:', student.batch);
    } else {
      console.log('❌ Student not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkStudentData();
