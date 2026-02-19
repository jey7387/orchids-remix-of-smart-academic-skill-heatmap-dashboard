const pool = require('./config/db');

async function testSpecificStudent() {
  try {
    console.log('🔍 Testing specific student...\n');
    
    // Check if student ID 16 exists
    const studentResult = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [16]);
    
    if (studentResult.rows.length > 0) {
      const student = studentResult.rows[0];
      console.log('✅ Student found:', student);
      
      // Test insert with this specific student
      const insertResult = await pool.query(
        `INSERT INTO semester_marks (student_id, semester, subject_name, marks, max_marks, grade)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [16, 1, 'Test Subject', 88, 100, 'A+']
      );
      
      console.log('✅ Insert successful:', insertResult.rows[0]);
    } else {
      console.log('❌ Student ID 16 not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testSpecificStudent();
