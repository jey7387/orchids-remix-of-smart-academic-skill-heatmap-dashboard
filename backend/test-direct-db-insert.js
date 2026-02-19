const pool = require('./config/db');

async function testDirectDBInsert() {
  try {
    console.log('🔍 Testing direct database insert...\n');
    
    // Test direct insert
    const result = await pool.query(
      `INSERT INTO semester_marks (student_id, semester, subject_name, marks, max_marks, grade)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [1, 1, 'Test Subject', 85, 100, 'A']
    );
    
    console.log('✅ Direct insert successful:', result.rows[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Direct insert failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
}

testDirectDBInsert();
