// backend/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { 
    createUser, 
    createCourse, 
    enrollStudent, 
    getUsersByRole, 
    getAllCourses 
} = require('../controllers/adminController'); 
const { protect, authorize } = require('../middlewares/authMiddleware');

// Existing Action Routes
router.post('/create-user', protect, authorize('admin'), createUser);
router.post('/create-course', protect, authorize('admin'), createCourse);
router.post('/enroll', protect, authorize('admin'), enrollStudent);

// NEW Fetch Routes for the UI Dropdowns
router.get('/users/:role', protect, authorize('admin'), getUsersByRole);
router.get('/courses', protect, authorize('admin'), getAllCourses);

module.exports = router;