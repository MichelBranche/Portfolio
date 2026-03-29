/**
 * Portfolio brutalist – vanilla 1:1 (no GSAP)
 * i18n: IT / EN (i18n.js + data.js contenuti localizzati)
 */
;(function () {
  var data = window.PORTFOLIO_DATA
  var I18N = window.PORTFOLIO_I18N || { en: {}, it: {} }
  if (!data) return

  var personal = data.personal
  var projects = data.projects
  var skills = data.skills
  /** Link contatto ricostruiti da `personal` (email, social, CV). */
  function buildContactLinksFromPersonal(p) {
    if (!p) return []
    return [
      { label: 'Email', value: p.email || '', href: 'mailto:' + (p.email || ''), gradient: 'from-orange-500 to-red-500', icon: 'mail' },
      {
        label: 'GitHub',
        value: (function () {
          var u = p.github || ''
          var m = String(u).match(/github\.com\/([^\/\?#]+)/)
          return m ? m[1] : 'GitHub'
        })(),
        href: p.github || '#',
        gradient: 'from-gray-700 to-gray-900',
        icon: 'github',
      },
      { label: 'LinkedIn', value: 'Connect', href: p.linkedin || '#', gradient: 'from-blue-600 to-blue-800', icon: 'linkedin' },
      {
        label: p.discordUsername ? 'Discord (' + p.discordUsername + ')' : 'Discord',
        value: p.discordUsername || '',
        href: p.discord || '#',
        gradient: 'from-indigo-500 to-purple-600',
        icon: 'discord',
      },
      { label: 'Instagram', value: 'Instagram', href: p.instagram || '#', gradient: 'from-purple-500 to-pink-500', icon: 'instagram' },
      { label: 'Facebook', value: 'Facebook', href: p.facebook || '#', gradient: 'from-blue-600 to-blue-800', icon: 'facebook' },
    ]
  }
  var contactLinks = buildContactLinksFromPersonal(personal)
  /** Se valorizzato da API, sostituisce i highlights About in i18n.js. */
  var customAboutHighlights = null

  var currentLang = 'en'
  var lastStatsPayload = null

  function detectLang() {
    try {
      var q = new URLSearchParams(window.location.search || '').get('lang')
      if (q === 'it' || q === 'en') return q
    } catch (e) {}
    try {
      var s = localStorage.getItem('portfolio_lang')
      if (s === 'it' || s === 'en') return s
    } catch (e2) {}
    try {
      var nav = (navigator.language || '').toLowerCase()
      if (nav.indexOf('it') === 0) return 'it'
    } catch (e3) {}
    return 'en'
  }

  function setLang(lang) {
    if (lang !== 'it' && lang !== 'en') return
    currentLang = lang
    try {
      localStorage.setItem('portfolio_lang', lang)
    } catch (e) {}
    document.documentElement.lang = lang === 'it' ? 'it' : 'en'
  }

  function t(key) {
    var L = I18N[currentLang] || {}
    if (L[key] !== undefined) return L[key]
    var E = I18N.en || {}
    return E[key] !== undefined ? E[key] : key
  }

  function pickLocale(obj, field) {
    var v = obj[field]
    if (v && typeof v === 'object' && (v.en !== undefined || v.it !== undefined)) {
      return v[currentLang] !== undefined ? v[currentLang] : v.en
    }
    return v
  }

  function personalText(key) {
    var loc = personal.i18n && personal.i18n[currentLang]
    var fallback = personal.i18n && personal.i18n.en
    if (loc && loc[key] !== undefined) return loc[key]
    if (fallback && fallback[key] !== undefined) return fallback[key]
    return ''
  }

  function scrollToSection(id) {
    var el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  /** Evita cache browser/CDN sulle GET /api/stats (altrimenti il conteggio resta “congelato”). */
  function statsFetch(url, extra) {
    var init = { cache: 'no-store', credentials: 'same-origin' }
    if (extra && typeof extra === 'object') {
      for (var k in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, k)) init[k] = extra[k]
      }
    }
    return fetch(url, init)
  }

  /** Aggiorna i numeri “N visite” sulle card progetto (stesso payload di GET /api/stats). */
  function applyProjectVisitsToDom(map) {
    if (!map || typeof map !== 'object') return
    var root = document.getElementById('projects-content')
    if (!root) return
    var vLabel = t('projects_views')
    root.querySelectorAll('[data-project-views-id]').forEach(function (el) {
      var id = el.getAttribute('data-project-views-id')
      var n = map[id]
      if (n == null) n = map[String(id)]
      if (n == null || n === '') n = 0
      el.textContent = String(n) + ' ' + vLabel
    })
  }

  /** Impostato quando stats API è attiva: permette a initProjectCardViews di aggiornare hero + card dopo ?inc=project. */
  var refreshStatsFromApi = null
  /** Evita listener duplicati su #projects-content quando renderPortfolio() gira due volte (locale + Redis). */
  var projectLiveClickBound = false

  function fetchWithTimeout(url, ms) {
    return Promise.race([
      fetch(url, { cache: 'no-store', credentials: 'same-origin' }),
      new Promise(function (_, reject) {
        setTimeout(function () {
          reject(new Error('timeout'))
        }, ms)
      }),
    ])
  }

  document.body.classList.add('brutalist')
  setLang(detectLang())

  /** Visite per progetto */
  function initProjectCardViews(statsApiUrl, projectsList) {
    if (!statsApiUrl || !projectsList || !projectsList.length) return
    var root = document.getElementById('projects-content')
    if (!root) return
    function applyProjectVisits(map) {
      if (!map || typeof map !== 'object') return
      var vLabel = t('projects_views')
      root.querySelectorAll('[data-project-views-id]').forEach(function (el) {
        var id = el.getAttribute('data-project-views-id')
        var n = map[id]
        if (n == null) n = map[String(id)]
        if (n == null || n === '') n = 0
        el.textContent = String(n) + ' ' + vLabel
      })
    }
    statsFetch(statsApiUrl)
      .then(function (r) {
        if (!r.ok) throw new Error('stats')
        return r.json()
      })
      .then(function (s) {
        applyProjectVisitsToDom(s.projectVisits || {})
      })
      .catch(function () {})

    var counted = {}
    try {
      projectsList.forEach(function (p) {
        try {
          if (sessionStorage.getItem('portfolio_pv_' + p.id)) counted[p.id] = true
        } catch (e) {}
      })
    } catch (e) {}

    /** Una sola card per click su “Vai al sito” (non scroll: altrimenti tutte le card in viewport incrementano insieme). */
    if (!projectLiveClickBound) {
      projectLiveClickBound = true
      root.addEventListener(
        'click',
        function (e) {
          var link = e.target.closest('a.brutal-project__link--live, a.brutal-featured__cta--live')
          if (!link) return
          var article = link.closest('[data-project-id]')
          if (!article) return
          var pid = article.getAttribute('data-project-id')
          var idNum = parseInt(pid, 10)
          if (!Number.isFinite(idNum)) return
          if (counted[idNum]) return
          counted[idNum] = true
          try {
            sessionStorage.setItem('portfolio_pv_' + idNum, '1')
          } catch (e2) {}
          statsFetch(statsApiUrl + '?inc=project&projectId=' + encodeURIComponent(String(idNum)))
            .then(function (r) {
              if (!r.ok) throw new Error('bad')
              return r.json()
            })
            .then(function (s) {
              if (typeof refreshStatsFromApi === 'function') refreshStatsFromApi(s)
              else applyProjectVisitsToDom(s.projectVisits || {})
            })
            .catch(function () {})
        },
        false
      )
    }
  }

  function parseGithubRepo(url) {
    if (!url || typeof url !== 'string') return ''
    var m = url.match(/github\.com\/([^/]+)\/([^/#?]+)/i)
    if (!m) return ''
    return m[1] + '/' + m[2].replace(/\.git$/i, '')
  }

  function renderProjectMeta(project) {
    var vLabel = t('projects_views')
    var views = '<span data-project-views-id="' + project.id + '">0 ' + vLabel + '</span>'
    var repo = parseGithubRepo(project.github)
    if (!repo) {
      return '<p class="brutal-project__meta">' + views + '</p>'
    }
    return (
      '<p class="brutal-project__meta">' +
      views +
      '<span class="brutal-project__meta-sep" aria-hidden="true"> · </span>' +
      '<span class="brutal-project__stars" data-github-repo="' +
      repo +
      '">—</span></p>'
    )
  }

  function initGithubStars() {
    var root = document.getElementById('projects-content')
    if (!root) return
    var nodes = root.querySelectorAll('[data-github-repo]')
    if (!nodes.length) return
    var seen = {}
    var list = []
    nodes.forEach(function (el) {
      var r = el.getAttribute('data-github-repo')
      if (r && !seen[r]) {
        seen[r] = true
        list.push(r)
      }
    })
    if (!list.length) return
    fetch('/api/github-stars?repos=' + encodeURIComponent(list.join(',')))
      .then(function (r) {
        if (!r.ok) throw new Error('stars')
        return r.json()
      })
      .then(function (map) {
        nodes.forEach(function (el) {
          var key = el.getAttribute('data-github-repo')
          if (!key) return
          var n = map[key]
          if (typeof n !== 'number') {
            el.textContent = ''
            var sep = el.previousElementSibling
            if (sep && sep.classList.contains('brutal-project__meta-sep')) sep.style.display = 'none'
            return
          }
          el.textContent = '★ ' + n
        })
      })
      .catch(function () {
        nodes.forEach(function (el) {
          el.textContent = ''
          var sep = el.previousElementSibling
          if (sep && sep.classList.contains('brutal-project__meta-sep')) sep.style.display = 'none'
        })
      })
  }

  // ----- Cursor -----
  var cursor = document.getElementById('brutalCursor')
  if (cursor) {
    function positionCursor(x, y) {
      cursor.style.transform = 'translate(' + x + 'px, ' + y + 'px) translate(-3px, -3px)'
    }
    document.addEventListener('mousemove', function (e) {
      positionCursor(e.clientX, e.clientY)
    })
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('#clippy')) cursor.classList.add('brutal-cursor--grab')
      else if (e.target.closest('a, button')) cursor.classList.add('brutal-cursor--large')
    })
    var clippyEl = document.getElementById('clippy')
    document.addEventListener('mouseout', function (e) {
      if (!e.relatedTarget || !e.relatedTarget.closest('#clippy'))
        if (!clippyEl || !clippyEl.classList.contains('is-active')) cursor.classList.remove('brutal-cursor--grab')
      if (!e.relatedTarget || !e.relatedTarget.closest('a, button')) cursor.classList.remove('brutal-cursor--large')
    })

    if (clippyEl) {
      var obs = new MutationObserver(function () {
        if (clippyEl.classList.contains('is-active')) cursor.classList.add('brutal-cursor--grab')
        else cursor.classList.remove('brutal-cursor--grab')
      })
      obs.observe(clippyEl, { attributes: true, attributeFilter: ['class'] })
    }

    var clickImg = cursor.querySelector('.brutal-cursor__img--click')
    if (clickImg) {
      var img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = function () {
        var w = img.naturalWidth
        var h = img.naturalHeight
        var canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        var ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        var pdata = ctx.getImageData(0, 0, w, h)
        var p = pdata.data
        var light = 240
        function isWhite(i) {
          return p[i] >= light && p[i + 1] >= light && p[i + 2] >= light
        }
        function idx(x, y) {
          return (y * w + x) * 4
        }
        var stack = []
        for (var x = 0; x < w; x++) {
          if (isWhite(idx(x, 0))) stack.push([x, 0])
          if (h > 1 && isWhite(idx(x, h - 1))) stack.push([x, h - 1])
        }
        for (var y = 0; y < h; y++) {
          if (isWhite(idx(0, y))) stack.push([0, y])
          if (w > 1 && isWhite(idx(w - 1, y))) stack.push([w - 1, y])
        }
        var seen = {}
        while (stack.length) {
          var pt = stack.pop()
          var px = pt[0]
          var py = pt[1]
          var k = px + ',' + py
          if (seen[k]) continue
          if (px < 0 || px >= w || py < 0 || py >= h) continue
          var i = idx(px, py)
          if (!isWhite(i)) continue
          seen[k] = true
          p[i + 3] = 0
          stack.push([px - 1, py])
          stack.push([px + 1, py])
          stack.push([px, py - 1])
          stack.push([px, py + 1])
        }
        ctx.putImageData(pdata, 0, 0)
        try {
          clickImg.src = canvas.toDataURL('image/png')
        } catch (e) {}
      }
      img.src = clickImg.getAttribute('src') || 'assets/cursor-click.png'
    }
  }

  var scrollProgress = document.getElementById('scrollProgress')
  if (scrollProgress) {
    function updateProgress() {
      var h = document.documentElement.scrollHeight - window.innerHeight
      var p = h <= 0 ? 1 : Math.min(1, window.scrollY / h)
      scrollProgress.style.transform = 'scaleX(' + p + ')'
    }
    window.addEventListener('scroll', updateProgress)
    window.addEventListener('resize', updateProgress)
    updateProgress()
  }

  function updatePageChrome() {
    document.title = t('meta_title')
    var md = document.querySelector('meta[name="description"]')
    if (md) md.setAttribute('content', t('meta_description'))
    var gh = document.getElementById('ghost-hero')
    if (gh) gh.textContent = t('ghost_portfolio')
    var ga = document.getElementById('ghost-about')
    if (ga) ga.textContent = t('ghost_about')
    var gw = document.getElementById('ghost-projects')
    if (gw) gw.textContent = t('ghost_work')
    var gs = document.getElementById('ghost-skills')
    if (gs) gs.textContent = t('ghost_skills')
    var gc = document.getElementById('ghost-contact')
    if (gc) gc.textContent = t('ghost_contact')
    var tip = document.querySelector('.clippy-tooltip')
    if (tip) tip.textContent = t('clippy_tooltip')
  }

  function updateNavLang() {
    var items = [
      { section: 'about', k: 'nav_about', g: 'nav_about_ghost' },
      { section: 'projects', k: 'nav_projects', g: 'nav_projects_ghost' },
      { section: 'skills', k: 'nav_skills', g: 'nav_skills_ghost' },
      { section: 'contact', k: 'nav_contact', g: 'nav_contact_ghost' },
    ]
    items.forEach(function (item) {
      var btn = document.querySelector('.brutal-nav__link[data-section="' + item.section + '"]')
      if (!btn) return
      btn.textContent = t(item.k)
      btn.setAttribute('data-text', t(item.g))
      btn.setAttribute('data-nav-label', t(item.k))
    })
    var logo = document.getElementById('nav-logo')
    if (logo) logo.setAttribute('aria-label', t('aria_home'))
    var bit = document.getElementById('lang-it')
    var ben = document.getElementById('lang-en')
    if (bit) {
      bit.classList.toggle('brutal-nav__lang-btn--active', currentLang === 'it')
      bit.setAttribute('aria-pressed', currentLang === 'it' ? 'true' : 'false')
    }
    if (ben) {
      ben.classList.toggle('brutal-nav__lang-btn--active', currentLang === 'en')
      ben.setAttribute('aria-pressed', currentLang === 'en' ? 'true' : 'false')
    }
    var navBtn = document.getElementById('nav-mobile-btn')
    var header = document.getElementById('site-header')
    if (navBtn && header && !header.classList.contains('brutal-nav__menu-open')) {
      navBtn.setAttribute('aria-label', t('aria_menu_open'))
    }
  }

  function skillDisplayName(skill, i) {
    if (skill && skill.name && typeof skill.name === 'object' && (skill.name.en !== undefined || skill.name.it !== undefined)) {
      var sn = skill.name[currentLang]
      if (sn !== undefined && sn !== '') return sn
      sn = skill.name.en
      if (sn !== undefined && sn !== '') return sn
      return skill.name.it || ''
    }
    var skillNames = t('skill_names')
    if (Array.isArray(skillNames) && skillNames[i] != null) return skillNames[i]
    return typeof skill.name === 'string' ? skill.name : ''
  }

  function renderPortfolio() {
    var aboutHighlights
    if (customAboutHighlights && customAboutHighlights.length) {
      aboutHighlights = customAboutHighlights.map(function (h) {
        return {
          title: pickLocale(h, 'title'),
          description: pickLocale(h, 'description'),
          tag: h.tag || '',
          mod: h.mod || 'yellow',
        }
      })
    } else {
      aboutHighlights = (I18N[currentLang] && I18N[currentLang].highlights) || I18N.en.highlights || []
    }

    // ----- Hero -----
    var heroContent = document.getElementById('hero-content')
    if (heroContent && personal) {
      var words = personal.name.split(' ')
      var cvLink = personal.cvPdfUrl
        ? '<a href="' +
          personal.cvPdfUrl +
          '" class="brutal-hero__cta brutal-hero__cta--outline" download="Michel-Branche-CV.pdf" rel="noopener" data-stats-cv="1">' +
          t('hero_cv_download') +
          '</a>'
        : personal.cvHtmlUrl
          ? '<a href="' +
            personal.cvHtmlUrl +
            '" class="brutal-hero__cta brutal-hero__cta--outline" target="_blank" rel="noopener" data-stats-cv="1">' +
            t('hero_cv_open') +
            '</a>'
          : ''
      heroContent.innerHTML =
        '<p class="brutal-hero__kicker">' +
        personalText('title') +
        '</p>' +
        '<h1 class="brutal-hero__title"><span id="hero-name-michel">' +
        words[0] +
        '</span><span>' +
        words.slice(1).join(' ') +
        '</span></h1>' +
        '<p class="brutal-hero__tagline">' +
        personalText('tagline') +
        '</p>' +
        '<div class="brutal-hero__ctas">' +
        '<button type="button" class="brutal-hero__cta" id="hero-cta">' +
        t('hero_cta') +
        '</button>' +
        (cvLink ? cvLink : '') +
        '</div>' +
        '<div class="brutal-stats brutal-hero-stats" id="hero-stats" aria-hidden="true"></div>'
    }

    // ----- About -----
    var aboutContent = document.getElementById('about-content')
    if (aboutContent && personal) {
      aboutContent.innerHTML =
        '<div class="brutal-section__header brutal-reveal brutal-reveal--left" data-reveal>' +
        '<p class="brutal-section__kicker">' +
        t('about_kicker') +
        '</p>' +
        '<h2 class="brutal-section__title">' +
        t('about_title') +
        '</h2>' +
        '<p class="brutal-card__desc" style="margin-top:1rem;border:none;padding:0;max-width:42rem">' +
        personalText('bio') +
        '</p>' +
        '</div>' +
        '<div class="brutal-grid brutal-grid--3">' +
        aboutHighlights
          .map(function (item, i) {
            return (
              '<article class="brutal-card brutal-card--' +
              item.mod +
              ' brutal-reveal brutal-reveal--card" data-reveal data-delay="' +
              (i % 3) * 80 +
              '">' +
              '<div class="brutal-card__top"><span class="brutal-card__number">0' +
              (i + 1) +
              '</span><span style="font-size:1.25rem;opacity:0.6">★</span></div>' +
              '<div class="brutal-card__body">' +
              '<h3 class="brutal-card__title">' +
              item.title +
              '</h3>' +
              '<p class="brutal-card__desc">' +
              item.description +
              '</p>' +
              '<div class="brutal-card__tags"><span class="brutal-card__tag">' +
              item.tag +
              '</span></div>' +
              '</div></article>'
            )
          })
          .join('') +
        '</div>'
    }

    // ----- Projects -----
    var projectsContent = document.getElementById('projects-content')
    if (projectsContent && projects.length) {
      var bottomFeaturedId =
        data.bottomFeaturedProjectId != null && data.bottomFeaturedProjectId !== ''
          ? Number(data.bottomFeaturedProjectId)
          : 6
      var featured = projects[0]
      var restRaw = projects.slice(1)
      var bottomIndexInRest = -1
      for (var pi = 0; pi < restRaw.length; pi++) {
        if (restRaw[pi].id === bottomFeaturedId) {
          bottomIndexInRest = pi
          break
        }
      }
      var rest = []
      restRaw.forEach(function (p, idx) {
        if (idx !== bottomIndexInRest) rest.push(p)
      })
      if (bottomIndexInRest !== -1) rest.push(restRaw[bottomIndexInRest])

      var fTitle = pickLocale(featured, 'title')
      var fDesc = pickLocale(featured, 'description')
      var featuredHtml = featured
        ? '<article class="brutal-card brutal-featured brutal-card--yellow brutal-reveal brutal-reveal--card-sm" data-project-id="' +
          featured.id +
          '" data-reveal>' +
          '<div class="brutal-featured__img-wrap"><img src="' +
          featured.image +
          '" alt="' +
          fTitle +
          '" class="brutal-featured__img" loading="lazy"></div>' +
          '<div class="brutal-featured__body">' +
          '<span class="brutal-featured__badge">' +
          t('projects_featured') +
          '</span>' +
          '<h3 class="brutal-featured__title">' +
          fTitle +
          '</h3>' +
          renderProjectMeta(featured) +
          '<p class="brutal-featured__desc">' +
          fDesc +
          '</p>' +
          '<div class="brutal-card__tags" style="margin-bottom:1rem">' +
          featured.tags.map(function (tg) { return '<span class="brutal-card__tag">' + tg + '</span>' }).join('') +
          '</div>' +
          '<div class="brutal-featured__actions">' +
          (featured.demo
            ? '<a href="' +
              featured.demo +
              '" target="_blank" rel="noopener noreferrer" class="brutal-featured__cta brutal-featured__cta--live">' +
              t('projects_live') +
              '</a>'
            : '') +
          (featured.github
            ? '<a href="' +
              featured.github +
              '" target="_blank" rel="noopener noreferrer" class="brutal-featured__cta">' +
              t('projects_code') +
              '</a>'
            : '') +
          '</div>' +
          '</div></article>'
        : ''

      function renderSmallProjectCard(project, i) {
        var pTitle = pickLocale(project, 'title')
        var pDesc = pickLocale(project, 'description')
        var demoLink = project.demo
          ? '<a href="' +
            project.demo +
            '" target="_blank" rel="noopener noreferrer" class="brutal-project__link brutal-project__link--live">' +
            t('projects_live') +
            '</a>'
          : ''
        var codeLink = project.github
          ? '<a href="' +
            project.github +
            '" target="_blank" rel="noopener noreferrer" class="brutal-project__link">' +
            t('projects_code') +
            '</a>'
          : ''
        return (
          '<article class="brutal-project brutal-reveal brutal-reveal--card-sm" role="listitem" data-project-id="' +
          project.id +
          '" data-reveal data-delay="' +
          (i % 3) * 80 +
          '">' +
          '<div class="brutal-project-inner">' +
          '<div class="brutal-project__img-wrap"><img src="' +
          project.image +
          '" alt="' +
          pTitle +
          '" class="brutal-project__img" loading="lazy"></div>' +
          '<div class="brutal-project__body">' +
          '<h3 class="brutal-project__title">' +
          pTitle +
          '</h3>' +
          renderProjectMeta(project) +
          '<p class="brutal-project__desc">' +
          pDesc +
          '</p>' +
          '<div class="brutal-project__actions">' +
          demoLink +
          codeLink +
          '</div>' +
          '</div></div></article>'
        )
      }

      var scrollProjects = rest.filter(function (p) { return p.id !== bottomFeaturedId })
      var polterProject = rest.find(function (p) { return p.id === bottomFeaturedId })
      var scrollHtml = scrollProjects.map(function (p, i) { return renderSmallProjectCard(p, i) }).join('')

      var scrollSectionHtml = ''
      if (scrollHtml) {
        scrollSectionHtml =
          '<div class="brutal-projects-grid-wrap brutal-reveal brutal-reveal--up" data-reveal data-delay="80">' +
          '<p class="brutal-projects-grid__label" aria-hidden="true">' +
          t('projects_other') +
          '</p>' +
          '<div class="brutal-projects-grid" role="list">' +
          scrollHtml +
          '</div>' +
          '</div>'
      }

      var polterHtml = ''
      if (polterProject) {
        var plTitle = pickLocale(polterProject, 'title')
        var plDesc = pickLocale(polterProject, 'description')
        polterHtml =
          '<article class="brutal-card brutal-featured brutal-card--yellow brutal-reveal brutal-reveal--card-sm" data-project-id="' +
          polterProject.id +
          '" data-reveal data-delay="' +
          2 * 80 +
          '" style="grid-column:1/-1;margin-top:0">' +
          '<div class="brutal-featured__img-wrap"><img src="' +
          polterProject.image +
          '" alt="' +
          plTitle +
          '" class="brutal-featured__img" loading="lazy"></div>' +
          '<div class="brutal-featured__body">' +
          '<span class="brutal-featured__badge">' +
          t('projects_creative') +
          '</span>' +
          '<h3 class="brutal-featured__title">' +
          plTitle +
          '</h3>' +
          renderProjectMeta(polterProject) +
          '<p class="brutal-featured__desc">' +
          plDesc +
          '</p>' +
          '<div class="brutal-card__tags" style="margin-bottom:1rem">' +
          polterProject.tags.map(function (tg) { return '<span class="brutal-card__tag">' + tg + '</span>' }).join('') +
          '</div>' +
          '<div class="brutal-featured__actions">' +
          (polterProject.demo
            ? '<a href="' +
              polterProject.demo +
              '" target="_blank" rel="noopener noreferrer" class="brutal-featured__cta brutal-featured__cta--live">' +
              t('projects_live') +
              '</a>'
            : '') +
          (polterProject.github
            ? '<a href="' +
              polterProject.github +
              '" target="_blank" rel="noopener noreferrer" class="brutal-featured__cta">' +
              t('projects_code') +
              '</a>'
            : '') +
          '</div>' +
          '</div></article>'
      }

      projectsContent.innerHTML =
        '<div class="brutal-section__header brutal-reveal brutal-reveal--left" data-reveal>' +
        '<p class="brutal-section__kicker">' +
        t('projects_kicker') +
        '</p>' +
        '<h2 class="brutal-section__title">' +
        t('projects_title') +
        '</h2>' +
        '</div>' +
        '<div class="brutal-grid" style="grid-template-columns:1fr;gap:0">' +
        featuredHtml +
        scrollSectionHtml +
        polterHtml +
        '</div>'

      if (data.statsApiUrl) {
        initProjectCardViews(data.statsApiUrl, projects)
      }
      initGithubStars()
    }

    // ----- Skills -----
    var cardMods = ['yellow', 'cyan', 'pink', 'lavender', 'orange', 'lime', 'green', 'yellow']
    var skillsContent = document.getElementById('skills-content')
    if (skillsContent && skills.length) {
      skillsContent.innerHTML =
        '<div class="brutal-section__header brutal-reveal brutal-reveal--left" data-reveal>' +
        '<p class="brutal-section__kicker">' +
        t('skills_kicker') +
        '</p>' +
        '<h2 class="brutal-section__title">' +
        t('skills_title') +
        '</h2>' +
        '</div>' +
        '<div class="brutal-grid brutal-grid--3">' +
        skills
          .map(function (skill, i) {
            var mod = skill.cardMod || cardMods[i % cardMods.length]
            var nm = skillDisplayName(skill, i)
            return (
              '<article class="brutal-card brutal-card--' +
              mod +
              ' brutal-reveal brutal-reveal--skill" data-reveal data-delay="' +
              i * 40 +
              '">' +
              '<div class="brutal-card__top"><span class="brutal-card__number">' +
              String(i + 1).padStart(2, '0') +
              '</span></div>' +
              '<div class="brutal-card__body"><h3 class="brutal-card__title">' +
              nm +
              '</h3></div></article>'
            )
          })
          .join('') +
        '</div>'
    }

    // ----- Contact -----
    var contactContent = document.getElementById('contact-content')
    if (contactContent && contactLinks) {
      var faIconMap = { mail: 'envelope', github: 'github', linkedin: 'linkedin-square', instagram: 'instagram', facebook: 'facebook' }
      var discordSvg =
        '<svg class="brutal-cta__icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>'
      contactContent.innerHTML =
        '<p class="brutal-section__kicker" style="text-align:center">' +
        t('contact_kicker') +
        '</p>' +
        '<h2 class="brutal-cta__title brutal-reveal brutal-reveal--cta" data-reveal>' +
        t('contact_title_a') +
        '<br><span>' +
        t('contact_title_b') +
        '</span></h2>' +
        '<p class="brutal-card__desc" style="margin:0 auto 2rem;border:none;padding:0;text-align:center;max-width:28rem">' +
        t('contact_intro') +
        '</p>' +
        '<div class="brutal-cta__links">' +
        contactLinks
          .map(function (item, i) {
            var iconHtml
            if (item.icon === 'discord') {
              iconHtml = discordSvg
            } else {
              var faClass = 'fa fa-' + (faIconMap[item.icon] || item.icon)
              iconHtml = '<i class="' + faClass + '" aria-hidden="true"></i>'
            }
            return (
              '<a href="' +
              item.href +
              '" target="_blank" rel="noopener noreferrer" class="brutal-cta__link brutal-reveal brutal-reveal--up" data-reveal data-delay="' +
              i * 100 +
              '" aria-label="' +
              item.label +
              '"' +
              (item.icon !== 'mail' ? ' data-stats-social="1"' : '') +
              '>' +
              iconHtml +
              ' →</a>'
            )
          })
          .join('') +
        '</div>' +
        '<form class="brutal-contact-form brutal-reveal brutal-reveal--up" id="contact-form" data-reveal data-delay="200" novalidate>' +
        '<div class="brutal-contact-form__grid">' +
        '<div class="brutal-contact-form__group">' +
        '<label class="brutal-contact-form__label" for="contact-name">' +
        t('form_name') +
        '</label>' +
        '<input type="text" id="contact-name" name="name" class="brutal-contact-form__input" required autocomplete="name" placeholder="' +
        t('ph_name') +
        '">' +
        '</div>' +
        '<div class="brutal-contact-form__group">' +
        '<label class="brutal-contact-form__label" for="contact-email">' +
        t('form_email') +
        '</label>' +
        '<input type="email" id="contact-email" name="email" class="brutal-contact-form__input" required autocomplete="email" placeholder="' +
        t('ph_email') +
        '">' +
        '</div>' +
        '</div>' +
        '<div class="brutal-contact-form__group">' +
        '<label class="brutal-contact-form__label" for="contact-message">' +
        t('form_message') +
        '</label>' +
        '<textarea id="contact-message" name="message" class="brutal-contact-form__textarea" required rows="4" placeholder="' +
        t('ph_message') +
        '"></textarea>' +
        '</div>' +
        '<div class="brutal-contact-form__actions">' +
        '<button type="submit" class="brutal-contact-form__submit" id="contact-submit">' +
        t('form_submit') +
        '</button>' +
        '<p class="brutal-contact-form__feedback" id="contact-feedback" aria-live="polite"></p>' +
        '</div>' +
        '</form>'

      try {
        var socialIcons = contactContent.querySelectorAll('a[data-stats-social="1"]')
        socialIcons.forEach(function (a) {
          a.addEventListener('click', function () {
            if (!data.statsApiUrl) return
            try {
              statsFetch(data.statsApiUrl + '?inc=contact', { method: 'GET', keepalive: true }).catch(
              function () {}
            )
            } catch (_) {}
          })
        })
      } catch (_) {}
    }

    // ----- Footer -----
    var footer = document.getElementById('footer')
    if (footer && personal) {
      var parts = personal.name.split(' ')
      var yr = new Date().getFullYear()
      footer.innerHTML =
        '<div class="brutal-footer__inner">' +
        '<div class="brutal-footer__logo">' +
        parts[0] +
        '<br><span>' +
        parts.slice(1).join(' ') +
        '</span></div>' +
        '<p class="brutal-footer__tagline">' +
        t('footer_line').replace('{year}', String(yr)) +
        '</p>' +
        '</div>'
    }

    updatePageChrome()
    updateNavLang()
  }

  function mergeRemoteSitePayload(json) {
    if (!json || typeof json !== 'object') return
    if (json.projects && Array.isArray(json.projects) && json.projects.length > 0) {
      projects = json.projects
      if (window.PORTFOLIO_DATA) window.PORTFOLIO_DATA.projects = projects
    }
    if (json.personal && typeof json.personal === 'object') {
      personal = json.personal
      if (window.PORTFOLIO_DATA) window.PORTFOLIO_DATA.personal = personal
      contactLinks = buildContactLinksFromPersonal(personal)
    }
    if (json.skills && Array.isArray(json.skills)) {
      skills = json.skills
      if (window.PORTFOLIO_DATA) window.PORTFOLIO_DATA.skills = skills
    }
    if (json.aboutHighlights && Array.isArray(json.aboutHighlights) && json.aboutHighlights.length > 0) {
      customAboutHighlights = json.aboutHighlights
      if (window.PORTFOLIO_DATA) window.PORTFOLIO_DATA.aboutHighlights = customAboutHighlights
    }
    if (json.bottomFeaturedProjectId != null && json.bottomFeaturedProjectId !== '') {
      var bf = Number(json.bottomFeaturedProjectId)
      if (!isNaN(bf)) {
        data.bottomFeaturedProjectId = bf
        if (window.PORTFOLIO_DATA) window.PORTFOLIO_DATA.bottomFeaturedProjectId = bf
      }
    }
  }

  /** Primo paint subito (data.js): su rete lenta / cold start non resta schermo vuoto in attesa di Redis. */
  renderPortfolio()
  initReveal()
  setTimeout(initTilt, 0)
  initLangSwitcher()

  // ----- Stats (dopo il primo renderPortfolio: #hero-stats esiste) -----
  var statsApiUrl = data.statsApiUrl
  if (statsApiUrl) {
    function renderStats(stats) {
      if (!stats) return
      lastStatsPayload = stats
      var statsEl = document.getElementById('hero-stats')
      if (!statsEl) return
      statsEl.innerHTML =
        '<span class="brutal-stats__item"><strong class="brutal-stats__num" id="stat-visits">' +
        (stats.visits || 0) +
        '</strong> ' +
        t('stats_visits') +
        '</span>' +
        '<span class="brutal-stats__item"><strong class="brutal-stats__num" id="stat-cv">' +
        (stats.cvDownloads || 0) +
        '</strong> ' +
        t('stats_cv') +
        '</span>' +
        '<span class="brutal-stats__item"><strong class="brutal-stats__num" id="stat-contacts">' +
        (stats.contacts || 0) +
        '</strong> ' +
        t('stats_contacts') +
        '</span>'
      if (stats.projectVisits && typeof stats.projectVisits === 'object') {
        applyProjectVisitsToDom(stats.projectVisits)
      }
    }
    refreshStatsFromApi = renderStats
    renderStats({ visits: 0, cvDownloads: 0, contacts: 0 })
    function fetchStats(inc) {
      var url = inc ? statsApiUrl + '?inc=' + encodeURIComponent(inc) : statsApiUrl
      return statsFetch(url)
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status)
          return r.json()
        })
        .then(function (s) {
          renderStats(s)
          return s
        })
        .catch(function () {
          renderStats({ visits: 0, cvDownloads: 0, contacts: 0 })
          return null
        })
    }
    var visitCounted = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('portfolio_visit_counted')
    var pollMs =
      typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 768px)').matches ? 12000 : 5000
    var pollTimer = null
    function startPolling() {
      if (pollTimer) return
      pollTimer = setInterval(function () {
        try {
          if (document.visibilityState === 'hidden') return
        } catch (_) {}
        fetchStats().then(function (s) {
          if (!s) {
            try {
              clearInterval(pollTimer)
            } catch (_) {}
            pollTimer = null
          }
        })
      }, pollMs)
      window.addEventListener('beforeunload', function () {
        try {
          clearInterval(pollTimer)
        } catch (_) {}
      })
    }
    if (visitCounted) {
      fetchStats().then(function (s) {
        if (s) startPolling()
      })
    } else {
      fetchStats('visit').then(function (s) {
        if (s) startPolling()
      })
      try {
        sessionStorage.setItem('portfolio_visit_counted', '1')
      } catch (_) {}
    }

    document.body.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-stats-cv="1"]')
      if (!a) return
      statsFetch(statsApiUrl + '?inc=cv')
        .then(function (r) {
          return r.json()
        })
        .then(renderStats)
        .catch(function () {})
    })
  }

  var SITE_FETCH_MS = 12000
  fetchWithTimeout('/api/admin-projects?t=' + Date.now(), SITE_FETCH_MS)
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status)
      return r.json()
    })
    .then(function (json) {
      mergeRemoteSitePayload(json)
    })
    .catch(function (err) {
      console.warn('Portfolio remote (admin-projects):', err)
    })
    .finally(function () {
      renderPortfolio()
      initReveal()
      setTimeout(initTilt, 0)
      if (typeof refreshStatsFromApi === 'function') {
        refreshStatsFromApi(lastStatsPayload || { visits: 0, cvDownloads: 0, contacts: 0 })
      }
    })
  ;(function bindHeroInteractions() {
    document.body.addEventListener('click', function (e) {
      if (e.target.id === 'hero-cta') {
        scrollToSection('projects')
        return
      }
      if (e.target.id === 'hero-name-michel' && personal.cvHtmlUrl) {
        if (!bindHeroInteractions.michel) bindHeroInteractions.michel = { clicks: 0, timer: null }
        var m = bindHeroInteractions.michel
        m.clicks++
        if (m.timer) clearTimeout(m.timer)
        if (m.clicks >= 5) {
          m.clicks = 0
          window.open(personal.cvHtmlUrl, '_blank', 'noopener')
        } else {
          m.timer = setTimeout(function () { m.clicks = 0 }, 1500)
        }
      }
    })
    document.body.addEventListener('mouseover', function (e) {
      if (e.target.id === 'hero-name-michel' && personal.cvHtmlUrl) e.target.style.cursor = 'pointer'
    })
  })()

  // ----- Contact form (delegation, una tantum) -----
  document.body.addEventListener('submit', function (e) {
    if (e.target.id !== 'contact-form') return
    e.preventDefault()
    var contactForm = e.target
    var contactFormApiUrl = data.contactFormApiUrl
    if (!contactFormApiUrl) {
      var fb = document.getElementById('contact-feedback')
      if (fb) {
        fb.textContent = t('form_config')
        fb.className = 'brutal-contact-form__feedback brutal-contact-form__feedback--error'
      }
      return
    }
    var submitBtn = document.getElementById('contact-submit')
    var feedback = document.getElementById('contact-feedback')
    var fd = new FormData(contactForm)
    var payload = { name: fd.get('name'), email: fd.get('email'), message: fd.get('message') }
    if (submitBtn) submitBtn.disabled = true
    if (feedback) {
      feedback.textContent = ''
      feedback.className = 'brutal-contact-form__feedback'
    }
    fetch(contactFormApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.text().then(function (txt) {
          var j
          try {
            j = txt ? JSON.parse(txt) : {}
          } catch (_) {
            j = { raw: txt }
          }
          if (!res.ok) {
            var detail = j && (j.error || j.details || j.raw) ? ' — ' + JSON.stringify(j) : ''
            throw new Error((res.statusText || t('form_error')) + detail)
          }
          return j
        })
      })
      .then(function () {
        if (feedback) {
          feedback.textContent = t('form_success')
          feedback.className = 'brutal-contact-form__feedback brutal-contact-form__feedback--success'
        }
        contactForm.reset()
        if (data.statsApiUrl) {
          statsFetch(data.statsApiUrl + '?inc=contact')
            .then(function (r) { return r.json() })
            .then(function (s) {
              lastStatsPayload = s
              var el = document.getElementById('hero-stats')
              if (el && s) {
                el.innerHTML =
                  '<span class="brutal-stats__item"><strong class="brutal-stats__num">' +
                  (s.visits || 0) +
                  '</strong> ' +
                  t('stats_visits') +
                  '</span><span class="brutal-stats__item"><strong class="brutal-stats__num">' +
                  (s.cvDownloads || 0) +
                  '</strong> ' +
                  t('stats_cv') +
                  '</span><span class="brutal-stats__item"><strong class="brutal-stats__num">' +
                  (s.contacts || 0) +
                  '</strong> ' +
                  t('stats_contacts') +
                  '</span>'
                if (s.projectVisits && typeof s.projectVisits === 'object') {
                  applyProjectVisitsToDom(s.projectVisits)
                }
              }
            })
            .catch(function () {})
        }
      })
      .catch(function (err) {
        if (feedback) {
          feedback.textContent =
            t('form_error') +
            ' ' +
            (err && err.message ? err.message : t('form_error_retry')) +
            ' — ' +
            (personal ? personal.email : '')
          feedback.className = 'brutal-contact-form__feedback brutal-contact-form__feedback--error'
        }
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false
      })
  })

  // ----- Header -----
  var header = document.getElementById('site-header')
  var navLogo = document.getElementById('nav-logo')
  var navBtn = document.getElementById('nav-mobile-btn')

  function setScrolled() {
    if (window.scrollY > 80) header.classList.add('scrolled')
    else header.classList.remove('scrolled')
  }
  window.addEventListener('scroll', setScrolled)
  setScrolled()

  document.addEventListener('mousemove', function (e) {
    if (!header.classList.contains('scrolled')) return
    if (window.innerWidth <= 768) return
    var cx = window.innerWidth / 2
    var cy = 80
    var rx = (e.clientY - cy) * 0.018
    var ry = (e.clientX - cx) * 0.018
    var clamp = function (n, min, max) { return Math.min(Math.max(n, min), max) }
    rx = clamp(rx, -8, 8)
    ry = clamp(ry, -8, 8)
    header.style.transform = 'translateX(-50%) perspective(1000px) rotateX(' + (-rx) + 'deg) rotateY(' + ry + 'deg)'
  })
  document.addEventListener('scroll', function () {
    if (!header.classList.contains('scrolled')) header.style.transform = ''
  })

  var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  document.querySelectorAll('.brutal-nav__link[data-text]').forEach(function (link) {
    link.addEventListener('mouseenter', function () {
      var original = link.getAttribute('data-text')
      var iter = 0
      var interval = setInterval(function () {
        link.textContent = original.split('').map(function (l, i) {
          if (i < iter) return original[i]
          return alpha[Math.floor(Math.random() * 26)]
        }).join('')
        if (iter >= original.length) clearInterval(interval)
        iter += 1 / 3
      }, 30)
      link._hackerInterval = interval
    })
    link.addEventListener('mouseleave', function () {
      if (link._hackerInterval) clearInterval(link._hackerInterval)
      var lab = link.getAttribute('data-nav-label')
      link.textContent = lab || link.textContent
    })
  })

  if (navLogo) navLogo.addEventListener('click', function () { scrollToSection('hero') })
  document.querySelectorAll('.brutal-nav__link').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-section')
      if (id) scrollToSection(id)
      header.classList.remove('brutal-nav__menu-open')
    })
  })
  if (navBtn) {
    navBtn.addEventListener('click', function () {
      header.classList.toggle('brutal-nav__menu-open')
      navBtn.setAttribute(
        'aria-label',
        header.classList.contains('brutal-nav__menu-open') ? t('aria_menu_close') : t('aria_menu_open')
      )
      navBtn.textContent = header.classList.contains('brutal-nav__menu-open') ? '✕' : '☰'
    })
  }

  function initLangSwitcher() {
    var wrap = document.getElementById('nav-lang')
    if (!wrap) return
    wrap.setAttribute('aria-label', t('aria_switch_lang'))
    wrap.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var L = btn.getAttribute('data-lang')
        if (L !== 'it' && L !== 'en') return
        setLang(L)
        renderPortfolio()
        if (lastStatsPayload) {
          var statsEl = document.getElementById('hero-stats')
          if (statsEl && data.statsApiUrl) {
            var s = lastStatsPayload
            statsEl.innerHTML =
              '<span class="brutal-stats__item"><strong class="brutal-stats__num">' +
              (s.visits || 0) +
              '</strong> ' +
              t('stats_visits') +
              '</span><span class="brutal-stats__item"><strong class="brutal-stats__num">' +
              (s.cvDownloads || 0) +
              '</strong> ' +
              t('stats_cv') +
              '</span><span class="brutal-stats__item"><strong class="brutal-stats__num">' +
              (s.contacts || 0) +
              '</strong> ' +
              t('stats_contacts') +
              '</span>'
            if (s.projectVisits && typeof s.projectVisits === 'object') {
              applyProjectVisitsToDom(s.projectVisits)
            }
          }
        }
        initReveal()
        setTimeout(initTilt, 0)
        try {
          var url = new URL(window.location.href)
          url.searchParams.set('lang', L)
          window.history.replaceState({}, '', url.pathname + url.search + url.hash)
        } catch (e) {}
      })
    })
  }

  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]')
    var narrow =
      typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 768px)').matches
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return
          var el = entry.target
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10)
          setTimeout(function () { el.classList.add('brutal-revealed') }, delay)
        })
      },
      {
        threshold: narrow ? 0.05 : 0.1,
        rootMargin: narrow ? '0px 0px -12px 0px' : '0px 0px -50px 0px',
      }
    )
    els.forEach(function (el) { observer.observe(el) })
  }

  function initTilt() {
    document.querySelectorAll('.brutal-project, .brutal-featured').forEach(function (card) {
      var inner = card.querySelector('.brutal-project-inner') || card
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect()
        var x = (e.clientX - r.left) / r.width - 0.5
        var y = (e.clientY - r.top) / r.height - 0.5
        inner.style.transform = 'perspective(1000px) rotateX(' + (-y * 6) + 'deg) rotateY(' + x * 6 + 'deg)'
      })
      card.addEventListener('mouseleave', function () {
        inner.style.transform = ''
      })
    })
  }

})()
