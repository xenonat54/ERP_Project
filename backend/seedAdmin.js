// backend/seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // We need this to hash manually
const User = require('./src/models/User'); 
const dotenv = require('dotenv');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        // 1. Wipe any failed attempts to start fresh
        await User.deleteMany({ portalId: 'ADM-0001' });

        // 2. Manually Hash the password so the Login can read it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("MasterAdmin123!", salt);

        // 3. Create the Master Admin with the hashed password
        await User.create({
            name: "System Admin",
            password: hashedPassword, 
            role: "admin",
            portalId: "ADM-0001"
        });

        console.log("✅ Master Admin Created with Encrypted Password!");
        console.log("Portal ID: ADM-0001");
        console.log("Password: MasterAdmin123!");
        
        process.exit();
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seed();