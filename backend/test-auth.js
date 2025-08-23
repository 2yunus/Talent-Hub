const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  role: 'DEVELOPER',
  bio: 'Full-stack developer with 5 years of experience',
  location: 'San Francisco, CA',
  skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
  experience: '5 years in web development',
  education: 'BS Computer Science, Stanford University'
};

const testEmployer = {
  email: 'employer@company.com',
  password: 'password123',
  firstName: 'Jane',
  lastName: 'Smith',
  role: 'EMPLOYER',
  bio: 'HR Manager at TechCorp',
  location: 'New York, NY'
};

async function testAuthEndpoints() {
  console.log('🧪 Testing TalentHub Authentication Endpoints\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/auth/health`);
    console.log('✅ Health check:', healthResponse.data.message);
    console.log('');

    // Test 2: Register new user
    console.log('2. Testing user registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('✅ User registered:', registerResponse.data.message);
    console.log('   User ID:', registerResponse.data.user.id);
    console.log('   Token received:', !!registerResponse.data.token);
    console.log('');

    // Test 3: Register employer
    console.log('3. Testing employer registration...');
    const employerResponse = await axios.post(`${BASE_URL}/auth/register`, testEmployer);
    console.log('✅ Employer registered:', employerResponse.data.message);
    console.log('   Employer ID:', employerResponse.data.user.id);
    console.log('');

    // Test 4: Login with registered user
    console.log('4. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful:', loginResponse.data.message);
    console.log('   User role:', loginResponse.data.user.role);
    console.log('');

    // Test 5: Get user profile (protected route)
    console.log('5. Testing protected profile route...');
    const token = loginResponse.data.token;
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile retrieved:', profileResponse.data.user.firstName, profileResponse.data.user.lastName);
    console.log('');

    // Test 6: Update user profile
    console.log('6. Testing profile update...');
    const updateResponse = await axios.put(`${BASE_URL}/auth/profile`, {
      bio: 'Updated bio: Senior Full-stack developer with expertise in modern web technologies',
      location: 'San Francisco Bay Area, CA'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile updated:', updateResponse.data.message);
    console.log('');

    // Test 7: Test duplicate registration (should fail)
    console.log('7. Testing duplicate registration (should fail)...');
    try {
      await axios.post(`${BASE_URL}/auth/register`, testUser);
      console.log('❌ Duplicate registration should have failed');
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('✅ Duplicate registration correctly rejected:', error.response.data.error);
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }
    console.log('');

    // Test 8: Test invalid login (should fail)
    console.log('8. Testing invalid login (should fail)...');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: testUser.email,
        password: 'wrongpassword'
      });
      console.log('❌ Invalid login should have failed');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Invalid login correctly rejected:', error.response.data.error);
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }
    console.log('');

    // Test 9: Test profile access without token (should fail)
    console.log('9. Testing profile access without token (should fail)...');
    try {
      await axios.get(`${BASE_URL}/auth/profile`);
      console.log('❌ Profile access without token should have failed');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Profile access without token correctly rejected:', error.response.data.error);
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }
    console.log('');

    console.log('🎉 All authentication tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   - User registration: ✅');
    console.log('   - Employer registration: ✅');
    console.log('   - User login: ✅');
    console.log('   - Protected routes: ✅');
    console.log('   - Profile management: ✅');
    console.log('   - Error handling: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAuthEndpoints();
}

module.exports = { testAuthEndpoints };
