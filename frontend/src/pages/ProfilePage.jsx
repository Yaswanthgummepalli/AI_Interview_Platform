import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { getProfileApi, updateProfileApi, changePasswordApi } from '../services/userService';
import '../styles/dashboard.css';
import '../styles/auth.css';

const ProfilePage = () => {
  const { user, updateUserData } = useAuth();

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    targetRole: user?.targetRole || '',
    experienceLevel: user?.experienceLevel || 'BEGINNER'
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Change Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Sync profile state when user context updates
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        targetRole: user.targetRole || '',
        experienceLevel: user.experienceLevel || 'BEGINNER'
      });
    }
  }, [user]);

  // Fetch latest profile on page mount
  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const res = await getProfileApi();
        if (res && res.success && res.data?.user) {
          updateUserData(res.data.user);
        }
      } catch (err) {
        console.warn('Could not refresh profile from server:', err.message);
      }
    };
    fetchLatestProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
    if (profileSuccess) setProfileSuccess('');
    if (profileError) setProfileError('');
  };

  const handlePasswordChangeInput = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
    if (passwordSuccess) setPasswordSuccess('');
    if (passwordError) setPasswordError('');
  };

  const handleUpdateProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      setProfileError('Name cannot be empty.');
      return;
    }

    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const res = await updateProfileApi({
        name: profileForm.name.trim(),
        targetRole: profileForm.targetRole.trim(),
        experienceLevel: profileForm.experienceLevel
      });

      if (res && res.success && res.data?.user) {
        updateUserData(res.data.user);
        setProfileSuccess('Profile updated successfully!');
      } else {
        setProfileError(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      setProfileError(err.message || 'An error occurred while updating profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('All password fields are required.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError('New password must be different from current password.');
      return;
    }

    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    try {
      const res = await changePasswordApi({
        currentPassword,
        newPassword,
        confirmNewPassword
      });

      if (res && res.success) {
        setPasswordSuccess('Password changed successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
      } else {
        setPasswordError(res.message || 'Failed to change password.');
      }
    } catch (err) {
      setPasswordError(err.message || 'Error changing password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">User Profile</h1>
            <p className="dashboard-subtitle">
              Manage your personal settings, target technical role, and security.
            </p>
          </div>
        </div>

        <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Profile Information & Edit Card */}
          <div
            className="profile-card"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem'
            }}
          >
            <h3 style={{ marginBottom: '1.25rem', fontSize: '1.25rem' }}>⚙️ Edit Profile</h3>

            {profileSuccess && (
              <div
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#6ee7b7',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  marginBottom: '1.25rem'
                }}
              >
                ✅ {profileSuccess}
              </div>
            )}

            {profileError && (
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  marginBottom: '1.25rem'
                }}
              >
                ⚠️ {profileError}
              </div>
            )}

            <form onSubmit={handleUpdateProfileSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email Address (Read-only)</label>
                <input
                  type="email"
                  className="form-input"
                  value={user?.email || ''}
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed', backgroundColor: '#0f172a' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Account Role (Read-only)</label>
                <input
                  type="text"
                  className="form-input"
                  value={user?.role || 'USER'}
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed', backgroundColor: '#0f172a', fontWeight: 600 }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-input"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="targetRole">
                  Target Job Role
                </label>
                <input
                  id="targetRole"
                  name="targetRole"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Full Stack Developer, DevOps Engineer"
                  value={profileForm.targetRole}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="experienceLevel">
                  Experience Level
                </label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  className="form-input"
                  value={profileForm.experienceLevel}
                  onChange={handleProfileChange}
                >
                  <option value="BEGINNER">Beginner (0-2 years)</option>
                  <option value="INTERMEDIATE">Intermediate (2-5 years)</option>
                  <option value="ADVANCED">Advanced (5+ years)</option>
                </select>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Account created on: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={profileLoading}
                style={{ marginTop: '0.75rem' }}
              >
                {profileLoading ? 'Saving Profile...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div
            className="profile-card"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem'
            }}
          >
            <h3 style={{ marginBottom: '1.25rem', fontSize: '1.25rem' }}>🔒 Security & Password</h3>

            {passwordSuccess && (
              <div
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#6ee7b7',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  marginBottom: '1.25rem'
                }}
              >
                ✅ {passwordSuccess}
              </div>
            )}

            {passwordError && (
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  marginBottom: '1.25rem'
                }}
              >
                ⚠️ {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label" htmlFor="currentPassword">
                  Current Password *
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChangeInput}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="newPassword">
                  New Password * (min 6 chars)
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter new password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChangeInput}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmNewPassword">
                  Confirm New Password *
                </label>
                <input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Re-enter new password"
                  value={passwordForm.confirmNewPassword}
                  onChange={handlePasswordChangeInput}
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.25rem 0' }}>
                <input
                  type="checkbox"
                  id="togglePassword"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="togglePassword" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  Show passwords
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-secondary btn-full"
                disabled={passwordLoading}
                style={{ marginTop: '0.75rem' }}
              >
                {passwordLoading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
