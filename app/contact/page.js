'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Loader2,
} from 'lucide-react';

export default function ContactUsPage() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    honeypot: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  React.useEffect(() => {
    fetch('/api/site-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) setSiteSettings(data.settings);
      })
      .catch((err) => console.warn('Contact site settings fetch error', err));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(data.message || 'Your enquiry has been received successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          honeypot: '',
        });
      } else {
        setErrorMessage(data.error || 'Submission failed. Please check required fields.');
      }
    } catch (err) {
      setErrorMessage('Network connection error. Please try calling us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', marginBottom: '24px' }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Home
          </Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--primary-orange)', fontWeight: 600 }}>Contact & Workshop Support</span>
        </div>

        {/* Heading */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
          <span className="badge-orange">GET IN TOUCH</span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-text)', marginBottom: '10px' }}>
            Contact Sri Rama Cycles
          </h1>
          <p style={{ color: 'var(--secondary-text)', fontSize: '1rem', lineHeight: 1.6 }}>
            Have a question about bicycle sizing, test rides, genuine spares, or doorstep delivery? We’re here to help!
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '360px 1fr',
            gap: '36px',
          }}
          className="contact-layout"
        >
          {/* Left: Contact Info Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '32px', backgroundColor: '#FFFFFF' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-text)', marginBottom: '20px' }}>
                Showroom Information
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.92rem' }}>
                {/* Address */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-light-orange)',
                      color: 'var(--primary-orange)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--primary-text)' }}>Showroom Address</div>
                    <div style={{ color: 'var(--secondary-text)', marginTop: '2px', lineHeight: 1.5 }}>
                      {siteSettings?.address || 'SSS COMPLEX B-3, Main Road, Kazipet, Hanumakonda (District) - 506003, Telangana, India'}
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-light-orange)',
                      color: 'var(--primary-orange)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Phone size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--primary-text)' }}>Call Us</div>
                    <div style={{ marginTop: '2px' }}>
                      <a href={`tel:${(siteSettings?.phone || '+91 95736 53194').replace(/\s+/g, '')}`} style={{ color: 'var(--primary-orange)', fontWeight: 700 }}>
                        {siteSettings?.phone || '+91 95736 53194'}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-light-orange)',
                      color: 'var(--primary-orange)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--primary-text)' }}>Email Support</div>
                    <div style={{ marginTop: '2px' }}>
                      <a href={`mailto:${siteSettings?.email || 'sreeramacycle@gmail.com'}`} style={{ color: 'var(--primary-orange)', fontWeight: 600 }}>
                        {siteSettings?.email || 'sreeramacycle@gmail.com'}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-light-orange)',
                      color: 'var(--primary-orange)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--primary-text)' }}>Working Hours</div>
                    <div style={{ color: 'var(--secondary-text)', marginTop: '2px', lineHeight: 1.5 }}>
                      <div>{siteSettings?.openingHoursWeekdays || 'Mon - Sat: 9:00 AM – 8:30 PM'}</div>
                      <div>{siteSettings?.openingHoursSunday || 'Sunday: 9:00 AM – 1:00 PM'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Button */}
              <div style={{ marginTop: '28px', borderTop: '1px solid #F5F5F4', paddingTop: '20px' }}>
                <a
                  href={`https://wa.me/${(siteSettings?.whatsapp || '+919573653194').replace(/[^0-9]/g, '')}?text=Hello%20Sri%20Rama%20Cycles,%20I%20have%20an%20enquiry%20regarding%20bicycles.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    backgroundColor: '#25D366',
                    color: '#FFFFFF',
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                  }}
                >
                  <MessageCircle size={20} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Validated Enquiry Form */}
          <div>
            <div className="card" style={{ padding: '36px', backgroundColor: '#FFFFFF' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-text)', marginBottom: '8px' }}>
                Send Us a Message
              </h3>
              <p style={{ color: 'var(--secondary-text)', fontSize: '0.95rem', marginBottom: '24px' }}>
                Fill out the form below. Enquiries are stored securely in our database and answered by our store staff.
              </p>

              {successMessage && (
                <div
                  style={{
                    backgroundColor: '#F0FDF4',
                    color: '#15803D',
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: '1px solid #BBF7D0',
                    fontSize: '0.95rem',
                  }}
                >
                  <CheckCircle size={22} style={{ flexShrink: 0 }} />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div
                  style={{
                    backgroundColor: '#FEF2F2',
                    color: '#B91C1C',
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: '1px solid #FECACA',
                    fontSize: '0.95rem',
                  }}
                >
                  <AlertCircle size={22} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Honeypot field (hidden from real users) */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-2col">
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-2col">
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
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      required
                      placeholder="e.g. Mountain Bike Sizing / Delivery Inquiry"
                      value={formData.subject}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Message *</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us what you are looking for or questions about a specific model..."
                    value={formData.message}
                    onChange={handleChange}
                    className="form-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 700 }}
                >
                  {submitting ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Sending Message...</span>
                    </span>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Enquiry Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 860px) {
          .contact-layout {
            grid-template-columns: 1fr !important;
          }
          .grid-2col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
