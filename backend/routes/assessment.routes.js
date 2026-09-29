const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessment.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

// All assessment endpoints require authentication
router.use(protect);

// Assessment taking endpoints
router.post('/:id/start', assessmentController.startAssessment);
router.get('/attempts/:attemptId', assessmentController.getAttemptById);
router.put('/attempts/:attemptId/answer', assessmentController.saveAttemptAnswer);
router.post('/attempts/:attemptId/submit', assessmentController.submitAttempt);
router.get('/attempts/:attemptId/result', assessmentController.getAttemptResult);
router.get('/my/attempts', assessmentController.getUserAttempts);

// Candidate & Admin readable endpoints
router.get('/', assessmentController.getAssessments);
router.get('/:id', assessmentController.getAssessmentById);

// Admin-only endpoints
router.post('/', authorizeRoles('ADMIN'), assessmentController.createAssessment);
router.put('/:id', authorizeRoles('ADMIN'), assessmentController.updateAssessment);
router.delete('/:id', authorizeRoles('ADMIN'), assessmentController.deleteAssessment);
router.patch('/:id/publish', authorizeRoles('ADMIN'), assessmentController.publishAssessment);
router.patch('/:id/unpublish', authorizeRoles('ADMIN'), assessmentController.unpublishAssessment);

module.exports = router;
