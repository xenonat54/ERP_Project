// backend/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { 
    createUser, 
    createCourse, 
    enrollStudent, 
    getUsersByRole, 
    getAllCourses,
    deleteStudent,
    deleteTeacher 
} = require('../controllers/adminController'); 
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/create-user', protect, authorize('admin'), createUser);
router.post('/create-course', protect, authorize('admin'), createCourse);
router.post('/enroll', protect, authorize('admin'), enrollStudent);

router.get('/users/:role', protect, authorize('admin'), getUsersByRole);
router.get('/courses', protect, authorize('admin'), getAllCourses);

router.delete('/student/:studentId', protect, authorize('admin'), deleteStudent);
router.post('/teacher/:teacherId/delete', protect, authorize('admin'), deleteTeacher);
module.exports = router;