const db = require('../config/db');
const { logActivity } = require('../utils/logger');

// Admin Dashboard Summary & Charts
async function getDashboardStats(req, res) {
  try {
    const totalVotersRow = await db.queryOne("SELECT COUNT(*) as count FROM users WHERE role = 'voter'");
    const verifiedVotersRow = await db.queryOne("SELECT COUNT(*) as count FROM users WHERE role = 'voter' AND verification_status = 'verified'");
    const totalElectionsRow = await db.queryOne("SELECT COUNT(*) as count FROM elections");
    const activeElectionsRow = await db.queryOne("SELECT COUNT(*) as count FROM elections WHERE status = 'active'");
    const totalCandidatesRow = await db.queryOne("SELECT COUNT(*) as count FROM candidates");
    const totalVotesRow = await db.queryOne("SELECT COUNT(*) as count FROM votes");

    // Votes per election chart data
    const votesPerElection = await db.query(`
      SELECT e.id, e.title, COUNT(v.id) as total_votes
      FROM elections e
      LEFT JOIN votes v ON e.id = v.election_id
      GROUP BY e.id
      ORDER BY total_votes DESC
      LIMIT 10
    `);

    // Verification stats
    const verificationBreakdown = await db.query(`
      SELECT verification_status, COUNT(*) as count
      FROM users
      WHERE role = 'voter'
      GROUP BY verification_status
    `);

    // Recent activity logs
    const recentLogs = await db.query(`
      SELECT l.*, u.full_name as user_name, u.role as user_role
      FROM activity_logs l
      LEFT JOIN users u ON l.user_id = u.id
      ORDER BY l.created_at DESC
      LIMIT 8
    `);

    return res.json({
      success: true,
      stats: {
        totalVoters: parseInt(totalVotersRow ? totalVotersRow.count : 0),
        verifiedVoters: parseInt(verifiedVotersRow ? verifiedVotersRow.count : 0),
        totalElections: parseInt(totalElectionsRow ? totalElectionsRow.count : 0),
        activeElections: parseInt(activeElectionsRow ? activeElectionsRow.count : 0),
        totalCandidates: parseInt(totalCandidatesRow ? totalCandidatesRow.count : 0),
        totalVotes: parseInt(totalVotesRow ? totalVotesRow.count : 0)
      },
      charts: {
        votesPerElection,
        verificationBreakdown
      },
      recentLogs
    });
  } catch (err) {
    console.error('Get admin dashboard stats error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch admin dashboard statistics.' });
  }
}

// Voter Management List
async function getVoters(req, res) {
  try {
    const { search, verification, status } = req.query;

    let sql = `
      SELECT id, full_name, email, mobile, voter_id, date_of_birth, verification_status, account_status, created_at
      FROM users
      WHERE role = 'voter'
    `;
    const params = [];

    if (search) {
      sql += ' AND (full_name LIKE ? OR email LIKE ? OR voter_id LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (verification) {
      sql += ' AND verification_status = ?';
      params.push(verification);
    }

    if (status) {
      sql += ' AND account_status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC';

    const voters = await db.query(sql, params);
    return res.json({ success: true, voters });
  } catch (err) {
    console.error('Get voters list error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch voter list.' });
  }
}

// Verify Voter
async function verifyVoter(req, res) {
  try {
    const voterId = req.params.id;
    const { status } = req.body; // 'verified', 'rejected', 'pending'

    if (!['verified', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status.' });
    }

    const voter = await db.queryOne("SELECT id, full_name FROM users WHERE id = ? AND role = 'voter'", [voterId]);
    if (!voter) {
      return res.status(404).json({ success: false, message: 'Voter not found.' });
    }

    await db.query(
      'UPDATE users SET verification_status = ? WHERE id = ?',
      [status, voterId]
    );

    await logActivity(req.user.id, 'VOTER_VERIFY', `Updated verification status of voter ${voter.full_name} to ${status.toUpperCase()}`, req);

    return res.json({ success: true, message: `Voter status updated to ${status}.` });
  } catch (err) {
    console.error('Verify voter error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update voter verification.' });
  }
}

// Update Voter Account Status (Active/Suspended)
async function updateVoterStatus(req, res) {
  try {
    const voterId = req.params.id;
    const { status } = req.body; // 'active', 'suspended'

    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid account status.' });
    }

    const voter = await db.queryOne("SELECT id, full_name FROM users WHERE id = ? AND role = 'voter'", [voterId]);
    if (!voter) {
      return res.status(404).json({ success: false, message: 'Voter not found.' });
    }

    await db.query(
      'UPDATE users SET account_status = ? WHERE id = ?',
      [status, voterId]
    );

    await logActivity(req.user.id, 'VOTER_STATUS', `Updated account status of voter ${voter.full_name} to ${status.toUpperCase()}`, req);

    return res.json({ success: true, message: `Voter account status updated to ${status}.` });
  } catch (err) {
    console.error('Update voter status error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update voter status.' });
  }
}

// Delete Voter
async function deleteVoter(req, res) {
  try {
    const voterId = req.params.id;

    const voter = await db.queryOne("SELECT full_name FROM users WHERE id = ? AND role = 'voter'", [voterId]);
    if (!voter) {
      return res.status(404).json({ success: false, message: 'Voter not found.' });
    }

    await db.query('DELETE FROM users WHERE id = ?', [voterId]);

    await logActivity(req.user.id, 'VOTER_DELETE', `Deleted voter account: ${voter.full_name}`, req);

    return res.json({ success: true, message: 'Voter account deleted successfully.' });
  } catch (err) {
    console.error('Delete voter error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete voter account.' });
  }
}

// Get Activity Logs
async function getActivityLogs(req, res) {
  try {
    const { search, action } = req.query;

    let sql = `
      SELECT l.*, u.full_name as user_name, u.email as user_email, u.role as user_role
      FROM activity_logs l
      LEFT JOIN users u ON l.user_id = u.id
    `;
    const params = [];

    const whereClauses = [];
    if (search) {
      whereClauses.push('(l.description LIKE ? OR l.action LIKE ? OR u.full_name LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    if (action) {
      whereClauses.push('l.action = ?');
      params.push(action);
    }

    if (whereClauses.length > 0) {
      sql += ' WHERE ' + whereClauses.join(' AND ');
    }

    sql += ' ORDER BY l.created_at DESC LIMIT 100';

    const logs = await db.query(sql, params);
    return res.json({ success: true, logs });
  } catch (err) {
    console.error('Get activity logs error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch activity logs.' });
  }
}

module.exports = {
  getDashboardStats,
  getVoters,
  verifyVoter,
  updateVoterStatus,
  deleteVoter,
  getActivityLogs
};
