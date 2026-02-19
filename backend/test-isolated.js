const pool = require('./config/db');

async function testIsolatedQuery() {
  try {
    console.log('🔍 Testing isolated dashboard query...');
    
    // Test the exact query from getDashboardStats for student
    const userId = 3; // Student User ID
    
    console.log('\n1️⃣ Testing scores query...');
    const scores = await pool.query(
      `SELECT ss.skill_name, ss.category, ss.score, ss.created_at
       FROM skill_scores ss
       WHERE ss.user_id = $1 ORDER BY ss.skill_name`,
      [userId]
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
    
    console.log('\n3️⃣ Testing overall class avg...');
    const overallClassAvg = await pool.query(
      `SELECT ROUND(AVG(ss.score)) as avg FROM skill_scores ss JOIN users u ON ss.user_id = u.id WHERE u.role = 'student'`
    );
    
    console.log('✅ Overall class avg query successful!');
    console.log('Overall avg:', overallClassAvg.rows[0]);
    
    // Test the data transformation
    console.log('\n4️⃣ Testing data transformation...');
    const classAvgMap = {};
    classAvg.rows.forEach(r => { classAvgMap[r.skill_name] = parseInt(r.class_avg); });

    const scoresWithAvg = scores.rows.map(s => ({
      skill_name: s.skill_name,
      category: s.category,
      total_score: s.score,
      created_at: s.created_at,
      class_avg: classAvgMap[s.skill_name] || 0
    }));
    
    console.log('✅ Data transformation successful!');
    console.log('Sample transformed score:', scoresWithAvg[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Isolated test error:', error);
    process.exit(1);
  }
}

testIsolatedQuery();
