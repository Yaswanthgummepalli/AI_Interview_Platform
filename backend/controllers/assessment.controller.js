const assessmentService = require('../services/assessment.service');
const ApiResponse = require('../utils/ApiResponse');

const createAssessment = async (req, res, next) => {
  try {
    const assessment = await assessmentService.createAssessment(req.body, req.user._id);
    return res
      .status(201)
      .json(new ApiResponse(201, { assessment }, 'Assessment created successfully'));
  } catch (error) {
    next(error);
  }
};

const getAssessments = async (req, res, next) => {
  try {
    const result = await assessmentService.getAllAssessments(req.query, req.user.role);
    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Assessments retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await assessmentService.getAssessmentById(req.params.id, req.user.role);
    return res
      .status(200)
      .json(new ApiResponse(200, { assessment }, 'Assessment details retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const startAssessment = async (req, res, next) => {
  try {
    const result = await assessmentService.startAssessment(req.params.id, req.user._id);
    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Assessment started successfully'));
  } catch (error) {
    next(error);
  }
};

const getAttemptById = async (req, res, next) => {
  try {
    const result = await assessmentService.getAttemptById(req.params.attemptId, req.user._id);
    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Assessment attempt retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const saveAttemptAnswer = async (req, res, next) => {
  try {
    const result = await assessmentService.saveAttemptAnswer(
      req.params.attemptId,
      req.user._id,
      req.body
    );
    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Answer saved successfully'));
  } catch (error) {
    next(error);
  }
};

const submitAttempt = async (req, res, next) => {
  try {
    const result = await assessmentService.submitAttempt(req.params.attemptId, req.user._id);
    return res
      .status(200)
      .json(new ApiResponse(200, result.result || result, 'Assessment submitted successfully'));
  } catch (error) {
    next(error);
  }
};

const getAttemptResult = async (req, res, next) => {
  try {
    const result = await assessmentService.getAttemptResult(req.params.attemptId, req.user._id);
    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Assessment result retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const getUserAttempts = async (req, res, next) => {
  try {
    const attempts = await assessmentService.getUserAttempts(req.user._id);
    return res
      .status(200)
      .json(new ApiResponse(200, { attempts }, 'User attempts retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const getAdminAttempts = async (req, res, next) => {
  try {
    const attempts = await assessmentService.getAdminAttempts();
    return res
      .status(200)
      .json(new ApiResponse(200, { attempts }, 'Admin attempts retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const updateAssessment = async (req, res, next) => {
  try {
    const assessment = await assessmentService.updateAssessment(req.params.id, req.body, req.user.role);
    return res
      .status(200)
      .json(new ApiResponse(200, { assessment }, 'Assessment updated successfully'));
  } catch (error) {
    next(error);
  }
};

const deleteAssessment = async (req, res, next) => {
  try {
    const result = await assessmentService.deleteAssessment(req.params.id);
    return res
      .status(200)
      .json(new ApiResponse(200, null, result.message));
  } catch (error) {
    next(error);
  }
};

const publishAssessment = async (req, res, next) => {
  try {
    const assessment = await assessmentService.publishAssessment(req.params.id);
    return res
      .status(200)
      .json(new ApiResponse(200, { assessment }, 'Assessment published successfully'));
  } catch (error) {
    next(error);
  }
};

const unpublishAssessment = async (req, res, next) => {
  try {
    const assessment = await assessmentService.unpublishAssessment(req.params.id);
    return res
      .status(200)
      .json(new ApiResponse(200, { assessment }, 'Assessment unpublished successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAssessment,
  getAssessments,
  getAssessmentById,
  startAssessment,
  getAttemptById,
  saveAttemptAnswer,
  submitAttempt,
  getAttemptResult,
  getUserAttempts,
  getAdminAttempts,
  updateAssessment,
  deleteAssessment,
  publishAssessment,
  unpublishAssessment
};
