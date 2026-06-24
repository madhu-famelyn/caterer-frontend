import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

function Stars({ rating }) {
  const full = Math.floor(rating)
  return (
    <div className="stars" style={{ gap: '3px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ fontSize: '1.1rem', color: i < full ? 'var(--primary)' : 'var(--text-light)' }}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function CatererProfilePage() {
  const { id } = useParams()
  const [caterer, setCaterer] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Dynamic Lists
  const [gallery, setGallery] = useState([])
  const [reviews, setReviews] = useState([])
  const [awards, setAwards] = useState([])
  const [certifications, setCertifications] = useState([])
  const [licenses, setLicenses] = useState([])

  // Lead Quote Modal
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [quoteForm, setQuoteForm] = useState({ name: '', email: '', event_date: '', guests: '', message: '' })
  const [quoteSubmitted, setQuoteSubmitted] = useState(false)

  // Write Review Form
  const [reviewForm, setReviewForm] = useState({ customer_name: '', rating: 5, comment: '' })
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewMessage, setReviewMessage] = useState('')

  const apiUrl = API_BASE_URL.replace(/\/$/, '')

  const fetchProfileAndStats = () => {
    fetch(`${apiUrl}/api/v1/caterers/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) setCaterer(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const fetchReviews = () => {
    fetch(`${apiUrl}/api/v1/reviews/?caterer_id=${id}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setReviews)
      .catch(() => {})
  }

  useEffect(() => {
    setLoading(true)
    fetchProfileAndStats()
    fetchReviews()

    // Fetch Gallery
    fetch(`${apiUrl}/api/v1/gallery/?caterer_id=${id}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setGallery)
      .catch(() => {})

    // Fetch Awards
    fetch(`${apiUrl}/api/v1/awards/?caterer_id=${id}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setAwards)
      .catch(() => {})

    // Fetch Certifications
    fetch(`${apiUrl}/api/v1/certifications/?caterer_id=${id}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setCertifications)
      .catch(() => {})

    // Fetch Licenses
    fetch(`${apiUrl}/api/v1/licenses/?caterer_id=${id}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setLicenses)
      .catch(() => {})
  }, [id])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px', color: 'var(--text-secondary)' }}>
        <p style={{ fontSize: '2rem' }}>🍽️</p>
        <p style={{ marginTop: '12px' }}>Loading profile...</p>
      </div>
    )
  }

  if (!caterer) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px', color: 'var(--text-secondary)' }}>
        <p style={{ fontSize: '2rem' }}>😕</p>
        <h2 style={{ marginTop: '12px', color: 'var(--text-primary)' }}>Caterer not found</h2>
        <Link to="/explore">
          <button className="btn-primary" style={{ marginTop: '20px' }}>Browse caterers</button>
        </Link>
      </div>
    )
  }

  // Quote Handlers
  const handleQuoteChange = (e) => setQuoteForm({ ...quoteForm, [e.target.name]: e.target.value })
  const handleQuoteSubmit = (e) => {
    e.preventDefault()
    setQuoteSubmitted(true)
  }

  // Review Submit Handler
  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!reviewForm.customer_name) return
    setReviewSubmitting(true)
    setReviewMessage('')
    try {
      const payload = {
        caterer_id: Number(id),
        customer_name: reviewForm.customer_name,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment
      }
      const res = await fetch(`${apiUrl}/api/v1/reviews/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to submit review')
      setReviewForm({ customer_name: '', rating: 5, comment: '' })
      setReviewMessage('Thank you! Your review has been posted.')
      
      // Refresh reviews and profile rating stats
      fetchReviews()
      fetchProfileAndStats()
    } catch (err) {
      setReviewMessage(err.message)
    } finally {
      setReviewSubmitting(false)
    }
  }

  const cleanImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('photo_folder:')) {
      const matches = url.match(/['"](https?:\/\/[^'"]+)['"]/);
      if (matches && matches[1]) {
        return matches[1];
      }
    }
    return url;
  };

  return (
    <div>
      {/* Cover image */}
      <div className="profile-hero">
        <img
          src={cleanImageUrl(caterer.image_url) || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80'}
          alt={caterer.business_name}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80' }}
        />
        <div className="profile-hero-overlay" />
      </div>

      <div className="profile-content">
        {/* Header Card */}
        <div className="profile-header-card" style={{ marginBottom: '32px' }}>
          <div className="profile-header-top">
            <div>
              <h1 className="profile-name">{caterer.business_name}</h1>
              <div className="profile-location">
                📍 {[caterer.city, caterer.state].filter(Boolean).join(', ') || 'Location TBD'}
              </div>
              {caterer.verified && (
                <div style={{ marginTop: '8px' }}>
                  <span className="badge-verified" style={{ position: 'static', display: 'inline-flex' }}>
                    🛡️ Verified Partner
                  </span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                style={{ padding: '12px 24px' }}
                onClick={() => setQuoteOpen(true)}
              >
                Request a quote
              </button>
              <Link to="/explore">
                <button className="btn-secondary" style={{ padding: '12px 24px' }}>
                  ← Back
                </button>
              </Link>
            </div>
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <Stars rating={caterer.rating || 0} />
              <strong>{caterer.rating ? caterer.rating.toFixed(1) : '0.0'}</strong>
              <span>Rating</span>
            </div>
            <div className="profile-stat">
              <strong>{caterer.review_count || 0}</strong>
              <span>Reviews</span>
            </div>
            <div className="profile-stat">
              <strong>{caterer.cuisine_type || 'Varied'}</strong>
              <span>Cuisine</span>
            </div>
            {caterer.price_per_guest && (
              <div className="profile-stat">
                <strong>₹{caterer.price_per_guest}/guest</strong>
                <span>Starting price</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }}>
          {/* Left Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* About */}
            {caterer.bio && (
              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px' }}>About</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{caterer.bio}</p>
              </div>
            )}

            {/* Gallery Grid */}
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Gallery</h2>
              {gallery.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                  {gallery.map((item) => (
                    <div key={item.id} style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '140px', border: '1px solid var(--border)' }}>
                      <img
                        src={item.file_url}
                        alt="Gallery presentation"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555244162-803834f70033?w=300' }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>No gallery photos uploaded yet.</p>
              )}
            </div>

            {/* Awards */}
            {awards.length > 0 && (
              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Awards & Honors</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {awards.map((a) => (
                    <div key={a.id} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '1.75rem' }}>🏆</span>
                      <div>
                        <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>
                          {a.title} {a.year && <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>({a.year})</span>}
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{a.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Credentials (Certifications & Licenses) */}
            {(certifications.length > 0 || licenses.length > 0) && (
              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Credentials & Compliance</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {certifications.map((c) => (
                    <div key={c.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.25rem' }}>📜</span>
                      <div style={{ fontSize: '0.9375rem' }}>
                        <strong>{c.title}</strong> — issued by {c.issued_by || 'Verified Board'}
                      </div>
                    </div>
                  ))}
                  {licenses.map((l) => (
                    <div key={l.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.25rem' }}>🛡️</span>
                      <div style={{ fontSize: '0.9375rem' }}>
                        <strong>{l.title}</strong> {l.expiry_date && `(Valid till ${new Date(l.expiry_date).toLocaleDateString()})`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Reviews ({reviews.length})</h2>
              
              {/* Review List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                {reviews.map((r) => (
                  <div key={r.id} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong>{r.customer_name}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>
                          {i < r.rating ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>{r.comment}</p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>No reviews yet. Be the first to leave a review!</p>
                )}
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleReviewSubmit} style={{ background: 'var(--bg-light)', border: '1px solid var(--border)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px' }}>Write a Review</h3>
                <div className="form-group">
                  <label htmlFor="rev-name">Your Name</label>
                  <input
                    id="rev-name"
                    type="text"
                    placeholder="John Doe"
                    value={reviewForm.customer_name}
                    onChange={(e) => setReviewForm({ ...reviewForm, customer_name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rev-rating">Rating</label>
                  <select
                    id="rev-rating"
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                    style={{ background: 'white', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="rev-comment">Comment</label>
                  <textarea
                    id="rev-comment"
                    placeholder="Share your experience with this caterer..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    rows={3}
                  />
                </div>
                {reviewMessage && (
                  <p style={{ color: reviewMessage.includes('Thank') ? '#15803d' : '#ef4444', fontSize: '0.875rem', marginBottom: '12px' }}>
                    {reviewMessage}
                  </p>
                )}
                <button type="submit" className="btn-primary" style={{ padding: '10px 20px' }} disabled={reviewSubmitting}>
                  {reviewSubmitting ? 'Posting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Services Card */}
            {caterer.tags && caterer.tags.length > 0 && (
              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '16px' }}>Services</h2>
                <div className="caterer-card-tags">
                  {caterer.tags.map((t, i) => (
                    <span key={i} className="tag" style={{ padding: '6px 14px', fontSize: '0.875rem' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quick Contact Card */}
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '16px' }}>Contact Info</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                {caterer.email && <div>✉️ {caterer.email}</div>}
                {caterer.mobile && <div>📞 {caterer.mobile}</div>}
                <div>📍 {caterer.city}, {caterer.state}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Modal */}
      {quoteOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setQuoteOpen(false) }}>
          <div className="modal">
            <div className="modal-header">
              <h2>Request a Quote</h2>
              <button className="modal-close" onClick={() => setQuoteOpen(false)}>✕</button>
            </div>

            {quoteSubmitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✅</div>
                <h3 style={{ marginBottom: '8px' }}>Quote request sent!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {caterer.business_name} will reach out to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit}>
                <div className="form-group">
                  <label htmlFor="q-name">Your name</label>
                  <input id="q-name" name="name" type="text" placeholder="Jane Smith" value={quoteForm.name} onChange={handleQuoteChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="q-email">Email</label>
                  <input id="q-email" name="email" type="email" placeholder="you@example.com" value={quoteForm.email} onChange={handleQuoteChange} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="q-date">Event date</label>
                    <input id="q-date" name="event_date" type="date" value={quoteForm.event_date} onChange={handleQuoteChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="q-guests">No. of guests</label>
                    <input id="q-guests" name="guests" type="number" placeholder="e.g. 150" min={1} value={quoteForm.guests} onChange={handleQuoteChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="q-message">Message</label>
                  <textarea id="q-message" name="message" placeholder="Tell them about your event..." value={quoteForm.message} onChange={handleQuoteChange} rows={3} />
                </div>
                <button type="submit" className="btn-submit">Send quote request →</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
