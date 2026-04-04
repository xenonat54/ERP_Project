// backend/server.js

// 1. Load environment variables first (MUST be at the very top)
require('dotenv').config(); 

// 2. Import your Express app and Database connection logic
const app = require('./src/app');
const connectDB = require('./src/config/db');

// 3. Define the port
const PORT = process.env.PORT || 5000;

// 4. Connect to MongoDB, THEN start listening for requests
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Enterprise ERP Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("❌ Failed to start the server due to database connection error:", err);
});