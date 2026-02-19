const pool = require('./config/db');

async function listStudents() {
  try {
    console.log('🔍 Listing all students...\n');
    
    const studentsRes = await pool.query('SELECT email, name FROM users WHERE role = \'student\' ORDER BY name');
    
    console.log('All students in database:');
    studentsRes.rows.forEach((student, i) => {
      console.log(`${i+1}. ${student.name} (${student.email})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listStudents();
