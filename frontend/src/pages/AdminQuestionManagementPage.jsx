import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import QuestionForm from '../components/QuestionForm';
import {
  getQuestionsApi,
  createQuestionApi,
  updateQuestionApi,
  deleteQuestionApi
} from '../services/questionService';
import { ALLOWED_TECHNOLOGIES } from '../services/questionService';
import '../styles/dashboard.css';

const AdminQuestionManagementPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form Modal / Drawer State
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [submittingForm, setSubmittingForm] = useState(false);

  // Delete Modal State
  const [deletingQuestion, setDeletingQuestion] = useState(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

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
    limit: 10
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
          limit: res.data.limit || 10
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch questions.');
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

  const handleOpenCreateModal = () => {
    setEditingQuestion(null);
    setShowFormModal(true);
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleOpenEditModal = (q) => {
    setEditingQuestion(q);
    setShowFormModal(true);
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setEditingQuestion(null);
  };

  const handleFormSubmit = async (formData) => {
    setSubmittingForm(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (editingQuestion) {
        // Update
        const res = await updateQuestionApi(editingQuestion._id, formData);
        if (res && res.success) {
          setSuccessMsg('Question updated successfully!');
          handleCloseFormModal();
          fetchQuestions(pagination.currentPage);
        }
      } else {
        // Create
        const res = await createQuestionApi(formData);
        if (res && res.success) {
          setSuccessMsg('Question created successfully!');
          handleCloseFormModal();
          fetchQuestions(1);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save question.');
    } finally {
      setSubmittingForm(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingQuestion) return;
    setDeletingLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await deleteQuestionApi(deletingQuestion._id);
      if (res && res.success) {
        setSuccessMsg('Question deleted successfully!');
        setDeletingQuestion(null);
        fetchQuestions(pagination.currentPage);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete question.');
    } finally {
      setDeletingLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container dashboard-container">
        <div className="dashboard-header">
          <div>
            <span className="placeholder-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              👑 Admin Management
            </span>
            <h1 className="dashboard-title">Question Bank Management</h1>
            <p className="dashboard-subtitle">
              Create, update, organize, and manage technical questions for assessments.
            </p>
          </div>

          <button onClick={handleOpenCreateModal} className="btn btn-primary">
            + Create New Question
          </button>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#6ee7b7',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem'
            }}
          >
            ✅ {successMsg}
          </div>
        )}

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

        {/* Search & Filter Bar */}
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
            <input
              type="text"
              className="form-input"
              placeholder="Search by text, topic, or tag..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />

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

            <select
              className="form-input"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="MCQ">MCQ</option>
              <option value="SUBJECTIVE">SUBJECTIVE</option>
            </select>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
              Search
            </button>
          </form>
        </div>

        {/* Question Table / List */}
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
            <h3>No Questions Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              No questions found matching your filter criteria. Click below to add the first question!
            </p>
            <button onClick={handleOpenCreateModal} className="btn btn-primary">
              + Create Question
            </button>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              marginBottom: '2rem'
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '1rem 1.25rem' }}>Question</th>
                    <th style={{ padding: '1rem' }}>Technology</th>
                    <th style={{ padding: '1rem' }}>Topic</th>
                    <th style={{ padding: '1rem' }}>Difficulty</th>
                    <th style={{ padding: '1rem' }}>Type</th>
                    <th style={{ padding: '1rem' }}>Created</th>
                    <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q) => (
                    <tr key={q._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 500, maxWidth: '300px' }}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {q.questionText}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ background: 'rgba(79, 70, 229, 0.15)', color: '#a5b4fc', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                          {q.technology}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{q.topic}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          color: q.difficulty === 'EASY' ? '#6ee7b7' : q.difficulty === 'MEDIUM' ? '#fcd34d' : '#fca5a5',
                          fontWeight: 700,
                          fontSize: '0.8rem'
                        }}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{q.type}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {new Date(q.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleOpenEditModal(q)}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeletingQuestion(q)}
                            className="btn btn-outline"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Total {pagination.totalQuestions} questions
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    onClick={() => fetchQuestions(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                  >
                    Previous
                  </button>
                  <span style={{ fontSize: '0.85rem' }}>
                    {pagination.currentPage} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => fetchQuestions(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal for Create/Edit Question */}
        {showFormModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                width: '100%',
                maxWidth: '700px',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>{editingQuestion ? 'Edit Question' : 'Create New Question'}</h2>
                <button
                  onClick={handleCloseFormModal}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <QuestionForm
                initialValues={editingQuestion}
                onSubmit={handleFormSubmit}
                onCancel={handleCloseFormModal}
                isSubmitting={submittingForm}
              />
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingQuestion && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                width: '100%',
                maxWidth: '450px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗑️</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Delete Question?</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Are you sure you want to delete this question? This action cannot be undone.
              </p>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '1.5rem', fontStyle: 'italic', background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                "{deletingQuestion.questionText}"
              </p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={() => setDeletingQuestion(null)}
                  className="btn btn-secondary"
                  disabled={deletingLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#ef4444' }}
                  disabled={deletingLoading}
                >
                  {deletingLoading ? 'Deleting...' : 'Delete Question'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminQuestionManagementPage;
