import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ResultsPage from './pages/ResultsPage';

// Voter pages
import VoterDashboard from './pages/VoterDashboard';
import ElectionDetail from './pages/ElectionDetail';
import VotingPage from './pages/VotingPage';
import VoteConfirmation from './pages/VoteConfirmation';
import VoterProfile from './pages/VoterProfile';

// Admin layout & pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVoters from './pages/admin/AdminVoters';
import AdminElections from './pages/admin/AdminElections';
import AdminCandidates from './pages/admin/AdminCandidates';
import AdminResults from './pages/admin/AdminResults';
import AdminLogs from './pages/admin/AdminLogs';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/results/:electionId" element={<ResultsPage />} />

        {/* Voter Routes (Protected: role = voter or admin) */}
        <Route
          path="/voter/dashboard"
          element={
            <ProtectedRoute>
              <VoterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/voter/elections/:id"
          element={
            <ProtectedRoute>
              <ElectionDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/voter/voting/:electionId"
          element={
            <ProtectedRoute>
              <VotingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/voter/confirmation/:confirmationId"
          element={
            <ProtectedRoute>
              <VoteConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/voter/profile"
          element={
            <ProtectedRoute>
              <VoterProfile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes (Protected: role = admin) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="voters" element={<AdminVoters />} />
          <Route path="elections" element={<AdminElections />} />
          <Route path="candidates" element={<AdminCandidates />} />
          <Route path="results" element={<AdminResults />} />
          <Route path="logs" element={<AdminLogs />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
