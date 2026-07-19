const express = require('express');
const router = express.Router();
const { getReport, getReportByInterview, getUserReports } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getUserReports);
router.get('/interview/:interviewId', getReportByInterview);
router.get('/:id', getReport);

module.exports = router;
