// backend/src/services/authService.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUser = async (credentials) => {
    const { portalId, password } = credentials;

    // 1. Check if the user exists in the database
    const user = await User.findOne({ portalId });
    if (!user) {
        throw new Error('Invalid Portal ID or Password');
    }

    // 2. Compare the plain-text password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid Portal ID or Password'); 
        // Notice we don't say "Wrong password". That gives hackers too much info!
    }

    // 3. Generate the JWT (The digital ID card)
    // We pack the user's ID and Role into the token so the frontend knows who they are
    const payload = {
        userId: user._id,
        portalId: user.portalId,
        role: user.role
    };

    // Sign the token using the secret key from .env, make it expire in 1 day
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // 4. Return the token and basic user info
    return {
        token,
        user: {
            portalId: user.portalId,
            name: user.name,
            role: user.role
        }
    };
};

module.exports = { loginUser };