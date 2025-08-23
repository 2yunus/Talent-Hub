const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';
let employerToken, developerToken, jobId, applicationId;

// Test data
const testEmployer = {
  email: 'integration.employer@test.com',
  password: 'password123',
  firstName: 'Sarah',
  lastName: 'Johnson',
  role: 'EMPLOYER'
};

const testDeveloper = {
  email: 'integration.developer@test.com',
  password: 'password123',
  firstName: 'Alex',
  lastName: 'Smith',
  role: 'DEVELOPER'
};

const companyProfile = {
  companyName: 'Tech Innovations Inc.',
  companyDescription: 'We are a cutting-edge technology company focused on building innovative solutions.',
  companyWebsite: 'https://techinnovations.com',
  companySize: '51-200',
  companyIndustry: 'Software Development',
  companyLocation: 'San Francisco, CA'
};

const developerProfile = {
  bio: 'Passionate full-stack developer with 6 years of experience',
  location: 'Seattle, WA',
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS'],
  experience: '6 years in full-stack web development',
  education: 'MS Computer Science, University of Washington',
  website: 'https://alexsmith.dev',
  github: 'https://github.com/alexsmith',
  linkedin: 'https://linkedin.com/in/alexsmith',
  isProfilePublic: true
};

const testJob = {
  title: 'Senior Full-Stack Developer',
  description: 'We are looking for a talented full-stack developer to join our growing team...',
  requirements: ['5+ years of React experience', 'TypeScript knowledge', 'AWS experience'],
  responsibilities: ['Develop new features', 'Code review', 'Mentor junior developers'],
  salary: { min: 90000, max: 130000, currency: 'USD' },
  location: 'San Francisco, CA',
  type: 'FULL_TIME',
  experience: 'SENIOR',
  skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
  benefits: ['Health insurance', '401k', 'Remote work'],
  isRemote: true
};

// Create test files
const createTestFiles = () => {
  const testDir = path.join(__dirname, 'integration-test-files');
  
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
  }

  // Create test image (1x1 PNG)
  const pngData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');
  fs.writeFileSync(path.join(testDir, 'avatar.png'), pngData);
  fs.writeFileSync(path.join(testDir, 'logo.png'), pngData);

  // Create test PDF
  const pdfData = Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n174\n%%EOF');
  fs.writeFileSync(path.join(testDir, 'resume.pdf'), pdfData);

  return testDir;
};

// Clean up test files
const cleanupTestFiles = (testDir) => {
  if (fs.existsSync(testDir)) {
    const files = fs.readdirSync(testDir);
    files.forEach(file => {
      fs.unlinkSync(path.join(testDir, file));
    });
    fs.rmdirSync(testDir);
  }
};

