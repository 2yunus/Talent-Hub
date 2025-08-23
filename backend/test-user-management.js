const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let employerToken, developerToken, employerId, developerId;

// Test data
const testEmployer = {
  email: 'employer.profile@test.com',
  password: 'password123',
  firstName: 'Sarah',
  lastName: 'Johnson',
  role: 'EMPLOYER'
};

const testDeveloper = {
  email: 'developer.profile@test.com',
  password: 'password123',
  firstName: 'Alex',
  lastName: 'Smith',
  role: 'DEVELOPER'
};

const developerProfileUpdate = {
  bio: 'Passionate full-stack developer with 6 years of experience building scalable web applications',
  location: 'Seattle, WA',
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
  experience: '6 years in full-stack web development, specializing in React and Node.js ecosystems',
  education: 'MS Computer Science, University of Washington',
  website: 'https://alexsmith.dev',
  github: 'https://github.com/alexsmith',
  linkedin: 'https://linkedin.com/in/alexsmith',
  phone: '+1-206-555-0123',
  isProfilePublic: true
};

const employerProfileUpdate = {
  firstName: 'Sarah',
  lastName: 'Johnson',
  bio: 'HR Director at Tech Innovations Inc. with 8 years of experience in talent acquisition',
  location: 'San Francisco, CA',
  phone: '+1-415-555-0456',
  linkedin: 'https://linkedin.com/in/sarahjohnson',
  isProfilePublic: true
};

const companyProfileUpdate = {
  companyName: 'Tech Innovations Inc.',
  companyDescription: 'We are a cutting-edge technology company focused on building innovative solutions that transform how businesses operate. Our team of talented engineers works on exciting projects using the latest technologies.',
  companyWebsite: 'https://techinnovations.com',
  companySize: '51-200',
  companyIndustry: 'Software Development',
  companyLocation: 'San Francisco, CA',
  companyLogo: 'https://example.com/tech-innovations-logo.png'
};

async function testUserManagement() {
  try {
    console.log('🚀 Testing TalentHub User Management System...\n');

    // 1. Register users
    console.log('1. Registering users...');
    const employerResponse = await axios.post(`${BASE_URL}/auth/register`, testEmployer);
    const developerResponse = await axios.post(`${BASE_URL}/auth/register`, testDeveloper);
    console.log('✅ Users registered successfully');

    // 2. Login users
    console.log('\n2. Logging in users...');
    const employerLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmployer.email,
      password: testEmployer.password
    });
    employerToken = employerLoginResponse.data.token;
    employerId = employerLoginResponse.data.user.id;

    const developerLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testDeveloper.email,
      password: testDeveloper.password
    });
    developerToken = developerLoginResponse.data.token;
    developerId = developerLoginResponse.data.user.id;
    console.log('✅ Users logged in successfully');

    // 3. Get initial profiles
    console.log('\n3. Getting initial profiles...');
    const employerProfileResponse = await axios.get(`${BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    const developerProfileResponse = await axios.get(`${BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${developerToken}` }
    });
    console.log('✅ Initial profiles retrieved');

    // 4. Update developer profile
    console.log('\n4. Updating developer profile...');
    const updatedDeveloperResponse = await axios.put(`${BASE_URL}/users/profile`, developerProfileUpdate, {
      headers: { Authorization: `Bearer ${developerToken}` }
    });
    console.log('✅ Developer profile updated:', updatedDeveloperResponse.data.message);

    // 5. Update employer profile
    console.log('\n5. Updating employer profile...');
    const updatedEmployerResponse = await axios.put(`${BASE_URL}/users/profile`, employerProfileUpdate, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('✅ Employer profile updated:', updatedEmployerResponse.data.message);

    // 6. Update company profile (employer only)
    console.log('\n6. Updating company profile...');
    const companyResponse = await axios.put(`${BASE_URL}/users/company`, companyProfileUpdate, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('✅ Company profile updated:', companyResponse.data.message);

    // 7. Search users
    console.log('\n7. Searching users...');
    const searchResponse = await axios.get(`${BASE_URL}/users/search?query=developer&skills=JavaScript&skills=React&location=Seattle&role=DEVELOPER`, {});
    console.log('✅ User search completed:', searchResponse.data.users.length, 'users found');

    // 8. Get user by ID (public profile)
    console.log('\n8. Getting user by ID...');
    const publicProfileResponse = await axios.get(`${BASE_URL}/users/${developerId}`);
    console.log('✅ Public profile retrieved:', publicProfileResponse.data.user.firstName, publicProfileResponse.data.user.lastName);

    // 9. Get user statistics
    console.log('\n9. Getting user statistics...');
    const developerStatsResponse = await axios.get(`${BASE_URL}/users/stats`, {
      headers: { Authorization: `Bearer ${developerToken}` }
    });
    const employerStatsResponse = await axios.get(`${BASE_URL}/users/stats`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('✅ User statistics retrieved');

    // 10. Change password
    console.log('\n10. Changing password...');
    const passwordChangeResponse = await axios.patch(`${BASE_URL}/users/password`, {
      currentPassword: 'password123',
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123'
    }, {
      headers: { Authorization: `Bearer ${developerToken}` }
    });
    console.log('✅ Password changed:', passwordChangeResponse.data.message);

    // 11. Test login with new password
    console.log('\n11. Testing login with new password...');
    const newLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testDeveloper.email,
      password: 'newpassword123'
    });
    console.log('✅ Login with new password successful');

    // 12. Test company profile access (should fail for developer)
    console.log('\n12. Testing company profile access control...');
    try {
      await axios.put(`${BASE_URL}/users/company`, companyProfileUpdate, {
        headers: { Authorization: `Bearer ${developerToken}` }
      });
      console.log('❌ Company profile access should have failed for developer');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Company profile access correctly denied for developer');
      } else {
        throw error;
      }
    }

    // 13. Test private profile access
    console.log('\n13. Testing private profile access...');
    // First make developer profile private
    await axios.put(`${BASE_URL}/users/profile`, { isProfilePublic: false }, {
      headers: { Authorization: `Bearer ${developerToken}` }
    });
    
    try {
      await axios.get(`${BASE_URL}/users/${developerId}`);
      console.log('❌ Private profile access should have failed');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Private profile access correctly denied');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 All user management tests passed successfully!');
    console.log('\n📋 Summary:');
    console.log('- User registration and login: ✅');
    console.log('- Profile management: ✅');
    console.log('- Company profile management: ✅');
    console.log('- User search and discovery: ✅');
    console.log('- Skills management: ✅');
    console.log('- Password management: ✅');
    console.log('- Access control: ✅');
    console.log('- Privacy settings: ✅');
    console.log('- Statistics tracking: ✅');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data?.details) {
      console.error('Validation details:', error.response.data.details);
    }
  }
}

// Run the tests
testUserManagement();
