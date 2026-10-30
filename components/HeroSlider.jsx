'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Truck,
  RotateCcw,
  ShieldCheck,
  Wrench,
  Star,
  Quote,
  CheckCircle2,
} from 'lucide-react';

const defaultSlides = [
  {
    order: 1,
    title: 'Sri Rama Cycles',
    titleHighlight: 'Your Trusted Partner on Every Road!',
    subtitle: 'SERVING TELANGANA & HANUMAKONDA SINCE 1976',
    description: 'From peaceful morning sunrise rides to rugged off-road adventures, Sri Rama Cycles brings you 50 years of trusted craftsmanship, pro assembly, and reliable quality for every journey.',
    buttonText: 'Shop All Bicycles',
    buttonLink: '/shop',
    secondaryButtonText: 'Visit Showroom',
    secondaryButtonLink: '/contact',
    imageUrl: '/slider/hero-specialized-mtb.jpg',
    tag: '50 Years Landmark',
    quote: '“Sri Rama Cycles – Your Trusted Partner on Every Road!”',
    quoteAuthor: 'Ravula Rakesh Kumar (Proprietor)',
    badge: 'Trusted Since 1976',
  },
  {
    order: 2,
    title: 'Embrace The Wild Trails',
    titleHighlight: 'Rugged Mountain MTBs',
    subtitle: 'NATURAL TRAIL ADVENTURE',
    description: 'Conquer rocky paths, steep forest slopes, and singletracks with dual disc brakes, lightweight alloy geometry, and responsive front suspension.',
    buttonText: 'Explore Mountain Bikes',
    buttonLink: '/shop?category=Mountain%20Cycles',
    secondaryButtonText: 'View MTB Lineup',
    secondaryButtonLink: '/shop?category=Mountain%20Cycles',
    imageUrl: '/slider/trail-mountain-bike.jpg',
    tag: 'Trail Ready & Rugged',
    quote: '“Nothing compares to the simple, pure pleasure of riding through nature.”',
    quoteAuthor: 'John F. Kennedy',
    badge: 'MTB Series from ₹14,999',
  },
  {
    order: 3,
    title: 'Smooth Glide, Pure Speed',
    titleHighlight: 'Precision Disc Brake Cycles',
    subtitle: 'HIGH PERFORMANCE ENDURANCE',
    description: 'Feel the rush of fresh morning air on open highways with ultra-light carbon & alloy road racers crafted for pure speed and long-distance comfort.',
    buttonText: 'Shop Road Cycles',
    buttonLink: '/shop?category=Road%20Cycles',
    secondaryButtonText: 'View Road Bikes',
    secondaryButtonLink: '/shop?category=Road%20Cycles',
    imageUrl: '/slider/road-speed-racer.jpg',
    tag: 'Aero & Endurance',
    quote: '“Life is like riding a bicycle. To keep your balance, you must keep moving.”',
    quoteAuthor: 'Albert Einstein',
    badge: 'Road Cycles from ₹12,499',
  },
  {
    order: 4,
    title: 'Serene Countryside Journeys',
    titleHighlight: 'Ladies & City Cruisers',
    subtitle: 'CASUAL OUTDOOR COMMUTE',
    description: 'Delightful low-step frames, upright posture geometry, and plush cushioned saddles designed for peaceful evening rides through tree-lined streets.',
    buttonText: 'Shop Ladies & City',
    buttonLink: '/shop?category=Ladies%20Cycles',
    secondaryButtonText: 'City Collection',
    secondaryButtonLink: '/shop?category=City%20%26%20Hybrid%20Cycles',
    imageUrl: '/slider/city-cruiser-bike.jpg',
    tag: 'Family Favorite',
    quote: '“Ride as much or as little, as long or as short as you feel. But ride.”',
    quoteAuthor: 'Eddy Merckx',
    badge: 'Ladies Cycles from ₹6,999',
  },
  {
    order: 5,
    title: 'Sunlit Pathways & Family Joy',
    titleHighlight: 'Kids & Family Bicycles',
    subtitle: 'STARTING EARLY ADVENTURES',
    description: 'Safe, durable, colorful children bicycles fitted with sturdy training wheels and impact-resistant components for healthy smiles in the park.',
    buttonText: 'Shop Kids Cycles',
    buttonLink: '/shop?category=Kids%20Cycles',
    secondaryButtonText: 'View All Models',
    secondaryButtonLink: '/shop',
    imageUrl: '/slider/kids-family-bicycle.jpg',
    tag: 'Family & Recreation',
    quote: '“Every great adventure begins with two wheels and an open road.”',
    quoteAuthor: 'Sri Rama Cycles',
    badge: 'Kids Cycles from ₹4,999',
  },
];

