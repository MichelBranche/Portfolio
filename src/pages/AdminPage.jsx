import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { isAdminConfigured } from '../config/admin.js'
import {
  fetchAdminSession,
  fetchVisitStats,
  loginAdmin,
  logoutAdmin,
} from '../lib/analyticsApi.js'
import './AdminPage.css'

const CHART_COLORS = ['#ff3300', '#0a0a0a', '#6b6b6b', '#c4c4c4', '#2a2a2a', '#ff6b4a']

function formatNumber(n) {
  return new Intl.NumberFormat('it-IT').format(n)
}

function formatDateTime(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleString('it-IT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function StatCard({ label, value, hint }) {
  return (
    <article className="admin-stat">
      <p className="admin-stat__label">{label}</p>
      <p className="admin-stat__value">{value}</p>
      {hint ? <p className="admin-stat__hint">{hint}</p> : null}
    </article>
  )
}

function ChartCard({ title, subtitle, children }) {
  return (
    <section className="admin-chart-card">
      <header className="admin-chart-card__head">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </header>
      <div className="admin-chart-card__body">{children}</div>
    </section>
  )
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="admin-tooltip">
      <p className="admin-tooltip__label">{label}</p>
      <p className="admin-tooltip__value">{formatNumber(payload[0].value)} visite</p>
    </div>
  )
}

function LoginView({ onLogin, error, loading }) {
  const [password, setPassword] = useState('')
  const configured = isAdminConfigured()

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(password)
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <p className="admin-login__eyebrow">Portfolio</p>
        <h1>Area admin</h1>
        <p className="admin-login__desc">Inserisci la password per vedere le statistiche delle visite.</p>
        {!configured ? (
          <p className="admin-login__hint">
            Aggiungi <code>VITE_ADMIN_PASSWORD</code> in <code>.env.local</code> (e su Vercel in
            Environment Variables), poi riavvia il dev server.
          </p>
        ) : (
          <p className="admin-login__hint admin-login__hint--muted">
            Le statistiche mostrano solo visite reali dal sito online (non localhost).
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <label className="admin-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error ? <p className="admin-error" role="alert">{error}</p> : null}
          <button type="submit" className="admin-btn admin-btn--primary" disabled={loading || !configured}>
            {loading ? 'Accesso…' : 'Accedi'}
          </button>
        </form>
        <Link to="/" className="admin-back">
          ← Torna al sito
        </Link>
      </div>
    </div>
  )
}

function Dashboard({ stats, onLogout, loading }) {
  const { summary, dailySeries, hourlySeries, topReferrers, topPaths, lastVisitAt } = stats

  const referrerData = useMemo(
    () => topReferrers.map((r, i) => ({ ...r, fill: CHART_COLORS[i % CHART_COLORS.length] })),
    [topReferrers],
  )

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <p className="admin-header__eyebrow">Analytics</p>
          <h1>Visite del sito</h1>
          <p className="admin-header__meta">
            Ultima visita: {formatDateTime(lastVisitAt)} · visite reali dei visitatori
          </p>
        </div>
        <div className="admin-header__actions">
          <Link to="/" className="admin-btn admin-btn--ghost">
            Sito
          </Link>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={onLogout} disabled={loading}>
            Esci
          </button>
        </div>
      </header>

      <div className="admin-stats-grid">
        <StatCard label="Oggi" value={formatNumber(summary.today)} hint={`${formatNumber(summary.uniqueToday)} sessioni`} />
        <StatCard label="7 giorni" value={formatNumber(summary.week)} hint={`${formatNumber(summary.uniqueWeek)} sessioni`} />
        <StatCard label="30 giorni" value={formatNumber(summary.month)} hint={`${formatNumber(summary.uniqueMonth)} sessioni`} />
        <StatCard label="Totale" value={formatNumber(summary.total)} hint={`${formatNumber(summary.uniqueSessions)} sessioni`} />
      </div>

      <div className="admin-charts-grid">
        <ChartCard title="Andamento" subtitle="Ultime 4 settimane">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dailySeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="visitsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff3300" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#ff3300" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(10,10,10,0.08)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#6b6b6b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: '#6b6b6b', fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="visits" stroke="#ff3300" strokeWidth={2.5} fill="url(#visitsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Per ora" subtitle="Distribuzione nelle ultime 4 settimane">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={hourlySeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(10,10,10,0.08)" vertical={false} />
              <XAxis dataKey="hour" tick={{ fill: '#6b6b6b', fontSize: 10 }} interval={3} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: '#6b6b6b', fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="visits" fill="#0a0a0a" radius={[6, 6, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Provenienza" subtitle="Top referrer (30 giorni)">
          {referrerData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={referrerData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={96}
                  paddingAngle={3}
                  stroke="none"
                >
                  {referrerData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatNumber(value), 'visite']}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid rgba(10,10,10,0.12)',
                    boxShadow: '0 12px 40px rgba(10,10,10,0.08)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="admin-empty">Nessun referrer ancora.</p>
          )}
          <ul className="admin-legend">
            {referrerData.map((r) => (
              <li key={r.name}>
                <span className="admin-legend__dot" style={{ background: r.fill }} />
                <span>{r.name}</span>
                <strong>{formatNumber(r.value)}</strong>
              </li>
            ))}
          </ul>
        </ChartCard>

        <ChartCard title="Pagine" subtitle="Percorsi più visitati">
          {topPaths.length ? (
            <ul className="admin-path-list">
              {topPaths.map((p, i) => {
                const max = topPaths[0]?.value || 1
                const pct = Math.round((p.value / max) * 100)
                return (
                  <li key={p.name}>
                    <div className="admin-path-list__row">
                      <span>{p.name}</span>
                      <strong>{formatNumber(p.value)}</strong>
                    </div>
                    <div className="admin-path-list__bar">
                      <span style={{ width: `${pct}%`, background: CHART_COLORS[i % CHART_COLORS.length] }} />
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="admin-empty">Nessuna pagina registrata.</p>
          )}
        </ChartCard>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(null)
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loadStats = useCallback(async () => {
    const result = await fetchVisitStats()
    if (result.unauthorized) {
      setAuthenticated(false)
      setStats(null)
      return
    }
    setStats(result.stats)
  }, [])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const authed = await fetchAdminSession()
        if (cancelled) return
        setAuthenticated(authed)
        if (authed) await loadStats()
      } catch (err) {
        if (!cancelled) setError(err.message || 'Errore di rete')
        if (!cancelled) setAuthenticated(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [loadStats])

  const handleLogin = async (password) => {
    setLoading(true)
    setError('')

    if (!isAdminConfigured()) {
      setError('Configura admin.local.js e .env.local con ADMIN_PASSWORD')
      setLoading(false)
      return
    }

    try {
      await loginAdmin(password)
      setAuthenticated(true)
      await loadStats()
    } catch (err) {
      setError(err.message || 'Accesso negato')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      await logoutAdmin()
    } finally {
      setAuthenticated(false)
      setStats(null)
      setLoading(false)
    }
  }

  if (authenticated === null) {
    return <div className="admin-page admin-page--loading">Caricamento…</div>
  }

  if (!authenticated) {
    return (
      <div className="admin-page">
        <LoginView onLogin={handleLogin} error={error} loading={loading} />
      </div>
    )
  }

  return (
    <div className="admin-page">
      {stats ? (
        <Dashboard stats={stats} onLogout={handleLogout} loading={loading} />
      ) : (
        <div className="admin-page admin-page--loading">{error || 'Caricamento statistiche…'}</div>
      )}
    </div>
  )
}
