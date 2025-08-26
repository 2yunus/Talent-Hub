const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const adminController = require('../controllers/adminController');

// TEMP: make all routes public for testing
router.get('/stats', adminController.getStats);
// User management
router.get('/users', adminController.listUsers);
router.patch('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Job management  
router.get('/jobs', adminController.listJobs);
router.patch('/jobs/:id/moderate', adminController.moderateJob);
router.delete('/jobs/:id', adminController.deleteJob);

// Application management
router.get('/applications', adminController.listApplications);

// Bootstrap endpoint: requires auth plus shared secret header
router.post('/bootstrap', adminController.bootstrapAdmin);

module.exports = router;


