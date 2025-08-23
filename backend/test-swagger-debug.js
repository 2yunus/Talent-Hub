const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);

// Test different path configurations
const testPaths = [
  './src/routes/*.js',
  './src/controllers/*.js',
  '../src/routes/*.js',
  '../src/controllers/*.js',
  'src/routes/*.js',
  'src/controllers/*.js'
];

testPaths.forEach(testPath => {
  console.log(`\n--- Testing path: ${testPath} ---`);
  
  try {
    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Test API',
          version: '1.0.0',
          description: 'Test API'
        }
      },
      apis: [testPath]
    };
    
    const specs = swaggerJsdoc(options);
    console.log('✅ Success! Found paths:', specs.paths ? Object.keys(specs.paths) : 'No paths found');
    console.log('Total paths found:', specs.paths ? Object.keys(specs.paths).length : 0);
    
    if (specs.paths) {
      Object.keys(specs.paths).forEach(path => {
        console.log(`  - ${path}`);
      });
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
});

// Test with the actual swagger config
console.log('\n--- Testing with actual swagger config ---');
try {
  const actualSwagger = require('./src/config/swagger');
  console.log('✅ Swagger config loaded successfully');
  console.log('Paths found:', actualSwagger.paths ? Object.keys(actualSwagger.paths) : 'No paths found');
  
  if (actualSwagger.paths) {
    console.log('Available endpoints:');
    Object.keys(actualSwagger.paths).forEach(path => {
      const methods = Object.keys(actualSwagger.paths[path]);
      console.log(`  ${path}: ${methods.join(', ')}`);
    });
  }
} catch (error) {
  console.log('❌ Error loading actual swagger config:', error.message);
}
