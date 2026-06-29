const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

/**
 * Standardize, clean, and resolve image URLs.
 * 1. Skips expired Google Maps photo references to prevent 404 noise.
 * 2. Extracts first clean URL from nested `photo_folder:` strings.
 * 3. Resolves local relative paths by prepending backend server API host.
 * 
 * @param {string|null|undefined} url - Raw image URL
 * @returns {string} Cleaned absolute image URL or empty string
 */
export function cleanImageUrl(url) {
  if (!url) return ''
  
  // Google Maps photo references expire — treat them as empty to avoid 404 noise
  if (
    url.includes('lh5.googleusercontent.com') ||
    url.includes('lh3.googleusercontent.com') ||
    url.includes('googleusercontent.com/p/AF1Qip')
  ) {
    return ''
  }

  // Parse photo_folder strings
  if (url.startsWith('photo_folder:')) {
    const matches = url.match(/https?:\/\/[^\s,\]\['"‘’“”]+/)
    if (matches && matches[0]) {
      url = matches[0].replace(/['"‘’“”\]\[,]+$/, '')
    } else {
      return ''
    }
  }

  // Resolve local upload paths
  if (url.startsWith('/uploads') || url.startsWith('uploads/')) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`
    return `${API_BASE_URL}${cleanPath}`
  }

  return url
}
