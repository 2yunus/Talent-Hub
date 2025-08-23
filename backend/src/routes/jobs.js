const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticateToken, requireEmployer, requireUser } = require('../middleware/auth');

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job posting
 *     description: Create a new job posting (employers only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - requirements
 *               - responsibilities
 *               - salary
 *               - location
 *               - type
 *               - experience
 *               - skills
 *               - companyName
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *                 example: "Senior Full-Stack Developer"
 *               description:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 2000
 *                 example: "We are looking for a talented full-stack developer to join our team..."
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *                 maxItems: 20
 *                 example: ["5+ years of experience", "React and Node.js expertise", "PostgreSQL knowledge"]
 *               responsibilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *                 maxItems: 20
 *                 example: ["Develop new features", "Code review", "Mentor junior developers"]
 *               salary:
 *                 type: object
 *                 required:
 *                   - min
 *                   - max
 *                 properties:
 *                   min:
 *                     type: number
 *                     minimum: 0
 *                     example: 80000
 *                   max:
 *                     type: number
 *                     minimum: 0
 *                     example: 120000
 *                   currency:
 *                     type: string
 *                     enum: [USD, EUR, GBP, CAD, AUD]
 *                     default: USD
 *                     example: USD
 *               location:
 *                 type: string
 *                 maxLength: 100
 *                 example: "San Francisco, CA"
 *               type:
 *                 type: string
 *                 enum: [FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP]
 *                 example: FULL_TIME
 *               experience:
 *                 type: string
 *                 enum: [ENTRY, JUNIOR, MID, SENIOR, LEAD]
 *                 example: SENIOR
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *                 maxItems: 20
 *                 example: ["JavaScript", "React", "Node.js", "PostgreSQL"]
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *                 maxItems: 20
 *                 example: ["Health insurance", "401k", "Remote work"]
 *               companyName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "TechCorp Inc."
 *               companyLogo:
 *                 type: string
 *                 example: "https://example.com/logo.png"
 *               isRemote:
 *                 type: boolean
 *                 default: false
 *                 example: true
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 example: true
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Job created successfully"
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Employer role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', authenticateToken, requireEmployer, jobController.createJob);

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs with filtering and pagination
 *     description: Retrieve all active jobs with optional filtering, sorting, and pagination
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query for job title, description, or company
 *         example: "React developer"
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *         example: "San Francisco"
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP]
 *         description: Filter by job type
 *         example: FULL_TIME
 *       - in: query
 *         name: experience
 *         schema:
 *           type: string
 *           enum: [ENTRY, JUNIOR, MID, SENIOR, LEAD]
 *         description: Filter by experience level
 *         example: SENIOR
 *       - in: query
 *         name: skills
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter by required skills
 *         example: ["JavaScript", "React"]
 *       - in: query
 *         name: isRemote
 *         schema:
 *           type: boolean
 *         description: Filter by remote work availability
 *         example: true
 *       - in: query
 *         name: minSalary
 *         schema:
 *           type: number
 *         description: Minimum salary filter
 *         example: 80000
 *       - in: query
 *         name: maxSalary
 *         schema:
 *           type: number
 *         description: Maximum salary filter
 *         example: 120000
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of jobs per page
 *         example: 10
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     totalJobs:
 *                       type: integer
 *                       example: 48
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', jobController.getAllJobs);

/**
 * @swagger
 * /jobs/my:
 *   get:
 *     summary: Get jobs posted by current user
 *     description: Retrieve all jobs posted by the authenticated user (employers only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of jobs per page
 *         example: 10
 *     responses:
 *       200:
 *         description: User's jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 2
 *                     totalJobs:
 *                       type: integer
 *                       example: 15
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Employer role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * /jobs/my:
 *   get:
 *     summary: Get jobs posted by current user
 *     description: Retrieve all jobs posted by the currently authenticated employer
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of jobs per page
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationInfo'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access denied - employers only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/my', authenticateToken, requireEmployer, jobController.getMyJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get job by ID
 *     description: Retrieve detailed information about a specific job
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *         example: "clx1234567890abcdef"
 *     responses:
 *       200:
 *         description: Job retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get('/:id', jobController.getJobById);

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: Update job by ID
 *     description: Update a job posting (job owner only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *         example: "clx1234567890abcdef"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *                 example: "Updated Senior Full-Stack Developer"
 *               description:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 2000
 *                 example: "Updated job description..."
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *                 maxItems: 20
 *                 example: ["Updated requirements"]
 *               responsibilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *                 maxItems: 20
 *                 example: ["Updated responsibilities"]
 *               salary:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                     minimum: 0
 *                     example: 90000
 *                   max:
 *                     type: number
 *                     minimum: 0
 *                     example: 130000
 *                   currency:
 *                     type: string
 *                     enum: [USD, EUR, GBP, CAD, AUD]
 *                     example: USD
 *               location:
 *                 type: string
 *                 maxLength: 100
 *                 example: "New York, NY"
 *               type:
 *                 type: string
 *                 enum: [FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP]
 *                 example: FULL_TIME
 *               experience:
 *                 type: string
 *                 enum: [ENTRY, JUNIOR, MID, SENIOR, LEAD]
 *                 example: SENIOR
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *                 maxItems: 20
 *                 example: ["JavaScript", "React", "Node.js", "TypeScript"]
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *                 maxItems: 20
 *                 example: ["Health insurance", "401k", "Remote work", "Flexible hours"]
 *               companyName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Updated Company Name"
 *               companyLogo:
 *                 type: string
 *                 example: "https://example.com/new-logo.png"
 *               isRemote:
 *                 type: boolean
 *                 example: true
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Job updated successfully"
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access denied - job owner only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', authenticateToken, jobController.updateJob);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Delete job by ID
 *     description: Delete a job posting (job owner only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *         example: "clx1234567890abcdef"
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Job deleted successfully"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access denied - job owner only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', authenticateToken, jobController.deleteJob);

/**
 * @swagger
 * /jobs/{id}/toggle:
 *   patch:
 *     summary: Toggle job status (active/inactive)
 *     description: Toggle the active status of a job posting (job owner only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *         example: "clx1234567890abcdef"
 *     responses:
 *       200:
 *         description: Job status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Job activated successfully"
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access denied - job owner only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id/toggle', authenticateToken, jobController.toggleJobStatus);

module.exports = router;
