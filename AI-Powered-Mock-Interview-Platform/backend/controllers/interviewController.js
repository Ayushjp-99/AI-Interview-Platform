const Interview = require('../models/Interview');
const Report = require('../models/Report');
const User = require('../models/User');
const Leaderboard = require('../models/Leaderboard');
const {
  generateQuestions,
  evaluateAnswer,
  generateInterviewSummary,
} = require('../services/groqService');

/**
 * @desc    Start a new interview session
 * @route   POST /api/interviews/start
 * @access  Private
 */
const startInterview = async (req, res) => {
  const { category, difficulty, timeLimit, totalQuestions } = req.body;

  // Validate inputs
  if (!category || !difficulty || !timeLimit || !totalQuestions) {
    return res.status(400).json({
      success: false,
      message: 'Please provide category, difficulty, timeLimit, and totalQuestions',
    });
  }

  const validCategories = [
    'MERN', 'React', 'Node', 'Express', 'MongoDB', 'JavaScript',
    'HTML', 'CSS', 'C++', 'Java', 'Python', 'DBMS',
    'Operating Systems', 'Computer Networks', 'OOP', 'SQL', 'Data Structures',
  ];

  if (!validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category',
    });
  }

  if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
    return res.status(400).json({
      success: false,
      message: 'Difficulty must be Easy, Medium, or Hard',
    });
  }

  const qCount = Math.min(Math.max(parseInt(totalQuestions), 1), 20);
  const tLimit = Math.min(Math.max(parseInt(timeLimit), 5), 120);

  // Generate questions via Gemini
  const questionTexts = await generateQuestions(category, difficulty, qCount);

  const questions = questionTexts.map((q) => ({
    questionText: q,
    userAnswer: '',
    isAnswered: false,
    aiEvaluation: {
      score: 0,
      explanation: '',
      mistakes: [],
      betterAnswer: '',
      suggestions: [],
      confidenceRating: '',
      difficultyAnalysis: '',
    },
  }));

  // Create interview session
  const interview = await Interview.create({
    user: req.user.id,
    category,
    difficulty,
    timeLimit: tLimit,
    totalQuestions: qCount,
    questions,
    status: 'in-progress',
    startedAt: new Date(),
  });

  res.status(201).json({
    success: true,
    message: 'Interview started successfully',
    interview: {
      _id: interview._id,
      category: interview.category,
      difficulty: interview.difficulty,
      timeLimit: interview.timeLimit,
      totalQuestions: interview.totalQuestions,
      questions: interview.questions.map((q) => ({
        _id: q._id,
        questionText: q.questionText,
        isAnswered: q.isAnswered,
      })),
      status: interview.status,
      startedAt: interview.startedAt,
    },
  });
};

/**
 * @desc    Submit an answer for a specific question
 * @route   POST /api/interviews/:id/answer
 * @access  Private
 */
const submitAnswer = async (req, res) => {
  const { questionIndex, answer, timeTaken } = req.body;

  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user.id,
    status: 'in-progress',
  });

  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview not found or already completed',
    });
  }

  if (questionIndex < 0 || questionIndex >= interview.questions.length) {
    return res.status(400).json({
      success: false,
      message: 'Invalid question index',
    });
  }

  const question = interview.questions[questionIndex];

  // Evaluate answer with Gemini
  const evaluation = await evaluateAnswer(
    question.questionText,
    answer,
    interview.category,
    interview.difficulty
  );

  // Update question
  interview.questions[questionIndex].userAnswer = answer;
  interview.questions[questionIndex].isAnswered = true;
  interview.questions[questionIndex].timeTaken = timeTaken || 0;
  interview.questions[questionIndex].aiEvaluation = evaluation;

  await interview.save();

  res.status(200).json({
    success: true,
    message: 'Answer submitted and evaluated',
    evaluation,
    questionIndex,
  });
};

/**
 * @desc    Complete the interview and generate final report
 * @route   POST /api/interviews/:id/complete
 * @access  Private
 */
