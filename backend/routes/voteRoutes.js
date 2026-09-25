const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const { authenticateToken, requireVerifiedVoter } = require('../middleware/auth');

router.post('/', authenticateToken, requireVerifiedVoter, voteController.castVote);
router.get('/status/:electionId', authenticateToken, voteController.getVoteStatus);
router.get('/history', authenticateToken, voteController.getVoteHistory);

module.exports = router;
