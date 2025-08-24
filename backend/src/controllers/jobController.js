const Joi = require('joi');

// Get Prisma client from request object (set by server.js)
const getPrisma = (req) => req.prisma;

// Validation schemas
const createJobSchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  description: Joi.string().min(20).max(2000).required(),
  requirements: Joi.array().items(Joi.string().max(200)).min(1).max(20).required(),
  responsibilities: Joi.array().items(Joi.string().max(200)).min(1).max(20).required(),
  salary: Joi.object({
    min: Joi.number().min(0).required(),
    max: Joi.number().min(0).required(),
    currency: Joi.string().valid('USD', 'EUR', 'GBP', 'CAD', 'AUD').default('USD')
  }).required(),
  location: Joi.string().max(100).required(),
  type: Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP').required(),
  experience: Joi.string().valid('ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD').required(),
  skills: Joi.array().items(Joi.string().max(50)).min(1).max(20).required(),
  benefits: Joi.array().items(Joi.string().max(100)).max(20).optional(),
  companyName: Joi.string().min(2).max(100).required(),
  companyLogo: Joi.string().optional(),
  isRemote: Joi.boolean().default(false),
  isActive: Joi.boolean().default(true)
});

const updateJobSchema = Joi.object({
  title: Joi.string().min(5).max(100).optional(),
  description: Joi.string().min(20).max(2000).optional(),
  requirements: Joi.array().items(Joi.string().max(200)).min(1).max(20).optional(),
  responsibilities: Joi.array().items(Joi.string().max(200)).min(1).max(20).optional(),
  salary: Joi.object({
    min: Joi.number().min(0).required(),
    max: Joi.number().min(0).required(),
    currency: Joi.string().valid('USD', 'EUR', 'GBP', 'CAD', 'AUD').default('USD')
  }).optional(),
  location: Joi.string().max(100).optional(),
  type: Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP').optional(),
  experience: Joi.string().valid('ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD').optional(),
  skills: Joi.array().items(Joi.string().max(50)).min(1).max(20).optional(),
  benefits: Joi.array().items(Joi.string().max(100)).max(20).optional(),
  companyName: Joi.string().min(2).max(100).optional(),
  companyLogo: Joi.string().optional(),
  isRemote: Joi.boolean().optional(),
  isActive: Joi.boolean().optional()
});

