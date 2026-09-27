import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Layout>
      <div className="container dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Welcome back, <span className="gradient-text">{user?.name || 'Developer'}</span>!
            </h1>
            <p className="dashboard-subtitle">
              Overview of your authenticated profile and InterviewAI account details.
            </p>
          </div>

          <button onClick={handleLogout} className="btn btn-secondary">
            Sign Out
          </button>
        </div>

        {/* User Profile Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            marginBottom: '2.5rem'
          }}
        >
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>👤 Profile Information</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem'
            }}
          >
            <div>
              <span className="stat-label">Full Name</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.2rem' }}>{user?.name}</p>
            </div>

            <div>
              <span className="stat-label">Email Address</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.2rem' }}>{user?.email}</p>
            </div>

            <div>
              <span className="stat-label">Target Role</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.2rem' }}>
                {user?.targetRole || 'Not specified'}
              </p>
            </div>

            <div>
              <span className="stat-label">Experience Level</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.2rem' }}>
                {user?.experienceLevel}
              </p>
            </div>

            <div>
              <span className="stat-label">Account Role</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.2rem', color: '#818cf8' }}>
                {user?.role}
              </p>
            </div>

            <div>
              <span className="stat-label">Member Since</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.2rem' }}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid Placeholder */}
        <div className="dashboard-grid">
          <div className="dashboard-stat-card">
            <span className="stat-label">Completed Sessions</span>
            <div className="stat-value">0</div>
            <span className="stat-desc">Assessments finished</span>
          </div>

          <div className="dashboard-stat-card">
            <span className="stat-label">Average Score</span>
            <div className="stat-value">--</div>
            <span className="stat-desc">Across all technical topics</span>
          </div>

          <div className="dashboard-stat-card">
            <span className="stat-label">Auth System</span>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#10b981' }}>
              JWT Active
            </div>
            <span className="stat-desc">Bearer Token Authenticated</span>
          </div>
        </div>

        <div className="placeholder-section">
          <h2 style={{ marginBottom: '0.5rem' }}>Assessment & AI Features</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto' }}>
            User authentication is active! Question bank, technical assessments, and AI tools will be enabled in subsequent prompts.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
