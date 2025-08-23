const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TalentHub API',
      version: '1.0.0',
      description: 'A comprehensive job platform API connecting talented developers with amazing opportunities',
      contact: {
        name: 'TalentHub Support',
        email: 'support@talenthub.com',
        url: 'https://talenthub.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server'
      },
      {
        url: 'https://api.talenthub.com/api',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from login endpoint'
        }
      },
      schemas: {
        // User schemas
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique user identifier',
              example: 'clx1234567890abcdef'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com'
            },
            firstName: {
              type: 'string',
              description: 'User first name',
              example: 'John'
            },
            lastName: {
              type: 'string',
              description: 'User last name',
              example: 'Doe'
            },
            role: {
              type: 'string',
              enum: ['DEVELOPER', 'EMPLOYER'],
              description: 'User role in the system',
              example: 'DEVELOPER'
            },
            bio: {
              type: 'string',
              description: 'User biography',
              example: 'Full-stack developer with 5 years of experience'
            },
            location: {
              type: 'string',
              description: 'User location',
              example: 'San Francisco, CA'
            },
            skills: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'User skills',
              example: ['JavaScript', 'React', 'Node.js']
            },
            experience: {
              type: 'string',
              description: 'User work experience',
              example: '5 years in web development'
            },
            education: {
              type: 'string',
              description: 'User education background',
              example: 'BS Computer Science, Stanford University'
            },
            website: {
              type: 'string',
              format: 'uri',
              description: 'User personal website',
              example: 'https://johndoe.dev'
            },
            github: {
              type: 'string',
              description: 'GitHub username',
              example: 'johndoe'
            },
            linkedin: {
              type: 'string',
              description: 'LinkedIn profile',
              example: 'johndoe-sf'
            },
            avatar: {
              type: 'string',
              description: 'User avatar image URL',
              example: 'https://example.com/avatar.jpg'
            },
            resume: {
              type: 'string',
              description: 'User resume file URL',
              example: 'https://example.com/resume.pdf'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
              example: '2024-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
              example: '2024-01-01T00:00:00.000Z'
            }
          },
          required: ['id', 'email', 'firstName', 'lastName', 'role']
        },
        
        // Registration request schema
        UserRegistration: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password (minimum 6 characters)',
              example: 'password123'
            },
            firstName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'User first name',
              example: 'John'
            },
            lastName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'User last name',
              example: 'Doe'
            },
            role: {
              type: 'string',
              enum: ['DEVELOPER', 'EMPLOYER'],
              default: 'DEVELOPER',
              description: 'User role in the system',
              example: 'DEVELOPER'
            },
            bio: {
              type: 'string',
              maxLength: 500,
              description: 'User biography',
              example: 'Full-stack developer with 5 years of experience'
            },
            location: {
              type: 'string',
              maxLength: 100,
              description: 'User location',
              example: 'San Francisco, CA'
            },
            skills: {
              type: 'array',
              items: {
                type: 'string',
                maxLength: 50
              },
              maxItems: 20,
              description: 'User skills',
              example: ['JavaScript', 'React', 'Node.js']
            },
            experience: {
              type: 'string',
              maxLength: 200,
              description: 'User work experience',
              example: '5 years in web development'
            },
            education: {
              type: 'string',
              maxLength: 200,
              description: 'User education background',
              example: 'BS Computer Science, Stanford University'
            },
            website: {
              type: 'string',
              format: 'uri',
              description: 'User personal website',
              example: 'https://johndoe.dev'
            },
            github: {
              type: 'string',
              maxLength: 100,
              description: 'GitHub username',
              example: 'johndoe'
            },
            linkedin: {
              type: 'string',
              maxLength: 100,
              description: 'LinkedIn profile',
              example: 'johndoe-sf'
            }
          },
          required: ['email', 'password', 'firstName', 'lastName']
        },

        // Login request schema
        UserLogin: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com'
            },
            password: {
              type: 'string',
              description: 'User password',
              example: 'password123'
            }
          },
          required: ['email', 'password']
        },

        // Profile update schema
        UserProfileUpdate: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'User first name',
              example: 'John'
            },
            lastName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'User last name',
              example: 'Doe'
            },
            bio: {
              type: 'string',
              maxLength: 500,
              description: 'User biography',
              example: 'Updated bio text'
            },
            location: {
              type: 'string',
              maxLength: 100,
              description: 'User location',
              example: 'New York, NY'
            },
            skills: {
              type: 'array',
              items: {
                type: 'string',
                maxLength: 50
              },
              maxItems: 20,
              description: 'User skills',
              example: ['JavaScript', 'React', 'Node.js', 'TypeScript']
            },
            experience: {
              type: 'string',
              maxLength: 200,
              description: 'User work experience',
              example: 'Updated experience text'
            },
            education: {
              type: 'string',
              maxLength: 200,
              description: 'User education background',
              example: 'Updated education text'
            },
            website: {
              type: 'string',
              format: 'uri',
              description: 'User personal website',
              example: 'https://newwebsite.com'
            },
            github: {
              type: 'string',
              maxLength: 100,
              description: 'GitHub username',
              example: 'newgithub'
            },
            linkedin: {
              type: 'string',
              maxLength: 100,
              description: 'LinkedIn profile',
              example: 'newlinkedin'
            }
          }
        },

        // Success response schema
        SuccessResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Operation completed successfully'
            },
            user: {
              $ref: '#/components/schemas/User'
            },
            token: {
              type: 'string',
              description: 'JWT authentication token',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        },

        // Error response schema
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Validation error'
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    description: 'Field name with error',
                    example: 'email'
                  },
                  message: {
                    type: 'string',
                    description: 'Error message for the field',
                    example: '"email" must be a valid email'
                  },
                  value: {
                    type: 'string',
                    description: 'Invalid value provided',
                    example: 'invalid-email'
                  }
                }
              },
              description: 'Detailed validation errors'
            },
            message: {
              type: 'string',
              description: 'User-friendly error message',
              example: 'Please provide a valid authentication token'
            },
            status: {
              type: 'integer',
              description: 'HTTP status code',
              example: 400
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Error timestamp',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },

        // Health check response schema
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              description: 'Service status',
              example: 'OK'
            },
            service: {
              type: 'string',
              description: 'Service name',
              example: 'Authentication Service'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Health check timestamp',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },

        // Job schemas
        Job: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique job identifier',
              example: 'clx1234567890abcdef'
            },
            title: {
              type: 'string',
              description: 'Job title',
              example: 'Senior Full-Stack Developer'
            },
            description: {
              type: 'string',
              description: 'Detailed job description',
              example: 'We are looking for a talented full-stack developer to join our team...'
            },
            requirements: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Job requirements',
              example: ['5+ years of experience', 'React and Node.js expertise']
            },
            responsibilities: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Job responsibilities',
              example: ['Develop new features', 'Code review', 'Mentor junior developers']
            },
            salary: {
              type: 'object',
              properties: {
                min: {
                  type: 'number',
                  description: 'Minimum salary',
                  example: 80000
                },
                max: {
                  type: 'number',
                  description: 'Maximum salary',
                  example: 120000
                },
                currency: {
                  type: 'string',
                  enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
                  description: 'Salary currency',
                  example: 'USD'
                }
              },
              required: ['min', 'max']
            },
            location: {
              type: 'string',
              description: 'Job location',
              example: 'San Francisco, CA'
            },
            type: {
              type: 'string',
              enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'],
              description: 'Job type',
              example: 'FULL_TIME'
            },
            experience: {
              type: 'string',
              enum: ['ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD'],
              description: 'Required experience level',
              example: 'SENIOR'
            },
            skills: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Required skills',
              example: ['JavaScript', 'React', 'Node.js', 'PostgreSQL']
            },
            benefits: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Job benefits',
              example: ['Health insurance', '401k', 'Remote work']
            },
            companyName: {
              type: 'string',
              description: 'Company name',
              example: 'TechCorp Inc.'
            },
            companyLogo: {
              type: 'string',
              description: 'Company logo URL',
              example: 'https://example.com/logo.png'
            },
            isRemote: {
              type: 'boolean',
              description: 'Whether the job allows remote work',
              example: true
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the job posting is active',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Job creation timestamp',
              example: '2024-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Job last update timestamp',
              example: '2024-01-01T00:00:00.000Z'
            },
            postedBy: {
              type: 'object',
              description: 'User who posted the job',
              properties: {
                id: {
                  type: 'string',
                  description: 'User ID',
                  example: 'clx1234567890abcdef'
                },
                firstName: {
                  type: 'string',
                  description: 'User first name',
                  example: 'John'
                },
                lastName: {
                  type: 'string',
                  description: 'User last name',
                  example: 'Doe'
                },
                email: {
                  type: 'string',
                  description: 'User email',
                  example: 'john.doe@company.com'
                }
              }
            }
          },
          required: ['id', 'title', 'description', 'requirements', 'responsibilities', 'salary', 'location', 'type', 'experience', 'skills', 'companyName']
        },

        // Job creation request schema
        JobCreation: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 5,
              maxLength: 100,
              description: 'Job title',
              example: 'Senior Full-Stack Developer'
            },
            description: {
              type: 'string',
              minLength: 20,
              maxLength: 2000,
              description: 'Detailed job description',
              example: 'We are looking for a talented full-stack developer to join our team...'
            },
            requirements: {
              type: 'array',
              items: {
                type: 'string',
                maxLength: 200
              },
              minItems: 1,
              maxItems: 20,
              description: 'Job requirements',
              example: ['5+ years of experience', 'React and Node.js expertise']
            },
            responsibilities: {
              type: 'array',
              items: {
                type: 'string',
                maxLength: 200
              },
              minItems: 1,
              maxItems: 20,
              description: 'Job responsibilities',
              example: ['Develop new features', 'Code review', 'Mentor junior developers']
            },
            salary: {
              type: 'object',
              properties: {
                min: {
                  type: 'number',
                  minimum: 0,
                  description: 'Minimum salary',
                  example: 80000
                },
                max: {
                  type: 'number',
                  minimum: 0,
                  description: 'Maximum salary',
                  example: 120000
                },
                currency: {
                  type: 'string',
                  enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
                  default: 'USD',
                  description: 'Salary currency',
                  example: 'USD'
                }
              },
              required: ['min', 'max']
            },
            location: {
              type: 'string',
              maxLength: 100,
              description: 'Job location',
              example: 'San Francisco, CA'
            },
            type: {
              type: 'string',
              enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'],
              default: 'FULL_TIME',
              description: 'Job type',
              example: 'FULL_TIME'
            },
            experience: {
              type: 'string',
              enum: ['ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD'],
              default: 'MID',
              description: 'Required experience level',
              example: 'SENIOR'
            },
            skills: {
              type: 'array',
              items: {
                type: 'string',
                maxLength: 50
              },
              minItems: 1,
              maxItems: 20,
              description: 'Required skills',
              example: ['JavaScript', 'React', 'Node.js', 'PostgreSQL']
            },
            benefits: {
              type: 'array',
              items: {
                type: 'string',
                maxLength: 100
              },
              maxItems: 20,
              description: 'Job benefits',
              example: ['Health insurance', '401k', 'Remote work']
            },
            companyName: {
              type: 'string',
              maxLength: 100,
              description: 'Company name',
              example: 'TechCorp Inc.'
            },
            companyLogo: {
              type: 'string',
              format: 'uri',
              description: 'Company logo URL',
              example: 'https://example.com/logo.png'
            },
            isRemote: {
              type: 'boolean',
              default: false,
              description: 'Whether the job allows remote work',
              example: true
            }
          },
          required: ['title', 'description', 'requirements', 'responsibilities', 'salary', 'location', 'companyName']
        },

        // Job update schema
        JobUpdate: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 5,
              maxLength: 100,
              description: 'Job title'
            },
            description: {
              type: 'string',
              minLength: 20,
              maxLength: 2000,
              description: 'Detailed job description'
            },
            requirements: {
              type: 'array',
              items: {
                type: 'string',
                maxLength: 200
              },
              minItems: 1,
              maxItems: 20,
              description: 'Job requirements'
            },
            responsibilities: {
              type: 'array',
              items: {
                type: 'string',
                maxLength: 200
              },
              minItems: 1,
              maxItems: 20,
              description: 'Job responsibilities'
            },
            salary: {
              type: 'object',
              properties: {
                min: {
                  type: 'number',
                  minimum: 0,
                  description: 'Minimum salary'
                },
                max: {
                  type: 'number',
                  minimum: 0,
                  description: 'Maximum salary'
                },
                currency: {
                  type: 'string',
                  enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
                  description: 'Salary currency'
                }
              }
            },
            location: {
              type: 'string',
              maxLength: 100,
              description: 'Job location'
            },
            type: {
              type: 'string',
              enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'],
              description: 'Job type'
            },
            experience: {
              type: 'string',
              enum: ['ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD'],
              description: 'Required experience level'
            },
            skills: {
              type: 'array',
              items: {
                type: 'string',
                maxLength: 50
              },
              minItems: 1,
              maxItems: 20,
              description: 'Required skills'
            },
            benefits: {
              type: 'array',
              items: {
                type: 'string',
                maxLength: 100
              },
              maxItems: 20,
              description: 'Job benefits'
            },
            companyName: {
              type: 'string',
              maxLength: 100,
              description: 'Company name'
            },
            companyLogo: {
              type: 'string',
              format: 'uri',
              description: 'Company logo URL'
            },
            isRemote: {
              type: 'boolean',
              description: 'Whether the job allows remote work'
            }
          }
        },

        // Job list response schema
        JobListResponse: {
          type: 'object',
          properties: {
            jobs: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Job'
              },
              description: 'List of jobs'
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  description: 'Current page number',
                  example: 1
                },
                limit: {
                  type: 'integer',
                  description: 'Number of items per page',
                  example: 10
                },
                total: {
                  type: 'integer',
                  description: 'Total number of jobs',
                  example: 25
                },
                totalPages: {
                  type: 'integer',
                  description: 'Total number of pages',
                  example: 3
                }
              }
            }
          }
        },

        // Application schema
        Application: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique application identifier',
              example: 'clx1234567890abcdef'
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'REVIEWING', 'INTERVIEWING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'],
              description: 'Application status',
              example: 'PENDING'
            },
            coverLetter: {
              type: 'string',
              maxLength: 2000,
              description: 'Cover letter content',
              example: 'I am excited to apply for this position...'
            },
            resume: {
              type: 'string',
              format: 'uri',
              description: 'URL to applicant resume',
              example: 'https://example.com/resume.pdf'
            },
            portfolio: {
              type: 'string',
              format: 'uri',
              description: 'URL to applicant portfolio',
              example: 'https://github.com/username'
            },
            appliedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Application submission date',
              example: '2024-01-15T10:30:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date',
              example: '2024-01-15T10:30:00Z'
            },
            job: {
              $ref: '#/components/schemas/Job'
            },
            applicant: {
              $ref: '#/components/schemas/User'
            }
          }
        },

        // Pagination info schema
        PaginationInfo: {
          type: 'object',
          properties: {
            currentPage: {
              type: 'integer',
              description: 'Current page number',
              example: 1
            },
            totalPages: {
              type: 'integer',
              description: 'Total number of pages',
              example: 5
            },
            totalItems: {
              type: 'integer',
              description: 'Total number of items',
              example: 48
            },
            hasNextPage: {
              type: 'boolean',
              description: 'Whether there is a next page',
              example: true
            },
            hasPrevPage: {
              type: 'boolean',
              description: 'Whether there is a previous page',
              example: false
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and profile management endpoints'
      },
      {
        name: 'Jobs',
        description: 'Job posting and management endpoints'
      },
      {
        name: 'Applications',
        description: 'Job application management endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
