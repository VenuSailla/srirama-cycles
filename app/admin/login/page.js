'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { admin, adminLogin } = useAuth();

  const [email, setEmail] = useState('saillavenu012@gmail.com');
  const [password, setPassword] = useState('12345678');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (admin) {
      router.push('/admin/dashboard');
    }
  }, [admin, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await adminLogin(email, password);
      if (res.success) {
        router.push('/admin/dashboard');
      } else {
        setError(res.error || 'Invalid administrator credentials');
      }
    } catch (err) {
      setError('Connection failure communicating with authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#FFF7ED',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '460px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '2px solid #FED7AA',
            padding: '44px 36px',
            color: '#292524',
            boxShadow: '0 20px 45px rgba(249, 115, 22, 0.12)',
          }}
        >
          {/* Brand Mark */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
              <img
                src="/logo.png"
                alt="Sri Rama Cycles"
                style={{
                  height: '62px',
                  width: 'auto',
                  objectFit: 'contain',
                  margin: '0 auto 16px',
                  display: 'block',
                }}
              />
            </Link>

            <span
              style={{
                backgroundColor: '#FFEDD5',
                color: '#EA580C',
                padding: '5px 14px',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid #FED7AA',
              }}
            >
              <Sparkles size={13} color="#EA580C" />
              <span>CMS CONTROL PANEL</span>
            </span>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#1C1917', marginTop: '10px', letterSpacing: '-0.02em' }}>
              Administrator Sign In
            </h1>
            <p style={{ color: '#78716C', fontSize: '0.9rem', marginTop: '6px' }}>
              Sri Rama Cycle Store & Auto Spares Management System
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.88rem',
                border: '1.5px solid #FECACA',
                fontWeight: 600,
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.86rem',
                  fontWeight: 750,
                  color: '#334155',
                  marginBottom: '6px',
                }}
              >
                Administrator Email *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sriramacycles.com"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    borderRadius: '12px',
                    border: '1.5px solid #FED7AA',
                    fontSize: '0.94rem',
                    outline: 'none',
                    backgroundColor: '#FFFDF9',
                    color: '#1E293B',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#F97316';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#FED7AA';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <Mail
                  size={17}
                  color="#94A3B8"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.86rem',
                  fontWeight: 750,
                  color: '#334155',
                  marginBottom: '6px',
                }}
              >
                Master Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    borderRadius: '12px',
                    border: '1.5px solid #FED7AA',
                    fontSize: '0.94rem',
                    outline: 'none',
                    backgroundColor: '#FFFDF9',
                    color: '#1E293B',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#F97316';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#FED7AA';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <Lock
                  size={17}
                  color="#94A3B8"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#EA580C',
                color: '#FFFFFF',
                fontSize: '1rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#C2410C';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#EA580C';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {loading ? (
                <span>Authenticating with Database...</span>
              ) : (
                <>
                  <span>Access CMS Dashboard</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div
            style={{
              marginTop: '26px',
              paddingTop: '20px',
              borderTop: '1px solid #FED7AA',
              textAlign: 'center',
              fontSize: '0.84rem',
              color: '#78716C',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <ShieldCheck size={15} color="#16A34A" />
              <span>Protected CMS route. All access events are audited.</span>
            </div>
            <Link
              href="/"
              style={{
                color: '#EA580C',
                fontWeight: 700,
                display: 'inline-block',
                marginTop: '12px',
                textDecoration: 'none',
              }}
            >
              ← Return to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
