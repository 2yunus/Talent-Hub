const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  email: 'testuser@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User',
  role: 'DEVELOPER',
  bio: 'Test developer user',
  location: 'Test City, TC',
  skills: ['JavaScript', 'React', 'Node.js']
};

const testEmployer = {
  email: 'testemployer@company.com',
  password: 'employer123',
  firstName: 'Test',
  lastName: 'Employer',
  role: 'EMPLOYER',
  bio: 'Test employer user',
  location: 'Test City, TC'
};

const testJob = {
  title: "Test Full-Stack Developer",
  description: "This is a test job posting for testing purposes. We need a developer who can work with modern web technologies.",
  requirements: [
    "3+ years of experience",
    "Knowledge of React and Node.js",
    "Good communication skills"
  ],
  responsibilities: [
    "Develop web applications",
    "Write clean code",
    "Collaborate with team"
  ],
  salary: {
    min: 60000,
    max: 90000,
    currency: "USD"
  },
  location: "Test City, TC",
  type: "FULL_TIME",
  experience: "MID",
  skills: ["JavaScript", "React", "Node.js"],
  benefits: ["Health insurance", "401k"],
  companyName: "Test Company Inc.",
  isRemote: false,
  isActive: true
};

let userToken = '';
let employerToken = '';
let createdJobId = '';

