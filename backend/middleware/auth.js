const jwt = require('jsonwebtoken');
const db = require('../config/db');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No authorization token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_online_voting_jwt_key_2026_secure');
    const user = await db.queryOne(
      'SELECT id, full_name, email, mobile, role, voter_id, verification_status, account_status FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!user) {
      return res.status(401).json({ success: false, message: 'User associated with token no longer exists.' });
    }

    if (user.account_status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended by an administrator.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired authorization token.' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ success: false, message: `Access denied. Requires ${role} role permissions.` });
    }
    next();
  };
}

function requireVerifiedVoter(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }
  if (req.user.role !== 'admin' && req.user.verification_status !== 'verified') {
    return res.status(403).json({
      success: false,
      message: 'Your voter account is currently pending verification or rejected. You cannot perform this action.'
    });
  }
  next();
}

module.exports = {
  authenticateToken,
  requireRole,
  requireVerifiedVoter
};