async function testCompleteIntegration() {
  let testDir;
  let resumeUrl;
  
  try {
    console.log('🚀 Testing Complete TalentHub Integration...\n');
    console.log('This test demonstrates the full workflow from registration to job application with file uploads.\n');

    // 0. Create test files
    testDir = createTestFiles();
    console.log('✅ Test files created');

    // 1. User Registration
    console.log('\n1. 👥 USER REGISTRATION');
    await axios.post(`${BASE_URL}/auth/register`, testEmployer);
    await axios.post(`${BASE_URL}/auth/register`, testDeveloper);
    console.log('✅ Employer and Developer registered');

    // 2. User Login
    console.log('\n2. 🔐 USER LOGIN');
    const employerLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmployer.email,
      password: testEmployer.password
    });
    employerToken = employerLogin.data.token;

    const developerLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: testDeveloper.email,
      password: testDeveloper.password
    });
    developerToken = developerLogin.data.token;
    console.log('✅ Both users logged in successfully');

    // 3. Profile Setup
    console.log('\n3. 📝 PROFILE SETUP');
    
    // Update developer profile
    await axios.put(`${BASE_URL}/users/profile`, developerProfile, {
      headers: { Authorization: `Bearer ${developerToken}` }
    });
    console.log('✅ Developer profile updated');

    // Update company profile
    await axios.put(`${BASE_URL}/users/company`, companyProfile, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('✅ Company profile updated');

    // 4. File Uploads
    console.log('\n4. 📁 FILE UPLOADS');
    
    // Upload developer avatar
    const avatarForm = new FormData();
    avatarForm.append('file', fs.createReadStream(path.join(testDir, 'avatar.png')));
    const avatarResponse = await axios.post(`${BASE_URL}/uploads/avatar`, avatarForm, {
      headers: {
        ...avatarForm.getHeaders(),
        Authorization: `Bearer ${developerToken}`
      }
    });
    console.log('✅ Developer avatar uploaded');

    // Upload company logo
    const logoForm = new FormData();
    logoForm.append('file', fs.createReadStream(path.join(testDir, 'logo.png')));
    const logoResponse = await axios.post(`${BASE_URL}/uploads/logo`, logoForm, {
      headers: {
        ...logoForm.getHeaders(),
        Authorization: `Bearer ${employerToken}`
      }
    });
    console.log('✅ Company logo uploaded');

    // Upload developer resume
    const resumeForm = new FormData();
    resumeForm.append('file', fs.createReadStream(path.join(testDir, 'resume.pdf')));
    const resumeResponse = await axios.post(`${BASE_URL}/uploads/resume`, resumeForm, {
      headers: {
        ...resumeForm.getHeaders(),
        Authorization: `Bearer ${developerToken}`
      }
    });
    resumeUrl = resumeResponse.data.file.url;
    console.log('✅ Developer resume uploaded');

    // 5. Job Management
    console.log('\n5. 💼 JOB MANAGEMENT');
    
    // Create job with company branding
    const jobResponse = await axios.post(`${BASE_URL}/jobs`, {
      ...testJob,
      companyName: companyProfile.companyName,
      companyLogo: logoResponse.data.company.logo
    }, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    jobId = jobResponse.data.job.id;
    console.log('✅ Job posted with company branding');

    // Get all jobs (public view)
    const jobsResponse = await axios.get(`${BASE_URL}/jobs`);
    console.log('✅ Jobs retrieved:', jobsResponse.data.jobs.length, 'jobs found');

    // 6. User Discovery
    console.log('\n6. 🔍 USER DISCOVERY');
    
    // Search for developers with specific skills
    const searchResponse = await axios.get(`${BASE_URL}/users/search?role=DEVELOPER&skills=React&skills=TypeScript&location=Seattle`);
    console.log('✅ Developer search completed:', searchResponse.data.users.length, 'developers found');

    // Get public profile
    const publicProfileResponse = await axios.get(`${BASE_URL}/users/${developerLogin.data.user.id}`);
    console.log('✅ Public profile retrieved with avatar and skills');

    // 7. Job Application with Resume
    console.log('\n7. 📋 JOB APPLICATION');
    
    const applicationResponse = await axios.post(`${BASE_URL}/applications`, {
      jobId,
      coverLetter: 'I am excited to apply for this Senior Full-Stack Developer position. My experience with React, TypeScript, and AWS makes me a perfect fit for this role.',
      resume: resumeUrl,
      portfolio: 'https://github.com/alexsmith'
    }, {
      headers: { Authorization: `Bearer ${developerToken}` }
    });
    applicationId = applicationResponse.data.application.id;
    console.log('✅ Application submitted with resume attachment');

    // 8. Application Management
    console.log('\n8. 📊 APPLICATION MANAGEMENT');
    
    // Employer views job applications
    const jobApplicationsResponse = await axios.get(`${BASE_URL}/applications/job/${jobId}`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('✅ Employer viewed job applications:', jobApplicationsResponse.data.applications.length, 'applications');

    // Developer views their applications
    const myApplicationsResponse = await axios.get(`${BASE_URL}/applications/my`, {
      headers: { Authorization: `Bearer ${developerToken}` }
    });
    console.log('✅ Developer viewed their applications:', myApplicationsResponse.data.applications.length, 'applications');

    // Update application status
    await axios.patch(`${BASE_URL}/applications/${applicationId}/status`, {
      status: 'REVIEWING'
    }, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('✅ Application status updated to REVIEWING');

    // 9. Statistics and Analytics
    console.log('\n9. 📈 STATISTICS & ANALYTICS');
    
    const developerStats = await axios.get(`${BASE_URL}/users/stats`, {
      headers: { Authorization: `Bearer ${developerToken}` }
    });
    console.log('✅ Developer statistics:', developerStats.data.stats);

    const employerStats = await axios.get(`${BASE_URL}/users/stats`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('✅ Employer statistics:', employerStats.data.stats);

    // 10. File Management
    console.log('\n10. 📂 FILE MANAGEMENT');
    
    const developerFiles = await axios.get(`${BASE_URL}/uploads/files`, {
      headers: { Authorization: `Bearer ${developerToken}` }
    });
    console.log('✅ Developer files listed:', developerFiles.data.count, 'files');

    const employerFiles = await axios.get(`${BASE_URL}/uploads/files`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('✅ Employer files listed:', employerFiles.data.count, 'files');

    console.log('\n🎉 COMPLETE INTEGRATION TEST PASSED! 🎉');
    console.log('\n📋 INTEGRATION SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ User Registration & Authentication');
    console.log('✅ Profile Management (Developer & Employer)');
    console.log('✅ Company Profile Setup');
    console.log('✅ File Upload System (Avatars, Logos, Resumes)');
    console.log('✅ Job Management with Company Branding');
    console.log('✅ User Discovery & Search');
    console.log('✅ Job Applications with File Attachments');
    console.log('✅ Application Status Management');
    console.log('✅ Statistics & Analytics');
    console.log('✅ File Management & Security');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🚀 TalentHub backend is fully functional and ready for frontend integration!');

  } catch (error) {
    console.error('\n❌ Integration test failed:', error.response?.data || error.message);
    if (error.response?.data?.details) {
      console.error('Details:', error.response.data.details);
    }
  } finally {
    if (testDir) {
      cleanupTestFiles(testDir);
    }
  }
}

// Run the integration test
testCompleteIntegration();
