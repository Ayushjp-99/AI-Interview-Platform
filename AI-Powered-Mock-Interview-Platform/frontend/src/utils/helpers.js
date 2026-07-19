/**
 * Frontend utility helpers
 */

/**
 * Format score to score class (for styling)
 */
export const getScoreClass = (score) => {
  if (score >= 80) return 'score-excellent';
  if (score >= 60) return 'score-good';
  if (score >= 40) return 'score-average';
  return 'score-poor';
};

/**
 * Format score to label
 */
export const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Average';
  if (score >= 20) return 'Below Average';
  return 'Poor';
};

/**
 * Format seconds to mm:ss
 */
export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/**
 * Format date to readable string
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date with time
 */
export const formatDateTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format duration in seconds to human readable
 */
export const formatDuration = (seconds) => {
  if (!seconds) return '0m';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
};

/**
 * Truncate text
 */
export const truncate = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Get difficulty badge class
 */
export const getDifficultyClass = (difficulty) => {
  switch (difficulty) {
    case 'Easy': return 'badge-success';
    case 'Medium': return 'badge-warning';
    case 'Hard': return 'badge-danger';
    default: return 'badge-primary';
  }
};

/**
 * Get category icon emoji
 */
export const getCategoryIcon = (category) => {
  const icons = {
    'MERN': '🌿',
    'React': '⚛️',
    'Node': '🟢',
    'Express': '🚂',
    'MongoDB': '🍃',
    'JavaScript': '🟡',
    'HTML': '🔴',
    'CSS': '🔵',
    'C++': '⚙️',
    'Java': '☕',
    'Python': '🐍',
    'DBMS': '🗄️',
    'Operating Systems': '💻',
    'Computer Networks': '🌐',
    'OOP': '🏛️',
    'SQL': '📊',
    'Data Structures': '🌳',
  };
  return icons[category] || '📝';
};

/**
 * Get skill level color class
 */
export const getSkillLevelClass = (level) => {
  switch (level) {
    case 'Expert': return 'badge-success';
    case 'Advanced': return 'badge-primary';
    case 'Intermediate': return 'badge-warning';
    default: return 'badge-secondary';
  }
};

/**
 * Extract error message from axios error
 */
export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
};

/**
 * Generate initials from name
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Calculate time ago
 */
export const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dateStr);
};
