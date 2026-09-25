const crypto = require('crypto');
const db = require('../config/db');
const { logActivity } = require('../utils/logger');

// Cast Vote
async function castVote(req, res) {
  try {
    const { election_id, candidate_id } = req.body;
    // ALWAYS use authenticated voter ID from req.user (JWT), NEVER trust payload voter_id
    const voterId = req.user.id;

    if (!election_id || !candidate_id) {
      return res.status(400).json({ success: false, message: 'Election ID and Candidate ID are required.' });
    }

    // 1. Verify User Role & Verification Status
    if (req.user.role !== 'voter') {
      return res.status(403).json({ success: false, message: 'Only registered voters can cast votes.' });
    }

    if (req.user.verification_status !== 'verified') {
      return res.status(403).json({
        success: false,
        message: 'Your voter account is not verified. You must be verified by an admin before voting.'
      });
    }

    // 2. Check Election existence & status
    const election = await db.queryOne('SELECT * FROM elections WHERE id = ?', [election_id]);
    if (!election) {
      return res.status(404).json({ success: false, message: 'Election not found.' });
    }

    if (election.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Voting is closed for this election. Current status: ${election.status.toUpperCase()}.`
      });
    }

    // 3. Check Election timeframe
    const now = new Date();
    const startDate = new Date(election.start_date);
    const endDate = new Date(election.end_date);

    if (now < startDate) {
      return res.status(400).json({ success: false, message: 'Voting has not started for this election yet.' });
    }
    if (now > endDate) {
      return res.status(400).json({ success: false, message: 'Voting period for this election has ended.' });
    }

    // 4. Check Candidate belongs to this election
    const candidate = await db.queryOne(
      'SELECT id, name FROM candidates WHERE id = ? AND election_id = ?',
      [candidate_id, election_id]
    );

    if (!candidate) {
      return res.status(400).json({ success: false, message: 'Selected candidate does not belong to this election.' });
    }

    // 5. Check if user already voted in this election
    const existingVote = await db.queryOne(
      'SELECT id, confirmation_id FROM votes WHERE voter_id = ? AND election_id = ?',
      [voterId, election_id]
    );

    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted in this election. Duplicate votes are strictly prohibited.',
        confirmation_id: existingVote.confirmation_id
      });
    }

    // 6. Generate Unique Confirmation ID (e.g. VOTE-2026-A8B9C0D1)
    const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
    const year = new Date().getFullYear();
    const confirmationId = `VOTE-${year}-${randomHex}`;

    // 7. Insert vote (Protected by DB unique constraint on voter_id + election_id)
    try {
      await db.query(
        `INSERT INTO votes (election_id, candidate_id, voter_id, confirmation_id, cast_at)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [election_id, candidate_id, voterId, confirmationId]
      );
    } catch (dbErr) {
      if (dbErr.message && (dbErr.message.includes('UNIQUE') || dbErr.message.includes('Duplicate'))) {
        return res.status(400).json({
          success: false,
          message: 'You have already voted in this election.'
        });
      }
      throw dbErr;
    }

    await logActivity(
      voterId,
      'VOTE_CAST',
      `Cast vote in election ID: ${election_id} (${election.title}). Confirmation: ${confirmationId}`,
      req
    );

    return res.status(201).json({
      success: true,
      message: 'Your vote has been successfully recorded.',
      vote: {
        election_id,
        election_title: election.title,
        confirmation_id: confirmationId,
        cast_at: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Cast vote error:', err);
    return res.status(500).json({ success: false, message: 'Server error while recording vote. Please try again.' });
  }
}

// Get vote status for a specific election
async function getVoteStatus(req, res) {
  try {
    const electionId = req.params.electionId;
    const voterId = req.user.id;

    const vote = await db.queryOne(
      'SELECT id, confirmation_id, cast_at FROM votes WHERE voter_id = ? AND election_id = ?',
      [voterId, electionId]
    );

    return res.json({
      success: true,
      hasVoted: !!vote,
      voteDetails: vote || null
    });
  } catch (err) {
    console.error('Get vote status error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch vote status.' });
  }
}

// Get user voting history
async function getVoteHistory(req, res) {
  try {
    const voterId = req.user.id;

    const votes = await db.query(
      `SELECT v.id, v.confirmation_id, v.cast_at, e.id as election_id, e.title as election_title, e.election_type, e.status as election_status
       FROM votes v
       JOIN elections e ON v.election_id = e.id
       WHERE v.voter_id = ?
       ORDER BY v.cast_at DESC`,
      [voterId]
    );

    return res.json({ success: true, votes });
  } catch (err) {
    console.error('Get vote history error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch voting history.' });
  }
}

module.exports = {
  castVote,
  getVoteStatus,
  getVoteHistory
};
