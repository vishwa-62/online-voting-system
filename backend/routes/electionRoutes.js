const express = require('express');
const router = express.Router();
const electionController = require('../controllers/electionController');
const candidateController = require('../controllers/candidateController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Public / Authenticated election browsing
router.get('/', authenticateToken, electionController.getAllElections);
router.get('/:id', authenticateToken, electionController.getElectionById);
router.get('/:id/candidates', authenticateToken, candidateController.getCandidatesByElection);

// Admin-only election management
router.post('/', authenticateToken, requireRole('admin'), electionController.createElection);
router.put('/:id', authenticateToken, requireRole('admin'), electionController.updateElection);
router.delete('/:id', authenticateToken, requireRole('admin'), electionController.deleteElection);

module.exports = router;
