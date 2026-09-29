import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HealthStatusBadge from './HealthStatusBadge';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isAdminActive = () => {
    return location.pathname.startsWith('/admin');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand-logo">
          <div className="brand-icon">⚡</div>
          <span>Interview<span className="gradient-text">AI</span></span>
        </Link>

        <ul className="nav-links">
          {!isAuthenticated && (
            <>
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
            </>
          )}
          {isAuthenticated && (
            <>
              <li>
                <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/questions" className={`nav-link ${location.pathname.startsWith('/questions') ? 'active' : ''}`}>
                  Questions
                </Link>
              </li>
              <li>
                <Link to="/assessments" className={`nav-link ${location.pathname.startsWith('/assessments') ? 'active' : ''}`}>
                  Assessments
                </Link>
              </li>
              <li>
                <Link to="/attempts" className={`nav-link ${location.pathname === '/attempts' ? 'active' : ''}`}>
                  Attempts
                </Link>
              </li>
              {user?.role === 'ADMIN' && (
                <>
                  <li>
                    <Link to="/admin/dashboard" className={`nav-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
                      Admin Dashboard
                    </Link>
                  </li>
                  <li style={{ position: 'relative' }}>
                    <button
                      onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                      className={`nav-link ${isAdminActive() ? 'active' : ''}`}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.95rem'
                      }}
                    >
                      Admin
                      <span style={{ fontSize: '0.7rem' }}>▼</span>
                    </button>
                    {adminDropdownOpen && (
                      <ul style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        minWidth: '180px',
                        marginTop: '0.5rem',
                        padding: '0.5rem 0',
                        listStyle: 'none',
                        zIndex: 1000,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                      }}>
                        <li>
                          <Link
                            to="/admin/questions"
                            className="nav-link"
                            onClick={() => setAdminDropdownOpen(false)}
                            style={{
                              display: 'block',
                              padding: '0.6rem 1rem',
                              fontSize: '0.9rem',
                              borderRadius: '0',
                              backgroundColor: location.pathname === '/admin/questions' ? 'rgba(139, 92, 246, 0.1)' : 'transparent'
                            }}
                          >
                            Questions
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/admin/assessments"
                            className="nav-link"
                            onClick={() => setAdminDropdownOpen(false)}
                            style={{
                              display: 'block',
                              padding: '0.6rem 1rem',
                              fontSize: '0.9rem',
                              borderRadius: '0',
                              backgroundColor: location.pathname === '/admin/assessments' ? 'rgba(139, 92, 246, 0.1)' : 'transparent'
                            }}
                          >
                            Assessments
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/admin/attempts"
                            className="nav-link"
                            onClick={() => setAdminDropdownOpen(false)}
                            style={{
                              display: 'block',
                              padding: '0.6rem 1rem',
                              fontSize: '0.9rem',
                              borderRadius: '0',
                              backgroundColor: location.pathname === '/admin/attempts' ? 'rgba(139, 92, 246, 0.1)' : 'transparent'
                            }}
                          >
                            Attempts
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                </>
              )}
              <li>
                <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
                  Profile
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="nav-actions">
          <HealthStatusBadge />
          
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>
                <span>👤 {user?.name || 'User'}</span>
                {user?.role === 'ADMIN' && (
                  <span style={{
                    fontSize: '0.65rem',
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#fca5a5',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '4px',
                    fontWeight: 700
                  }}>
                    ADMIN
                  </span>
                )}
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.85rem' }}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
