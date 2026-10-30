'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MapPin,
  Phone,
  Clock,
  Award,
  Quote,
  ZoomIn,
  Receipt,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Wrench,
  UserCheck,
  CheckCircle2,
  X,
  Star,
} from 'lucide-react';

const SHOWROOM_SLIDES = [
  {
    title: 'Sri Rama Master Workshop & Showroom',
    subtitle: 'Kazipet Main Road Landmark & Certified Service Center',
    badge: '★ 4.9 Verified Store',
    image: '/storefront.jpg',
  },
  {
    title: 'Modern Bicycle Showroom',
    subtitle: '50+ Carbon, Road, MTB, Ladies & Kids Models',
    badge: 'Flagship Store',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Genuine Spares Division',
    subtitle: 'Authentic Shimano & Authorized Auto Parts',
    badge: '100% Factory Sourced',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=85',
  },
];

const MILESTONES = [
  {
    year: '1976',
    title: 'Store Inception in Kazipet',
    description:
      'Established by the Ravula family in Kazipet, Hanumakonda, bringing reliable bicycles & genuine spare parts to local commuters.',
  },
  {
    year: '1980',
    title: 'Era of Unbroken Generational Trust',
    description:
      'Equipping local families with lifelong fitted cycles through the historic Sri Rama Scheme — proven by loyal customers who preserve their original 1980 bills to this day.',
  },
  {
    year: '2015',
    title: 'Performance & Multi-Speed Cycles',
    description:
      'Introduced precision road racers, hydraulic disc brake cycles, and multi-speed geared bicycles for sport and fitness enthusiasts.',
  },
  {
    year: '2026',
    title: 'Digital E-Commerce & Doorstep Delivery',
    description:
      'Launched direct online booking and doorstep delivery across Telangana with 95% pre-assembly and 1-Year Frame Warranty.',
  },
];

const COMMITMENTS = [
  {
    icon: ShieldCheck,
    title: '100% Factory Authentic',
    description:
      'Direct sourcing from certified makers including Shimano, SRAM, RockShox, Tektro, and Kenda with zero counterfeit parts.',
  },
  {
    icon: Wrench,
    title: 'Master Technician Tuning',
    description:
      'On-site certified mechanics for precision derailleur tuning, hydraulic line bleeding, wheel truing, and custom cycle builds.',
  },
  {
    icon: UserCheck,
    title: 'Personalized Consultation',
    description:
      'Led by Ravula Rakesh Kumar, we provide transparent sizing recommendations and honest advice tailored to your budget.',
  },
];

