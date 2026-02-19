const pool = require('./config/db');

async function debugQuery() {
  try {
    console.log('🔍 Debugging database queries...');
    
    // Test the exact query that's failing
    console.log('\n1️⃣ Testing student scores query...');
    const scores = await pool.query(
      `SELECT ss.skill_name, ss.category, ss.score as total_score, ss.created_at
       FROM skill_scores ss
       WHERE ss.user_id = $1 ORDER BY ss.skill_name`,
      [3] // Using student ID 3
    );
    
    console.log('✅ Scores query successful!');
    console.log('Sample score:', scores.rows[0]);
    
    console.log('\n2️⃣ Testing class averages...');
    const classAvg = await pool.query(
      `SELECT ss.skill_name, ROUND(AVG(ss.score)) as class_avg
       FROM skill_scores ss
       JOIN users u ON ss.user_id = u.id
       WHERE u.role = 'student'
       GROUP BY ss.skill_name
       ORDER BY ss.skill_name`
    );
    
    console.log('✅ Class averages query successful!');
    console.log('Sample average:', classAvg.rows[0]);
    
    console.log('\n3️⃣ Testing alerts query...');
    const low = await pool.query(
      `SELECT ss.skill_name, ss.score
       FROM skill_scores ss
       WHERE ss.user_id = $1 AND ss.score < 50
       ORDER BY ss.score ASC`,
      [3]
    );
    
    console.log('✅ Alerts query successful!');
    console.log('Sample alert:', low.rows[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Query error:', error);
    process.exit(1);
  }
}

debugQuery();
