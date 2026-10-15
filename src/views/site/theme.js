// Site theme picked on the homepage: the clicked illustration's colour becomes the
// accent/background of the whole site for this browsing session.
export const THEME_KEY = 'mb:theme'

export function applyTheme(color) {
  const root = document.documentElement
  if (color) {
    root.style.setProperty('--theme', color)
    root.dataset.theme = 'art'
  } else {
    root.style.removeProperty('--theme')
    delete root.dataset.theme
  }
  try {
    if (color) sessionStorage.setItem(THEME_KEY, color)
    else sessionStorage.removeItem(THEME_KEY)
  } catch {
    // storage unavailable: the theme still applies for this page view
  }
}

// Colour fill wipe from the click point, then navigation underneath it.
export function wipe(color, x, y, onCovered) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    onCovered()
    return
  }
  const el = document.createElement('div')
  el.className = 'mb-wipe'
  el.style.setProperty('--wipe', color)
  el.style.setProperty('--x', `${x}px`)
  el.style.setProperty('--y', `${y}px`)
  // The tinted cursor disc (120 px across) becomes the start of the wipe.
  const disc = document.querySelector('.hb-cursor.is-item .hb-cursor-disc')
  if (disc) el.style.setProperty('--r0', '56px')
  document.documentElement.classList.add('mb-wiping')
  document.body.appendChild(el)
  requestAnimationFrame(() => el.classList.add('is-in'))
  window.setTimeout(() => {
    onCovered()
    window.setTimeout(() => {
      el.classList.add('is-out')
      window.setTimeout(() => {
        el.remove()
        document.documentElement.classList.remove('mb-wiping')
      }, 380)
    }, 260)
  }, 360)
}
