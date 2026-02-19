const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api';

async function testProfile() {
  try {
    console.log('🔍 Testing profile endpoint...');
    
    // Login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'student@academic.com',
      password: 'student123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful!');
    
    // Test profile endpoint
    console.log('\n🧪 Testing /auth/me endpoint...');
    try {
      const profileResponse = await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Profile response:', profileResponse.data);
      console.log('User data structure:', Object.keys(profileResponse.data));
    } catch (error) {
      console.log('❌ Profile error:', error.response?.data);
      console.log('Status:', error.response?.status);
    }
    
    // Test users endpoint
    console.log('\n🧪 Testing /auth/users endpoint...');
    try {
      const usersResponse = await axios.get(`${BASE_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Users response:', usersResponse.data);
      console.log('Users count:', usersResponse.data.users?.length || usersResponse.data.length);
    } catch (error) {
      console.log('❌ Users error:', error.response?.data);
      console.log('Status:', error.response?.status);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testProfile();
