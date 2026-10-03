import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getUserAttemptsApi } from '../services/assessmentService';
import '../styles/AttemptsHistoryPage.css';

const AttemptHistoryPage = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchAttempts = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await getUserAttemptsApi();
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
      year: 'numeric'
    });
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 70) return '#22c55e';
    if (percentage >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'HARD':
        return { bg: 'rgba(239, 68, 68, 0.2)', text: '#fca5a5' };
      case 'MEDIUM':
        return { bg: 'rgba(245, 158, 11, 0.2)', text: '#fcd34d' };
      case 'EASY':
      default:
        return { bg: 'rgba(34, 197, 94, 0.2)', text: '#86efac' };
    }
  };

  return (
    <Layout>
      <div className="container dashboard-container" style={{ maxWidth: '1000px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Assessment Attempts</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            View your previous assessment attempts and results
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
            <p style={{ color: 'var(--text-secondary)' }}>Loading results...</p>
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
            <button
              onClick={() => navigate('/assessments')}
              className="btn btn-primary"
              style={{ padding: '0.6rem 1.5rem' }}
            >
              Browse Assessments
            </button>
          </div>
        ) : (
          <div className="attempts-history-list" style={{ display: 'grid', gap: '1rem' }}>
            {attempts.map((attempt) => (
              <div
                key={attempt.attemptId}
                className="attempt-history-card"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '1.5rem',
                  alignItems: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div>
                  <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                    {attempt.title}
                  </h3>
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '0.75rem',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {attempt.technology}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>•</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {attempt.topic}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>•</span>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: getDifficultyColor(attempt.difficulty).bg,
                      color: getDifficultyColor(attempt.difficulty).text,
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      {attempt.difficulty}
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem'
                  }}>
                    <div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Score</p>
                      <p style={{ fontSize: '1rem', fontWeight: '600' }}>
                        {attempt.score} / {attempt.maxScore}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Percentage</p>
                      <p style={{ fontSize: '1rem', fontWeight: '600', color: getPercentageColor(attempt.percentage) }}>
                        {attempt.percentage}%
                      </p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Correct</p>
                      <p style={{ fontSize: '1rem', fontWeight: '600', color: '#22c55e' }}>
                        {attempt.correctAnswers}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Incorrect</p>
                      <p style={{ fontSize: '1rem', fontWeight: '600', color: '#ef4444' }}>
                        {attempt.incorrectAnswers}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Unanswered</p>
                      <p style={{ fontSize: '1rem', fontWeight: '600', color: '#6b7280' }}>
                        {attempt.unansweredAnswers}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Completed</p>
                      <p style={{ fontSize: '0.9rem' }}>
                        {formatDate(attempt.completedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/assessments/${attempt.assessmentId}/result/${attempt.attemptId}`)}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.2rem', whiteSpace: 'nowrap' }}
                >
                  View Result
                </button>
              </div>
            ))}
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

export default AttemptHistoryPage;
