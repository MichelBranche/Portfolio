document.addEventListener('DOMContentLoaded', () => {
  const loginSection = document.getElementById('login-section');
  const dashboard = document.getElementById('dashboard');
  const loginForm = document.getElementById('login-form');
  const passwordInput = document.getElementById('password');
  const loginError = document.getElementById('login-error');
  const btnLogout = document.getElementById('btn-logout');
  const btnSave = document.getElementById('btn-save');
  const projectsContent = document.getElementById('admin-projects-content');
  const projectCount = document.getElementById('project-count');
  const toast = document.getElementById('toast');
  const skillsEditorRows = document.getElementById('skills-editor-rows');
  const highlightsEditorRows = document.getElementById('highlights-editor-rows');

  const editModal = document.getElementById('edit-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const btnDeleteProject = document.getElementById('btn-delete-project');
  const projectForm = document.getElementById('project-form');

  let token = sessionStorage.getItem('adminToken') || '';
  let projectsArray = [];

  function publishProjectsForStats() {
    try {
      window.__ADMIN_PROJECTS_FOR_STATS__ = projectsArray.slice();
    } catch (e) {}
  }

  const SKILL_CATS = ['core', 'frameworks', 'design', 'optimization', 'tools'];
  const HL_MODS = ['yellow', 'cyan', 'pink', 'lavender', 'lime', 'green', 'orange'];

  function defaultHighlightsFromI18n() {
    const en = (window.PORTFOLIO_I18N && window.PORTFOLIO_I18N.en && window.PORTFOLIO_I18N.en.highlights) || [];
    const it = (window.PORTFOLIO_I18N && window.PORTFOLIO_I18N.it && window.PORTFOLIO_I18N.it.highlights) || [];
    return en.map((h, i) => ({
      title: { en: h.title, it: (it[i] && it[i].title) || h.title },
      description: { en: h.description, it: (it[i] && it[i].description) || h.description },
      tag: h.tag,
      mod: h.mod || 'yellow',
    }));
  }

  function normalizeSkills(arr) {
    return (arr || []).map((s) => {
      if (s.name && typeof s.name === 'object') {
        return {
          name: { en: s.name.en || '', it: s.name.it || '' },
          category: s.category || 'core',
          cardMod: s.cardMod || '',
        };
      }
      return {
        name: { en: s.name || '', it: s.name || '' },
        category: s.category || 'core',
        cardMod: s.cardMod || '',
      };
    });
  }

  function ensurePersonalShape(p) {
    if (!p.i18n) p.i18n = { en: {}, it: {} };
    if (!p.i18n.en) p.i18n.en = {};
    if (!p.i18n.it) p.i18n.it = {};
    return p;
  }

  function initSiteState() {
    const p = ensurePersonalShape(JSON.parse(JSON.stringify(window.PORTFOLIO_DATA.personal)));
    return {
      personal: p,
      skills: normalizeSkills(JSON.parse(JSON.stringify(window.PORTFOLIO_DATA.skills || []))),
      aboutHighlights: defaultHighlightsFromI18n(),
      bottomFeaturedProjectId: window.PORTFOLIO_DATA.bottomFeaturedProjectId,
    };
  }

  let siteState = initSiteState();

  function pickLocale(obj, key) {
    if (!obj || !obj[key]) return '';
    return obj[key].it || obj[key].en || '';
  }

  function bottomIdFromState() {
    const v = siteState.bottomFeaturedProjectId;
    const n = Number(v);
    return Number.isNaN(n) ? 6 : n;
  }

  function renderLargeFeaturedCard(p, idx, badgeText) {
    return `
      <article class="brutal-card brutal-featured brutal-card--yellow" data-index="${idx}" draggable="true">
        <div class="brutal-featured__img-wrap"><img src="${p.image}" class="brutal-featured__img" alt=""></div>
        <div class="brutal-featured__body">
          <span class="brutal-featured__badge">${badgeText}</span>
          <h3 class="brutal-featured__title">${pickLocale(p, 'title')}</h3>
          <p class="brutal-featured__desc">${pickLocale(p, 'description')}</p>
          <div class="brutal-card__tags" style="margin-bottom:1rem">
            ${(p.tags || []).map((tg) => `<span class="brutal-card__tag">${tg}</span>`).join('')}
          </div>
          <div class="brutal-featured__actions">
             ${p.demo ? `<span class="brutal-featured__cta brutal-featured__cta--live">Demo</span>` : ''}
             ${p.github ? `<span class="brutal-featured__cta">Code</span>` : ''}
          </div>
        </div>
        <div class="admin-edit-overlay">
           <div class="admin-edit-btn">#${p.id} ✎ Modifica o sposta</div>
        </div>
      </article>`;
  }

  const API_URL = '/api/admin-projects';

  function ensureFourHighlights() {
    while (siteState.aboutHighlights.length < 4) {
      siteState.aboutHighlights.push({
        title: { en: '', it: '' },
        description: { en: '', it: '' },
        tag: '',
        mod: 'yellow',
      });
    }
    siteState.aboutHighlights = siteState.aboutHighlights.slice(0, 4);
  }

  function fillSiteForm() {
    const p = ensurePersonalShape(siteState.personal);
    document.getElementById('site-name').value = p.name || '';
    document.getElementById('site-bottom-id').value =
      siteState.bottomFeaturedProjectId != null ? siteState.bottomFeaturedProjectId : 6;
    document.getElementById('site-it-title').value = p.i18n.it.title || '';
    document.getElementById('site-it-tagline').value = p.i18n.it.tagline || '';
    document.getElementById('site-it-bio').value = p.i18n.it.bio || '';
    document.getElementById('site-en-title').value = p.i18n.en.title || '';
    document.getElementById('site-en-tagline').value = p.i18n.en.tagline || '';
    document.getElementById('site-en-bio').value = p.i18n.en.bio || '';
    document.getElementById('site-email').value = p.email || '';
    document.getElementById('site-github').value = p.github || '';
    document.getElementById('site-linkedin').value = p.linkedin || '';
    document.getElementById('site-discord').value = p.discord || '';
    document.getElementById('site-discord-user').value = p.discordUsername || '';
    document.getElementById('site-instagram').value = p.instagram || '';
    document.getElementById('site-facebook').value = p.facebook || '';
    document.getElementById('site-cv-pdf').value = p.cvPdfUrl || '';
    document.getElementById('site-cv-html').value = p.cvHtmlUrl || '';
    ensureFourHighlights();
    renderSkillsRows();
    renderHighlightsRows();
  }

  function renderSkillsRows() {
    if (!skillsEditorRows) return;
    skillsEditorRows.innerHTML = siteState.skills
      .map((s, i) => {
        const it = s.name && s.name.it !== undefined ? s.name.it : '';
        const en = s.name && s.name.en !== undefined ? s.name.en : '';
        const catOpts = SKILL_CATS.map(
          (c) => `<option value="${c}" ${s.category === c ? 'selected' : ''}>${c}</option>`
        ).join('');
        return `
      <div class="site-skill-row" data-index="${i}">
        <div class="site-skill-row-head">Skill #${i + 1}
          <button type="button" class="btn btn--danger btn-small skill-remove" data-skill-index="${i}">Rimuovi</button>
        </div>
        <div class="site-editor-grid site-editor-grid--2">
          <input type="text" class="form-input site-skill-it" placeholder="Nome IT" value="${String(it).replace(/"/g, '&quot;')}" />
          <input type="text" class="form-input site-skill-en" placeholder="Nome EN" value="${String(en).replace(/"/g, '&quot;')}" />
          <select class="form-input site-skill-cat">${catOpts}</select>
          <input type="text" class="form-input site-skill-mod" placeholder="mod card (opz.: yellow, cyan…)" value="${String(s.cardMod || '').replace(/"/g, '&quot;')}" />
        </div>
      </div>`;
      })
      .join('');
  }

  function renderHighlightsRows() {
    if (!highlightsEditorRows) return;
    ensureFourHighlights();
    highlightsEditorRows.innerHTML = siteState.aboutHighlights
      .map((h, i) => {
        const modOpts = HL_MODS.map(
          (m) => `<option value="${m}" ${h.mod === m ? 'selected' : ''}>${m}</option>`
        ).join('');
        const tit = h.title || { en: '', it: '' };
        const desc = h.description || { en: '', it: '' };
        return `
      <div class="site-hl-row" data-hl-index="${i}">
        <div class="site-skill-row-head">Highlight #${i + 1}</div>
        <div class="site-editor-grid site-editor-grid--2">
          <input type="text" class="form-input hl-tit-it" placeholder="Titolo IT" value="${String(tit.it || '').replace(/"/g, '&quot;')}" />
          <input type="text" class="form-input hl-tit-en" placeholder="Title EN" value="${String(tit.en || '').replace(/"/g, '&quot;')}" />
          <input type="text" class="form-input hl-desc-it" placeholder="Descrizione IT" value="${String(desc.it || '').replace(/"/g, '&quot;')}" />
          <input type="text" class="form-input hl-desc-en" placeholder="Description EN" value="${String(desc.en || '').replace(/"/g, '&quot;')}" />
          <input type="text" class="form-input hl-tag" placeholder="Tag (badge)" value="${String(h.tag || '').replace(/"/g, '&quot;')}" />
          <select class="form-input hl-mod">${modOpts}</select>
        </div>
      </div>`;
      })
      .join('');
  }

  function readSiteFromForm() {
    const p = ensurePersonalShape(siteState.personal);
    p.name = document.getElementById('site-name').value.trim();
    p.email = document.getElementById('site-email').value.trim();
    p.github = document.getElementById('site-github').value.trim();
    p.linkedin = document.getElementById('site-linkedin').value.trim();
    p.discord = document.getElementById('site-discord').value.trim();
    p.discordUsername = document.getElementById('site-discord-user').value.trim();
    p.instagram = document.getElementById('site-instagram').value.trim();
    p.facebook = document.getElementById('site-facebook').value.trim();
    p.cvPdfUrl = document.getElementById('site-cv-pdf').value.trim();
    p.cvHtmlUrl = document.getElementById('site-cv-html').value.trim();
    p.i18n.it.title = document.getElementById('site-it-title').value;
    p.i18n.it.tagline = document.getElementById('site-it-tagline').value;
    p.i18n.it.bio = document.getElementById('site-it-bio').value;
    p.i18n.en.title = document.getElementById('site-en-title').value;
    p.i18n.en.tagline = document.getElementById('site-en-tagline').value;
    p.i18n.en.bio = document.getElementById('site-en-bio').value;
    const bid = parseInt(document.getElementById('site-bottom-id').value, 10);
    siteState.bottomFeaturedProjectId = Number.isNaN(bid) ? 6 : bid;

    siteState.skills = [];
    document.querySelectorAll('#skills-editor-rows .site-skill-row').forEach((row) => {
      siteState.skills.push({
        name: {
          it: row.querySelector('.site-skill-it').value.trim(),
          en: row.querySelector('.site-skill-en').value.trim(),
        },
        category: row.querySelector('.site-skill-cat').value,
        cardMod: row.querySelector('.site-skill-mod').value.trim(),
      });
    });

    siteState.aboutHighlights = [];
    document.querySelectorAll('#highlights-editor-rows .site-hl-row').forEach((row) => {
      siteState.aboutHighlights.push({
        title: {
          it: row.querySelector('.hl-tit-it').value.trim(),
          en: row.querySelector('.hl-tit-en').value.trim(),
        },
        description: {
          it: row.querySelector('.hl-desc-it').value.trim(),
          en: row.querySelector('.hl-desc-en').value.trim(),
        },
        tag: row.querySelector('.hl-tag').value.trim(),
        mod: row.querySelector('.hl-mod').value,
      });
    });
    ensureFourHighlights();
  }

  async function fetchProjects() {
    try {
      const resp = await fetch(API_URL, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.status === 401) {
        logout();
        return;
      }
      const json = await resp.json();

      if (json.projects && json.projects.length > 0) {
        projectsArray = json.projects;
      } else {
        projectsArray =
          window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.projects
            ? JSON.parse(JSON.stringify(window.PORTFOLIO_DATA.projects))
            : [];
      }

      if (json.personal && typeof json.personal === 'object') {
        siteState.personal = ensurePersonalShape(json.personal);
      }
      if (json.skills && Array.isArray(json.skills)) {
        siteState.skills = normalizeSkills(json.skills);
      }
      if (json.aboutHighlights && Array.isArray(json.aboutHighlights) && json.aboutHighlights.length > 0) {
        siteState.aboutHighlights = json.aboutHighlights;
        ensureFourHighlights();
      }
      if (json.bottomFeaturedProjectId != null && json.bottomFeaturedProjectId !== '') {
        siteState.bottomFeaturedProjectId = json.bottomFeaturedProjectId;
      }

      fillSiteForm();
      renderGrid();
      showDashboard();
      if (typeof window.loadAdminStats === 'function') window.loadAdminStats();
    } catch (e) {
      console.error(e);
      showToast('Errore di connessione al database.', true);
    }
  }

  async function saveProjects() {
    readSiteFromForm();
    btnSave.textContent = 'Salvando...';
    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projects: projectsArray,
          personal: siteState.personal,
          skills: siteState.skills,
          aboutHighlights: siteState.aboutHighlights,
          bottomFeaturedProjectId: siteState.bottomFeaturedProjectId,
        }),
      });

      if (resp.status === 401) {
        logout();
        return;
      }
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || 'Errore');
      }

      showToast('✅ Cambiamenti salvati online!');
      if (typeof window.loadAdminStats === 'function') window.loadAdminStats();
    } catch (e) {
      console.error(e);
      showToast(e.message, true);
    }
    btnSave.textContent = '💾 Salva Cambiamenti Online';
  }

  function renderGrid() {
    projectsContent.innerHTML = '';
    projectCount.textContent = `(${projectsArray.length})`;

    const bottomId = bottomIdFromState();

    if (projectsArray.length === 0) {
      projectsContent.innerHTML = renderNewCard();
      addCardListeners();
      publishProjectsForStats();
      return;
    }

    const featured = projectsArray[0];
    const rest = projectsArray.slice(1);
    const bottomProject = rest.find((p) => p.id === bottomId) || null;
    const middleProjects = rest.filter((p) => p.id !== bottomId);

    const topHtml =
      `<div class="admin-section-block">` +
      `<p class="admin-section-label">1 · Card in alto <span>(primo progetto in lista)</span></p>` +
      renderLargeFeaturedCard(featured, 0, 'Featured Highlight') +
      `</div>`;

    let sHtml = middleProjects
      .map((p) => {
        const realIdx = projectsArray.indexOf(p);
        return `
      <article class="brutal-project" data-index="${realIdx}" draggable="true">
        <div class="brutal-project-inner">
          <div class="brutal-project__img-wrap"><img src="${p.image}" class="brutal-project__img" alt=""></div>
          <div class="brutal-project__body">
            <h3 class="brutal-project__title">${pickLocale(p, 'title')}</h3>
            <p class="brutal-project__desc">${pickLocale(p, 'description')}</p>
          </div>
        </div>
        <div class="admin-edit-overlay">
           <div class="admin-edit-btn">#${p.id} ✎ Modifica o sposta</div>
        </div>
      </article>
      `;
      })
      .join('');

    sHtml += renderNewCard();

    const gridHtml =
      `<div class="admin-section-block">` +
      `<p class="admin-section-label">2 · Griglia centrale <span>(tutti tranne la card bassa dedicata)</span></p>` +
      `<div class="brutal-projects-grid-wrap"><div class="brutal-projects-grid">${sHtml}</div></div>` +
      `</div>`;

    let bottomHtml = '';
    if (bottomProject) {
      const bIdx = projectsArray.indexOf(bottomProject);
      bottomHtml =
        `<div class="admin-section-block">` +
        `<p class="admin-section-label">3 · Card larga in basso <span>(id ${bottomId} · Creative Lab sul sito)</span></p>` +
        renderLargeFeaturedCard(bottomProject, bIdx, 'Creative Lab') +
        `</div>`;
    } else {
      bottomHtml =
        `<div class="admin-section-block">` +
        `<p class="admin-section-label">3 · Card larga in basso <span>(id ${bottomId} — nessun progetto con questo id dopo il primo)</span></p>` +
        `<p style="font-family:'Space Mono';font-size:0.85rem;padding:1rem;border:3px dashed #000;background:#fff;">Aggiungi un progetto con id <strong>${bottomId}</strong> oppure cambia l’id nel pannello <strong>Contenuti sito</strong> sopra.</p>` +
        `</div>`;
    }

    projectsContent.innerHTML = topHtml + gridHtml + bottomHtml;

    addCardListeners();
    publishProjectsForStats();
  }

  function renderNewCard() {
    return `<div class="new-project-card" id="btn-add-new">+ NUOVO PROGETTO</div>`;
  }

  let draggedIdx = null;
  function addCardListeners() {
    document.querySelectorAll('.admin-preview-window article').forEach((card) => {
      card.addEventListener('click', () => {
        if (draggedIdx !== null) return;
        openModal(parseInt(card.dataset.index, 10));
      });

      card.addEventListener('dragstart', (e) => {
        draggedIdx = parseInt(card.dataset.index, 10);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => card.classList.add('dragging'), 0);
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        draggedIdx = null;
      });

      card.addEventListener('dragover', (e) => {
        e.preventDefault();
      });

      card.addEventListener('drop', (e) => {
        e.preventDefault();
        const dropIdx = parseInt(card.dataset.index, 10);
        if (draggedIdx === null || draggedIdx === dropIdx || isNaN(dropIdx)) return;

        const temp = projectsArray[draggedIdx];
        projectsArray.splice(draggedIdx, 1);
        projectsArray.splice(dropIdx, 0, temp);

        draggedIdx = null;
        renderGrid();
      });
    });

    const addBtn = document.getElementById('btn-add-new');
    if (addBtn) addBtn.addEventListener('click', createNewProject);
  }

  function openModal(idx) {
    const p = projectsArray[idx];
    document.getElementById('modal-index').value = idx;
    document.getElementById('modal-title').textContent = `Modifica: ${p.title?.it || 'Nuovo Progetto'}`;
    document.getElementById('modal-id').value = p.id || '';
    document.getElementById('modal-img').value = p.image || '';
    document.getElementById('modal-title-it').value = p.title?.it || '';
    document.getElementById('modal-title-en').value = p.title?.en || '';
    document.getElementById('modal-desc-it').value = p.description?.it || '';
    document.getElementById('modal-desc-en').value = p.description?.en || '';
    document.getElementById('modal-demo').value = p.demo || '';
    document.getElementById('modal-github').value = p.github || '';
    document.getElementById('modal-tags').value = (p.tags || []).join(', ');

    editModal.classList.add('is-open');
  }

  function closeModal() {
    editModal.classList.remove('is-open');
    projectForm.reset();
  }

  function createNewProject() {
    const newId = projectsArray.length > 0 ? Math.max(...projectsArray.map((p) => p.id)) + 1 : 1;
    projectsArray.push({
      id: newId,
      title: { en: 'Draft', it: 'Bozza' },
      description: { en: '', it: '' },
      image: '',
      tags: [],
      github: '',
      demo: '',
    });
    openModal(projectsArray.length - 1);
  }

  projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const idx = parseInt(document.getElementById('modal-index').value, 10);
    const rawTags = document
      .getElementById('modal-tags')
      .value.split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    projectsArray[idx] = {
      id: parseInt(document.getElementById('modal-id').value, 10) || Date.now(),
      title: {
        it: document.getElementById('modal-title-it').value,
        en: document.getElementById('modal-title-en').value,
      },
      description: {
        it: document.getElementById('modal-desc-it').value,
        en: document.getElementById('modal-desc-en').value,
      },
      image: document.getElementById('modal-img').value,
      tags: rawTags,
      demo: document.getElementById('modal-demo').value,
      github: document.getElementById('modal-github').value,
    };

    closeModal();
    renderGrid();
  });

  btnDeleteProject.addEventListener('click', () => {
    const idx = parseInt(document.getElementById('modal-index').value, 10);
    const tit = projectsArray[idx].title?.it || 'questo progetto';
    if (confirm(`Vuoi davvero eliminare ${tit}?`)) {
      projectsArray.splice(idx, 1);
      closeModal();
      renderGrid();
    }
  });

  btnCloseModal.addEventListener('click', closeModal);
  btnCancelModal.addEventListener('click', closeModal);

  function showDashboard() {
    loginSection.style.display = 'none';
    dashboard.style.display = 'block';
  }

  function logout() {
    token = '';
    sessionStorage.removeItem('adminToken');
    loginSection.style.display = 'block';
    dashboard.style.display = 'none';
    loginError.style.display = 'block';
  }

  function showToast(msg, isError = false) {
    toast.textContent = msg;
    if (isError) {
      toast.style.background = '#ff3b3b';
      toast.style.color = '#fff';
    } else {
      toast.style.background = '#00d26a';
      toast.style.color = '#000';
    }
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  document.getElementById('btn-add-skill').addEventListener('click', () => {
    siteState.skills.push({ name: { en: '', it: '' }, category: 'core', cardMod: '' });
    renderSkillsRows();
  });

  skillsEditorRows.addEventListener('click', (e) => {
    const btn = e.target.closest('.skill-remove');
    if (!btn) return;
    const i = parseInt(btn.getAttribute('data-skill-index'), 10);
    if (Number.isNaN(i)) return;
    siteState.skills.splice(i, 1);
    renderSkillsRows();
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.style.display = 'none';
    token = passwordInput.value.trim();

    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projects: [] }),
      });

      if (resp.status === 401) {
        logout();
      } else if (resp.ok || resp.status === 400) {
        sessionStorage.setItem('adminToken', token);
        await fetchProjects();
      } else {
        throw new Error('Server error');
      }
    } catch (e) {
      console.error(e);
      showToast('Server error', true);
    }
  });

  btnLogout.addEventListener('click', () => {
    logout();
  });

  btnSave.addEventListener('click', saveProjects);

  if (token) fetchProjects();
  else {
    fillSiteForm();
  }
});
