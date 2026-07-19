/**
 * Utility helpers
 */

/**
 * Format seconds into mm:ss
 */
const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/**
 * Get skill level label from score
 */
const getSkillLevel = (score) => {
  if (score >= 85) return 'Expert';
  if (score >= 70) return 'Advanced';
  if (score >= 50) return 'Intermediate';
  return 'Beginner';
};

/**
 * Calculate percentage
 */
const calcPercentage = (part, total) => {
  if (!total) return 0;
  return Math.round((part / total) * 100);
};

/**
 * Paginate an array
 */
const paginate = (array, page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  return array.slice(start, start + limit);
};

/**
 * Sleep utility for rate limiting
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = { formatTime, getSkillLevel, calcPercentage, paginate, sleep };
