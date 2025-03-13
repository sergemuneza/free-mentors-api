/*
SERGE MUNEZA
*/

const User = require("../models/User");
const Session = require("../models/Session");
const mongoose = require("mongoose"); 

exports.promoteToMentor = async (req, res) => {
  try {
      console.log("API Received User ID (Raw):", req.params.userId);

      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
          return res.status(400).json({ error: "Invalid user ID format" });
      }

      const user = await User.findById(req.params.userId);
      console.log("Fetched User From DB:", user);

      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      if (user.role === "mentor") {
          return res.status(400).json({ message: "User is already a mentor" });
      }

      user.role = "mentor";
      await user.save();

      res.status(200).json({ message: "User promoted to mentor", data: user });
  } catch (error) {
      console.error("Error promoting user:", error);
      res.status(500).json({ error: "Server error" });
  }
};


// View all mentorship sessions
exports.viewAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find()
            .populate("mentorId", "_id firstName lastName")
            .populate("menteeId", "_id email");

        // Filter out sessions with missing mentor or mentee details
        const validSessions = sessions.filter(session => session.mentorId && session.menteeId);

        res.status(200).json({
            status: 200,
            data: validSessions.map(session => ({
                sessionId: session._id,
                mentorId: session.mentorId._id,
                mentorName: `${session.mentorId.firstName} ${session.mentorId.lastName}`,
                menteeId: session.menteeId._id,
                menteeEmail: session.menteeId.email,
                questions: session.questions,
                status: session.status
            }))
        });
    } catch (error) {
        console.error("Error fetching all mentorship sessions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Admin can delete a mentorship session review
exports.deleteSessionReview = async (req, res) => {
    try {
        const { sessionId } = req.params;

        // Validate ObjectId before querying
        if (!mongoose.Types.ObjectId.isValid(sessionId)) {
            return res.status(400).json({ error: "Invalid session ID format" });
        }

        const session = await Session.findById(sessionId);

        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        // Check if review exists before attempting deletion
        if (!session.review) {
            return res.status(404).json({ error: "No review found for this session" });
        }

        // Remove the review
        session.review = undefined;
        await session.save();

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ error: "Server error" });
    }
};
