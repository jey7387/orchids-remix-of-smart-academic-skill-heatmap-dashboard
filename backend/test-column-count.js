const pool = require('./config/db');

async function testColumnCount() {
  try {
    console.log('🔍 Testing column count...\n');
    
    // Count columns in INSERT
    const insertColumns = ['student_id', 'semester', 'subject_name', 'marks', 'max_marks', 'grade'];
    const values = [1, 1, 'Test Subject', 85, 100, 'A'];
    
    console.log('Columns:', insertColumns.length, insertColumns);
    console.log('Values:', values.length, values);
    
    // Test with explicit column list
    const result = await pool.query(
      `INSERT INTO semester_marks (student_id, semester, subject_name, marks, max_marks, grade)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      values
    );
    
    console.log('✅ Success:', result.rows[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  }
}

testColumnCount();
