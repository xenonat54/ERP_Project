// backend/src/controllers/authController.js
const authService = require('../services/authService');

const login = async (req, res) => {
    try {
        const result = await authService.loginUser(req.body);
        
        // 200 OK means login was successful
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        });
    } catch (error) {
        // 401 Unauthorized means bad credentials
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { login };