const Leaderboard = require('../models/Leaderboard');

/**
 * @desc    Get leaderboard (all-time, weekly, monthly)
 * @route   GET /api/leaderboard
 * @access  Private
 */
const getLeaderboard = async (req, res) => {
  const { type = 'alltime', limit = 20 } = req.query;

  let sortField = { averageScore: -1, totalInterviews: -1 };

  if (type === 'weekly') {
    sortField = { weeklyAverage: -1, weeklyInterviews: -1 };
  } else if (type === 'monthly') {
    sortField = { monthlyAverage: -1, monthlyInterviews: -1 };
  } else if (type === 'most-interviews') {
    sortField = { totalInterviews: -1, averageScore: -1 };
  }

  const entries = await Leaderboard.find({ totalInterviews: { $gt: 0 } })
    .sort(sortField)
    .limit(parseInt(limit))
    .populate('user', 'name email avatar skillLevel totalInterviews averageScore');

  // Add rank
  const rankedEntries = entries.map((entry, index) => ({
    rank: index + 1,
    user: entry.user,
    stats:
      type === 'weekly'
        ? {
            score: entry.weeklyAverage,
            interviews: entry.weeklyInterviews,
          }
        : type === 'monthly'
        ? {
            score: entry.monthlyAverage,
            interviews: entry.monthlyInterviews,
          }
        : {
            score: entry.averageScore,
            interviews: entry.totalInterviews,
            highestScore: entry.highestScore,
          },
  }));

  // Find current user's rank
  let myRank = null;
  if (req.user) {
    const myEntry = await Leaderboard.findOne({ user: req.user.id });
    if (myEntry) {
      const myRankCount = await Leaderboard.countDocuments({
        averageScore: { $gt: myEntry.averageScore },
        totalInterviews: { $gt: 0 },
      });
      myRank = myRankCount + 1;
    }
  }

  res.status(200).json({
    success: true,
    type,
    leaderboard: rankedEntries,
    myRank,
    total: rankedEntries.length,
  });
};

module.exports = { getLeaderboard };
