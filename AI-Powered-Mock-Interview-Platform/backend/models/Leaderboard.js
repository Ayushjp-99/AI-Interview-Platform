const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    // All-time stats
    totalInterviews: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    highestScore: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    // Weekly stats (reset every Monday)
    weeklyInterviews: {
      type: Number,
      default: 0,
    },
    weeklyScore: {
      type: Number,
      default: 0,
    },
    weeklyAverage: {
      type: Number,
      default: 0,
    },
    weekStart: {
      type: Date,
      default: () => {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(now.setDate(diff));
      },
    },
    // Monthly stats (reset on 1st of month)
    monthlyInterviews: {
      type: Number,
      default: 0,
    },
    monthlyScore: {
      type: Number,
      default: 0,
    },
    monthlyAverage: {
      type: Number,
      default: 0,
    },
    monthStart: {
      type: Date,
      default: () => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
      },
    },
    // Rankings (updated periodically)
    allTimeRank: {
      type: Number,
      default: 0,
    },
    weeklyRank: {
      type: Number,
      default: 0,
    },
    monthlyRank: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

LeaderboardSchema.index({ averageScore: -1 });
LeaderboardSchema.index({ totalInterviews: -1 });
LeaderboardSchema.index({ weeklyAverage: -1 });
LeaderboardSchema.index({ monthlyAverage: -1 });

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);
