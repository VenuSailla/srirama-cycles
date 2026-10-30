'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  AlertCircle,
  Calendar,
  CreditCard,
  Check,
  Loader2,
} from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();

  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
  const [contact, setContact] = useState(searchParams.get('contact') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    fetch('/api/site-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) setSiteSettings(data.settings);
      })
      .catch((err) => console.warn('Track order site settings error', err));
  }, []);

  // Auto-search if query params are present in URL
  useEffect(() => {
    const qOrderId = searchParams.get('orderId');
    const qContact = searchParams.get('contact');
    if (qOrderId && qContact) {
      setOrderId(qOrderId);
      setContact(qContact);
      performTrack(qOrderId, qContact);
    }
  }, [searchParams]);

  const performTrack = async (targetId, targetContact) => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: targetId, contact: targetContact }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrderData(data.order);
      } else {
        setError(data.error || 'Could not verify order details.');
        setOrderData(null);
      }
    } catch (err) {
      setError('Network error while querying order tracking system.');
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!orderId.trim() || !contact.trim()) {
      setError('Please provide both Order ID and registered phone/email.');
      return;
    }
    performTrack(orderId, contact);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '48px 0 80px' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="badge-orange">LIVE SHOWROOM TRACKING</span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-text)', marginBottom: '8px' }}>
            Track Your Bicycle Order
          </h1>
          <p style={{ color: 'var(--secondary-text)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto' }}>
            Enter your Order ID and registered contact information to check your order status.
          </p>
        </div>

        {/* Lookup Card */}
        <div className="card" style={{ padding: '32px', backgroundColor: '#FFFFFF', marginBottom: '36px' }}>
          {siteSettings?.trackOrderNotice && (
            <div
              style={{
                backgroundColor: '#FFF7ED',
                border: '1.5px solid #FED7AA',
                borderRadius: '12px',
                padding: '14px 18px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#9A3412',
                fontSize: '0.88rem',
                lineHeight: 1.5,
              }}
            >
              <Truck size={20} color="#EA580C" style={{ flexShrink: 0 }} />
              <div>
                <strong>Showroom Dispatch Policy:</strong> {siteSettings.trackOrderNotice}
              </div>
            </div>
          )}
          <form onSubmit={handleFormSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }} className="grid-2col">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Order ID *</label>
                <input
                  type="text"
                  placeholder="e.g. SRC-100823"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Registered Mobile or Email *</label>
                <input
                  type="text"
                  placeholder="e.g. +91 95736 53194 or email"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 700 }}
            >
              {loading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Checking Order Status...</span>
                </span>
              ) : (
                <>
                  <Search size={18} />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div
              style={{
                marginTop: '20px',
                backgroundColor: '#FEF2F2',
                color: '#B91C1C',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: '1px solid #FECACA',
                fontSize: '0.92rem',
              }}
            >
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Order Details & Visual Timeline Results */}
        {orderData && (
          <div className="card" style={{ padding: '36px', backgroundColor: '#FFFFFF', animation: 'fadeIn 0.3s ease' }}>
            {/* Top Order Summary Row */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                paddingBottom: '20px',
                borderBottom: '1.5px solid var(--border-color)',
                marginBottom: '28px',
              }}
            >
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--secondary-text)' }}>Order ID:</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-orange)' }}>
                  {orderData.orderId}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--secondary-text)' }}>Order Date:</span>
                <div style={{ fontWeight: 700, color: 'var(--primary-text)' }}>
                  {new Date(orderData.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>

            {/* Visual Timeline (7 Stages) */}
            <div style={{ marginBottom: '36px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-text)', marginBottom: '24px' }}>
                Order Fulfillment Status
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {orderData.timeline?.map((step, idx) => {
                  return (
                    <div key={step.stage} style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                      {/* Step Circle & Connector Line */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: step.completed
                              ? 'var(--primary-orange)'
                              : step.isCurrent
                              ? 'var(--bg-light-orange)'
                              : '#F5F5F4',
                            color: step.completed ? '#FFFFFF' : 'var(--secondary-text)',
                            border: step.isCurrent ? '2px solid var(--primary-orange)' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                          }}
                        >
                          {step.completed ? <Check size={18} /> : idx + 1}
                        </div>
                        {idx < orderData.timeline.length - 1 && (
                          <div
                            style={{
                              width: '2px',
                              height: '36px',
                              backgroundColor: step.completed ? 'var(--primary-orange)' : '#E7E5E4',
                              margin: '4px 0',
                            }}
                          />
                        )}
                      </div>

                      {/* Step Content */}
                      <div style={{ flex: 1, paddingTop: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span
                            style={{
                              fontWeight: step.completed || step.isCurrent ? 800 : 500,
                              color: step.completed || step.isCurrent ? 'var(--primary-text)' : 'var(--secondary-text)',
                              fontSize: '1rem',
                            }}
                          >
                            {step.stage}
                          </span>
                          {step.date && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--secondary-text)' }}>
                              {new Date(step.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>
                        {step.comment && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', marginTop: '2px' }}>
                            {step.comment}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ordered Items & Shipping Info */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '24px',
              }}
              className="grid-2col"
            >
              {/* Ordered Products */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '12px' }}>Products Ordered</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {orderData.items?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--primary-text)', fontWeight: 600 }}>
                        {item.name} <span style={{ color: 'var(--secondary-text)', fontWeight: 400 }}>x{item.quantity}</span>
                      </span>
                      <span style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  <div
                    style={{
                      borderTop: '1px solid #F5F5F4',
                      paddingTop: '8px',
                      marginTop: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 800,
                      color: 'var(--primary-orange)',
                    }}
                  >
                    <span>Total Amount:</span>
                    <span>₹{orderData.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address & Status */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '12px' }}>Delivery Address</h4>
                <div style={{ fontSize: '0.88rem', color: 'var(--secondary-text)', lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary-text)' }}>{orderData.customerName}</div>
                  <div>{orderData.shippingAddress?.street}</div>
                  <div>
                    {orderData.shippingAddress?.city}, {orderData.shippingAddress?.state} - {orderData.shippingAddress?.pincode}
                  </div>
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontWeight: 600 }}>
                    <CreditCard size={15} />
                    <span>Payment: {orderData.paymentMethod} ({orderData.paymentStatus})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 680px) {
          .grid-2col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading Tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
