const pool = require('./config/db');

async function testSimpleInsert() {
  try {
    console.log('🔍 Testing simple insert without conflict...\n');
    
    // Test simple insert without ON CONFLICT
    const result = await pool.query(
      `INSERT INTO semester_marks (student_id, semester, subject_name, marks, max_marks, grade)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [1, 1, 'Test Subject 2', 85, 100, 'A']
    );
    
    console.log('✅ Simple insert successful:', result.rows[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Simple insert failed:', error.message);
    process.exit(1);
  }
}

testSimpleInsert();
