import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getQuestionsApi } from '../services/questionService';
import { ALLOWED_TECHNOLOGIES } from '../services/questionService';
import '../styles/dashboard.css';

const UserQuestionBankPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Filters & Pagination State
  const [filters, setFilters] = useState({
    technology: '',
    difficulty: '',
    type: '',
    search: ''
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalQuestions: 0,
    limit: 9
  });

  const fetchQuestions = async (page = 1) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const params = {
        page,
        limit: pagination.limit,
        ...(filters.technology && { technology: filters.technology }),
        ...(filters.difficulty && { difficulty: filters.difficulty }),
        ...(filters.type && { type: filters.type }),
        ...(filters.search.trim() && { search: filters.search.trim() })
      };

      const res = await getQuestionsApi(params);
      if (res && res.success && res.data) {
        setQuestions(res.data.questions || []);
        setPagination({
          currentPage: res.data.currentPage || 1,
          totalPages: res.data.totalPages || 1,
          totalQuestions: res.data.totalQuestions || 0,
          limit: res.data.limit || 9
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(1);
  }, [filters.technology, filters.difficulty, filters.type]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchQuestions(1);
  };

  const handleResetFilters = () => {
    setFilters({
      technology: '',
      difficulty: '',
      type: '',
      search: ''
    });
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'EASY':
        return { bg: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', border: 'rgba(16, 185, 129, 0.3)' };
      case 'MEDIUM':
        return { bg: 'rgba(245, 158, 11, 0.15)', color: '#fcd34d', border: 'rgba(245, 158, 11, 0.3)' };
      case 'HARD':
        return { bg: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', border: 'rgba(239, 68, 68, 0.3)' };
      default:
        return { bg: 'var(--bg-surface)', color: 'var(--text-muted)', border: 'var(--border-color)' };
    }
  };

  return (
    <Layout>
      <div className="container dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Question Bank</h1>
            <p className="dashboard-subtitle">
              Browse technical interview questions across technologies and core concepts.
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '2rem'
          }}
        >
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
              gap: '1rem',
              alignItems: 'center'
            }}
          >
            <div>
              <input
                type="text"
                className="form-input"
                placeholder="Search questions by text or topic..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            <div>
              <select
                className="form-input"
                value={filters.technology}
                onChange={(e) => setFilters({ ...filters, technology: e.target.value })}
              >
                <option value="">All Technologies</option>
                {ALLOWED_TECHNOLOGIES.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                className="form-input"
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              >
                <option value="">All Difficulties</option>
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>
            </div>

            <div>
              <select
                className="form-input"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="MCQ">MCQ</option>
                <option value="SUBJECTIVE">SUBJECTIVE</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
                Search
              </button>
              {(filters.technology || filters.difficulty || filters.type || filters.search) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn btn-secondary"
                  style={{ padding: '0.75rem 1rem' }}
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem'
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Loading Spinner */}
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
            <p style={{ color: 'var(--text-muted)' }}>Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="placeholder-section">
            <h3 style={{ marginBottom: '0.5rem' }}>No Questions Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              No questions matched your search criteria or filter options.
            </p>
            <button onClick={handleResetFilters} className="btn btn-secondary">
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {questions.map((q) => {
                const diffStyle = getDifficultyColor(q.difficulty);
                return (
                  <div
                    key={q._id}
                    className="feature-card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '1.5rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                        <span
                          style={{
                            background: 'rgba(79, 70, 229, 0.15)',
                            color: '#a5b4fc',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            padding: '0.2rem 0.6rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        >
                          {q.technology}
                        </span>

                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <span
                            style={{
                              background: diffStyle.bg,
                              color: diffStyle.color,
                              border: `1px solid ${diffStyle.border}`,
                              padding: '0.2rem 0.55rem',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.7rem',
                              fontWeight: 700
                            }}
                          >
                            {q.difficulty}
                          </span>
                          <span
                            style={{
                              background: 'var(--bg-surface)',
                              color: 'var(--text-muted)',
                              border: '1px solid var(--border-color)',
                              padding: '0.2rem 0.55rem',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.7rem',
                              fontWeight: 600
                            }}
                          >
                            {q.type}
                          </span>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.4 }}>
                        {q.questionText}
                      </h3>

                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Topic: <strong style={{ color: 'var(--text-main)' }}>{q.topic}</strong>
                      </p>

                      {q.tags && q.tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                          {q.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              style={{
                                background: 'rgba(30, 41, 59, 0.8)',
                                color: 'var(--text-muted)',
                                padding: '0.15rem 0.45rem',
                                borderRadius: '4px',
                                fontSize: '0.7rem'
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                      <Link to={`/questions/${q._id}`} className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
                        View Details →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                <button
                  onClick={() => fetchQuestions(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  ← Previous
                </button>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Page <strong style={{ color: 'var(--text-main)' }}>{pagination.currentPage}</strong> of{' '}
                  <strong style={{ color: 'var(--text-main)' }}>{pagination.totalPages}</strong> ({pagination.totalQuestions} Questions)
                </span>
                <button
                  onClick={() => fetchQuestions(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default UserQuestionBankPage;
