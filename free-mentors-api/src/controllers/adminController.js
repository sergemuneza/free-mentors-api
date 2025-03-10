/*
SERGE MUNEZA
*/

const User = require('../models/User');

exports.promoteToMentor = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.role === 'mentor') {
            return res.status(400).json({ message: 'User is already a mentor' });
        }

        user.role = 'mentor';
        await user.save();

        res.status(200).json({ message: 'User promoted to mentor', data: user });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const Session = require('../models/Session');

exports.viewAllSessions = async (req, res) => {
    try {
        // Retrieve all mentorship sessions
        const sessions = await Session.find()
            .populate("mentorId", "_id firstName lastName") // Get mentor details
            .populate("menteeId", "email") // Get mentee's email
            .select("-__v");

        if (!sessions.length) {
            return res.status(404).json({ message: "No mentorship sessions found" });
        }

        // Format response according to the spec
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
        console.error("Error fetching all mentorship sessions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Admin can delete a mentorship session review
exports.deleteSessionReview = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Find the session
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Check if review field exists (Ensure your schema includes "review")
    if (!session.review) {
      return res.status(404).json({ error: "No review found for this session" });
    }

    // Remove the review
    session.review = undefined;
    await session.save();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
