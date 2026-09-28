import React, { useState, useEffect } from 'react';

const ALLOWED_TECHNOLOGIES = [
  'JavaScript',
  'React',
  'Node.js',
  'Express.js',
  'MongoDB',
  'Java',
  'SQL'
];

const QuestionForm = ({ initialValues, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    questionText: initialValues?.questionText || '',
    type: initialValues?.type || 'MCQ',
    technology: initialValues?.technology || 'JavaScript',
    topic: initialValues?.topic || '',
    difficulty: initialValues?.difficulty || 'EASY',
    options: initialValues?.options && initialValues.options.length >= 2
      ? initialValues.options
      : ['', ''],
    correctAnswer: initialValues?.correctAnswer || '',
    explanation: initialValues?.explanation || '',
    tags: Array.isArray(initialValues?.tags) ? initialValues.tags.join(', ') : initialValues?.tags || ''
  });

  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (formData.type === 'MCQ' && formData.options.length > 0 && !formData.correctAnswer) {
      setFormData((prev) => ({ ...prev, correctAnswer: prev.options[0] || '' }));
    }
  }, [formData.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = value;
    
    // If the changed option was selected as correctAnswer, update correctAnswer as well
    let updatedCorrect = formData.correctAnswer;
    if (formData.correctAnswer === formData.options[index]) {
      updatedCorrect = value;
    }

    setFormData((prev) => ({
      ...prev,
      options: updatedOptions,
      correctAnswer: updatedCorrect
    }));
    if (formError) setFormError('');
  };

  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleRemoveOption = (index) => {
    if (formData.options.length <= 2) {
      setFormError('MCQ questions require at least 2 options.');
      return;
    }
    const updatedOptions = formData.options.filter((_, i) => i !== index);
    let updatedCorrect = formData.correctAnswer;
    if (!updatedOptions.includes(updatedCorrect)) {
      updatedCorrect = updatedOptions[0] || '';
    }
    setFormData((prev) => ({
      ...prev,
      options: updatedOptions,
      correctAnswer: updatedCorrect
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.questionText.trim()) {
      setFormError('Question text is required.');
      return;
    }

    if (!formData.topic.trim()) {
      setFormError('Topic is required.');
      return;
    }

    if (formData.type === 'MCQ') {
      const validOptions = formData.options.map((o) => o.trim()).filter(Boolean);
      if (validOptions.length < 2) {
        setFormError('MCQ questions require at least 2 non-empty options.');
        return;
      }
      if (!formData.correctAnswer || !validOptions.includes(formData.correctAnswer.trim())) {
        setFormError('Please select a valid correct answer from your options.');
        return;
      }
    }

    setFormError('');
    onSubmit({
      ...formData,
      questionText: formData.questionText.trim(),
      topic: formData.topic.trim(),
      options: formData.type === 'MCQ' ? formData.options.map((o) => o.trim()).filter(Boolean) : [],
      correctAnswer: formData.type === 'MCQ' ? formData.correctAnswer.trim() : '',
      explanation: formData.explanation.trim(),
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    });
  };

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
        <label className="form-label" htmlFor="questionText">
          Question Text *
        </label>
        <textarea
          id="questionText"
          name="questionText"
          className="form-input"
          rows={3}
          placeholder="e.g. What is the difference between Virtual DOM and Real DOM in React?"
          value={formData.questionText}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="type">
            Question Type *
          </label>
          <select
            id="type"
            name="type"
            className="form-input"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="MCQ">MCQ (Multiple Choice)</option>
            <option value="SUBJECTIVE">SUBJECTIVE (Open Ended)</option>
          </select>
        </div>

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
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="topic">
          Topic / Concept *
        </label>
        <input
          id="topic"
          name="topic"
          type="text"
          className="form-input"
          placeholder="e.g. Hooks, Async/Await, Indexes"
          value={formData.topic}
          onChange={handleChange}
          required
        />
      </div>

      {/* Dynamic MCQ Options & Correct Answer Selection */}
      {formData.type === 'MCQ' && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label" style={{ margin: 0 }}>
              Answer Options (Minimum 2) *
            </label>
            <button
              type="button"
              onClick={handleAddOption}
              className="btn btn-secondary"
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
            >
              + Add Option
            </button>
          </div>

          {formData.options.map((opt, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="radio"
                name="correctAnswerRadio"
                checked={formData.correctAnswer === opt && opt.trim() !== ''}
                onChange={() => setFormData((prev) => ({ ...prev, correctAnswer: opt }))}
                title="Select as correct answer"
                disabled={!opt.trim()}
              />
              <input
                type="text"
                className="form-input"
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                required
              />
              {formData.options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(idx)}
                  className="btn btn-outline"
                  style={{ padding: '0.5rem 0.75rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                  title="Remove option"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-label" htmlFor="correctAnswer">
              Correct Answer Selection *
            </label>
            <select
              id="correctAnswer"
              name="correctAnswer"
              className="form-input"
              value={formData.correctAnswer}
              onChange={handleChange}
            >
              <option value="" disabled>-- Select Correct Option --</option>
              {formData.options
                .filter((o) => o.trim())
                .map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                ))}
            </select>
          </div>
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="explanation">
          Explanation / Answer Guidance
        </label>
        <textarea
          id="explanation"
          name="explanation"
          className="form-input"
          rows={2}
          placeholder="Explain why the answer is correct or key points expected..."
          value={formData.explanation}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="tags">
          Tags (Comma Separated)
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          className="form-input"
          placeholder="e.g. frontend, dom, state-management"
          value={formData.tags}
          onChange={handleChange}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving Question...' : initialValues ? 'Update Question' : 'Create Question'}
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;
