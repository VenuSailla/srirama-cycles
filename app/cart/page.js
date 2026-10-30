'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    shippingCost,
    shippingThreshold,
    cartTotal,
    cartItemCount,
    isLoaded,
  } = useCart();

  if (!isLoaded) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading Cart...</div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '80px 20px' }}>
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <div
            className="card"
            style={{
              padding: '60px 30px',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-light-orange)',
                color: 'var(--primary-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <ShoppingBag size={36} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>Your Cart is Empty</h2>
            <p style={{ color: 'var(--secondary-text)', lineHeight: 1.6, marginBottom: '28px' }}>
              Looks like you haven't selected any bicycles or spare parts yet. Explore our high-performance models and genuine auto spares!
            </p>
            <Link href="/shop" className="btn-primary" style={{ padding: '14px 28px' }}>
              <span>Explore Bicycles</span>
              <ArrowRight size={18} />
            </Link>
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
            Shopping Cart ({cartItemCount} {cartItemCount === 1 ? 'item' : 'items'})
          </h1>
          <p style={{ color: 'var(--secondary-text)' }}>
            Review your chosen rides and auto spares before proceeding to doorstep delivery checkout.
          </p>
        </div>

        {/* Cart Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 360px',
            gap: '32px',
          }}
          className="cart-layout"
        >
          {/* Left: Items Table / Cards */}
          <div>
            <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E7E5E4', paddingBottom: '12px' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary-text)' }}>Selected Items</span>
                <button
                  onClick={clearCart}
                  style={{ fontSize: '0.82rem', color: '#EF4444', fontWeight: 600 }}
                >
                  Clear Cart
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {cart.map((item) => (
                  <div
                    key={`${item._id}-${item.selectedSize}`}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '16px',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #F5F5F4',
                      paddingBottom: '18px',
                    }}
                  >
                    {/* Thumbnail & Title */}
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flex: 1, minWidth: '240px' }}>
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=300&q=80'}
                        alt={item.name}
                        style={{
                          width: '74px',
                          height: '74px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          backgroundColor: '#F5F5F4',
                          border: '1px solid var(--border-color)',
                        }}
                      />
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-orange)', textTransform: 'uppercase' }}>
                          {item.brand}
                        </div>
                        <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--primary-text)', margin: '2px 0 4px' }}>
                          <Link href={`/shop/${item._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {item.name}
                          </Link>
                        </h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--secondary-text)' }}>
                          Size: {item.selectedSize}
                        </div>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div style={{ minWidth: '100px', textAlign: 'right' }}>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-text)' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--secondary-text)' }}>
                        ₹{item.price.toLocaleString('en-IN')} each
                      </div>
                    </div>

                    {/* Quantity Selector & Remove */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          overflow: 'hidden',
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1, item.selectedSize)}
                          style={{ padding: '6px 10px', backgroundColor: '#F5F5F4' }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ padding: '0 12px', fontSize: '0.9rem', fontWeight: 700 }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1, item.selectedSize)}
                          style={{ padding: '6px 10px', backgroundColor: '#F5F5F4' }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id, item.selectedSize)}
                        style={{ color: '#EF4444', padding: '6px' }}
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shopping Assurance Box */}
            <div
              className="card"
              style={{
                padding: '18px 24px',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <Truck size={24} color="var(--primary-orange)" />
              <div style={{ fontSize: '0.88rem', color: 'var(--secondary-text)' }}>
                <strong>95% Pre-Assembled Cycles:</strong> Delivered ready to ride with official warranty card & Sri Rama Cycles showroom invoice.
              </div>
            </div>
          </div>

          {/* Right: Order Summary Box */}
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-text)', marginBottom: '20px' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary-text)' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary-text)' }}>
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary-text)' }}>
                  <span>Doorstep Delivery</span>
                  <span style={{ fontWeight: 700, color: shippingCost === 0 ? '#16A34A' : 'var(--primary-text)' }}>
                    {shippingCost === 0 ? 'FREE (Orders > ₹20,000)' : `₹${shippingCost}`}
                  </span>
                </div>

                {cartSubtotal < shippingThreshold && (
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--primary-orange)',
                      backgroundColor: 'var(--bg-light-orange)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                    }}
                  >
                    Add ₹{(shippingThreshold - cartSubtotal).toLocaleString('en-IN')} more to unlock Free Doorstep Delivery!
                  </div>
                )}

                <div
                  style={{
                    borderTop: '1.5px solid var(--border-color)',
                    paddingTop: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-text)' }}>Grand Total</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-orange)' }}>
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  marginBottom: '14px',
                }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/shop"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  fontSize: '0.88rem',
                  color: 'var(--secondary-text)',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Continue Shopping
              </Link>

              <div
                style={{
                  marginTop: '24px',
                  borderTop: '1px solid #F5F5F4',
                  paddingTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8rem',
                  color: 'var(--secondary-text)',
                }}
              >
                <ShieldCheck size={16} color="#16A34A" />
                <span>Cash on Delivery & Verified Showroom Invoice Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 860px) {
          .cart-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
