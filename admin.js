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

  // Modal elements
  const editModal = document.getElementById('edit-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const btnDeleteProject = document.getElementById('btn-delete-project');
  const projectForm = document.getElementById('project-form');

  let token = sessionStorage.getItem('adminToken') || '';
  let projectsArray = [];

  // --- Layout Helper (from script.js) ---
  function pickLocale(obj, key) {
    if (!obj || !obj[key]) return '';
    return obj[key].it || obj[key].en || '';
  }

  // --- API Handlers ---
  const API_URL = '/api/admin-projects';

  async function fetchProjects() {
    try {
      const resp = await fetch(API_URL, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resp.status === 401) {
        logout();
        return;
      }
      const json = await resp.json();
      
      if (json.projects && json.projects.length > 0) {
        projectsArray = json.projects;
      } else {
        projectsArray = window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.projects ? 
          JSON.parse(JSON.stringify(window.PORTFOLIO_DATA.projects)) : [];
      }
      renderGrid();
      showDashboard();
    } catch (e) {
      console.error(e);
      showToast('Errore di connessione al database.', true);
    }
  }

  async function saveProjects() {
    btnSave.textContent = 'Salvando...';
    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ projects: projectsArray })
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
    } catch(e) {
      console.error(e);
      showToast(e.message, true);
    }
    btnSave.textContent = '💾 Salva Cambiamenti Online';
  }

  // --- UI Render ---
  function renderGrid() {
    projectsContent.innerHTML = '';
    projectCount.textContent = `(${projectsArray.length})`;

    if (projectsArray.length === 0) {
      projectsContent.innerHTML = renderNewCard();
      addCardListeners();
      return;
    }

    const featured = projectsArray[0];
    const rest = projectsArray.slice(1);

    // Render Featured (Index 0)
    let fHtml = `
      <article class="brutal-card brutal-featured brutal-card--yellow" data-index="0" draggable="true">
        <div class="brutal-featured__img-wrap"><img src="${featured.image}" class="brutal-featured__img"></div>
        <div class="brutal-featured__body">
          <span class="brutal-featured__badge">Featured Highlight</span>
          <h3 class="brutal-featured__title">${pickLocale(featured, 'title')}</h3>
          <p class="brutal-featured__desc">${pickLocale(featured, 'description')}</p>
          <div class="brutal-card__tags" style="margin-bottom:1rem">
            ${(featured.tags || []).map(tg => `<span class="brutal-card__tag">${tg}</span>`).join('')}
          </div>
          <div class="brutal-featured__actions">
             ${featured.demo ? `<span class="brutal-featured__cta brutal-featured__cta--live">Demo</span>` : ''}
             ${featured.github ? `<span class="brutal-featured__cta">Code</span>` : ''}
          </div>
        </div>
        <div class="admin-edit-overlay">
           <div class="admin-edit-btn">#${featured.id} ✎ Modifica o sposta</div>
        </div>
      </article>
    `;

    // Render Grid per i restanti
    let sHtml = rest.map((p, i) => {
      const realIdx = i + 1;
      return `
      <article class="brutal-project" data-index="${realIdx}" draggable="true">
        <div class="brutal-project-inner">
          <div class="brutal-project__img-wrap"><img src="${p.image}" class="brutal-project__img"></div>
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
    }).join('');

    sHtml += renderNewCard(); // Aggiungi il pulsante di add alla fine della griglia

    let mainHtml = fHtml + `<div class="brutal-projects-grid-wrap"><div class="brutal-projects-grid">${sHtml}</div></div>`;
    projectsContent.innerHTML = mainHtml;

    addCardListeners();
  }

  function renderNewCard() {
    return `<div class="new-project-card" id="btn-add-new">+ NUOVO PROGETTO</div>`;
  }

  // --- Drag & Drop ---
  let draggedIdx = null;
  function addCardListeners() {
    // Apri Modale Edit clickando sull'overlay
    document.querySelectorAll('.admin-preview-window article').forEach(card => {
       card.addEventListener('click', (e) => {
         // Previeni l'edit se stiamo facendo drag
         if(draggedIdx !== null) return; 
         openModal(parseInt(card.dataset.index, 10));
       });

       // Drag & Drop
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
         e.preventDefault(); // Necessario per permettere il drop
       });

       card.addEventListener('drop', (e) => {
         e.preventDefault();
         const dropIdx = parseInt(card.dataset.index, 10);
         if (draggedIdx === null || draggedIdx === dropIdx || isNaN(dropIdx)) return;

         // Esegui lo switch effettivo degli elementi
         const temp = projectsArray[draggedIdx];
         projectsArray.splice(draggedIdx, 1);
         projectsArray.splice(dropIdx, 0, temp);

         draggedIdx = null;
         renderGrid(); // Ora ricrea il DOM serenamente
       });
    });

    const addBtn = document.getElementById('btn-add-new');
    if (addBtn) addBtn.addEventListener('click', createNewProject);
  }

  // --- Modal Editor Logic ---
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
    const newId = projectsArray.length > 0 ? Math.max(...projectsArray.map(p => p.id)) + 1 : 1;
    projectsArray.push({
      id: newId,
      title: { en: 'Draft', it: 'Bozza' },
      description: { en: '', it: '' },
      image: '',
      tags: [],
      github: '',
      demo: ''
    });
    // Apri subito il modal per editarlo
    openModal(projectsArray.length - 1);
  }

  projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const idx = parseInt(document.getElementById('modal-index').value, 10);
    const rawTags = document.getElementById('modal-tags').value.split(',').map(s => s.trim()).filter(Boolean);

    projectsArray[idx] = {
      id: parseInt(document.getElementById('modal-id').value, 10) || Date.now(),
      title: {
        it: document.getElementById('modal-title-it').value,
        en: document.getElementById('modal-title-en').value
      },
      description: {
        it: document.getElementById('modal-desc-it').value,
        en: document.getElementById('modal-desc-en').value
      },
      image: document.getElementById('modal-img').value,
      tags: rawTags,
      demo: document.getElementById('modal-demo').value,
      github: document.getElementById('modal-github').value
    };

    closeModal();
    renderGrid();
  });

  btnDeleteProject.addEventListener('click', () => {
    const idx = parseInt(document.getElementById('modal-index').value, 10);
    const tit = projectsArray[idx].title?.it || 'questo progetto';
    if(confirm(`Vuoi davvero eliminare ${tit}?`)) {
      projectsArray.splice(idx, 1);
      closeModal();
      renderGrid();
    }
  });

  btnCloseModal.addEventListener('click', closeModal);
  btnCancelModal.addEventListener('click', closeModal);

  // --- Auth logic ---
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

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.style.display = 'none';
    token = passwordInput.value.trim();

    try {
      const resp = await fetch(API_URL, {
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ projects: [] }) 
      });

      if (resp.status === 401) {
        logout();
      } else if (resp.ok || resp.status === 400) { 
        sessionStorage.setItem('adminToken', token);
        await fetchProjects();
      } else {
        throw new Error('Server error');
      }
    } catch(e) {
       console.error(e);
       showToast('Server error', true);
    }
  });

  btnLogout.addEventListener('click', () => {
    logout();
  });

  btnSave.addEventListener('click', saveProjects);

  // Auto-login
  if (token) fetchProjects();

});
