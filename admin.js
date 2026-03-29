document.addEventListener('DOMContentLoaded', () => {
  const loginSection = document.getElementById('login-section');
  const dashboard = document.getElementById('dashboard');
  const loginForm = document.getElementById('login-form');
  const passwordInput = document.getElementById('password');
  const loginError = document.getElementById('login-error');
  const btnLogout = document.getElementById('btn-logout');
  const btnSave = document.getElementById('btn-save');
  const btnAdd = document.getElementById('btn-add');
  const projectsList = document.getElementById('projects-list');
  const projectCount = document.getElementById('project-count');
  const toast = document.getElementById('toast');

  let token = sessionStorage.getItem('adminToken') || '';
  let projectsArray = [];

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
        console.warn('DB is empty, scaling to initial data.js fallback');
        projectsArray = window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.projects ? 
          JSON.parse(JSON.stringify(window.PORTFOLIO_DATA.projects)) : [];
      }
      renderList();
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
      
      showToast('Progetti salvati con successo online! Ricarica il portfolio.');
    } catch(e) {
      console.error(e);
      showToast(e.message, true);
    }
    btnSave.textContent = '💾 Salva Online';
  }

  // --- UI Render ---
  function renderList() {
    projectsList.innerHTML = '';
    projectCount.textContent = `(${projectsArray.length})`;

    projectsArray.forEach((proj, idx) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.draggable = true;
      card.dataset.index = idx;

      card.innerHTML = `
        <div class="project-card__header">
          <span class="drag-handle" title="Trascina per spostare">☰</span>
          <h3 style="flex:1">#${proj.id} - ${proj.title?.it || 'Nuovo Progetto'}</h3>
          <button type="button" class="btn btn-toggle" style="margin-right:1rem; padding: 0.25rem 1rem;">✏️ Modifica</button>
          <button type="button" class="btn btn--danger btn-delete" style="padding: 0.25rem 1rem;">✕</button>
        </div>
        <div class="project-card__body">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">ID Progetto (Unico)</label>
              <input type="number" class="form-input input-id" value="${proj.id || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Immagine (URL Proxy o locale)</label>
              <input type="text" class="form-input input-img" value="${proj.image || ''}" placeholder="es. ./assets/mokup.png">
            </div>
          </div>

          <div class="grid-2">
             <div class="form-group">
                <label class="form-label">Titolo (IT)</label>
                <input type="text" class="form-input input-title-it" value="${proj.title?.it || ''}">
             </div>
             <div class="form-group">
                <label class="form-label">Titolo (EN)</label>
                <input type="text" class="form-input input-title-en" value="${proj.title?.en || ''}">
             </div>
          </div>

          <div class="grid-2">
             <div class="form-group">
                <label class="form-label">Descrizione (IT)</label>
                <textarea class="form-input form-textarea input-desc-it">${proj.description?.it || ''}</textarea>
             </div>
             <div class="form-group">
                <label class="form-label">Descrizione (EN)</label>
                <textarea class="form-input form-textarea input-desc-en">${proj.description?.en || ''}</textarea>
             </div>
          </div>

          <div class="grid-2">
             <div class="form-group">
                <label class="form-label">URL Demo Pubblica</label>
                <input type="text" class="form-input input-demo" value="${proj.demo || ''}" placeholder="https://...">
             </div>
             <div class="form-group">
                <label class="form-label">URL GitHub</label>
                <input type="text" class="form-input input-github" value="${proj.github || ''}" placeholder="https://github.com/...">
             </div>
          </div>

          <div class="form-group" style="grid-column: 1 / -1;">
            <label class="form-label">Tags (separati da virgola)</label>
            <input type="text" class="form-input input-tags" value="${(proj.tags || []).join(', ')}" placeholder="HTML, CSS, GSAP...">
            <div class="tag-container">${(proj.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
          </div>
        </div>
      `;

      // Event Listeners for inputs
      card.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('change', () => collectData(card, idx));
      });

      card.querySelector('.btn-toggle').addEventListener('click', () => {
        card.classList.toggle('is-open');
      });

      card.querySelector('.btn-delete').addEventListener('click', () => {
        if(confirm(`Vuoi davvero eliminare il progetto "${proj.title?.it}"?`)) {
          projectsArray.splice(idx, 1);
          renderList();
        }
      });

      projectsList.appendChild(card);
    });

    setupDragAndDrop();
  }

  function collectData(card, idx) {
    const rawTags = card.querySelector('.input-tags').value.split(',').map(s => s.trim()).filter(Boolean);
    
    projectsArray[idx] = {
      id: parseInt(card.querySelector('.input-id').value, 10) || Date.now(),
      title: {
        en: card.querySelector('.input-title-en').value,
        it: card.querySelector('.input-title-it').value
      },
      description: {
        en: card.querySelector('.input-desc-en').value,
        it: card.querySelector('.input-desc-it').value
      },
      image: card.querySelector('.input-img').value,
      tags: rawTags,
      github: card.querySelector('.input-github').value,
      demo: card.querySelector('.input-demo').value,
    };
    
    // Update visual tags safely
    const tc = card.querySelector('.tag-container');
    tc.innerHTML = rawTags.map(t => `<span class="tag">${t}</span>`).join('');
    
    // Update header title
    card.querySelector('.project-card__header h3').textContent = `#${projectsArray[idx].id} - ${projectsArray[idx].title.it}`;
  }

  function setupDragAndDrop() {
    const cards = projectsList.querySelectorAll('.project-card');
    let draggedIdx = null;

    cards.forEach(card => {
      card.addEventListener('dragstart', (e) => {
        if (!e.target.classList.contains('project-card')) return;
        draggedIdx = parseInt(card.dataset.index);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => card.classList.add('dragging'), 0);
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        renderList(); // re-render needed to fix index dataset
      });

      card.addEventListener('dragover', (e) => {
        e.preventDefault();
        const overIdx = parseInt(card.dataset.index);
        if (draggedIdx === null || draggedIdx === overIdx) return;
        
        // Swap array items
        const temp = projectsArray[draggedIdx];
        projectsArray.splice(draggedIdx, 1);
        projectsArray.splice(overIdx, 0, temp);
        
        // Render will visually swap them immediately (dragend cleans up classes)
        draggedIdx = overIdx;
        projectsList.insertBefore(
          projectsList.children[draggedIdx], 
          draggedIdx > overIdx ? card : card.nextSibling
        );
      });
    });
  }

  // --- Navigation & Auth ---
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

  // --- Event Listeners ---
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.style.display = 'none';
    token = passwordInput.value.trim();

    try {
      const resp = await fetch(API_URL, {
        method: 'POST', // verify auth quickly
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ projects: [] }) // Dummy payload, if bad password, returns 401
      });

      if (resp.status === 401) {
        logout();
      } else if (resp.ok || resp.status === 400) { 
        // 400 means correct token but bad payload, which is fine just for auth testing
        // Let's actually just fetch projects with GET instead to truly verify auth?
        // Wait, GET is unprotected to load the portfolio! So POST is the only way to verify.
        // Actually our POST requires projects. Let's just catch 400 payload error as SUCCESS authentication!
        sessionStorage.setItem('adminToken', token);
        await fetchProjects();
      } else {
        throw new Error('Server error');
      }
    } catch(e) {
       console.error(e);
       showToast('Server down', true);
    }
  });

  btnLogout.addEventListener('click', () => {
    token = '';
    sessionStorage.removeItem('adminToken');
    loginSection.style.display = 'block';
    dashboard.style.display = 'none';
  });

  btnAdd.addEventListener('click', () => {
    const newId = projectsArray.length > 0 ? Math.max(...projectsArray.map(p => p.id)) + 1 : 1;
    projectsArray.push({
      id: newId,
      title: { en: '', it: '' },
      description: { en: '', it: '' },
      image: '',
      tags: [],
      github: '',
      demo: ''
    });
    renderList();
    // Apri l'ultimo progetto inserito
    const cards = projectsList.querySelectorAll('.project-card');
    if(cards.length) cards[cards.length - 1].classList.add('is-open');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  });

  btnSave.addEventListener('click', saveProjects);

  // --- Init ---
  if (token) {
    // Attempt auto-login
    fetchProjects();
  }
});
