import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { getUserDashboardApi } from '../services/assessmentService';
import '../styles/dashboard.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState({
    stats: {
      completedAssessments: 0,
      averageScore: 0,
      bestScore: 0,
      questionsAttempted: 0
    },
    recentAttempts: [],
    technologyPerformance: [],
    topicPerformance: []
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setErrorMsg('');

      try {
        const response = await getUserDashboardApi();
        if (response && response.success && response.data) {
          setDashboard(response.data);
        } else {
          setErrorMsg('Unable to load dashboard.');
        }
      } catch (error) {
        setErrorMsg(error.message || 'Unable to load dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = useMemo(() => dashboard?.stats || {
    completedAssessments: 0,
    averageScore: 0,
    bestScore: 0,
    questionsAttempted: 0
  }, [dashboard]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const formatPercent = (value) => `${Number(value || 0).toFixed(0)}%`;

  return (
    <Layout>
      <div className="container dashboard-container">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Interview preparation</p>
            <h1 className="dashboard-title">
              Welcome back, <span className="gradient-text">{user?.name || 'Developer'}</span> 👋
            </h1>
            <p className="dashboard-subtitle">Keep improving your interview skills.</p>
          </div>

          <div className="dashboard-actions">
            <button onClick={() => navigate('/assessments')} className="btn btn-primary">
              Take Assessment
            </button>
            <button onClick={() => navigate('/attempts')} className="btn btn-secondary">
              View Attempts
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="dashboard-alert">⚠️ {errorMsg}</div>
        )}

        {loading ? (
          <div className="dashboard-empty state">
            <div className="spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        ) : (
          <>
            <div className="dashboard-grid">
              <div className="dashboard-stat-card">
                <span className="stat-label">Completed Assessments</span>
                <div className="stat-value">{stats.completedAssessments}</div>
                <span className="stat-desc">Assessments finished</span>
              </div>

              <div className="dashboard-stat-card">
                <span className="stat-label">Average Score</span>
                <div className="stat-value">{formatPercent(stats.averageScore)}</div>
                <span className="stat-desc">Across completed attempts</span>
              </div>

              <div className="dashboard-stat-card">
                <span className="stat-label">Best Score</span>
                <div className="stat-value">{formatPercent(stats.bestScore)}</div>
                <span className="stat-desc">Highest percentage so far</span>
              </div>

              <div className="dashboard-stat-card">
                <span className="stat-label">Questions Attempted</span>
                <div className="stat-value">{stats.questionsAttempted}</div>
                <span className="stat-desc">Answered across all completed attempts</span>
              </div>
            </div>

            {dashboard.recentAttempts.length === 0 ? (
              <div className="empty-state-panel">
                <h2>Start your interview preparation</h2>
                <p>You haven't completed any assessments yet.</p>
                <div className="quick-action-row">
                  <Link to="/assessments" className="btn btn-primary">Browse Assessments</Link>
                  <Link to="/questions" className="btn btn-secondary">Explore Question Bank</Link>
                </div>
              </div>
            ) : (
              <div className="dashboard-sections">
                <section className="dashboard-panel">
                  <div className="panel-header">
                    <h2>Recent Attempts</h2>
                  </div>

                  <div className="attempt-list">
                    {dashboard.recentAttempts.map((attempt) => (
                      <div key={attempt.attemptId} className="attempt-item" onClick={() => navigate(`/assessments/${attempt.assessmentId}`)}>
                        <div>
                          <h3>{attempt.title}</h3>
                          <p>{attempt.technology} · {attempt.topic}</p>
                        </div>
                        <div className="attempt-score">
                          <strong>{attempt.percentage}%</strong>
                          <span>{attempt.score}/{attempt.maxScore}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="horizontal-layout">
                  <section className="dashboard-panel">
                    <div className="panel-header">
                      <h2>Performance by Technology</h2>
                    </div>

                    <div className="performance-list">
                      {dashboard.technologyPerformance.map((item) => (
                        <div key={item.technology} className="performance-row">
                          <div className="performance-meta">
                            <span>{item.technology}</span>
                            <strong>{Number(item.averagePercentage || 0)}%</strong>
                          </div>
                          <div className="progress-bar">
                            <span style={{ width: `${Math.min(item.averagePercentage || 0, 100)}%` }}></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="dashboard-panel">
                    <div className="panel-header">
                      <h2>Performance by Topic</h2>
                    </div>

                    <div className="performance-list">
                      {dashboard.topicPerformance.map((item) => (
                        <div key={item.topic} className="performance-row">
                          <div className="performance-meta">
                            <span>{item.topic}</span>
                            <strong>{Number(item.averagePercentage || 0)}%</strong>
                          </div>
                          <div className="progress-bar">
                            <span style={{ width: `${Math.min(item.averagePercentage || 0, 100)}%` }}></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            )}

            <section className="dashboard-panel quick-actions-pane">
              <div className="panel-header">
                <h2>Quick Actions</h2>
              </div>

              <div className="quick-action-row">
                <Link to="/assessments" className="btn btn-primary">Browse Assessments</Link>
                <Link to="/questions" className="btn btn-secondary">View Question Bank</Link>
                <Link to="/attempts" className="btn btn-secondary">View Attempt History</Link>
                <Link to="/profile" className="btn btn-secondary">Edit Profile</Link>
              </div>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
