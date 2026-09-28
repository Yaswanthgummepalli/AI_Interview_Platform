const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

// All question endpoints require authentication
router.use(protect);

// Public (Authenticated User) routes
router.get('/', questionController.getQuestions);
router.get('/:id', questionController.getQuestionById);

// Admin-only routes
router.post('/', authorizeRoles('ADMIN'), questionController.createQuestion);
router.put('/:id', authorizeRoles('ADMIN'), questionController.updateQuestion);
router.delete('/:id', authorizeRoles('ADMIN'), questionController.deleteQuestion);

module.exports = router;
