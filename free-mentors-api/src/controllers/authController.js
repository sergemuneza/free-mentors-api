/*
SERGE MUNEZA
*/

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Signup
exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, address, bio, occupation, expertise, role } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: "All required fields must be filled" });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({ firstName, lastName, email, password: hashedPassword, address, bio, occupation, expertise, role: role || "user" });

        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({ message: "User created successfully", user: { id: user._id, email: user.email, role: user.role }, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Signin

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ message: "User logged in successfully", user: { id: user._id, email: user.email, role: user.role }, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

