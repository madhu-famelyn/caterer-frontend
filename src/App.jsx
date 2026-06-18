import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

function App() {
  const [health, setHealth] = useState({ status: 'checking', detail: 'Connecting to backend...' })
  const [caterers, setCaterers] = useState([])
  const [error, setError] = useState('')

  const apiUrl = useMemo(() => API_BASE_URL.replace(/\/$/, ''), [])

  useEffect(() => {
    const controller = new AbortController()

    async function connectBackend() {
      try {
        setError('')

        const healthResponse = await fetch(`${apiUrl}/health`, {
          signal: controller.signal,
        })

        if (!healthResponse.ok) {
          throw new Error(`Health check failed (${healthResponse.status})`)
        }

        const healthData = await healthResponse.json()
        setHealth({
          status: healthData.status || 'ok',
          detail: `${healthData.service || 'backend'} is reachable`,
        })

        const catererResponse = await fetch(`${apiUrl}/api/v1/caterers/?limit=6`, {
          signal: controller.signal,
        })

        if (!catererResponse.ok) {
          throw new Error(`Caterer request failed (${catererResponse.status})`)
        }

        const catererData = await catererResponse.json()
        setCaterers(Array.isArray(catererData) ? catererData : [])
      } catch (err) {
        if (err.name !== 'AbortError') {
          setHealth({ status: 'offline', detail: 'Backend is not reachable' })
          setError(err.message)
        }
      }
    }

    connectBackend()

    return () => controller.abort()
  }, [apiUrl])

  return (
    <main className="app-shell">
      <section className="status-panel">
        <div>
          <p className="eyebrow">Find Caterer</p>
          <h1>Frontend connected to FastAPI</h1>
          <p className="lede">API base: {apiUrl}</p>
        </div>

        <div className={`status-pill ${health.status === 'ok' ? 'online' : 'offline'}`}>
          <span aria-hidden="true" />
          {health.status}
        </div>
      </section>

      <section className="grid">
        <article className="metric-card">
          <p>Backend</p>
          <strong>{health.detail}</strong>
        </article>
        <article className="metric-card">
          <p>Caterers loaded</p>
          <strong>{caterers.length}</strong>
        </article>
      </section>

      {error && <p className="error">{error}</p>}

      <section className="list-section">
        <h2>Caterers</h2>
        <div className="caterer-list">
          {caterers.length === 0 && !error ? (
            <p className="empty">Connected, but no caterers returned yet.</p>
          ) : (
            caterers.map((caterer) => (
              <article className="caterer-card" key={caterer.id}>
                <h3>{caterer.business_name || 'Unnamed caterer'}</h3>
                <p>{[caterer.city, caterer.state].filter(Boolean).join(', ') || 'Location not added'}</p>
                <span>{caterer.cuisine_type || 'Cuisine not added'}</span>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  )
}

export default App
