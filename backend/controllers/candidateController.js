const db = require('../config/db');
const { logActivity } = require('../utils/logger');

// Get Candidates for an election
async function getCandidatesByElection(req, res) {
  try {
    const electionId = req.params.electionId || req.params.id;
    const candidates = await db.query(
      'SELECT * FROM candidates WHERE election_id = ? ORDER BY name ASC',
      [electionId]
    );
    return res.json({ success: true, candidates });
  } catch (err) {
    console.error('Get candidates error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch candidates.' });
  }
}

// Admin: Add Candidate
async function addCandidate(req, res) {
  try {
    const { election_id, name, photo, organization, description } = req.body;

    if (!election_id || !name || !organization) {
      return res.status(400).json({ success: false, message: 'Election ID, candidate name, and organization are required.' });
    }

    // Check if election exists
    const election = await db.queryOne('SELECT title FROM elections WHERE id = ?', [election_id]);
    if (!election) {
      return res.status(404).json({ success: false, message: 'Specified election does not exist.' });
    }

    // Check duplicate candidate in same election
    const existing = await db.queryOne(
      'SELECT id FROM candidates WHERE election_id = ? AND LOWER(name) = LOWER(?)',
      [election_id, name]
    );
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Candidate "${name}" is already registered in this election.`
      });
    }

    const defaultPhoto = photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80';

    const result = await db.query(
      `INSERT INTO candidates (election_id, name, photo, organization, description)
       VALUES (?, ?, ?, ?, ?)`,
      [election_id, name, defaultPhoto, organization, description || '']
    );

    const candidateId = result.insertId;

    await logActivity(req.user.id, 'CANDIDATE_ADD', `Added candidate ${name} to election ${election.title}`, req);

    return res.status(201).json({
      success: true,
      message: 'Candidate added successfully.',
      candidateId
    });
  } catch (err) {
    console.error('Add candidate error:', err);
    return res.status(500).json({ success: false, message: 'Failed to add candidate.' });
  }
}

// Admin: Update Candidate
async function updateCandidate(req, res) {
  try {
    const candidateId = req.params.id;
    const { name, photo, organization, description, election_id } = req.body;

    const existing = await db.queryOne('SELECT id, election_id FROM candidates WHERE id = ?', [candidateId]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Candidate not found.' });
    }

    const targetElectionId = election_id || existing.election_id;

    // Check duplicate candidate in same election
    if (name) {
      const dup = await db.queryOne(
        'SELECT id FROM candidates WHERE election_id = ? AND LOWER(name) = LOWER(?) AND id != ?',
        [targetElectionId, name, candidateId]
      );
      if (dup) {
        return res.status(400).json({
          success: false,
          message: `Another candidate with the name "${name}" already exists in this election.`
        });
      }
    }

    await db.query(
      `UPDATE candidates
       SET name = ?, photo = ?, organization = ?, description = ?, election_id = ?
       WHERE id = ?`,
      [name, photo, organization, description, targetElectionId, candidateId]
    );

    await logActivity(req.user.id, 'CANDIDATE_UPDATE', `Updated candidate ID: ${candidateId} (${name})`, req);

    return res.json({ success: true, message: 'Candidate details updated successfully.' });
  } catch (err) {
    console.error('Update candidate error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update candidate.' });
  }
}

// Admin: Delete Candidate
async function deleteCandidate(req, res) {
  try {
    const candidateId = req.params.id;

    const existing = await db.queryOne('SELECT name FROM candidates WHERE id = ?', [candidateId]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Candidate not found.' });
    }

    await db.query('DELETE FROM candidates WHERE id = ?', [candidateId]);

    await logActivity(req.user.id, 'CANDIDATE_DELETE', `Deleted candidate: ${existing.name} (ID: ${candidateId})`, req);

    return res.json({ success: true, message: 'Candidate removed successfully.' });
  } catch (err) {
    console.error('Delete candidate error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete candidate.' });
  }
}

module.exports = {
  getCandidatesByElection,
  addCandidate,
  updateCandidate,
  deleteCandidate
};
