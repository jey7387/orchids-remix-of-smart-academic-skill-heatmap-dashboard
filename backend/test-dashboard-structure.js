const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api';

async function testDashboardStructure() {
  try {
    console.log('🔍 Testing dashboard data structure...');
    
    // Login as student
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'student@academic.com',
      password: 'student123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Student login successful!');
    
    // Test dashboard endpoint
    console.log('\n📊 Testing dashboard API...');
    const dashboardResponse = await axios.get(`${BASE_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Dashboard API response:');
    console.log('Response keys:', Object.keys(dashboardResponse.data));
    console.log('Total Skills:', dashboardResponse.data.totalSkills);
    console.log('Average Score:', dashboardResponse.data.averageScore);
    console.log('Class Average:', dashboardResponse.data.classAverage);
    console.log('Best Skill:', dashboardResponse.data.bestSkill);
    console.log('Weakest Skill:', dashboardResponse.data.weakestSkill);
    
    console.log('\n📈 Scores array:');
    if (dashboardResponse.data.scores && dashboardResponse.data.scores.length > 0) {
      console.log('Scores length:', dashboardResponse.data.scores.length);
      dashboardResponse.data.scores.forEach((score, index) => {
        console.log(`Score ${index}:`, {
          skill_name: score.skill_name,
          category: score.category,
          total_score: score.total_score,
          class_avg: score.class_avg,
          created_at: score.created_at
        });
      });
      
      console.log('\n🎯 Chart data mapping test:');
      const chartData = dashboardResponse.data.scores.map((s) => ({
        name: s.skill_name,
        score: s.total_score,
        classAvg: s.class_avg,
      }));
      
      console.log('Chart data length:', chartData.length);
      console.log('First 3 chart items:');
      chartData.slice(0, 3).forEach((item, i) => {
        console.log(`Chart item ${i}:`, item);
      });
      
    } else {
      console.log('❌ No scores data found!');
      console.log('Scores value:', dashboardResponse.data.scores);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testDashboardStructure();
