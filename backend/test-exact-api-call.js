const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api';

async function testExactAPICall() {
  try {
    console.log('🔍 Testing exact API call...\n');
    
    // Login as faculty
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'faculty@academic.com',
      password: 'faculty123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Faculty login successful');
    
    // Test exact same data that frontend sends
    const exactFrontendData = {
      student_id: 16,
      semester: 1,
      subject_name: 'Test Subject from Frontend',
      marks: 88,
      max_marks: 100,
      grade: 'A+'
    };
    
    console.log('📝 Sending exact data:', exactFrontendData);
    
    // Make the exact same API call
    const response = await axios.post(`${BASE_URL}/student/semester-marks`, exactFrontendData, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ API call successful:', response.data);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ API call failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Headers:', error.response?.config?.headers);
    process.exit(1);
  }
}

testExactAPICall();