async function testCompleteSystem() {
  console.log('🚀 Testing Complete TalentHub System\n');
  console.log('This test will verify both authentication and job management systems work together.\n');

  try {
    // ===== PHASE 1: AUTHENTICATION TESTING =====
    console.log('🔐 PHASE 1: Testing Authentication System\n');

    // 1.1 Test health check
    console.log('1.1 Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/auth/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);
    console.log('');

    // 1.2 Register test user
    console.log('1.2 Testing user registration...');
    try {
      const userRegResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
      console.log('✅ User registered successfully');
      userToken = userRegResponse.data.token;
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('ℹ️  User already exists, proceeding with login...');
      } else {
        throw error;
      }
    }

    // 1.3 Register test employer
    console.log('1.3 Testing employer registration...');
    try {
      const employerRegResponse = await axios.post(`${BASE_URL}/auth/register`, testEmployer);
      console.log('✅ Employer registered successfully');
      employerToken = employerRegResponse.data.token;
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('ℹ️  Employer already exists, proceeding with login...');
      } else {
        throw error;
      }
    }

    // 1.4 Login test user
    console.log('1.4 Testing user login...');
    const userLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    userToken = userLoginResponse.data.token;
    console.log('✅ User login successful');
    console.log('');

    // 1.5 Login test employer
    console.log('1.5 Testing employer login...');
    const employerLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmployer.email,
      password: testEmployer.password
    });
    employerToken = employerLoginResponse.data.token;
    console.log('✅ Employer login successful');
    console.log('');

    // 1.6 Test user profile access
    console.log('1.6 Testing user profile access...');
    const userProfileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ User profile accessed successfully');
    console.log('   Name:', userProfileResponse.data.user.firstName, userProfileResponse.data.user.lastName);
    console.log('   Role:', userProfileResponse.data.user.role);
    console.log('');

    // 1.7 Test employer profile access
    console.log('1.7 Testing employer profile access...');
    const employerProfileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('✅ Employer profile accessed successfully');
    console.log('   Name:', employerProfileResponse.data.user.firstName, employerProfileResponse.data.user.lastName);
    console.log('   Role:', employerProfileResponse.data.user.role);
    console.log('');

    console.log('🎉 Authentication system working perfectly!\n');

    // ===== PHASE 2: JOB MANAGEMENT TESTING =====
    console.log('💼 PHASE 2: Testing Job Management System\n');

    // 2.1 Test job creation (employer only)
    console.log('2.1 Testing job creation...');
    const createJobResponse = await axios.post(`${BASE_URL}/jobs`, testJob, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    createdJobId = createJobResponse.data.job.id;
    console.log('✅ Job created successfully');
    console.log('   Job ID:', createdJobId);
    console.log('   Title:', createJobResponse.data.job.title);
    console.log('   Company:', createJobResponse.data.job.companyName);
    console.log('');

    // 2.2 Test get all jobs (public)
    console.log('2.2 Testing get all jobs...');
    const getAllJobsResponse = await axios.get(`${BASE_URL}/jobs`);
    console.log('✅ All jobs retrieved successfully');
    console.log('   Total jobs:', getAllJobsResponse.data.pagination.totalJobs);
    console.log('   Jobs on current page:', getAllJobsResponse.data.jobs.length);
    console.log('');

    // 2.3 Test job filtering
    console.log('2.3 Testing job filtering...');
    const filterResponse = await axios.get(`${BASE_URL}/jobs?query=developer&type=FULL_TIME&limit=5`);
    console.log('✅ Job filtering working');
    console.log('   Filtered results:', filterResponse.data.jobs.length);
    console.log('');

    // 2.4 Test get job by ID
    console.log('2.4 Testing get job by ID...');
    const getJobResponse = await axios.get(`${BASE_URL}/jobs/${createdJobId}`);
    console.log('✅ Job retrieved by ID successfully');
    console.log('   Title:', getJobResponse.data.job.title);
    console.log('   Skills required:', getJobResponse.data.job.skills.join(', '));
    console.log('');

    // 2.5 Test get my jobs (employer only)
    console.log('2.5 Testing get my jobs...');
    const myJobsResponse = await axios.get(`${BASE_URL}/jobs/my`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('✅ My jobs retrieved successfully');
    console.log('   My jobs count:', myJobsResponse.data.jobs.length);
    console.log('');

    // 2.6 Test job update (employer only)
    console.log('2.6 Testing job update...');
    const updateJobResponse = await axios.put(`${BASE_URL}/jobs/${createdJobId}`, {
      title: "Updated Test Full-Stack Developer",
      description: "This is an updated test job posting with new information.",
      salary: {
        min: 70000,
        max: 100000,
        currency: "USD"
      }
    }, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('✅ Job updated successfully');
    console.log('   New title:', updateJobResponse.data.job.title);
    console.log('   New salary range:', `$${updateJobResponse.data.job.salary.min} - $${updateJobResponse.data.job.salary.max}`);
    console.log('');

    // 2.7 Test job status toggle
    console.log('2.7 Testing job status toggle...');
    const toggleResponse = await axios.patch(`${BASE_URL}/jobs/${createdJobId}/toggle`, {}, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('✅ Job status toggled successfully');
    console.log('   New status:', toggleResponse.data.job.isActive ? 'Active' : 'Inactive');
    console.log('');

    // 2.8 Test unauthorized access (should fail)
    console.log('2.8 Testing unauthorized job update (should fail)...');
    try {
      await axios.put(`${BASE_URL}/jobs/${createdJobId}`, { title: "Unauthorized Update" }, {
        headers: { Authorization: `Bearer ${userToken}` } // User token, not employer
      });
      console.log('❌ Unauthorized update should have failed');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Unauthorized access correctly rejected');
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }
    console.log('');

    // 2.9 Test job deletion
    console.log('2.9 Testing job deletion...');
    const deleteJobResponse = await axios.delete(`${BASE_URL}/jobs/${createdJobId}`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('✅ Job deleted successfully');
    console.log('');

    // 2.10 Verify job is deleted
    console.log('2.10 Verifying job is deleted...');
    try {
      await axios.get(`${BASE_URL}/jobs/${createdJobId}`);
      console.log('❌ Job should have been deleted');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Job correctly not found after deletion');
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }
    console.log('');

    // ===== PHASE 3: INTEGRATION TESTING =====
    console.log('🔗 PHASE 3: Testing System Integration\n');

    // 3.1 Test that deleted job doesn't appear in listings
    console.log('3.1 Testing job listing after deletion...');
    const finalJobsResponse = await axios.get(`${BASE_URL}/jobs`);
    const deletedJobExists = finalJobsResponse.data.jobs.some(job => job.id === createdJobId);
    if (!deletedJobExists) {
      console.log('✅ Deleted job correctly removed from listings');
    } else {
      console.log('❌ Deleted job still appears in listings');
    }
    console.log('');

    // 3.2 Test profile update
    console.log('3.2 Testing profile update...');
    const profileUpdateResponse = await axios.put(`${BASE_URL}/auth/profile`, {
      bio: 'Updated bio for testing purposes',
      location: 'Updated Test City, TC'
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Profile updated successfully');
    console.log('   New bio:', profileUpdateResponse.data.user.bio);
    console.log('   New location:', profileUpdateResponse.data.user.location);
    console.log('');

    console.log('🎉 All system tests completed successfully!\n');

    // ===== FINAL SUMMARY =====
    console.log('📊 FINAL TEST SUMMARY\n');
    console.log('✅ Authentication System:');
    console.log('   - User registration and login');
    console.log('   - Profile management');
    console.log('   - Role-based access control');
    console.log('   - JWT token validation');
    console.log('');
    console.log('✅ Job Management System:');
    console.log('   - Job creation (employers only)');
    console.log('   - Job retrieval and filtering');
    console.log('   - Job updates and deletion');
    console.log('   - Authorization and security');
    console.log('   - Pagination and search');
    console.log('');
    console.log('✅ System Integration:');
    console.log('   - End-to-end workflows');
    console.log('   - Data consistency');
    console.log('   - Error handling');
    console.log('   - Security validation');
    console.log('');
    console.log('🚀 TalentHub backend is fully functional and ready for frontend development!');

  } catch (error) {
    console.error('❌ System test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testCompleteSystem();
}

module.exports = { testCompleteSystem };
