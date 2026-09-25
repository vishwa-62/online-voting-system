# Online Voting System — REST API Documentation

This document outlines all backend RESTful API endpoints for the Online Voting System platform.

## Base URL
`http://localhost:5000/api`

## Authentication Header
Protected endpoints require a JSON Web Token (JWT) provided in the HTTP header:
`Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication Endpoints

### `POST /auth/register`
Registers a new voter account.
- **Request Body**:
  ```json
  {
    "full_name": "Alex Johnson",
    "email": "alex@example.com",
    "mobile": "+15550192835",
    "voter_id": "VTR-2026-8819",
    "date_of_birth": "1998-03-22",
    "password": "Password@123"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "success": true,
    "token": "jwt_token_string",
    "user": { ... }
  }
  ```

### `POST /auth/login`
Authenticates a voter or administrator.
- **Request Body**:
  ```json
  {
    "identifier": "admin@votingdemo.com",
    "password": "Admin@123"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "token": "jwt_token_string",
    "user": { "role": "admin", ... }
  }
  ```

### `GET /auth/profile`
Retrieves current authenticated user details and personal voting history.
- **Headers**: `Authorization: Bearer <token>`

---

## 2. Election Endpoints

### `GET /elections`
Retrieves list of elections with candidate counts and user-specific voting status.
- **Query Parameters**: `status` (active, upcoming, completed), `type`.

### `GET /elections/:id`
Retrieves detailed metadata for a single election including candidates and voting status.

### `POST /elections` (Admin Only)
Creates a new election contest.
- **Request Body**:
  ```json
  {
    "title": "Student Council Presidential Election 2026",
    "description": "Official campus election...",
    "election_type": "Student Council Election",
    "start_date": "2026-09-01T08:00:00.000Z",
    "end_date": "2026-10-15T20:00:00.000Z",
    "status": "active"
  }
  ```

### `PUT /elections/:id` (Admin Only)
Updates existing election fields.

### `DELETE /elections/:id` (Admin Only)
Deletes election record.

---

## 3. Candidate Endpoints

### `GET /elections/:id/candidates`
Fetches candidates assigned to specified election.

### `POST /candidates` (Admin Only)
Adds a candidate to an election. Prevents duplicate candidates in the same election.

### `PUT /candidates/:id` (Admin Only)
Updates candidate details.

### `DELETE /candidates/:id` (Admin Only)
Removes candidate.

---

## 4. Voting Endpoints

### `POST /votes` (Verified Voters Only)
Casts a ballot for a candidate in an active election.
- **Rules Enforced**:
  - Voter identity derived from authenticated JWT.
  - Voter must be verified.
  - Election must be active and within timeframe.
  - Single-vote-per-election strictly enforced via DB unique constraint.
- **Request Body**:
  ```json
  {
    "election_id": 1,
    "candidate_id": 2
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "success": true,
    "message": "Your vote has been successfully recorded.",
    "vote": {
      "election_id": 1,
      "confirmation_id": "VOTE-2026-8F92A1B3",
      "cast_at": "2026-09-24T18:00:00.000Z"
    }
  }
  ```

### `GET /votes/status/:electionId`
Returns voting status for specified election.

### `GET /votes/history`
Returns voter's complete voting history records.

---

## 5. Results & Admin Endpoints

### `GET /results/:electionId`
Computes real-time SQL aggregated vote counts and turnout rates.

### `GET /admin/dashboard` (Admin Only)
Retrieves platform telemetry stats and chart metrics.

### `GET /admin/voters` (Admin Only)
Lists registered voters with search and status filtering.

### `PUT /admin/voters/:id/verify` (Admin Only)
Updates voter verification status (`verified`, `rejected`, `pending`).

### `PUT /admin/voters/:id/status` (Admin Only)
Updates account status (`active`, `suspended`).

### `GET /admin/logs` (Admin Only)
Retrieves audit activity logs.
