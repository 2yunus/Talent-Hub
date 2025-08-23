const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let employerToken, developerToken, jobId, applicationId;

// Test data
const testEmployer = {
  email: 'employer@test.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Employer',
  role: 'EMPLOYER'
};

const testDeveloper = {
  email: 'developer@test.com',
  password: 'password123',
  firstName: 'Jane',
  lastName: 'Developer',
  role: 'DEVELOPER'
};

const testJob = {
  title: 'Senior React Developer',
  description: 'We are looking for a talented React developer to join our team...',
  requirements: ['5+ years of React experience', 'TypeScript knowledge', 'Team collaboration skills'],
  responsibilities: ['Develop new features', 'Code review', 'Mentor junior developers'],
  salary: { min: 80000, max: 120000, currency: 'USD' },
  location: 'San Francisco, CA',
  type: 'FULL_TIME',
  experience: 'SENIOR',
  skills: ['React', 'TypeScript', 'Node.js'],
  benefits: ['Health insurance', '401k', 'Remote work'],
  companyName: 'Test Company Inc.',
  isRemote: true
};

const testApplication = {
  coverLetter: 'I am excited to apply for this Senior React Developer position. I have 6 years of experience...',
  resume: 'https://example.com/resume.pdf',
  portfolio: 'https://github.com/janedev'
};

async function testApplications() {
  try {
    console.log('🚀 Testing TalentHub Application System...\n');

    // 1. Register employer
    console.log('1. Registering employer...');
    const employerResponse = await axios.post(`${BASE_URL}/auth/register`, testEmployer);
    console.log('✅ Employer registered:', employerResponse.data.message);

    // 2. Register developer
    console.log('\n2. Registering developer...');
    const developerResponse = await axios.post(`${BASE_URL}/auth/register`, testDeveloper);
    console.log('✅ Developer registered:', developerResponse.data.message);

    // 3. Login employer
    console.log('\n3. Logging in employer...');
    const employerLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmployer.email,
      password: testEmployer.password
    });
    employerToken = employerLoginResponse.data.token;
    console.log('✅ Employer logged in');

    // 4. Login developer
    console.log('\n4. Logging in developer...');
    const developerLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testDeveloper.email,
      password: testDeveloper.password
    });
    developerToken = developerLoginResponse.data.token;
    console.log('✅ Developer logged in');

    // 5. Create a job (employer)
    console.log('\n5. Creating a job...');
    const jobResponse = await axios.post(`${BASE_URL}/jobs`, testJob, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    jobId = jobResponse.data.job.id;
    console.log('✅ Job created:', jobResponse.data.job.title);

    // 6. Apply for the job (developer)
    console.log('\n6. Applying for the job...');
    const applicationResponse = await axios.post(`${BASE_URL}/applications`, {
      jobId,
      ...testApplication
    }, {
      headers: { Authorization: `Bearer ${developerToken}` }
    });
    applicationId = applicationResponse.data.application.id;
    console.log('✅ Application submitted:', applicationResponse.data.message);

    // 7. Get applications for the job (employer)
    console.log('\n7. Getting applications for the job...');
    const jobApplicationsResponse = await axios.get(`${BASE_URL}/applications/job/${jobId}`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('✅ Job applications retrieved:', jobApplicationsResponse.data.applications.length, 'applications');

    // 8. Get developer's applications
    console.log('\n8. Getting developer\'s applications...');
    const myApplicationsResponse = await axios.get(`${BASE_URL}/applications/my`, {
      headers: { Authorization: `Bearer ${developerToken}` }
    });
    console.log('✅ Developer applications retrieved:', myApplicationsResponse.data.applications.length, 'applications');

    // 9. Update application status (employer)
    console.log('\n9. Updating application status...');
    const statusUpdateResponse = await axios.patch(`${BASE_URL}/applications/${applicationId}/status`, {
      status: 'REVIEWING'
    }, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('✅ Application status updated:', statusUpdateResponse.data.message);

    // 10. Get application by ID
    console.log('\n10. Getting application by ID...');
    const applicationByIdResponse = await axios.get(`${BASE_URL}/applications/${applicationId}`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('✅ Application retrieved:', applicationByIdResponse.data.application.status);

    // 11. Withdraw application (developer)
    console.log('\n11. Withdrawing application...');
    const withdrawResponse = await axios.patch(`${BASE_URL}/applications/${applicationId}/withdraw`, {}, {
      headers: { Authorization: `Bearer ${developerToken}` }
    });
    console.log('✅ Application withdrawn:', withdrawResponse.data.message);

    console.log('\n🎉 All application system tests passed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Employer registration and login: ✅');
    console.log('- Developer registration and login: ✅');
    console.log('- Job creation: ✅');
    console.log('- Job application: ✅');
    console.log('- Viewing applications: ✅');
    console.log('- Status updates: ✅');
    console.log('- Application withdrawal: ✅');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data?.details) {
      console.error('Validation details:', error.response.data.details);
    }
  }
}

// Run the tests
testApplications();
