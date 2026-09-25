const db = require('../config/db');

async function getElectionResults(req, res) {
  try {
    const electionId = req.params.electionId;
    const userRole = req.user ? req.user.role : 'guest';

    const election = await db.queryOne('SELECT * FROM elections WHERE id = ?', [electionId]);
    if (!election) {
      return res.status(404).json({ success: false, message: 'Election not found.' });
    }

    // Access control: non-admins can only see results if results_published is true or election is completed
    if (userRole !== 'admin' && !election.results_published && election.status !== 'completed') {
      return res.status(403).json({
        success: false,
        message: 'Election results for this contest have not been published by the administration yet.',
        isPublished: false
      });
    }

    // 1. Total registered verified voters (eligible population)
    const verifiedVotersRow = await db.queryOne(
      "SELECT COUNT(*) as total FROM users WHERE role = 'voter' AND verification_status = 'verified'"
    );
    const totalVerifiedVoters = verifiedVotersRow ? parseInt(verifiedVotersRow.total) : 0;

    // 2. Total votes cast in this election
    const totalVotesRow = await db.queryOne(
      'SELECT COUNT(*) as total FROM votes WHERE election_id = ?',
      [electionId]
    );
    const totalVotesCast = totalVotesRow ? parseInt(totalVotesRow.total) : 0;

    // 3. Candidate vote counts calculated dynamically via SQL COUNT
    const candidateResults = await db.query(
      `SELECT c.id, c.name, c.photo, c.organization, c.description,
              COUNT(v.id) as vote_count
       FROM candidates c
       LEFT JOIN votes v ON c.id = v.candidate_id AND v.election_id = ?
       WHERE c.election_id = ?
       GROUP BY c.id
       ORDER BY vote_count DESC`,
      [electionId, electionId]
    );

    // 4. Calculate percentages and winner status
    let highestVotes = -1;
    let winners = [];

    const formattedResults = candidateResults.map(c => {
      const votes = parseInt(c.vote_count || 0);
      const percentage = totalVotesCast > 0 ? ((votes / totalVotesCast) * 100).toFixed(1) : 0;

      if (votes > highestVotes && votes > 0) {
        highestVotes = votes;
        winners = [c.id];
      } else if (votes === highestVotes && votes > 0) {
        winners.push(c.id);
      }

      return {
        id: c.id,
        name: c.name,
        photo: c.photo,
        organization: c.organization,
        description: c.description,
        voteCount: votes,
        percentage: parseFloat(percentage),
        isWinner: false
      };
    });

    // Mark winner(s)
    formattedResults.forEach(c => {
      if (winners.includes(c.id)) {
        c.isWinner = true;
      }
    });

    // Participation percentage
    const participationRate = totalVerifiedVoters > 0
      ? ((totalVotesCast / totalVerifiedVoters) * 100).toFixed(1)
      : 0;

    return res.json({
      success: true,
      election,
      summary: {
        totalRegisteredVoters: totalVerifiedVoters,
        totalVotesCast,
        participationRate: parseFloat(participationRate),
        resultsPublished: !!election.results_published
      },
      candidates: formattedResults
    });
  } catch (err) {
    console.error('Get election results error:', err);
    return res.status(500).json({ success: false, message: 'Failed to calculate election results.' });
  }
}

module.exports = {
  getElectionResults
};
