const pool = require('./config/db');

async function checkSemesterMarksSchema() {
  try {
    console.log('🔍 Checking semester_marks table schema...\n');
    
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'semester_marks' 
      ORDER BY ordinal_position
    `);
    
    console.log('Table columns:');
    result.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkSemesterMarksSchema();
