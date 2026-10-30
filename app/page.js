'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Wrench,
  Award,
  Truck,
  Compass,
  Star,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';

const categories = [
  {
    name: 'Road Cycles',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
    count: 'Lightweight & Aero',
    href: '/shop?category=Road%20Cycles',
  },
  {
    name: 'Mountain Cycles',
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=600&q=80',
    count: 'Trails & Off-Road',
    href: '/shop?category=Mountain%20Cycles',
  },
  {
    name: 'Ladies Cycles',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80',
    count: 'Comfort & Step-Through',
    href: '/shop?category=Ladies%20Cycles',
  },
  {
    name: 'Disc Brake Cycles',
    image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=600&q=80',
    count: 'High Braking Power',
    href: '/shop?category=Disc%20Brake%20Cycles',
  },
  {
    name: 'Kids Cycles',
    image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=600&q=80',
    count: 'Safe & Fun Riding',
    href: '/shop?category=Kids%20Cycles',
  },
  {
    name: 'City & Hybrid Cycles',
    image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=600&q=80',
    count: 'Daily Commute & Fitness',
    href: '/shop?category=City%20%26%20Hybrid%20Cycles',
  },
  {
    name: 'Bicycle Spare Parts and Accessories',
    image: 'https://images.unsplash.com/photo-1530982011887-3ce11ab85697?auto=format&fit=crop&w=600&q=80',
    count: 'Helmets, Lights & Tools',
    href: '/shop?category=Bicycle%20Spare%20Parts%20and%20Accessories',
  },
];

