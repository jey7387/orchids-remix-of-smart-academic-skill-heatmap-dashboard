const axios = require('axios');

async function testServerStatus() {
  try {
    console.log('🔍 Testing server status...\n');
    
    const response = await axios.get('http://localhost:5006/api/health');
    console.log('✅ Server is running:', response.data);
    
    // Test login with different students
    const testStudents = [
      { email: 'student@academic.com', password: 'student123' },
      { email: 'jeyalakshmi.ad23@bitsathy.ac.in', password: 'student123' },
      { email: 'saro@gmail.com', password: 'student123' }
    ];
    
    for (const student of testStudents) {
      try {
        const loginResponse = await axios.post('http://localhost:5006/api/auth/login', student);
        console.log(`✅ ${student.email}: Login successful`);
      } catch (error) {
        console.log(`❌ ${student.email}: Login failed`);
      }
    }
    
    console.log('\n🎉 Server test complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Server not running:', error.message);
    process.exit(1);
  }
}

testServerStatus();
