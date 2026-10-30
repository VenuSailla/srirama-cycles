'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, Check, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const imageSrc =
    product.images?.[0] ||
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80';

  const discountPercent =
    product.discount ||
    (product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0);

  const isOutOfStock = product.stock <= 0 || product.isAvailable === false;

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Product Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '72%',
          overflow: 'hidden',
          backgroundColor: '#F5F5F4',
        }}
      >
        <Link href={`/shop/${product._id || product.slug}`} style={{ display: 'block' }}>
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </Link>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: 'var(--primary-orange)',
              color: '#FFFFFF',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '4px 8px',
              borderRadius: '6px',
              boxShadow: '0 2px 6px rgba(249, 115, 22, 0.4)',
            }}
          >
            {discountPercent}% OFF
          </span>
        )}

        {/* Stock / Featured Badge */}
        {isOutOfStock ? (
          <span
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: '#EF4444',
              color: '#FFF',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '4px 8px',
              borderRadius: '6px',
            }}
          >
            Out of Stock
          </span>
        ) : product.isFeatured ? (
          <span
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'var(--primary-text)',
              color: '#FED7AA',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '4px 8px',
              borderRadius: '6px',
            }}
          >
            Featured
          </span>
        ) : null}
      </div>

      {/* Card Body */}
      <div
        style={{
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Brand and Category Line */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.78rem',
            marginBottom: '6px',
          }}
        >
          <span style={{ fontWeight: 700, color: 'var(--primary-orange)', textTransform: 'uppercase' }}>
            {product.brand}
          </span>
          <span style={{ color: 'var(--secondary-text)' }}>{product.category}</span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.02rem',
            fontWeight: 700,
            lineHeight: 1.35,
            color: 'var(--primary-text)',
            marginBottom: '8px',
            minHeight: '2.7em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          <Link
            href={`/shop/${product._id || product.slug}`}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {product.name}
          </Link>
        </h3>

        {/* Star Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', color: '#F59E0B' }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(product.rating || 4.8) ? '#F59E0B' : 'none'}
                color="#F59E0B"
              />
            ))}
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-text)' }}>
            {product.rating || 4.8}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--secondary-text)' }}>
            ({product.reviewCount || 12})
          </span>
        </div>

        {/* Price Section */}
        <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #F5F5F4' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-text)' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--secondary-text)',
                  textDecoration: 'line-through',
                }}
              >
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 44px', gap: '8px' }}>
            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              style={{
                backgroundColor: isOutOfStock
                  ? '#D6D3D1'
                  : added
                  ? '#16A34A'
                  : 'var(--primary-orange)',
                color: '#FFFFFF',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                transition: 'var(--transition)',
              }}
            >
              {added ? (
                <>
                  <Check size={16} /> Added!
                </>
              ) : isOutOfStock ? (
                'Sold Out'
              ) : (
                <>
                  <ShoppingCart size={16} /> Add to Cart
                </>
              )}
            </button>

            <Link
              href={`/shop/${product._id || product.slug}`}
              aria-label={`View details for ${product.name}`}
              style={{
                border: '1.5px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-text)',
                backgroundColor: '#FFFFFF',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-orange)';
                e.currentTarget.style.color = 'var(--primary-orange)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--primary-text)';
              }}
            >
              <Eye size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
