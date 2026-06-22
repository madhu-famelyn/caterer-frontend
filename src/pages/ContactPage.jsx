import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="page-hero-badge">Get in Touch</div>
        <h1>Contact us</h1>
        <p>Have a question for the CaterHub team? We&apos;d love to hear from you.</p>
      </div>

      {/* Contact Grid */}
      <div className="contact-grid">
        {/* Left: Info Cards */}
        <div>
          <div className="contact-info-card">
            <div className="contact-info-icon">📍</div>
            <div>
              <h4>Address</h4>
              <p>200 Market Street, Suite 12, San Francisco, CA 94105</p>
            </div>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-icon">📞</div>
            <div>
              <h4>Phone</h4>
              <p>+1 (555) 318-2240</p>
            </div>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-icon">✉️</div>
            <div>
              <h4>Email</h4>
              <p>hello@caterhub.app</p>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="contact-form-card">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
              <h2 style={{ marginBottom: '8px' }}>Message sent!</h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Thanks for reaching out. We&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <>
              <h2>Send us a message</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-subject">Subject</label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Tell us more..."
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                  />
                </div>
                <button type="submit" className="btn-submit">
                  Send message →
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
