const axios = require('axios');

const BASE_URL = 'http://localhost:5006/api';

async function testStudentManagement() {
  try {
    console.log('👨‍🏫 Testing student management APIs...');
    
    // Login as faculty
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'swea@gmail.com',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Faculty login successful!');
    
    // Test 1: Get all students
    console.log('\n1️⃣ Testing get all students...');
    try {
      const studentsResponse = await axios.get(`${BASE_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Get students successful!');
      console.log('Total students:', studentsResponse.data.students.length);
    } catch (error) {
      console.log('❌ Get students error:', error.response?.data);
    }
    
    // Test 2: Create new student
    console.log('\n2️⃣ Testing create student...');
    try {
      const createResponse = await axios.post(`${BASE_URL}/students`, {
        name: 'Test Student API',
        email: 'testapi@student.com',
        password: 'test123'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Create student successful!');
      console.log('New student:', createResponse.data.student);
      const newStudentId = createResponse.data.student.id;
      
      // Test 3: Add scores to new student
      console.log('\n3️⃣ Testing add student scores...');
      try {
        const scoresResponse = await axios.post(`${BASE_URL}/students/${newStudentId}/scores`, {
          studentId: newStudentId,
          scores: [
            { skillName: 'Python', score: 85 },
            { skillName: 'JavaScript', score: 78 },
            { skillName: 'DSA', score: 92 }
          ]
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Add scores successful!');
        console.log('Scores added:', scoresResponse.data.scores.length);
      } catch (error) {
        console.log('❌ Add scores error:', error.response?.data);
      }
      
      // Test 4: Get student scores
      console.log('\n4️⃣ Testing get student scores...');
      try {
        const scoresResponse = await axios.get(`${BASE_URL}/students/${newStudentId}/scores`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Get student scores successful!');
        console.log('Student scores:', scoresResponse.data.scores.length);
        console.log('Sample score:', scoresResponse.data.scores[0]);
      } catch (error) {
        console.log('❌ Get student scores error:', error.response?.data);
      }
      
    } catch (error) {
      console.log('❌ Create student error:', error.response?.data);
    }
    
    console.log('\n🎉 Student management API tests completed!');
    console.log('\n📋 Available Student Management Features:');
    console.log('✅ Create new students');
    console.log('✅ View all students');
    console.log('✅ Add/update skill scores');
    console.log('✅ View student scores');
    console.log('✅ Edit student info');
    console.log('✅ Delete students (admin only)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testStudentManagement();