export default function HeroSlider() {
  const [slides, setSlides] = useState(defaultSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Fetch dynamic CMS slides
  useEffect(() => {
    fetch('/api/slides')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.slides) && data.slides.length > 0) {
          const merged = data.slides.map((s, idx) => ({
            ...defaultSlides[idx % defaultSlides.length],
            ...s,
            quote: s.quote || defaultSlides[idx % defaultSlides.length].quote,
            quoteAuthor: s.quoteAuthor || defaultSlides[idx % defaultSlides.length].quoteAuthor,
          }));
          setSlides(merged);
        }
      })
      .catch((err) => console.warn('Using fallback slides', err));
  }, []);

  // Smooth Auto-Slide every 4.8 seconds (slides move right from left)
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4800);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, slides.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goToNext(); // swiped left -> moves next (right to left)
      else goToPrev(); // swiped right -> moves prev
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const activeSlide = slides[currentIndex] || slides[0];

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {/* 1. Main Hero Slider Section with Right-from-Left Smooth Sliding Track */}
      <section
        aria-label="Sri Rama Cycles Featured Showcase"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '520px',
          height: '66vh',
          maxHeight: '620px',
          overflow: 'hidden',
          backgroundColor: '#0F172A',
        }}
      >
        {/* Sliding Track (Moves Right from Left) */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)',
            willChange: 'transform',
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide._id || slide.order || index}
              style={{
                flex: '0 0 100%',
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Background Image with subtle zoom on active */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${slide.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: index === currentIndex ? 'scale(1.03)' : 'scale(1)',
                  transition: 'transform 6s ease-out',
                }}
              />

              {/* Multi-layered Dark & Warm Orange Gradient Overlays: Dark on left for readability, clear & bright on right so realistic cycle shines through */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(90deg, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.78) 42%, rgba(15, 23, 42, 0.15) 70%, transparent 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(circle at 82% 45%, rgba(249, 115, 22, 0.15) 0%, transparent 60%)',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '110px',
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.75) 0%, transparent 100%)',
                }}
              />

              {/* Slide Content: Left Text & Natural Cycle View on Right */}
              <div
                className="container"
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  zIndex: 10,
                  paddingTop: '20px',
                  paddingBottom: '20px',
                }}
              >
                {/* Left Side: Hero Text, Slogan & CTAs */}
                <div style={{ maxWidth: '640px' }}>
                  {/* Badge */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      backgroundColor: 'rgba(249, 115, 22, 0.25)',
                      border: '1.5px solid rgba(249, 115, 22, 0.6)',
                      color: '#FED7AA',
                      padding: '5px 14px',
                      borderRadius: '9999px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      marginBottom: '12px',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <Sparkles size={14} color="#FB923C" />
                    <span>{slide.tag || 'Showroom Spotlight'}</span>
                    {slide.badge && (
                      <>
                        <span style={{ color: 'rgba(254, 215, 170, 0.5)' }}>•</span>
                        <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{slide.badge}</span>
                      </>
                    )}
                  </div>

                  {slide.subtitle && (
                    <div
                      style={{
                        color: '#FB923C',
                        fontSize: '0.86rem',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '8px',
                      }}
                    >
                      {slide.subtitle}
                    </div>
                  )}

                  <h1
                    style={{
                      fontSize: 'clamp(2rem, 4vw, 2.85rem)',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      lineHeight: 1.15,
                      letterSpacing: '-0.02em',
                      marginBottom: '12px',
                      textShadow: '0 2px 14px rgba(0, 0, 0, 0.45)',
                    }}
                  >
                    {slide.title}
                    {slide.titleHighlight && (
                      <span
                        style={{
                          display: 'block',
                          background: 'linear-gradient(90deg, #FF8A4C 0%, #F97316 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {slide.titleHighlight}
                      </span>
                    )}
                  </h1>

                  <p
                    style={{
                      fontSize: 'clamp(0.94rem, 1.35vw, 1.08rem)',
                      color: '#E2E8F0',
                      lineHeight: 1.55,
                      marginBottom: '24px',
                      maxWidth: '540px',
                    }}
                  >
                    {slide.description}
                  </p>

                  {/* Buttons */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
                    <Link
                      href={slide.buttonLink || '/shop'}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#F97316',
                        color: '#FFFFFF',
                        padding: '12px 26px',
                        borderRadius: '10px',
                        fontWeight: 800,
                        fontSize: '0.94rem',
                        textDecoration: 'none',
                        boxShadow: '0 8px 24px rgba(249, 115, 22, 0.4)',
                        transition: 'all 0.25s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#EA580C';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#F97316';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <span>{slide.buttonText || 'Shop Collection'}</span>
                      <ArrowRight size={18} />
                    </Link>

                    {slide.secondaryButtonText && (
                      <Link
                        href={slide.secondaryButtonLink || '/shop'}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: 'rgba(255, 255, 255, 0.12)',
                          color: '#FFFFFF',
                          padding: '12px 22px',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '0.92rem',
                          border: '1.5px solid rgba(255, 255, 255, 0.25)',
                          backdropFilter: 'blur(10px)',
                          textDecoration: 'none',
                          transition: 'all 0.25s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.22)';
                          e.currentTarget.style.borderColor = '#FED7AA';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                        }}
                      >
                        <span>{slide.secondaryButtonText}</span>
                      </Link>
                    )}
                  </div>

                  {/* Left Side Trust Points */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.82rem', color: '#CBD5E1' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <CheckCircle2 size={15} color="#22C55E" />
                      <strong style={{ color: '#FFFFFF' }}>100% Assembled</strong>
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <ShieldCheck size={15} color="#22C55E" />
                      <strong style={{ color: '#FFFFFF' }}>1-Year Frame Warranty</strong>
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <Truck size={15} color="#22C55E" />
                      <strong style={{ color: '#FFFFFF' }}>Telangana Delivery</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={goToPrev}
          aria-label="Previous Slide"
        style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          color: '#FFFFFF',
          border: '1.5px solid rgba(254, 215, 170, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 25,
          backdropFilter: 'blur(8px)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#F97316';
          e.currentTarget.style.borderColor = '#F97316';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.7)';
          e.currentTarget.style.borderColor = 'rgba(254, 215, 170, 0.4)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
        >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={goToNext}
        aria-label="Next Slide"
        style={{
          position: 'absolute',
          right: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          color: '#FFFFFF',
          border: '1.5px solid rgba(254, 215, 170, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 25,
          backdropFilter: 'blur(8px)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#F97316';
          e.currentTarget.style.borderColor = '#F97316';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.7)';
          e.currentTarget.style.borderColor = 'rgba(254, 215, 170, 0.4)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        <ChevronRight size={22} />
      </button>

      {/* Slide Indicator Dots with Progress width */}
      <div
        style={{
          position: 'absolute',
          bottom: '14px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 25,
        }}
      >
        {slides.map((_, dotIdx) => {
          const isSelected = dotIdx === currentIndex;
          return (
            <button
              key={dotIdx}
              onClick={() => setCurrentIndex(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              style={{
                width: isSelected ? '34px' : '10px',
                height: '10px',
                borderRadius: '9999px',
                backgroundColor: isSelected ? '#F97316' : 'rgba(255, 255, 255, 0.45)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
                boxShadow: isSelected ? '0 0 10px rgba(249, 115, 22, 0.7)' : 'none',
              }}
            />
          );
        })}
      </div>
    </section>

      {/* 2. DOWN IMAGE SLIDER: Exact 4 High-Converting Guarantee Feature Cards (Matching User Screenshot) */ }
  <section
    style={{
      backgroundColor: '#FFF7ED',
      borderBottom: '1px solid #FED7AA',
      padding: '24px 0',
    }}
  >
    <div className="container">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '18px',
          alignItems: 'stretch',
        }}
      >
        {/* Card 1: Free Shipping */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #FED7AA',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(249, 115, 22, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(249, 115, 22, 0.05)';
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: '#FFF7ED',
              border: '1.5px solid #FFEDD5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#EA580C',
            }}
          >
            <Truck size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', margin: 0, letterSpacing: '-0.01em' }}>
              Free Shipping
            </h4>
            <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '3px 0 0', fontWeight: 500 }}>
              On Orders Above ₹999
            </p>
          </div>
        </div>

        {/* Card 2: Easy Returns */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #FED7AA',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(249, 115, 22, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(249, 115, 22, 0.05)';
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: '#FFF7ED',
              border: '1.5px solid #FFEDD5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#EA580C',
            }}
          >
            <RotateCcw size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', margin: 0, letterSpacing: '-0.01em' }}>
              Easy Returns
            </h4>
            <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '3px 0 0', fontWeight: 500 }}>
              Within 7 Days
            </p>
          </div>
        </div>

        {/* Card 3: Secure Payment */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #FED7AA',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(249, 115, 22, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(249, 115, 22, 0.05)';
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: '#FFF7ED',
              border: '1.5px solid #FFEDD5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#EA580C',
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', margin: 0, letterSpacing: '-0.01em' }}>
              Secure Payment
            </h4>
            <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '3px 0 0', fontWeight: 500 }}>
              100% Safe & Secure
            </p>
          </div>
        </div>

        {/* Card 4: Workshop Assembly */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #FED7AA',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(249, 115, 22, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(249, 115, 22, 0.05)';
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: '#FFF7ED',
              border: '1.5px solid #FFEDD5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#EA580C',
            }}
          >
            <Wrench size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', margin: 0, letterSpacing: '-0.01em' }}>
              Free Assembly
            </h4>
            <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '3px 0 0', fontWeight: 500 }}>
              95% Pre-Assembled & Tested
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Responsive adjustments for the cycle showcase and arrows */ }
  <style>{`
        @media (max-width: 900px) {
          .hero-cycle-showcase {
            display: none !important;
          }
        }
      `}</style>
    </div >
  );
}
