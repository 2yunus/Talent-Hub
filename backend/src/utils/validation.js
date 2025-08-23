const Joi = require('joi');

// Common validation patterns
const commonPatterns = {
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  name: Joi.string().min(2).max(50).required(),
  bio: Joi.string().max(500).optional(),
  location: Joi.string().max(100).optional(),
  url: Joi.string().uri().optional(),
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional(),
  skills: Joi.array().items(Joi.string().max(50)).max(20).optional(),
  salary: Joi.number().min(0).optional(),
  experience: Joi.string().max(200).optional(),
  education: Joi.string().max(200).optional()
};

// Validation helper function
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        }))
      });
    }
    
    // Replace req.body with validated data
    req.body = value;
    next();
  };
};

// Common validation schemas
const schemas = {
  // User registration
  userRegistration: Joi.object({
    email: commonPatterns.email,
    password: commonPatterns.password,
    firstName: commonPatterns.name,
    lastName: commonPatterns.name,
    role: Joi.string().valid('DEVELOPER', 'EMPLOYER').default('DEVELOPER'),
    bio: commonPatterns.bio,
    location: commonPatterns.location,
    skills: commonPatterns.skills,
    experience: commonPatterns.experience,
    education: commonPatterns.education,
    website: commonPatterns.url,
    github: Joi.string().max(100).optional(),
    linkedin: Joi.string().max(100).optional()
  }),

  // User login
  userLogin: Joi.object({
    email: commonPatterns.email,
    password: commonPatterns.password
  }),

  // User profile update
  userProfileUpdate: Joi.object({
    firstName: commonPatterns.name.optional(),
    lastName: commonPatterns.name.optional(),
    bio: commonPatterns.bio,
    location: commonPatterns.location,
    skills: commonPatterns.skills,
    experience: commonPatterns.experience,
    education: commonPatterns.education,
    website: commonPatterns.url,
    github: Joi.string().max(100).optional(),
    linkedin: Joi.string().max(100).optional()
  }),

  // Job creation
  jobCreation: Joi.object({
    title: Joi.string().min(5).max(100).required(),
    description: Joi.string().min(20).max(2000).required(),
    requirements: Joi.array().items(Joi.string().max(200)).min(1).max(20).required(),
    responsibilities: Joi.array().items(Joi.string().max(200)).min(1).max(20).required(),
    salary: Joi.object({
      min: Joi.number().min(0).required(),
      max: Joi.number().min(0).required(),
      currency: Joi.string().valid('USD', 'EUR', 'GBP', 'CAD', 'AUD').default('USD')
    }).required(),
    location: commonPatterns.location.required(),
    type: Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP').required(),
    experience: Joi.string().valid('ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD').required(),
    skills: commonPatterns.skills.required(),
    benefits: Joi.array().items(Joi.string().max(100)).max(20).optional(),
    companyName: Joi.string().min(2).max(100).required(),
    isRemote: Joi.boolean().default(false),
    isActive: Joi.boolean().default(true)
  }),

  // Job application
  jobApplication: Joi.object({
    jobId: Joi.string().required(),
    coverLetter: Joi.string().min(50).max(1000).required(),
    expectedSalary: Joi.number().min(0).optional(),
    availability: Joi.string().valid('IMMEDIATE', '2_WEEKS', '1_MONTH', '3_MONTHS').default('IMMEDIATE'),
    additionalNotes: Joi.string().max(500).optional()
  })
};

// Error response helper
const sendErrorResponse = (res, statusCode, message, details = null) => {
  const response = {
    error: {
      message,
      status: statusCode,
      timestamp: new Date().toISOString()
    }
  };

  if (details) {
    response.error.details = details;
  }

  if (process.env.NODE_ENV === 'development') {
    response.error.stack = new Error().stack;
  }

  return res.status(statusCode).json(response);
};

// Success response helper
const sendSuccessResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  validateRequest,
  schemas,
  sendErrorResponse,
  sendSuccessResponse,
  commonPatterns
};