const completeInterview = async (req, res) => {
  const { timeTakenTotal } = req.body;

  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview not found',
    });
  }

  if (interview.status === 'completed') {
    // Return existing report
    const report = await Report.findOne({ interview: interview._id });
    return res.status(200).json({
      success: true,
      message: 'Interview already completed',
      interviewId: interview._id,
      reportId: report?._id,
    });
  }

  // Calculate scores
  const answeredQuestions = interview.questions.filter((q) => q.isAnswered);
  const totalScore = answeredQuestions.reduce(
    (sum, q) => sum + (q.aiEvaluation.score || 0),
    0
  );
  const averageScore =
    answeredQuestions.length > 0
      ? Math.round(totalScore / answeredQuestions.length)
      : 0;

  // Generate AI summary
  const summary = await generateInterviewSummary(
    interview.questions,
    interview.category,
    averageScore
  );

  // Update interview
  interview.status = 'completed';
  interview.completedAt = new Date();
  interview.timeTakenTotal = timeTakenTotal || 0;
  interview.totalScore = totalScore;
  interview.averageScore = averageScore;
  interview.answeredCount = answeredQuestions.length;
  interview.strengths = summary.strengths || [];
  interview.weaknesses = summary.weaknesses || [];
  interview.overallFeedback = summary.overallFeedback || '';
  interview.learningPath = summary.learningPath || [];
  await interview.save();

  // Create detailed report
  const scoreBreakdown = interview.questions.map((q, i) => ({
    questionIndex: i,
    question: q.questionText,
    score: q.aiEvaluation.score || 0,
    category: interview.category,
  }));

  const report = await Report.create({
    user: req.user.id,
    interview: interview._id,
    overallScore: averageScore,
    scoreBreakdown,
    strengths: summary.strengths || [],
    weaknesses: summary.weaknesses || [],
    learningPath: (summary.learningPath || []).map((topic) => ({
      topic,
      resources: [],
      priority: averageScore < 50 ? 'High' : averageScore < 75 ? 'Medium' : 'Low',
    })),
    recommendedTopics: summary.recommendedTopics || [],
    category: interview.category,
    difficulty: interview.difficulty,
    totalQuestions: interview.totalQuestions,
    answeredQuestions: answeredQuestions.length,
    timeTaken: timeTakenTotal || 0,
    geminiSummary: summary.overallFeedback || '',
  });

  // Update user stats
  const user = await User.findById(req.user.id);
  user.updateStats(averageScore);

  // Update weak/strong topics
  if (averageScore >= 70) {
    if (!user.strongTopics.includes(interview.category)) {
      user.strongTopics.push(interview.category);
    }
    user.weakTopics = user.weakTopics.filter((t) => t !== interview.category);
  } else if (averageScore < 50) {
    if (!user.weakTopics.includes(interview.category)) {
      user.weakTopics.push(interview.category);
    }
  }

  // Check for achievements
  checkAndAwardAchievements(user, averageScore);

  await user.save({ validateBeforeSave: false });

  // Update leaderboard
  await updateLeaderboard(req.user.id, averageScore, interview._id);

  res.status(200).json({
    success: true,
    message: 'Interview completed successfully',
    interviewId: interview._id,
    reportId: report._id,
    averageScore,
    summary,
  });
};

/**
 * @desc    Get all interviews for current user
 * @route   GET /api/interviews/history
 * @access  Private
 */
const getInterviewHistory = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    difficulty,
    status,
    sort = '-createdAt',
    search,
  } = req.query;

  const query = { user: req.user.id };

  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [interviews, total] = await Promise.all([
    Interview.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-questions.aiEvaluation.betterAnswer -questions.userAnswer'),
    Interview.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    interviews,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
    },
  });
};

/**
 * @desc    Get a specific interview with full details
 * @route   GET /api/interviews/:id
 * @access  Private
 */
const getInterview = async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview not found',
    });
  }

  res.status(200).json({
    success: true,
    interview,
  });
};

/**
 * @desc    Delete an interview
 * @route   DELETE /api/interviews/:id
 * @access  Private
 */
const deleteInterview = async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview not found',
    });
  }

  // Delete associated report
  await Report.deleteOne({ interview: interview._id });
  await Interview.deleteOne({ _id: interview._id });

  res.status(200).json({
    success: true,
    message: 'Interview deleted successfully',
  });
};

/**
 * @desc    Get dashboard statistics for current user
 * @route   GET /api/interviews/dashboard-stats
 * @access  Private
 */
