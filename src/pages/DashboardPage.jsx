import { useState, useEffect } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export default function DashboardPage() {
  const token = localStorage.getItem('token')
  const localCaterer = JSON.parse(localStorage.getItem('caterer') || '{}')
  const catererId = localCaterer.id

  // Redirect if not logged in
  if (!token || !catererId) {
    window.location.href = '/login'
    return null
  }

  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' }) // type: 'success' | 'error'

  // Dashboard Data State
  const [profile, setProfile] = useState(null)
  const [gallery, setGallery] = useState([])
  const [awards, setAwards] = useState([])
  const [certifications, setCertifications] = useState([])
  const [licenses, setLicenses] = useState([])
  
  const [reviews, setReviews] = useState([])

  // Form States
  const [profileForm, setProfileForm] = useState({
    business_name: '',
    owner_name: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cuisine_type: '',
    bio: '',
    price_per_guest: '',
    service_tags: '',
    image_url: ''
  })

  const [newGalleryForm, setNewGalleryForm] = useState({ file_url: '', type: 'photo' })
  const [newAwardForm, setNewAwardForm] = useState({ title: '', year: '', description: '', image_url: '' })
  const [newCertForm, setNewCertForm] = useState({ title: '', issued_by: '', certificate_url: '', issue_date: '' })
  const [newLicenseForm, setNewLicenseForm] = useState({ title: '', description: '', document_url: '', expiry_date: '' })

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 5000)
  }

  const apiUrl = API_BASE_URL.replace(/\/$/, '')

  // Fetch all vendor data
  const fetchData = async () => {
    setLoading(true)
    try {
      const headers = { 'Authorization': `Bearer ${token}` }
      
      // Profile
      const profileRes = await fetch(`${apiUrl}/api/v1/caterers/${catererId}`)
      if (profileRes.ok) {
        const data = await profileRes.json()
        setProfile(data)
        setProfileForm({
          business_name: data.business_name || '',
          owner_name: data.owner_name || '',
          mobile: data.mobile || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zip: data.zip || '',
          cuisine_type: data.cuisine_type || '',
          bio: data.bio || '',
          price_per_guest: data.price_per_guest || '',
          service_tags: (data.tags || []).join(', '),
          image_url: data.image_url || ''
        })
      }

      // Gallery
      const galleryRes = await fetch(`${apiUrl}/api/v1/gallery/?caterer_id=${catererId}`)
      if (galleryRes.ok) setGallery(await galleryRes.json())

      // Awards
      const awardsRes = await fetch(`${apiUrl}/api/v1/awards/?caterer_id=${catererId}`, { headers })
      if (awardsRes.ok) setAwards(await awardsRes.json())

      // Certifications
      const certsRes = await fetch(`${apiUrl}/api/v1/certifications/?caterer_id=${catererId}`, { headers })
      if (certsRes.ok) setCertifications(await certsRes.json())

      // Licenses
      const licRes = await fetch(`${apiUrl}/api/v1/licenses/?caterer_id=${catererId}`, { headers })
      if (licRes.ok) setLicenses(await licRes.json())

      // Reviews
      const revRes = await fetch(`${apiUrl}/api/v1/reviews/?caterer_id=${catererId}`)
      if (revRes.ok) setReviews(await revRes.json())

    } catch (err) {
      console.error(err)
      showMsg('Failed to load dashboard data.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ── Handlers ──────────────────────────────────────────────────────────────────

  // Handle local file upload to backend
  const handleFileUpload = async (file, onUploadSuccess) => {
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/api/v1/upload`, {
        method: 'POST',
        body: formData
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || 'File upload failed')
      }
      const data = await res.json()
      const absoluteUrl = `${apiUrl}${data.file_url}`
      onUploadSuccess(absoluteUrl)
      showMsg('File uploaded successfully!')
    } catch (err) {
      showMsg(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let imageUrl = profileForm.image_url
      if (imageUrl) {
        const urlRegex = /https?:\/\/[^\s'",\]]+[^\s'",\]\.]/g;
        const urls = imageUrl.match(urlRegex) || [];
        if (urls.length > 0) {
          imageUrl = urls[0]
        }
      }
      const payload = {
        ...profileForm,
        image_url: imageUrl,
        price_per_guest: profileForm.price_per_guest ? Number(profileForm.price_per_guest) : null,
        service_tags: profileForm.service_tags.split(',').map(t => t.trim()).filter(Boolean)
      }
      const res = await fetch(`${apiUrl}/api/v1/caterers/${catererId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to update profile')
      const data = await res.json()
      setProfile(data)
      localStorage.setItem('caterer', JSON.stringify(data))
      showMsg('Profile details updated successfully!')
    } catch (err) {
      showMsg(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Gallery handlers
  const handleAddGallery = async (e) => {
    e.preventDefault()
    if (!newGalleryForm.file_url) return
    setLoading(true)
    const urlRegex = /https?:\/\/[^\s'",\]]+[^\s'",\]\.]/g;
    const urls = newGalleryForm.file_url.match(urlRegex) || [];
    if (urls.length === 0) {
      showMsg('No valid image URLs found in input.', 'error')
      setLoading(false)
      return
    }
    try {
      let successCount = 0
      const uploadedItems = []
      for (const url of urls) {
        const res = await fetch(`${apiUrl}/api/v1/gallery/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ...newGalleryForm, file_url: url })
        })
        if (res.ok) {
          const data = await res.json()
          uploadedItems.push(data)
          successCount++
        }
      }
      if (successCount > 0) {
        setGallery([...gallery, ...uploadedItems])
        showMsg(`Successfully uploaded ${successCount} item(s) to gallery!`)
      } else {
        throw new Error('Upload failed')
      }
      setNewGalleryForm({ file_url: '', type: 'photo' })
    } catch (err) {
      showMsg(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGallery = async (id) => {
    if (!confirm('Delete this gallery item?')) return
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/api/v1/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Delete failed')
      setGallery(gallery.filter(item => item.id !== id))
      showMsg('Gallery item deleted.')
    } catch (err) {
      showMsg(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Awards handlers
  const handleAddAward = async (e) => {
    e.preventDefault()
    if (!newAwardForm.title) return
    setLoading(true)
    try {
      let imageUrl = newAwardForm.image_url
      if (imageUrl) {
        const urlRegex = /https?:\/\/[^\s'",\]]+[^\s'",\]\.]/g;
        const urls = imageUrl.match(urlRegex) || [];
        if (urls.length > 0) {
          imageUrl = urls[0]
        }
      }
      const payload = {
        ...newAwardForm,
        image_url: imageUrl,
        year: newAwardForm.year ? Number(newAwardForm.year) : null
      }
      const res = await fetch(`${apiUrl}/api/v1/awards/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Add award failed')
      const data = await res.json()
      setAwards([...awards, data])
      setNewAwardForm({ title: '', year: '', description: '', image_url: '' })
      showMsg('Award added successfully!')
    } catch (err) {
      showMsg(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAward = async (id) => {
    if (!confirm('Delete this award?')) return
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/api/v1/awards/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Delete failed')
      setAwards(awards.filter(a => a.id !== id))
      showMsg('Award deleted successfully.')
    } catch (err) {
      showMsg(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Certifications handlers
  const handleAddCert = async (e) => {
    e.preventDefault()
    if (!newCertForm.title) return
    setLoading(true)
    try {
      const payload = {
        ...newCertForm,
        issue_date: newCertForm.issue_date ? new Date(newCertForm.issue_date).toISOString() : null
      }
      const res = await fetch(`${apiUrl}/api/v1/certifications/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Add certification failed')
      const data = await res.json()
      setCertifications([...certifications, data])
      setNewCertForm({ title: '', issued_by: '', certificate_url: '', issue_date: '' })
      showMsg('Certification added!')
    } catch (err) {
      showMsg(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCert = async (id) => {
    if (!confirm('Delete this certification?')) return
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/api/v1/certifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Delete failed')
      setCertifications(certifications.filter(c => c.id !== id))
      showMsg('Certification deleted.')
    } catch (err) {
      showMsg(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Licenses handlers
  const handleAddLicense = async (e) => {
    e.preventDefault()
    if (!newLicenseForm.title) return
    setLoading(true)
    try {
      const payload = {
        ...newLicenseForm,
        expiry_date: newLicenseForm.expiry_date ? new Date(newLicenseForm.expiry_date).toISOString() : null
      }
      const res = await fetch(`${apiUrl}/api/v1/licenses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Add license failed')
      const data = await res.json()
      setLicenses([...licenses, data])
      setNewLicenseForm({ title: '', description: '', document_url: '', expiry_date: '' })
      showMsg('License added!')
    } catch (err) {
      showMsg(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLicense = async (id) => {
    if (!confirm('Delete this license?')) return
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/api/v1/licenses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Delete failed')
      setLicenses(licenses.filter(l => l.id !== id))
      showMsg('License deleted.')
    } catch (err) {
      showMsg(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // ── UI Render Parts ───────────────────────────────────────────────────────────

  return (
    <div className="container" style={{ padding: '40px 24px', minHeight: 'calc(100vh - 120px)' }}>
      {/* Header Info */}
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px', marginBottom: '32px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Vendor Dashboard</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '4px 0 8px', color: 'var(--text-primary)' }}>
              {profile?.business_name || 'My Business'}
            </h1>
            <div style={{ display: 'flex', gap: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
              <span>👤 {profile?.owner_name}</span>
              <span>📍 {profile?.city}, {profile?.state}</span>
              <span>⭐ {profile?.rating ? profile.rating.toFixed(1) : '0.0'} ({profile?.review_count || 0} reviews)</span>
              {profile?.verified && <span style={{ color: 'var(--primary)', fontWeight: 600 }}>🛡️ Verified Partner</span>}
            </div>
          </div>
          <div>
            <a href={`/caterer/${catererId}`} target="_blank" rel="noreferrer">
              <button className="btn-secondary" style={{ padding: '10px 20px', display: 'flex', gap: '6px' }}>
                👁️ View Public Profile
              </button>
            </a>
          </div>
        </div>
      </div>

      {message.text && (
        <div style={{
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          fontWeight: 500,
          fontSize: '0.9375rem',
          border: '1px solid',
          color: message.type === 'error' ? '#ef4444' : '#15803d',
          background: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
          borderColor: message.type === 'error' ? '#fecaca' : '#bbf7d0',
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px', alignItems: 'start' }}>
        {/* Navigation Sidebar */}
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: 'var(--shadow-sm)' }}>
          {[
            { id: 'profile', label: '📊 Profile & Details' },
            { id: 'gallery', label: '🖼️ Gallery Images' },
            { id: 'awards', label: '🏆 Awards & Recognition' },
            { id: 'certifications', label: '📜 Certifications' },
            { id: 'licenses', label: '🛡️ Licenses' },
            { id: 'reviews', label: `⭐ Reviews (${reviews.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                textAlign: 'left',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                background: activeTab === tab.id ? 'var(--primary-light)' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '36px', boxShadow: 'var(--shadow-sm)', minHeight: '400px' }}>
          {loading && <div style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Processing...</div>}

          {/* ── PROFILE PANEL ── */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>Edit Profile Details</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Business Name</label>
                  <input type="text" value={profileForm.business_name} onChange={e => setProfileForm({ ...profileForm, business_name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Owner Name</label>
                  <input type="text" value={profileForm.owner_name} onChange={e => setProfileForm({ ...profileForm, owner_name: e.target.value })} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Mobile number</label>
                  <input type="text" value={profileForm.mobile} onChange={e => setProfileForm({ ...profileForm, mobile: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Cover Image URL or File Upload</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input type="text" placeholder="https://images.unsplash.com/..." value={profileForm.image_url} onChange={e => setProfileForm({ ...profileForm, image_url: e.target.value })} style={{ flexGrow: 1 }} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileUpload(e.target.files[0], (url) => setProfileForm({ ...profileForm, image_url: url }))}
                      style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                      id="frontend-profile-image-file"
                    />
                    <label htmlFor="frontend-profile-image-file" className="btn btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap', margin: 0, padding: '10px 14px' }}>
                      📁 Upload File
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Business Address</label>
                <input type="text" value={profileForm.address} onChange={e => setProfileForm({ ...profileForm, address: e.target.value })} />
              </div>

              <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                <div className="form-group">
                  <label>City</label>
                  <input type="text" value={profileForm.city} onChange={e => setProfileForm({ ...profileForm, city: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input type="text" value={profileForm.state} onChange={e => setProfileForm({ ...profileForm, state: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Pin Code</label>
                  <input type="text" value={profileForm.zip} onChange={e => setProfileForm({ ...profileForm, zip: e.target.value })} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Cuisine Type</label>
                  <input type="text" placeholder="e.g. North Indian" value={profileForm.cuisine_type} onChange={e => setProfileForm({ ...profileForm, cuisine_type: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Price per guest (₹)</label>
                  <input type="number" value={profileForm.price_per_guest} onChange={e => setProfileForm({ ...profileForm, price_per_guest: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label>Service Tags (comma-separated)</label>
                <input type="text" placeholder="Weddings, Corporate, Fine Dining" value={profileForm.service_tags} onChange={e => setProfileForm({ ...profileForm, service_tags: e.target.value })} />
              </div>

              <div className="form-group">
                <label>About Business</label>
                <textarea rows={4} value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} />
              </div>

              <button type="submit" className="btn-submit" style={{ marginTop: '16px' }} disabled={loading}>
                Save Changes
              </button>
            </form>
          )}

          {/* ── GALLERY PANEL ── */}
          {activeTab === 'gallery' && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px' }}>Catering Gallery</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>Upload photos or fuse links to showcase food presentations, setups, and events.</p>

              {/* Grid of gallery */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                {gallery.map(item => (
                  <div key={item.id} style={{ position: 'relative', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '140px', background: '#f1f5f9' }}>
                    <img src={item.file_url} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555244162-803834f70033?w=300' }} />
                    <button
                      onClick={() => handleDeleteGallery(item.id)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(239, 68, 68, 0.9)',
                        color: 'white',
                        border: 'none',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifycontent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                      }}
                      title="Delete image"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {gallery.length === 0 && (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                    No photos uploaded yet.
                  </div>
                )}
              </div>

              {/* Add form */}
              <form onSubmit={handleAddGallery} style={{ background: 'var(--bg-light)', border: '1px solid var(--border)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Add Photo URL</h3>
                <div className="form-group">
                  <label>Image Link or File Upload</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={newGalleryForm.file_url}
                      onChange={e => setNewGalleryForm({ ...newGalleryForm, file_url: e.target.value })}
                      required
                      style={{ flexGrow: 1 }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileUpload(e.target.files[0], (url) => setNewGalleryForm({ ...newGalleryForm, file_url: url }))}
                      style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                      id="frontend-gallery-image-file"
                    />
                    <label htmlFor="frontend-gallery-image-file" className="btn btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap', margin: 0, padding: '10px 14px' }}>
                      📁 Upload File
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '10px 20px' }} disabled={loading}>
                  Add Photo
                </button>
              </form>
            </div>
          )}

          {/* ── AWARDS PANEL ── */}
          {activeTab === 'awards' && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px' }}>Awards & Achievements</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>Add culinary accolades, event credentials, or local awards to win customer trust.</p>

              {/* List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {awards.map(a => (
                  <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ fontSize: '2rem' }}>🏆</div>
                      <div>
                        <h4 style={{ fontWeight: 700 }}>{a.title} {a.year && <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>({a.year})</span>}</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{a.description}</p>
                      </div>
                    </div>
                    <button className="btn-ghost" onClick={() => handleDeleteAward(a.id)} style={{ color: '#ef4444' }}>
                      Delete
                    </button>
                  </div>
                ))}
                {awards.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                    No awards listed yet. Add one below!
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleAddAward} style={{ background: 'var(--bg-light)', border: '1px solid var(--border)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Add Award</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Award Title</label>
                    <input type="text" placeholder="Best Premium Wedding Caterer" value={newAwardForm.title} onChange={e => setNewAwardForm({ ...newAwardForm, title: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input type="number" placeholder="2025" value={newAwardForm.year} onChange={e => setNewAwardForm({ ...newAwardForm, year: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Accompanying Image URL or File Upload (optional)</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input type="text" placeholder="https://..." value={newAwardForm.image_url} onChange={e => setNewAwardForm({ ...newAwardForm, image_url: e.target.value })} style={{ flexGrow: 1 }} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileUpload(e.target.files[0], (url) => setNewAwardForm({ ...newAwardForm, image_url: url }))}
                      style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                      id="frontend-award-image-file"
                    />
                    <label htmlFor="frontend-award-image-file" className="btn btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap', margin: 0, padding: '10px 14px' }}>
                      📁 Upload File
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea rows={2} placeholder="Briefly describe what this award recognizes..." value={newAwardForm.description} onChange={e => setNewAwardForm({ ...newAwardForm, description: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '10px 20px' }} disabled={loading}>
                  Add Award
                </button>
              </form>
            </div>
          )}

          {/* ── CERTIFICATIONS PANEL ── */}
          {activeTab === 'certifications' && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px' }}>Certifications</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>Add food safety credentials, culinary associations, and professional certifications.</p>

              {/* List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {certifications.map(c => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ fontSize: '2rem' }}>📜</div>
                      <div>
                        <h4 style={{ fontWeight: 700 }}>{c.title}</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          Issued by: {c.issued_by || 'Not Specified'}
                          {c.issue_date && ` | Issued on: ${new Date(c.issue_date).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <button className="btn-ghost" onClick={() => handleDeleteCert(c.id)} style={{ color: '#ef4444' }}>
                      Delete
                    </button>
                  </div>
                ))}
                {certifications.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                    No certifications listed yet.
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleAddCert} style={{ background: 'var(--bg-light)', border: '1px solid var(--border)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Add Certification</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Certification Title</label>
                    <input type="text" placeholder="FSSAI Food Safety Supervisor" value={newCertForm.title} onChange={e => setNewCertForm({ ...newCertForm, title: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Issued By</label>
                    <input type="text" placeholder="FSSAI / FDA" value={newCertForm.issued_by} onChange={e => setNewCertForm({ ...newCertForm, issued_by: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Issue Date</label>
                    <input type="date" value={newCertForm.issue_date} onChange={e => setNewCertForm({ ...newCertForm, issue_date: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Certificate Document URL (optional)</label>
                    <input type="text" placeholder="https://..." value={newCertForm.certificate_url} onChange={e => setNewCertForm({ ...newCertForm, certificate_url: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '10px 20px' }} disabled={loading}>
                  Add Certification
                </button>
              </form>
            </div>
          )}

          {/* ── LICENSES PANEL ── */}
          {activeTab === 'licenses' && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px' }}>Licenses & Permits</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>Add business licenses, municipal permissions, or health permits.</p>

              {/* List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {licenses.map(l => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ fontSize: '2rem' }}>🛡️</div>
                      <div>
                        <h4 style={{ fontWeight: 700 }}>{l.title}</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {l.description}
                          {l.expiry_date && ` | Expires on: ${new Date(l.expiry_date).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <button className="btn-ghost" onClick={() => handleDeleteLicense(l.id)} style={{ color: '#ef4444' }}>
                      Delete
                    </button>
                  </div>
                ))}
                {licenses.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                    No licenses listed yet.
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleAddLicense} style={{ background: 'var(--bg-light)', border: '1px solid var(--border)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Add License</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>License Title</label>
                    <input type="text" placeholder="FSSAI Central Catering License" value={newLicenseForm.title} onChange={e => setNewLicenseForm({ ...newLicenseForm, title: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input type="date" value={newLicenseForm.expiry_date} onChange={e => setNewLicenseForm({ ...newLicenseForm, expiry_date: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Document URL (optional)</label>
                  <input type="text" placeholder="https://..." value={newLicenseForm.document_url} onChange={e => setNewLicenseForm({ ...newLicenseForm, document_url: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>License Description / Details</label>
                  <textarea rows={2} placeholder="Registration number and other details..." value={newLicenseForm.description} onChange={e => setNewLicenseForm({ ...newLicenseForm, description: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '10px 20px' }} disabled={loading}>
                  Add License
                </button>
              </form>
            </div>
          )}

          {/* ── REVIEWS PANEL ── */}
          {activeTab === 'reviews' && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px' }}>Customer Reviews</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>Reviews submitted by customers on your public profile page.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {reviews.map(r => (
                  <div key={r.id} style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: '#fafafa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{r.customer_name}</strong>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                      {Array.from({ length: Math.floor(r.rating) }).map((_, i) => (
                        <span key={i} style={{ color: 'var(--primary)', fontSize: '1rem' }}>★</span>
                      ))}
                      <strong style={{ marginLeft: '4px', fontSize: '0.9rem' }}>{r.rating.toFixed(1)}</strong>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9375rem' }}>
                      {r.comment || 'No comment provided.'}
                    </p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                    No reviews received yet. Share your public profile link to collect customer reviews!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
