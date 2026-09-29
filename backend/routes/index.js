const express = require('express');
const router = express.Router();
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const questionRoutes = require('./question.routes');
const assessmentRoutes = require('./assessment.routes');
const adminRoutes = require('./admin.routes');

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/questions', questionRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
