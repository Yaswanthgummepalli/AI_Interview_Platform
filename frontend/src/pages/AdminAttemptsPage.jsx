import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getAdminAttemptsApi } from '../services/assessmentService';
import '../styles/dashboard.css';

const AdminAttemptsPage = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchAttempts = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await getAdminAttemptsApi();
        if (res && res.success && res.data?.attempts) {
          setAttempts(res.data.attempts);
        } else {
          setErrorMsg('Failed to load attempts.');
        }
      } catch (err) {
        setErrorMsg(err.message || 'Failed to load attempts.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 70) return '#22c55e';
    if (percentage >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getStatusBadge = (status) => {
    return {
      COMPLETED: { bg: 'rgba(34, 197, 94, 0.2)', text: '#86efac' },
      IN_PROGRESS: { bg: 'rgba(139, 92, 246, 0.2)', text: '#d8b4fe' }
    }[status] || { bg: 'rgba(107, 114, 128, 0.2)', text: '#d1d5db' };
  };

  return (
    <Layout>
      <div className="container dashboard-container" style={{ maxWidth: '1200px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Assessment Attempts - Admin</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Monitor all user assessment attempts and results
          </p>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem'
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 0',
            gap: '1rem'
          }}>
            <div className="spinner" style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '4px solid rgba(139, 92, 246, 0.2)',
              borderTop: '4px solid var(--primary)',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading attempts...</p>
          </div>
        ) : attempts.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '3rem',
            textAlign: 'center'
          }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              No assessment attempts yet.
            </p>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: 'var(--input-bg)',
                    borderBottom: '1px solid var(--border)'
                  }}>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem'
                    }}>User</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem'
                    }}>Assessment</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem'
                    }}>Score</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem'
                    }}>%</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem'
                    }}>Correct</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem'
                    }}>Incorrect</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem'
                    }}>Unanswered</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem'
                    }}>Status</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem'
                    }}>Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt, idx) => {
                    const statusStyle = getStatusBadge(attempt.status);
                    return (
                      <tr key={attempt.attemptId} style={{
                        borderBottom: idx < attempts.length - 1 ? '1px solid var(--border)' : 'none',
                        backgroundColor: idx % 2 === 0 ? 'var(--input-bg)' : 'var(--card-bg)'
                      }}>
                        <td style={{
                          padding: '1rem',
                          fontSize: '0.9rem'
                        }}>
                          <div>
                            <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                              {attempt.user.name}
                            </p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                              {attempt.user.email}
                            </p>
                          </div>
                        </td>
                        <td style={{
                          padding: '1rem',
                          fontSize: '0.9rem'
                        }}>
                          {attempt.assessment.title}
                        </td>
                        <td style={{
                          padding: '1rem',
                          fontSize: '0.9rem',
                          textAlign: 'center',
                          fontWeight: '500'
                        }}>
                          {attempt.score}/{attempt.maxScore}
                        </td>
                        <td style={{
                          padding: '1rem',
                          fontSize: '0.9rem',
                          textAlign: 'center',
                          fontWeight: '600',
                          color: getPercentageColor(attempt.percentage)
                        }}>
                          {attempt.percentage}%
                        </td>
                        <td style={{
                          padding: '1rem',
                          fontSize: '0.9rem',
                          textAlign: 'center',
                          color: '#22c55e',
                          fontWeight: '500'
                        }}>
                          {attempt.correctAnswers}
                        </td>
                        <td style={{
                          padding: '1rem',
                          fontSize: '0.9rem',
                          textAlign: 'center',
                          color: '#ef4444',
                          fontWeight: '500'
                        }}>
                          {attempt.incorrectAnswers}
                        </td>
                        <td style={{
                          padding: '1rem',
                          fontSize: '0.9rem',
                          textAlign: 'center',
                          color: '#6b7280',
                          fontWeight: '500'
                        }}>
                          {attempt.unansweredAnswers}
                        </td>
                        <td style={{
                          padding: '1rem',
                          fontSize: '0.9rem',
                          textAlign: 'center'
                        }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.text,
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}>
                            {attempt.status}
                          </span>
                        </td>
                        <td style={{
                          padding: '1rem',
                          fontSize: '0.85rem',
                          color: 'var(--text-secondary)'
                        }}>
                          {formatDate(attempt.completedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  );
};

export default AdminAttemptsPage;
