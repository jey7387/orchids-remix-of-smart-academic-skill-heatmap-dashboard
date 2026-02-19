const pool = require('./config/db');

async function checkStudentSchema() {
  try {
    console.log('🔍 Checking current users table structure...\n');
    
    // Get users table structure
    const columnsRes = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Current users table columns:');
    columnsRes.rows.forEach(col => {
      const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
      console.log(`  ${col.column_name}: ${col.data_type} (${nullable}${defaultVal})`);
    });
    
    // Check sample student data
    const studentsRes = await pool.query(`
      SELECT id, name, email, role 
      FROM users 
      WHERE role = 'student' 
      LIMIT 3
    `);
    
    console.log('\n👥 Sample student data:');
    studentsRes.rows.forEach((student, i) => {
      console.log(`  Student ${i + 1}: ID=${student.id}, Name=${student.name}, Email=${student.email}, Role=${student.role}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkStudentSchema();
