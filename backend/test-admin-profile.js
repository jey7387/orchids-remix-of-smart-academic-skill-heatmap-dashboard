const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api';

async function testAdminProfile() {
  try {
    console.log('🔍 Testing admin profile and users...');
    
    // Login as admin
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@academic.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful!');
    
    // Test profile endpoint
    console.log('\n🧪 Testing admin profile...');
    try {
      const profileResponse = await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Admin profile:', profileResponse.data.user);
    } catch (error) {
      console.log('❌ Profile error:', error.response?.data);
    }
    
    // Test users endpoint
    console.log('\n🧪 Testing users endpoint...');
    try {
      const usersResponse = await axios.get(`${BASE_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Users response:', usersResponse.data);
      console.log('Users count:', usersResponse.data.users?.length || usersResponse.data.length);
    } catch (error) {
      console.log('❌ Users error:', error.response?.data);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testAdminProfile();
