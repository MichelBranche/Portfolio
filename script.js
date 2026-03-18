/**
 * Portfolio brutalist – vanilla 1:1 (no GSAP)
 */
(function () {
  var data = window.PORTFOLIO_DATA
  if (!data) return
  var personal = data.personal
  var projects = data.projects
  var skills = data.skills
  var highlights = data.highlights
  var contactLinks = data.contactLinks

  document.body.classList.add('brutalist')

  function scrollToSection(id) {
    var el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // ----- Cursor -----
  var cursor = document.getElementById('brutalCursor')
  if (cursor) {
    var cursorX = 0, cursorY = 0
    var targetX = 0, targetY = 0
    function animateCursor() {
      cursorX += (targetX - cursorX) * 0.15
      cursorY += (targetY - cursorY) * 0.15
      cursor.style.transform = 'translate(' + cursorX + 'px, ' + cursorY + 'px) translate(-50%, -50%)'
      requestAnimationFrame(animateCursor)
    }
    animateCursor()
    document.addEventListener('mousemove', function (e) {
      targetX = e.clientX
      targetY = e.clientY
    })
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button')) cursor.classList.add('brutal-cursor--large')
    })
    document.addEventListener('mouseout', function (e) {
      if (!e.relatedTarget || !e.relatedTarget.closest('a, button')) cursor.classList.remove('brutal-cursor--large')
    })
  }

  // ----- Scroll progress -----
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

  // ----- Hero -----
  var heroContent = document.getElementById('hero-content')
  if (heroContent && personal) {
    var words = personal.name.split(' ')
    heroContent.innerHTML =
      '<p class="brutal-hero__kicker">' + personal.title + '</p>' +
      '<h1 class="brutal-hero__title"><span>' + words[0] + '</span><span>' + words.slice(1).join(' ') + '</span></h1>' +
      '<p class="brutal-hero__tagline">' + personal.tagline + '</p>' +
      '<button type="button" class="brutal-hero__cta" id="hero-cta">View My Work →</button>'
    document.getElementById('hero-cta').addEventListener('click', function () { scrollToSection('projects') })
  }

  // About highlights (same as React)
  var aboutHighlights = [
    { title: 'Modern Development', description: 'HTML, CSS, JavaScript expertise', tag: 'Code', mod: 'yellow' },
    { title: 'UI/UX Focus', description: 'Design coerente e identità visiva', tag: 'Design', mod: 'cyan' },
    { title: 'Performance-First', description: 'Ottimizzato per mobile', tag: 'Speed', mod: 'lime' },
    { title: 'Real Projects', description: 'Attenzione a conversione e utilizzo', tag: 'Ship', mod: 'pink' }
  ]

  // ----- About -----
  var aboutContent = document.getElementById('about-content')
  if (aboutContent && personal) {
    aboutContent.innerHTML =
      '<div class="brutal-section__header brutal-reveal brutal-reveal--left" data-reveal>' +
        '<p class="brutal-section__kicker">About Me</p>' +
        '<h2 class="brutal-section__title">Building Experiences</h2>' +
        '<p class="brutal-card__desc" style="margin-top:1rem;border:none;padding:0;max-width:42rem">' + personal.bio + '</p>' +
      '</div>' +
      '<div class="brutal-grid brutal-grid--3">' +
        aboutHighlights.map(function (item, i) {
          return '<article class="brutal-card brutal-card--' + item.mod + ' brutal-reveal brutal-reveal--card" data-reveal data-delay="' + (i % 3) * 80 + '">' +
            '<div class="brutal-card__top"><span class="brutal-card__number">0' + (i + 1) + '</span><span style="font-size:1.25rem;opacity:0.6">★</span></div>' +
            '<div class="brutal-card__body">' +
              '<h3 class="brutal-card__title">' + item.title + '</h3>' +
              '<p class="brutal-card__desc">' + item.description + '</p>' +
              '<div class="brutal-card__tags"><span class="brutal-card__tag">' + item.tag + '</span></div>' +
            '</div></article>'
        }).join('') +
      '</div>'
  }

  // ----- Projects -----
  var projectsContent = document.getElementById('projects-content')
  if (projectsContent && projects.length) {
    var featured = projects[0]
    var restRaw = projects.slice(1, 5)
    var polterIndex = -1
    for (var pi = 0; pi < restRaw.length; pi++) {
      if (restRaw[pi].title === 'polterTV') {
        polterIndex = pi
        break
      }
    }
    var rest = []
    restRaw.forEach(function (p, idx) {
      if (idx !== polterIndex) rest.push(p)
    })
    if (polterIndex !== -1) rest.push(restRaw[polterIndex])

    var featuredHtml = featured
      ? '<article class="brutal-card brutal-featured brutal-card--yellow brutal-reveal brutal-reveal--card-sm" data-reveal>' +
          '<div class="brutal-featured__img-wrap"><img src="' + featured.image + '" alt="' + featured.title + '" class="brutal-featured__img"></div>' +
          '<div class="brutal-featured__body">' +
            '<span class="brutal-featured__badge">Featured</span>' +
            '<h3 class="brutal-featured__title">' + featured.title + '</h3>' +
            '<p class="brutal-featured__desc">' + featured.description + '</p>' +
            '<div class="brutal-card__tags" style="margin-bottom:1rem">' +
              featured.tags.map(function (t) { return '<span class="brutal-card__tag">' + t + '</span>' }).join('') +
            '</div>' +
            '<div class="brutal-featured__actions">' +
              (featured.demo ? '<a href="' + featured.demo + '" target="_blank" rel="noopener noreferrer" class="brutal-featured__cta brutal-featured__cta--live">Live view →</a>' : '') +
              (featured.github ? '<a href="' + featured.github + '" target="_blank" rel="noopener noreferrer" class="brutal-featured__cta">View Code →</a>' : '') +
            '</div>' +
          '</div></article>'
      : ''
    var restHtml = rest.map(function (project, i) {
      var isPolter = project.title === 'polterTV' && i === rest.length - 1
      if (isPolter) {
        return '<article class="brutal-card brutal-featured brutal-card--yellow brutal-reveal brutal-reveal--card-sm" data-reveal data-delay="' + (2 * 80) + '" style="grid-column:1/-1;margin-top:0">' +
          '<div class="brutal-featured__img-wrap"><img src="' + project.image + '" alt="' + project.title + '" class="brutal-featured__img"></div>' +
          '<div class="brutal-featured__body">' +
            '<span class="brutal-featured__badge">Creative Lab</span>' +
            '<h3 class="brutal-featured__title">' + project.title + '</h3>' +
            '<p class="brutal-featured__desc">' + project.description + '</p>' +
            '<div class="brutal-card__tags" style="margin-bottom:1rem">' +
              project.tags.map(function (t) { return '<span class="brutal-card__tag">' + t + '</span>' }).join('') +
            '</div>' +
            '<div class="brutal-featured__actions">' +
              (project.demo ? '<a href="' + project.demo + '" target="_blank" rel="noopener noreferrer" class="brutal-featured__cta brutal-featured__cta--live">Live view →</a>' : '') +
              (project.github ? '<a href="' + project.github + '" target="_blank" rel="noopener noreferrer" class="brutal-featured__cta">View Code →</a>' : '') +
            '</div>' +
          '</div></article>'
      }
      var demoLink = project.demo ? '<a href="' + project.demo + '" target="_blank" rel="noopener noreferrer" class="brutal-project__link brutal-project__link--live">Live view →</a>' : ''
      var codeLink = project.github ? '<a href="' + project.github + '" target="_blank" rel="noopener noreferrer" class="brutal-project__link">View Code →</a>' : ''
      return '<article class="brutal-project brutal-reveal brutal-reveal--card-sm" data-reveal data-delay="' + (i % 2) * 100 + '">' +
        '<div class="brutal-project-inner">' +
          '<div class="brutal-project__img-wrap"><img src="' + project.image + '" alt="' + project.title + '" class="brutal-project__img"></div>' +
          '<div class="brutal-project__body">' +
            '<h3 class="brutal-project__title">' + project.title + '</h3>' +
            '<p class="brutal-project__desc">' + project.description + '</p>' +
            '<div class="brutal-project__actions">' + demoLink + codeLink + '</div>' +
          '</div></div></article>'
    }).join('')
    projectsContent.innerHTML =
      '<div class="brutal-section__header brutal-reveal brutal-reveal--left" data-reveal>' +
        '<p class="brutal-section__kicker">Portfolio</p>' +
        '<h2 class="brutal-section__title">Selected Projects</h2>' +
      '</div>' +
      '<div class="brutal-grid" style="grid-template-columns:1fr;gap:0">' +
        featuredHtml +
        '<div class="brutal-grid brutal-grid--3" style="grid-column:1/-1">' + restHtml + '</div>' +
      '</div>'
  }

  // ----- Skills -----
  var cardMods = ['yellow', 'cyan', 'pink', 'lavender', 'orange', 'lime', 'green', 'yellow']
  var skillsContent = document.getElementById('skills-content')
  if (skillsContent && skills.length) {
    skillsContent.innerHTML =
      '<div class="brutal-section__header brutal-reveal brutal-reveal--left" data-reveal>' +
        '<p class="brutal-section__kicker">Technical Expertise</p>' +
        '<h2 class="brutal-section__title">Skills & Technologies</h2>' +
      '</div>' +
      '<div class="brutal-grid brutal-grid--3">' +
        skills.map(function (skill, i) {
          var mod = cardMods[i % cardMods.length]
          return '<article class="brutal-card brutal-card--' + mod + ' brutal-reveal brutal-reveal--skill" data-reveal data-delay="' + i * 40 + '">' +
            '<div class="brutal-card__top"><span class="brutal-card__number">' + String(i + 1).padStart(2, '0') + '</span></div>' +
            '<div class="brutal-card__body"><h3 class="brutal-card__title">' + skill.name + '</h3></div></article>'
        }).join('') +
      '</div>'
  }

  // ----- Contact -----
  var contactContent = document.getElementById('contact-content')
  if (contactContent && contactLinks) {
    var faIconMap = { mail: 'envelope', github: 'github', linkedin: 'linkedin-square', instagram: 'instagram', facebook: 'facebook' }
    var discordSvg = '<svg class="brutal-cta__icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>'
    contactContent.innerHTML =
      '<p class="brutal-section__kicker" style="text-align:center">Get In Touch</p>' +
      '<h2 class="brutal-cta__title brutal-reveal brutal-reveal--cta" data-reveal>Let\'s Work<br><span>Together.</span></h2>' +
      '<p class="brutal-card__desc" style="margin:0 auto 2rem;border:none;padding:0;text-align:center;max-width:28rem">Hai un progetto in mente? Collaboriamo per creare qualcosa di straordinario.</p>' +
      '<div class="brutal-cta__links">' +
        contactLinks.map(function (item, i) {
          var iconHtml
          if (item.icon === 'discord') {
            iconHtml = discordSvg
          } else {
            var faClass = 'fa fa-' + (faIconMap[item.icon] || item.icon)
            iconHtml = '<i class="' + faClass + '" aria-hidden="true"></i>'
          }
          return '' +
            '<a href="' + item.href + '" target="_blank" rel="noopener noreferrer" class="brutal-cta__link brutal-reveal brutal-reveal--up" data-reveal data-delay="' + i * 100 + '" aria-label="' + item.label + '">' +
              iconHtml + ' →' +
            '</a>'
        }).join('') +
      '</div>' +
      '<form class="brutal-contact-form brutal-reveal brutal-reveal--up" id="contact-form" data-reveal data-delay="200" novalidate>' +
        '<div class="brutal-contact-form__grid">' +
          '<div class="brutal-contact-form__group">' +
            '<label class="brutal-contact-form__label" for="contact-name">Nome</label>' +
            '<input type="text" id="contact-name" name="name" class="brutal-contact-form__input" required autocomplete="name" placeholder="Il tuo nome">' +
          '</div>' +
          '<div class="brutal-contact-form__group">' +
            '<label class="brutal-contact-form__label" for="contact-email">Email</label>' +
            '<input type="email" id="contact-email" name="email" class="brutal-contact-form__input" required autocomplete="email" placeholder="la-tua@email.com">' +
          '</div>' +
        '</div>' +
        '<div class="brutal-contact-form__group">' +
          '<label class="brutal-contact-form__label" for="contact-message">Messaggio</label>' +
          '<textarea id="contact-message" name="message" class="brutal-contact-form__textarea" required rows="4" placeholder="Scrivi qui il tuo messaggio..."></textarea>' +
        '</div>' +
        '<div class="brutal-contact-form__actions">' +
          '<button type="submit" class="brutal-contact-form__submit" id="contact-submit">Invia messaggio</button>' +
          '<p class="brutal-contact-form__feedback" id="contact-feedback" aria-live="polite"></p>' +
        '</div>' +
      '</form>'
  }

  // ----- Contact form submit -----
  var contactForm = document.getElementById('contact-form')
  var contactFormApiUrl = data.contactFormApiUrl
  if (contactForm && contactFormApiUrl) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault()
      var submitBtn = document.getElementById('contact-submit')
      var feedback = document.getElementById('contact-feedback')
      var fd = new FormData(contactForm)
      var payload = { name: fd.get('name'), email: fd.get('email'), message: fd.get('message') }
      submitBtn.disabled = true
      feedback.textContent = ''
      feedback.className = 'brutal-contact-form__feedback'
      fetch(contactFormApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error(res.statusText || 'Errore di invio')
          return res.json()
        })
        .then(function () {
          feedback.textContent = 'Messaggio inviato. Ti rispondo al più presto!'
          feedback.className = 'brutal-contact-form__feedback brutal-contact-form__feedback--success'
          contactForm.reset()
        })
        .catch(function (err) {
          feedback.textContent = 'Invio fallito. Riprova o scrivimi a ' + (personal ? personal.email : '') + '.'
          feedback.className = 'brutal-contact-form__feedback brutal-contact-form__feedback--error'
        })
        .finally(function () {
          submitBtn.disabled = false
        })
    })
  } else if (contactForm) {
    document.getElementById('contact-feedback').textContent = 'Configura contactFormApiUrl in data.js e deploya l\'API per abilitare l\'invio.'
  }

  // ----- Footer -----
  var footer = document.getElementById('footer')
  if (footer && personal) {
    var parts = personal.name.split(' ')
    footer.innerHTML =
      '<div class="brutal-footer__logo">' + parts[0] + '<br><span>' + parts.slice(1).join(' ') + '</span></div>' +
      '<p>© ' + new Date().getFullYear() + ' · Designed & Built with passion</p>'
  }

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

  // Nav 3D tilt quando è in stato scrolled (stile hyper-kinetic)
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

  // Effetto hacker sui link nav (data-text)
  var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  document.querySelectorAll('.brutal-nav__link[data-text]').forEach(function (link) {
    var original = link.getAttribute('data-text')
    link.addEventListener('mouseenter', function () {
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
      link.textContent = link.getAttribute('data-section').charAt(0).toUpperCase() + link.getAttribute('data-section').slice(1)
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
      navBtn.setAttribute('aria-label', header.classList.contains('brutal-nav__menu-open') ? 'Close menu' : 'Open menu')
      navBtn.textContent = header.classList.contains('brutal-nav__menu-open') ? '✕' : '☰'
    })
  }

  // ----- Reveal on scroll -----
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]')
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return
        var el = entry.target
        var delay = parseInt(el.getAttribute('data-delay') || '0', 10)
        setTimeout(function () { el.classList.add('brutal-revealed') }, delay)
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
    els.forEach(function (el) { observer.observe(el) })
  }
  initReveal()

  // ----- Card tilt -----
  function initTilt() {
    document.querySelectorAll('.brutal-project, .brutal-featured').forEach(function (card) {
      var inner = card.querySelector('.brutal-project-inner') || card
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect()
        var x = (e.clientX - r.left) / r.width - 0.5
        var y = (e.clientY - r.top) / r.height - 0.5
        inner.style.transform = 'perspective(1000px) rotateX(' + (-y * 6) + 'deg) rotateY(' + (x * 6) + 'deg)'
      })
      card.addEventListener('mouseleave', function () {
        inner.style.transform = ''
      })
    })
  }
  // Run after DOM for project cards
  setTimeout(initTilt, 0)
})()
