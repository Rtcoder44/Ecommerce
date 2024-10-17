const express = require("express");
const router = express.Router();
const User = require("../../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secret = process.env.SECRET_JWT;

router.post("/", async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = new User({
            fullName,
            email,
            password: hashedPassword,
        });
        const savedData = await userData.save();
        res.status(201).json({ message: "Account created Successfully", user: savedData });
    } catch (error) {
        res.status(500).json({ error: "Failed to create an account" });
    }
});

module.exports = router;