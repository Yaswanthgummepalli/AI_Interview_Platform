const mongoose = require('mongoose');
const { Question } = require('../models');
const { validateQuestionPayload } = require('../validators/question.validator');
const ApiError = require('../utils/ApiError');

class QuestionService {
  async createQuestion(payload, userId) {
    const validatedData = validateQuestionPayload(payload);
    validatedData.createdBy = userId;

    const question = await Question.create(validatedData);
    await question.populate('createdBy', 'name email');
    return question.toSafeObject('ADMIN'); // Admin creation returns full question
  }

  async getAllQuestions(queryParams, userRole = 'USER') {
    const { technology, topic, difficulty, type, search, page = 1, limit = 10 } = queryParams;

    const filter = {};

    if (technology) {
      filter.technology = technology;
    }

    if (topic) {
      filter.topic = new RegExp(topic, 'i');
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (type) {
      filter.type = type;
    }

    if (search) {
      filter.$or = [
        { questionText: new RegExp(search, 'i') },
        { topic: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const totalQuestions = await Question.countDocuments(filter);
    const questions = await Question.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const safeQuestions = questions.map((q) => q.toSafeObject(userRole));

    return {
      totalQuestions,
      currentPage: pageNum,
      totalPages: Math.ceil(totalQuestions / limitNum) || 1,
      limit: limitNum,
      questions: safeQuestions
    };
  }

  async getQuestionById(id, userRole = 'USER') {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid Question ID format');
    }

    const question = await Question.findById(id).populate('createdBy', 'name email');
    if (!question) {
      throw new ApiError(404, 'Question not found');
    }

    return question.toSafeObject(userRole);
  }

  async updateQuestion(id, payload, userRole = 'ADMIN') {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid Question ID format');
    }

    const question = await Question.findById(id);
    if (!question) {
      throw new ApiError(404, 'Question not found');
    }

    const validatedData = validateQuestionPayload({
      ...question.toObject(),
      ...payload
    });

    Object.assign(question, validatedData);
    await question.save();
    await question.populate('createdBy', 'name email');

    return question.toSafeObject(userRole);
  }

  async deleteQuestion(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid Question ID format');
    }

    const question = await Question.findByIdAndDelete(id);
    if (!question) {
      throw new ApiError(404, 'Question not found');
    }

    return { message: 'Question deleted successfully' };
  }
}

module.exports = new QuestionService();
