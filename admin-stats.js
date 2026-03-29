/**
 * Grafici statistiche admin: GET /api/stats (visite, CV, contatti, click Live per progetto).
 */
;(function () {
  var STATS_URL = '/api/stats'

  function pickTitle(p) {
    if (!p || !p.title) return '—'
    if (typeof p.title === 'object') return p.title.it || p.title.en || '#' + p.id
    return String(p.title)
  }

  function getProjectsForLabels() {
    var a = window.__ADMIN_PROJECTS_FOR_STATS__
    if (a && a.length) return a
    var d = window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.projects
    return d && d.length ? d : []
  }

  function findProjectName(id, list) {
    var n = Number(id)
    for (var i = 0; i < list.length; i++) {
      if (list[i] && list[i].id === n) return pickTitle(list[i])
    }
    return '#' + id
  }

  function barRow(label, value, max, color) {
    var pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
    var c = color || '#ffe500'
    return (
      '<div class="admin-bar-row">' +
      '<span class="admin-bar-label">' +
      escapeHtml(label) +
      '</span>' +
      '<div class="admin-bar-track" role="presentation">' +
      '<div class="admin-bar-fill" style="width:' +
      pct +
      '%;background:' +
      c +
      '"></div>' +
      '</div>' +
      '<span class="admin-bar-num">' +
      value +
      '</span>' +
      '</div>'
    )
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;')
  }

  function renderOverview(d) {
    var el = document.getElementById('stats-bars-overview')
    if (!el) return
    var v = Math.max(0, parseInt(d.visits, 10) || 0)
    var cv = Math.max(0, parseInt(d.cvDownloads, 10) || 0)
    var c = Math.max(0, parseInt(d.contacts, 10) || 0)
    var max = Math.max(v, cv, c, 1)
    el.innerHTML =
      barRow('Visite al sito', v, max, '#ffe500') +
      barRow('Download CV', cv, max, '#00bae2') +
      barRow('Messaggi di contatto', c, max, '#00d26a')
  }

  function renderProjects(d) {
    var el = document.getElementById('stats-bars-projects')
    if (!el) return
    var pv = d.projectVisits && typeof d.projectVisits === 'object' ? d.projectVisits : {}
    var keys = Object.keys(pv)
    var list = getProjectsForLabels()
    if (!keys.length) {
      el.innerHTML =
        '<p class="admin-stats-empty">Nessun click «Live» registrato ancora (o Redis non configurato).</p>'
      return
    }
    var rows = []
    for (var i = 0; i < keys.length; i++) {
      var id = keys[i]
      var val = Math.max(0, parseInt(pv[id], 10) || 0)
      rows.push({ id: id, val: val, name: findProjectName(id, list) })
    }
    rows.sort(function (a, b) {
      return b.val - a.val
    })
    var max = rows[0] ? Math.max(rows[0].val, 1) : 1
    var html = ''
    var colors = ['#ff2d78', '#ffe500', '#00bae2', '#abff84', '#9d95ff', '#ff8709', '#0ae448']
    for (var j = 0; j < rows.length; j++) {
      var r = rows[j]
      var label = '#' + r.id + ' · ' + r.name
      html += barRow(label, r.val, max, colors[j % colors.length])
    }
    el.innerHTML = html
  }

  function setMeta(d) {
    var el = document.getElementById('stats-meta-line')
    if (!el) return
    var t = new Date()
    el.textContent =
      'Aggiornato alle ' +
      t.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
      ' · Totale visite: ' +
      (d.visits || 0)
  }

  function loadAdminStats() {
    var overview = document.getElementById('stats-bars-overview')
    var projects = document.getElementById('stats-bars-projects')
    if (overview)
      overview.innerHTML =
        '<p class="admin-stats-empty" style="margin:0">Caricamento…</p>'
    if (projects)
      projects.innerHTML =
        '<p class="admin-stats-empty" style="margin:0">Caricamento…</p>'

    fetch(STATS_URL + '?t=' + Date.now(), { cache: 'no-store', credentials: 'same-origin' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status)
        return r.json()
      })
      .then(function (d) {
        renderOverview(d)
        renderProjects(d)
        setMeta(d)
      })
      .catch(function () {
        if (overview)
          overview.innerHTML =
            '<p class="admin-stats-empty admin-stats-empty--err">Impossibile caricare /api/stats.</p>'
        if (projects) projects.innerHTML = ''
        var m = document.getElementById('stats-meta-line')
        if (m) m.textContent = 'Errore di rete o API non disponibile.'
      })
  }

  window.loadAdminStats = loadAdminStats

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('btn-refresh-stats')
    if (btn) btn.addEventListener('click', loadAdminStats)
  })
})()
