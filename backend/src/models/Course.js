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
    teacher: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
}, { timestamps: true });

// THE UPGRADE: A Compound Index
// This tells MongoDB: "MTM101 can exist multiple times, but Rakesh can only have one MTM101."
courseSchema.index({ courseCode: 1, teacher: 1 }, { unique: true });

module.exports = mongoose.model('Course', courseSchema);