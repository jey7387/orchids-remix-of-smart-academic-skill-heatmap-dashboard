const pool = require('./config/db');

async function checkExactEmail() {
  try {
    console.log('🔍 Checking exact email format...\n');
    
    // Get all student emails
    const studentsRes = await pool.query('SELECT email, name FROM users WHERE role = \'student\' ORDER BY name');
    
    console.log('All student emails:');
    studentsRes.rows.forEach((student, i) => {
      console.log(`${i+1}. "${student.email}" - ${student.name}`);
    });
    
    // Find emails containing 'jey'
    const jeyEmails = studentsRes.rows.filter(s => s.email && s.email.includes('jey'));
    console.log('\n📧 Emails containing "jey":');
    jeyEmails.forEach((email, i) => {
      console.log(`${i+1}. "${email.email}" - ${email.name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkExactEmail();
