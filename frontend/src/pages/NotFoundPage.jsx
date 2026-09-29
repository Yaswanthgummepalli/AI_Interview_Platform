import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '5rem', fontWeight: '800' }} className="gradient-text">
          404
        </h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '450px', margin: '0 auto 2rem' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="btn btn-primary btn-lg">
          {isAuthenticated ? 'Go to Dashboard' : 'Go Home'}
        </Link>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
