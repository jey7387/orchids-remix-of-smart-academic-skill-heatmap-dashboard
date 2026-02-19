const bcrypt = require('bcryptjs');

async function testLoginController() {
  try {
    console.log('🔍 Testing login controller directly...\n');
    
    // Test the exact same logic as auth controller
    const testUser = {
      email: 'jeyalaks@bitsathy.ac.in',
      password: 'student123'
    };
    
    // Simulate database user lookup
    const mockUser = {
      id: 1,
      name: 'jey',
      email: 'jeyalaks@bitsathy.ac.in',
      password: '$2b$12$K5L9v2M1Q9vK5l9MT8zI6v1Q', // Mock hashed password
      role: 'student'
    };
    
    // Test password verification
    const isValid = await bcrypt.compare('student123', mockUser.password);
    console.log('✅ Mock user found');
    console.log('✅ Password verification (student123):', isValid);
    
    if (isValid) {
      console.log('✅ Login should work!');
    } else {
      console.log('❌ Password verification failed');
      
      // Test with correct hash
      const correctHash = await bcrypt.hash('student123', 10);
      console.log('✅ Correct hash:', correctHash);
      console.log('❌ Stored hash:', mockUser.password);
      console.log('❌ Hashes do not match!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testLoginController();
