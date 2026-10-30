'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminIndexPage() {
  const router = useRouter();
  const { admin, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (admin) {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/admin/login');
      }
    }
  }, [admin, loading, router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFF7ED',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#EA580C',
        fontWeight: 700,
        fontSize: '1.1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            border: '3px solid #FED7AA',
            borderTopColor: '#EA580C',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span>Directing to Sri Rama Cycles CMS Admin Panel...</span>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
