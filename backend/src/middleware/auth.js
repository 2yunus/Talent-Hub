const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Access token required',
      message: 'Please provide a valid authentication token'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Your authentication token has expired. Please login again.'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'The provided authentication token is invalid.'
      });
    } else {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Unable to authenticate the provided token.'
      });
    }
  }
};

// Middleware to check if user has specific role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please login to access this resource'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `This resource requires one of the following roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

// Middleware to check if user is employer
const requireEmployer = requireRole(['EMPLOYER']);

// Middleware to check if user is developer
const requireDeveloper = requireRole(['DEVELOPER']);

// Middleware to check if user is admin
const requireAdmin = requireRole(['ADMIN']);

// Middleware to check if user is either employer or developer
const requireUser = requireRole(['EMPLOYER', 'DEVELOPER']);

// Middleware to check if user owns the resource or is admin
const requireOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'Please login to access this resource'
        });
      }

      const resourceId = req.params.id || req.params.jobId || req.params.applicationId;
      
      if (!resourceId) {
        return res.status(400).json({
          error: 'Resource ID required',
          message: 'Please provide a valid resource ID'
        });
      }

      // For now, we'll implement basic ownership check
      // This can be enhanced based on specific resource types
      if (resourceType === 'job') {
        // Check if user is the job poster
        const job = await req.app.locals.prisma.job.findUnique({
          where: { id: resourceId },
          select: { postedById: true }
        });

        if (!job) {
          return res.status(404).json({
            error: 'Resource not found',
            message: 'The requested job was not found'
          });
        }

        if (job.postedById !== req.user.userId) {
          return res.status(403).json({
            error: 'Access denied',
            message: 'You can only modify jobs that you posted'
          });
        }
      }

      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Unable to verify resource ownership'
      });
    }
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  requireEmployer,
  requireDeveloper,
  requireAdmin,
  requireUser,
  requireOwnership
};
