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
  updateAssessment,
  deleteAssessment,
  publishAssessment,
  unpublishAssessment
};
