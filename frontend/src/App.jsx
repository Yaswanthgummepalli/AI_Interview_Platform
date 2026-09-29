import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import UserQuestionBankPage from './pages/UserQuestionBankPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import AdminQuestionManagementPage from './pages/AdminQuestionManagementPage';
import AdminAssessmentManagementPage from './pages/AdminAssessmentManagementPage';
import UserAssessmentListPage from './pages/UserAssessmentListPage';
import AssessmentDetailPage from './pages/AssessmentDetailPage';
import TakeAssessmentPage from './pages/TakeAssessmentPage';
import AssessmentResultPage from './pages/AssessmentResultPage';
import AttemptHistoryPage from './pages/AttemptHistoryPage';
import AdminAttemptsPage from './pages/AdminAttemptsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Authenticated Candidate Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/questions"
            element={
              <ProtectedRoute>
                <UserQuestionBankPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/questions/:id"
            element={
              <ProtectedRoute>
                <QuestionDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessments"
            element={
              <ProtectedRoute>
                <UserAssessmentListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessments/:id"
            element={
              <ProtectedRoute>
                <AssessmentDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessments/:id/take"
            element={
              <ProtectedRoute>
                <TakeAssessmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessments/:id/result/:attemptId"
            element={
              <ProtectedRoute>
                <AssessmentResultPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attempts"
            element={
              <ProtectedRoute>
                <AttemptHistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Admin-only Routes */}
          <Route
            path="/admin/questions"
            element={
              <AdminRoute>
                <AdminQuestionManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/assessments"
            element={
              <AdminRoute>
                <AdminAssessmentManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/attempts"
            element={
              <AdminRoute>
                <AdminAttemptsPage />
              </AdminRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
