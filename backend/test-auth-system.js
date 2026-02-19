const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api';

async function testAuthSystem() {
  console.log('🧪 Testing Authentication System...\n');

  try {
    // Test 1: Login with existing user
    console.log('1️⃣ Testing Login with existing user...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@academic.com',
      password: 'admin123'
    });
    
    if (loginResponse.data.token && loginResponse.data.user) {
      console.log('✅ Login successful!');
      console.log(`   User: ${loginResponse.data.user.name} (${loginResponse.data.user.role})`);
      console.log(`   Token: ${loginResponse.data.token.substring(0, 20)}...`);
    } else {
      console.log('❌ Login failed - no token or user data');
    }

    // Test 2: Test protected route with token
    console.log('\n2️⃣ Testing Protected Route...');
    try {
      const profileResponse = await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${loginResponse.data.token}` }
      });
      
      if (profileResponse.data.user) {
        console.log('✅ Protected route access successful!');
        console.log(`   Profile: ${profileResponse.data.user.name}`);
      } else {
        console.log('❌ Protected route failed');
      }
    } catch (error) {
      console.log('❌ Protected route error:', error.response?.data?.error);
    }

    // Test 3: Test new user registration
    console.log('\n3️⃣ Testing User Registration...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Test Student',
        email: 'test@student.com',
        password: 'test123',
        role: 'student'
      });
      
      if (registerResponse.data.token && registerResponse.data.user) {
        console.log('✅ Registration successful!');
        console.log(`   New user: ${registerResponse.data.user.name} (${registerResponse.data.user.role})`);
      } else {
        console.log('❌ Registration failed');
      }
    } catch (error) {
      console.log('❌ Registration error:', error.response?.data?.error);
    }

    console.log('\n🎉 Authentication System Test Complete!');
    console.log('\n📋 Available Test Users:');
    console.log('   Admin: admin@academic.com / admin123');
    console.log('   Faculty: faculty@academic.com / faculty123');
    console.log('   Student: student@academic.com / student123');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.error || error.message);
  }
}

testAuthSystem();
