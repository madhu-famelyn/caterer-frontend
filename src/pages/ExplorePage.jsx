import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import CatererCard from '../components/CatererCard'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const MOCK_CATERERS = [
  { id: 1, business_name: 'Royal Taj Catering', city: 'Mumbai', state: 'Maharashtra', cuisine_type: 'North Indian', rating: 4.9, review_count: 482, price_per_guest: 1200, image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80', tags: ['Corporate', 'Weddings'], verified: true },
  { id: 2, business_name: 'Masala Bistro', city: 'Kolkata', state: 'West Bengal', cuisine_type: 'Bengali & Fusion', rating: 4.8, review_count: 311, price_per_guest: 450, image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', tags: ['Casual', 'Buffet'], verified: true },
  { id: 3, business_name: 'Saffron Table', city: 'Bangalore', state: 'Karnataka', cuisine_type: 'South Indian & Coastal', rating: 4.9, review_count: 624, price_per_guest: 750, image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80', tags: ['Fine Dining', 'Traditional'], verified: true },
  { id: 4, business_name: 'Delhi Durbar', city: 'Delhi', state: 'NCR', cuisine_type: 'Mughlai', rating: 4.7, review_count: 198, price_per_guest: 950, image_url: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&q=80', tags: ['Weddings', 'Royal'], verified: true },
  { id: 5, business_name: 'Dakshin Delights', city: 'Chennai', state: 'Tamil Nadu', cuisine_type: 'South Indian', rating: 4.8, review_count: 422, price_per_guest: 350, image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', tags: ['Traditional', 'Organic'], verified: true },
  { id: 6, business_name: 'The Jaipur Palace', city: 'Jaipur', state: 'Rajasthan', cuisine_type: 'Rajasthani', rating: 4.6, review_count: 156, price_per_guest: 1100, image_url: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600&q=80', tags: ['Galas', 'Cultural'], verified: true },
  { id: 7, business_name: "Babu's Street Treats", city: 'Delhi', state: 'NCR', cuisine_type: 'Street Food', rating: 4.8, review_count: 340, price_per_guest: 250, image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80', tags: ['Casual', 'Buffet'], verified: true },
  { id: 8, business_name: 'Gujarati Rasoi', city: 'Ahmedabad', state: 'Gujarat', cuisine_type: 'Gujarati', rating: 4.7, review_count: 210, price_per_guest: 500, image_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&q=80', tags: ['Vegetarian', 'Traditional'], verified: true },
  { id: 9, business_name: 'Coastal Curry Co.', city: 'Pune', state: 'Maharashtra', cuisine_type: 'Coastal', rating: 4.9, review_count: 275, price_per_guest: 800, image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80', tags: ['Seafood', 'Fine Dining'], verified: true },
]

const CITIES = ['All cities', 'Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur']
const CATEGORIES = ['All categories', 'North Indian', 'South Indian', 'Bengali & Fusion', 'Coastal', 'Mughlai', 'Street Food', 'Gujarati', 'Rajasthani', 'Italian', 'Chinese']
const SORT_OPTIONS = ['Top rated', 'Most reviewed', 'Price: Low to High', 'Price: High to Low']

export default function ExplorePage() {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [city, setCity] = useState('All cities')
  const [category, setCategory] = useState('All categories')
  const [sort, setSort] = useState('Top rated')
  const [caterers, setCaterers] = useState(MOCK_CATERERS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const apiUrl = API_BASE_URL.replace(/\/$/, '')
    setLoading(true)
    fetch(`${apiUrl}/api/v1/caterers/?limit=20`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCaterers(data)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = caterers.filter((c) => {
    const matchSearch = !search ||
      c.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.city?.toLowerCase().includes(search.toLowerCase()) ||
      c.cuisine_type?.toLowerCase().includes(search.toLowerCase())
    const matchCity = city === 'All cities' || c.city === city
    const matchCategory = category === 'All categories' || c.cuisine_type === category
    return matchSearch && matchCity && matchCategory
  }).sort((a, b) => {
    if (sort === 'Top rated') return (b.rating || 0) - (a.rating || 0)
    if (sort === 'Most reviewed') return (b.review_count || 0) - (a.review_count || 0)
    if (sort === 'Price: Low to High') return (a.price_per_guest || 0) - (b.price_per_guest || 0)
    if (sort === 'Price: High to Low') return (b.price_per_guest || 0) - (a.price_per_guest || 0)
    return 0
  })

  return (
    <div className="explore-page">
      {/* Page Hero */}
      <div className="page-hero">
        <div className="page-hero-badge">Directory</div>
        <h1>Find your perfect caterer</h1>
        <p>Verified, reviewed, and ready to quote your next event.</p>
      </div>

      {/* Filters */}
      <div className="explore-filters">
        <div className="explore-filters-inner">
          <div className="explore-search">
            <span style={{ color: 'var(--text-light)' }}>🔍</span>
            <input
              type="text"
              placeholder="Search name, city or cuisine"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="explore-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>

          <select
            className="explore-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>

          <select
            className="explore-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="explore-results">
        <p className="explore-results-count">
          {loading ? 'Loading...' : `${filtered.length} caterer${filtered.length !== 1 ? 's' : ''} found`}
        </p>
        <div className="caterers-grid">
          {filtered.map((c) => (
            <CatererCard key={c.id} caterer={c} />
          ))}
        </div>
        {filtered.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🍽️</p>
            <h3>No caterers found</h3>
            <p style={{ marginTop: '8px' }}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
