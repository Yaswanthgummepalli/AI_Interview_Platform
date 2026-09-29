const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessment.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

// All admin routes require authentication and ADMIN role
router.use(protect);
router.use(authorizeRoles('ADMIN'));

// Admin attempt management
router.get('/attempts', assessmentController.getAdminAttempts);

module.exports = router;
