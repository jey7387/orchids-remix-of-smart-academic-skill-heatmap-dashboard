const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api';

async function testFacultyDashboard() {
  try {
    console.log('👨‍🏫 Testing faculty dashboard access...');
    
    // Login as faculty
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'swea@gmail.com',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    console.log('✅ Faculty login successful!');
    console.log('User:', user.name, '-', user.role);
    
    // Test profile endpoint
    console.log('\n🧪 Testing faculty profile...');
    try {
      const profileResponse = await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Faculty profile:', profileResponse.data.user.name);
    } catch (error) {
      console.log('❌ Profile error:', error.response?.data);
    }
    
    // Test dashboard endpoint
    console.log('\n🧪 Testing faculty dashboard...');
    try {
      const dashboardResponse = await axios.get(`${BASE_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Faculty dashboard loaded!');
      console.log('Total Students:', dashboardResponse.data.totalStudents);
      console.log('Total Skills:', dashboardResponse.data.totalSkills);
      console.log('Class Average:', dashboardResponse.data.averageScore + '%');
      
      if (dashboardResponse.data.topStudents && dashboardResponse.data.topStudents.length > 0) {
        console.log('\n📊 Top Students:');
        dashboardResponse.data.topStudents.forEach((student, i) => {
          console.log(`  ${i + 1}. ${student.name}: ${student.avg_score}%`);
        });
      }
      
      if (dashboardResponse.data.lowPerformers && dashboardResponse.data.lowPerformers.length > 0) {
        console.log('\n⚠️  Low Performers:');
        dashboardResponse.data.lowPerformers.forEach((student, i) => {
          console.log(`  ${i + 1}. ${student.name} - ${student.skill_name}: ${student.total_score}%`);
        });
      }
      
    } catch (error) {
      console.log('❌ Dashboard error:', error.response?.data);
    }
    
    // Test alerts endpoint
    console.log('\n🧪 Testing faculty alerts...');
    try {
      const alertsResponse = await axios.get(`${BASE_URL}/alerts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Faculty alerts loaded!');
      console.log(`Found ${alertsResponse.data.length} alerts`);
      alertsResponse.data.forEach((alert, i) => {
        console.log(`  ${i + 1}. [${alert.type}] ${alert.message}`);
      });
    } catch (error) {
      console.log('❌ Alerts error:', error.response?.data);
    }
    
    console.log('\n🎉 Faculty dashboard test complete!');
    console.log('\n📋 Faculty Login Credentials:');
    console.log('Email: swea@gmail.com');
    console.log('Password: 123456');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testFacultyDashboard();
