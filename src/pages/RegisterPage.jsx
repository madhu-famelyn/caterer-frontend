import { useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const CUISINE_TYPES = ['North Indian', 'South Indian', 'Bengali & Fusion', 'Coastal', 'Mughlai', 'Street Food', 'Gujarati', 'Rajasthani', 'Chinese', 'Italian']

export default function RegisterPage() {
  const [form, setForm] = useState({
    business_name: '',
    owner_name: '',
    email: '',
    mobile: '',
    password: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cuisine_type: '',
    bio: '',
    price_per_guest: '',
  })
  const [selectedTags, setSelectedTags] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const apiUrl = API_BASE_URL.replace(/\/$/, '')
      const payload = {
        business_name: form.business_name,
        owner_name: form.owner_name,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip,
        cuisine_type: form.cuisine_type,
        bio: form.bio,
        price_per_guest: form.price_per_guest ? Number(form.price_per_guest) : null,
        service_tags: selectedTags,
      }
      const res = await fetch(`${apiUrl}/api/v1/caterers/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || 'Registration failed. Please try again.')
      }
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-header">
          <div className="auth-icon">🎉</div>
          <h1>You&apos;re listed!</h1>
          <p>Your catering profile is live. Start winning bookings today.</p>
        </div>
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Check your email for your login credentials. Your profile is now visible in the directory.
          </p>
          <Link to="/explore">
            <button className="btn-submit">Browse the directory →</button>
          </Link>
          <p className="auth-footer-text" style={{ marginTop: '16px' }}>
            <Link to="/login">Sign in to your dashboard</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-header">
        <div className="auth-icon">🍽️</div>
        <h1>Register as a Vendor</h1>
        <p>Get a beautiful public profile and start receiving leads — it&apos;s free.</p>
      </div>

      <div className="auth-card auth-card-wide">
        <form onSubmit={handleSubmit}>
          {/* Business Details */}
          <div className="form-section-label">Business Details</div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-business-name">Business name</label>
              <input
                id="reg-business-name"
                name="business_name"
                type="text"
                placeholder="Royal Taj Catering"
                value={form.business_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-owner-name">Owner name</label>
              <input
                id="reg-owner-name"
                name="owner_name"
                type="text"
                placeholder="Aarav Sharma"
                value={form.owner_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-mobile">Mobile number</label>
              <input
                id="reg-mobile"
                name="mobile"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.mobile}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Location */}
          <div className="form-section-label" style={{ marginTop: '8px' }}>Location</div>

          <div className="form-group">
            <label htmlFor="reg-address">Business address</label>
            <input
              id="reg-address"
              name="address"
              type="text"
              placeholder="45, Marine Drive"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div className="form-group">
              <label htmlFor="reg-city">City</label>
              <input
                id="reg-city"
                name="city"
                type="text"
                placeholder="Mumbai"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-state">State</label>
              <input
                id="reg-state"
                name="state"
                type="text"
                placeholder="Maharashtra"
                value={form.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-zip">Pin code</label>
              <input
                id="reg-zip"
                name="zip"
                type="text"
                placeholder="400020"
                value={form.zip}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Catering Details */}
          <div className="form-section-label" style={{ marginTop: '8px' }}>Catering Details</div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-cuisine">Cuisine type</label>
              <select
                id="reg-cuisine"
                name="cuisine_type"
                value={form.cuisine_type}
                onChange={handleChange}
                required
              >
                <option value="">Select cuisine</option>
                {CUISINE_TYPES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="reg-price">Price per guest (₹)</label>
              <input
                id="reg-price"
                name="price_per_guest"
                type="number"
                placeholder="e.g. 850"
                value={form.price_per_guest}
                onChange={handleChange}
                min={1}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Service types</label>
            <div className="tags-grid">
              {['Weddings', 'Corporate', 'Galas', 'Casual', 'Outdoor', 'Fine Dining', 'Buffet', 'Cultural', 'Organic', 'Creative'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-toggle ${selectedTags.includes(tag) ? 'selected' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-bio">About your business</label>
            <textarea
              id="reg-bio"
              name="bio"
              placeholder="Tell clients what makes your catering special..."
              value={form.bio}
              onChange={handleChange}
              rows={4}
            />
          </div>

          {error && (
            <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '12px', background: '#fef2f2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fecaca' }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Creating profile...' : 'Create my profile →'}
          </button>

          <p className="auth-footer-text">
            Already registered?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
