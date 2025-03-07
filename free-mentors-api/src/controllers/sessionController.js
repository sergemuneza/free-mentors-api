// const Session = require("../models/Session");
// const User = require("../models/User");
// const mongoose = require("mongoose");

// // Create a mentorship session request
// exports.createSession = async (req, res) => {
//     try {
//         const { mentorId, questions } = req.body;
//         const menteeId = req.user.id; // Get user ID from token

//         // Validate ObjectId
//         if (!mongoose.Types.ObjectId.isValid(mentorId)) {
//             return res.status(400).json({ message: "Invalid mentor ID format" });
//         }

//         // Check if mentor exists and has the "mentor" role
//         const mentor = await User.findOne({ _id: mentorId, role: "mentor" });
//         if (!mentor) {
//             return res.status(404).json({ message: "Mentor not found" });
//         }

//         // Prevent users from requesting a session with themselves
//         if (menteeId === mentorId) {
//             return res.status(400).json({ message: "You cannot request a session with yourself" });
//         }

//         // Create session request
//         const newSession = new Session({
//             mentorId,
//             menteeId,
//             questions,
//         });

//         await newSession.save();

//         res.status(201).json({
//             status: 201,
//             message: "Mentorship session request created successfully",
//             data: newSession,
//         });
//     } catch (error) {
//         console.error("Error creating session:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

const Session = require("../models/Session");
const User = require("../models/User");
const mongoose = require("mongoose");

// Create a mentorship session request
exports.createSession = async (req, res) => {
    try {
        const { mentorId, questions } = req.body;
        const menteeId = req.user.id; // Get user ID from token

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(mentorId)) {
            return res.status(400).json({ message: "Invalid mentor ID format" });
        }

        // Check if mentor exists and has the "mentor" role
        const mentor = await User.findOne({ _id: mentorId, role: "mentor" });
        if (!mentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }

        // Prevent users from requesting a session with themselves
        if (menteeId === mentorId) {
            return res.status(400).json({ message: "You cannot request a session with yourself" });
        }

        // Get mentee's email
        const mentee = await User.findById(menteeId);
        if (!mentee) {
            return res.status(404).json({ message: "Mentee not found" });
        }

        // Create session request
        const newSession = new Session({
            mentorId,
            menteeId,
            questions,
        });

        await newSession.save();

        res.status(201).json({
            status: 201,
            message: "Mentorship session request created successfully",
            data: {
                _id: newSession._id,
                mentorId: newSession.mentorId,
                menteeId: newSession.menteeId,
                menteeEmail: mentee.email, // Include mentee's email in response
                questions: newSession.questions,
                status: newSession.status,
                createdAt: newSession.createdAt,
            },
        });
    } catch (error) {
        console.error("Error creating session:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Accept a mentorship session request
exports.acceptSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const mentorId = req.user.id; // Mentor's ID from token

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(sessionId)) {
            return res.status(400).json({ message: "Invalid session ID format" });
        }

        // Find the session
        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        // Ensure the logged-in user is the assigned mentor
        if (session.mentorId.toString() !== mentorId) {
            return res.status(403).json({ message: "Unauthorized. You can only accept your own session requests" });
        }

        // Update session status to "accepted"
        session.status = "accepted";
        await session.save();

        res.status(200).json({
            status: 200,
            message: "Session request accepted successfully",
            data: session,
        });
    } catch (error) {
        console.error("Error accepting session:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Reject a mentorship session request
exports.rejectSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const mentorId = req.user.id; // Mentor's ID from token

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(sessionId)) {
            return res.status(400).json({ message: "Invalid session ID format" });
        }

        // Find the session
        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        // Ensure the logged-in user is the assigned mentor
        if (session.mentorId.toString() !== mentorId) {
            return res.status(403).json({ message: "Unauthorized. You can only reject your own session requests" });
        }

        // Update session status to "rejected"
        session.status = "rejected";
        await session.save();

        res.status(200).json({
            status: 200,
            message: "Session request rejected successfully",
            data: session,
        });
    } catch (error) {
        console.error("Error rejecting session:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all mentorship sessions for the logged-in mentee
exports.getMenteeSessions = async (req, res) => {
    try {
        const menteeId = req.user.id; // Get mentee's ID from token

        // Find all sessions for the logged-in mentee
        const sessions = await Session.find({ menteeId })
            .populate("mentorId", "_id firstName lastName") // Get mentor details
            .populate("menteeId", "email") // Get mentee's email
            .select("-__v"); // Exclude unnecessary fields

        if (!sessions.length) {
            return res.status(404).json({ message: "No mentorship sessions found" });
        }

        // Format response to match the given spec
        const formattedSessions = sessions.map(session => ({
            sessionId: session._id,
            mentorId: session.mentorId._id,
            menteeId: session.menteeId._id,
            questions: session.questions,
            menteeEmail: session.menteeId.email,
            status: session.status
        }));

        res.status(200).json({
            status: 200,
            data: formattedSessions
        });
    } catch (error) {
        console.error("Error fetching mentee sessions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

