const mongoose = require('mongoose');
const Question = require('../models/question.model');
const ApiError = require('../utils/ApiError');
const { ALLOWED_TECHNOLOGIES } = require('./question.validator');

const validateAssessmentPayload = async (data) => {
  const { title, description, technology, topic, difficulty, duration, questions } = data;
  const errors = [];

  if (!title || typeof title !== 'string' || !title.trim()) {
    errors.push('Title is required');
  }

  if (!description || typeof description !== 'string' || !description.trim()) {
    errors.push('Description is required');
  }

  if (!technology || !ALLOWED_TECHNOLOGIES.includes(technology)) {
    errors.push(`Technology must be one of: ${ALLOWED_TECHNOLOGIES.join(', ')}`);
  }

  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    errors.push('Topic is required');
  }

  if (!difficulty || !['EASY', 'MEDIUM', 'HARD'].includes(difficulty)) {
    errors.push('Difficulty must be EASY, MEDIUM, or HARD');
  }

  const durationNum = Number.parseInt(duration, 10);
  if (Number.isNaN(durationNum) || durationNum <= 0) {
    errors.push('Duration must be a positive number of minutes');
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    errors.push('At least one question must be selected for the assessment');
  } else {
    const normalizedQuestionIds = questions.map((questionId) => String(questionId));
    const invalidIds = normalizedQuestionIds.filter((qId) => !mongoose.Types.ObjectId.isValid(qId));
    if (invalidIds.length > 0) {
      errors.push('Assessment contains invalid question ID formats');
    }

    const uniqueIds = new Set(normalizedQuestionIds);
    if (uniqueIds.size !== normalizedQuestionIds.length) {
      errors.push('Duplicate question IDs are not allowed in the same assessment');
    }
  }

  if (errors.length > 0) {
    throw new ApiError(400, errors[0], errors);
  }

  const validQuestionsInDb = await Question.find({ _id: { $in: questions } }).select('_id');
  if (validQuestionsInDb.length !== questions.length) {
    throw new ApiError(400, 'One or more selected questions do not exist in the Question Bank');
  }

  return {
    title: title.trim(),
    description: description.trim(),
    technology,
    topic: topic.trim(),
    difficulty,
    duration: durationNum,
    questions: questions.map((questionId) => String(questionId))
  };
};

const validateAssessmentPublishability = async (assessmentData) => {
  const normalizedAssessment = {
    ...assessmentData,
    questions: Array.isArray(assessmentData.questions) ? assessmentData.questions : []
  };

  await validateAssessmentPayload(normalizedAssessment);

  if (!normalizedAssessment.title || !normalizedAssessment.title.trim()) {
    throw new ApiError(400, 'Assessment title is required before publishing');
  }

  if (!normalizedAssessment.description || !normalizedAssessment.description.trim()) {
    throw new ApiError(400, 'Assessment description is required before publishing');
  }

  if (!normalizedAssessment.technology) {
    throw new ApiError(400, 'Assessment technology is required before publishing');
  }

  if (!normalizedAssessment.topic || !normalizedAssessment.topic.trim()) {
    throw new ApiError(400, 'Assessment topic is required before publishing');
  }

  if (!normalizedAssessment.difficulty) {
    throw new ApiError(400, 'Assessment difficulty is required before publishing');
  }

  if (Number.isNaN(Number(normalizedAssessment.duration)) || Number(normalizedAssessment.duration) <= 0) {
    throw new ApiError(400, 'Assessment duration must be a positive number before publishing');
  }

  if (!Array.isArray(normalizedAssessment.questions) || normalizedAssessment.questions.length === 0) {
    throw new ApiError(400, 'At least one valid question is required before publishing');
  }

  return true;
};

module.exports = {
  validateAssessmentPayload,
  validateAssessmentPublishability
};
