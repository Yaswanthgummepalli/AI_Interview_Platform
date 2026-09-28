const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Question type is required'],
      enum: {
        values: ['MCQ', 'SUBJECTIVE'],
        message: 'Question type must be either MCQ or SUBJECTIVE'
      }
    },
    technology: {
      type: String,
      required: [true, 'Technology is required'],
      enum: {
        values: ['JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'Java', 'SQL'],
        message: 'Technology must be one of: JavaScript, React, Node.js, Express.js, MongoDB, Java, SQL'
      },
      trim: true
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: {
        values: ['EASY', 'MEDIUM', 'HARD'],
        message: 'Difficulty must be EASY, MEDIUM, or HARD'
      }
    },
    options: {
      type: [String],
      default: []
    },
    correctAnswer: {
      type: String,
      default: '',
      trim: true
    },
    explanation: {
      type: String,
      default: '',
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator User ID is required']
    }
  },
  {
    timestamps: true
  }
);

// Helper method to format question based on user role (hides correctAnswer for normal USERs)
questionSchema.methods.toSafeObject = function (userRole = 'USER') {
  const obj = this.toObject();
  if (userRole !== 'ADMIN') {
    delete obj.correctAnswer;
  }
  return obj;
};

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
