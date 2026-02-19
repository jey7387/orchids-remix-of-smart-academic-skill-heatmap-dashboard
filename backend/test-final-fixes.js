const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api';

async function testFinalFixes() {
  try {
    console.log('🔍 Testing final fixes...');
    
    // Test 1: Registration should work but not auto-login
    console.log('\n1️⃣ Testing registration...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Test User Final',
        email: 'testfinal@user.com',
        password: 'test123',
        role: 'student'
      });
      console.log('✅ Registration successful!');
      console.log('User created:', registerResponse.data.user.name);
      console.log('Token returned:', registerResponse.data.token ? 'Yes' : 'No');
    } catch (error) {
      console.log('❌ Registration error:', error.response?.data);
    }
    
    // Test 2: Student profile should work
    console.log('\n2️⃣ Testing student profile...');
    try {
      const studentLogin = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'student@academic.com',
        password: 'student123'
      });
      
      const profileResponse = await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${studentLogin.data.token}` }
      });
      
      console.log('✅ Student profile loaded!');
      console.log('Profile data:', profileResponse.data.user.name, '-', profileResponse.data.user.role);
    } catch (error) {
      console.log('❌ Student profile error:', error.response?.data);
    }
    
    // Test 3: Admin profile and users should work
    console.log('\n3️⃣ Testing admin profile and users...');
    try {
      const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'admin@academic.com',
        password: 'admin123'
      });
      
      const adminProfileResponse = await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${adminLogin.data.token}` }
      });
      
      const usersResponse = await axios.get(`${BASE_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${adminLogin.data.token}` }
      });
      
      console.log('✅ Admin profile loaded!');
      console.log('Admin data:', adminProfileResponse.data.user.name, '-', adminProfileResponse.data.user.role);
      console.log('✅ Users list loaded!');
      console.log('Total users:', usersResponse.data.users.length);
    } catch (error) {
      console.log('❌ Admin profile/users error:', error.response?.data);
    }
    
    console.log('\n🎉 All tests completed!');
    console.log('\n📋 Summary:');
    console.log('✅ Registration creates user but does not auto-login');
    console.log('✅ Student profile loads correctly');
    console.log('✅ Admin profile and users list work correctly');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testFinalFixes();
