// backend/src/routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Route: GET /api/teacher/students
// Bouncers: Must be logged in (protect) AND have the 'teacher' role (authorize)
router.get('/students', protect, authorize('teacher'), teacherController.getAllStudents);
router.post('/grades', protect, authorize('teacher'), teacherController.assignGrade);
router.get('/profile', protect, authorize('teacher'), teacherController.getTeacherProfile);
module.exports = router;