const jwt = require("jsonwebtoken");
const User = require("../model/user"); 

const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_JWT);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
       
        req.user = user;
        
       
        if (user.role !== 'admin') {
            return res.status(403).json({ error: "Access denied: Admins only" });
        }

        next(); 
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

module.exports= auth;