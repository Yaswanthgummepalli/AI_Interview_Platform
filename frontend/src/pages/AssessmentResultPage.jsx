import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getAttemptResultApi } from '../services/assessmentService';
import '../styles/dashboard.css';

const AssessmentResultPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await getAttemptResultApi(attemptId);
        if (res && res.success && res.data) {
          setResult(res.data);
        } else {
          setErrorMsg('Result not found.');
        }
      } catch (err) {
        setErrorMsg(err.message || 'Failed to load result.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId]);

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

  return (
    <Layout>
      <div className="container dashboard-container" style={{ maxWidth: '700px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate('/attempts')}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
          >
            ← Back to Attempts
          </button>
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
            <div className="spinner" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid rgba(139, 92, 246, 0.2)', borderTop: '4px solid var(--primary)', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading results...</p>
          </div>
        ) : result ? (
          <div>
            <div style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>
                  Assessment Completed ✓
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  {result.assessment.title}
                </p>
              </div>

              {/* Score Summary */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  textAlign: 'center'
                }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Score</p>
                  <p style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--primary)' }}>
                    {result.score} / {result.maxScore}
                  </p>
                </div>

                <div style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  textAlign: 'center'
                }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Percentage</p>
                  <p style={{ fontSize: '2rem', fontWeight: '600', color: result.percentage >= 70 ? '#22c55e' : result.percentage >= 50 ? '#f59e0b' : '#ef4444' }}>
                    {result.percentage}%
                  </p>
                </div>
              </div>

              {/* Assessment Details */}
              <div style={{
                backgroundColor: 'var(--input-bg)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <strong>Technology:</strong> {result.assessment.technology}
                </p>
                <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <strong>Topic:</strong> {result.assessment.topic}
                </p>
                <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <strong>Difficulty:</strong> <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: result.assessment.difficulty === 'HARD' ? 'rgba(239, 68, 68, 0.2)' : result.assessment.difficulty === 'MEDIUM' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                    color: result.assessment.difficulty === 'HARD' ? '#fca5a5' : result.assessment.difficulty === 'MEDIUM' ? '#fcd34d' : '#86efac',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    {result.assessment.difficulty}
                  </span>
                </p>
                <p style={{ marginBottom: '0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <strong>Completed:</strong> {formatDate(result.completedAt)}
                </p>
              </div>

              {/* Answer Statistics */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Correct</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#22c55e' }}>
                    {result.correctAnswers}
                  </p>
                </div>

                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Incorrect</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#ef4444' }}>
                    {result.incorrectAnswers}
                  </p>
                </div>

                <div style={{
                  backgroundColor: 'rgba(107, 114, 128, 0.1)',
                  border: '1px solid rgba(107, 114, 128, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Unanswered</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#6b7280' }}>
                    {result.unansweredAnswers}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center'
              }}>
                <button
                  onClick={() => navigate('/attempts')}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.5rem' }}
                >
                  View All Attempts
                </button>
                <button
                  onClick={() => navigate('/assessments')}
                  className="btn btn-secondary"
                  style={{ padding: '0.6rem 1.5rem' }}
                >
                  Browse Assessments
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  );
};

export default AssessmentResultPage;
