const http = require('http');

const BASE_URL = 'localhost:5000';

function makeRequest(path, method, data, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ ok: res.statusCode === 200, data: jsonBody, status: res.statusCode });
        } catch (e) {
          resolve({ ok: res.statusCode === 200, data: body, status: res.statusCode });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testAuth() {
  try {
    console.log('Testing authentication for all roles...\n');

    // Test Admin Login
    console.log('1. Testing Admin Login:');
    const adminResponse = await makeRequest('/api/auth/login', 'POST', {
      email: 'admin@academic.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Admin login:', adminResponse.ok ? 'SUCCESS' : 'FAILED');
    if (adminResponse.ok) {
      console.log('Redirect path:', adminResponse.data.redirectPath);
      console.log('User role:', adminResponse.data.user.role);
    } else {
      console.log('Error:', adminResponse.data);
    }

    // Test Faculty Login
    console.log('\n2. Testing Faculty Login:');
    const facultyResponse = await makeRequest('/api/auth/login', 'POST', {
      email: 'faculty@academic.com',
      password: 'faculty123',
      role: 'faculty'
    });
    console.log('Faculty login:', facultyResponse.ok ? 'SUCCESS' : 'FAILED');
    if (facultyResponse.ok) {
      console.log('Redirect path:', facultyResponse.data.redirectPath);
      console.log('User role:', facultyResponse.data.user.role);
    } else {
      console.log('Error:', facultyResponse.data);
    }

    // Test Student Login
    console.log('\n3. Testing Student Login:');
    const studentResponse = await makeRequest('/api/auth/login', 'POST', {
      email: 'student@academic.com',
      password: 'student123',
      role: 'student'
    });
    console.log('Student login:', studentResponse.ok ? 'SUCCESS' : 'FAILED');
    if (studentResponse.ok) {
      console.log('Redirect path:', studentResponse.data.redirectPath);
      console.log('User role:', studentResponse.data.user.role);
    } else {
      console.log('Error:', studentResponse.data);
    }

    // Test Dashboard Access
    if (adminResponse.ok) {
      console.log('\n4. Testing Admin Dashboard Access:');
      const dashboardResponse = await makeRequest('/api/dashboard/admin', 'GET', null, adminResponse.data.token);
      console.log('Admin dashboard access:', dashboardResponse.ok ? 'SUCCESS' : 'FAILED');
      if (dashboardResponse.ok) {
        console.log('Dashboard features:', dashboardResponse.data.features.length);
        console.log('Statistics:', dashboardResponse.data.statistics);
      } else {
        console.log('Error:', dashboardResponse.data);
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
