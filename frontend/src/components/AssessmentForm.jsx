import React, { useState, useEffect } from 'react';
import { getQuestionsApi, ALLOWED_TECHNOLOGIES } from '../services/questionService';

const AssessmentForm = ({ initialValues, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    technology: initialValues?.technology || 'JavaScript',
    topic: initialValues?.topic || '',
    difficulty: initialValues?.difficulty || 'EASY',
    duration: initialValues?.duration || 30,
    questions: Array.isArray(initialValues?.questions)
      ? initialValues.questions.map((q) => (typeof q === 'object' ? q._id : q))
      : []
  });

  const [formError, setFormError] = useState('');

  // Available Questions Bank State for Selector
  const [bankQuestions, setBankQuestions] = useState([]);
  const [bankLoading, setBankLoading] = useState(false);
  const [questionSearch, setQuestionSearch] = useState('');

  // Fetch questions from Question Bank matching current technology selection
  useEffect(() => {
    const fetchQuestionBank = async () => {
      setBankLoading(true);
      try {
        const res = await getQuestionsApi({
          technology: formData.technology,
          limit: 50
        });
        if (res && res.success && res.data?.questions) {
          setBankQuestions(res.data.questions);
        }
      } catch (err) {
        console.warn('Failed to load question bank for selector:', err.message);
      } finally {
        setBankLoading(false);
      }
    };

    fetchQuestionBank();
  }, [formData.technology]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handleToggleQuestion = (questionId) => {
    setFormData((prev) => {
      const exists = prev.questions.includes(questionId);
      const updated = exists
        ? prev.questions.filter((id) => id !== questionId)
        : [...prev.questions, questionId];
      return { ...prev, questions: updated };
    });
    if (formError) setFormError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setFormError('Title is required.');
      return;
    }

    if (!formData.description.trim()) {
      setFormError('Description is required.');
      return;
    }

    if (!formData.topic.trim()) {
      setFormError('Topic is required.');
      return;
    }

    const durationNum = parseInt(formData.duration, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      setFormError('Duration must be a positive number of minutes.');
      return;
    }

    if (!formData.questions || formData.questions.length === 0) {
      setFormError('Please select at least one question for the assessment.');
      return;
    }

    setFormError('');
    onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      topic: formData.topic.trim(),
      duration: durationNum
    });
  };

  const filteredBank = bankQuestions.filter((q) => {
    if (!questionSearch.trim()) return true;
    const term = questionSearch.toLowerCase();
    return (
      q.questionText.toLowerCase().includes(term) ||
      q.topic.toLowerCase().includes(term)
    );
  });

  return (
    <form onSubmit={handleSubmit} className="auth-form" style={{ gap: '1.25rem' }}>
      {formError && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem'
          }}
        >
          ⚠️ {formError}
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="title">
          Assessment Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className="form-input"
          placeholder="e.g. React Senior Frontend Evaluation"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="description">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          className="form-input"
          rows={3}
          placeholder="Comprehensive evaluation covering React Hooks, Virtual DOM, and state architecture..."
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="technology">
            Technology *
          </label>
          <select
            id="technology"
            name="technology"
            className="form-input"
            value={formData.technology}
            onChange={handleChange}
          >
            {ALLOWED_TECHNOLOGIES.map((tech) => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="topic">
            Topic *
          </label>
          <input
            id="topic"
            name="topic"
            type="text"
            className="form-input"
            placeholder="e.g. Core Fundamentals"
            value={formData.topic}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="difficulty">
            Difficulty *
          </label>
          <select
            id="difficulty"
            name="difficulty"
            className="form-input"
            value={formData.difficulty}
            onChange={handleChange}
          >
            <option value="EASY">EASY</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HARD">HARD</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="duration">
            Duration (Mins) *
          </label>
          <input
            id="duration"
            name="duration"
            type="number"
            min="1"
            className="form-input"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Question Selector Section */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', margin: 0 }}>
              Select Questions from Question Bank *
            </h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Showing {formData.technology} questions
            </span>
          </div>
          <span
            style={{
              background: 'rgba(79, 70, 229, 0.2)',
              color: '#818cf8',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700
            }}
          >
            Selected Questions: {formData.questions.length}
          </span>
        </div>

        <input
          type="text"
          className="form-input"
          placeholder="Filter questions by text or topic..."
          value={questionSearch}
          onChange={(e) => setQuestionSearch(e.target.value)}
        />

        {bankLoading ? (
          <div style={{ padding: '1.5rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading available {formData.technology} questions...
          </div>
        ) : filteredBank.length === 0 ? (
          <div style={{ padding: '1.5rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            No {formData.technology} questions found in Question Bank. Create questions in Admin Questions first!
          </div>
        ) : (
          <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.25rem' }}>
            {filteredBank.map((q) => {
              const isSelected = formData.questions.includes(q._id);
              return (
                <div
                  key={q._id}
                  onClick={() => handleToggleQuestion(q._id)}
                  style={{
                    backgroundColor: isSelected ? 'rgba(79, 70, 229, 0.15)' : 'var(--bg-card)',
                    border: isSelected ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // handled by parent onClick
                      style={{ cursor: 'pointer' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {q.questionText}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Topic: {q.topic} • Difficulty: {q.difficulty} • Type: {q.type}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: isSelected ? '#818cf8' : 'var(--text-muted)'
                    }}
                  >
                    {isSelected ? '✓ Selected' : '+ Add'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving Assessment...'
            : initialValues
            ? 'Update Assessment'
            : 'Create Assessment'}
        </button>
      </div>
    </form>
  );
};

export default AssessmentForm;
