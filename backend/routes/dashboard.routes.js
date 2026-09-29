const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');
const dashboardController = require('../controllers/dashboard.controller');

router.use(protect);

router.get('/user', dashboardController.getUserDashboard);
router.get('/admin', authorizeRoles('ADMIN'), dashboardController.getAdminDashboard);

module.exports = router;
