const Joi = require('joi');

// Get Prisma client from request object (set by server.js)
const getPrisma = (req) => req.prisma;

// Validation schemas
const createApplicationSchema = Joi.object({
  jobId: Joi.string().required(),
  coverLetter: Joi.string().max(2000).optional(),
  resume: Joi.string().optional(),
  portfolio: Joi.string().optional()
});

const updateApplicationSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'REVIEWING', 'INTERVIEWING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN').optional(),
  coverLetter: Joi.string().max(2000).optional(),
  resume: Joi.string().optional(),
  portfolio: Joi.string().optional()
});

// Apply for a job
const applyForJob = async (req, res) => {
  try {
    // Validate input
    const { error, value } = createApplicationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const { jobId, coverLetter, resume, portfolio } = value;
    const userId = req.user.userId;
    const prisma = getPrisma(req);

    // Check if user is a developer
    if (req.user.role !== 'DEVELOPER') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only developers can apply for jobs'
      });
    }

    // Check if job exists and is active
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({
        error: 'Job not found'
      });
    }

    if (!job.isActive) {
      return res.status(400).json({
        error: 'Cannot apply for inactive job'
      });
    }

    // Check if user has already applied for this job
    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_applicantId: {
          jobId,
          applicantId: userId
        }
      }
    });

    if (existingApplication) {
      return res.status(400).json({
        error: 'Already applied',
        message: 'You have already applied for this job'
      });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        jobId,
        applicantId: userId,
        coverLetter,
        resume,
        portfolio
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            companyName: true
          }
        },
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });

  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({
      error: 'Internal server error while submitting application'
    });
  }
};

// Get applications for a specific job (employer only)
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.userId;
    const { page = 1, limit = 10, status } = req.query;

    // Check if user is an employer
    if (req.user.role !== 'EMPLOYER') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only employers can view job applications'
      });
    }

    const prisma = getPrisma(req);
    // Check if job exists and user owns it
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({
        error: 'Job not found'
      });
    }

    if (job.postedById !== userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only view applications for jobs you posted'
      });
    }

    // Build filter conditions
    const where = { jobId };
    if (status) {
      where.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalApplications = await prisma.application.count({ where });
    const totalPages = Math.ceil(totalApplications / limit);

    // Get applications with pagination
    const applications = await prisma.application.findMany({
      where,
      include: {
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            skills: true,
            experience: true,
            location: true
          }
        }
      },
      orderBy: { appliedAt: 'desc' },
      skip,
      take: parseInt(limit)
    });

    res.status(200).json({
      applications,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalApplications,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching applications'
    });
  }
};

// Get user's applications (developer only)
const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10, status } = req.query;

    // Check if user is a developer
    if (req.user.role !== 'DEVELOPER') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only developers can view their applications'
      });
    }

    // Build filter conditions
    const where = { applicantId: userId };
    if (status) {
      where.status = status;
    }

    const prisma = getPrisma(req);
    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalApplications = await prisma.application.count({ where });
    const totalPages = Math.ceil(totalApplications / limit);

    // Get applications with pagination
    const applications = await prisma.application.findMany({
      where,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            companyName: true,
            location: true,
            type: true,
            experience: true,
            isRemote: true,
            postedBy: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { appliedAt: 'desc' },
      skip,
      take: parseInt(limit)
    });

    res.status(200).json({
      applications,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalApplications,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching applications'
    });
  }
};

// Get all applications for employer's jobs (jobId optional)
const getEmployerApplications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { jobId, page = 1, limit = 10, status } = req.query;

    if (req.user.role !== 'EMPLOYER') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only employers can view received applications'
      });
    }

    const prisma = getPrisma(req);

    // If jobId provided: validate ownership and filter by that job only
    let where = {};
    if (jobId) {
      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
      if (job.postedById !== userId) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'You can only view applications for jobs you posted'
        });
      }
      where.jobId = jobId;
    } else {
      // No jobId → get all jobs owned by employer and filter applications by those
      const employerJobs = await prisma.job.findMany({
        where: { postedById: userId },
        select: { id: true }
      });
      const jobIds = employerJobs.map(j => j.id);
      where.jobId = { in: jobIds };
    }

    if (status) {
      where.status = status;
    }

    const skip = (page - 1) * limit;
    const totalApplications = await prisma.application.count({ where });
    const totalPages = Math.ceil(totalApplications / limit);

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            companyName: true,
            location: true,
            type: true,
            experience: true,
            isRemote: true
          }
        },
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            skills: true,
            experience: true,
            location: true
          }
        }
      },
      orderBy: { appliedAt: 'desc' },
      skip,
      take: parseInt(limit)
    });

    res.status(200).json({
      applications,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalApplications,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get employer applications error:', error);
    res.status(500).json({ error: 'Internal server error while fetching applications' });
  }
};

// Update application status (employer only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;

    // Check if user is an employer
    if (req.user.role !== 'EMPLOYER') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only employers can update application status'
      });
    }

    // Validate status
    const { error } = updateApplicationSchema.validate({ status });
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const prisma = getPrisma(req);
    // Check if application exists
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          select: {
            id: true,
            postedById: true
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({
        error: 'Application not found'
      });
    }

    // Check if user owns the job
    if (application.job.postedById !== userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update applications for jobs you posted'
      });
    }

    // Update application status
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        job: {
          select: {
            id: true,
            title: true,
            companyName: true
          }
        }
      }
    });

    res.status(200).json({
      message: 'Application status updated successfully',
      application: updatedApplication
    });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      error: 'Internal server error while updating application status'
    });
  }
};

// Withdraw application (developer only)
const withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if user is a developer
    if (req.user.role !== 'DEVELOPER') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only developers can withdraw applications'
      });
    }

    const prisma = getPrisma(req);
    // Check if application exists and user owns it
    const application = await prisma.application.findUnique({
      where: { id }
    });

    if (!application) {
      return res.status(404).json({
        error: 'Application not found'
      });
    }

    if (application.applicantId !== userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only withdraw your own applications'
      });
    }

    // Check if application can be withdrawn
    if (application.status === 'ACCEPTED' || application.status === 'REJECTED') {
      return res.status(400).json({
        error: 'Cannot withdraw application',
        message: 'Application has already been processed'
      });
    }

    // Update application status to withdrawn
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status: 'WITHDRAWN' },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            companyName: true
          }
        }
      }
    });

    res.status(200).json({
      message: 'Application withdrawn successfully',
      application: updatedApplication
    });

  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({
      error: 'Internal server error while withdrawing application'
    });
  }
};

// Get application by ID
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const prisma = getPrisma(req);
    // Check if application exists
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            companyName: true,
            postedById: true
          }
        },
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            skills: true,
            experience: true,
            location: true
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({
        error: 'Application not found'
      });
    }

    // Check if user has access to this application
    const isApplicant = application.applicantId === userId;
    const isJobOwner = application.job.postedById === userId;

    if (!isApplicant && !isJobOwner) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to view this application'
      });
    }

    res.status(200).json({
      application
    });

  } catch (error) {
    console.error('Get application by ID error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching application'
    });
  }
};

module.exports = {
  applyForJob,
  getJobApplications,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationById,
  // Added below
  getEmployerApplications
};
