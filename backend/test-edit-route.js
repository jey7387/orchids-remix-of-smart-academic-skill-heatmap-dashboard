const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api';

async function testEditRoute() {
  try {
    console.log('🔍 Testing student edit route...\n');
    
    // Login as faculty
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'faculty@academic.com',
      password: 'faculty123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Faculty login successful!');
    
    // Test edit route
    console.log('\n📝 Testing /api/students/edit/14 route...');
    const editResponse = await axios.get(`${BASE_URL}/students/edit/14`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Edit route working!');
    console.log('Student data:', editResponse.data);
    
    console.log('\n🎉 Edit route test complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testEditRoute();
