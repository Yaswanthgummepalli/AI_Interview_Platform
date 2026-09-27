import React from 'react';
import Layout from '../components/Layout';
import '../styles/dashboard.css';

const DashboardPage = () => {
  return (
    <Layout>
      <div className="container dashboard-container">
        <div className="dashboard-header">
          <div>
            <span className="placeholder-badge">Prompt 1 - UI Placeholder</span>
            <h1 className="dashboard-title">Candidate Dashboard</h1>
            <p className="dashboard-subtitle">
              Overview of your technical interview readiness and practice history.
            </p>
          </div>
        </div>

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
            <span className="stat-label">Backend Status</span>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#10b981' }}>Connected</div>
            <span className="stat-desc">Node.js + MongoDB backend</span>
          </div>
        </div>

        <div className="placeholder-section">
          <h2 style={{ marginBottom: '0.5rem' }}>Full Dashboard Features Coming Soon</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            In subsequent phases, you will be able to launch technical assessments, view detailed AI feedback, and track your metrics here.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
