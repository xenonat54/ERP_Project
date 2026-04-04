// backend/src/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Route: GET /api/student/profile
// Bouncers: Must be logged in (protect) AND have the 'student' role (authorize)
router.get('/profile', protect, authorize('student'), studentController.getMyProfile);
router.get('/grades', protect, authorize('student'), studentController.getMyGrades);

module.exports = router;