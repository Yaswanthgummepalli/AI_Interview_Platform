import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import '../styles/landing.css';

const LandingPage = () => {
  const features = [
    {
      id: 'technical-assessments',
      icon: '💻',
      title: 'Technical Assessments',
      description:
        'Evaluate your coding, system design, and algorithmic problem-solving capabilities with structured role-based challenges.'
    },
    {
      id: 'performance-tracking',
      icon: '📊',
      title: 'Performance Tracking',
      description:
        'Monitor your improvement over time with detailed metrics, accuracy scores, and speed analytics on every practice attempt.'
    },
    {
      id: 'ai-preparation',
      icon: '🤖',
      title: 'AI-Powered Preparation',
      description:
        'Receive intelligent feedback, personalized recommendations, and targeted practice plans tailored to your target tech stack.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Select Your Domain',
      description: 'Choose your desired tech stack, seniority level, and target job role to customize your practice track.'
    },
    {
      number: '02',
      title: 'Practice & Assess',
      description: 'Complete realistic technical challenges and mock scenarios built to mimic top technology companies.'
    },
    {
      number: '03',
      title: 'Track & Improve',
      description: 'Analyze your performance insights, refine your weak areas, and enter real interviews with confidence.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow" />
        <div className="container hero-content">
          <div className="hero-badge">
            🚀 The Modern Interview Prep Platform
          </div>

          <h1 className="hero-title">
            Prepare Smarter. <br />
            <span className="gradient-text">Interview Better.</span>
          </h1>

          <p className="hero-description">
            Practice technical interviews, assess your skills, track your performance, and prepare with AI-powered tools.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started <span>→</span>
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Core Capabilities</span>
            <h2 className="section-title">Everything you need to land your dream tech role</h2>
            <p className="section-subtitle">
              Built for software engineers, developers, and tech professionals preparing for technical evaluations.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon-wrapper">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section how-it-works-bg">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Simple Workflow</span>
            <h2 className="section-title">How InterviewAI Works</h2>
            <p className="section-subtitle">
              A structured 3-step approach to elevate your interview readiness.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step) => (
              <div key={step.number} className="step-card">
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-title">Ready to master your next interview?</h2>
            <p className="cta-subtitle">
              Join software developers around the world using InterviewAI to sharpen their technical skills.
            </p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Your Free Account
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage;
