import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { getAssessmentByIdApi } from '../services/assessmentService';
import '../styles/dashboard.css';

const AssessmentDetailPage = () => {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchAssessment = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await getAssessmentByIdApi(id);
        if (res && res.success && res.data?.assessment) {
          setAssessment(res.data.assessment);
        } else {
          setErrorMsg('Assessment details not found.');
        }
      } catch (err) {
        setErrorMsg(err.message || 'Failed to load assessment details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  return (
    <Layout>
      <div className="container dashboard-container" style={{ maxWidth: '900px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/assessments" className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
            ← Back to Assessments
          </Link>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1rem' }}>
            <div className="health-dot loading" style={{ width: '24px', height: '24px' }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading assessment details...</p>
          </div>
        ) : assessment ? (
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
              <div>
                <span style={{ background: 'rgba(79, 70, 229, 0.2)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>
                  {assessment.technology}
                </span>
                <h2 style={{ marginTop: '0.9rem', marginBottom: '0.4rem', fontSize: '2rem', lineHeight: 1.2 }}>{assessment.title}</h2>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>{assessment.topic}</p>
              </div>

              <span style={{ background: assessment.difficulty === 'EASY' ? 'rgba(16, 185, 129, 0.15)' : assessment.difficulty === 'MEDIUM' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: assessment.difficulty === 'EASY' ? '#6ee7b7' : assessment.difficulty === 'MEDIUM' ? '#fcd34d' : '#fca5a5', border: '1px solid rgba(255,255,255,0.08)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                {assessment.difficulty}
              </span>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {assessment.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Duration</div>
                <div style={{ fontWeight: 700 }}>{assessment.duration} minutes</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Questions</div>
                <div style={{ fontWeight: 700 }}>{Array.isArray(assessment.questions) ? assessment.questions.length : 0}</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Status</div>
                <div style={{ fontWeight: 700 }}>{assessment.isPublished ? 'Published' : 'Unpublished'}</div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Assessment Overview</h3>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                <li>This assessment is focused on <strong style={{ color: 'var(--text-main)' }}>{assessment.topic}</strong>.</li>
                <li>Difficulty level: <strong style={{ color: 'var(--text-main)' }}>{assessment.difficulty}</strong>.</li>
                <li>Technology: <strong style={{ color: 'var(--text-main)' }}>{assessment.technology}</strong>.</li>
                <li>Estimated completion time: <strong style={{ color: 'var(--text-main)' }}>{assessment.duration} minutes</strong>.</li>
              </ul>
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Selected Questions</h3>
              {Array.isArray(assessment.questions) && assessment.questions.length > 0 ? (
                <ol style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                  {assessment.questions.map((question, index) => (
                    <li key={question._id || `${question.questionText}-${index}`}>
                      <strong style={{ color: 'var(--text-main)' }}>{question.questionText}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {question.difficulty} • {question.type} • {question.topic}
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>No questions are currently attached to this assessment.</p>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-primary" disabled style={{ opacity: 0.7, cursor: 'not-allowed' }}>
                Start Assessment (Coming Soon)
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default AssessmentDetailPage;
