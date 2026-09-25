# Online Voting System — Quick Start & Setup Guide

This guide walks you through setting up and running the full-stack Online Voting System locally.

---

## Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **MySQL Database Server** (Optional: If MySQL is not installed, the application automatically uses an embedded SQLite engine so it runs out-of-the-box with zero configuration!).

---

## 1. Backend Setup

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure `.env` file (pre-configured in workspace):
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=super_secret_online_voting_jwt_key_2026_secure
   
   # MySQL Configuration (Optional)
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=online_voting_system
   DB_PORT=3306
   DB_ENGINE=auto
   ```

4. Start backend server:
   ```bash
   npm start
   ```

---

## 2. Frontend Setup

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   `http://localhost:5173`

---

## 3. Demo Credentials

### Administrator Account
- **Email**: `admin@votingdemo.com`
- **Password**: `Admin@123`
- **Role**: Super Admin

### Verified Voter Account
- **Email**: `voter@votingdemo.com`
- **Password**: `Voter@123`
- **Role**: Verified Voter
