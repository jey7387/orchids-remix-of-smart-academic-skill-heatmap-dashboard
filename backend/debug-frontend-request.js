const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api';

async function debugFrontendRequest() {
  try {
    console.log('🔍 Debugging frontend request format...\n');
    
    // Login as faculty
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'faculty@academic.com',
      password: 'faculty123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Faculty login successful');
    
    // Test different request formats like frontend sends
    const testCases = [
      {
        name: 'Frontend format 1 (camelCase)',
        data: {
          studentId: 1,
          semester: 1,
          subjectName: 'Test Subject',
          marks: 85,
          maxMarks: 100,
          grade: 'A'
        }
      },
      {
        name: 'Frontend format 2 (snake_case)',
        data: {
          student_id: 1,
          semester: 1,
          subject_name: 'Test Subject',
          marks: 85,
          max_marks: 100,
          grade: 'A'
        }
      },
      {
        name: 'Frontend format 3 (mixed)',
        data: {
          student_id: 1,
          semester: 1,
          subject_name: 'Test Subject',
          marks: 85,
          maxMarks: 100,
          grade: 'A'
        }
      }
    ];
    
    for (const testCase of testCases) {
      console.log(`\n📝 Testing: ${testCase.name}`);
      console.log('Data:', testCase.data);
      
      try {
        const response = await axios.post(`${BASE_URL}/student/semester-marks`, testCase.data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Success:', response.data);
      } catch (error) {
        console.log('❌ Failed:', error.response?.data || error.message);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

debugFrontendRequest();
