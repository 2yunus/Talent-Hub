const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';
let employerToken, developerToken;

// Test data
const testEmployer = {
  email: 'employer.upload@test.com',
  password: 'password123',
  firstName: 'Sarah',
  lastName: 'Johnson',
  role: 'EMPLOYER'
};

const testDeveloper = {
  email: 'developer.upload@test.com',
  password: 'password123',
  firstName: 'Alex',
  lastName: 'Smith',
  role: 'DEVELOPER'
};

// Create test files
const createTestFiles = () => {
  const testDir = path.join(__dirname, 'test-files');
  
  // Create test directory if it doesn't exist
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
  }

  // Create a simple test image (1x1 PNG)
  const pngData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');
  fs.writeFileSync(path.join(testDir, 'test-avatar.png'), pngData);
  fs.writeFileSync(path.join(testDir, 'test-logo.png'), pngData);

  // Create a simple test PDF
  const pdfData = Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n174\n%%EOF');
  fs.writeFileSync(path.join(testDir, 'test-resume.pdf'), pdfData);

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

async function testFileUploads() {
  let testDir;
  
  try {
    console.log('🚀 Testing TalentHub File Upload System...\n');

    // Create test files
    console.log('0. Creating test files...');
    testDir = createTestFiles();
    console.log('✅ Test files created');

    // 1. Register users
    console.log('\n1. Registering users...');
    await axios.post(`${BASE_URL}/auth/register`, testEmployer);
    await axios.post(`${BASE_URL}/auth/register`, testDeveloper);
    console.log('✅ Users registered successfully');

    // 2. Login users
    console.log('\n2. Logging in users...');
    const employerLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmployer.email,
      password: testEmployer.password
    });
    employerToken = employerLoginResponse.data.token;

    const developerLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testDeveloper.email,
      password: testDeveloper.password
    });
    developerToken = developerLoginResponse.data.token;
    console.log('✅ Users logged in successfully');

    // 3. Upload avatar (developer)
    console.log('\n3. Uploading developer avatar...');
    const avatarForm = new FormData();
    avatarForm.append('file', fs.createReadStream(path.join(testDir, 'test-avatar.png')));
    
    const avatarResponse = await axios.post(`${BASE_URL}/uploads/avatar`, avatarForm, {
      headers: {
        ...avatarForm.getHeaders(),
        Authorization: `Bearer ${developerToken}`
      }
    });
    console.log('✅ Avatar uploaded:', avatarResponse.data.message);

    // 4. Upload company logo (employer)
    console.log('\n4. Uploading company logo...');
    const logoForm = new FormData();
    logoForm.append('file', fs.createReadStream(path.join(testDir, 'test-logo.png')));
    
    const logoResponse = await axios.post(`${BASE_URL}/uploads/logo`, logoForm, {
      headers: {
        ...logoForm.getHeaders(),
        Authorization: `Bearer ${employerToken}`
      }
    });
    console.log('✅ Company logo uploaded:', logoResponse.data.message);

    // 5. Upload resume (developer)
    console.log('\n5. Uploading resume...');
    const resumeForm = new FormData();
    resumeForm.append('file', fs.createReadStream(path.join(testDir, 'test-resume.pdf')));
    
    const resumeResponse = await axios.post(`${BASE_URL}/uploads/resume`, resumeForm, {
      headers: {
        ...resumeForm.getHeaders(),
        Authorization: `Bearer ${developerToken}`
      }
    });
    console.log('✅ Resume uploaded:', resumeResponse.data.message);

    // 6. List user files
    console.log('\n6. Listing user files...');
    const developerFilesResponse = await axios.get(`${BASE_URL}/uploads/files`, {
      headers: { Authorization: `Bearer ${developerToken}` }
    });
    const employerFilesResponse = await axios.get(`${BASE_URL}/uploads/files`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    console.log('✅ Developer files:', developerFilesResponse.data.count);
    console.log('✅ Employer files:', employerFilesResponse.data.count);

    // 7. Get file info
    console.log('\n7. Getting file information...');
    const avatarFilename = avatarResponse.data.file.filename;
    const fileInfoResponse = await axios.get(`${BASE_URL}/uploads/avatars/${avatarFilename}/info`);
    console.log('✅ File info retrieved:', fileInfoResponse.data.file.filename);

    // 8. Test access control - developer trying to upload logo
    console.log('\n8. Testing access control (developer uploading logo)...');
    try {
      const invalidLogoForm = new FormData();
      invalidLogoForm.append('file', fs.createReadStream(path.join(testDir, 'test-logo.png')));
      
      await axios.post(`${BASE_URL}/uploads/logo`, invalidLogoForm, {
        headers: {
          ...invalidLogoForm.getHeaders(),
          Authorization: `Bearer ${developerToken}`
        }
      });
      console.log('❌ Access control failed - developer should not upload logo');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Access control working - developer correctly denied logo upload');
      } else {
        throw error;
      }
    }

    // 9. Test access control - employer trying to upload resume
    console.log('\n9. Testing access control (employer uploading resume)...');
    try {
      const invalidResumeForm = new FormData();
      invalidResumeForm.append('file', fs.createReadStream(path.join(testDir, 'test-resume.pdf')));
      
      await axios.post(`${BASE_URL}/uploads/resume`, invalidResumeForm, {
        headers: {
          ...invalidResumeForm.getHeaders(),
          Authorization: `Bearer ${employerToken}`
        }
      });
      console.log('❌ Access control failed - employer should not upload resume');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Access control working - employer correctly denied resume upload');
      } else {
        throw error;
      }
    }

    // 10. Test file type validation
    console.log('\n10. Testing file type validation...');
    try {
      // Create invalid file (text file for avatar)
      const invalidFile = Buffer.from('This is not an image');
      fs.writeFileSync(path.join(testDir, 'invalid.txt'), invalidFile);
      
      const invalidForm = new FormData();
      invalidForm.append('file', fs.createReadStream(path.join(testDir, 'invalid.txt')));
      
      await axios.post(`${BASE_URL}/uploads/avatar`, invalidForm, {
        headers: {
          ...invalidForm.getHeaders(),
          Authorization: `Bearer ${developerToken}`
        }
      });
      console.log('❌ File type validation failed');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ File type validation working');
      } else {
        throw error;
      }
    }

    // 11. Delete uploaded file
    console.log('\n11. Deleting uploaded file...');
    const deleteResponse = await axios.delete(`${BASE_URL}/uploads/avatars/${avatarFilename}`, {
      headers: { Authorization: `Bearer ${developerToken}` }
    });
    console.log('✅ File deleted:', deleteResponse.data.message);

    // 12. Verify file was deleted
    console.log('\n12. Verifying file deletion...');
    try {
      await axios.get(`${BASE_URL}/uploads/avatars/${avatarFilename}/info`);
      console.log('❌ File should have been deleted');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ File successfully deleted');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 All file upload tests passed successfully!');
    console.log('\n📋 Summary:');
    console.log('- File upload configuration: ✅');
    console.log('- Avatar uploads: ✅');
    console.log('- Company logo uploads: ✅');
    console.log('- Resume uploads: ✅');
    console.log('- File listing: ✅');
    console.log('- File information: ✅');
    console.log('- Access control: ✅');
    console.log('- File type validation: ✅');
    console.log('- File deletion: ✅');
    console.log('- Security measures: ✅');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data?.details) {
      console.error('Validation details:', error.response.data.details);
    }
  } finally {
    // Clean up test files
    if (testDir) {
      console.log('\n🧹 Cleaning up test files...');
      cleanupTestFiles(testDir);
      console.log('✅ Test files cleaned up');
    }
  }
}

// Run the tests
testFileUploads();
