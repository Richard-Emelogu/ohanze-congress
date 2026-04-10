import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminAuth.css';
import { API_URL } from '../utils/apiUrl';

export default function AdminRegister() {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '',
    reason: '', password: '', confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          reason: form.reason,
          password: form.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Unable to connect. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="auth-page">
        <div className="auth-bg-orb auth-bg-orb-1" />
        <div className="auth-bg-orb auth-bg-orb-2" />
        <div className="auth-success-card">
          <div className="auth-success-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2>Application submitted</h2>
          <p>
            Your request has been received. The administrator will review it
            and you'll be notified once a decision has been made.
          </p>
          <Link to="/admin/login" className="auth-submit-btn" style={{ display:'inline-flex', width:'auto', padding:'0.85rem 2rem' }}>
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />
      <div className="auth-bg-orb auth-bg-orb-3" />

      <div className="auth-card auth-card--wide">
        <div className="auth-card-side">
          <div className="auth-side-pattern" />
          <div className="auth-side-grid" />
          <div className="auth-side-inner">
            <div className="auth-logo-ring">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6l-9-4z"/>
              </svg>
            </div>
            <h2>August 93 Club</h2>
            <p>Ohanze Congress</p>
            <div className="auth-side-divider" />
            <div className="auth-side-steps">
              <div className="auth-side-step">
                <span>1</span>
                <p>Fill in your details below</p>
              </div>
              <div className="auth-side-step">
                <span>2</span>
                <p>Submit your application</p>
              </div>
              <div className="auth-side-step">
                <span>3</span>
                <p>Await admin approval</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-card-main">
          <div className="auth-header">
            <h1>Apply for access</h1>
            <p>Your application will be reviewed before access is granted</p>
          </div>

          {error && (
            <div className="auth-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field-row">
              <div className="auth-field">
                <label htmlFor="fullName">Full name</label>
                <div className="auth-input-wrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input type="text" id="fullName" name="fullName" value={form.fullName}
                    onChange={handleChange} placeholder="Your full name" required />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="phone">Phone number</label>
                <div className="auth-input-wrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <input type="tel" id="phone" name="phone" value={form.phone}
                    onChange={handleChange} placeholder="+234 000 000 0000" />
                </div>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="reg-email">Email address</label>
              <div className="auth-input-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input type="email" id="reg-email" name="email" value={form.email}
                  onChange={handleChange} placeholder="your@email.com" required autoComplete="email" />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="reason">Why do you need admin access?</label>
              <textarea id="reason" name="reason" value={form.reason}
                onChange={handleChange} rows={3} required className="auth-textarea"
                placeholder="Explain your role in the club and why you need access..." />
            </div>

            <div className="auth-field-row">
              <div className="auth-field">
                <label htmlFor="reg-password">Password</label>
                <div className="auth-input-wrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input type="password" id="reg-password" name="password" value={form.password}
                    onChange={handleChange} placeholder="Min. 6 characters" required autoComplete="new-password" />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="confirmPassword">Confirm password</label>
                <div className="auth-input-wrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input type="password" id="confirmPassword" name="confirmPassword" value={form.confirmPassword}
                    onChange={handleChange} placeholder="Repeat password" required autoComplete="new-password" />
                </div>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <><span className="auth-spinner" />Submitting...</>
              ) : (
                <>Submit Application
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have access?</p>
            <Link to="/admin/login" className="auth-switch-btn">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}