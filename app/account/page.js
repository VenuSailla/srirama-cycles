'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, LogOut, Clock, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setOrders(data.orders || []);
          }
        })
        .catch((err) => console.warn('Could not load customer orders', err))
        .finally(() => setLoadingOrders(false));
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading your profile...</div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Profile Header Card */}
        <div
          className="card"
          style={{
            padding: '32px',
            backgroundColor: '#FFFFFF',
            marginBottom: '32px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-light-orange)',
                color: 'var(--primary-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.6rem',
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-text)' }}>
                {user.name}
              </h1>
              <div style={{ color: 'var(--secondary-text)', fontSize: '0.9rem' }}>
                {user.email} {user.phone && `• ${user.phone}`}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={async () => {
                await logout();
                router.push('/login');
              }}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EF4444' }}
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* My Orders Section */}
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-text)', marginBottom: '18px' }}>
            My Orders ({orders.length})
          </h2>

          {loadingOrders ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
              Loading your previous orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="card" style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
              <Package size={44} color="var(--primary-orange)" style={{ margin: '0 auto 16px', opacity: 0.6 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>No Orders Placed Yet</h3>
              <p style={{ color: 'var(--secondary-text)', marginBottom: '20px' }}>
                You haven’t ordered any bicycles yet. Browse our current stock!
              </p>
              <Link href="/shop" className="btn-primary">
                Explore Catalog
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((ord) => (
                <div key={ord._id} className="card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                      borderBottom: '1px solid #F5F5F4',
                      paddingBottom: '14px',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--secondary-text)' }}>Order ID:</div>
                      <div style={{ fontWeight: 800, color: 'var(--primary-orange)', fontSize: '1.1rem' }}>
                        {ord.orderId}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--secondary-text)' }}>Date:</div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--secondary-text)' }}>Status:</div>
                      <span
                        style={{
                          backgroundColor:
                            ord.orderStatus === 'Delivered'
                              ? '#DCFCE7'
                              : ord.orderStatus === 'Cancelled'
                              ? '#FEE2E2'
                              : 'var(--bg-light-orange)',
                          color:
                            ord.orderStatus === 'Delivered'
                              ? '#15803D'
                              : ord.orderStatus === 'Cancelled'
                              ? '#B91C1C'
                              : 'var(--primary-orange)',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                        }}
                      >
                        {ord.orderStatus}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--secondary-text)' }}>Total:</div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>₹{ord.total.toLocaleString('en-IN')}</div>
                    </div>

                    <Link
                      href={`/track-order?orderId=${ord.orderId}&contact=${encodeURIComponent(user.phone || user.email)}`}
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                    >
                      <span>Track Order</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* Items List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {ord.items?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--primary-text)' }}>
                          {item.name} <span style={{ color: 'var(--secondary-text)' }}>x{item.quantity}</span>
                        </span>
                        <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
