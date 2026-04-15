// backend/src/models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseCode: { 
        type: String, 
        required: true, 
        uppercase: true, 
        trim: true
        // Notice we REMOVED unique: true from here!
    },
    courseName: { 
        type: String, 
        required: true,
        trim: true
    },
    section: { 
        type: String,
        required: true
    },
    teacher: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
}, { timestamps: true });

courseSchema.index({ courseCode: 1, section: 1 }, { unique: true });
module.exports = mongoose.model('Course', courseSchema);