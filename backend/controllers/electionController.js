const db = require('../config/db');
const { logActivity } = require('../utils/logger');

// Get all elections (for voters & admins)
async function getAllElections(req, res) {
  try {
    const userId = req.user ? req.user.id : null;
    const { status, type } = req.query;

    let sql = `
      SELECT e.*, 
        COUNT(DISTINCT c.id) as candidate_count,
        COUNT(DISTINCT v.id) as total_votes
      FROM elections e
      LEFT JOIN candidates c ON e.id = c.election_id
      LEFT JOIN votes v ON e.id = v.election_id
    `;

    const whereClauses = [];
    const params = [];

    if (status) {
      whereClauses.push('e.status = ?');
      params.push(status);
    }
    if (type) {
      whereClauses.push('e.election_type = ?');
      params.push(type);
    }

    if (whereClauses.length > 0) {
      sql += ' WHERE ' + whereClauses.join(' AND ');
    }

    sql += ' GROUP BY e.id ORDER BY e.start_date DESC';

    const elections = await db.query(sql, params);

    // If user is a logged-in voter, attach has_voted status for each election
    if (userId) {
      const userVotes = await db.query(
        'SELECT election_id, confirmation_id, cast_at FROM votes WHERE voter_id = ?',
        [userId]
      );
      const votedMap = new Map();
      userVotes.forEach(v => votedMap.set(v.election_id, v));

      elections.forEach(e => {
        const voteInfo = votedMap.get(e.id);
        e.has_voted = !!voteInfo;
        e.user_vote_confirmation = voteInfo ? voteInfo.confirmation_id : null;
        e.user_voted_at = voteInfo ? voteInfo.cast_at : null;
      });
    }

    return res.json({ success: true, elections });
  } catch (err) {
    console.error('Get all elections error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch elections.' });
  }
}

// Get single election details with candidates
async function getElectionById(req, res) {
  try {
    const electionId = req.params.id;
    const userId = req.user ? req.user.id : null;

    const election = await db.queryOne(
      'SELECT * FROM elections WHERE id = ?',
      [electionId]
    );

    if (!election) {
      return res.status(404).json({ success: false, message: 'Election not found.' });
    }

    // Fetch candidates for this election
    const candidates = await db.query(
      'SELECT * FROM candidates WHERE election_id = ? ORDER BY name ASC',
      [electionId]
    );

    // Check if user has voted in this election
    let hasVoted = false;
    let voteDetails = null;
    if (userId) {
      const existingVote = await db.queryOne(
        'SELECT id, confirmation_id, cast_at FROM votes WHERE voter_id = ? AND election_id = ?',
        [userId, electionId]
      );
      if (existingVote) {
        hasVoted = true;
        voteDetails = existingVote;
      }
    }

    // Fetch total vote count for summary
    const stats = await db.queryOne(
      'SELECT COUNT(*) as total_votes FROM votes WHERE election_id = ?',
      [electionId]
    );

    return res.json({
      success: true,
      election,
      candidates,
      hasVoted,
      voteDetails,
      totalVotes: stats ? stats.total_votes : 0
    });
  } catch (err) {
    console.error('Get election by ID error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch election details.' });
  }
}

// Admin: Create Election
async function createElection(req, res) {
  try {
    const { title, description, election_type, start_date, end_date, status } = req.body;

    if (!title || !start_date || !end_date) {
      return res.status(400).json({ success: false, message: 'Title, start date, and end date are required.' });
    }

    const electionStatus = status || 'upcoming';

    const result = await db.query(
      `INSERT INTO elections (title, description, election_type, start_date, end_date, status, results_published, created_by)
       VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
      [title, description || '', election_type || 'General Election', start_date, end_date, electionStatus, req.user.id]
    );

    const newElectionId = result.insertId;

    await logActivity(req.user.id, 'ELECTION_CREATE', `Created election: ${title} (ID: ${newElectionId})`, req);

    return res.status(201).json({
      success: true,
      message: 'Election created successfully.',
      electionId: newElectionId
    });
  } catch (err) {
    console.error('Create election error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create election.' });
  }
}

// Admin: Update Election
async function updateElection(req, res) {
  try {
    const electionId = req.params.id;
    const { title, description, election_type, start_date, end_date, status, results_published } = req.body;

    const existing = await db.queryOne('SELECT id FROM elections WHERE id = ?', [electionId]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Election not found.' });
    }

    await db.query(
      `UPDATE elections
       SET title = ?, description = ?, election_type = ?, start_date = ?, end_date = ?, status = ?, results_published = ?
       WHERE id = ?`,
      [title, description, election_type, start_date, end_date, status, results_published ? 1 : 0, electionId]
    );

    await logActivity(req.user.id, 'ELECTION_UPDATE', `Updated election ID: ${electionId} (${title})`, req);

    return res.json({ success: true, message: 'Election updated successfully.' });
  } catch (err) {
    console.error('Update election error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update election.' });
  }
}

// Admin: Delete Election
async function deleteElection(req, res) {
  try {
    const electionId = req.params.id;

    const existing = await db.queryOne('SELECT title FROM elections WHERE id = ?', [electionId]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Election not found.' });
    }

    await db.query('DELETE FROM elections WHERE id = ?', [electionId]);

    await logActivity(req.user.id, 'ELECTION_DELETE', `Deleted election: ${existing.title} (ID: ${electionId})`, req);

    return res.json({ success: true, message: 'Election deleted successfully.' });
  } catch (err) {
    console.error('Delete election error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete election.' });
  }
}

module.exports = {
  getAllElections,
  getElectionById,
  createElection,
  updateElection,
  deleteElection
};
