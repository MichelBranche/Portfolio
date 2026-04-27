export function applyDocumentFavicon(href) {
  document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach((el) => {
    el.setAttribute('href', href)
  })
}

export function asArray(value) {
  return Array.isArray(value) ? value.map(String) : [String(value)]
}
