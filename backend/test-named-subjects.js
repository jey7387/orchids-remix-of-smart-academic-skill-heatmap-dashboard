const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api';

async function testNamedSubjects() {
  try {
    console.log('🔍 Testing named subjects functionality...\n');
    
    // Login as faculty
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'faculty@academic.com',
      password: 'faculty123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Faculty login successful');
    
    // Test adding subjects with specific names
    const namedSubjects = [
      {
        student_id: 1,
        semester: 1,
        subject_name: 'Mathematics',
        marks: 85,
        max_marks: 100,
        grade: 'A'
      },
      {
        student_id: 1,
        semester: 1,
        subject_name: 'Physics',
        marks: 78,
        max_marks: 100,
        grade: 'B+'
      },
      {
        student_id: 1,
        semester: 1,
        subject_name: 'Chemistry',
        marks: 92,
        max_marks: 100,
        grade: 'A+'
      },
      {
        student_id: 1,
        semester: 1,
        subject_name: 'Computer Science',
        marks: 88,
        max_marks: 100,
        grade: 'A'
      },
      {
        student_id: 1,
        semester: 1,
        subject_name: 'English',
        marks: 76,
        max_marks: 100,
        grade: 'B+'
      },
      {
        student_id: 1,
        semester: 1,
        subject_name: 'Physical Education',
        marks: 95,
        max_marks: 100,
        grade: 'A+'
      }
    ];
    
    console.log('📝 Adding 6 named subjects:');
    
    for (const subject of namedSubjects) {
      const response = await axios.post(`${BASE_URL}/student/semester-marks`, subject, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log(`✅ Added: ${subject.subject_name} - ${subject.marks} marks (${subject.grade})`);
    }
    
    // Verify the subjects were added
    const verifyResponse = await axios.get(`${BASE_URL}/student/1/semester-marks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('\n📊 Verification - All subjects for Student 1, Semester 1:');
    verifyResponse.data.forEach(mark => {
      console.log(`  - ${mark.subject_name}: ${mark.marks}/${mark.max_marks} (${mark.grade})`);
    });
    
    console.log('\n🎉 Named subjects functionality working perfectly!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testNamedSubjects();