const testimonials = [
  {
    name: 'Suresh Kumar G.',
    role: 'Kazipet Cyclist (Demonstration Review)',
    comment:
      'Got my Srirama Mountain bike delivered 95% assembled right at my doorstep. Smooth gears, very sturdy build quality. The workshop team also adjusted the saddle height free of charge!',
    rating: 5,
  },
  {
    name: 'Dr. Anita Sharma',
    role: 'Fitness Enthusiast, Hanumakonda (Demonstration Review)',
    comment:
      'The Ladies Comfort cycle has an effortless upright posture. Ravula Rakesh Kumar and the store staff explained all options patiently without pushing expensive models.',
    rating: 5,
  },
  {
    name: 'Mohammed Rizwan',
    role: 'Commuter, Warangal (Demonstration Review)',
    comment:
      'Genuine spare parts are hard to come by nowadays, but Sri Rama Cycle Store stocks original chains, lubricants, helmets and tubes. Highly recommended showroom!',
    rating: 5,
  },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [sparesProducts, setSparesProducts] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomepageData() {
      try {
        const [featRes, bestRes, sparesRes, setRes] = await Promise.all([
          fetch('/api/products?isFeatured=true&limit=4'),
          fetch('/api/products?isBestSeller=true&limit=4'),
          fetch('/api/products?category=Bicycle%20Spare%20Parts%20and%20Accessories&limit=4'),
          fetch('/api/site-settings'),
        ]);

        const featData = await featRes.json();
        const bestData = await bestRes.json();
        const sparesData = await sparesRes.json();
        const setData = await setRes.json();

        if (featData.success) setFeaturedProducts(featData.products || []);
        if (bestData.success) setBestSellers(bestData.products || []);
        if (sparesData.success) setSparesProducts(sparesData.products || []);
        if (setData.success) setSiteSettings(setData.settings || {});
      } catch (err) {
        console.warn('Error fetching homepage products', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomepageData();
  }, []);

  return (
    <div>
      {/* 1. Hero Image Slider */}
      <HeroSlider />

      {/* Slogan Ribbon if configured via CMS */}
      {siteSettings?.slogan && (
        <div
          style={{
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            borderTop: '2px solid #EA580C',
            borderBottom: '1px solid #1E293B',
            padding: '14px 20px',
            textAlign: 'center',
          }}
        >
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Sparkles size={18} color="#FB923C" />
            <span style={{ fontSize: '0.98rem', fontWeight: 800, letterSpacing: '0.01em', color: '#F8FAFC' }}>
              {siteSettings.slogan}
            </span>
            <span style={{ color: '#EA580C', fontWeight: 800 }}>•</span>
            <span style={{ fontSize: '0.84rem', color: '#CBD5E1', fontWeight: 600 }}>
              Official Showroom Kazipet
            </span>
          </div>
        </div>
      )}

      {/* 2. Shop by Category */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <span className="badge-orange">EXPLORE OUR RANGE</span>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">
              From pro aerodynamic carbon racers to rugged mountain bikes and children’s cycles.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '65%',
                    backgroundColor: '#E7E5E4',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
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
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '50px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
                    }}
                  />
                </div>
                <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--primary-text)', marginBottom: '4px' }}>
                      {cat.name}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--secondary-text)' }}>{cat.count}</div>
                  </div>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-light-orange)',
                      color: 'var(--primary-orange)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ChevronRight size={18} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '36px',
            }}
          >
            <div>
              <span className="badge-orange">HANDPICKED FOR PERFORMANCE</span>
              <h2 className="section-title">Featured Bicycles</h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Top recommended models selected by our certified technicians for quality and endurance.
              </p>
            </div>
            <Link href="/shop?isFeatured=true" className="btn-secondary">
              <span>View All Featured</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {featuredProducts.length > 0
              ? featuredProducts.map((product) => <ProductCard key={product._id} product={product} />)
              : [...Array(4)].map((_, i) => (
                  <div key={i} className="card" style={{ height: '360px', backgroundColor: '#F5F5F4' }} />
                ))}
          </div>
        </div>
      </section>

      {/* 4. Best Sellers */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '36px',
            }}
          >
            <div>
              <span className="badge-orange">MOST POPULAR IN KAZIPET</span>
              <h2 className="section-title">Best Selling Bicycles</h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Our customers’ top choices for city commuting, trail adventure, and weekend fitness.
              </p>
            </div>
            <Link href="/shop?sort=popularity" className="btn-secondary">
              <span>Explore Top Sellers</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {bestSellers.length > 0
              ? bestSellers.map((product) => <ProductCard key={product._id} product={product} />)
              : [...Array(4)].map((_, i) => (
                  <div key={i} className="card" style={{ height: '360px', backgroundColor: '#F5F5F4' }} />
                ))}
          </div>
        </div>
      </section>

      {/* 5. Genuine Spare Parts & Accessories Banner */}
      <section className="section-padding" style={{ backgroundColor: '#292524', color: '#FFFFFF' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(249, 115, 22, 0.2)',
                  color: '#FED7AA',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  marginBottom: '16px',
                }}
              >
                <Wrench size={14} color="#F97316" />
                <span>CERTIFIED WORKSHOP & SPARES</span>
              </div>
              <h2
                style={{
                  fontSize: 'clamp(2rem, 4vw, 2.6rem)',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  marginBottom: '18px',
                }}
              >
                100% Genuine Auto Spares & Precision Cycle Toolkits
              </h2>
              <p style={{ color: '#D6D3D1', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '28px' }}>
                Keep your ride operating at peak efficiency. We stock authentic Shimano groupsets, high-lumen waterproof lights, shock-absorbent helmets, puncture repair tools, and heavy-duty tires.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                <Link
                  href="/shop?category=Bicycle%20Spare%20Parts%20and%20Accessories"
                  className="btn-primary"
                  style={{ padding: '14px 28px' }}
                >
                  <span>Shop Spare Parts</span>
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/contact#support"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 24px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid rgba(255, 255, 255, 0.3)',
                    color: '#FFF',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Book Workshop Tune-Up
                </Link>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
              }}
            >
              {sparesProducts.slice(0, 2).map((sp) => (
                <div key={sp._id} className="card" style={{ backgroundColor: '#1C1917', border: '1px solid #44403C' }}>
                  <img
                    src={sp.images?.[0] || 'https://images.unsplash.com/photo-1530982011887-3ce11ab85697?auto=format&fit=crop&w=400&q=80'}
                    alt={sp.name}
                    style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '14px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary-orange)', fontWeight: 700 }}>
                      {sp.brand}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF', margin: '4px 0 8px', minHeight: '2.4em' }}>
                      {sp.name}
                    </div>
                    <div style={{ fontWeight: 800, color: '#FED7AA' }}>₹{sp.price.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why Choose Sri Rama Cycles */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <span className="badge-orange">WHY RIDE WITH US</span>
            <h2 className="section-title">Built on Trust, Crafted for Riders</h2>
            <p className="section-subtitle">
              Serving the cycling community with dedicated support, genuine warranties, and expert multi-brand assembly.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px',
            }}
          >
            <div className="card" style={{ padding: '30px 24px', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-light-orange)',
                  color: 'var(--primary-orange)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <Truck size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px' }}>Doorstep Delivery</h3>
              <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Safe, scheduled dispatch directly to your home with charges tailored to order and delivery location.
              </p>
            </div>

            <div className="card" style={{ padding: '30px 24px', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-light-orange)',
                  color: 'var(--primary-orange)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <Wrench size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px' }}>95% Pre-Assembled</h3>
              <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Each bicycle is tuned, inspected, and shipped almost ready-to-ride. Simply mount pedals and align handlebars.
              </p>
            </div>

            <div className="card" style={{ padding: '30px 24px', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-light-orange)',
                  color: 'var(--primary-orange)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px' }}>100% Genuine Spares</h3>
              <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Authorized parts sourced directly from leading manufacturers like Shimano, Ralco, Gang, Zeus, and Vallabha.
              </p>
            </div>

            <div className="card" style={{ padding: '30px 24px', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-light-orange)',
                  color: 'var(--primary-orange)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <Award size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px' }}>Manufacturer Warranty</h3>
              <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                All bicycles and genuine accessories are backed according to official brand warranty policies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Store History & About Preview */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1000&q=80"
                alt="Sri Rama Cycle Showroom"
                style={{
                  width: '100%',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-color)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  right: '20px',
                  backgroundColor: 'var(--primary-orange)',
                  color: '#FFFFFF',
                  padding: '16px 24px',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 8px 24px rgba(249, 115, 22, 0.4)',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                }}
              >
                TRUSTED SHOWROOM & WORKSHOP
              </div>
            </div>

            <div>
              <span className="badge-orange">ABOUT OUR STORE</span>
              <h2 className="section-title">A Proud Heritage in Cycling</h2>
              <p style={{ color: 'var(--secondary-text)', lineHeight: 1.7, marginBottom: '16px' }}>
                At Sri Rama Cycle Store & Auto Spares, our passion is pairing every customer with the perfect ride. Led by proprietor <strong>Ravula Rakesh Kumar</strong>, we have earned the loyalty of thousands of riders across Kazipet, Hanumakonda, and Warangal.
              </p>
              <p style={{ color: 'var(--secondary-text)', lineHeight: 1.7, marginBottom: '24px' }}>
                Our in-house certified multi-brand service workshop offers comprehensive tune-ups, gear calibrations, brake overhauls, and authentic spare replacements.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-text)', fontWeight: 600 }}>
                  <CheckCircle size={18} color="var(--primary-orange)" />
                  <span>Authorised multi-brand dealership (Vallabha, Speed, Zeus, Gang, Ralco)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-text)', fontWeight: 600 }}>
                  <CheckCircle size={18} color="var(--primary-orange)" />
                  <span>Transparent pricing and verified component specifications</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-text)', fontWeight: 600 }}>
                  <CheckCircle size={18} color="var(--primary-orange)" />
                  <span>On-demand test rides available at our Kazipet Main Road facility</span>
                </div>
              </div>

              <Link href="/about" className="btn-primary">
                <span>Read Full Store Story</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Customer Testimonials */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <span className="badge-orange">VERIFIED EXPERIENCES</span>
            <h2 className="section-title">What Our Riders Say</h2>
            <p className="section-subtitle">
              Demonstration customer feedback highlighting service, doorstep dispatch, and showroom care.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {testimonials.map((t, idx) => (
              <div key={idx} className="card" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', color: '#F59E0B', marginBottom: '14px' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p style={{ color: 'var(--primary-text)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                  “{t.comment}”
                </p>
                <div style={{ borderTop: '1px solid #F5F5F4', paddingTop: '12px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary-text)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--secondary-text)' }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Contact & Store Location Summary */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div
            className="card"
            style={{
              backgroundColor: 'var(--bg-light-orange)',
              border: '1.5px solid var(--border-color)',
              padding: '40px 32px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '32px',
                alignItems: 'center',
              }}
            >
              <div>
                <span className="badge-orange" style={{ backgroundColor: '#FFFFFF' }}>VISIT US IN PERSON</span>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-text)', marginBottom: '12px' }}>
                  Sri Rama Cycle Store & Auto Spares
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem', color: 'var(--primary-text)' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <MapPin size={20} color="var(--primary-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>SSS COMPLEX B-3, Main Road, Kazipet, Hanumakonda - 506003, Telangana</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Phone size={18} color="var(--primary-orange)" style={{ flexShrink: 0 }} />
                    <a href="tel:+919573653194" style={{ color: 'inherit', fontWeight: 600 }}>
                      +91 95736 53194
                    </a>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Clock size={18} color="var(--primary-orange)" style={{ flexShrink: 0 }} />
                    <span>Mon - Sat: 9:00 AM – 8:30 PM | Sun: 9:00 AM – 1:00 PM</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'flex-start' }}>
                <p style={{ color: 'var(--secondary-text)', lineHeight: 1.6 }}>
                  Have questions regarding gear ratios, frame sizing, or delivery to your district? Our bicycle experts are available to guide you.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  <Link href="/contact" className="btn-primary">
                    <span>Send Inquiry</span>
                    <ArrowRight size={16} />
                  </Link>
                  <a
                    href="https://wa.me/919573653194?text=Hi%20Sri%20Rama%20Cycles,%20I%20am%20interested%20in%20buying%20a%20bicycle."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    WhatsApp Chat
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
