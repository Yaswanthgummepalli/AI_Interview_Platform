import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { getQuestionByIdApi } from '../services/questionService';
import '../styles/dashboard.css';

const QuestionDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await getQuestionByIdApi(id);
        if (res && res.success && res.data?.question) {
          setQuestion(res.data.question);
        } else {
          setErrorMsg('Question details not found.');
        }
      } catch (err) {
        setErrorMsg(err.message || 'Failed to load question details.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  return (
    <Layout>
      <div className="container dashboard-container" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/questions" className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
            ← Back to Question Bank
          </Link>
        </div>

        {errorMsg && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)'
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {loading ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4rem 0',
              gap: '1rem'
            }}
          >
            <div className="health-dot loading" style={{ width: '24px', height: '24px' }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading question details...</p>
          </div>
        ) : question ? (
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem'
            }}
          >
            {/* Header badges */}
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <span
                style={{
                  background: 'rgba(79, 70, 229, 0.2)',
                  color: '#818cf8',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                {question.technology}
              </span>

              <span
                style={{
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                Difficulty: {question.difficulty}
              </span>

              <span
                style={{
                  background: 'var(--bg-surface)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-color)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                Type: {question.type}
              </span>
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.35 }}>
              {question.questionText}
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
              Topic: <strong style={{ color: 'var(--text-main)' }}>{question.topic}</strong>
            </p>

            {/* MCQ Options */}
            {question.type === 'MCQ' && question.options && question.options.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.85rem' }}>Options:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {question.options.map((option, idx) => {
                    const isCorrect = question.correctAnswer && question.correctAnswer === option;
                    return (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface)',
                          border: isCorrect ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
                          padding: '0.85rem 1.25rem',
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>
                          <strong style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }}>
                            {String.fromCharCode(65 + idx)}.
                          </strong>
                          {option}
                        </span>

                        {/* Admin Answer Badge */}
                        {user?.role === 'ADMIN' && isCorrect && (
                          <span
                            style={{
                              background: 'rgba(16, 185, 129, 0.3)',
                              color: '#6ee7b7',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px'
                            }}
                          >
                            ✓ Correct Answer (Admin View)
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Admin Correct Answer Explicit View for Non-MCQ or Reference */}
            {user?.role === 'ADMIN' && question.correctAnswer && question.type !== 'MCQ' && (
              <div
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1.5rem'
                }}
              >
                <h4 style={{ color: '#6ee7b7', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                  ✓ Correct Answer (Admin View):
                </h4>
                <p>{question.correctAnswer}</p>
              </div>
            )}

            {/* Explanation / Solution Guidance */}
            {question.explanation && (
              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  marginBottom: '1.75rem'
                }}
              >
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>💡 Explanation / Reference Guidance:</h4>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  {question.explanation}
                </p>
              </div>
            )}

            {/* Tags */}
            {question.tags && question.tags.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tags:</span>
                {question.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'var(--bg-surface)',
                      color: 'var(--text-muted)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default QuestionDetailPage;
