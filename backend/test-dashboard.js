const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api';

async function testDashboard() {
  console.log('🧪 Testing Dashboard APIs...\n');

  try {
    // Login as a student
    console.log('1️⃣ Logging in as student...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'student@academic.com',
      password: 'student123'
    });
    
    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    console.log(`✅ Logged in as ${user.name} (${user.role})`);

    // Test dashboard stats
    console.log('\n2️⃣ Testing dashboard stats...');
    try {
      const dashboardResponse = await axios.get(`${BASE_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (dashboardResponse.data) {
        console.log('✅ Dashboard stats loaded!');
        console.log(`   Total Skills: ${dashboardResponse.data.totalSkills}`);
        console.log(`   Average Score: ${dashboardResponse.data.averageScore}%`);
        console.log(`   Best Skill: ${dashboardResponse.data.bestSkill}`);
        console.log(`   Weakest Skill: ${dashboardResponse.data.weakestSkill}`);
      } else {
        console.log('❌ No dashboard data received');
      }
    } catch (error) {
      console.log('❌ Dashboard stats error:', error.response?.data?.error);
    }

    // Test alerts
    console.log('\n3️⃣ Testing alerts...');
    try {
      const alertsResponse = await axios.get(`${BASE_URL}/alerts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const alerts = alertsResponse.data;
      console.log(`✅ Alerts loaded! Found ${alerts.length} alerts`);
      alerts.forEach((alert, i) => {
        console.log(`   ${i + 1}. [${alert.type}] ${alert.message}`);
      });
    } catch (error) {
      console.log('❌ Alerts error:', error.response?.data?.error);
    }

    console.log('\n🎉 Dashboard API Test Complete!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.error || error.message);
  }
}

testDashboard();
