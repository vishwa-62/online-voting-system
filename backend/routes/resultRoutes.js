const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const { authenticateToken } = require('../middleware/auth');

router.get('/:electionId', authenticateToken, resultController.getElectionResults);

module.exports = router;
