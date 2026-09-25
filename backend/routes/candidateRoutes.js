const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.post('/', authenticateToken, requireRole('admin'), candidateController.addCandidate);
router.put('/:id', authenticateToken, requireRole('admin'), candidateController.updateCandidate);
router.delete('/:id', authenticateToken, requireRole('admin'), candidateController.deleteCandidate);

module.exports = router;
