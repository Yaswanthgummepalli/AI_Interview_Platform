const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Assessment title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Assessment description is required'],
      trim: true
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
      required: [true, 'Difficulty level is required'],
      enum: {
        values: ['EASY', 'MEDIUM', 'HARD'],
        message: 'Difficulty must be EASY, MEDIUM, or HARD'
      }
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
      }
    ],
    duration: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: [1, 'Duration must be at least 1 minute']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator User ID is required']
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Helper method to format assessment based on user role (hides correctAnswer inside questions for normal USERs)
assessmentSchema.methods.toSafeObject = function (userRole = 'USER') {
  const obj = this.toObject();

  if (Array.isArray(obj.questions)) {
    obj.questions = obj.questions.map((q) => {
      // If q is a populated Question document
      if (q && typeof q === 'object' && q._id) {
        if (userRole !== 'ADMIN') {
          delete q.correctAnswer;
        }
      }
      return q;
    });
  }

  return obj;
};

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