export default function AboutUsPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProof, setSelectedProof] = useState('both');
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    fetch('/api/site-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) setSiteSettings(data.settings);
      })
      .catch((err) => console.warn('About settings fetch error', err));
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SHOWROOM_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SHOWROOM_SLIDES.length) % SHOWROOM_SLIDES.length);
  };

  return (
    <div style={{ backgroundColor: '#FFF7ED', minHeight: '90vh', padding: '36px 0 80px' }}>
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ fontSize: '0.85rem', color: '#78716C', marginBottom: '24px' }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Home
          </Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#F97316', fontWeight: 700 }}>About Us</span>
        </div>

        {/* 1. Header Banner */}
        <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 46px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FFEDD5',
              border: '1px solid #FED7AA',
              color: '#EA580C',
              fontSize: '12.5px',
              fontWeight: 800,
              padding: '6px 16px',
              borderRadius: '50px',
              marginBottom: '16px',
              boxShadow: '0 1px 4px rgba(249, 115, 22, 0.12)',
            }}
          >
            <Sparkles size={15} color="#F97316" />
            <span>Serving Hanumakonda & Telangana Since 1976</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 2.8rem)',
              fontWeight: 900,
              color: '#292524',
              letterSpacing: '-0.5px',
              lineHeight: 1.15,
              marginBottom: '14px',
            }}
          >
            Sri Rama Cycle &{' '}
            <span
              style={{
                color: '#F97316',
                background: 'linear-gradient(90deg, #EA580C, #F97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Auto Spare Parts
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#57534E',
              lineHeight: 1.6,
              margin: '0 auto',
            }}
          >
            Proprietor:{' '}
            <strong style={{ color: '#1C1917', fontWeight: 800 }}>Ravula. Rakesh Kumar</strong> —
            Kazipet&apos;s premier landmark store for high-performance bicycles, mountain MTBs,
            classic roadsters, and genuine auto spare parts.
          </p>
        </div>

        {/* 2. Showroom Hero Card (Gallery Slider + Store Overview) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '48px',
            alignItems: 'stretch',
          }}
        >
          {/* Left: Interactive Showroom Gallery Card */}
          <div
            style={{
              backgroundColor: '#1E293B',
              borderRadius: '24px',
              overflow: 'hidden',
              position: 'relative',
              minHeight: '420px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 12px 28px rgba(249, 115, 22, 0.12)',
              border: '1.5px solid #FED7AA',
            }}
          >
            <img
              src={SHOWROOM_SLIDES[currentSlide].image}
              alt={SHOWROOM_SLIDES[currentSlide].title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.9,
                transition: 'opacity 0.4s ease',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.2) 60%, rgba(15,23,42,0.4) 100%)',
              }}
            />

            {/* Top Badge & Slider Dots */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '18px 20px',
              }}
            >
              <span
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  color: '#15803D',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                {SHOWROOM_SLIDES[currentSlide].badge}
              </span>

              <div style={{ display: 'flex', gap: '6px' }}>
                {SHOWROOM_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    style={{
                      width: idx === currentSlide ? '22px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      backgroundColor: idx === currentSlide ? '#F97316' : 'rgba(255,255,255,0.5)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Slide Arrows */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 12px',
              }}
            >
              <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.55)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next Slide"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.55)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Bottom Caption Box */}
            <div style={{ position: 'relative', zIndex: 2, padding: '22px' }}>
              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(8px)',
                  padding: '14px 18px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#FFFFFF',
                }}
              >
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 3px', color: '#FFFFFF' }}>
                  {SHOWROOM_SLIDES[currentSlide].title}
                </h3>
                <p style={{ fontSize: '13px', color: '#CBD5E1', margin: 0 }}>
                  {SHOWROOM_SLIDES[currentSlide].subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Store Overview Info Box */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '32px 36px',
              border: '1.5px solid #FED7AA',
              boxShadow: '0 4px 12px rgba(41, 37, 36, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FFF4E8',
                  color: '#EA580C',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  border: '1px solid #FED7AA',
                  marginBottom: '14px',
                }}
              >
                <Award size={14} color="#EA580C" />
                <span>50 Years of Excellence</span>
              </div>

              <h2
                style={{
                  fontSize: '26px',
                  fontWeight: 900,
                  color: '#292524',
                  letterSpacing: '-0.3px',
                  margin: '0 0 14px',
                  lineHeight: 1.25,
                }}
              >
                Trusted Quality & Genuine Spares
              </h2>

              <p style={{ fontSize: '14.5px', color: '#57534E', lineHeight: 1.65, marginBottom: '12px' }}>
                Located in Kazipet, Sri Rama Cycle & Auto Spare Parts has been the backbone of reliable transportation in Hanumakonda for nearly five decades.
              </p>
              <p style={{ fontSize: '14.5px', color: '#57534E', lineHeight: 1.65, margin: 0 }}>
                We offer a curated lineup of premium carbon road racers, durable mountain MTBs, ladies cycles, and factory-authentic auto spare parts.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href="https://maps.google.com/?q=Sri+Rama+Cycle+%26+Auto+Spare+Parts+SSS+COMPLEX+B-3+Mainroad+Kazipet+Hanumakonda+506003"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  backgroundColor: '#FFF7ED',
                  border: '1px solid #FED7AA',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#292524',
                  transition: 'background-color 0.2s',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#F97316',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <MapPin size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#EA580C', textTransform: 'uppercase' }}>
                    Store Location
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#292524', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    SSS COMPLEX B-3, Mainroad, Kazipet, Hanumakonda - 506003
                  </div>
                </div>
                <ExternalLink size={14} color="#94A3B8" />
              </a>

              <a
                href="tel:9573653194"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#15803D',
                  transition: 'background-color 0.2s',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#16A34A',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Phone size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase' }}>
                    Direct Store Phone
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#14532D' }}>
                    +91 95736 53194
                  </div>
                </div>
              </a>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#78716C', paddingTop: '4px' }}>
                <Clock size={14} color="#F97316" />
                <span>Mon – Sat: 9:00 AM – 8:30 PM | Sun: 9:00 AM – 1:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Four Big Stats Bar */}
        <div
          style={{
            backgroundColor: '#1E293B',
            borderRadius: '24px',
            padding: '36px 24px',
            color: '#FFFFFF',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '24px',
            textAlign: 'center',
            marginBottom: '60px',
            boxShadow: '0 4px 12px rgba(41, 37, 36, 0.07)',
          }}
        >
          <div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#F97316', lineHeight: 1.1 }}>10,000+</div>
            <div style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', marginTop: '6px' }}>
              Satisfied Cyclists
            </div>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#22C55E', lineHeight: 1.1 }}>100%</div>
            <div style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', marginTop: '6px' }}>
              Genuine Spare Parts
            </div>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#FBBF24', lineHeight: 1.1 }}>1 Year</div>
            <div style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', marginTop: '6px' }}>
              Frame Warranty
            </div>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#A855F7', lineHeight: 1.1 }}>1976</div>
            <div style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', marginTop: '6px' }}>
              Established Year
            </div>
          </div>
        </div>

        {/* 4. Generational Story & Archival Customer Proof Section (Exact Match to User Screenshot) */}
        <div
          id="archival-proof"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '28px',
            padding: '44px 36px',
            border: '2px solid #FED7AA',
            boxShadow: '0 12px 28px rgba(249, 115, 22, 0.12)',
            marginBottom: '60px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center',
            }}
          >
            {/* Left Story Column */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FFF4E8',
                  color: '#9A3412',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  border: '1px solid #FED7AA',
                  marginBottom: '14px',
                }}
              >
                <Award size={14} color="#EA580C" />
                <span>50 Years of Excellence & Generational Trust</span>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(2rem, 3.8vw, 2.6rem)',
                  fontWeight: 900,
                  color: '#292524',
                  letterSpacing: '-0.3px',
                  margin: '0 0 18px',
                  lineHeight: 1.25,
                }}
              >
                Cycles Built to Last Decades.{' '}
                <span style={{ color: '#F97316' }}>Trust That Spans Generations.</span>
              </h2>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  fontSize: '14px',
                  color: '#57534E',
                  lineHeight: 1.7,
                  marginBottom: '22px',
                }}
              >
                <p style={{ margin: 0 }}>
                  Since 1976, Sri Rama Cycle & Auto Spare Parts has been anchored on an uncompromising standard:
                  delivering genuine build quality, honest advice, and bicycles engineered to outlast generations.
                  Every cycle assembled in our Kazipet workshop receives rigorous technical checks, ensuring lifelong
                  safety, performance, and riding comfort.
                </p>
                <p style={{ margin: 0 }}>
                  For five decades, countless families across Telangana have built their cycling memories with us.
                  Parents who bought their first roadster cycle at our Station Road store in the 1970s and 1980s continue
                  returning today with their children and grandchildren, knowing that our commitment to authentic parts
                  and heartfelt service never wavers.
                </p>
                <p style={{ margin: 0, fontWeight: 600, color: '#1C1917' }}>
                  A tangible testament to this enduring excellence was recently celebrated when a customer who originally
                  received a cycle under our scheme in 1980 returned in 2026 — traveling 140+ km all the way from
                  Hyderabad to purchase his family&apos;s next bicycle. He brought his preserved 46-year-old receipt
                  alongside his new invoice — one authentic proof of the thousands of generational bonds forged at Sri
                  Rama Cycles.
                </p>
              </div>

              {/* Enduring Quote Box */}
              <div
                style={{
                  backgroundColor: '#FFFDF9',
                  borderLeft: '4px solid #F97316',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  marginBottom: '22px',
                  borderTop: '1px solid #FED7AA',
                  borderRight: '1px solid #FED7AA',
                  borderBottom: '1px solid #FED7AA',
                }}
              >
                <p
                  style={{
                    fontStyle: 'italic',
                    fontSize: '13.5px',
                    color: '#292524',
                    margin: '0 0 8px',
                    lineHeight: 1.6,
                    fontWeight: 500,
                  }}
                >
                  “A bicycle is more than transport — it is a milestone in every family&apos;s life. When customers
                  who rode our cycles in the 1980s bring their grandchildren back to our store decades later, it is the
                  ultimate affirmation of our honesty, craftsmanship, and service.”
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12px',
                    borderTop: '1px solid #FED7AA',
                    paddingTop: '8px',
                    flexWrap: 'wrap',
                    gap: '6px',
                  }}
                >
                  <span style={{ fontWeight: 800, color: '#292524' }}>The Sri Rama Cycles Legacy</span>
                  <span
                    style={{
                      color: '#9A3412',
                      backgroundColor: '#FFEDD5',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 700,
                      fontSize: '11px',
                    }}
                  >
                    Serving Cyclists with Honesty Since 1976
                  </span>
                </div>
              </div>

              {/* 3 Loyalty Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#292524',
                    backgroundColor: '#FFF7ED',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #FED7AA',
                  }}
                >
                  <CheckCircle2 size={16} color="#16A34A" /> 46+ Yrs Family Loyalty
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#292524',
                    backgroundColor: '#FFF7ED',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #FED7AA',
                  }}
                >
                  <CheckCircle2 size={16} color="#16A34A" /> 100% Genuine Spares
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#292524',
                    backgroundColor: '#FFF7ED',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #FED7AA',
                  }}
                >
                  <CheckCircle2 size={16} color="#16A34A" /> Archival Customer Proof
                </div>
              </div>
            </div>

            {/* Right Archival Living Proof Column (1980 vs. 2026 Comparison) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: '#9A3412',
                    backgroundColor: '#FFEDD5',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    border: '1px solid #FED7AA',
                    letterSpacing: '0.4px',
                    display: 'inline-block',
                  }}
                >
                  ARCHIVAL LIVING PROOF • 1980 VS. 2026
                </span>
                <p style={{ fontSize: '12.5px', color: '#78716C', margin: '6px 0 0', fontWeight: 500 }}>
                  One preserved real-world story among thousands of families who remain loyal over 4+ decades.
                </p>
              </div>

              {/* Comparison 2-Card Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* 1980 Card */}
                <div
                  onClick={() => {
                    setSelectedProof('1980');
                    setModalOpen(true);
                  }}
                  style={{
                    backgroundColor: '#FFFDF9',
                    border: '2px solid #FED7AA',
                    borderRadius: '16px',
                    padding: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#F97316';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#FED7AA';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 900,
                        color: '#9A3412',
                        backgroundColor: '#FFEDD5',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                      }}
                    >
                      1980 Archival Record
                    </span>
                    <ZoomIn size={14} color="#EA580C" />
                  </div>
                  <div
                    style={{
                      height: '200px',
                      backgroundColor: '#FFF7ED',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #FED7AA',
                    }}
                  >
                    <img
                      src="/receipt-1980.jpg"
                      alt="1980 Scheme Receipt Record"
                      style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#FDFCF7' }}
                    />
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#292524' }}>
                      Preserved 1980 Scheme Receipt
                    </div>
                    <div style={{ fontSize: '11px', color: '#EA580C', fontWeight: 700 }}>
                      First Cycle Purchased in 1980 • ₹425
                    </div>
                  </div>
                </div>

                {/* 2026 Card */}
                <div
                  onClick={() => {
                    setSelectedProof('2026');
                    setModalOpen(true);
                  }}
                  style={{
                    backgroundColor: '#F0FDF4',
                    border: '2px solid #BBF7D0',
                    borderRadius: '16px',
                    padding: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#16A34A';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#BBF7D0';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 900,
                        color: '#166534',
                        backgroundColor: '#DCFCE7',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                      }}
                    >
                      2026 Generational Return
                    </span>
                    <ZoomIn size={14} color="#16A34A" />
                  </div>
                  <div
                    style={{
                      height: '200px',
                      backgroundColor: '#DCFCE7',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #86EFAC',
                    }}
                  >
                    <img
                      src="/receipt-2026.jpg"
                      alt="2026 Cycle Purchase Invoice"
                      style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#FFFFFF' }}
                    />
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#14532D' }}>
                      Returned Decades Later in 2026
                    </div>
                    <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700 }}>
                      Traveled from Hyderabad • ₹3,200
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button: Inspect Archival Proof of Loyalty */}
              <button
                type="button"
                onClick={() => {
                  setSelectedProof('both');
                  setModalOpen(true);
                }}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#EA580C',
                  color: '#FFFFFF',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)',
                  transition: 'background-color 0.2s, transform 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#C2410C';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#EA580C';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Receipt size={17} />
                <span>Inspect Archival Proof of Loyalty (1980 vs. 2026)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5. Milestones of Excellence (Five Decades of Pedaling Progress) */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 32px' }}>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#EA580C',
                letterSpacing: '1px',
              }}
            >
              Milestones of Excellence
            </span>
            <h3
              style={{
                fontSize: '28px',
                fontWeight: 900,
                color: '#292524',
                margin: '6px 0 0',
              }}
            >
              Five Decades of Pedaling Progress
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
            }}
          >
            {MILESTONES.map((m) => (
              <div
                key={m.year}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '24px',
                  border: '1.5px solid #FED7AA',
                  boxShadow: '0 2px 8px rgba(41, 37, 36, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <span
                  style={{
                    backgroundColor: '#FFEDD5',
                    color: '#EA580C',
                    fontSize: '12px',
                    fontWeight: 900,
                    padding: '3px 12px',
                    borderRadius: '20px',
                    width: 'fit-content',
                    border: '1px solid #FED7AA',
                  }}
                >
                  {m.year}
                </span>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#292524', margin: 0 }}>
                  {m.title}
                </h4>
                <p style={{ fontSize: '13px', color: '#57534E', lineHeight: 1.6, margin: 0 }}>
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Our Core Commitments (The Pillars of Sri Rama Excellence) */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 32px' }}>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#EA580C',
                letterSpacing: '1px',
              }}
            >
              Our Core Commitments
            </span>
            <h3
              style={{
                fontSize: '28px',
                fontWeight: 900,
                color: '#292524',
                margin: '6px 0 0',
              }}
            >
              The Pillars of Sri Rama Excellence
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {COMMITMENTS.map((c) => {
              const IconComp = c.icon;
              return (
                <div
                  key={c.title}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '28px 24px',
                    border: '1.5px solid #FED7AA',
                    boxShadow: '0 2px 8px rgba(41, 37, 36, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: '#FFF4E8',
                      color: '#EA580C',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconComp size={24} />
                  </div>
                  <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#292524', margin: 0 }}>
                    {c.title}
                  </h4>
                  <p style={{ fontSize: '13.5px', color: '#57534E', lineHeight: 1.65, margin: 0 }}>
                    {c.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7. Showroom CTA Bar */}
        <div
          style={{
            backgroundColor: '#1E293B',
            borderRadius: '24px',
            padding: '40px 32px',
            color: '#FFFFFF',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(41, 37, 36, 0.07)',
          }}
        >
          <h3 style={{ fontSize: '26px', fontWeight: 900, margin: '0 0 10px', color: '#FFFFFF' }}>
            Visit Our Kazipet Showroom Today
          </h3>
          <p
            style={{
              fontSize: '14.5px',
              color: '#CBD5E1',
              maxWidth: '640px',
              margin: '0 auto 24px',
              lineHeight: 1.6,
            }}
          >
            Explore the collection in person, test ride your dream cycle, and experience personalized service from our bicycle specialists.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              href="/shop"
              style={{
                backgroundColor: '#F97316',
                color: '#FFFFFF',
                padding: '12px 26px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '14px',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)',
              }}
            >
              Explore Cycles Online
            </Link>
            <a
              href="https://wa.me/message/EEJFSOJ7Y3JCD1"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#22C55E',
                color: '#FFFFFF',
                padding: '12px 26px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '14px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>Contact Showroom</span>
            </a>
          </div>
        </div>
      </div>

      {/* Modal for Archival Proof of Loyalty (1980 vs. 2026) */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(5px)',
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '850px',
              width: '100%',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={20} color="#292524" />
            </button>

            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#9A3412',
                backgroundColor: '#FFEDD5',
                padding: '3px 10px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: '8px',
              }}
            >
              Archival Living Proof • 1980 vs. 2026
            </span>

            <h3 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '6px', color: '#292524' }}>
              Documented 46-Year Customer Loyalty Record
            </h3>
            <p style={{ fontSize: '13px', color: '#57534E', marginBottom: '20px', lineHeight: 1.5 }}>
              Real-world documentation of a Telangana customer who received his first fitted cycle under the Sri Rama Scheme in 1980 and returned from Hyderabad in 2026 with his family to purchase their next bicycle.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: selectedProof === '1980' || selectedProof === '2026' ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {/* 1980 Record */}
              {(selectedProof === 'both' || selectedProof === '1980') && (
                <div style={{ backgroundColor: '#FFF7ED', padding: '18px', borderRadius: '16px', border: '1.5px solid #FED7AA' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#9A3412', backgroundColor: '#FFEDD5', padding: '3px 8px', borderRadius: '4px' }}>
                      1980 Preserved Card
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#EA580C' }}>
                      Date: 9/7/80 • ₹425
                    </span>
                  </div>
                  <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #FED7AA', backgroundColor: '#FFF', maxHeight: '450px', display: 'flex', justifyContent: 'center' }}>
                    <img
                      src="/receipt-1980.jpg"
                      alt="1980 Document"
                      style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'contain' }}
                    />
                  </div>
                  <div style={{ marginTop: '12px', fontSize: '13px', color: '#292524', fontWeight: 800 }}>
                    Original 1980 Scheme Receipt: ₹425
                  </div>
                  <p style={{ fontSize: '12px', color: '#78716C', marginTop: '4px', lineHeight: 1.5 }}>
                    Stamped and issued at Sri Rama Cycle Store, Station Road, Kazipet in 1980 for member H.P. Venkateshwarlu.
                  </p>
                </div>
              )}

              {/* 2026 Record */}
              {(selectedProof === 'both' || selectedProof === '2026') && (
                <div style={{ backgroundColor: '#F0FDF4', padding: '18px', borderRadius: '16px', border: '1.5px solid #BBF7D0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#166534', backgroundColor: '#DCFCE7', padding: '3px 8px', borderRadius: '4px' }}>
                      2026 Generational Invoice
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#15803D' }}>
                      Date: 07/05/2026 • ₹3,200
                    </span>
                  </div>
                  <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #86EFAC', backgroundColor: '#FFF', maxHeight: '450px', display: 'flex', justifyContent: 'center' }}>
                    <img
                      src="/receipt-2026.jpg"
                      alt="2026 Invoice"
                      style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'contain' }}
                    />
                  </div>
                  <div style={{ marginTop: '12px', fontSize: '13px', color: '#14532D', fontWeight: 800 }}>
                    Official 2026 GST Purchase Invoice: ₹3,200
                  </div>
                  <p style={{ fontSize: '12px', color: '#4B5563', marginTop: '4px', lineHeight: 1.5 }}>
                    Returned to Kazipet from Hyderabad in 2026 for a Speed-IBC 20&quot; cycle for the family&apos;s next generation.
                  </p>
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  backgroundColor: '#EA580C',
                  color: '#FFFFFF',
                  padding: '10px 24px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Close Archival Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
