const express = require("express");
const router = express.Router();
const User = require("../../model/user");
const bcrypt = require("bcrypt");
require('dotenv').config();

router.post("/", async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
    
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists with this email" });
        }

  
        const hashedPassword = await bcrypt.hash(password, 10);

  
        const userData = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        const savedData = await userData.save();
        res.status(201).json({ message: "Account created successfully", user: savedData });
    } catch (error) {
        console.error("Signup error:", error); 
        res.status(500).json({ error: "Failed to create an account" });
    }
});

module.exports = router;
