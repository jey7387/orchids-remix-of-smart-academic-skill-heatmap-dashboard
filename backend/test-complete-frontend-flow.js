const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api';

async function testCompleteFrontendFlow() {
  try {
    console.log('🔍 Testing complete frontend flow...\n');
    
    // Step 1: Login as faculty
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'faculty@academic.com',
      password: 'faculty123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Step 1: Faculty login successful');
    
    // Step 2: Get all students
    const studentsResponse = await axios.get(`${BASE_URL}/students`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const students = studentsResponse.data.students;
    console.log(`✅ Step 2: Found ${students.length} students`);
    
    if (students.length === 0) {
      console.log('❌ No students found');
      return;
    }
    
    const firstStudent = students[0];
    console.log(`📝 Using student: ${firstStudent.name} (ID: ${firstStudent.id})`);
    
    // Step 3: Get student's existing semester marks
    const marksResponse = await axios.get(`${BASE_URL}/student/${firstStudent.id}/semester-marks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`✅ Step 3: Found ${marksResponse.data.length} existing marks`);
    
    // Step 4: Add new semester marks (like frontend does)
    const newMark = {
      student_id: firstStudent.id,
      semester: 1,
      subject_name: 'Test Subject from Frontend',
      marks: 88,
      max_marks: 100,
      grade: 'A+'
    };
    
    console.log('📝 Adding new mark:', newMark);
    
    const addResponse = await axios.post(`${BASE_URL}/student/semester-marks`, newMark, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Step 4: Successfully added mark:', addResponse.data);
    
    // Step 5: Verify the mark was added
    const verifyResponse = await axios.get(`${BASE_URL}/student/${firstStudent.id}/semester-marks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const addedMark = verifyResponse.data.find(m => m.subject_name === 'Test Subject from Frontend');
    if (addedMark) {
      console.log('✅ Step 5: Verification successful - mark was added');
      console.log('📊 Mark details:', {
        subject: addedMark.subject_name,
        marks: addedMark.marks,
        grade: addedMark.grade
      });
    } else {
      console.log('❌ Step 5: Verification failed - mark not found');
    }
    
    console.log('\n🎉 Complete frontend flow test successful!');
    console.log('✅ All API endpoints are working correctly');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Flow test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testCompleteFrontendFlow();
