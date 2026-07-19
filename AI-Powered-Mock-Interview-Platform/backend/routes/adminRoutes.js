const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUser,
  toggleUserStatus,
  getAnalytics,
  getDbStats,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.get('/analytics', getAnalytics);
router.get('/db-stats', getDbStats);

module.exports = router;
