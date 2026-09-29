const mongoose = require('mongoose');
const { Assessment, AssessmentAttempt } = require('../models');
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

  // --- Assessment attempt lifecycle ---
  async startAssessment(assessmentId, userId) {
    if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
      throw new ApiError(400, 'Invalid Assessment ID format');
    }

    const assessment = await Assessment.findById(assessmentId).populate('questions');
    if (!assessment) {
      throw new ApiError(404, 'Assessment not found');
    }

    if (!assessment.isPublished) {
      throw new ApiError(403, 'This assessment is not available');
    }

    // Prevent multiple active attempts; return existing in-progress attempt to allow resume
    let existing = await AssessmentAttempt.findOne({ assessment: assessmentId, user: userId, status: 'IN_PROGRESS' })
      .populate({ path: 'assessment', populate: { path: 'questions' } })
      .populate('answers.question');

    if (existing) {
      const durationMinutes = existing.assessment?.duration || assessment.duration || 0;
      const endTs = new Date(existing.startedAt).getTime() + durationMinutes * 60 * 1000;
      const remainingMs = Math.max(endTs - Date.now(), 0);

      existing.assessment = assessment.toSafeObject('USER');
      return { attempt: existing, remainingMs };
    }

    // Initialize answers skeleton from assessment questions
    const answers = (assessment.questions || []).map((q) => ({ question: q._id, answer: '' }));
    const startedAt = new Date();

    const attempt = await AssessmentAttempt.create({
      user: userId,
      assessment: assessmentId,
      answers,
      startedAt,
      status: 'IN_PROGRESS'
    });

    await attempt.populate({ path: 'assessment', populate: { path: 'questions' } });
    await attempt.populate('answers.question');

    attempt.assessment = assessment.toSafeObject('USER');

    const durationMinutes = assessment.duration || 0;
    const endTs = new Date(startedAt).getTime() + durationMinutes * 60 * 1000;
    const remainingMs = Math.max(endTs - Date.now(), 0);

    return { attempt, remainingMs };
  }

  async getAttemptById(attemptId, userId) {
    if (!mongoose.Types.ObjectId.isValid(attemptId)) {
      throw new ApiError(400, 'Invalid Attempt ID format');
    }

    const attempt = await AssessmentAttempt.findById(attemptId)
      .populate({ path: 'assessment', populate: { path: 'questions' } })
      .populate('answers.question');

    if (!attempt) {
      throw new ApiError(404, 'Attempt not found');
    }

    if (attempt.user.toString() !== String(userId)) {
      throw new ApiError(403, 'You are not allowed to access this attempt');
    }

    // If time expired, auto-submit
    if (attempt.status === 'IN_PROGRESS') {
      const durationMinutes = attempt.assessment?.duration || 0;
      const endTs = new Date(attempt.startedAt).getTime() + durationMinutes * 60 * 1000;
      const remainingMs = endTs - Date.now();
      if (remainingMs <= 0) {
        return this.submitAttempt(attemptId, userId);
      }

      return { attempt, remainingMs };
    }

    return { attempt };
  }

  async saveAttemptAnswer(attemptId, userId, payload) {
    const { questionId, answer } = payload || {};
    if (!questionId) {
      throw new ApiError(400, 'questionId is required');
    }

    if (!mongoose.Types.ObjectId.isValid(attemptId)) {
      throw new ApiError(400, 'Invalid Attempt ID format');
    }

    const attempt = await AssessmentAttempt.findById(attemptId).populate({ path: 'assessment', populate: { path: 'questions' } });
    if (!attempt) {
      throw new ApiError(404, 'Attempt not found');
    }

    if (attempt.user.toString() !== String(userId)) {
      throw new ApiError(403, 'You are not allowed to modify this attempt');
    }

    if (attempt.status !== 'IN_PROGRESS') {
      throw new ApiError(400, 'Cannot save answers to a completed attempt');
    }

    const answerEntry = attempt.answers.find((a) => String(a.question) === String(questionId));
    if (!answerEntry) {
      throw new ApiError(400, 'Question is not part of this attempt');
    }

    answerEntry.answer = typeof answer === 'string' ? answer : '';

    await attempt.save();
    await attempt.populate('answers.question');

    return { attempt };
  }

  async submitAttempt(attemptId, userId) {
    if (!mongoose.Types.ObjectId.isValid(attemptId)) {
      throw new ApiError(400, 'Invalid Attempt ID format');
    }

    const attempt = await AssessmentAttempt.findById(attemptId)
      .populate({ path: 'assessment', populate: { path: 'questions' } })
      .populate('answers.question');
    if (!attempt) {
      throw new ApiError(404, 'Attempt not found');
    }

    if (attempt.user.toString() !== String(userId)) {
      throw new ApiError(403, 'You are not allowed to submit this attempt');
    }

    if (attempt.status === 'COMPLETED') {
      return { attempt };
    }

    // Calculate score based on MCQ answers only
    const result = this._calculateScore(attempt);
    
    // Update attempt with scoring information
    attempt.status = 'COMPLETED';
    attempt.completedAt = new Date();
    attempt.score = result.score;
    attempt.maxScore = result.maxScore;
    attempt.percentage = result.percentage;
    attempt.correctAnswers = result.correctAnswers;
    attempt.incorrectAnswers = result.incorrectAnswers;
    attempt.unansweredAnswers = result.unansweredAnswers;

    await attempt.save();

    // Return populated sanitized assessment for client (safe response)
    const safeAttempt = attempt.toObject ? attempt.toObject() : attempt;
    
    return {
      attempt: safeAttempt,
      result: {
        attemptId: attempt._id,
        assessmentId: attempt.assessment._id,
        score: attempt.score,
        maxScore: attempt.maxScore,
        percentage: attempt.percentage,
        correctAnswers: attempt.correctAnswers,
        incorrectAnswers: attempt.incorrectAnswers,
        unansweredAnswers: attempt.unansweredAnswers,
        status: attempt.status,
        completedAt: attempt.completedAt
      }
    };
  }

  /**
   * Calculate score based on MCQ questions only
   * Subjective questions are counted as unanswered
   * Returns: { score, maxScore, percentage, correctAnswers, incorrectAnswers, unansweredAnswers }
   */
  _calculateScore(attempt) {
    let score = 0;
    let maxScore = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unansweredAnswers = 0;

    if (!attempt.answers || !attempt.assessment || !attempt.assessment.questions) {
      return { score: 0, maxScore: 0, percentage: 0, correctAnswers: 0, incorrectAnswers: 0, unansweredAnswers: 0 };
    }

    // Create a map of questions by ID for O(1) lookup
    const questionMap = {};
    attempt.assessment.questions.forEach((q) => {
      questionMap[String(q._id)] = q;
    });

    // Evaluate each answer
    attempt.answers.forEach((answerEntry) => {
      const questionId = String(answerEntry.question._id || answerEntry.question);
      const question = questionMap[questionId];

      if (!question) {
        return; // Skip if question not found
      }

      // Only count MCQ questions for scoring
      if (question.type === 'MCQ') {
        maxScore += 1;

        const userAnswer = (answerEntry.answer || '').trim();
        const correctAnswer = (question.correctAnswer || '').trim();

        if (!userAnswer) {
          unansweredAnswers += 1;
        } else if (userAnswer === correctAnswer) {
          score += 1;
          correctAnswers += 1;
        } else {
          incorrectAnswers += 1;
        }
      } else if (question.type === 'SUBJECTIVE') {
        // Subjective questions are not auto-scored yet
        // Treat as unanswered for now (can be scored by admin/AI later)
        const userAnswer = (answerEntry.answer || '').trim();
        if (!userAnswer) {
          unansweredAnswers += 1;
        }
        // Note: Subjective answers are logged but not counted in score
      }
    });

    // Calculate percentage safely
    const percentage = maxScore > 0 ? parseFloat(((score / maxScore) * 100).toFixed(2)) : 0;

    return {
      score,
      maxScore,
      percentage,
      correctAnswers,
      incorrectAnswers,
      unansweredAnswers
    };
  }

  /**
   * Get result for a completed attempt
   */
  async getAttemptResult(attemptId, userId) {
    if (!mongoose.Types.ObjectId.isValid(attemptId)) {
      throw new ApiError(400, 'Invalid Attempt ID format');
    }

    const attempt = await AssessmentAttempt.findById(attemptId)
      .populate({ path: 'assessment', select: 'title technology topic difficulty duration' });

    if (!attempt) {
      throw new ApiError(404, 'Attempt not found');
    }

    if (attempt.user.toString() !== String(userId)) {
      throw new ApiError(403, 'You are not allowed to access this attempt');
    }

    if (attempt.status !== 'COMPLETED') {
      throw new ApiError(400, 'Attempt is not completed');
    }

    return {
      attemptId: attempt._id,
      assessment: {
        id: attempt.assessment._id,
        title: attempt.assessment.title,
        technology: attempt.assessment.technology,
        topic: attempt.assessment.topic,
        difficulty: attempt.assessment.difficulty
      },
      score: attempt.score,
      maxScore: attempt.maxScore,
      percentage: attempt.percentage,
      correctAnswers: attempt.correctAnswers,
      incorrectAnswers: attempt.incorrectAnswers,
      unansweredAnswers: attempt.unansweredAnswers,
      status: attempt.status,
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt
    };
  }

  /**
   * Get all attempts for current user (sorted newest first)
   */
  async getUserAttempts(userId) {
    const attempts = await AssessmentAttempt.find({ user: userId })
      .populate({ path: 'assessment', select: 'title technology topic difficulty' })
      .sort({ completedAt: -1, createdAt: -1 });

    return attempts.map((attempt) => ({
      attemptId: attempt._id,
      assessmentId: attempt.assessment ? attempt.assessment._id : null,
      title: attempt.assessment ? attempt.assessment.title || 'Unknown Assessment' : 'Deleted Assessment',
      technology: attempt.assessment ? attempt.assessment.technology || 'N/A' : 'N/A',
      topic: attempt.assessment ? attempt.assessment.topic || 'N/A' : 'N/A',
      difficulty: attempt.assessment ? attempt.assessment.difficulty || 'N/A' : 'N/A',
      score: attempt.score || 0,
      maxScore: attempt.maxScore || 0,
      percentage: attempt.percentage || 0,
      correctAnswers: attempt.correctAnswers || 0,
      incorrectAnswers: attempt.incorrectAnswers || 0,
      unansweredAnswers: attempt.unansweredAnswers || 0,
      status: attempt.status || 'UNKNOWN',
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt
    }));
  }

  /**
   * Get all attempts (admin only)
   */
  async getAdminAttempts() {
    const attempts = await AssessmentAttempt.find({})
      .populate({ path: 'user', select: 'name email' })
      .populate({ path: 'assessment', select: 'title' })
      .sort({ completedAt: -1, createdAt: -1 });

    return attempts.map((attempt) => ({
      attemptId: attempt._id,
      user: attempt.user ? {
        name: attempt.user.name || 'Unknown',
        email: attempt.user.email || 'unknown@example.com'
      } : {
        name: 'Deleted User',
        email: 'deleted@example.com'
      },
      assessment: attempt.assessment ? {
        title: attempt.assessment.title || 'Unknown Assessment'
      } : {
        title: 'Deleted Assessment'
      },
      score: attempt.score || 0,
      maxScore: attempt.maxScore || 0,
      percentage: attempt.percentage || 0,
      correctAnswers: attempt.correctAnswers || 0,
      incorrectAnswers: attempt.incorrectAnswers || 0,
      unansweredAnswers: attempt.unansweredAnswers || 0,
      status: attempt.status || 'UNKNOWN',
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt
    }));
  }
}

module.exports = new AssessmentService();
