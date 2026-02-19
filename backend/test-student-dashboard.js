const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api';

async function testStudentDashboard() {
  try {
    console.log('👨‍🎓 Testing student dashboard data structure...');
    
    // Login as student
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'student@academic.com',
      password: 'student123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Student login successful!');
    
    // Test dashboard endpoint
    console.log('\n📊 Testing student dashboard...');
    try {
      const dashboardResponse = await axios.get(`${BASE_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Dashboard response structure:');
      console.log('Keys:', Object.keys(dashboardResponse.data));
      console.log('Total Skills:', dashboardResponse.data.totalSkills);
      console.log('Average Score:', dashboardResponse.data.averageScore);
      console.log('Scores array length:', dashboardResponse.data.scores?.length || 'undefined');
      
      if (dashboardResponse.data.scores && dashboardResponse.data.scores.length > 0) {
        console.log('Sample score data:');
        console.log('First score:', dashboardResponse.data.scores[0]);
        console.log('Score keys:', Object.keys(dashboardResponse.data.scores[0]));
      }
      
    } catch (error) {
      console.log('❌ Dashboard error:', error.response?.data);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testStudentDashboard();
