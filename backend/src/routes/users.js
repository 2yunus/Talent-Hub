const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireEmployer, requireDeveloper } = require('../middleware/auth');

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieve the authenticated user's complete profile information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
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
router.get('/profile', authenticateToken, userController.getProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     description: Update the authenticated user's profile information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: "Doe"
 *               bio:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Full-stack developer with 5+ years of experience"
 *               location:
 *                 type: string
 *                 maxLength: 100
 *                 example: "San Francisco, CA"
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                   maxLength: 50
 *                 maxItems: 20
 *                 example: ["JavaScript", "React", "Node.js", "Python"]
 *               experience:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "5 years in web development, specializing in React and Node.js"
 *               education:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "BS Computer Science, Stanford University"
 *               website:
 *                 type: string
 *                 format: uri
 *                 example: "https://johndoe.dev"
 *               github:
 *                 type: string
 *                 format: uri
 *                 example: "https://github.com/johndoe"
 *               linkedin:
 *                 type: string
 *                 format: uri
 *                 example: "https://linkedin.com/in/johndoe"
 *               avatar:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/avatar.jpg"
 *               phone:
 *                 type: string
 *                 maxLength: 20
 *                 example: "+1-555-123-4567"
 *               isProfilePublic:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *                 user:
 *                   $ref: '#/components/schemas/UserProfile'
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/profile', authenticateToken, userController.updateProfile);

/**
 * @swagger
 * /users/company:
 *   put:
 *     summary: Update company profile
 *     description: Update company profile information (employers only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Tech Innovations Inc."
 *               companyDescription:
 *                 type: string
 *                 maxLength: 2000
 *                 example: "We are a cutting-edge technology company focused on innovation..."
 *               companyWebsite:
 *                 type: string
 *                 format: uri
 *                 example: "https://techinnovations.com"
 *               companySize:
 *                 type: string
 *                 enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]
 *                 example: "51-200"
 *               companyIndustry:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Software Development"
 *               companyLocation:
 *                 type: string
 *                 maxLength: 100
 *                 example: "San Francisco, CA"
 *               companyLogo:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/logo.png"
 *     responses:
 *       200:
 *         description: Company profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Company profile updated successfully"
 *                 company:
 *                   $ref: '#/components/schemas/Company'
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
router.put('/company', authenticateToken, requireEmployer, userController.updateCompanyProfile);

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users
 *     description: Search for users by various criteria (public profiles only)
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *           maxLength: 100
 *         description: Search query for name or bio
 *         example: "React developer"
 *       - in: query
 *         name: skills
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             maxLength: 50
 *           maxItems: 10
 *         style: form
 *         explode: true
 *         description: Filter by skills
 *         example: ["JavaScript", "React"]
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *           maxLength: 100
 *         description: Filter by location
 *         example: "San Francisco"
 *       - in: query
 *         name: experience
 *         schema:
 *           type: string
 *           maxLength: 100
 *         description: Filter by experience
 *         example: "5 years"
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [DEVELOPER, EMPLOYER]
 *         description: Filter by user role
 *         example: "DEVELOPER"
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
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserPublic'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationInfo'
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
router.get('/search', userController.searchUsers);

/**
 * @swagger
 * /users/password:
 *   patch:
 *     summary: Change password
 *     description: Change the authenticated user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Current password
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 100
 *                 description: New password
 *                 example: "newpassword123"
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm new password
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *       400:
 *         description: Validation error or invalid current password
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
 *       404:
 *         description: User not found
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
router.patch('/password', authenticateToken, userController.changePassword);

/**
 * @swagger
 * /users/stats:
 *   get:
 *     summary: Get user statistics
 *     description: Get statistics for the authenticated user (applications, jobs, etc.)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   description: User-specific statistics based on role
 *                   example:
 *                     totalApplications: 15
 *                     applicationsByStatus:
 *                       PENDING: 5
 *                       REVIEWING: 3
 *                       ACCEPTED: 2
 *                       REJECTED: 5
 *                     profileViews: 120
 *       401:
 *         description: Authentication required
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
router.get('/stats', authenticateToken, userController.getUserStats);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Get public profile information for a specific user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "clx1234567890abcdef"
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/UserPublic'
 *       403:
 *         description: Profile is private
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
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
router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /users/account:
 *   delete:
 *     summary: Delete user account
 *     description: Permanently delete the authenticated user's account and all associated data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account deleted successfully"
 *       401:
 *         description: Authentication required
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
router.delete('/account', authenticateToken, userController.deleteAccount);

module.exports = router;
