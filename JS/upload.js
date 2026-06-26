// Upload, storage, and rendering for quizzes/exams images
(() => {
  const STORAGE_KEY = 'asu_quizzes';

  function $(sel, root = document) { return root.querySelector(sel); }
  function $all(sel, root = document) { return Array.from((root||document).querySelectorAll(sel)); }

  function getQuizzes() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch (e) { return []; }
  }

  function saveQuizzes(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    // trigger storage event for same-tab listeners
    localStorage.setItem(STORAGE_KEY + '_updated_at', Date.now().toString());
  }

  function showToast(msg, timeout = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      Object.assign(container.style, {position:'fixed',right:'18px',top:'18px',zIndex:9999});
      document.body.appendChild(container);
    }
    const t = document.createElement('div');
    t.textContent = msg;
    Object.assign(t.style, {background:'#063',color:'#fff',padding:'8px 12px',borderRadius:'10px',marginTop:'8px',boxShadow:'0 6px 18px rgba(0,0,0,0.12)',fontWeight:700});
    container.appendChild(t);
    setTimeout(() => t.style.opacity = '0', timeout - 300);
    setTimeout(() => t.remove(), timeout);
  }

  function formatDate(iso) {
    try { const d = new Date(iso); return d.toLocaleString(); } catch { return iso; }
  }

  function renderQuizzes() {
    const container = document.getElementById('quizzes-container');
    if (!container) return;
    const list = getQuizzes().slice().reverse();
    container.innerHTML = '';
    if (list.length === 0) {
      container.innerHTML = '<div style="color:var(--muted)">No quizzes or exams yet.</div>';
      return;
    }
    list.forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = 'quiz-card fade-in slide-up zoom-in';
      card.innerHTML = `
        <img class="quiz-thumb" src="${q.image}" alt="${escapeHtml(q.title)}" />
        <div class="quiz-body">
          <div class="quiz-title">${escapeHtml(q.title)}</div>
          <div class="quiz-meta">
            <div>${escapeHtml(q.instructor)}</div>
            <div><span class="quiz-badge">${escapeHtml(q.status)}</span></div>
          </div>
          <div class="quiz-meta" style="margin-top:8px;color:var(--muted);font-size:0.8rem;">${formatDate(q.date)}</div>
        </div>
      `;
      container.appendChild(card);
      // slight stagger
      card.style.animationDelay = `${idx * 60}ms`;
    });
  }

  function escapeHtml(s) { return String(s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]); }

  // Instructor page: wire upload form
  function initInstructorUpload() {
    const fileInput = document.getElementById('upload-file');
    const titleInput = document.getElementById('upload-title');
    const statusSelect = document.getElementById('upload-status');
    const previewImg = document.getElementById('preview-image');
    const previewTitle = document.getElementById('preview-title');
    const previewInstructor = document.getElementById('preview-instructor');
    const previewBtn = document.getElementById('preview-btn');
    const publishBtn = document.getElementById('publish-btn');
    const progressArea = document.getElementById('upload-progress');
    const progressFill = document.getElementById('upload-progress-fill');
    const progressText = document.getElementById('upload-progress-text');

    if (!fileInput || !titleInput || !publishBtn) return;

    // auto-fill instructor name if available in page
    const instr = (document.getElementById('preview-instructor') || {}).textContent || 'Instructor';
    previewInstructor.textContent = instr;

    previewBtn.addEventListener('click', () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) { showToast('Please choose an image first'); return; }
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewTitle.textContent = titleInput.value || file.name;
      };
      reader.readAsDataURL(file);
    });

    publishBtn.addEventListener('click', () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) { showToast('Select an image to publish'); return; }
      const title = titleInput.value || file.name;
      const status = statusSelect.value || 'Published';
      const reader = new FileReader();
      reader.onprogress = (ev) => {
        if (ev.lengthComputable) {
          const pct = Math.round((ev.loaded / ev.total) * 100);
          progressArea.style.display = 'block';
          progressFill.style.width = pct + '%';
          progressText.textContent = pct + '%';
        }
      };
      reader.onloadstart = () => {
        progressArea.style.display = 'block';
        progressFill.style.width = '2%';
        progressText.textContent = '0%';
        publishBtn.disabled = true;
      };
      reader.onload = (e) => {
        // simulate small server processing delay
        let pct = 0;
        const fakeInterval = setInterval(() => {
          pct += Math.floor(Math.random() * 12) + 6;
          if (pct >= 100) pct = 100;
          progressFill.style.width = pct + '%';
          progressText.textContent = pct + '%';
          if (pct >= 100) {
            clearInterval(fakeInterval);
            const list = getQuizzes();
            list.push({
              id: Date.now(),
              title: title,
              instructor: instr || 'Instructor',
              date: new Date().toISOString(),
              status: status,
              image: e.target.result
            });
            saveQuizzes(list);
            showToast('Image published');
            publishBtn.disabled = false;
            // reset inputs for convenience
            fileInput.value = '';
            titleInput.value = '';
            previewImg.src = '';
            previewTitle.textContent = 'No preview';
            progressArea.style.display = 'none';
          }
        }, 180);
      };
      reader.onerror = () => { showToast('Failed to read file'); publishBtn.disabled = false; };
      reader.readAsDataURL(file);
    });
  }

  // Student page or shared renderer
  function initRenderer() {
    renderQuizzes();
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY || e.key === STORAGE_KEY + '_updated_at') {
        renderQuizzes();
      }
    });
  }

  // Initialize on load
  document.addEventListener('DOMContentLoaded', () => {
    initInstructorUpload();
    initRenderer();
  });

})();
