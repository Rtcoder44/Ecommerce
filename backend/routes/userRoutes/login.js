const express = require("express");
const router = express.Router();
const User = require("../../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();

const secret = process.env.SECRET_JWT;

router.post("/", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

 
        const token = jwt.sign({ id: user._id }, process.env.SECRET_JWT, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error("Login error:", error); 
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;
