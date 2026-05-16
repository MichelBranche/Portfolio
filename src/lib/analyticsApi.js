export async function fetchAdminSession() {
  const res = await fetch('/api/admin/session', { credentials: 'include' })
  const data = await res.json()
  return Boolean(data.authenticated)
}

export async function loginAdmin(password) {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ password }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Accesso negato')
  }
  return true
}

export async function logoutAdmin() {
  await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
}

export async function fetchVisitStats() {
  const res = await fetch('/api/admin/stats', { credentials: 'include' })
  const data = await res.json()
  if (!res.ok) {
    if (res.status === 401) return { unauthorized: true }
    throw new Error(data.error || 'Errore caricamento')
  }
  return { stats: data }
}