const searchJobSchema = Joi.object({
  query: Joi.string().max(100).optional(),
  location: Joi.string().max(100).optional(),
  type: Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP').optional(),
  experience: Joi.string().valid('ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD').optional(),
  skills: Joi.array().items(Joi.string().max(50)).optional(),
  isRemote: Joi.boolean().optional(),
  // Accept but ignore salary parameters to maintain frontend compatibility
  minSalary: Joi.any().optional(),
  maxSalary: Joi.any().optional(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(50).default(10)
});

// Create a new job
const createJob = async (req, res) => {
  try {
    // Validate input
    const { error, value } = createJobSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const userId = req.user.userId;
    const jobData = { ...value, postedById: userId };

    // Create job
    const prisma = getPrisma(req);
    const job = await prisma.job.create({
      data: jobData,
      include: {
        postedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            company: {
              select: {
                name: true,
                logo: true,
                industry: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Job created successfully',
      job
    });

  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      error: 'Internal server error while creating job'
    });
  }
};

// Get all jobs with pagination and filtering
const getAllJobs = async (req, res) => {
  try {
    const { error, value } = searchJobSchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const {
      query,
      location,
      type,
      experience,
      skills,
      isRemote,
      page = 1,
      limit = 10
    } = value;

    // Build filter conditions
    const where = {
      isActive: true
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { companyName: { contains: query, mode: 'insensitive' } }
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (type) {
      where.type = type;
    }

    if (experience) {
      where.experience = experience;
    }

    if (skills && skills.length > 0) {
      where.skills = { hasSome: skills };
    }

    if (isRemote !== undefined) {
      where.isRemote = isRemote;
    }

    // Note: JSON salary filtering is not supported in Prisma
    // We accept minSalary and maxSalary parameters for frontend compatibility
    // but they are ignored in the actual filtering logic
    // TODO: Implement salary filtering at the application level if needed

    // Calculate pagination
    const prisma = getPrisma(req);
    const skip = (page - 1) * limit;
    const totalJobs = await prisma.job.count({ where });
    const totalPages = Math.ceil(totalJobs / limit);

    // Get jobs with pagination
    const jobs = await prisma.job.findMany({
      where,
      include: {
        postedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    res.status(200).json({
      jobs,
      pagination: {
        currentPage: page,
        totalPages,
        totalJobs,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching jobs'
    });
  }
};

// Get job by ID
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const prisma = getPrisma(req);
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        postedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            company: {
              select: {
                name: true,
                logo: true,
                industry: true,
                description: true,
                website: true,
                location: true
              }
            }
          }
        },
        applications: {
          select: {
            id: true,
            status: true,
            appliedAt: true,
            applicant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({
        error: 'Job not found'
      });
    }

    res.status(200).json({
      job
    });

  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching job'
    });
  }
};

// Update job
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Validate input
    const { error, value } = updateJobSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    // Check if job exists and user owns it
    const prisma = getPrisma(req);
    const existingJob = await prisma.job.findUnique({
      where: { id }
    });

    if (!existingJob) {
      return res.status(404).json({
        error: 'Job not found'
      });
    }

    if (existingJob.postedById !== userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update jobs that you posted'
      });
    }

    // Update job
    const updatedJob = await prisma.job.update({
      where: { id },
      data: value,
      include: {
        postedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            company: {
              select: {
                name: true,
                logo: true,
                industry: true
              }
            }
          }
        }
      }
    });

    res.status(200).json({
      message: 'Job updated successfully',
      job: updatedJob
    });

  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      error: 'Internal server error while updating job'
    });
  }
};

// Delete job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if job exists and user owns it
    const prisma = getPrisma(req);
    const existingJob = await prisma.job.findUnique({
      where: { id }
    });

    if (!existingJob) {
      return res.status(404).json({
        error: 'Job not found'
      });
    }

    if (existingJob.postedById !== userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete jobs that you posted'
      });
    }

    // Delete job (this will also delete related applications due to cascade)
    await prisma.job.delete({
      where: { id }
    });

    res.status(200).json({
      message: 'Job deleted successfully'
    });

  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      error: 'Internal server error while deleting job'
    });
  }
};

// Get jobs posted by current user
const getMyJobs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const prisma = getPrisma(req);
    const skip = (page - 1) * limit;
    const totalJobs = await prisma.job.count({
      where: { postedById: userId }
    });
    const totalPages = Math.ceil(totalJobs / limit);

    const jobs = await prisma.job.findMany({
  where: { postedById: userId },
  include: {
    applications: {
      select: {
        id: true,
        status: true,
        appliedAt: true,
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    }
  },
  orderBy: { createdAt: 'desc' },
  skip,
  take: parseInt(limit)
});

    res.status(200).json({
      jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalJobs,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching your jobs'
    });
  }
};

// Toggle job status (active/inactive)
const toggleJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if job exists and user owns it
    const prisma = getPrisma(req);
    const existingJob = await prisma.job.findUnique({
      where: { id }
    });

    if (!existingJob) {
      return res.status(404).json({
        error: 'Job not found'
      });
    }

    if (existingJob.postedById !== userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only modify jobs that you posted'
      });
    }

    // Toggle status
    const updatedJob = await prisma.job.update({
      where: { id },
      data: { isActive: !existingJob.isActive },
      include: {
        postedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.status(200).json({
      message: `Job ${updatedJob.isActive ? 'activated' : 'deactivated'} successfully`,
      job: updatedJob
    });

  } catch (error) {
    console.error('Toggle job status error:', error);
    res.status(500).json({
      error: 'Internal server error while toggling job status'
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  toggleJobStatus
};
