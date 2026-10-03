import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AssessmentForm from '../components/AssessmentForm';
import {
  getAssessmentsApi,
  createAssessmentApi,
  updateAssessmentApi,
  deleteAssessmentApi,
  publishAssessmentApi,
  unpublishAssessmentApi
} from '../services/assessmentService';
import { ALLOWED_TECHNOLOGIES } from '../services/questionService';
import '../styles/dashboard.css';

const AdminAssessmentManagementPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [submittingForm, setSubmittingForm] = useState(false);

  const [filters, setFilters] = useState({
    technology: '',
    topic: '',
    difficulty: '',
    isPublished: '',
    search: ''
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalAssessments: 0,
    limit: 10
  });

  const fetchAssessments = async (page = 1) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const params = {
        page,
        limit: pagination.limit,
        ...(filters.technology && { technology: filters.technology }),
        ...(filters.topic && { topic: filters.topic }),
        ...(filters.difficulty && { difficulty: filters.difficulty }),
        ...(filters.isPublished !== '' && { isPublished: filters.isPublished }),
        ...(filters.search.trim() && { search: filters.search.trim() })
      };

      const res = await getAssessmentsApi(params);
      if (res && res.success && res.data) {
        setAssessments(res.data.assessments || []);
        setPagination({
          currentPage: res.data.currentPage || 1,
          totalPages: res.data.totalPages || 1,
          totalAssessments: res.data.totalAssessments || 0,
          limit: res.data.limit || 10
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load assessments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments(1);
  }, [filters.technology, filters.topic, filters.difficulty, filters.isPublished]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAssessments(1);
  };

  const handleResetFilters = () => {
    setFilters({
      technology: '',
      topic: '',
      difficulty: '',
      isPublished: '',
      search: ''
    });
  };

  const handleOpenCreateModal = () => {
    setEditingAssessment(null);
    setShowFormModal(true);
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleOpenEditModal = (assessment) => {
    setEditingAssessment(assessment);
    setShowFormModal(true);
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setEditingAssessment(null);
  };

  const handleFormSubmit = async (formData) => {
    setSubmittingForm(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (editingAssessment) {
        const res = await updateAssessmentApi(editingAssessment._id, formData);
        if (res && res.success) {
          setSuccessMsg('Assessment updated successfully!');
          handleCloseFormModal();
          fetchAssessments(pagination.currentPage);
        }
      } else {
        const res = await createAssessmentApi(formData);
        if (res && res.success) {
          setSuccessMsg('Assessment created successfully!');
          handleCloseFormModal();
          fetchAssessments(1);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save assessment.');
    } finally {
      setSubmittingForm(false);
    }
  };

  const handleDeleteAssessment = async (assessment) => {
    const confirmed = window.confirm(`Delete "${assessment.title}"? This action cannot be undone.`);
    if (!confirmed) return;

    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await deleteAssessmentApi(assessment._id);
      if (res && res.success) {
        setSuccessMsg('Assessment deleted successfully!');
        fetchAssessments(pagination.currentPage);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete assessment.');
    }
  };

  const handlePublishToggle = async (assessment, published) => {
    const action = published ? 'unpublish' : 'publish';
    const confirmed = window.confirm(
      published ? `Unpublish "${assessment.title}"?` : `Publish "${assessment.title}"?`
    );
    if (!confirmed) return;

    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = published
        ? await unpublishAssessmentApi(assessment._id)
        : await publishAssessmentApi(assessment._id);

      if (res && res.success) {
        setSuccessMsg(
          published ? 'Assessment unpublished successfully!' : 'Assessment published successfully!'
        );
        fetchAssessments(pagination.currentPage);
      }
    } catch (err) {
      setErrorMsg(err.message || `Failed to ${action} assessment.`);
    }
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
            <span className="placeholder-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              👑 Admin Management
            </span>
            <h1 className="dashboard-title">Assessment Management</h1>
            <p className="dashboard-subtitle">
              Create, edit, publish, filter, and manage interview assessments from the question bank.
            </p>
          </div>

          <button onClick={handleOpenCreateModal} className="btn btn-primary">
            + Create Assessment
          </button>
        </div>

        {successMsg && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#6ee7b7', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            ✅ {successMsg}
          </div>
        )}

        {errorMsg && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <style>{`
          @media (max-width: 720px) {
            .admin-assessment-search-form {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 0.75rem !important;
            }

            .admin-assessment-search-form .search-text-field {
              grid-column: 1 / -1;
            }

            .admin-assessment-search-form .search-actions {
              grid-column: 1 / -1;
              display: grid !important;
              grid-template-columns: 1fr 1fr;
              width: 100%;
              gap: 0.75rem;
            }

            .admin-assessment-search-form input,
            .admin-assessment-search-form select,
            .admin-assessment-search-form button {
              min-height: 48px;
              font-size: 0.95rem;
              border-radius: 12px;
            }

            .admin-assessment-search-form .search-actions button {
              width: 100%;
              white-space: nowrap;
            }
          }
        `}</style>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '2rem' }}>
          <form className="admin-assessment-search-form" onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'center' }}>
            <input
              type="text"
              className="form-input search-text-field"
              placeholder="Search by title, topic, or description..."
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
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>

            <input
              type="text"
              className="form-input"
              placeholder="Topic"
              value={filters.topic}
              onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
            />

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
              value={filters.isPublished}
              onChange={(e) => setFilters({ ...filters, isPublished: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="true">Published</option>
              <option value="false">Unpublished</option>
            </select>

            <div className="search-actions" style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
                Search
              </button>
              {(filters.technology || filters.topic || filters.difficulty || filters.isPublished || filters.search) && (
                <button type="button" onClick={handleResetFilters} className="btn btn-secondary" style={{ padding: '0.75rem 1rem' }}>
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1rem' }}>
            <div className="health-dot loading" style={{ width: '24px', height: '24px' }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading assessments...</p>
          </div>
        ) : assessments.length === 0 ? (
          <div className="placeholder-section">
            <h3 style={{ marginBottom: '0.5rem' }}>No Assessments Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              No assessments match your current filters. Create one to get started.
            </p>
            <button onClick={handleOpenCreateModal} className="btn btn-primary">
              Create Assessment
            </button>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(15, 23, 42, 0.3)' }}>
                    <th style={{ padding: '0.9rem 1rem', textAlign: 'left' }}>Title</th>
                    <th style={{ padding: '0.9rem 1rem', textAlign: 'left' }}>Technology</th>
                    <th style={{ padding: '0.9rem 1rem', textAlign: 'left' }}>Topic</th>
                    <th style={{ padding: '0.9rem 1rem', textAlign: 'left' }}>Difficulty</th>
                    <th style={{ padding: '0.9rem 1rem', textAlign: 'left' }}>Duration</th>
                    <th style={{ padding: '0.9rem 1rem', textAlign: 'left' }}>Questions</th>
                    <th style={{ padding: '0.9rem 1rem', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '0.9rem 1rem', textAlign: 'left' }}>Created</th>
                    <th style={{ padding: '0.9rem 1rem', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((assessment) => {
                    const diffStyle = getDifficultyColor(assessment.difficulty);
                    return (
                      <tr key={assessment._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.9rem 1rem', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{assessment.title}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{assessment.description}</div>
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>{assessment.technology}</td>
                        <td style={{ padding: '0.9rem 1rem' }}>{assessment.topic}</td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <span style={{ background: diffStyle.bg, color: diffStyle.color, border: `1px solid ${diffStyle.border}`, padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 700 }}>
                            {assessment.difficulty}
                          </span>
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>{assessment.duration} mins</td>
                        <td style={{ padding: '0.9rem 1rem' }}>{Array.isArray(assessment.questions) ? assessment.questions.length : 0}</td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <span style={{ background: assessment.isPublished ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: assessment.isPublished ? '#6ee7b7' : '#fcd34d', border: `1px solid ${assessment.isPublished ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`, padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 700 }}>
                            {assessment.isPublished ? 'Published' : 'Unpublished'}
                          </span>
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>{new Date(assessment.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <button type="button" onClick={() => handleOpenEditModal(assessment)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePublishToggle(assessment, assessment.isPublished)}
                              className="btn btn-outline"
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                            >
                              {assessment.isPublished ? 'Unpublish' : 'Publish'}
                            </button>
                            <button type="button" onClick={() => handleDeleteAssessment(assessment)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                <button onClick={() => fetchAssessments(pagination.currentPage - 1)} disabled={pagination.currentPage === 1} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                  ← Previous
                </button>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Page <strong style={{ color: 'var(--text-main)' }}>{pagination.currentPage}</strong> of{' '}
                  <strong style={{ color: 'var(--text-main)' }}>{pagination.totalPages}</strong> ({pagination.totalAssessments} Assessments)
                </span>
                <button onClick={() => fetchAssessments(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showFormModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', width: 'min(1100px, 100%)', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>{editingAssessment ? 'Edit Assessment' : 'Create Assessment'}</h2>
              <button type="button" onClick={handleCloseFormModal} className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem' }}>
                Close
              </button>
            </div>

            <AssessmentForm
              initialValues={editingAssessment ? {
                ...editingAssessment,
                questions: Array.isArray(editingAssessment.questions) ? editingAssessment.questions.map((q) => (typeof q === 'object' ? q._id : q)) : []
              } : null}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseFormModal}
              isSubmitting={submittingForm}
            />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminAssessmentManagementPage;
