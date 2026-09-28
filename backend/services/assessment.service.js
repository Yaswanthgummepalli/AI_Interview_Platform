const mongoose = require('mongoose');
const { Assessment } = require('../models');
const { validateAssessmentPayload, validateAssessmentPublishability } = require('../validators/assessment.validator');
const ApiError = require('../utils/ApiError');

class AssessmentService {
  async createAssessment(payload, userId) {
    const validatedData = await validateAssessmentPayload(payload);
    validatedData.createdBy = userId;
    validatedData.isPublished = payload.isPublished === true;

    const assessment = await Assessment.create(validatedData);
    await assessment.populate([
      { path: 'questions' },
      { path: 'createdBy', select: 'name email' }
    ]);

    return assessment.toSafeObject('ADMIN');
  }

  async getAllAssessments(queryParams, userRole = 'USER') {
    const { technology, topic, difficulty, isPublished, search, page = 1, limit = 10 } = queryParams;

    const filter = {};

    // Normal USERs can ONLY see published assessments
    if (userRole !== 'ADMIN') {
      filter.isPublished = true;
    } else if (isPublished !== undefined && isPublished !== '') {
      filter.isPublished = isPublished === 'true' || isPublished === true;
    }

    if (technology) {
      filter.technology = technology;
    }

    if (topic) {
      filter.topic = new RegExp(topic, 'i');
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { topic: new RegExp(search, 'i') }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const totalAssessments = await Assessment.countDocuments(filter);
    const assessments = await Assessment.find(filter)
      .populate([
        { path: 'questions' },
        { path: 'createdBy', select: 'name email' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const safeAssessments = assessments.map((a) => a.toSafeObject(userRole));

    return {
      totalAssessments,
      currentPage: pageNum,
      totalPages: Math.ceil(totalAssessments / limitNum) || 1,
      limit: limitNum,
      assessments: safeAssessments
    };
  }

  async getAssessmentById(id, userRole = 'USER') {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid Assessment ID format');
    }

    const assessment = await Assessment.findById(id).populate([
      { path: 'questions' },
      { path: 'createdBy', select: 'name email' }
    ]);

    if (!assessment) {
      throw new ApiError(404, 'Assessment not found');
    }

    if (userRole !== 'ADMIN' && !assessment.isPublished) {
      throw new ApiError(403, 'This assessment is not available');
    }

    return assessment.toSafeObject(userRole);
  }

  async updateAssessment(id, payload, userRole = 'ADMIN') {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid Assessment ID format');
    }

    const assessment = await Assessment.findById(id);
    if (!assessment) {
      throw new ApiError(404, 'Assessment not found');
    }

    const validatedData = await validateAssessmentPayload({
      ...assessment.toObject(),
      ...payload
    });

    Object.assign(assessment, validatedData);
    await assessment.save();
    await assessment.populate([
      { path: 'questions' },
      { path: 'createdBy', select: 'name email' }
    ]);

    return assessment.toSafeObject(userRole);
  }

  async deleteAssessment(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid Assessment ID format');
    }

    const assessment = await Assessment.findByIdAndDelete(id);
    if (!assessment) {
      throw new ApiError(404, 'Assessment not found');
    }

    return { message: 'Assessment deleted successfully' };
  }

  async publishAssessment(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid Assessment ID format');
    }

    const assessment = await Assessment.findById(id);
    if (!assessment) {
      throw new ApiError(404, 'Assessment not found');
    }

    await validateAssessmentPublishability({
      title: assessment.title,
      description: assessment.description,
      technology: assessment.technology,
      topic: assessment.topic,
      difficulty: assessment.difficulty,
      duration: assessment.duration,
      questions: assessment.questions
    });

    assessment.isPublished = true;
    await assessment.save();
    await assessment.populate([
      { path: 'questions' },
      { path: 'createdBy', select: 'name email' }
    ]);

    return assessment.toSafeObject('ADMIN');
  }

  async unpublishAssessment(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid Assessment ID format');
    }

    const assessment = await Assessment.findById(id);
    if (!assessment) {
      throw new ApiError(404, 'Assessment not found');
    }

    assessment.isPublished = false;
    await assessment.save();
    await assessment.populate([
      { path: 'questions' },
      { path: 'createdBy', select: 'name email' }
    ]);

    return assessment.toSafeObject('ADMIN');
  }
}

module.exports = new AssessmentService();
