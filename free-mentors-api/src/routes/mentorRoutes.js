/*
SERGE MUNEZA
*/
 
const express = require("express");
const { getAllMentors, getMentorById } = require("../controllers/mentorController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all mentors
router.get("/", verifyToken, getAllMentors);

// Get a specific mentor by ID
router.get("/:mentorId", verifyToken, getMentorById);

module.exports = router;
