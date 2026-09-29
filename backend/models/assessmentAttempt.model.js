const mongoose = require('mongoose');

const assessmentAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: [true, 'Assessment is required']
    },
    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
          required: [true, 'Question reference is required']
        },
        answer: {
          type: String,
          default: ''
        }
      }
    ],
    startedAt: {
      type: Date,
      required: [true, 'Started at is required']
    },
    completedAt: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: {
        values: ['IN_PROGRESS', 'COMPLETED'],
        message: 'Status must be IN_PROGRESS or COMPLETED'
      },
      default: 'IN_PROGRESS'
    },
    score: {
      type: Number,
      default: 0
    },
    maxScore: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    incorrectAnswers: {
      type: Number,
      default: 0
    },
    unansweredAnswers: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Performance indexes
assessmentAttemptSchema.index({ user: 1, createdAt: -1 });
assessmentAttemptSchema.index({ assessment: 1 });
assessmentAttemptSchema.index({ status: 1 });
assessmentAttemptSchema.index({ completedAt: 1 });

const AssessmentAttempt = mongoose.model('AssessmentAttempt', assessmentAttemptSchema);

module.exports = AssessmentAttempt;
