/*
SERGE MUNEZA
*/

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Verify Token
exports.verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access denied, no token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔍 Decoded Token:", verified); // Debugging step to check if `id` is included
        req.user = verified; // Ensure the user object is properly assigned
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
};

// Admin Only Middleware
exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') { // Ensure `req.user` exists before checking role
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    next();
};
