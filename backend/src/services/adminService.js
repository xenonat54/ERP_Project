// backend/src/services/adminService.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createNewUser = async (userData) => {
    const { name, password, role } = userData;

    // 1. Generate the Random ID (STU-XXXX or TCH-XXXX)
    const prefix = role === 'teacher' ? 'TCH-' : 'STU-';
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    const portalId = `${prefix}${randomNum}`;

    // 2. Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the user object
    const newUser = new User({
        portalId,
        name,
        password: hashedPassword,
        role
    });

    // 4. Save to MongoDB and return the result
    const savedUser = await newUser.save();
    
    // We return the user, but strip out the password so we don't accidentally send it to the frontend!
    return {
        _id: savedUser._id,
        portalId: savedUser.portalId,
        name: savedUser.name,
        role: savedUser.role
    };
};

module.exports = { createNewUser };