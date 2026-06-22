import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'))
  }, [location])

  const handleSignOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('caterer')
    window.location.href = '/'
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">🍽️</div>
          CaterHub
        </Link>

        <ul className="navbar-nav">
          <li><Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link></li>
          <li><Link to="/explore" className={isActive('/explore') ? 'active' : ''}>Explore Caterers</Link></li>
          <li><Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact</Link></li>
          {isLoggedIn && (
            <li><Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>Dashboard</Link></li>
          )}
        </ul>

        <div className="navbar-actions">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard">
                <button className={`btn-ghost ${isActive('/dashboard') ? 'active' : ''}`}
                  style={isActive('/dashboard') ? { color: 'var(--primary)' } : {}}>
                  My Profile
                </button>
              </Link>
              <button className="btn-primary" onClick={handleSignOut}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className={`btn-ghost ${isActive('/login') ? 'active' : ''}`}
                  style={isActive('/login') ? { color: 'var(--primary)' } : {}}>
                  Sign in
                </button>
              </Link>
              <Link to="/register">
                <button className="btn-primary">Register as Vendor</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
