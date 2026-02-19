const pool = require('./config/db');

async function testCorrectInsert() {
  try {
    console.log('🔍 Testing corrected database insert...\n');
    
    // Test direct insert with correct column count
    const result = await pool.query(
      `INSERT INTO semester_marks (student_id, semester, subject_name, marks, max_marks, grade)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [1, 1, 'Test Subject', 85, 100, 'A']
    );
    
    console.log('✅ Correct insert successful:', result.rows[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Correct insert failed:', error.message);
    process.exit(1);
  }
}

testCorrectInsert();
