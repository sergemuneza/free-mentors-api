// const User = require("../models/User");

// // Get all mentors
// exports.getAllMentors = async (req, res) => {
//     try {
//         const mentors = await User.find({ role: "mentor" }).select("-password"); // Exclude password field
//         if (!mentors.length) {
//             return res.status(404).json({ message: "No mentors available" });
//         }

//         res.status(200).json({ status: 200, data: mentors });
//     } catch (error) {
//         res.status(500).json({ error: "Server error" });
//     }
// };

// // Get a specific mentor by ID
// exports.getMentorById = async (req, res) => {
//     try {
//         const mentor = await User.findOne({ _id: req.params.mentorId, role: "mentor" }).select("-password");

//         if (!mentor) {
//             return res.status(404).json({ error: "Mentor not found" });
//         }

//         res.status(200).json({ status: 200, data: mentor });
//     } catch (error) {
//         res.status(500).json({ error: "Server error" });
//     }
// };

const User = require("../models/User");
const mongoose = require("mongoose");

// Get all mentors
exports.getAllMentors = async (req, res) => {
    try {
        const mentors = await User.find({ role: "mentor" }).select("-password"); // Exclude password field
        if (!mentors.length) {
            return res.status(404).json({ message: "No mentors available" });
        }

        res.status(200).json({ status: 200, data: mentors });
    } catch (error) {
        console.error("Error fetching mentors:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a specific mentor by ID
exports.getMentorById = async (req, res) => {
    try {
        const { mentorId } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(mentorId)) {
            return res.status(400).json({ message: "Invalid mentor ID format" });
        }

        const mentor = await User.findOne({ _id: mentorId, role: "mentor" }).select("-password");

        if (!mentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }

        res.status(200).json({ status: 200, data: mentor });
    } catch (error) {
        console.error("Error fetching mentor:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
