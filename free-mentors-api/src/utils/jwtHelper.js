const jwt = require("jsonwebtoken");
require("dotenv").config(); // Ensure environment variables are loaded

// Generate Auth Token
exports.generateAuthToken = (user) => {
    if (!user || (!user.id && !user._id)) {
        throw new Error("Invalid user object: Missing ID");
    }

    return jwt.sign(
        { id: user.id || user._id.toString(), role: user.role }, 
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

// Verify Token Middleware
exports.verifyToken = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1]; // Extract token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.id) {
            return res.status(403).json({ error: "Invalid token payload" });
        }

        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: "Invalid or expired token" });
    }
};
