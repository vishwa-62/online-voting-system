# Database Architecture Documentation — Online Voting System

## Database Engine
- **Primary Target Engine**: MySQL 8.0+
- **Zero-Setup Fallback**: Embedded SQLite Engine (integrated auto-fallback)

---

## Entity Relationship Model

```
       +-------------------+
       |       users       |
       +-------------------+
       | id (PK)           |
       | full_name         |
       | email (UNIQUE)    |<-------------------+
       | voter_id (UNIQUE) |                    |
       | password_hash     |                    |
       | role (admin/voter)|                    |
       | verification_status                    |
       +---------+---------+                    |
                 |                              |
                 | 1:N                          | 1:N
                 v                              |
       +-------------------+          +---------+---------+
       |     elections     |          |   activity_logs   |
       +-------------------+          +-------------------+
       | id (PK)           |          | id (PK)           |
       | title             |          | user_id (FK)      |
       | election_type     |          | action            |
       | start_date        |          | description       |
       | end_date          |          | ip_address        |
       | status            |          +-------------------+
       | results_published |
       +---------+---------+
                 |
                 | 1:N
                 v
       +-------------------+          +-------------------+
       |    candidates     |          |       votes       |
       +-------------------+          +-------------------+
       | id (PK)           |          | id (PK)           |
       | election_id (FK)  |<---------| election_id (FK)  |
       | name              |          | candidate_id (FK) |
       | organization      |          | voter_id (FK)     |
       | description       |          | confirmation_id   |
       +-------------------+          | UNIQUE(voter_id,  |
                                      |   election_id)    |
                                      +-------------------+
```

---

## Table Schemas

### 1. `users` Table
Stores registered voters and system administrators.
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `full_name`: VARCHAR(150) NOT NULL
- `email`: VARCHAR(150) NOT NULL UNIQUE
- `mobile`: VARCHAR(20) NOT NULL
- `password_hash`: VARCHAR(255) NOT NULL
- `role`: ENUM('admin', 'voter') DEFAULT 'voter'
- `voter_id`: VARCHAR(50) NOT NULL UNIQUE
- `date_of_birth`: DATE NOT NULL
- `verification_status`: ENUM('pending', 'verified', 'rejected') DEFAULT 'pending'
- `account_status`: ENUM('active', 'suspended') DEFAULT 'active'
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### 2. `elections` Table
Stores election contests.
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `title`: VARCHAR(255) NOT NULL
- `description`: TEXT
- `election_type`: VARCHAR(100) NOT NULL
- `start_date`: DATETIME NOT NULL
- `end_date`: DATETIME NOT NULL
- `status`: ENUM('upcoming', 'active', 'completed', 'cancelled') DEFAULT 'upcoming'
- `results_published`: BOOLEAN DEFAULT FALSE
- `created_by`: INT (FK -> users.id)

### 3. `candidates` Table
Stores contenders assigned to elections.
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `election_id`: INT NOT NULL (FK -> elections.id ON DELETE CASCADE)
- `name`: VARCHAR(150) NOT NULL
- `photo`: TEXT
- `organization`: VARCHAR(150) NOT NULL
- `description`: TEXT

### 4. `votes` Table
Stores encrypted vote choices and cryptographic confirmation IDs.
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `election_id`: INT NOT NULL (FK -> elections.id ON DELETE CASCADE)
- `candidate_id`: INT NOT NULL (FK -> candidates.id ON DELETE CASCADE)
- `voter_id`: INT NOT NULL (FK -> users.id ON DELETE CASCADE)
- `confirmation_id`: VARCHAR(100) NOT NULL UNIQUE
- `cast_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- **Constraint**: `UNIQUE KEY unique_voter_election (voter_id, election_id)`

### 5. `activity_logs` Table
Audit trail log.
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `user_id`: INT (FK -> users.id ON DELETE SET NULL)
- `action`: VARCHAR(100) NOT NULL
- `description`: TEXT
- `ip_address`: VARCHAR(45)
