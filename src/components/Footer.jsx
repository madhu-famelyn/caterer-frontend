import { Link } from 'react-router-dom'

const IconInstagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
)

const IconFacebook = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const IconTwitter = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
)

const IconMapPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)


const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="navbar-logo" style={{ display: 'inline-flex' }}>
            <div className="navbar-logo-icon">🍽️</div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: '1.25rem' }}>CaterHub</span>
          </Link>
          <p>The vendor directory built for caterers. Create a beautiful business profile, showcase your work, and connect with more customers.</p>
          <div className="footer-socials">
            <button className="social-btn" aria-label="Instagram"><IconInstagram /></button>
            <button className="social-btn" aria-label="Facebook"><IconFacebook /></button>
            <button className="social-btn" aria-label="Twitter"><IconTwitter /></button>
          </div>
        </div>

        <div className="footer-col">
          <h4>For Caterers</h4>
          <ul>
            <li><Link to="/register">Register as Vendor</Link></li>
            <li><Link to="/login">Vendor Login</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/explore">Browse Directory</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <div className="footer-contact-item">
            <span className="footer-contact-icon"><IconMapPin /></span>
            <span>200 Market Street, Suite 12, San Francisco, CA 94105</span>
          </div>
          <div className="footer-contact-item">
            <span className="footer-contact-icon"><IconMail /></span>
            <a href="mailto:hello@caterhub.app">hello@caterhub.app</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 CaterHub. All rights reserved.</p>
        <p>Built for caterers, by people who love hospitality</p>
      </div>
    </footer>
  )
}
