const pool = require('./config/db');

async function checkConstraints() {
  try {
    console.log('🔍 Checking table constraints...\n');
    
    const result = await pool.query(`
      SELECT tc.constraint_name, tc.constraint_type, kcu.column_name
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      WHERE tc.table_name = 'semester_marks'
        AND tc.table_schema = 'public'
      ORDER BY tc.constraint_name
    `);
    
    console.log('Constraints:');
    result.rows.forEach(constraint => {
      console.log(`  - ${constraint.constraint_name}: ${constraint.constraint_type} (${constraint.column_name})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkConstraints();
