-- ============================================================
-- ONLINE VOTING SYSTEM - DEMO SEED DATA (MySQL)
-- ============================================================

USE online_voting_system;

-- Passwords:
-- Admin: Admin@123 (bcrypt hash: $2a$10$Zk.h0nN... standard bcrypt)
-- Voters: Voter@123

INSERT INTO users (id, full_name, email, mobile, password_hash, role, voter_id, date_of_birth, verification_status, account_status)
VALUES
(1, 'System Administrator', 'admin@votingdemo.com', '+15550192834', '$2a$10$b8uHkRj6Q.yYnS5eK5w.vO/6P8eXnF1jC0H9K8L7M6N5O4P3Q2R1S', 'admin', 'ADM-2026-0001', '1985-05-15', 'verified', 'active'),
(2, 'Alex Johnson', 'voter@votingdemo.com', '+15550192835', '$2a$10$b8uHkRj6Q.yYnS5eK5w.vO/6P8eXnF1jC0H9K8L7M6N5O4P3Q2R1S', 'voter', 'VTR-2026-8819', '1998-03-22', 'verified', 'active'),
(3, 'Sarah Williams', 'sarah@example.com', '+15550192836', '$2a$10$b8uHkRj6Q.yYnS5eK5w.vO/6P8eXnF1jC0H9K8L7M6N5O4P3Q2R1S', 'voter', 'VTR-2026-4421', '2001-11-09', 'verified', 'active'),
(4, 'David Chen', 'david@example.com', '+15550192837', '$2a$10$b8uHkRj6Q.yYnS5eK5w.vO/6P8eXnF1jC0H9K8L7M6N5O4P3Q2R1S', 'voter', 'VTR-2026-9902', '1999-07-14', 'pending', 'active'),
(5, 'Emily Rodriguez', 'emily@example.com', '+15550192838', '$2a$10$b8uHkRj6Q.yYnS5eK5w.vO/6P8eXnF1jC0H9K8L7M6N5O4P3Q2R1S', 'voter', 'VTR-2026-3310', '2002-01-30', 'verified', 'active')
ON DUPLICATE KEY UPDATE id=id;

-- ELECTIONS
INSERT INTO elections (id, title, description, election_type, start_date, end_date, status, results_published, created_by)
VALUES
(1, 'Student Council Presidential Election 2026', 'Official campus election to select the Student Body President and Vice President for the 2026-2027 academic year.', 'Student Council Election', '2026-09-01 08:00:00', '2026-10-15 20:00:00', 'active', FALSE, 1),
(2, 'University Chancellor Advisory Board Election', 'Faculty and student representation election for the University Board of Regents advisory panel.', 'College Election', '2026-10-01 09:00:00', '2026-11-01 18:00:00', 'upcoming', FALSE, 1),
(3, 'Computer Science Society Leadership 2026', 'Annual election for CS Society President, Treasurer, and Tech Lead.', 'Club Election', '2026-08-01 08:00:00', '2026-09-01 20:00:00', 'completed', TRUE, 1)
ON DUPLICATE KEY UPDATE id=id;

-- CANDIDATES
INSERT INTO candidates (id, election_id, name, photo, organization, description)
VALUES
(1, 1, 'Elena Rostova', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', 'Progressive Student Alliance', 'Pledging 24/7 library access, mental health support initiatives, and campus sustainability reform.'),
(2, 1, 'Marcus Vance', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80', 'Unity & Action Party', 'Focused on career development programs, tech lab funding, and transparent student council budgets.'),
(3, 1, 'Priya Sharma', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', 'Innovate Campus Coalition', 'Advocating for modern digital campus services, affordable dining options, and athletic facilities improvement.'),
(4, 3, 'Dr. Aris Thorne', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', 'Department of CS', 'Empowering student hackathons, open source initiatives, and industry mentorship links.'),
(5, 3, 'Samantha Vance', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80', 'Cybersecurity Guild', 'Dedicated to security workshops, competitive coding leagues, and community outreach.')
ON DUPLICATE KEY UPDATE id=id;

-- SAMPLE VOTES FOR COMPLETED ELECTION
INSERT INTO votes (id, election_id, candidate_id, voter_id, confirmation_id, cast_at)
VALUES
(1, 3, 4, 2, 'VOTE-2026-8F92A1B3', '2026-08-15 10:30:00'),
(2, 3, 4, 3, 'VOTE-2026-1C44D99A', '2026-08-15 11:15:00'),
(3, 3, 5, 5, 'VOTE-2026-7B31E002', '2026-08-16 14:22:00')
ON DUPLICATE KEY UPDATE id=id;

-- ACTIVITY LOGS
INSERT INTO activity_logs (user_id, action, description, ip_address)
VALUES
(1, 'ELECTION_CREATE', 'Created election: Student Council Presidential Election 2026', '127.0.0.1'),
(1, 'CANDIDATE_ADD', 'Added candidate Elena Rostova to Student Council Presidential Election 2026', '127.0.0.1'),
(2, 'VOTE_CAST', 'Cast vote in Computer Science Society Leadership 2026', '127.0.0.1');
