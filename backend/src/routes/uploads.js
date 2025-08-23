const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { authenticateToken, requireEmployer, requireDeveloper } = require('../middleware/auth');
const { uploadAvatar, uploadLogo, uploadResume } = require('../config/upload');

/**
 * @swagger
 * /uploads/avatar:
 *   post:
 *     summary: Upload user avatar
 *     description: Upload an avatar image for the authenticated user's profile
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file (JPEG, PNG, GIF, WebP, max 5MB)
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Avatar uploaded successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "clx1234567890abcdef"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     avatar:
 *                       type: string
 *                       format: uri
 *                       example: "http://localhost:5000/uploads/avatars/user123_1640995200000_avatar.jpg"
 *                 file:
 *                   $ref: '#/components/schemas/UploadedFile'
 *       400:
 *         description: No file uploaded or invalid file
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
router.post('/avatar', authenticateToken, uploadAvatar, uploadController.uploadAvatar);

/**
 * @swagger
 * /uploads/logo:
 *   post:
 *     summary: Upload company logo
 *     description: Upload a logo image for the employer's company (employers only)
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Logo image file (JPEG, PNG, GIF, WebP, SVG, max 5MB)
 *     responses:
 *       200:
 *         description: Company logo uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Company logo uploaded successfully"
 *                 company:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "clx1234567890abcdef"
 *                     name:
 *                       type: string
 *                       example: "Tech Innovations Inc."
 *                     logo:
 *                       type: string
 *                       format: uri
 *                       example: "http://localhost:5000/uploads/logos/user123_1640995200000_logo.png"
 *                 file:
 *                   $ref: '#/components/schemas/UploadedFile'
 *       400:
 *         description: No file uploaded or invalid file
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
router.post('/logo', authenticateToken, requireEmployer, uploadLogo, uploadController.uploadLogo);

/**
 * @swagger
 * /uploads/resume:
 *   post:
 *     summary: Upload resume
 *     description: Upload a resume file for job applications (developers only)
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Resume file (PDF, DOC, DOCX, max 10MB)
 *     responses:
 *       200:
 *         description: Resume uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Resume uploaded successfully"
 *                 file:
 *                   allOf:
 *                     - $ref: '#/components/schemas/UploadedFile'
 *                     - type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           example: "application/pdf"
 *       400:
 *         description: No file uploaded or invalid file
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
 *         description: Access denied - developers only
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
router.post('/resume', authenticateToken, requireDeveloper, uploadResume, uploadController.uploadResume);

/**
 * @swagger
 * /uploads/files:
 *   get:
 *     summary: List user files
 *     description: Get a list of all files uploaded by the authenticated user
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [avatars, logos, resumes]
 *         description: Filter by file type
 *         example: "avatars"
 *     responses:
 *       200:
 *         description: Files retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/UploadedFile'
 *                       - type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             enum: [avatars, logos, resumes]
 *                             example: "avatars"
 *                           uploadedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-01-15T10:30:00Z"
 *                           lastModified:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-01-15T10:30:00Z"
 *                 count:
 *                   type: integer
 *                   example: 5
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
router.get('/files', authenticateToken, uploadController.listUserFiles);

/**
 * @swagger
 * /uploads/{type}/{filename}/info:
 *   get:
 *     summary: Get file information
 *     description: Get detailed information about a specific uploaded file
 *     tags: [Uploads]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [avatars, logos, resumes]
 *         description: File type
 *         example: "avatars"
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: File name
 *         example: "user123_1640995200000_avatar.jpg"
 *     responses:
 *       200:
 *         description: File information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 file:
 *                   allOf:
 *                     - $ref: '#/components/schemas/UploadedFile'
 *                     - type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           enum: [avatars, logos, resumes]
 *                           example: "avatars"
 *                         uploadedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-01-15T10:30:00Z"
 *                         lastModified:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-01-15T10:30:00Z"
 *       400:
 *         description: Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: File not found
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
router.get('/:type/:filename/info', uploadController.getFileInfo);

/**
 * @swagger
 * /uploads/{type}/{filename}:
 *   delete:
 *     summary: Delete uploaded file
 *     description: Delete a specific uploaded file (user can only delete their own files)
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [avatars, logos, resumes]
 *         description: File type
 *         example: "avatars"
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: File name
 *         example: "user123_1640995200000_avatar.jpg"
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File deleted successfully"
 *       400:
 *         description: Invalid parameters
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
 *         description: Access denied - can only delete own files
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: File not found
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
router.delete('/:type/:filename', authenticateToken, uploadController.deleteUploadedFile);

module.exports = router;
