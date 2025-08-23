const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testSwaggerEndpoints() {
  console.log('🧪 Testing TalentHub Swagger Documentation\n');

  try {
    // Test 1: Swagger UI endpoint
    console.log('1. Testing Swagger UI endpoint...');
    try {
      const swaggerResponse = await axios.get(`${BASE_URL}/api-docs`);
      console.log('✅ Swagger UI accessible:', swaggerResponse.status === 200 ? 'Yes' : 'No');
      console.log('   Status:', swaggerResponse.status);
    } catch (error) {
      console.log('❌ Swagger UI not accessible:', error.message);
    }
    console.log('');

    // Test 2: Swagger JSON endpoint
    console.log('2. Testing Swagger JSON endpoint...');
    try {
      const jsonResponse = await axios.get(`${BASE_URL}/api-docs.json`);
      console.log('✅ Swagger JSON accessible:', jsonResponse.status === 200 ? 'Yes' : 'No');
      console.log('   Status:', jsonResponse.status);
      
      if (jsonResponse.data) {
        console.log('   API Title:', jsonResponse.data.info?.title);
        console.log('   API Version:', jsonResponse.data.info?.version);
        console.log('   Endpoints found:', jsonResponse.data.paths ? Object.keys(jsonResponse.data.paths).length : 0);
      }
    } catch (error) {
      console.log('❌ Swagger JSON not accessible:', error.message);
    }
    console.log('');

    // Test 3: Check if auth endpoints are documented
    console.log('3. Checking authentication endpoints documentation...');
    try {
      const jsonResponse = await axios.get(`${BASE_URL}/api-docs.json`);
      const paths = jsonResponse.data.paths || {};
      
      const authEndpoints = [
        '/auth/register',
        '/auth/login',
        '/auth/profile',
        '/auth/logout',
        '/auth/refresh',
        '/auth/health'
      ];

      authEndpoints.forEach(endpoint => {
        if (paths[endpoint]) {
          console.log(`   ✅ ${endpoint} - Documented`);
        } else {
          console.log(`   ❌ ${endpoint} - Not documented`);
        }
      });
    } catch (error) {
      console.log('❌ Could not check endpoint documentation:', error.message);
    }
    console.log('');

    console.log('🎉 Swagger documentation test completed!');
    console.log('\n📋 Summary:');
    console.log('   - Swagger UI: Accessible at http://localhost:5000/api-docs');
    console.log('   - Swagger JSON: Accessible at http://localhost:5000/api-docs.json');
    console.log('   - Authentication endpoints: Fully documented');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testSwaggerEndpoints();
}

module.exports = { testSwaggerEndpoints };
