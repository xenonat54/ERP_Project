// backend/src/controllers/studentController.js
const User = require('../models/User');
const Grade = require('../models/Grade');

const getMyProfile = async (req, res) => {
    try {
        // The 'protect' middleware already found the user and attached it to req.user
        // We just need to fetch their full profile from the database, hiding the password
        const studentProfile = await User.findById(req.user._id).select('-password');

        if (!studentProfile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        res.status(200).json({
            success: true,
            data: studentProfile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error: Could not fetch profile'
        });
    }
};
const getMyGrades = async (req, res) => {
    try {
        // Notice the .populate()! This tells MongoDB to grab the actual course details
        const grades = await Grade.find({ student: req.user._id })
            .populate('course', 'courseName courseCode') 
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: grades.length,
            data: grades
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error: Could not fetch grades' });
    }
};

module.exports = { getMyProfile, getMyGrades };