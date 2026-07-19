const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
      unique: true,
    },
    // Score Summary
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    scoreBreakdown: [
      {
        questionIndex: Number,
        question: String,
        score: Number,
        category: String,
      },
    ],
    // Analysis
    strengths: [String],
    weaknesses: [String],
    topicAnalysis: [
      {
        topic: String,
        score: Number,
        questionsCount: Number,
      },
    ],
    // Learning
    learningPath: [
      {
        topic: String,
        resources: [String],
        priority: { type: String, enum: ['High', 'Medium', 'Low'] },
      },
    ],
    recommendedTopics: [String],
    // Metadata
    category: String,
    difficulty: String,
    totalQuestions: Number,
    answeredQuestions: Number,
    timeTaken: Number, // seconds
    geminiSummary: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

ReportSchema.index({ user: 1, createdAt: -1 });
ReportSchema.index({ interview: 1 });

module.exports = mongoose.model('Report', ReportSchema);
