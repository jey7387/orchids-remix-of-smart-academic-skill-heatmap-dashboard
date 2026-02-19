const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api';

async function debugJeyLogin() {
  try {
    console.log('🔍 Debugging jey login...\n');
    
    // Test login for jeyalaks@bitsathy.ac.in
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'jeyalakshmi.ad23@bitsathy.ac.in',
      password: 'student123'
    });
    
    console.log('Login response:', loginResponse.data);
    console.log('Status:', loginResponse.status);
    
    if (loginResponse.data.token) {
      console.log('✅ Login successful, testing profile...');
      
      const profileResponse = await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${loginResponse.data.token}` }
      });
      
      console.log('Profile response:', profileResponse.data);
      console.log('User data:', profileResponse.data.user);
    } else {
      console.log('❌ Login failed:', loginResponse.data);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

debugJeyLogin();
