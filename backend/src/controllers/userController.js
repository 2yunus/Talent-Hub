const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Validation schemas
const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  bio: Joi.string().max(500).optional().allow(''),
  location: Joi.string().max(100).optional().allow(''),
  skills: Joi.array().items(Joi.string().max(50)).max(20).optional(),
  experience: Joi.string().max(1000).optional().allow(''),
  education: Joi.string().max(1000).optional().allow(''),
  website: Joi.string().uri().optional().allow(''),
  github: Joi.string().uri().optional().allow(''),
  linkedin: Joi.string().uri().optional().allow(''),
  avatar: Joi.string().uri().optional().allow(''),
  phone: Joi.string().max(20).optional().allow(''),
  isProfilePublic: Joi.boolean().optional()
});

const updateCompanySchema = Joi.object({
  companyName: Joi.string().min(2).max(100).optional(),
  companyDescription: Joi.string().max(2000).optional().allow(''),
  companyWebsite: Joi.string().uri().optional().allow(''),
  companySize: Joi.string().valid('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+').optional(),
  companyIndustry: Joi.string().max(100).optional().allow(''),
  companyLocation: Joi.string().max(100).optional().allow(''),
  companyLogo: Joi.string().uri().optional().allow('')
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).max(100).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords do not match'
  })
});

const searchUsersSchema = Joi.object({
  query: Joi.string().max(100).optional(),
  skills: Joi.array().items(Joi.string().max(50)).max(10).optional(),
  location: Joi.string().max(100).optional(),
  experience: Joi.string().max(100).optional(),
  role: Joi.string().valid('DEVELOPER', 'EMPLOYER').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10)
});

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        bio: true,
        location: true,
        skills: true,
        experience: true,
        education: true,
        website: true,
        github: true,
        linkedin: true,
        avatar: true,
        phone: true,
        isProfilePublic: true,
        createdAt: true,
        updatedAt: true,
        // Company info for employers
        company: req.user.role === 'EMPLOYER' ? {
          select: {
            id: true,
            name: true,
            description: true,
            website: true,
            size: true,
            industry: true,
            location: true,
            logo: true
          }
        } : undefined
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.status(200).json({
      user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching profile'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const userId = req.user.userId;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: value,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        bio: true,
        location: true,
        skills: true,
        experience: true,
        education: true,
        website: true,
        github: true,
        linkedin: true,
        avatar: true,
        phone: true,
        isProfilePublic: true,
        updatedAt: true
      }
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Internal server error while updating profile'
    });
  }
};

// Update company profile (employers only)
const updateCompanyProfile = async (req, res) => {
  try {
    if (req.user.role !== 'EMPLOYER') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only employers can update company profiles'
      });
    }

    const { error, value } = updateCompanySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const userId = req.user.userId;

    // Check if user has a company profile
    const existingCompany = await prisma.company.findUnique({
      where: { ownerId: userId }
    });

    let company;
    if (existingCompany) {
      // Update existing company
      company = await prisma.company.update({
        where: { id: existingCompany.id },
        data: {
          name: value.companyName,
          description: value.companyDescription,
          website: value.companyWebsite,
          size: value.companySize,
          industry: value.companyIndustry,
          location: value.companyLocation,
          logo: value.companyLogo
        }
      });
    } else {
      // Create new company
      company = await prisma.company.create({
        data: {
          name: value.companyName || 'My Company',
          description: value.companyDescription,
          website: value.companyWebsite,
          size: value.companySize,
          industry: value.companyIndustry,
          location: value.companyLocation,
          logo: value.companyLogo,
          ownerId: userId
        }
      });
    }

    res.status(200).json({
      message: 'Company profile updated successfully',
      company
    });

  } catch (error) {
    console.error('Update company profile error:', error);
    res.status(500).json({
      error: 'Internal server error while updating company profile'
    });
  }
};

// Get user by ID (public profile)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        bio: true,
        location: true,
        skills: true,
        experience: true,
        education: true,
        website: true,
        github: true,
        linkedin: true,
        avatar: true,
        isProfilePublic: true,
        createdAt: true,
        // Company info for employers
        company: {
          select: {
            id: true,
            name: true,
            description: true,
            website: true,
            size: true,
            industry: true,
            location: true,
            logo: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Check if profile is public or if requesting user is the owner
    if (!user.isProfilePublic && req.user?.userId !== id) {
      return res.status(403).json({
        error: 'Profile is private',
        message: 'This user has set their profile to private'
      });
    }

    res.status(200).json({
      user
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching user'
    });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { error, value } = searchUsersSchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const { query, skills, location, experience, role, page, limit } = value;

    // Build search conditions
    const where = {
      isProfilePublic: true
    };

    if (role) {
      where.role = role;
    }

    if (query) {
      where.OR = [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } }
      ];
    }

    if (skills && skills.length > 0) {
      where.skills = {
        hasSome: skills
      };
    }

    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive'
      };
    }

    if (experience) {
      where.experience = {
        contains: experience,
        mode: 'insensitive'
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalUsers = await prisma.user.count({ where });
    const totalPages = Math.ceil(totalUsers / limit);

    // Get users with pagination
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        bio: true,
        location: true,
        skills: true,
        experience: true,
        avatar: true,
        company: {
          select: {
            id: true,
            name: true,
            logo: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit
    });

    res.status(200).json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      error: 'Internal server error while searching users'
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const { currentPassword, newPassword } = value;
    const userId = req.user.userId;

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        error: 'Invalid current password'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.status(200).json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Internal server error while changing password'
    });
  }
};

// Delete user account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Delete user and related data (cascading delete)
    await prisma.user.delete({
      where: { id: userId }
    });

    res.status(200).json({
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      error: 'Internal server error while deleting account'
    });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    let stats = {};

    if (req.user.role === 'DEVELOPER') {
      // Developer stats
      const applicationStats = await prisma.application.groupBy({
        by: ['status'],
        where: { applicantId: userId },
        _count: { status: true }
      });

      stats = {
        totalApplications: await prisma.application.count({
          where: { applicantId: userId }
        }),
        applicationsByStatus: applicationStats.reduce((acc, stat) => {
          acc[stat.status] = stat._count.status;
          return acc;
        }, {}),
        profileViews: 0 // TODO: Implement profile views tracking
      };
    } else if (req.user.role === 'EMPLOYER') {
      // Employer stats
      const jobStats = await prisma.job.findMany({
        where: { postedById: userId },
        select: {
          id: true,
          _count: {
            select: { applications: true }
          }
        }
      });

      stats = {
        totalJobs: jobStats.length,
        totalApplicationsReceived: jobStats.reduce((acc, job) => acc + job._count.applications, 0),
        activeJobs: await prisma.job.count({
          where: { postedById: userId, isActive: true }
        })
      };
    }

    res.status(200).json({
      stats
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching statistics'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateCompanyProfile,
  getUserById,
  searchUsers,
  changePassword,
  deleteAccount,
  getUserStats
};
