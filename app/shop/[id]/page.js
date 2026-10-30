'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ShoppingCart,
  Star,
  Check,
  Truck,
  ShieldCheck,
  Wrench,
  RotateCcw,
  Minus,
  Plus,
  ArrowRight,
  Share2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          setRelated(data.related || []);
          setSelectedSize(data.product.size || 'Standard');
        } else {
          setError(data.error || 'Product not found');
        }
      } catch (err) {
        setError('Error loading product information');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-orange)' }}>
            Loading Product Information...
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px' }}>Product Not Found</h2>
        <p style={{ color: 'var(--secondary-text)', marginBottom: '24px' }}>
          The bicycle or accessory you requested is no longer available in our showroom inventory.
        </p>
        <Link href="/shop" className="btn-primary">
          Browse All Bicycles
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80'];

  const discountPercent =
    product.discount ||
    (product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0);

  const isOutOfStock = product.stock <= 0 || product.isAvailable === false;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '36px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', marginBottom: '24px' }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Home
          </Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link href="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>
            Shop
          </Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link
            href={`/shop?category=${encodeURIComponent(product.category)}`}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {product.category}
          </Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--primary-orange)', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Product Details Main Box */}
        <div
          className="card"
          style={{
            backgroundColor: '#FFFFFF',
            padding: '36px',
            marginBottom: '48px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
            }}
          >
            {/* Left: Product Images Gallery */}
            <div>
              {/* Main Display Image */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '75%',
                  backgroundColor: '#F5F5F4',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  marginBottom: '16px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {discountPercent > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      backgroundColor: 'var(--primary-orange)',
                      color: '#FFF',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                    }}
                  >
                    {discountPercent}% SAVINGS
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        border: selectedImage === idx ? '2px solid var(--primary-orange)' : '1px solid var(--border-color)',
                        padding: 0,
                      }}
                    >
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Buy Info */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: 'var(--primary-orange)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {product.brand}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--secondary-text)' }}>
                  Category: <strong>{product.category}</strong>
                </span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                  fontWeight: 800,
                  color: 'var(--primary-text)',
                  lineHeight: 1.25,
                  marginBottom: '12px',
                }}
              >
                {product.name}
              </h1>

              {/* Ratings */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', color: '#F59E0B' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={17}
                      fill={i < Math.floor(product.rating || 4.8) ? '#F59E0B' : 'none'}
                      color="#F59E0B"
                    />
                  ))}
                </div>
                <span style={{ fontWeight: 700, color: 'var(--primary-text)', fontSize: '0.95rem' }}>
                  {product.rating || 4.8}
                </span>
                <span style={{ color: 'var(--secondary-text)', fontSize: '0.85rem' }}>
                  ({product.reviewCount || 12} Customer Reviews)
                </span>
              </div>

              {/* Price Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '12px',
                  padding: '16px 20px',
                  backgroundColor: 'var(--bg-light-orange)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                }}
              >
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-text)' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <span
                    style={{
                      fontSize: '1.1rem',
                      color: 'var(--secondary-text)',
                      textDecoration: 'line-through',
                    }}
                  >
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span style={{ marginLeft: 'auto', fontSize: '0.85rem', fontWeight: 700, color: isOutOfStock ? '#EF4444' : '#16A34A' }}>
                  {isOutOfStock ? 'Sold Out' : `In Stock (${product.stock} units)`}
                </span>
              </div>

              {/* Description */}
              <p style={{ color: 'var(--secondary-text)', lineHeight: 1.7, marginBottom: '24px' }}>
                {product.description}
              </p>

              {/* Size Selector */}
              {product.size && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-text)', display: 'block', marginBottom: '8px' }}>
                    Frame / Wheel Size:
                  </label>
                  <div style={{ display: 'inline-block', padding: '8px 16px', border: '1.5px solid var(--primary-orange)', borderRadius: '6px', fontWeight: 600, backgroundColor: 'var(--bg-light-orange)', color: 'var(--primary-orange)' }}>
                    {selectedSize}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart Row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '28px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ padding: '12px 16px', backgroundColor: '#F5F5F4' }}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ padding: '0 20px', fontWeight: 700, fontSize: '1rem' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                    style={{ padding: '12px 16px', backgroundColor: '#F5F5F4' }}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '14px 28px',
                    fontSize: '1rem',
                    backgroundColor: added ? '#16A34A' : isOutOfStock ? '#D6D3D1' : 'var(--primary-orange)',
                    cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  }}
                >
                  {added ? (
                    <>
                      <Check size={20} /> Added to Cart!
                    </>
                  ) : isOutOfStock ? (
                    'Out of Stock'
                  ) : (
                    <>
                      <ShoppingCart size={20} /> Add to Cart (₹{(product.price * quantity).toLocaleString('en-IN')})
                    </>
                  )}
                </button>
              </div>

              {/* Key Assurance Points */}
              <div
                style={{
                  borderTop: '1px solid #E7E5E4',
                  paddingTop: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  fontSize: '0.88rem',
                  color: 'var(--secondary-text)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={17} color="var(--primary-orange)" />
                  <span><strong>Doorstep Delivery:</strong> Calculated at checkout based on distance. 95% pre-assembled.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={17} color="var(--primary-orange)" />
                  <span><strong>Warranty:</strong> {product.warranty || '1 Year Frame Warranty, 6 Months Parts.'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wrench size={17} color="var(--primary-orange)" />
                  <span><strong>Authorized Workshop:</strong> Certified repair and lifetime technical assistance in Kazipet.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Section */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div style={{ marginTop: '48px', borderTop: '1px solid var(--border-color)', paddingTop: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', color: 'var(--primary-text)' }}>
                Technical Specifications
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '12px',
                }}
              >
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      backgroundColor: 'var(--bg-main)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.9rem',
                    }}
                  >
                    <span style={{ fontWeight: 700, color: 'var(--primary-text)' }}>{key}:</span>
                    <span style={{ color: 'var(--secondary-text)' }}>{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <span className="badge-orange">MORE CHOICES</span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-text)' }}>
                  Similar Bicycles in {product.category}
                </h2>
              </div>
              <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="btn-secondary">
                View All
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px',
              }}
            >
              {related.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
