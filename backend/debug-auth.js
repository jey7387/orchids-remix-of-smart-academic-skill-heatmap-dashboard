const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api';

async function debugAuth() {
  try {
    console.log('🔍 Debugging authentication...');
    
    // Login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'student@academic.com',
      password: 'student123'
    });
    
    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    console.log('✅ Login successful!');
    console.log('User:', user);
    
    // Test the profile endpoint to see what the middleware returns
    console.log('\n🧪 Testing profile endpoint...');
    try {
      const profileResponse = await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Profile response:', profileResponse.data);
    } catch (error) {
      console.log('❌ Profile error:', error.response?.data);
    }
    
    // Test dashboard with detailed error info
    console.log('\n🧪 Testing dashboard endpoint...');
    try {
      const dashboardResponse = await axios.get(`${BASE_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Dashboard response loaded successfully!');
      console.log(`Total Skills: ${dashboardResponse.data.totalSkills}`);
      console.log(`Average Score: ${dashboardResponse.data.averageScore}%`);
      console.log(`Best Skill: ${dashboardResponse.data.bestSkill}`);
    } catch (error) {
      console.log('❌ Dashboard error:', error.response?.data);
      console.log('Status:', error.response?.status);
    }
    
    // Test alerts endpoint
    console.log('\n🧪 Testing alerts endpoint...');
    try {
      const alertsResponse = await axios.get(`${BASE_URL}/alerts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Alerts response loaded successfully!');
      console.log(`Found ${alertsResponse.data.length} alerts`);
      alertsResponse.data.forEach((alert, i) => {
        console.log(`  ${i + 1}. [${alert.type}] ${alert.message}`);
      });
    } catch (error) {
      console.log('❌ Alerts error:', error.response?.data);
      console.log('Status:', error.response?.status);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Debug failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

debugAuth();
