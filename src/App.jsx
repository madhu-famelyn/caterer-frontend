import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import CatererProfilePage from './pages/CatererProfilePage'
import DashboardPage from './pages/DashboardPage'
import './index.css'

function Layout({ children, hideFooter = false }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Layout>
            <HomePage />
          </Layout>
        } />
        <Route path="/explore" element={
          <Layout>
            <ExplorePage />
          </Layout>
        } />
        <Route path="/contact" element={
          <Layout>
            <ContactPage />
          </Layout>
        } />
        <Route path="/login" element={
          <Layout>
            <LoginPage />
          </Layout>
        } />
        <Route path="/register" element={
          <Layout>
            <RegisterPage />
          </Layout>
        } />
        <Route path="/forgot-password" element={
          <Layout>
            <ForgotPasswordPage />
          </Layout>
        } />
        <Route path="/reset-password" element={
          <Layout>
            <ResetPasswordPage />
          </Layout>
        } />
        <Route path="/dashboard" element={
          <Layout>
            <DashboardPage />
          </Layout>
        } />
        <Route path="/caterer/:id" element={
          <Layout>
            <CatererProfilePage />
          </Layout>
        } />
        <Route path="*" element={
          <Layout hideFooter>
            <div style={{ textAlign: 'center', padding: '120px 24px' }}>
              <p style={{ fontSize: '4rem' }}>🍽️</p>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '16px 0 8px' }}>Page not found</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Let&apos;s get you back on track.</p>
              <a href="/">
                <button className="btn-primary" style={{ marginTop: '24px', padding: '12px 28px' }}>
                  Go home
                </button>
              </a>
            </div>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
