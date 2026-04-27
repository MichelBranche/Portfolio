/**
 * Estrae l'id video e l’URL del poster (ytimg) da un URL YouTube o youtu.be.
 * Usato da VisualSection e, se serve, da altri componenti.
 */
export function getYoutubeIdFromUrl(input) {
  if (!input) return ''
  try {
    const url = new URL(input)
    if (url.hostname.includes('youtu.be')) {
      return url.pathname.replace('/', '').trim()
    }
    if (url.hostname.includes('youtube.com')) {
      if (url.pathname.startsWith('/embed/')) {
        return url.pathname.replace('/embed/', '').trim()
      }
      return url.searchParams.get('v') || ''
    }
  } catch {
    return ''
  }
  return ''
}

export function youtubePosterUrl(url) {
  const id = getYoutubeIdFromUrl(url)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : ''
}
