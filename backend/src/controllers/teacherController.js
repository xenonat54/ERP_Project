// backend/src/controllers/teacherController.js
const User = require('../models/User');
const Grade = require('../models/Grade');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// 1. Smart Student Fetcher (Resource-Based Access Control)
const getAllStudents = async (req, res) => {
    try {
        // Step A: Find all courses this specific teacher owns using their JWT token ID
        const myCourses = await Course.find({ teacher: req.user._id });
        const courseIds = myCourses.map(course => course._id);

        // Step B: Find all enrollments for these courses, and "populate" the student details
        const enrollments = await Enrollment.find({ course: { $in: courseIds } })
            .populate('student', 'name portalId role _id'); 

        // Step C: Filter out duplicates (in case a student takes two classes with the same teacher)
        const uniqueStudents = [];
        const seenIds = new Set();

        enrollments.forEach(record => {
            if (record.student && !seenIds.has(record.student._id.toString())) {
                seenIds.add(record.student._id.toString());
                uniqueStudents.push(record.student);
            }
        });

        res.status(200).json({
            success: true,
            count: uniqueStudents.length,
            data: uniqueStudents
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error: Could not fetch roster' });
    }
};

// 2. Smart Grading System
const assignGrade = async (req, res) => {
    try {
        const { studentId, score, remarks } = req.body; 
        // Notice we are ignoring the "subject" string the frontend sends! We don't need it anymore.

        // Step A: Get the teacher's courses
        const myCourses = await Course.find({ teacher: req.user._id });
        const courseIds = myCourses.map(c => c._id);

        // Step B: Security Check - Is Abhay actually enrolled in one of this teacher's courses?
        const enrollment = await Enrollment.findOne({
            student: studentId,
            course: { $in: courseIds }
        });

        if (!enrollment) {
            return res.status(403).json({ 
                success: false, 
                message: 'Security Block: You cannot grade a student who is not in your class.' 
            });
        }

        // Step C: Create the grade, permanently locking it to the official Course ID!
        const newGrade = await Grade.create({
            student: studentId,
            course: enrollment.course, // Automatically pulled from the database!
            score,
            remarks
        });

        res.status(201).json({
            success: true,
            message: 'Grade securely assigned to official course roster.',
            data: newGrade
        });
    } catch (error) {
        res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
};

module.exports = { getAllStudents, assignGrade };