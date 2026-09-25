const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { logActivity } = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_online_voting_jwt_key_2026_secure';

// Register Voter
async function register(req, res) {
  try {
    const { full_name, email, mobile, voter_id, date_of_birth, password } = req.body;

    if (!full_name || !email || !mobile || !voter_id || !date_of_birth || !password) {
      return res.status(400).json({ success: false, message: 'All registration fields are required.' });
    }

    // Check duplicate email
    const existingEmail = await db.queryOne('SELECT id FROM users WHERE email = ?', [email]);
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    // Check duplicate voter_id
    const existingVoterId = await db.queryOne('SELECT id FROM users WHERE voter_id = ?', [voter_id]);
    if (existingVoterId) {
      return res.status(400).json({ success: false, message: 'An account with this Voter ID already exists.' });
    }

    // Password strength check
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    // For seamless demo usability, newly registered voters default to verified so they can immediately test voting
    const verificationStatus = 'verified';

    const result = await db.query(
      `INSERT INTO users (full_name, email, mobile, password_hash, role, voter_id, date_of_birth, verification_status, account_status)
       VALUES (?, ?, ?, ?, 'voter', ?, ?, ?, 'active')`,
      [full_name, email, mobile, passwordHash, voter_id, date_of_birth, verificationStatus]
    );

    const userId = result.insertId;

    await logActivity(userId, 'USER_REGISTER', `New voter registered: ${full_name} (${email})`, req);

    const token = jwt.sign({ id: userId, role: 'voter' }, JWT_SECRET, { expiresIn: '7d' });

    const user = {
      id: userId,
      full_name,
      email,
      mobile,
      role: 'voter',
      voter_id,
      date_of_birth,
      verification_status: verificationStatus,
      account_status: 'active'
    };

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Your voter profile has been created.',
      token,
      user
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration. Please try again.' });
  }
}

// Login (Voter or Admin)
async function login(req, res) {
  try {
    const { identifier, password } = req.body; // identifier can be email or voter_id

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide Email/Voter ID and password.' });
    }

    const user = await db.queryOne(
      'SELECT * FROM users WHERE email = ? OR voter_id = ?',
      [identifier, identifier]
    );

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid login credentials.' });
    }

    if (user.account_status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact admin.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid login credentials.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    await logActivity(user.id, 'USER_LOGIN', `User logged in: ${user.full_name}`, req);

    const userPayload = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      voter_id: user.voter_id,
      date_of_birth: user.date_of_birth,
      verification_status: user.verification_status,
      account_status: user.account_status
    };

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: userPayload
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login. Please try again.' });
  }
}

// Get Profile
async function getProfile(req, res) {
  try {
    const user = await db.queryOne(
      'SELECT id, full_name, email, mobile, role, voter_id, date_of_birth, verification_status, account_status, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    // Fetch user votes history if voter
    let votesHistory = [];
    if (user.role === 'voter') {
      votesHistory = await db.query(
        `SELECT v.id, v.confirmation_id, v.cast_at, e.title as election_title, e.election_type, e.id as election_id
         FROM votes v
         JOIN elections e ON v.election_id = e.id
         WHERE v.voter_id = ?
         ORDER BY v.cast_at DESC`,
        [req.user.id]
      );
    }

    return res.json({
      success: true,
      user,
      votesHistory
    });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
}

module.exports = {
  register,
  login,
  getProfile
};
