#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up TalentHub Backend...\n');

// Check if .env exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found!');
  console.log('Please copy env.example to .env and configure your database connection first.');
  console.log('Then run this script again.\n');
  process.exit(1);
}

try {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\n🔧 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('\n🗄️  Pushing database schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('\n🌱 Seeding database...');
  execSync('node prisma/seed.js', { stdio: 'inherit' });
  
  console.log('\n✅ Setup complete! You can now run:');
  console.log('   npm run dev    # Start development server');
  console.log('   npm start      # Start production server');
  
} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  console.log('\nPlease check your database connection and try again.');
  process.exit(1);
}
