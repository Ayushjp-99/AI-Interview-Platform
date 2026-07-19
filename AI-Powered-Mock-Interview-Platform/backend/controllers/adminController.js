const User = require('../models/User');
const Interview = require('../models/Interview');
const Report = require('../models/Report');
const Leaderboard = require('../models/Leaderboard');
const mongoose = require('mongoose');

/**
 * @desc    Get all users (admin)
 * @route   GET /api/admin/users
 * @access  Admin
 */
const getAllUsers = async (req, res) => {
  const { page = 1, limit = 20, search, role } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .select('-password'),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    users,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
};

/**
 * @desc    Get a specific user (admin)
 * @route   GET /api/admin/users/:id
 * @access  Admin
 */
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const [interviewCount, recentInterviews] = await Promise.all([
    Interview.countDocuments({ user: user._id }),
    Interview.find({ user: user._id })
      .sort('-createdAt')
      .limit(5)
      .select('category difficulty averageScore status createdAt'),
  ]);

  res.status(200).json({
    success: true,
    user,
    stats: { interviewCount, recentInterviews },
  });
};

/**
 * @desc    Delete a user (admin)
 * @route   DELETE /api/admin/users/:id
 * @access  Admin
 */
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (user.role === 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Cannot delete admin users',
    });
  }

  // Cascade delete user data
  await Promise.all([
    Interview.deleteMany({ user: user._id }),
    Report.deleteMany({ user: user._id }),
    Leaderboard.deleteOne({ user: user._id }),
    User.deleteOne({ _id: user._id }),
  ]);

  res.status(200).json({
    success: true,
    message: 'User and all associated data deleted successfully',
  });
};

/**
 * @desc    Toggle user active status (admin)
 * @route   PATCH /api/admin/users/:id/toggle-status
 * @access  Admin
 */
const toggleUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    isActive: user.isActive,
  });
};

/**
 * @desc    Get admin analytics dashboard
 * @route   GET /api/admin/analytics
 * @access  Admin
 */
const getAnalytics = async (req, res) => {
  const [
    totalUsers,
    activeUsers,
    totalInterviews,
    completedInterviews,
    avgScoreData,
    categoryStats,
    recentUsers,
    dailyInterviews,
  ] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'user', isActive: true }),
    Interview.countDocuments(),
    Interview.countDocuments({ status: 'completed' }),
    Interview.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, avg: { $avg: '$averageScore' } } },
    ]),
    Interview.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$category', count: { $sum: 1 }, avgScore: { $avg: '$averageScore' } } },
      { $sort: { count: -1 } },
    ]),
    User.find({ role: 'user' })
      .sort('-createdAt')
      .limit(5)
      .select('name email createdAt totalInterviews averageScore'),
    // Daily interview count for last 7 days
    Interview.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
          avgScore: { $avg: '$averageScore' },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    analytics: {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
      },
      interviews: {
        total: totalInterviews,
        completed: completedInterviews,
        inProgress: totalInterviews - completedInterviews,
        averageScore: avgScoreData[0]?.avg ? Math.round(avgScoreData[0].avg) : 0,
      },
      categoryStats,
      recentUsers,
      dailyInterviews,
    },
  });
};

/**
 * @desc    Get database statistics
 * @route   GET /api/admin/db-stats
 * @access  Admin
 */
const getDbStats = async (req, res) => {
  const [userCount, interviewCount, reportCount, leaderboardCount] =
    await Promise.all([
      User.estimatedDocumentCount(),
      Interview.estimatedDocumentCount(),
      Report.estimatedDocumentCount(),
      Leaderboard.estimatedDocumentCount(),
    ]);

  const dbStats = await mongoose.connection.db.stats();

  res.status(200).json({
    success: true,
    dbStats: {
      collections: {
        users: userCount,
        interviews: interviewCount,
        reports: reportCount,
        leaderboard: leaderboardCount,
      },
      database: {
        dataSize: dbStats.dataSize,
        storageSize: dbStats.storageSize,
        indexes: dbStats.indexes,
        collections: dbStats.collections,
      },
    },
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  toggleUserStatus,
  getAnalytics,
  getDbStats,
};
