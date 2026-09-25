const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.use(authenticateToken);
router.use(requireRole('admin'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/voters', adminController.getVoters);
router.put('/voters/:id/verify', adminController.verifyVoter);
router.put('/voters/:id/status', adminController.updateVoterStatus);
router.delete('/voters/:id', adminController.deleteVoter);
router.get('/logs', adminController.getActivityLogs);

module.exports = router;
