// backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Bouncer 1: Check for a valid ID Card (Token)
const protect = async (req, res, next) => {
    let token;

    // The frontend will send the token in the Headers as "Bearer asdfghjkl..."
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Split the string and grab just the token part
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using our secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch the user from the database and attach it to the request (minus the password)
            req.user = await User.findById(decoded.userId).select('-password');

            // Everything is good, let them pass!
            next(); 
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Not authorized, token failed or expired' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
};

// Bouncer 2: Check for VIP Access (Roles)
const authorize = (...roles) => {
    return (req, res, next) => {
        // req.user.role was set by the 'protect' middleware right before this!
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `Access Denied: Role '${req.user.role}' is not allowed here.` 
            });
        }
        // If they have the right role, let them pass!
        next();
    };
};

module.exports = { protect, authorize };