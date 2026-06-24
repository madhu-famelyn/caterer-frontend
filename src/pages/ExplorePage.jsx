import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import CatererCard from '../components/CatererCard'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'


const CITIES = ['All cities', 'Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur']
const CATEGORIES = ['All categories', 'North Indian', 'South Indian', 'Bengali & Fusion', 'Coastal', 'Mughlai', 'Street Food', 'Gujarati', 'Rajasthani', 'Italian', 'Chinese']
const SORT_OPTIONS = ['Top rated', 'Most reviewed', 'Price: Low to High', 'Price: High to Low']

export default function ExplorePage() {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [city, setCity] = useState('All cities')
  const [category, setCategory] = useState('All categories')
  const [sort, setSort] = useState('Top rated')
  const [caterers, setCaterers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiUrl = API_BASE_URL.replace(/\/$/, '')
    setLoading(true)
    fetch(`${apiUrl}/api/v1/caterers/?limit=100`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        if (Array.isArray(data)) setCaterers(data)
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
    const matchCategory = category === 'All categories' || 
      c.cuisine_type?.split(',').map(x => x.trim().toLowerCase()).includes(category.toLowerCase())
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
