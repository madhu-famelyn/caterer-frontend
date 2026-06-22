import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CatererCard from '../components/CatererCard'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const MOCK_CATERERS = [
  {
    id: 1, business_name: 'Royal Taj Catering', city: 'Mumbai', state: 'Maharashtra',
    cuisine_type: 'North Indian', rating: 4.9, review_count: 482, price_per_guest: 1200,
    image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80',
    tags: ['Corporate', 'Weddings'], verified: true,
  },
  {
    id: 2, business_name: 'Masala Bistro', city: 'Kolkata', state: 'West Bengal',
    cuisine_type: 'Bengali & Fusion', rating: 4.8, review_count: 311, price_per_guest: 450,
    image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    tags: ['Casual', 'Buffet'], verified: true,
  },
  {
    id: 3, business_name: 'Saffron Table', city: 'Bangalore', state: 'Karnataka',
    cuisine_type: 'South Indian & Coastal', rating: 4.9, review_count: 624, price_per_guest: 750,
    image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80',
    tags: ['Fine Dining', 'Traditional'], verified: true,
  },
]

const TESTIMONIALS = [
  {
    id: 1, text: '"CaterHub helps us shortlist vetted caterers in minutes. The vendor profiles are everything we need."',
    name: 'Aditi Sen', role: 'Wedding Planner, Shubh Aarambh Events', initials: 'AS',
  },
  {
    id: 2, text: '"We doubled our booked events in 6 months after putting our profile on CaterHub."',
    name: 'Sam Patel', role: 'Director of Catering, Masala Bistro', initials: 'SP',
  },
  {
    id: 3, text: '"Found our office caterer in one afternoon. The reviews and licensing info made the choice easy."',
    name: 'Karan Malhotra', role: 'Corporate Admin Manager', initials: 'KM',
  },
]

export default function HomePage() {
  const [caterers, setCaterers] = useState(MOCK_CATERERS)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const apiUrl = API_BASE_URL.replace(/\/$/, '')
    fetch(`${apiUrl}/api/v1/caterers/?limit=6`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCaterers(data.slice(0, 3))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}>
              <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-5.74L4 10l5.91-1.74L12 2z"/>
            </svg>
            The Catering Vendor Platform
          </div>
          <h1 className="hero-title">
            Grow Your Catering<br />
            Business <span className="highlight">Online.</span>
          </h1>
          <p className="hero-subtitle">
            Create your professional catering profile, showcase your services, and connect with more customers.
          </p>

          <div className="hero-actions">
            <Link to="/register">
              <button className="btn-primary hero-btn-primary">
                Register as Vendor →
              </button>
            </Link>
            <Link to="/explore">
              <button className="hero-btn-secondary">
                Explore Caterers
              </button>
            </Link>
          </div>

          <form
            className="hero-search"
            onSubmit={(e) => {
              e.preventDefault()
              window.location.href = `/explore?q=${encodeURIComponent(searchQuery)}`
            }}
          >
            <svg className="hero-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search caterers by name, city, or cuisine"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn-primary hero-search-btn">
              Search
            </button>
          </form>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-icon">👥</span>
              1,200+ caterers listed
            </div>
            <div className="hero-stat">
              <span className="hero-stat-icon">⭐</span>
              38,000+ verified reviews
            </div>
            <div className="hero-stat">
              <span className="hero-stat-icon">✅</span>
              Licensed &amp; insured vendors
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY CATERHUB ===== */}
      <section className="features-section">
        <div className="section-header">
          <div className="section-badge">Why CaterHub</div>
          <h2 className="section-title">Built for the way caterers actually work</h2>
          <p className="section-subtitle">
            Beautiful profiles, real reviews, and tools that turn lookers into bookings.
          </p>
        </div>

        <div className="features-grid">
          {[
            { n: 1, title: 'Verified Vendors', desc: 'Every caterer is reviewed for licensing, insurance, and customer history before going live.' },
            { n: 2, title: 'Real Customer Reviews', desc: 'Star ratings and detailed reviews from actual clients — not paid placements.' },
            { n: 3, title: 'Built for Growth', desc: 'Beautiful public profiles, gallery, awards, and a dashboard that helps caterers win more bookings.' },
            { n: 4, title: 'Made for Every Event', desc: 'From intimate dinners to 1,000-guest galas — find specialists for every event type.' },
          ].map((f) => (
            <div className="feature-card" key={f.n}>
              <div className="feature-number">{f.n}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURED CATERERS ===== */}
      <section className="caterers-section" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <div className="section-badge">Featured Caterers</div>
          <h2 className="section-title">Top-rated this month</h2>
          <p className="section-subtitle">
            Hand-picked from the most-booked, highest-rated caterers across the country.
          </p>
        </div>

        <div className="caterers-grid">
          {caterers.map((c) => (
            <CatererCard key={c.id} caterer={c} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/explore" className="see-all-link">
            See all caterers →
          </Link>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials-section">
        <div className="section-header">
          <div className="section-badge">Loved by the Industry</div>
          <h2 className="section-title">What our community is saying</h2>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <div className="testimonial-card" key={t.id}>
              <div className="testimonial-stars">
                {[1,2,3,4,5].map(i => <span key={i}>★</span>)}
              </div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-divider" />
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.initials}</div>
                <div className="testimonial-author-info">
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="cta-section">
        <div className="cta-banner">
          <div>
            <h2>Ready to bring more bookings home?</h2>
            <p>Set up your catering profile in under 5 minutes. No fees to get started.</p>
          </div>
          <Link to="/register">
            <button className="btn-white">
              Get listed free →
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}
