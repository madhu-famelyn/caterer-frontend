import { useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const apiUrl = API_BASE_URL.replace(/\/$/, '')
      const res = await fetch(`${apiUrl}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || 'Something went wrong. Please try again.')
      }
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-header">
        <div className="auth-icon">🔑</div>
        <h1>Forgot Password</h1>
        <p>Enter your email and we&apos;ll send you a password reset link.</p>
      </div>

      <div className="auth-card">
        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📩</div>
            <h3 style={{ marginBottom: '12px' }}>Reset request sent!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: '1.6', marginBottom: '24px' }}>
              If your email is registered with us, you will find a simulated password reset link in the backend server console.
            </p>
            <Link to="/login">
              <button className="btn-submit">Back to Sign In</button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="forgot-email">Email Address</label>
              <input
                id="forgot-email"
                type="email"
                placeholder="aarav@royaltaj.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
              <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '12px', background: '#fef2f2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                {error}
              </p>
            )}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Sending link...' : 'Send reset link →'}
            </button>

            <p className="auth-footer-text">
              Remember your password?{' '}
              <Link to="/login">Sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
