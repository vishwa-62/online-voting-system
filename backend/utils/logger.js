const db = require('../config/db');

async function logActivity(userId, action, description, req = null) {
  try {
    const ipAddress = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1') : '127.0.0.1';
    await db.query(
      `INSERT INTO activity_logs (user_id, action, description, ip_address) VALUES (?, ?, ?, ?)`,
      [userId || null, action, description, ipAddress]
    );
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
}

module.exports = { logActivity };
