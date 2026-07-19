const express = require('express');
const router = express.Router();
const {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviewHistory,
  getInterview,
  deleteInterview,
  getDashboardStats,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.post('/start', startInterview);
router.get('/history', getInterviewHistory);
router.get('/dashboard-stats', getDashboardStats);
router.get('/:id', getInterview);
router.post('/:id/answer', submitAnswer);
router.post('/:id/complete', completeInterview);
router.delete('/:id', deleteInterview);

module.exports = router;
