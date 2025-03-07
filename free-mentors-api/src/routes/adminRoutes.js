const express = require('express');
const { promoteToMentor, viewAllSessions, deleteReview} = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Promote user to mentor (Admin only)
router.patch('/user/:userId', verifyToken, isAdmin, promoteToMentor);

// View all mentorship sessions (Admin only)
router.get('/sessions', verifyToken, isAdmin, viewAllSessions);

// Delete a review (Admin only)
router.delete('/sessions/:sessionId/review', verifyToken, isAdmin, deleteReview);

module.exports = router;
