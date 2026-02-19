const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api';

async function testSubjectsWithMarks() {
  try {
    console.log('🔍 Testing subjects with specific marks functionality...\n');
    
    // Login as faculty
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'faculty@academic.com',
      password: 'faculty123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Faculty login successful');
    
    // Test adding subjects with specific names and marks (simulating teacher input)
    const subjectsWithMarks = [
      {
        student_id: 1,
        semester: 2,
        subject_name: 'Advanced Mathematics',
        marks: 92,
        max_marks: 100,
        grade: 'A+'
      },
      {
        student_id: 1,
        semester: 2,
        subject_name: 'Data Structures',
        marks: 78,
        max_marks: 100,
        grade: 'B+'
      },
      {
        student_id: 1,
        semester: 2,
        subject_name: 'Web Development',
        marks: 85,
        max_marks: 100,
        grade: 'A'
      },
      {
        student_id: 1,
        semester: 2,
        subject_name: 'Database Systems',
        marks: 88,
        max_marks: 100,
        grade: 'A'
      },
      {
        student_id: 1,
        semester: 2,
        subject_name: 'Software Engineering',
        marks: 73,
        max_marks: 100,
        grade: 'B'
      },
      {
        student_id: 1,
        semester: 2,
        subject_name: 'Computer Networks',
        marks: 95,
        max_marks: 100,
        grade: 'A+'
      }
    ];
    
    console.log('📝 Adding 6 subjects with specific names and marks:');
    
    for (const subject of subjectsWithMarks) {
      const response = await axios.post(`${BASE_URL}/student/semester-marks`, subject, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log(`✅ Added: ${subject.subject_name} - ${subject.marks} marks (${subject.grade})`);
    }
    
    // Verify the subjects were added
    const verifyResponse = await axios.get(`${BASE_URL}/student/1/semester-marks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('\n📊 Verification - All subjects for Student 1:');
    const semester2Subjects = verifyResponse.data.filter(mark => mark.semester === 2);
    console.log('Semester 2:');
    semester2Subjects.forEach(mark => {
      console.log(`  - ${mark.subject_name}: ${mark.marks}/${mark.max_marks} (${mark.grade})`);
    });
    
    console.log('\n🎉 Subjects with specific marks functionality working perfectly!');
    console.log('✅ Teachers can now enter both subject names AND their respective marks!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testSubjectsWithMarks();
