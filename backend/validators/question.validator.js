const ApiError = require('../utils/ApiError');

const ALLOWED_TECHNOLOGIES = [
  'JavaScript',
  'React',
  'Node.js',
  'Express.js',
  'MongoDB',
  'Java',
  'SQL'
];

const validateQuestionPayload = (data) => {
  const {
    questionText,
    type,
    technology,
    topic,
    difficulty,
    options,
    correctAnswer,
    explanation,
    tags
  } = data;

  const errors = [];

  if (!questionText || typeof questionText !== 'string' || !questionText.trim()) {
    errors.push('Question text is required');
  }

  if (!type || !['MCQ', 'SUBJECTIVE'].includes(type)) {
    errors.push('Type must be either MCQ or SUBJECTIVE');
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

  let sanitizedOptions = [];
  let sanitizedCorrectAnswer = '';

  if (type === 'MCQ') {
    if (!Array.isArray(options) || options.length < 2) {
      errors.push('MCQ questions require at least 2 options');
    } else {
      sanitizedOptions = options.map((opt) => (typeof opt === 'string' ? opt.trim() : '')).filter(Boolean);
      if (sanitizedOptions.length < 2) {
        errors.push('MCQ questions require at least 2 non-empty options');
      }
    }

    if (!correctAnswer || typeof correctAnswer !== 'string' || !correctAnswer.trim()) {
      errors.push('Correct answer is required for MCQ questions');
    } else {
      sanitizedCorrectAnswer = correctAnswer.trim();
      if (sanitizedOptions.length >= 2 && !sanitizedOptions.includes(sanitizedCorrectAnswer)) {
        errors.push('Correct answer must match one of the provided options');
      }
    }
  }

  if (errors.length > 0) {
    throw new ApiError(400, errors[0], errors);
  }

  // Format tags array
  let sanitizedTags = [];
  if (Array.isArray(tags)) {
    sanitizedTags = tags.map((t) => (typeof t === 'string' ? t.trim() : '')).filter(Boolean);
  } else if (typeof tags === 'string' && tags.trim()) {
    sanitizedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
  }

  return {
    questionText: questionText.trim(),
    type,
    technology,
    topic: topic.trim(),
    difficulty,
    options: type === 'MCQ' ? sanitizedOptions : [],
    correctAnswer: type === 'MCQ' ? sanitizedCorrectAnswer : '',
    explanation: explanation && typeof explanation === 'string' ? explanation.trim() : '',
    tags: sanitizedTags
  };
};

module.exports = {
  validateQuestionPayload,
  ALLOWED_TECHNOLOGIES
};
