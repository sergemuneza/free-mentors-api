/*
SERGE MUNEZA
*/

const express = require("express");
const { createSession,acceptSession, rejectSession, getMenteeSessions, reviewSession } = require("../controllers/sessionController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a mentorship session request (Authenticated users only)
router.post("/", verifyToken, createSession);
// Mentor accepts a session request
router.patch("/:sessionId/accept", verifyToken, acceptSession);

// Mentor rejects a session request
router.patch("/:sessionId/reject", verifyToken, rejectSession);

// Mentee views their mentorship session requests
router.get("/", verifyToken, getMenteeSessions);

router.post("/:sessionId/review", verifyToken, reviewSession);

module.exports = router;
