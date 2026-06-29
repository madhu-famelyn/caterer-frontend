import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CatererCard from '../components/CatererCard'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'


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
  const [caterers, setCaterers] = useState([])
  const [loadingCaterers, setLoadingCaterers] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const apiUrl = API_BASE_URL.replace(/\/$/, '')
    let retries = 3

    const fetchCaterers = () => {
      fetch(`${apiUrl}/api/v1/caterers/?limit=3`)
        .then((r) => {
          if (r.status === 503 && retries > 0) {
            retries--
            setTimeout(fetchCaterers, 2000) // retry after 2s (DB waking up)
            return null
          }
          return r.ok ? r.json() : []
        })
        .then((data) => {
          if (data && Array.isArray(data)) {
            setCaterers(data)
            setLoadingCaterers(false) // only stop loading when we have real data
          }
        })
        .catch(() => {
          setLoadingCaterers(false) // stop loading on network error too
        })
    }

    fetchCaterers()
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

        {loadingCaterers ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '2rem', marginBottom: '12px' }}>🍽️</p>
            <p>Loading caterers...</p>
          </div>
        ) : caterers.length > 0 ? (
          <>
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
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '2rem', marginBottom: '12px' }}>🍽️</p>
            <p>No caterers listed yet. <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Be the first to register!</Link></p>
          </div>
        )}
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
