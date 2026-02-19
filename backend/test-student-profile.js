const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api';

async function testStudentProfile() {
  try {
    console.log('🔍 Testing student profile enhancements...\n');
    
    // Login as student
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'student@academic.com',
      password: 'student123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Student login successful!');
    
    // Test profile endpoint
    console.log('\n👤 Testing profile endpoint...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Profile data:');
    console.log('Name:', profileResponse.data.user.name);
    console.log('Email:', profileResponse.data.user.email);
    console.log('Year:', profileResponse.data.user.year);
    console.log('Semester:', profileResponse.data.user.semester);
    console.log('Department:', profileResponse.data.user.department);
    console.log('Roll Number:', profileResponse.data.user.roll_number);
    console.log('Batch:', profileResponse.data.user.batch);
    
    // Test semester marks endpoint
    console.log('\n📊 Testing semester marks endpoint...');
    const marksResponse = await axios.get(`${BASE_URL}/student/semester-marks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Semester marks:');
    console.log('Total marks:', marksResponse.data.length);
    
    // Group by semester
    const marksBySemester = marksResponse.data.reduce((acc, mark) => {
      if (!acc[mark.semester]) {
        acc[mark.semester] = [];
      }
      acc[mark.semester].push(mark);
      return acc;
    }, {});
    
    Object.entries(marksBySemester).forEach(([semester, marks]) => {
      console.log(`\nSemester ${semester}:`);
      marks.forEach(mark => {
        console.log(`  - ${mark.subject_name}: ${mark.marks}/${mark.max_marks} (${mark.grade})`);
      });
    });
    
    console.log('\n🎉 Student profile test complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testStudentProfile();
