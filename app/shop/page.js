'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  ChevronDown,
  Loader2,
  Tag,
  CheckCircle,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';

const categoriesList = [
  'All',
  'Road Cycles',
  'Mountain Cycles',
  'Ladies Cycles',
  'Disc Brake Cycles',
  'Standard Cycles',
  'Junior Cycles',
  'Kids Cycles',
  'City & Hybrid Cycles',
  'Bicycle Spare Parts and Accessories',
];

const brandsList = [
  'All',
  'Vallabha',
  'Rajanik',
  'Speed',
  'Zeus',
  'Gang',
  'Ralco',
  'Sri Rama Genuine Spares',
  'Srirama City',
  'Srirama Classic',
  'Srirama Gear',
  'Srirama Junior',
  'Srirama Ladies',
  'Srirama Pro',
  'Srirama Trail',
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filters state
  const initialCategory = searchParams.get('category') || 'All';
  const initialBrand = searchParams.get('brand') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'newest';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState(70000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(initialSort);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state if URL search query changes
  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) setSearchTerm(q);
    const cat = searchParams.get('category');
    if (cat !== null) setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrand, priceRange, inStockOnly, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') query.append('category', selectedCategory);
      if (selectedBrand && selectedBrand !== 'All') query.append('brand', selectedBrand);
      if (searchTerm.trim()) query.append('search', searchTerm.trim());
      if (priceRange) query.append('maxPrice', priceRange);
      if (inStockOnly) query.append('inStock', 'true');
      if (sortBy) query.append('sort', sortBy);

      const res = await fetch(`/api/products?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.warn('Error fetching products', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSearchTerm('');
    setPriceRange(70000);
    setInStockOnly(false);
    setSortBy('newest');
    router.push('/shop');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb & Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', marginBottom: '8px' }}>
            <span>Home</span> <span style={{ margin: '0 6px' }}>/</span>{' '}
            <span style={{ color: 'var(--primary-orange)', fontWeight: 600 }}>Shop Catalog</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-text)', letterSpacing: '-0.02em' }}>
                Bicycle Catalog & Spare Parts
              </h1>
              <p style={{ color: 'var(--secondary-text)', fontSize: '0.95rem' }}>
                Discover {products.length} models engineered for high speed, off-road durability, and daily comfort.
              </p>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <SlidersHorizontal size={18} />
              <span>Filters ({[selectedCategory !== 'All', selectedBrand !== 'All', inStockOnly].filter(Boolean).length})</span>
            </button>
          </div>
        </div>

        {/* Top Search & Sorting Bar */}
        <div
          className="card"
          style={{
            padding: '16px 20px',
            marginBottom: '32px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            backgroundColor: '#FFFFFF',
          }}
        >
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '260px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search
                size={18}
                color="var(--secondary-text)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search by bicycle name or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-color)',
                  outline: 'none',
                }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '0 18px', fontSize: '0.9rem' }}>
              Search
            </button>
          </form>

          {/* Sort By Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', fontWeight: 600 }}>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-color)',
                backgroundColor: '#FFFFFF',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popularity">Most Popular / Ratings</option>
            </select>
          </div>
        </div>

        {/* Main Grid: Sidebar Filters + Products List */}
        <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '32px' }} className="shop-grid">
          {/* Desktop Sidebar Filters */}
          <aside className={`shop-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`}>
            <div
              className="card"
              style={{
                padding: '24px',
                backgroundColor: '#FFFFFF',
                position: 'sticky',
                top: '96px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-text)' }}>Filters</h3>
                <button
                  onClick={resetAllFilters}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8rem',
                    color: 'var(--primary-orange)',
                    fontWeight: 700,
                  }}
                >
                  <RotateCcw size={13} /> Reset All
                </button>
              </div>

              {/* 1. Category Filter */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '10px', color: 'var(--primary-text)' }}>
                  Category
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                  {categoriesList.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                          textAlign: 'left',
                          padding: '7px 10px',
                          borderRadius: '6px',
                          fontSize: '0.88rem',
                          fontWeight: isSelected ? 700 : 500,
                          backgroundColor: isSelected ? 'var(--bg-light-orange)' : 'transparent',
                          color: isSelected ? 'var(--primary-orange)' : 'var(--primary-text)',
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Brand Filter */}
              <div style={{ marginBottom: '24px', borderTop: '1px solid #F5F5F4', paddingTop: '18px' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '10px', color: 'var(--primary-text)' }}>
                  Brand
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                  {brandsList.map((brand) => {
                    const isSelected = selectedBrand === brand;
                    return (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        style={{
                          textAlign: 'left',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: isSelected ? 700 : 500,
                          backgroundColor: isSelected ? 'var(--bg-light-orange)' : 'transparent',
                          color: isSelected ? 'var(--primary-orange)' : 'var(--primary-text)',
                        }}
                      >
                        {brand}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Price Filter Slider */}
              <div style={{ marginBottom: '24px', borderTop: '1px solid #F5F5F4', paddingTop: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--primary-text)' }}>Max Price</h4>
                  <span style={{ fontWeight: 800, color: 'var(--primary-orange)' }}>
                    ₹{priceRange.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="70000"
                  step="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary-orange)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--secondary-text)', marginTop: '4px' }}>
                  <span>₹1,000</span>
                  <span>₹70,000</span>
                </div>
              </div>

              {/* 4. Stock Availability Toggle */}
              <div style={{ borderTop: '1px solid #F5F5F4', paddingTop: '18px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    style={{ accentColor: 'var(--primary-orange)', width: '16px', height: '16px' }}
                  />
                  <span>In-Stock Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Listing Grid */}
          <main>
            {loading ? (
              <div
                style={{
                  minHeight: '360px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '14px',
                  color: 'var(--primary-orange)',
                }}
              >
                <Loader2 size={36} className="animate-spin" />
                <div style={{ color: 'var(--primary-text)', fontWeight: 600 }}>Loading Sri Rama Cycles Catalog...</div>
              </div>
            ) : products.length === 0 ? (
              <div
                className="card"
                style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <Tag size={48} color="var(--primary-orange)" style={{ margin: '0 auto 16px', opacity: 0.6 }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>No Bicycles Found</h3>
                <p style={{ color: 'var(--secondary-text)', maxWidth: '400px', margin: '0 auto 20px' }}>
                  We couldn’t find any bicycles matching your active filters. Try broadening your price range or resetting filters.
                </p>
                <button onClick={resetAllFilters} className="btn-primary">
                  <RotateCcw size={16} /> Reset All Filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '24px',
                }}
              >
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .shop-grid {
            grid-template-columns: 1fr !important;
          }
          .shop-sidebar {
            display: none;
          }
          .shop-sidebar.mobile-open {
            display: block !important;
            margin-bottom: 24px;
          }
        }
      `}</style>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading Catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
