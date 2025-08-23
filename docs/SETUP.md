# 🚀 TalentHub Setup Guide

This guide will walk you through setting up TalentHub locally for development.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- **Git** for version control
- **PostgreSQL** database (or Supabase account)

## 🔧 Step 1: Project Setup

### Clone and Navigate
```bash
git clone <your-repo-url>
cd talenthub
```

### Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Return to root directory
cd ..
```

## 🌍 Step 2: Environment Configuration

### Create Environment File
```bash
# Copy the example environment file
cp env.example .env
```

### Configure Environment Variables
Edit `.env` with your specific values:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=5000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"

# Supabase Configuration (if using Supabase)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

## 🗄 Step 3: Database Setup

### Option A: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a new database
3. Update `DATABASE_URL` in `.env`

### Option B: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your connection string from Settings > Database
4. Update `DATABASE_URL` in `.env`

### Initialize Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

## 🚀 Step 4: Start Development Servers

### Start Both Servers
```bash
# Start both frontend and backend simultaneously
npm run dev
```

### Start Individually
```bash
# Frontend only (http://localhost:3000)
npm run dev:frontend

# Backend only (http://localhost:5000)
npm run dev:backend
```

## ✅ Step 5: Verify Installation

### Backend Health Check
Visit `http://localhost:5000/health` - you should see:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### Frontend
Visit `http://localhost:3000` - you should see the TalentHub landing page.

### API Endpoints
Test the placeholder endpoints:
- `http://localhost:5000/api/auth` - "Auth routes coming soon!"
- `http://localhost:5000/api/jobs` - "Jobs routes coming soon!"
- `http://localhost:5000/api/applications` - "Applications routes coming soon!"
- `http://localhost:5000/api/users` - "Users routes coming soon!"

## 🧪 Step 6: Test Sample Data

After running the seed script, you can test with these credentials:

### Developer Account
- **Email**: john.doe@example.com
- **Password**: password123
- **Role**: Developer

### Employer Account
- **Email**: mike.johnson@techcorp.com
- **Password**: password123
- **Role**: Employer

## 🔍 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # macOS/Linux

# Kill the process or change the port in .env
```

#### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure database is running
- Check firewall settings
- Verify database credentials

#### Prisma Issues
```bash
# Reset Prisma
cd backend
npx prisma generate
npx prisma db push --force-reset
```

#### Frontend Build Issues
```bash
# Clear Next.js cache
cd frontend
rm -rf .next
npm run dev
```

### Logs and Debugging

#### Backend Logs
The backend server logs all requests and errors to the console.

#### Frontend Logs
Check the browser console for any JavaScript errors.

#### Database Logs
If using Supabase, check the dashboard for database logs.

## 📚 Next Steps

Once you have the basic setup running:

1. **Phase 2**: Implement backend API endpoints
2. **Phase 3**: Build frontend components and pages
3. **Phase 4**: Add advanced features and polish
4. **Phase 5**: Deploy to production

## 🆘 Getting Help

- Check the [main README](../README.md) for project overview
- Review the [API documentation](../docs/API.md) for endpoint details
- Create an issue on GitHub for bugs or feature requests
- Use GitHub Discussions for questions and help

---

**Happy coding! 🎉**

If you encounter any issues not covered here, please create an issue on GitHub with:
- Your operating system
- Node.js and npm versions
- Error messages and stack traces
- Steps to reproduce the issue
