import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getAdminDashboardApi } from '../services/assessmentService';
import '../styles/dashboard.css';

const AdminDashboardPage = () => {
  const [dashboard, setDashboard] = useState({
    stats: {
      totalUsers: 0,
      totalQuestions: 0,
      totalAssessments: 0,
      publishedAssessments: 0,
      completedAttempts: 0,
      averagePlatformScore: 0
    },
    recentAttempts: [],
    popularAssessments: []
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setErrorMsg('');

      try {
        const response = await getAdminDashboardApi();
        if (response && response.success && response.data) {
          setDashboard(response.data);
        } else {
          setErrorMsg('Unable to load admin dashboard.');
        }
      } catch (error) {
        setErrorMsg(error.message || 'Unable to load admin dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatPercentage = (value) => `${Number(value || 0).toFixed(0)}%`;

  const formatDate = (date) => {
    if (!date) return 'Recently';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="container dashboard-container">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Platform overview</p>
            <h1 className="dashboard-title">Admin Dashboard</h1>
          </div>
        </div>

        {errorMsg && (
          <div className="dashboard-alert">⚠️ {errorMsg}</div>
        )}

        {loading ? (
          <div className="dashboard-empty state">
            <div className="spinner"></div>
            <p>Loading admin dashboard...</p>
          </div>
        ) : (
          <>
            <div className="dashboard-grid">
              <div className="dashboard-stat-card">
                <span className="stat-label">Total Users</span>
                <div className="stat-value">{dashboard.stats.totalUsers}</div>
                <span className="stat-desc">Registered accounts</span>
              </div>

              <div className="dashboard-stat-card">
                <span className="stat-label">Total Questions</span>
                <div className="stat-value">{dashboard.stats.totalQuestions}</div>
                <span className="stat-desc">Question bank size</span>
              </div>

              <div className="dashboard-stat-card">
                <span className="stat-label">Total Assessments</span>
                <div className="stat-value">{dashboard.stats.totalAssessments}</div>
                <span className="stat-desc">Available assessment types</span>
              </div>

              <div className="dashboard-stat-card">
                <span className="stat-label">Published Assessments</span>
                <div className="stat-value">{dashboard.stats.publishedAssessments}</div>
                <span className="stat-desc">Live and visible to users</span>
              </div>

              <div className="dashboard-stat-card">
                <span className="stat-label">Completed Attempts</span>
                <div className="stat-value">{dashboard.stats.completedAttempts}</div>
                <span className="stat-desc">Finished assessments</span>
              </div>

              <div className="dashboard-stat-card">
                <span className="stat-label">Average Platform Score</span>
                <div className="stat-value">{formatPercentage(dashboard.stats.averagePlatformScore)}</div>
                <span className="stat-desc">Across all completed attempts</span>
              </div>
            </div>

            <div className="horizontal-layout">
              <section className="dashboard-panel">
                <div className="panel-header">
                  <h2>Recent Activity</h2>
                </div>

                <div className="attempt-list">
                  {dashboard.recentAttempts.length === 0 ? (
                    <div className="empty-state-panel" style={{ margin: 0, padding: '1.5rem' }}>
                      <p>No completed attempts yet.</p>
                    </div>
                  ) : (
                    dashboard.recentAttempts.map((attempt) => (
                      <div key={attempt.attemptId} className="attempt-item" style={{ cursor: 'default' }}>
                        <div>
                          <h3>{attempt.user?.name || 'Unknown User'}</h3>
                          <p>{attempt.assessment?.title || 'Unknown Assessment'}</p>
                        </div>
                        <div className="attempt-score">
                          <strong>{attempt.score}/{attempt.maxScore}</strong>
                          <span>{attempt.percentage}%</span>
                          <small>{formatDate(attempt.completedAt)}</small>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="dashboard-panel">
                <div className="panel-header">
                  <h2>Popular Assessments</h2>
                </div>

                <div className="attempt-list">
                  {dashboard.popularAssessments.length === 0 ? (
                    <div className="empty-state-panel" style={{ margin: 0, padding: '1.5rem' }}>
                      <p>No assessment activity yet.</p>
                    </div>
                  ) : (
                    dashboard.popularAssessments.map((assessment) => (
                      <div key={assessment.assessmentId} className="attempt-item" style={{ cursor: 'default' }}>
                        <div>
                          <h3>{assessment.title}</h3>
                        </div>
                        <div className="attempt-score">
                          <strong>{assessment.attempts}</strong>
                          <span>attempts</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            <section className="dashboard-panel quick-actions-pane">
              <div className="panel-header">
                <h2>Quick Actions</h2>
              </div>

              <div className="quick-action-row">
                <Link to="/admin/questions" className="btn btn-primary">Manage Questions</Link>
                <Link to="/admin/assessments" className="btn btn-secondary">Manage Assessments</Link>
                <Link to="/admin/attempts" className="btn btn-secondary">View Attempts</Link>
              </div>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;
