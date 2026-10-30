'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  User,
  Phone,
  Clock,
  MapPin,
  ChevronRight,
  Package,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Check,
  Loader2,
  Home,
  Award,
  Truck,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, cartItemCount, cartSubtotal, addToCart, updateQuantity, removeFromCart } = useCart();
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [addedMap, setAddedMap] = useState({});
  const [settings, setSettings] = useState(null);

  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hamburgerBtnRef = useRef(null);

  // Do not show public navbar on admin dashboard pages
  const isAdminPage = pathname.startsWith('/admin');

  useEffect(() => {
    fetch('/api/site-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.warn('Could not fetch settings', err));
  }, []);

  // Close drawers & search dropdown when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
    setCartDrawerOpen(false);
    setSearchFocused(false);
  }, [pathname]);

  // Click outside listener for search dropdown and mobile navigation menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target)
      ) {
        setSearchFocused(false);
      }

      // Close mobile menu if clicked outside both the menu and the hamburger toggle
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        hamburgerBtnRef.current &&
        !hamburgerBtnRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        setCartDrawerOpen(false);
        setSearchFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Debounced live matching product search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}&limit=5`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.products) {
            setSearchResults(data.products);
          } else {
            setSearchResults([]);
          }
        })
        .catch((err) => {
          console.warn('Search query error', err);
          setSearchResults([]);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchFocused(false);
      setMobileMenuOpen(false);
    }
  };

  const handleQuickAddToCart = (e, product) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product, 1, product.size || 'Standard');
    setAddedMap((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product._id]: false }));
    }, 1800);
  };

  if (isAdminPage) {
    return null;
  }

  const navLinks = [
    { name: 'Home', href: '/', icon: Home, subtitle: 'Official Showroom Homepage' },
    { name: 'Shop', href: '/shop', icon: Package, subtitle: 'Bicycles & Auto Spares' },
    { name: 'About Us', href: '/about', icon: Award, subtitle: '50-Year Golden Jubilee' },
    { name: 'Track Order', href: '/track-order', icon: Truck, subtitle: 'Live 7-Stage Tracker' },
    { name: 'Contact Us', href: '/contact', icon: Phone, subtitle: 'Kazipet Store & Workshop', isContact: true },
  ];

  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#FFFFFF', borderBottom: '1px solid #FED7AA', boxShadow: '0 2px 10px rgba(249, 115, 22, 0.06)' }}>
        {/* Top Announcement Bar - Light Orange & Warm Colors */}
        <div
          className="top-announcement-bar"
          style={{
            background: 'linear-gradient(90deg, #FFF7ED 0%, #FFEDD5 50%, #FFF7ED 100%)',
            color: '#7C2D12',
            fontSize: '0.82rem',
            padding: '7px 0',
            borderBottom: '1px solid #FED7AA',
            fontWeight: 500,
          }}
        >
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {settings?.announcementBar && (
                <span
                  style={{
                    backgroundColor: '#EA580C',
                    color: '#FFFFFF',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    letterSpacing: '0.02em',
                  }}
                >
                  📢 {settings.announcementBar}
                </span>
              )}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Phone size={13} color="#EA580C" />
                <a
                  href={`tel:${(settings?.phone || '+91 95736 53194').replace(/\s+/g, '')}`}
                  style={{ color: '#9A3412', textDecoration: 'none', fontWeight: 600 }}
                >
                  {settings?.phone || '+91 95736 53194'}
                </a>
              </span>
              <span className="announcement-opening-hours" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={13} color="#EA580C" />
                <span style={{ color: '#7C2D12' }}>
                  {settings?.openingHoursWeekdays || 'Mon-Sat: 9:00 AM - 8:30 PM | Sun: 9:00 AM - 1:00 PM'}
                </span>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span className="announcement-location" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} color="#EA580C" />
                <span style={{ color: '#7C2D12' }}>Kazipet, Hanumakonda</span>
              </span>
              <span className="announcement-location" style={{ color: '#F97316', fontWeight: 600 }}>•</span>
              <Link href="/track-order" style={{ color: '#EA580C', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 700 }}>
                <Package size={13} />
                <span>Track Order</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="container navbar-container">
          {/* Official Logo (Enlarged & Crisp) */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <img
              src="/logo.png"
              alt="Sri Rama Cycle Store & Auto Spares"
              className="navbar-logo"
            />
          </Link>

          {/* Desktop Navigation Links: Home, Shop, About Us, Track Order, Contact Us */}
          <nav style={{ alignItems: 'center', gap: '26px' }} className="desktop-nav">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isContact = link.href === '/contact' || link.isContact;
              const linkColor = isContact
                ? '#000000'
                : isActive
                ? 'var(--primary-orange)'
                : '#1E293B';

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  style={{
                    fontSize: '1.08rem',
                    fontWeight: isContact ? 800 : isActive ? 800 : 650,
                    color: linkColor,
                    position: 'relative',
                    padding: '8px 4px',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    letterSpacing: '-0.01em',
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#EA580C';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    const indicator = e.currentTarget.querySelector('.nav-hover-bar');
                    if (indicator) {
                      indicator.style.width = '100%';
                      indicator.style.opacity = '1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = linkColor;
                    e.currentTarget.style.transform = 'translateY(0)';
                    const indicator = e.currentTarget.querySelector('.nav-hover-bar');
                    if (indicator) {
                      indicator.style.width = isActive ? '100%' : '0%';
                      indicator.style.opacity = isActive ? '1' : '0';
                    }
                  }}
                >
                  <span>{link.name}</span>
                  {/* Animated Bottom Hover / Active Indicator */}
                  <span
                    className="nav-hover-bar"
                    style={{
                      position: 'absolute',
                      bottom: '0px',
                      left: '0',
                      width: isActive ? '100%' : '0%',
                      opacity: isActive ? 1 : 0,
                      height: '2.5px',
                      backgroundColor: '#EA580C',
                      borderRadius: '2px',
                      transition: 'all 0.22s ease-in-out',
                      pointerEvents: 'none',
                    }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Search Bar Positioned Directly After Contact Us */}
          <div
            ref={searchRef}
            className="desktop-search-container"
            style={{ position: 'relative', flex: '1 1 240px', maxWidth: '300px', minWidth: '180px' }}
          >
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Search cycles, spares..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                style={{
                  width: '100%',
                  padding: '9px 34px 9px 36px',
                  borderRadius: '9999px',
                  border: searchFocused ? '1.5px solid var(--primary-orange)' : '1.5px solid #E2E8F0',
                  backgroundColor: '#F8FAFC',
                  fontSize: '0.86rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: searchFocused ? '0 0 0 3px rgba(249, 115, 22, 0.15)' : 'none',
                }}
              />
              <Search
                size={16}
                color={searchFocused ? 'var(--primary-orange)' : '#64748B'}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              />
              {isSearching ? (
                <Loader2
                  size={15}
                  color="var(--primary-orange)"
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', animation: 'spin 1s linear infinite' }}
                />
              ) : searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    color: '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={14} />
                </button>
              ) : null}
            </form>

            {/* Live Search Matching Results Dropdown with Direct "Add to Cart" */}
            {searchFocused && searchQuery.trim().length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '380px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
                  border: '1px solid #E2E8F0',
                  zIndex: 1000,
                  overflow: 'hidden',
                  animation: 'fadeIn 0.15s ease',
                }}
              >
                <div
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-light-orange)',
                    borderBottom: '1px solid #FED7AA',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--primary-orange)',
                  }}
                >
                  <span>MATCHING PRODUCTS</span>
                  <span>{searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}</span>
                </div>

                <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                  {isSearching && searchResults.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
                      Searching showroom catalog...
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.86rem', color: '#64748B', margin: '0 0 10px' }}>
                        No items found for &quot;{searchQuery}&quot;
                      </p>
                      <button
                        onClick={handleSearchSubmit}
                        className="btn-primary"
                        style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                      >
                        Search All Products
                      </button>
                    </div>
                  ) : (
                    searchResults.map((product) => {
                      const isAdded = addedMap[product._id];
                      return (
                        <div
                          key={product._id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            borderBottom: '1px solid #F1F5F9',
                            gap: '12px',
                            transition: 'background-color 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                        >
                          {/* Image & Info */}
                          <Link
                            href={`/shop/${product._id}`}
                            onClick={() => setSearchFocused(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              textDecoration: 'none',
                              color: 'inherit',
                              flex: 1,
                              minWidth: 0,
                            }}
                          >
                            <img
                              src={product.images?.[0] || '/logo.png'}
                              alt={product.name}
                              style={{
                                width: '44px',
                                height: '44px',
                                objectFit: 'contain',
                                borderRadius: '6px',
                                backgroundColor: '#F1F5F9',
                                flexShrink: 0,
                              }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: '0.86rem',
                                  fontWeight: 700,
                                  color: '#0F172A',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {product.name}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                <span style={{ fontSize: '0.72rem', color: 'var(--primary-orange)', fontWeight: 600 }}>
                                  {product.brand}
                                </span>
                                <span style={{ color: '#CBD5E1' }}>•</span>
                                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>
                                  ₹{product.price?.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          </Link>

                          {/* Quick "Add to Cart" Button */}
                          <button
                            onClick={(e) => handleQuickAddToCart(e, product)}
                            disabled={isAdded || product.stock <= 0}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              backgroundColor: isAdded ? '#DCFCE7' : 'var(--primary-orange)',
                              color: isAdded ? '#15803D' : '#FFFFFF',
                              border: isAdded ? '1px solid #86EFAC' : 'none',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: product.stock <= 0 ? 'not-allowed' : 'pointer',
                              flexShrink: 0,
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {isAdded ? (
                              <>
                                <Check size={12} strokeWidth={3} />
                                <span>Added</span>
                              </>
                            ) : product.stock <= 0 ? (
                              <span>Out of stock</span>
                            ) : (
                              <>
                                <ShoppingBag size={12} strokeWidth={2.4} />
                                <span>Add to Cart</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {searchResults.length > 0 && (
                  <button
                    onClick={handleSearchSubmit}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#F8FAFC',
                      color: 'var(--primary-orange)',
                      border: 'none',
                      borderTop: '1px solid #E2E8F0',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    View all results for &quot;{searchQuery}&quot; →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Action Group: Cart (to Add/Inspect), Sign In, Support ("everthin") */}
          <div className="navbar-right-actions">
            {/* "Cart" Pill Button on Navbar (Compact & Sleek) */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              aria-label="View Shopping Cart"
              className="nav-cart-btn"
              style={{
                position: 'relative',
                backgroundColor: 'rgba(249, 115, 22, 0.08)',
                border: '1.5px solid #FED7AA',
                borderRadius: '9999px',
                cursor: 'pointer',
                color: '#EA580C',
                padding: '6px 12px',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 700,
                fontSize: '0.86rem',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(249, 115, 22, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFEDD5';
                e.currentTarget.style.borderColor = '#F97316';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(249, 115, 22, 0.08)';
                e.currentTarget.style.borderColor = '#FED7AA';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <ShoppingBag size={15} strokeWidth={2.4} color="#EA580C" />
              <span className="nav-btn-text">Cart</span>
              <span
                style={{
                  backgroundColor: 'var(--primary-orange)',
                  color: '#FFFFFF',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  minWidth: '18px',
                  height: '18px',
                  borderRadius: '9px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px',
                  boxShadow: '0 1px 3px rgba(249, 115, 22, 0.3)',
                }}
              >
                {cartItemCount}
              </span>
            </button>

            {/* Customer Auth Button: Customer profile pill after signing in (Logout is inside /account) */}
            {user && pathname !== '/login' ? (
              <Link
                href="/account"
                title="View Customer Profile & Orders"
                className="nav-auth-btn"
                style={{
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.25)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1E293B';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0F172A';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <User size={15} />
                <span className="nav-btn-text" style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
              </Link>
            ) : pathname !== '/login' ? (
              <Link
                href="/login"
                className="nav-auth-btn"
                style={{
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.25)',
                  transition: 'var(--transition)',
                }}
              >
                <User size={16} strokeWidth={2.2} />
                <span className="nav-btn-text">Sign In</span>
              </Link>
            ) : null}

            {/* WhatsApp Support Pill Button (Visible on Desktop, shown in mobile menu on small screens) */}
            <a
              href="https://wa.me/919573653194?text=Hello%20Sri%20Rama%20Cycles,%20I%20need%20support%20with%20a%20bicycle."
              target="_blank"
              rel="noopener noreferrer"
              className="desktop-support-btn"
              style={{
                alignItems: 'center',
                gap: '7px',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                border: '1.5px solid #86EFAC',
                padding: '7px 14px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.88rem',
                textDecoration: 'none',
                transition: 'var(--transition)',
              }}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={16} strokeWidth={2.4} color="#15803D" />
                <span
                  style={{
                    position: 'absolute',
                    top: '-1px',
                    right: '-2px',
                    width: '6px',
                    height: '6px',
                    backgroundColor: '#22C55E',
                    borderRadius: '50%',
                    border: '1px solid #DCFCE7',
                  }}
                />
              </div>
              <span>Support</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#15803D">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>

            {/* Mobile Menu Hamburger Toggle Button with 3 Horizontal Lines (☰) */}
            <button
              ref={hamburgerBtnRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu (☰)'}
              aria-expanded={mobileMenuOpen}
              className={`mobile-hamburger-btn ${mobileMenuOpen ? 'is-active' : ''}`}
            >
              {mobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Backdrop Overlay (Clicking outside closes menu) */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu backdrop"
            className="mobile-menu-backdrop"
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(3px)',
              zIndex: 89,
              animation: 'fadeIn 0.2s ease',
            }}
          />
        )}

        {/* Responsive Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="mobile-nav-drawer"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid #FED7AA',
              borderBottom: '3px solid #EA580C',
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.16)',
              zIndex: 95,
              maxHeight: 'calc(100vh - 86px)',
              overflowY: 'auto',
              padding: '16px 18px 24px',
              animation: 'slideDownMobile 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Quick Customer Profile / Sign In Banner in Mobile Menu */}
            <div
              style={{
                backgroundColor: '#FFF7ED',
                borderRadius: '12px',
                border: '1.5px solid #FED7AA',
                padding: '12px 14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#EA580C',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.86rem',
                      flexShrink: 0,
                    }}
                  >
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.88rem' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{user.email}</div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} color="#EA580C" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 750, color: '#1E293B' }}>
                    Welcome to Sri Rama Cycles!
                  </span>
                </div>
              )}

              {user ? (
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #FED7AA',
                    color: '#EA580C',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 750,
                    textDecoration: 'none',
                  }}
                >
                  My Account →
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    backgroundColor: '#EA580C',
                    color: '#FFFFFF',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(234, 88, 12, 0.25)',
                  }}
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Live Search Bar */}
            <div ref={mobileSearchRef} style={{ position: 'relative', marginBottom: '16px' }}>
              <form onSubmit={handleSearchSubmit}>
                <div style={{ position: 'relative' }}>
                  <Search
                    size={16}
                    color="#64748B"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                  <input
                    type="text"
                    placeholder="Search bicycles, spares..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: '10px',
                      border: '1.5px solid #FED7AA',
                      backgroundColor: '#FFFDF9',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#94A3B8',
                        padding: '4px',
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </form>

              {/* Mobile Search Results Dropdown */}
              {searchQuery.trim().length > 0 && searchResults.length > 0 && (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #FED7AA',
                    borderRadius: '10px',
                    marginTop: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                  }}
                >
                  {searchResults.map((product) => {
                    const isAdded = addedMap[product._id];
                    return (
                      <div
                        key={product._id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderBottom: '1px solid #F1F5F9',
                          gap: '10px',
                        }}
                      >
                        <Link
                          href={`/shop/${product._id}`}
                          onClick={() => setMobileMenuOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            textDecoration: 'none',
                            color: 'inherit',
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <img
                            src={product.images?.[0] || '/logo.png'}
                            alt={product.name}
                            style={{
                              width: '40px',
                              height: '40px',
                              objectFit: 'contain',
                              borderRadius: '6px',
                              backgroundColor: '#F8FAFC',
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: '0.84rem',
                                fontWeight: 750,
                                color: '#1E293B',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {product.name}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#EA580C', fontWeight: 800 }}>
                              ₹{product.price?.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </Link>
                        <button
                          onClick={(e) => handleQuickAddToCart(e, product)}
                          disabled={isAdded || product.stock <= 0}
                          style={{
                            backgroundColor: isAdded ? '#DCFCE7' : '#EA580C',
                            color: isAdded ? '#15803D' : '#FFFFFF',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            flexShrink: 0,
                          }}
                        >
                          {isAdded ? 'Added' : '+ Cart'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Navigation Section Title */}
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#9A3412',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '8px',
                padding: '0 4px',
              }}
            >
              Navigation Links
            </div>

            {/* 5 Core Navigation Links: Home, Shop, About Us, Track Order, Contact Us */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const isContact = link.href === '/contact' || link.isContact;
                const Icon = link.icon;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      fontWeight: isActive ? 800 : 700,
                      color: isActive ? '#FFFFFF' : isContact ? '#000000' : '#1E293B',
                      backgroundColor: isActive ? '#EA580C' : '#FFFDF9',
                      border: isActive ? '1px solid #EA580C' : '1px solid #FED7AA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textDecoration: 'none',
                      transition: 'all 0.16s ease',
                      boxShadow: isActive ? '0 4px 12px rgba(234, 88, 12, 0.25)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: isActive ? 'rgba(255, 255, 255, 0.22)' : '#FFF7ED',
                          color: isActive ? '#FFFFFF' : '#EA580C',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={17} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.94rem' }}>{link.name}</div>
                        {link.subtitle && (
                          <div
                            style={{
                              fontSize: '0.72rem',
                              color: isActive ? '#FFEDD5' : '#64748B',
                              fontWeight: 500,
                            }}
                          >
                            {link.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={17} color={isActive ? '#FFFFFF' : '#94A3B8'} />
                  </Link>
                );
              })}
            </div>

            {/* Mobile Cart Summary Card */}
            <div
              style={{
                backgroundColor: '#FFF7ED',
                border: '1.5px solid #FED7AA',
                borderRadius: '12px',
                padding: '12px 14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: '#EA580C',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1E293B' }}>
                    Shopping Cart ({cartItemCount} items)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#EA580C', fontWeight: 800 }}>
                    Total: ₹{cartSubtotal.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCartDrawerOpen(true);
                  }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #FED7AA',
                    color: '#EA580C',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 750,
                    cursor: 'pointer',
                  }}
                >
                  Open Cart
                </button>
                <Link
                  href="/checkout"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    backgroundColor: '#EA580C',
                    color: '#FFFFFF',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                  }}
                >
                  Checkout →
                </Link>
              </div>
            </div>

            {/* Direct WhatsApp & Call Assistance */}
            <div
              style={{
                borderTop: '1px solid #FED7AA',
                paddingTop: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#9A3412', fontWeight: 800, textTransform: 'uppercase' }}>
                Showroom Direct Support
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href="https://wa.me/919573653194?text=Hello%20Sri%20Rama%20Cycles,%20I%20need%20support%20with%20a%20bicycle."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    backgroundColor: '#25D366',
                    color: '#FFFFFF',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                  }}
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp</span>
                </a>

                <a
                  href="tel:+919573653194"
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    backgroundColor: '#FFF7ED',
                    border: '1.5px solid #FED7AA',
                    color: '#EA580C',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                  }}
                >
                  <Phone size={15} />
                  <span>Call Store</span>
                </a>
              </div>

              <div style={{ fontSize: '0.76rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={13} color="#EA580C" />
                <span>SSS COMPLEX B-3, Kazipet, Hanumakonda</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Slide-Over Quick Cart Drawer (Opens from Navbar) */}
      {cartDrawerOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}>
          {/* Backdrop */}
          <div
            onClick={() => setCartDrawerOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.55)',
              backdropFilter: 'blur(3px)',
              animation: 'fadeIn 0.2s ease',
            }}
          />

          {/* Drawer Content */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '430px',
              backgroundColor: '#FFFFFF',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-8px 0 25px rgba(0, 0, 0, 0.25)',
              zIndex: 10,
              animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '20px 22px',
                borderBottom: '1.5px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-light-orange)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-orange)',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-text)', margin: 0 }}>
                    Your Cart
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--secondary-text)' }}>
                    {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} selected
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCartDrawerOpen(false)}
                aria-label="Close cart drawer"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--secondary-text)',
                  padding: '6px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Free Delivery Banner */}
            <div
              style={{
                backgroundColor: cartSubtotal >= 20000 ? '#DCFCE7' : '#FEF3C7',
                color: cartSubtotal >= 20000 ? '#15803D' : '#B45309',
                padding: '10px 18px',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              {cartSubtotal >= 20000 ? (
                <span>🎉 You qualify for <strong>FREE Doorstep Delivery</strong>!</span>
              ) : (
                <span>
                  Add <strong>₹{(20000 - cartSubtotal).toLocaleString('en-IN')}</strong> more for FREE delivery
                </span>
              )}
            </div>

            {/* Cart Items List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 10px' }}>
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-light-orange)',
                      color: 'var(--primary-orange)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <ShoppingBag size={34} />
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Your Cart is Empty</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--secondary-text)', marginBottom: '24px' }}>
                    Looks like you haven&apos;t added any bicycles or spares to your cart yet.
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setCartDrawerOpen(false)}
                    className="btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px' }}
                  >
                    <span>Browse Showroom</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {cart.map((item) => (
                    <div
                      key={`${item._id}-${item.selectedSize}`}
                      style={{
                        display: 'flex',
                        gap: '14px',
                        paddingBottom: '16px',
                        borderBottom: '1px solid var(--border-color)',
                      }}
                    >
                      <div
                        style={{
                          width: '74px',
                          height: '74px',
                          borderRadius: '8px',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid var(--border-color)',
                          overflow: 'hidden',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          src={item.image || '/logo.png'}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.78rem', color: 'var(--primary-orange)', fontWeight: 700 }}>
                          {item.brand}
                        </div>
                        <h4
                          style={{
                            fontSize: '0.92rem',
                            fontWeight: 700,
                            color: 'var(--primary-text)',
                            margin: '2px 0 4px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.name}
                        </h4>
                        <div style={{ fontSize: '0.78rem', color: 'var(--secondary-text)', marginBottom: '8px' }}>
                          Size: <strong>{item.selectedSize || 'Standard'}</strong>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          {/* Quantity control */}
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              border: '1px solid var(--border-color)',
                              borderRadius: '6px',
                              overflow: 'hidden',
                            }}
                          >
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1, item.selectedSize)}
                              style={{
                                padding: '4px 8px',
                                background: '#F8FAFC',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <Minus size={13} />
                            </button>
                            <span style={{ padding: '0 10px', fontSize: '0.85rem', fontWeight: 700 }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1, item.selectedSize)}
                              style={{
                                padding: '4px 8px',
                                background: '#F8FAFC',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          {/* Price & Remove */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontWeight: 800, color: 'var(--primary-text)', fontSize: '0.95rem' }}>
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                            <button
                              onClick={() => removeFromCart(item._id, item.selectedSize)}
                              aria-label="Remove item"
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#EF4444',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer with Actions */}
            {cart.length > 0 && (
              <div
                style={{
                  padding: '18px 20px 24px',
                  borderTop: '1.5px solid var(--border-color)',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 -4px 15px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.95rem', color: 'var(--secondary-text)' }}>Subtotal:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-text)' }}>
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link
                    href="/checkout"
                    onClick={() => setCartDrawerOpen(false)}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      padding: '13px',
                      fontSize: '1rem',
                      fontWeight: 700,
                      justifyContent: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={18} />
                  </Link>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link
                      href="/cart"
                      onClick={() => setCartDrawerOpen(false)}
                      className="btn-secondary"
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '10px',
                        fontSize: '0.88rem',
                        justifyContent: 'center',
                      }}
                    >
                      View Cart Page
                    </Link>
                    <button
                      onClick={() => setCartDrawerOpen(false)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        fontSize: '0.88rem',
                        backgroundColor: '#F1F5F9',
                        color: '#334155',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Keep Shopping
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes slideDownMobile {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          from {
            transform: translateY(-50%) rotate(0deg);
          }
          to {
            transform: translateY(-50%) rotate(360deg);
          }
        }
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-search-container {
            display: block !important;
          }
          .desktop-support-btn {
            display: inline-flex !important;
          }
          .nav-auth-btn {
            display: inline-flex !important;
          }
          .nav-cart-btn {
            display: inline-flex !important;
          }
          .mobile-hamburger-btn {
            display: none !important;
          }
          .mobile-nav-drawer {
            display: none !important;
          }
          .mobile-menu-backdrop {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .desktop-nav {
            display: none !important;
          }
          .desktop-search-container {
            display: none !important;
          }
          .desktop-support-btn {
            display: none !important;
          }
          .nav-auth-btn {
            display: none !important;
          }
          .nav-cart-btn {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: inline-flex !important;
          }
          .navbar-container {
            height: 68px !important;
            padding: 0 16px !important;
          }
          .navbar-logo {
            height: 44px !important;
            max-height: 44px !important;
            max-width: 160px !important;
          }
        }
        @media (max-width: 375px) {
          .navbar-container {
            padding: 0 12px !important;
            height: 62px !important;
          }
          .navbar-logo {
            height: 38px !important;
            max-height: 38px !important;
            max-width: 140px !important;
          }
          .mobile-hamburger-btn {
            width: 40px !important;
            height: 40px !important;
          }
        }
      `}</style>
    </>
  );
}
