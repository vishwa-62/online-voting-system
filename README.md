# Online Voting System — Secure Digital Election Management Platform

[![Node.js](https://img.shields.io/badge/Node.js-v24.18-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18.2-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v5.2-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-sky.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)]()

A complete, modern, production-grade **Online Voting System** built as a full-stack web application. Designed for digital elections across universities, student councils, civic organizations, and corporate bodies.

---

## 🌟 Key Features

### 🔐 Security & Voting Integrity
- **JWT & bcrypt Hashing**: Industry-standard password hashing (`bcryptjs`) and secure stateless token authorization.
- **One-Vote-Per-Election Restriction**: Enforced via database-level `UNIQUE(voter_id, election_id)` constraints combined with transaction validation.
- **Voter Identity Verification**: Admin-controlled verification workflow ensuring only verified voters cast ballots.
- **Cryptographic Confirmation Receipt**: Generates a unique, audit-ready confirmation ID (`VOTE-2026-8F92A1B3`) for every recorded vote.
- **Server-Side Tally Aggregation**: Vote counts and percentages are calculated dynamically via SQL `COUNT` queries; no raw manual totals or client-side tampering.

### 👥 Dual Role Portals

#### 🗳️ Voter Portal
- **Self-Registration & Profile**: Secure onboarding with Voter ID, email, mobile, and date of birth validation.
- **Election Registry**: Filterable dashboard displaying active, upcoming, and completed elections.
- **Electronic Voting Booth**: Candidate profiles, manifestos, candidate selection radio cards, and double-confirmation modal dialogs.
- **Vote Confirmation**: Printable/downloadable official digital receipt.
- **Personal Voting Audit History**: Transparent tracking of past ballot submissions.

#### 🛡️ Admin Control Console
- **Telemetry Dashboard**: High-level platform statistics (Total Voters, Verified Voters, Active Elections, Candidates, Votes Cast).
- **Interactive Visual Charts**: Recharts visualizations for votes per election contest and turnout rates.
- **Voter Management**: Table with live search, verification approval/rejection, account suspension/activation, and record deletion.
- **Election Control**: Create, edit, activate, close, and publish/hide election results.
- **Candidate Registry**: Assign candidates to elections with photo previews and duplicate protection.
- **Audit Activity Logs**: Real-time system activity tracking with IP address recording.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 18 + Vite 5
- **Styling**: Tailwind CSS + Custom Design Tokens (Stripe / Linear / Vercel Civic-Tech Aesthetic)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **HTTP Client**: Axios with JWT Bearer Interceptors
- **Routing**: React Router DOM v6

### Backend
- **Runtime**: Node.js v24 + Express.js
- **Auth**: JSON Web Tokens (JWT) + `bcryptjs`
- **Validation**: Server-side request validation
- **Logging**: Internal Activity Logger

### Database
- **Primary Engine**: MySQL 8.0+ (`schema.sql` and `seed.sql`)
- **Zero-Setup Adapter**: Integrated SQLite auto-fallback engine (`online_voting.sqlite`) ensuring instant zero-configuration execution.

---

## 🚀 Quick Start Guide

### 1. Start Backend Server
```bash
cd backend
npm install
npm start
```
*Backend runs at `http://localhost:5000`*

### 2. Start Frontend Server
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`*

---

## ⚡ Demo Credentials

| Role | Email / Identifier | Password | Access Rights |
|---|---|---|---|
| **Super Admin** | `admin@votingdemo.com` | `Admin@123` | Full Administrative Console Access |
| **Verified Voter** | `voter@votingdemo.com` | `Voter@123` | Ballot Casting & Dashboard Access |

---

## 📁 Project Structure

```
online-voting-system/
├── frontend/
│   ├── src/
│   │   ├── components/      # ProtectedRoute, UI components
│   │   ├── context/         # AuthContext provider
│   │   ├── layouts/         # Navbar, Footer, AdminLayout
│   │   ├── pages/           # Home, Register, Login, Dashboard, Voting, Results
│   │   │   └── admin/       # Admin Dashboard, Voters, Elections, Candidates, Logs
│   │   ├── services/        # Axios API client
│   │   ├── App.jsx          # Route definitions
│   │   └── main.jsx         # React DOM entrypoint
│   └── package.json
│
├── backend/
│   ├── config/              # Dual MySQL / SQLite DB adapter
│   ├── controllers/         # Auth, Elections, Candidates, Votes, Results, Admin
│   ├── middleware/          # JWT & Role authorization middlewares
│   ├── routes/              # Express API routers
│   ├── utils/               # Activity logger
│   └── server.js            # Express server entrypoint
│
├── database/
│   ├── schema.sql           # MySQL DDL schema
│   └── seed.sql             # MySQL DML seed data
│
├── docs/
│   ├── API.md               # Complete REST API reference
│   ├── DATABASE.md          # ERD diagram & schema documentation
│   └── SETUP.md             # Detailed setup instructions
│
├── .env.example
└── README.md
```

---

## 🔒 Security & Compliance Disclaimer
This application is designed as an educational/demo election management platform with duplicate vote prevention and cryptographic confirmation IDs. It does not claim legal certification for public government elections.

---

## 📄 License
MIT License. Free for educational and commercial application reuse.
