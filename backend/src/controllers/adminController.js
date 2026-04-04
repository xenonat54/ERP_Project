const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// 1. CREATE USER (Student, Teacher, or Admin)
const createUser = async (req, res) => {
    try {
        const { name, password, role } = req.body;

        // Auto-generate Portal ID (e.g., STU-0001, FAC-0001)
        const lastUser = await User.findOne({ role }).sort({ createdAt: -1 });
        let newNum = 1;
        if (lastUser && lastUser.portalId) {
            const lastIdParts = lastUser.portalId.split('-');
            newNum = parseInt(lastIdParts[1]) + 1;
        }

        const prefix = role === 'admin' ? 'ADM' : role === 'teacher' ? 'FAC' : 'STU';
        const portalId = `${prefix}-${newNum.toString().padStart(4, '0')}`;

        // IMPORTANT: We use 'new User' + '.save()' to trigger the Bcrypt Hashing Hook in User.js
        const newUser = new User({
            name,
            portalId,
            password, 
            role
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: `${role} created successfully`,
            portalId: newUser.portalId,
            data: newUser 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. CREATE COURSE SECTION (Assigning a Subject to a Teacher)
const createCourse = async (req, res) => {
    try {
        const { courseCode, courseName, teacherId } = req.body;

        // Check if teacher exists and is actually a teacher
        const teacher = await User.findById(teacherId);
        if (!teacher || teacher.role !== 'teacher') {
            return res.status(400).json({ success: false, message: 'Invalid Teacher ID' });
        }

        const newCourse = await Course.create({
            courseCode,
            courseName,
            teacher: teacherId
        });

        res.status(201).json({
            success: true,
            message: 'Course section created successfully',
            data: newCourse
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'This teacher is already assigned to this course code.' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. ENROLL STUDENT (With Course Code Collision Protection)
const enrollStudent = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        // Validation: Does the student exist?
        const student = await User.findById(studentId);
        if (!student || student.role !== 'student') {
            return res.status(400).json({ success: false, message: 'Invalid Student ID' });
        }

        // Validation: Does the target course section exist?
        const targetCourse = await Course.findById(courseId);
        if (!targetCourse) {
            return res.status(400).json({ success: false, message: 'Invalid Course ID' });
        }

        // --- THE UPGRADE: Prevent duplicate subject enrollments ---
        
        // 1. Fetch every enrollment this student already has, and populate the course details
        const existingEnrollments = await Enrollment.find({ student: studentId }).populate('course');

        // 2. Loop through them. Does any existing course have the same code (e.g., MTM101) as the new course?
        const alreadyTakingSubject = existingEnrollments.some((record) => {
            // Check if the course exists (in case a course was deleted) and if the codes match
            return record.course && record.course.courseCode === targetCourse.courseCode;
        });

        // 3. Block it if a match is found!
        if (alreadyTakingSubject) {
            return res.status(400).json({ 
                success: false, 
                message: `Collision: This student is already enrolled in a section of ${targetCourse.courseCode}.` 
            });
        }
        // ---------------------------------------------------------

        // If they pass the check, create the enrollment!
        const enrollment = await Enrollment.create({
            student: studentId,
            course: courseId
        });

        res.status(201).json({
            success: true,
            message: 'Student enrolled successfully',
            data: enrollment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// 4. FETCH USERS BY ROLE (For UI Dropdowns)
const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;
        const users = await User.find({ role }).select('-password');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
};

// 5. FETCH ALL COURSES (For UI Dropdowns)
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('teacher', 'name portalId');
        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching courses' });
    }
};

module.exports = { 
    createUser, 
    createCourse, 
    enrollStudent, 
    getUsersByRole, 
    getAllCourses 
};