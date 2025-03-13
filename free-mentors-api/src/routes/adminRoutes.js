/*
SERGE MUNEZA
*/

const express = require('express');
const { promoteToMentor, viewAllSessions, deleteSessionReview} = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Promote user to mentor (Admin only)
router.patch("/users/:userId/promote", verifyToken, isAdmin, promoteToMentor);


// View all mentorship sessions (Admin only)
router.get('/sessions', verifyToken, isAdmin, viewAllSessions);

// Delete a review (Admin only)
router.delete('/sessions/:sessionId/review', verifyToken, isAdmin, deleteSessionReview);

module.exports = router;
