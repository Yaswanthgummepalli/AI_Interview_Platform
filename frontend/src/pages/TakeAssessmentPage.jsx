import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { startAssessmentApi, getAttemptApi, saveAnswerApi, submitAttemptApi } from '../services/assessmentService';

const TakeAssessmentPage = () => {
  const { id } = useParams(); // assessment id
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingMs, setRemainingMs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const formatTimeLeft = (ms) => {
    const safeMs = Math.max(0, Number(ms) || 0);
    const totalSeconds = Math.ceil(safeMs / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    const start = async () => {
      setLoading(true);
      try {
        const res = await startAssessmentApi(id);
        if (res && res.success && res.data?.attempt) {
          const startedAt = res.data.attempt.startedAt || new Date();
          const durationMinutes = Number(res.data.attempt.assessment?.duration || 0);
          const endTime = new Date(startedAt).getTime() + durationMinutes * 60 * 1000;
          const nextRemaining = Number.isFinite(res.data.remainingMs) ? Number(res.data.remainingMs) : Math.max(endTime - Date.now(), 0);
          setAttempt(res.data.attempt);
          setRemainingMs(nextRemaining);
        }
      } catch (err) {
        console.error(err);
        alert(err.message || 'Failed to start assessment');
        navigate('/assessments');
      } finally {
        setLoading(false);
      }
    };

    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!attempt || !attempt.startedAt) return;

    const interval = setInterval(() => {
      const durationMinutes = Number(attempt.assessment?.duration || 0);
      const startedAt = new Date(attempt.startedAt).getTime();
      const endTime = startedAt + durationMinutes * 60 * 1000;
      const updatedRemaining = Math.max(endTime - Date.now(), 0);

      setRemainingMs(updatedRemaining);

      if (updatedRemaining <= 1000) {
        clearInterval(interval);
        handleSubmit();
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  const handleAnswerChange = (questionId, value) => {
    setAttempt((prev) => {
      const updated = { ...prev };
      updated.answers = updated.answers.map((a) => (String(a.question._id || a.question) === String(questionId) ? { ...a, answer: value } : a));
      return updated;
    });
  };

  const handleSave = async () => {
    if (!attempt) return;
    setSaving(true);
    const currentQ = attempt.answers[currentIndex];
    try {
      await saveAnswerApi(attempt._id, { questionId: currentQ.question._id || currentQ.question, answer: currentQ.answer });
      alert('Saved');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!attempt) return;
    try {
      const res = await submitAttemptApi(attempt._id);
      if (res && res.success) {
        // Redirect to result page
        navigate(`/assessments/${id}/result/${attempt._id}`);
      } else {
        alert('Submission failed');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to submit');
    }
  };

  if (loading) return <Layout><div style={{padding: '3rem'}}>Loading...</div></Layout>;
  if (!attempt) return <Layout><div style={{padding: '3rem'}}>No attempt available.</div></Layout>;

  const questionEntry = attempt.answers[currentIndex];
  const question = questionEntry.question && (questionEntry.question.questionText ? questionEntry.question : { questionText: questionEntry.question });

  return (
    <Layout>
      <div style={{ maxWidth: 900, margin: '2rem auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2>{attempt.assessment.title}</h2>
          <div style={{ fontWeight: 700, color: '#a5b4fc' }}>
            Time left: {formatTimeLeft(remainingMs)}
          </div>
        </div>

        <div style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px', background: 'var(--bg-card)' }}>
          <h3>Question {currentIndex + 1} of {attempt.answers.length}</h3>
          <p style={{ fontWeight: 700 }}>{question.questionText}</p>

          <div style={{ marginTop: '1rem' }}>
            {question.type === 'MCQ' ? (
              (question.options || []).map((opt, idx) => (
                <div key={idx} style={{ marginBottom: '0.5rem' }}>
                  <label>
                    <input
                      type="radio"
                      name={`q-${currentIndex}`}
                      checked={questionEntry.answer === opt}
                      onChange={() => handleAnswerChange(questionEntry.question._id || questionEntry.question, opt)}
                    />{' '}
                    {opt}
                  </label>
                </div>
              ))
            ) : (
              <textarea
                value={questionEntry.answer}
                onChange={(e) => handleAnswerChange(questionEntry.question._id || questionEntry.question, e.target.value)}
                rows={6}
                style={{ width: '100%' }}
              />
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <div>
              <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} className="btn btn-secondary" style={{ marginRight: '0.5rem' }}>
                Previous
              </button>
              <button onClick={() => setCurrentIndex(Math.min(attempt.answers.length - 1, currentIndex + 1))} className="btn btn-secondary">
                Next
              </button>
            </div>
            <div>
              <button onClick={handleSave} className="btn btn-primary" disabled={saving} style={{ marginRight: '0.5rem' }}>
                Save
              </button>
              <button onClick={handleSubmit} className="btn btn-danger">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TakeAssessmentPage;
