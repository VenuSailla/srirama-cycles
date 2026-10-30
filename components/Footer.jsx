'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Wrench, Award, Truck } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer style={{ backgroundColor: '#1C1917', color: '#E7E5E4', marginTop: 'auto' }}>
      {/* Trust Badges Strip */}
      <div
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#292524',
          padding: '28px 0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(249, 115, 22, 0.15)',
                  color: 'var(--primary-orange)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Truck size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.95rem' }}>Doorstep Delivery</div>
                <div style={{ fontSize: '0.8rem', color: '#A8A29E' }}>Location-based charges; safe dispatch</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(249, 115, 22, 0.15)',
                  color: 'var(--primary-orange)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Wrench size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.95rem' }}>95% Assembled</div>
                <div style={{ fontSize: '0.8rem', color: '#A8A29E' }}>Ready to roll with minor adjustments</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(249, 115, 22, 0.15)',
                  color: 'var(--primary-orange)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.95rem' }}>Genuine Spares</div>
                <div style={{ fontSize: '0.8rem', color: '#A8A29E' }}>100% authentic multi-brand parts</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(249, 115, 22, 0.15)',
                  color: 'var(--primary-orange)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Award size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.95rem' }}>Brand Warranty</div>
                <div style={{ fontSize: '0.8rem', color: '#A8A29E' }}>Covered under manufacturer terms</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Footer */}
      <div className="container" style={{ padding: '60px 20px 40px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          {/* Column 1: Store Branding & About */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <img
                src="/logo.png"
                alt="Sri Rama Cycle Store & Auto Spares"
                style={{
                  height: '52px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  background: 'transparent',
                }}
              />
            </div>

            <p style={{ fontSize: '0.88rem', color: '#A8A29E', lineHeight: 1.6, marginBottom: '16px' }}>
              Kazipet and Telangana’s trusted bicycle destination. Offering premium mountain bikes, road racers, city commuters, kids bikes, and authentic auto spares.
            </p>

            <div style={{ fontSize: '0.82rem', color: '#78716C' }}>
              <strong>Proprietor:</strong> Ravula Rakesh Kumar
            </div>
          </div>

          {/* Column 2: Store Quick Links */}
          <div>
            <div style={{ color: '#FFF', fontSize: '1rem', fontWeight: 700, marginBottom: '18px', letterSpacing: '-0.01em' }}>
              Store
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link href="/" style={{ color: '#A8A29E', textDecoration: 'none', fontSize: '0.9rem', transition: 'var(--transition)' }}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" style={{ color: '#A8A29E', textDecoration: 'none', fontSize: '0.9rem' }}>
                  All Bicycles & Spares
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Mountain%20Cycles" style={{ color: '#A8A29E', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Mountain Cycles
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Road%20Cycles" style={{ color: '#A8A29E', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Road Cycles
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Kids%20Cycles" style={{ color: '#A8A29E', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Kids Cycles
                </Link>
              </li>
              <li>
                <Link href="/about" style={{ color: '#A8A29E', textDecoration: 'none', fontSize: '0.9rem' }}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" style={{ color: '#A8A29E', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div>
            <div style={{ color: '#FFF', fontSize: '1rem', fontWeight: 700, marginBottom: '18px', letterSpacing: '-0.01em' }}>
              Customer Care & Policies
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link href="/track-order" style={{ color: '#A8A29E', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/account" style={{ color: '#A8A29E', textDecoration: 'none', fontSize: '0.9rem' }}>
                  My Orders & Account
                </Link>
              </li>
              <li>
                <Link href="/cart" style={{ color: '#A8A29E', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/contact#support" style={{ color: '#A8A29E', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Workshop & Support
                </Link>
              </li>
              <li>
                <Link href="/contact#policies" style={{ color: '#A8A29E', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact#policies" style={{ color: '#A8A29E', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact#policies" style={{ color: '#A8A29E', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/contact#policies" style={{ color: '#A8A29E', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Hours */}
          <div>
            <div style={{ color: '#FFF', fontSize: '1rem', fontWeight: 700, marginBottom: '18px', letterSpacing: '-0.01em' }}>
              Store Contact
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem' }}>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: '#D6D3D1' }}>
                <MapPin size={18} color="var(--primary-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>SSS COMPLEX B-3, Main Road, Kazipet, Hanumakonda - 506003, Telangana, India</span>
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={17} color="var(--primary-orange)" style={{ flexShrink: 0 }} />
                <a href="tel:+919573653194" style={{ color: '#D6D3D1', textDecoration: 'none' }}>
                  +91 95736 53194
                </a>
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={17} color="var(--primary-orange)" style={{ flexShrink: 0 }} />
                <a href="mailto:sreeramacycle@gmail.com" style={{ color: '#D6D3D1', textDecoration: 'none' }}>
                  sreeramacycle@gmail.com
                </a>
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: '#D6D3D1' }}>
                <Clock size={17} color="var(--primary-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div>Mon - Sat: 9:00 AM – 8:30 PM</div>
                  <div>Sunday: 9:00 AM – 1:00 PM</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.82rem',
            color: '#78716C',
          }}
        >
          <div>© 2026 Sri Rama Cycle Store & Auto Spares. All rights reserved.</div>
          <div>Developed by Abhivorn Technologies & DigiLevelUp.</div>
        </div>
      </div>
    </footer>
  );
}