const getDashboardStats = async (req, res) => {
  const userId = req.user.id;

  const [
    totalInterviews,
    completedInterviews,
    recentInterviews,
    categoryStats,
    user,
  ] = await Promise.all([
    Interview.countDocuments({ user: userId }),
    Interview.countDocuments({ user: userId, status: 'completed' }),
    Interview.find({ user: userId, status: 'completed' })
      .sort('-completedAt')
      .limit(5)
      .select('category difficulty averageScore completedAt totalQuestions answeredCount'),
    Interview.aggregate([
      { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(userId), status: 'completed' } },
      {
        $group: {
          _id: '$category',
          avgScore: { $avg: '$averageScore' },
          count: { $sum: 1 },
        },
      },
      { $sort: { avgScore: -1 } },
    ]),
    User.findById(userId),
  ]);

  // Performance trend (last 7 interviews)
  const performanceTrend = await Interview.find({
    user: userId,
    status: 'completed',
  })
    .sort('-completedAt')
    .limit(7)
    .select('averageScore completedAt category');

  res.status(200).json({
    success: true,
    stats: {
      totalInterviews,
      completedInterviews,
      averageScore: user.averageScore,
      skillLevel: user.skillLevel,
      strongTopics: user.strongTopics,
      weakTopics: user.weakTopics,
      achievements: user.achievements,
    },
    recentInterviews,
    categoryStats,
    performanceTrend: performanceTrend.reverse(),
  });
};

// ---- Helper functions ----

const checkAndAwardAchievements = (user, score) => {
  const existing = user.achievements.map((a) => a.title);

  const newAchievements = [];

  if (user.totalInterviews === 1 && !existing.includes('First Interview')) {
    newAchievements.push({
      title: 'First Interview',
      description: 'Completed your first interview!',
      icon: '🎯',
    });
  }

  if (user.totalInterviews === 10 && !existing.includes('Interview Veteran')) {
    newAchievements.push({
      title: 'Interview Veteran',
      description: 'Completed 10 interviews!',
      icon: '🏆',
    });
  }

  if (score === 100 && !existing.includes('Perfect Score')) {
    newAchievements.push({
      title: 'Perfect Score',
      description: 'Achieved a perfect 100/100 score!',
      icon: '⭐',
    });
  }

  if (score >= 90 && !existing.includes('High Achiever')) {
    newAchievements.push({
      title: 'High Achiever',
      description: 'Scored 90+ in an interview!',
      icon: '🚀',
    });
  }

  if (user.skillLevel === 'Expert' && !existing.includes('Expert Level')) {
    newAchievements.push({
      title: 'Expert Level',
      description: 'Reached Expert skill level!',
      icon: '💎',
    });
  }

  user.achievements.push(...newAchievements);
};

const updateLeaderboard = async (userId, score, interviewId) => {
  try {
    let entry = await Leaderboard.findOne({ user: userId });

    if (!entry) {
      entry = new Leaderboard({ user: userId });
    }

    // Update all-time stats
    entry.totalInterviews += 1;
    entry.totalScore += score;
    entry.averageScore = Math.round(entry.totalScore / entry.totalInterviews);
    if (score > entry.highestScore) entry.highestScore = score;

    // Check if we need to reset weekly stats
    const now = new Date();
    const weekStart = new Date(now);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);

    if (!entry.weekStart || entry.weekStart < weekStart) {
      entry.weeklyInterviews = 0;
      entry.weeklyScore = 0;
      entry.weekStart = weekStart;
    }

    entry.weeklyInterviews += 1;
    entry.weeklyScore += score;
    entry.weeklyAverage = Math.round(entry.weeklyScore / entry.weeklyInterviews);

    // Check if we need to reset monthly stats
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    if (!entry.monthStart || entry.monthStart < monthStart) {
      entry.monthlyInterviews = 0;
      entry.monthlyScore = 0;
      entry.monthStart = monthStart;
    }

    entry.monthlyInterviews += 1;
    entry.monthlyScore += score;
    entry.monthlyAverage = Math.round(entry.monthlyScore / entry.monthlyInterviews);

    entry.lastUpdated = now;

    await entry.save();
  } catch (error) {
    console.error('Leaderboard update error:', error.message);
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviewHistory,
  getInterview,
  deleteInterview,
  getDashboardStats,
};
