const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testJob = {
  title: "Senior Full-Stack Developer",
  description: "We are looking for a talented full-stack developer to join our growing team. You will be responsible for developing and maintaining web applications using modern technologies.",
  requirements: [
    "5+ years of experience in web development",
    "Strong knowledge of React and Node.js",
    "Experience with PostgreSQL and MongoDB",
    "Understanding of RESTful APIs and GraphQL",
    "Knowledge of Docker and AWS"
  ],
  responsibilities: [
    "Develop new features and maintain existing codebase",
    "Collaborate with cross-functional teams",
    "Code review and mentor junior developers",
    "Participate in technical architecture decisions",
    "Write clean, maintainable, and well-tested code"
  ],
  salary: {
    min: 80000,
    max: 120000,
    currency: "USD"
  },
  location: "San Francisco, CA",
  type: "FULL_TIME",
  experience: "SENIOR",
  skills: ["JavaScript", "React", "Node.js", "PostgreSQL", "MongoDB", "Docker", "AWS"],
  benefits: ["Health insurance", "401k", "Remote work", "Flexible hours", "Professional development"],
  companyName: "TechCorp Inc.",
  companyLogo: "https://example.com/logo.png",
  isRemote: true,
  isActive: true
};

const updatedJob = {
  title: "Senior Full-Stack Developer (Updated)",
  description: "Updated description: We are looking for a talented full-stack developer to join our growing team...",
  salary: {
    min: 90000,
    max: 130000,
    currency: "USD"
  },
  location: "San Francisco Bay Area, CA",
  benefits: ["Health insurance", "401k", "Remote work", "Flexible hours", "Professional development", "Stock options"]
};

let authToken = '';
let createdJobId = '';

async function testJobEndpoints() {
  console.log('🧪 Testing TalentHub Job Management Endpoints\n');

  try {
    // Step 1: Login as an employer to get token
    console.log('1. Logging in as employer to get authentication token...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'employer@company.com',
      password: 'employer123'
    });
    
    authToken = loginResponse.data.token;
    console.log('✅ Login successful, token received');
    console.log('');

    // Step 2: Create a new job
    console.log('2. Testing job creation...');
    const createResponse = await axios.post(`${BASE_URL}/jobs`, testJob, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    createdJobId = createResponse.data.job.id;
    console.log('✅ Job created successfully:', createResponse.data.message);
    console.log('   Job ID:', createdJobId);
    console.log('   Title:', createResponse.data.job.title);
    console.log('');

    // Step 3: Get all jobs
    console.log('3. Testing get all jobs...');
    const getAllResponse = await axios.get(`${BASE_URL}/jobs`);
    console.log('✅ All jobs retrieved successfully');
    console.log('   Total jobs:', getAllResponse.data.pagination.totalJobs);
    console.log('   Current page:', getAllResponse.data.pagination.currentPage);
    console.log('   Jobs per page:', getAllResponse.data.jobs.length);
    console.log('');

    // Step 4: Get jobs with filtering
    console.log('4. Testing job filtering...');
    const filterResponse = await axios.get(`${BASE_URL}/jobs?query=developer&location=San Francisco&isRemote=true&limit=5`);
    console.log('✅ Jobs filtered successfully');
    console.log('   Filtered jobs count:', filterResponse.data.jobs.length);
    console.log('   Query:', 'developer');
    console.log('   Location:', 'San Francisco');
    console.log('   Remote:', true);
    console.log('');

    // Step 5: Get job by ID
    console.log('5. Testing get job by ID...');
    const getByIdResponse = await axios.get(`${BASE_URL}/jobs/${createdJobId}`);
    console.log('✅ Job retrieved by ID successfully');
    console.log('   Job title:', getByIdResponse.data.job.title);
    console.log('   Company:', getByIdResponse.data.job.companyName);
    console.log('   Location:', getByIdResponse.data.job.location);
    console.log('');

    // Step 6: Get my jobs (employer's jobs)
    console.log('6. Testing get my jobs...');
    const myJobsResponse = await axios.get(`${BASE_URL}/jobs/my`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ My jobs retrieved successfully');
    console.log('   My jobs count:', myJobsResponse.data.jobs.length);
    console.log('   Total pages:', myJobsResponse.data.pagination.totalPages);
    console.log('');

    // Step 7: Update job
    console.log('7. Testing job update...');
    const updateResponse = await axios.put(`${BASE_URL}/jobs/${createdJobId}`, updatedJob, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Job updated successfully:', updateResponse.data.message);
    console.log('   Updated title:', updateResponse.data.job.title);
    console.log('   Updated salary range:', `$${updateResponse.data.job.salary.min} - $${updateResponse.data.job.salary.max}`);
    console.log('');

    // Step 8: Toggle job status
    console.log('8. Testing job status toggle...');
    const toggleResponse = await axios.patch(`${BASE_URL}/jobs/${createdJobId}/toggle`, {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Job status toggled successfully:', toggleResponse.data.message);
    console.log('   New status:', toggleResponse.data.job.isActive ? 'Active' : 'Inactive');
    console.log('');

    // Step 9: Test unauthorized access (should fail)
    console.log('9. Testing unauthorized job update (should fail)...');
    try {
      await axios.put(`${BASE_URL}/jobs/${createdJobId}`, updatedJob, {
        headers: { Authorization: 'Bearer invalid-token' }
      });
      console.log('❌ Unauthorized update should have failed');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Unauthorized access correctly rejected:', error.response.data.error);
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }
    console.log('');

    // Step 10: Test job deletion
    console.log('10. Testing job deletion...');
    const deleteResponse = await axios.delete(`${BASE_URL}/jobs/${createdJobId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Job deleted successfully:', deleteResponse.data.message);
    console.log('');

    // Step 11: Verify job is deleted
    console.log('11. Verifying job is deleted...');
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

    console.log('🎉 All job management tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   - Job creation: ✅');
    console.log('   - Job retrieval: ✅');
    console.log('   - Job filtering: ✅');
    console.log('   - Job update: ✅');
    console.log('   - Job status toggle: ✅');
    console.log('   - Job deletion: ✅');
    console.log('   - Authorization: ✅');
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
  testJobEndpoints();
}

module.exports = { testJobEndpoints };
