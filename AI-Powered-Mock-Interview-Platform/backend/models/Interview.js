const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  userAnswer: {
    type: String,
    default: '',
  },
  aiEvaluation: {
    score: { type: Number, default: 0 },
    explanation: { type: String, default: '' },
    mistakes: [String],
    betterAnswer: { type: String, default: '' },
    suggestions: [String],
    confidenceRating: { type: String, default: '' },
    difficultyAnalysis: { type: String, default: '' },
  },
  isAnswered: {
    type: Boolean,
    default: false,
  },
  timeTaken: {
    type: Number, // seconds
    default: 0,
  },
});

const InterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'MERN',
        'React',
        'Node',
        'Express',
        'MongoDB',
        'JavaScript',
        'HTML',
        'CSS',
        'C++',
        'Java',
        'Python',
        'DBMS',
        'Operating Systems',
        'Computer Networks',
        'OOP',
        'SQL',
        'Data Structures',
      ],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: ['Easy', 'Medium', 'Hard'],
    },
    timeLimit: {
      type: Number, // in minutes
      required: true,
      min: 5,
      max: 120,
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
    questions: [QuestionSchema],
    // Results
    totalScore: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    answeredCount: {
      type: Number,
      default: 0,
    },
    // Status
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'abandoned'],
      default: 'in-progress',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    timeTakenTotal: {
      type: Number, // seconds
      default: 0,
    },
    // AI Generated content
    strengths: [String],
    weaknesses: [String],
    overallFeedback: {
      type: String,
      default: '',
    },
    learningPath: [String],
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
InterviewSchema.index({ user: 1, createdAt: -1 });
InterviewSchema.index({ status: 1 });
InterviewSchema.index({ category: 1 });

module.exports = mongoose.model('Interview', InterviewSchema);
