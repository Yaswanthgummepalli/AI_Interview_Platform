import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand-logo">
              <div className="brand-icon">⚡</div>
              <span>Interview<span className="gradient-text">AI</span></span>
            </Link>
            <p>
              Elevate your tech career with next-generation interview prep, skill assessments, and performance tracking.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Platform</h4>
            <ul className="footer-links">
              <li><a href="/#features">Technical Assessments</a></li>
              <li><a href="/#features">Performance Tracking</a></li>
              <li><a href="/#features">AI Preparation</a></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Account</h4>
            <ul className="footer-links">
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><Link to="/dashboard">Overview</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Resources</h4>
            <ul className="footer-links">
              <li><a href="/#how-it-works">How It Works</a></li>
              <li><a href="#docs">Documentation</a></li>
              <li><a href="#api">API Health Check</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} InterviewAI. All rights reserved.</p>
          <p>Built with React, Vite, Node.js, Express & MongoDB.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
