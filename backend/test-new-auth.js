const fetch = require('node-fetch-commonjs');

const BASE_URL = 'http://localhost:5000/api';

async function testAuth() {
  try {
    console.log('Testing authentication for all roles...\n');

    // Test Admin Login
    console.log('1. Testing Admin Login:');
    const adminResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'admin@academic.com', 
        password: 'admin123',
        role: 'admin'
      })
    });
    const adminData = await adminResponse.json();
    console.log('Admin login:', adminResponse.ok ? 'SUCCESS' : 'FAILED');
    if (adminResponse.ok) {
      console.log('Redirect path:', adminData.redirectPath);
      console.log('User role:', adminData.user.role);
    }

    // Test Faculty Login
    console.log('\n2. Testing Faculty Login:');
    const facultyResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'faculty@academic.com', 
        password: 'faculty123',
        role: 'faculty'
      })
    });
    const facultyData = await facultyResponse.json();
    console.log('Faculty login:', facultyResponse.ok ? 'SUCCESS' : 'FAILED');
    if (facultyResponse.ok) {
      console.log('Redirect path:', facultyData.redirectPath);
      console.log('User role:', facultyData.user.role);
    }

    // Test Student Login
    console.log('\n3. Testing Student Login:');
    const studentResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'student@academic.com', 
        password: 'student123',
        role: 'student'
      })
    });
    const studentData = await studentResponse.json();
    console.log('Student login:', studentResponse.ok ? 'SUCCESS' : 'FAILED');
    if (studentResponse.ok) {
      console.log('Redirect path:', studentData.redirectPath);
      console.log('User role:', studentData.user.role);
    }

    // Test Dashboard Access
    if (adminResponse.ok) {
      console.log('\n4. Testing Admin Dashboard Access:');
      const dashboardResponse = await fetch(`${BASE_URL}/dashboard/admin`, {
        headers: { 'Authorization': `Bearer ${adminData.token}` }
      });
      console.log('Admin dashboard access:', dashboardResponse.ok ? 'SUCCESS' : 'FAILED');
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        console.log('Dashboard features:', dashboardData.features.length);
      }
    }

    console.log('\nAuthentication tests completed!');
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
}

testAuth();
