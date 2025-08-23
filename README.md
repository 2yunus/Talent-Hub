# 🚀 TalentHub - Job Platform

A comprehensive job platform connecting talented developers with amazing opportunities. Built with modern technologies and best practices.

## ✨ Features

- **Smart Job Matching**: AI-powered algorithm for perfect job-candidate matches
- **User Authentication**: Secure JWT-based authentication system
- **Role-Based Access**: Separate dashboards for developers and employers
- **Real-Time Updates**: Live notifications and updates using Socket.io
- **File Uploads**: Resume and document management
- **Responsive Design**: Mobile-first, modern UI built with Tailwind CSS
- **API-First Architecture**: RESTful API with comprehensive documentation

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation
- **Framer Motion** - Animations and transitions

### Backend
- **Express.js** - Node.js web framework
- **Prisma** - Modern database ORM
- **PostgreSQL** - Reliable database (via Supabase)
- **JWT** - JSON Web Token authentication
- **Socket.io** - Real-time communication
- **Multer** - File upload handling

### Database & Infrastructure
- **Supabase** - PostgreSQL database and authentication
- **Vercel** - Frontend deployment
- **Render** - Backend deployment

## 📁 Project Structure

```
talenthub/
├── frontend/                 # Next.js application
│   ├── app/                 # App router pages
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utilities and API calls
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Helper functions
│   ├── hooks/               # Custom React hooks
│   └── styles/              # Global CSS and Tailwind config
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Authentication and validation
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic
│   │   └── utils/           # Helper functions
│   └── prisma/              # Database schema and migrations
├── docs/                    # Project documentation
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- PostgreSQL database (Supabase recommended)
- Git

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd talenthub
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Return to root
cd ..
```

### 3. Environment Setup

1. Copy the environment template:
   ```bash
   cp env.example .env
   ```

2. Update `.env` with your configuration:
   - Database connection string
   - JWT secrets
   - Supabase credentials
   - API endpoints

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Run migrations
npm run db:migrate

# (Optional) Open Prisma Studio
npm run db:studio
```

### 5. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run dev:frontend    # Frontend on http://localhost:3000
npm run dev:backend     # Backend on http://localhost:5000
```

## 🔧 Development

### Available Scripts

```bash
# Root level
npm run dev              # Start both frontend and backend
npm run build            # Build both applications
npm run install:all      # Install all dependencies

# Database operations
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio

# Frontend
npm run dev:frontend     # Start frontend dev server
npm run build:frontend   # Build frontend
npm run start:frontend   # Start frontend production server

# Backend
npm run dev:backend      # Start backend dev server
npm run build:backend    # Build backend
npm run start:backend    # Start backend production server
```

### Code Quality

- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Husky** - Git hooks for pre-commit checks

### Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 🗄 Database Schema

### Core Models

- **User**: Authentication, profiles, roles (Developer/Employer/Admin)
- **Company**: Company information and branding
- **Job**: Job postings with requirements and benefits
- **Application**: Job applications with status tracking

### Key Features

- Role-based access control
- Soft deletes for data integrity
- Comprehensive audit trails
- Optimized queries with proper indexing

## 🔐 Authentication & Security

- **JWT Tokens**: Secure authentication with refresh tokens
- **Password Hashing**: bcrypt with configurable rounds
- **Rate Limiting**: API protection against abuse
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Prisma ORM with parameterized queries

## 📱 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - User logout

### Jobs
- `GET /jobs` - List all jobs with filtering
- `POST /jobs` - Create new job posting
- `GET /jobs/:id` - Get job details
- `PUT /jobs/:id` - Update job posting
- `DELETE /jobs/:id` - Delete job posting

### Applications
- `GET /applications` - List user applications
- `POST /applications` - Submit job application
- `PUT /applications/:id` - Update application status
- `GET /applications/:id` - Get application details

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/:id` - Get public user profile

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render)

1. Create new Web Service in Render
2. Connect your GitHub repository
3. Set environment variables
4. Configure build and start commands

### Database (Supabase)

1. Create new project in Supabase
2. Get connection string and API keys
3. Update environment variables
4. Run database migrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the development team

## 🗺 Roadmap

### Phase 1 ✅ (Complete)
- [x] Project setup and architecture
- [x] Database schema design
- [x] Basic project structure

### Phase 2 🚧 (In Progress)
- [ ] Backend API development
- [ ] Authentication system
- [ ] Database integration

### Phase 3 📋 (Planned)
- [ ] Frontend development
- [ ] User interface components
- [ ] API integration

### Phase 4 📋 (Planned)
- [ ] Advanced features
- [ ] Testing and optimization
- [ ] Deployment setup

### Phase 5 📋 (Planned)
- [ ] Documentation
- [ ] Performance optimization
- [ ] Security audit

---

**Built with ❤️ by the TalentHub Team**

*Connect developers with opportunities, one job at a time.*
