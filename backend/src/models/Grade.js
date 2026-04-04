// backend/src/models/Grade.js
const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    course: { // <-- THIS IS THE BIG CHANGE
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    remarks: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Grade', gradeSchema);