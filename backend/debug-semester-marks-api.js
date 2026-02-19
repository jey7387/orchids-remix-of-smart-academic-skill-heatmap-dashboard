const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api';

async function debugSemesterMarksAPI() {
  try {
    console.log('🔍 Debugging semester marks API...\n');
    
    // Login as faculty
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'faculty@academic.com',
      password: 'faculty123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Faculty login successful');
    
    // Test adding semester marks
    const marksData = {
      studentId: 1,
      semester: 1,
      subjectName: 'Test Subject',
      marks: 85,
      maxMarks: 100,
      grade: 'A'
    };
    
    console.log('📝 Adding marks:', marksData);
    
    const response = await axios.post(`${BASE_URL}/student/semester-marks`, marksData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Success:', response.data);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response?.status === 500) {
      console.log('🔍 This is a server error - checking backend logs...');
    }
    process.exit(1);
  }
}

debugSemesterMarksAPI();
