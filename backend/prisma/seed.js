const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleared existing data');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const developer1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'DEVELOPER',
      bio: 'Full-stack developer with 5+ years of experience in React, Node.js, and Python.',
      location: 'San Francisco, CA',
      skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'AWS'],
      experience: '5+ years',
      education: 'BS Computer Science, Stanford University',
      website: 'https://johndoe.dev',
      github: 'johndoe',
      linkedin: 'johndoe'
    }
  });

  const developer2 = await prisma.user.create({
    data: {
      email: 'sarah.smith@example.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Smith',
      role: 'DEVELOPER',
      bio: 'Frontend specialist passionate about creating beautiful, accessible user experiences.',
      location: 'New York, NY',
      skills: ['React', 'TypeScript', 'CSS', 'Accessibility', 'UI/UX'],
      experience: '3+ years',
      education: 'MS Human-Computer Interaction, NYU',
      website: 'https://sarahsmith.design',
      github: 'sarahsmith',
      linkedin: 'sarahsmith'
    }
  });

  const employer1 = await prisma.user.create({
    data: {
      email: 'mike.johnson@techcorp.com',
      password: hashedPassword,
      firstName: 'Mike',
      lastName: 'Johnson',
      role: 'EMPLOYER',
      bio: 'CTO at TechCorp, building the future of software development.',
      location: 'Austin, TX',
      skills: ['Leadership', 'Architecture', 'Team Management', 'Product Strategy'],
      experience: '10+ years',
      education: 'MBA, Harvard Business School',
      website: 'https://techcorp.com',
      linkedin: 'mikejohnson'
    }
  });

  console.log('👥 Created sample users');

  // Create sample company
  const company1 = await prisma.company.create({
    data: {
      name: 'TechCorp',
      description: 'Innovative software company building cutting-edge solutions for the modern web.',
      logo: 'https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=TC',
      website: 'https://techcorp.com',
      location: 'Austin, TX',
      industry: 'Software Development',
      size: 'MEDIUM',
      founded: 2018,
      ownerId: employer1.id
    }
  });

  console.log('🏢 Created sample company');

  // Create sample jobs
  const job1 = await prisma.job.create({
    data: {
      title: 'Senior Full-Stack Developer',
      description: 'Join our team to build scalable web applications using modern technologies.',
      requirements: [
        '5+ years of experience with React and Node.js',
        'Strong understanding of database design and optimization',
        'Experience with cloud platforms (AWS, GCP, or Azure)',
        'Excellent problem-solving and communication skills'
      ],
      responsibilities: [
        'Design and implement new features',
        'Collaborate with cross-functional teams',
        'Mentor junior developers',
        'Participate in code reviews and technical discussions'
      ],
      salary: 'NINETY_TO_110K',
      location: 'Austin, TX',
      type: 'FULL_TIME',
      experience: 'SENIOR',
      skills: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'TypeScript'],
      benefits: [
        'Competitive salary and equity',
        'Health, dental, and vision insurance',
        'Flexible work arrangements',
        'Professional development budget'
      ],
      companyName: 'TechCorp',
      companyLogo: 'https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=TC',
      isRemote: true,
      postedById: employer1.id,
      companyId: company1.id
    }
  });

  const job2 = await prisma.job.create({
    data: {
      title: 'Frontend Developer',
      description: 'Create beautiful and responsive user interfaces for our web applications.',
      requirements: [
        '3+ years of experience with React and modern CSS',
        'Understanding of accessibility best practices',
        'Experience with responsive design',
        'Knowledge of modern JavaScript (ES6+)'
      ],
      responsibilities: [
        'Build reusable UI components',
        'Implement responsive designs',
        'Ensure accessibility compliance',
        'Collaborate with designers and backend developers'
      ],
      salary: 'SEVENTY_TO_90K',
      location: 'Remote',
      type: 'FULL_TIME',
      experience: 'MID_LEVEL',
      skills: ['React', 'TypeScript', 'CSS', 'Accessibility', 'Responsive Design'],
      benefits: [
        'Competitive salary',
        'Remote work options',
        'Health insurance',
        'Learning and development opportunities'
      ],
      companyName: 'TechCorp',
      companyLogo: 'https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=TC',
      isRemote: true,
      postedById: employer1.id,
      companyId: company1.id
    }
  });

  console.log('💼 Created sample jobs');

  // Create sample applications
  await prisma.application.create({
    data: {
      jobId: job1.id,
      applicantId: developer1.id,
      status: 'PENDING',
      coverLetter: 'I am excited about the opportunity to join TechCorp as a Senior Full-Stack Developer. With my 5+ years of experience in React and Node.js, I believe I can contribute significantly to your team.',
      resume: 'https://example.com/resume1.pdf'
    }
  });

  await prisma.application.create({
    data: {
      jobId: job2.id,
      applicantId: developer2.id,
      status: 'REVIEWING',
      coverLetter: 'As a frontend specialist with a passion for accessibility and user experience, I am thrilled to apply for the Frontend Developer position at TechCorp.',
      resume: 'https://example.com/resume2.pdf'
    }
  });

  console.log('📝 Created sample applications');

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📊 Sample data created:');
  console.log(`   - Users: ${await prisma.user.count()}`);
  console.log(`   - Companies: ${await prisma.company.count()}`);
  console.log(`   - Jobs: ${await prisma.job.count()}`);
  console.log(`   - Applications: ${await prisma.application.count()}`);
  console.log('\n🔑 Test credentials:');
  console.log('   Email: john.doe@example.com, Password: password123');
  console.log('   Email: mike.johnson@techcorp.com, Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
