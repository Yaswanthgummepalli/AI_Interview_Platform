const questionService = require('../services/question.service');
const ApiResponse = require('../utils/ApiResponse');

const createQuestion = async (req, res, next) => {
  try {
    const question = await questionService.createQuestion(req.body, req.user._id);
    return res
      .status(201)
      .json(new ApiResponse(201, { question }, 'Question created successfully'));
  } catch (error) {
    next(error);
  }
};

const getQuestions = async (req, res, next) => {
  try {
    const result = await questionService.getAllQuestions(req.query, req.user.role);
    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Questions retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const getQuestionById = async (req, res, next) => {
  try {
    const question = await questionService.getQuestionById(req.params.id, req.user.role);
    return res
      .status(200)
      .json(new ApiResponse(200, { question }, 'Question details retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const updateQuestion = async (req, res, next) => {
  try {
    const question = await questionService.updateQuestion(req.params.id, req.body, req.user.role);
    return res
      .status(200)
      .json(new ApiResponse(200, { question }, 'Question updated successfully'));
  } catch (error) {
    next(error);
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    const result = await questionService.deleteQuestion(req.params.id);
    return res
      .status(200)
      .json(new ApiResponse(200, null, result.message));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion
};
