const pool = require('./config/db');
const User = require('./models/User');

async function testAlerts() {
  try {
    console.log('🔍 Testing alerts logic...');
    
    // Simulate the auth token payload
    const mockReq = {
      user: { userId: 3 }
    };
    
    // Get user details
    const userDetails = await User.findById(mockReq.user.userId);
    console.log('✅ User found:', userDetails);
    
    if (!userDetails) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('User role:', userDetails.role);
    
    // Test the alerts query for student
    if (userDetails.role === 'student') {
      const low = await pool.query(
        `SELECT ss.skill_name, ss.score
         FROM skill_scores ss
         WHERE ss.user_id = $1 AND ss.score < 50
         ORDER BY ss.score ASC`,
        [mockReq.user.userId]
      );
      
      console.log('✅ Low scores query successful!');
      console.log('Found', low.rows.length, 'low scores');
      low.rows.forEach(r => {
        console.log(`  - ${r.skill_name}: ${r.score}%`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test error:', error);
    process.exit(1);
  }
}

testAlerts();
