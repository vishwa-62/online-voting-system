const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

let dbDriver = null; // 'mysql' or 'sqlite'
let pool = null;
let sqliteDb = null;

async function initDB() {
  const enginePreference = process.env.DB_ENGINE || 'auto';
  
  if (enginePreference !== 'sqlite') {
    try {
      console.log('Attempting to connect to MySQL database...');
      pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'online_voting_system',
        port: parseInt(process.env.DB_PORT || '3306'),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      // Test connection
      const connection = await pool.getConnection();
      console.log('Connected to MySQL successfully!');
      connection.release();
      dbDriver = 'mysql';
      return;
    } catch (err) {
      console.warn('MySQL connection failed:', err.message);
      if (enginePreference === 'mysql') {
        throw new Error('MySQL connection forced but failed: ' + err.message);
      }
      console.log('Falling back to embedded SQLite database engine for zero-setup execution...');
    }
  }

  // Setup SQLite Fallback
  dbDriver = 'sqlite';
  const dbPath = path.join(__dirname, '..', '..', 'database', 'online_voting.sqlite');
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  sqliteDb = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable foreign keys
  await sqliteDb.run('PRAGMA foreign_keys = ON;');

  // Initialize SQLite schema
  await createSqliteTables(sqliteDb);
  await seedSqliteData(sqliteDb);
  console.log('SQLite database initialized successfully at:', dbPath);
}

async function createSqliteTables(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      mobile TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'voter',
      voter_id TEXT NOT NULL UNIQUE,
      date_of_birth TEXT NOT NULL,
      verification_status TEXT DEFAULT 'pending',
      account_status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS elections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      election_type TEXT DEFAULT 'General Election',
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      status TEXT DEFAULT 'upcoming',
      results_published INTEGER DEFAULT 0,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS candidates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      election_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      photo TEXT,
      organization TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      election_id INTEGER NOT NULL,
      candidate_id INTEGER NOT NULL,
      voter_id INTEGER NOT NULL,
      confirmation_id TEXT NOT NULL UNIQUE,
      cast_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE,
      FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
      FOREIGN KEY (voter_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE (voter_id, election_id)
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      description TEXT,
      ip_address TEXT DEFAULT '127.0.0.1',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);
}

