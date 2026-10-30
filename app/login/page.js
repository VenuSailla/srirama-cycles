'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, Mail, Phone, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, user } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If already logged in, redirect to account
  if (user) {
    router.push('/account');
    return null;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const res = await register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });

        if (res.success) {
          router.push('/account');
        } else {
          setError(res.error || 'Registration failed');
        }
      } else {
        const res = await login(formData.email, formData.password);
        if (res.success) {
          router.push('/account');
        } else {
          setError(res.error || 'Invalid email or password');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '60px 20px 100px' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="card" style={{ padding: '40px 32px', backgroundColor: '#FFFFFF' }}>
          {/* Brand Mark */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img
              src="/logo.png"
              alt="Sri Rama Cycles"
              style={{
                height: '56px',
                width: 'auto',
                objectFit: 'contain',
                margin: '0 auto 16px',
                display: 'block',
              }}
            />
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-text)' }}>
              {isRegister ? 'Create Customer Account' : 'Customer Sign In'}
            </h1>
            <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem', marginTop: '6px' }}>
              {isRegister
                ? 'Join Sri Rama Cycles for fast checkout and doorstep tracking'
                : 'Sign in to access your orders and account details'}
            </p>
          </div>

          {/* Tab Selector */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#F5F5F4',
              borderRadius: 'var(--radius-md)',
              padding: '4px',
              marginBottom: '24px',
            }}
          >
            <button
              onClick={() => {
                setIsRegister(false);
                setError(null);
              }}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.9rem',
                backgroundColor: !isRegister ? '#FFFFFF' : 'transparent',
                color: !isRegister ? 'var(--primary-orange)' : 'var(--secondary-text)',
                boxShadow: !isRegister ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsRegister(true);
                setError(null);
              }}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.9rem',
                backgroundColor: isRegister ? '#FFFFFF' : 'transparent',
                color: isRegister ? 'var(--primary-orange)' : 'var(--secondary-text)',
                boxShadow: isRegister ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Register
            </button>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                color: '#B91C1C',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.88rem',
                border: '1px solid #FECACA',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 95736 53194"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {isRegister && (
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: '1rem', marginTop: '10px' }}
            >
              {loading
                ? 'Validating with Server...'
                : isRegister
                ? 'Create My Account'
                : 'Sign In to Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
