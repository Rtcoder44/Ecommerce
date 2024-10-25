const jwt = require("jsonwebtoken");
const User = require("../model/user");
require("dotenv").config();
const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.log("No authorization header provided.");
            return res.status(401).json({ error: "Unauthorized access: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            console.log("Token is missing in the authorization header.");
            return res.status(401).json({ error: "Unauthorized access: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_JWT);

        const user = await User.findById(decoded.id);
        if (!user) {
            console.log(`User with ID ${decoded.id} not found.`);
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            console.log("Invalid JWT:", error.message);
            return res.status(401).json({ error: "Invalid token" });
        } else if (error.name === "TokenExpiredError") {
            console.log("Expired JWT:", error.message);
            return res.status(401).json({ error: "Token expired" });
        } else {
            console.log("Token validation error:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

module.exports = auth;
