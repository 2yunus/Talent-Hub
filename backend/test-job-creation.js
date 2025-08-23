const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data for job creation
const testJobData = {
  title: "Senior Full-Stack Developer",
  description: "We are looking for a talented full-stack developer to join our team. You will be responsible for developing new features, code review, and mentoring junior developers.",
  requirements: [
    "5+ years of experience in web development",
    "React and Node.js expertise",
    "PostgreSQL knowledge",
    "Experience with TypeScript",
    "Strong problem-solving skills"
  ],
  responsibilities: [
    "Develop new features and maintain existing codebase",
    "Perform code reviews and provide feedback",
    "Mentor junior developers",
    "Collaborate with cross-functional teams",
    "Write clean, maintainable code"
  ],
  salary: {
    min: 80000,
    max: 120000,
    currency: "USD"
  },
  location: "San Francisco, CA",
  type: "FULL_TIME",
  experience: "SENIOR",
  skills: ["JavaScript", "React", "Node.js", "PostgreSQL", "TypeScript"],
  benefits: ["Health insurance", "401k", "Remote work", "Flexible hours"],
  companyName: "TechCorp Inc.",
  companyLogo: "https://example.com/logo.png",
  isRemote: true
};

async function testJobCreation() {
  try {
    console.log('🚀 Testing Job Creation Endpoint...\n');
    
    // First, we need to create a user and get a token
    console.log('1. Creating test user...');
    const userData = {
      email: 'employer@test.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Employer',
      role: 'EMPLOYER',
      bio: 'HR Manager looking for talented developers'
    };
    
    const userResponse = await axios.post(`${BASE_URL}/auth/register`, userData);
    console.log('✅ User created successfully');
    
    // Login to get token
    console.log('\n2. Logging in to get token...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'employer@test.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token obtained');
    
    // Test job creation
    console.log('\n3. Testing job creation...');
    const jobResponse = await axios.post(`${BASE_URL}/jobs`, testJobData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Job created successfully!');
    console.log('Job ID:', jobResponse.data.job.id);
    console.log('Job Title:', jobResponse.data.job.title);
    console.log('Company:', jobResponse.data.job.companyName);
    console.log('Salary Range:', `$${jobResponse.data.job.salary.min} - $${jobResponse.data.job.salary.max} ${jobResponse.data.job.salary.currency}`);
    
    // Test getting all jobs
    console.log('\n4. Testing get all jobs...');
    const jobsResponse = await axios.get(`${BASE_URL}/jobs`);
    console.log('✅ Jobs retrieved successfully!');
    console.log('Total jobs:', jobsResponse.data.jobs.length);
    
    // Test getting the specific job
    console.log('\n5. Testing get job by ID...');
    const jobId = jobResponse.data.job.id;
    const singleJobResponse = await axios.get(`${BASE_URL}/jobs/${jobId}`);
    console.log('✅ Job retrieved by ID successfully!');
    console.log('Job Title:', singleJobResponse.data.job.title);
    
    console.log('\n🎉 All tests passed! Job creation endpoint is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 500) {
      console.log('\n🔍 This suggests an internal server error. Check the server logs for more details.');
    }
  }
}

// Run the test
testJobCreation();
