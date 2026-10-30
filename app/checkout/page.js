'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle,
  Truck,
  ArrowRight,
  AlertCircle,
  Clock,
  Package,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, shippingCost, cartTotal, clearCart, isLoaded } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || 'Kazipet / Hanumakonda',
    state: user?.address?.state || 'Telangana',
    pincode: user?.address?.pincode || '506003',
    paymentMethod: 'Cash on Delivery',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  if (!isLoaded) {
    return <div style={{ minHeight: '60vh', padding: '60px', textAlign: 'center' }}>Loading checkout...</div>;
  }

  if (cart.length === 0 && !placedOrder) {
    return (
      <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '80px 20px' }}>
        <div className="container" style={{ maxWidth: '540px', textAlign: 'center' }}>
          <div className="card" style={{ padding: '48px 30px', backgroundColor: '#FFFFFF' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '12px' }}>Your Cart is Empty</h2>
            <p style={{ color: 'var(--secondary-text)', marginBottom: '24px' }}>
              Add a bicycle or genuine accessories before proceeding to checkout.
            </p>
            <Link href="/shop" className="btn-primary">
              Shop Bicycles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        items: cart,
        paymentMethod: formData.paymentMethod,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setPlacedOrder(data.order);
        clearCart();
      } else {
        setError(data.error || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      setError('Network connection error while placing order.');
    } finally {
      setSubmitting(false);
    }
  };

  // Order Success Screen
  if (placedOrder) {
    return (
      <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '60px 20px 100px' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <div
            className="card"
            style={{
              padding: '48px 36px',
              backgroundColor: '#FFFFFF',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'rgba(22, 163, 74, 0.12)',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <CheckCircle size={44} />
            </div>

            <span className="badge-orange" style={{ marginBottom: '8px' }}>
              ORDER CONFIRMED
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-text)', marginBottom: '8px' }}>
              Thank You for Your Order!
            </h1>
            <p style={{ color: 'var(--secondary-text)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '28px' }}>
              Your bicycle order has been saved successfully in our MongoDB system. Our team at Kazipet will inspect and prepare your cycle for dispatch.
            </p>

            <div
              style={{
                backgroundColor: 'var(--bg-light-orange)',
                border: '1.5px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                marginBottom: '32px',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--secondary-text)', fontSize: '0.9rem' }}>Order ID:</span>
                <span style={{ fontWeight: 800, color: 'var(--primary-orange)', fontSize: '1.1rem' }}>
                  {placedOrder.orderId}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--secondary-text)', fontSize: '0.9rem' }}>Customer Name:</span>
                <span style={{ fontWeight: 700, color: 'var(--primary-text)' }}>
                  {placedOrder.customer.name}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--secondary-text)', fontSize: '0.9rem' }}>Registered Contact:</span>
                <span style={{ fontWeight: 600, color: 'var(--primary-text)' }}>
                  {placedOrder.customer.phone} • {placedOrder.customer.email}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--secondary-text)', fontSize: '0.9rem' }}>Payment Method:</span>
                <span style={{ fontWeight: 700, color: '#16A34A' }}>
                  {placedOrder.paymentMethod} (Pay ₹{placedOrder.total.toLocaleString('en-IN')} upon delivery)
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <span style={{ fontWeight: 800, color: 'var(--primary-text)' }}>Total Amount:</span>
                <span style={{ fontWeight: 800, color: 'var(--primary-text)', fontSize: '1.2rem' }}>
                  ₹{placedOrder.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
              <Link
                href={`/track-order?orderId=${placedOrder.orderId}&contact=${encodeURIComponent(placedOrder.customer.phone)}`}
                className="btn-primary"
                style={{ padding: '14px 28px' }}
              >
                <Package size={18} />
                <span>Track Order Status</span>
              </Link>
              <Link href="/shop" className="btn-secondary" style={{ padding: '14px 28px' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-text)', letterSpacing: '-0.02em' }}>
            Doorstep Delivery Checkout
          </h1>
          <p style={{ color: 'var(--secondary-text)' }}>
            Enter your delivery information. We inspect and 95% pre-assemble every cycle before dispatch.
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#FEF2F2',
              color: '#B91C1C',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              border: '1px solid #FECACA',
            }}
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 380px',
              gap: '32px',
            }}
            className="checkout-layout"
          >
            {/* Left: Shipping & Contact Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Customer Information Box */}
              <div className="card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', color: 'var(--primary-text)' }}>
                  1. Contact Information
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-2col">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

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
                  <span style={{ fontSize: '0.78rem', color: 'var(--secondary-text)' }}>
                    We send order status updates and digital invoice to this email.
                  </span>
                </div>
              </div>

              {/* Delivery Address Box */}
              <div className="card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', color: 'var(--primary-text)' }}>
                  2. Delivery Address
                </h3>

                <div className="form-group">
                  <label className="form-label">Street / House / Landmark *</label>
                  <input
                    type="text"
                    name="street"
                    required
                    placeholder="Flat / House No., Street, Colony, Landmark"
                    value={formData.street}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }} className="grid-3col">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      placeholder="506003"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Box */}
              <div className="card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', color: 'var(--primary-text)' }}>
                  3. Payment Method
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      border: formData.paymentMethod === 'Cash on Delivery' ? '2px solid var(--primary-orange)' : '1px solid var(--border-color)',
                      backgroundColor: formData.paymentMethod === 'Cash on Delivery' ? 'var(--bg-light-orange)' : '#FFFFFF',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={formData.paymentMethod === 'Cash on Delivery'}
                      onChange={handleChange}
                      style={{ accentColor: 'var(--primary-orange)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--primary-text)' }}>
                        Cash on Delivery (Recommended)
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--secondary-text)' }}>
                        Inspect your bicycle at doorstep delivery and pay by Cash, UPI, or Card to delivery executive.
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #E7E5E4',
                      backgroundColor: '#FAFAF9',
                      opacity: 0.7,
                      cursor: 'not-allowed',
                    }}
                  >
                    <input type="radio" disabled />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--secondary-text)' }}>
                        Online Card / NetBanking Payment (Payment Gateway Coming Soon)
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#A8A29E' }}>
                        Please use Cash on Delivery for instant dispatch verification.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary Confirmation */}
            <div>
              <div
                className="card"
                style={{
                  padding: '28px',
                  backgroundColor: '#FFFFFF',
                  position: 'sticky',
                  top: '96px',
                }}
              >
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '18px', color: 'var(--primary-text)' }}>
                  Items in Order ({cart.length})
                </h3>

                <div
                  style={{
                    maxHeight: '260px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    marginBottom: '20px',
                    borderBottom: '1px solid #F5F5F4',
                    paddingBottom: '16px',
                  }}
                >
                  {cart.map((item) => (
                    <div key={`${item._id}-${item.selectedSize}`} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=150&q=80'}
                        alt={item.name}
                        style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--secondary-text)' }}>
                          Qty: {item.quantity} • {item.selectedSize}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary-text)' }}>
                    <span>Items Subtotal</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary-text)' }}>
                      ₹{cartSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary-text)' }}>
                    <span>Doorstep Delivery</span>
                    <span style={{ fontWeight: 700, color: shippingCost === 0 ? '#16A34A' : 'var(--primary-text)' }}>
                      {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                    </span>
                  </div>

                  <div
                    style={{
                      borderTop: '1.5px solid var(--border-color)',
                      paddingTop: '14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Total Payable:</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-orange)' }}>
                      ₹{cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}
                >
                  {submitting ? 'Placing Order in MongoDB...' : 'Place Order (Cash on Delivery)'}
                </button>

                <div style={{ marginTop: '16px', fontSize: '0.78rem', color: 'var(--secondary-text)', textAlign: 'center' }}>
                  🔒 Secure checkout with database price & stock validation.
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        @media (max-width: 860px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
          }
          .grid-2col, .grid-3col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
