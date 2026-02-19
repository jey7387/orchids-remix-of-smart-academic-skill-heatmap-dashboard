const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api';

async function testHeatmap() {
  try {
    console.log('🔥 Testing heatmap endpoint...');
    
    // Test as student
    console.log('\n1️⃣ Testing student heatmap...');
    try {
      const studentLogin = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'student@academic.com',
        password: 'student123'
      });
      
      const heatmapResponse = await axios.get(`${BASE_URL}/heatmap`, {
        headers: { Authorization: `Bearer ${studentLogin.data.token}` }
      });
      
      console.log('✅ Student heatmap response:', heatmapResponse.data);
      console.log('Data length:', heatmapResponse.data.length);
      if (heatmapResponse.data.length > 0) {
        console.log('Sample data:', heatmapResponse.data[0]);
      }
    } catch (error) {
      console.log('❌ Student heatmap error:', error.response?.data);
    }
    
    // Test as faculty
    console.log('\n2️⃣ Testing faculty heatmap...');
    try {
      const facultyLogin = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'swea@gmail.com',
        password: '123456'
      });
      
      const heatmapResponse = await axios.get(`${BASE_URL}/heatmap`, {
        headers: { Authorization: `Bearer ${facultyLogin.data.token}` }
      });
      
      console.log('✅ Faculty heatmap response:', heatmapResponse.data);
      console.log('Data length:', heatmapResponse.data.length);
      if (heatmapResponse.data.length > 0) {
        console.log('Sample data:', heatmapResponse.data[0]);
      }
    } catch (error) {
      console.log('❌ Faculty heatmap error:', error.response?.data);
    }
    
    // Test as admin
    console.log('\n3️⃣ Testing admin heatmap...');
    try {
      const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'admin@academic.com',
        password: 'admin123'
      });
      
      const heatmapResponse = await axios.get(`${BASE_URL}/heatmap`, {
        headers: { Authorization: `Bearer ${adminLogin.data.token}` }
      });
      
      console.log('✅ Admin heatmap response:', heatmapResponse.data);
      console.log('Data length:', heatmapResponse.data.length);
      if (heatmapResponse.data.length > 0) {
        console.log('Sample data:', heatmapResponse.data[0]);
      }
    } catch (error) {
      console.log('❌ Admin heatmap error:', error.response?.data);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testHeatmap();
