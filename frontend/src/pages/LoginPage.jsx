import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import '../styles/auth.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Authentication will be implemented in Prompt 2!');
  };

  return (
    <Layout>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <span className="placeholder-badge">Prompt 1 - UI Placeholder</span>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to continue your interview prep</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              Sign In
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
