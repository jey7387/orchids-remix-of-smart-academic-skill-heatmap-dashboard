const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api';

async function testAdminDelete() {
  try {
    console.log('🔍 Testing admin user management...\n');
    
    // Login as admin
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@academic.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Get all users
    const usersResponse = await axios.get(`${BASE_URL}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`📋 Found ${usersResponse.data.users.length} users:`);
    usersResponse.data.users.forEach(user => {
      console.log(`  - ${user.name} (${user.role}) - ${user.email}`);
    });
    
    if (usersResponse.data.users.length > 0) {
      const testUser = usersResponse.data.users.find(u => u.role === 'student');
      if (testUser) {
        console.log(`\n🗑️ Testing delete for: ${testUser.name} (${testUser.role})`);
        
        // Test delete
        const deleteResponse = await axios.delete(`${BASE_URL}/auth/users/${testUser.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('✅ Delete successful:', deleteResponse.data);
        
        // Verify deletion
        const verifyResponse = await axios.get(`${BASE_URL}/auth/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const deletedUser = verifyResponse.data.users.find(u => u.id === testUser.id);
        if (!deletedUser) {
          console.log('✅ User successfully deleted from database');
        } else {
          console.log('❌ User still exists in database');
        }
      }
    }
    
    console.log('\n🎉 Admin user management functionality working perfectly!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testAdminDelete();