async function seedSqliteData(db) {
  const adminCheck = await db.get(`SELECT id FROM users WHERE email = ?`, ['admin@votingdemo.com']);
  if (!adminCheck) {
    console.log('Seeding demo database tables...');
    const adminHash = await bcrypt.hash('Admin@123', 10);
    const voterHash = await bcrypt.hash('Voter@123', 10);

    // Insert Users
    await db.run(
      `INSERT INTO users (id, full_name, email, mobile, password_hash, role, voter_id, date_of_birth, verification_status, account_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [1, 'System Administrator', 'admin@votingdemo.com', '+15550192834', adminHash, 'admin', 'ADM-2026-0001', '1985-05-15', 'verified', 'active']
    );

    await db.run(
      `INSERT INTO users (id, full_name, email, mobile, password_hash, role, voter_id, date_of_birth, verification_status, account_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [2, 'Alex Johnson', 'voter@votingdemo.com', '+15550192835', voterHash, 'voter', 'VTR-2026-8819', '1998-03-22', 'verified', 'active']
    );

    await db.run(
      `INSERT INTO users (id, full_name, email, mobile, password_hash, role, voter_id, date_of_birth, verification_status, account_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [3, 'Sarah Williams', 'sarah@example.com', '+15550192836', voterHash, 'voter', 'VTR-2026-4421', '2001-11-09', 'verified', 'active']
    );

    await db.run(
      `INSERT INTO users (id, full_name, email, mobile, password_hash, role, voter_id, date_of_birth, verification_status, account_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [4, 'David Chen', 'david@example.com', '+15550192837', voterHash, 'voter', 'VTR-2026-9902', '1999-07-14', 'pending', 'active']
    );

    await db.run(
      `INSERT INTO users (id, full_name, email, mobile, password_hash, role, voter_id, date_of_birth, verification_status, account_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [5, 'Emily Rodriguez', 'emily@example.com', '+15550192838', voterHash, 'voter', 'VTR-2026-3310', '2002-01-30', 'verified', 'active']
    );

    // Insert Elections
    await db.run(
      `INSERT INTO elections (id, title, description, election_type, start_date, end_date, status, results_published, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [1, 'Student Council Presidential Election 2026', 'Official campus election to select the Student Body President and Vice President for the 2026-2027 academic year.', 'Student Council Election', '2026-09-01 08:00:00', '2026-10-15 20:00:00', 'active', 0, 1]
    );

    await db.run(
      `INSERT INTO elections (id, title, description, election_type, start_date, end_date, status, results_published, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [2, 'University Chancellor Advisory Board Election', 'Faculty and student representation election for the University Board of Regents advisory panel.', 'College Election', '2026-10-01 09:00:00', '2026-11-01 18:00:00', 'upcoming', 0, 1]
    );

    await db.run(
      `INSERT INTO elections (id, title, description, election_type, start_date, end_date, status, results_published, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [3, 'Computer Science Society Leadership 2026', 'Annual election for CS Society President, Treasurer, and Tech Lead.', 'Club Election', '2026-08-01 08:00:00', '2026-09-01 20:00:00', 'completed', 1, 1]
    );

    // Insert Candidates
    await db.run(
      `INSERT INTO candidates (id, election_id, name, photo, organization, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [1, 1, 'Elena Rostova', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', 'Progressive Student Alliance', 'Pledging 24/7 library access, mental health support initiatives, and campus sustainability reform.']
    );

    await db.run(
      `INSERT INTO candidates (id, election_id, name, photo, organization, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [2, 1, 'Marcus Vance', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80', 'Unity & Action Party', 'Focused on career development programs, tech lab funding, and transparent student council budgets.']
    );

    await db.run(
      `INSERT INTO candidates (id, election_id, name, photo, organization, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [3, 1, 'Priya Sharma', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', 'Innovate Campus Coalition', 'Advocating for modern digital campus services, affordable dining options, and athletic facilities improvement.']
    );

    await db.run(
      `INSERT INTO candidates (id, election_id, name, photo, organization, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [4, 3, 'Dr. Aris Thorne', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', 'Department of CS', 'Empowering student hackathons, open source initiatives, and industry mentorship links.']
    );

    await db.run(
      `INSERT INTO candidates (id, election_id, name, photo, organization, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [5, 3, 'Samantha Vance', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80', 'Cybersecurity Guild', 'Dedicated to security workshops, competitive coding leagues, and community outreach.']
    );

    // Insert Votes
    await db.run(
      `INSERT INTO votes (id, election_id, candidate_id, voter_id, confirmation_id, cast_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [1, 3, 4, 2, 'VOTE-2026-8F92A1B3', '2026-08-15 10:30:00']
    );

    await db.run(
      `INSERT INTO votes (id, election_id, candidate_id, voter_id, confirmation_id, cast_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [2, 3, 4, 3, 'VOTE-2026-1C44D99A', '2026-08-15 11:15:00']
    );

    await db.run(
      `INSERT INTO votes (id, election_id, candidate_id, voter_id, confirmation_id, cast_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [3, 3, 5, 5, 'VOTE-2026-7B31E002', '2026-08-16 14:22:00']
    );

    // Activity Logs
    await db.run(
      `INSERT INTO activity_logs (user_id, action, description, ip_address)
       VALUES (?, ?, ?, ?)`,
      [1, 'ELECTION_CREATE', 'Created election: Student Council Presidential Election 2026', '127.0.0.1']
    );
  }
}

// Unified Query interface
async function query(sql, params = []) {
  if (dbDriver === 'mysql') {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } else {
    // Convert MySQL style queries if needed, or run sqlite
    const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
    if (isSelect) {
      return await sqliteDb.all(sql, params);
    } else {
      const result = await sqliteDb.run(sql, params);
      return {
        insertId: result.lastID,
        affectedRows: result.changes
      };
    }
  }
}

async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

async function getDriver() {
  return dbDriver;
}

module.exports = {
  initDB,
  query,
  queryOne,
  getDriver
};
