const Report = require('../models/Report');
const Interview = require('../models/Interview');

/**
 * @desc    Get a specific report
 * @route   GET /api/reports/:id
 * @access  Private
 */
const getReport = async (req, res) => {
  const report = await Report.findOne({
    _id: req.params.id,
    user: req.user.id,
  }).populate('interview', 'category difficulty totalQuestions questions completedAt timeTakenTotal');

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found',
    });
  }

  res.status(200).json({
    success: true,
    report,
  });
};

/**
 * @desc    Get report by interview ID
 * @route   GET /api/reports/interview/:interviewId
 * @access  Private
 */
const getReportByInterview = async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.interviewId,
    user: req.user.id,
  });

  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview not found',
    });
  }

  const report = await Report.findOne({
    interview: req.params.interviewId,
  }).populate('interview');

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found for this interview',
    });
  }

  res.status(200).json({
    success: true,
    report,
    interview,
  });
};

/**
 * @desc    Get all reports for current user
 * @route   GET /api/reports
 * @access  Private
 */
const getUserReports = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [reports, total] = await Promise.all([
    Report.find({ user: req.user.id })
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .select('overallScore category difficulty createdAt recommendedTopics'),
    Report.countDocuments({ user: req.user.id }),
  ]);

  res.status(200).json({
    success: true,
    reports,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
};

module.exports = { getReport, getReportByInterview, getUserReports };
