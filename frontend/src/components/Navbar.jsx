import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import HealthStatusBadge from './HealthStatusBadge';

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand-logo">
          <div className="brand-icon">⚡</div>
          <span>Interview<span className="gradient-text">AI</span></span>
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li>
            <a href="/#features" className="nav-link">
              Features
            </a>
          </li>
          <li>
            <a href="/#how-it-works" className="nav-link">
              How It Works
            </a>
          </li>
          <li>
            <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
              Dashboard
            </Link>
          </li>
        </ul>

        <div className="nav-actions">
          <HealthStatusBadge />
          <Link to="/login" className="btn btn-outline">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
