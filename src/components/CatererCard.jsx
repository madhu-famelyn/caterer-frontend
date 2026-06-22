import { Link } from 'react-router-dom'

function Stars({ count = 5 }) {
  return (
    <div className="stars">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  )
}

export default function CatererCard({ caterer }) {
  const {
    id,
    business_name,
    city,
    state,
    cuisine_type,
    rating = 4.9,
    review_count = 0,
    price_per_guest,
    image_url,
    tags = [],
    verified = true,
  } = caterer

  const location = [city, state].filter(Boolean).join(', ') || 'Location TBD'
  const displayName = business_name || 'Unnamed Caterer'
  const price = price_per_guest ? `From ₹${price_per_guest}/guest` : 'Contact for pricing'

  const fallbackImages = [
    'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80',
  ]
  const imgSrc = image_url || fallbackImages[id % fallbackImages.length] || fallbackImages[0]

  return (
    <article className="caterer-card">
      <div className="caterer-card-img">
        <img
          src={imgSrc}
          alt={displayName}
          onError={(e) => { e.target.src = fallbackImages[0] }}
        />
        <div className="caterer-card-badges">
          {verified && (
            <span className="badge-verified">
              🛡️ Verified
            </span>
          )}
          <span className="badge-price">{price}</span>
        </div>
      </div>

      <div className="caterer-card-body">
        <div className="caterer-card-header">
          <h3 className="caterer-card-name">{displayName}</h3>
          <div className="caterer-card-rating">
            <span className="score">{rating.toFixed(1)}</span>
            <span className="reviews">{review_count.toLocaleString()} reviews</span>
          </div>
        </div>

        <Stars />

        <div className="caterer-card-location">
          📍 {location}
        </div>

        <div className="caterer-card-tags">
          {cuisine_type && <span className="tag">{cuisine_type}</span>}
          {tags.slice(0, 2).map((t, i) => (
            <span key={i} className="tag">{t}</span>
          ))}
        </div>

        <Link to={`/caterer/${id}`} className="caterer-card-link">
          View profile <span>›</span>
        </Link>
      </div>
    </article>
  )
}
