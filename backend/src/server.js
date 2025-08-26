const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Validate required environment variables
const isProduction = (process.env.NODE_ENV || '').toLowerCase() === 'production';
if (!process.env.JWT_SECRET) {
  const missingSecretMessage = "Missing required env var JWT_SECRET. Set it in your environment (e.g., Render service env vars).";
  if (isProduction) {
    console.error(missingSecretMessage);
    process.exit(1);
  } else {
    console.warn(missingSecretMessage);
  }
}

// Security middleware
app.use(helmet());

// When behind a proxy/load balancer (e.g., Render), trust proxy so req.ip is correct
// This prevents express-rate-limit from throwing when X-Forwarded-For is present
if (isProduction) {
  app.set('trust proxy', 1);
}

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'TalentHub API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    deepLinking: true
  }
}));

// API documentation JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecs);
});

// Import middleware
const { injectPrisma } = require('./middleware/prisma');

// Import routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/uploads');

// Make Prisma client available to middleware
let PrismaClient;
try {
  // Try to use the generated client from root node_modules first
  PrismaClient = require('@prisma/client').PrismaClient;
} catch (error) {
  console.error('Failed to load Prisma client from @prisma/client:', error);
  // Fallback to the root prisma client
  try {
    PrismaClient = require('../../node_modules/.prisma/client').PrismaClient;
  } catch (fallbackError) {
    console.error('Failed to load Prisma client from fallback location:', fallbackError);
    throw new Error('Prisma client could not be loaded');
  }
}

app.locals.prisma = new PrismaClient();

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// API routes with Prisma injection
app.use('/api/auth', injectPrisma, authRoutes);
app.use('/api/jobs', injectPrisma, jobRoutes);
app.use('/api/applications', injectPrisma, applicationRoutes);
app.use('/api/users', injectPrisma, userRoutes);
app.use('/api/admin', injectPrisma, adminRoutes);
app.use('/api/uploads', injectPrisma, uploadRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TalentHub Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
