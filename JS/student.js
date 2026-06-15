const tabs = document.querySelectorAll('.tab');
  const navBtns = document.querySelectorAll('.nav-btn');
  const panels = {
    home: document.getElementById('panel-home'),
    modules: document.getElementById('panel-modules'),
    grades: document.getElementById('panel-grades')
  };

  function activate(name) {
    Object.keys(panels).forEach(k => panels[k].classList.toggle('active', k === name));
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    navBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  }

  tabs.forEach(t => t.addEventListener('click', () => activate(t.dataset.tab)));
  navBtns.forEach(b => b.addEventListener('click', () => activate(b.dataset.tab)));

  document.getElementById('download-btn').addEventListener('click', function() {
    const fill = document.getElementById('progress-fill');
    const label = document.getElementById('progress-label');
    let current = parseInt(fill.style.width) || 60;
    let next = Math.min(100, current + 10);
    fill.style.width = next + '%';
    label.textContent = 'Progress: ' + next + '%';
    const original = this.innerHTML;
    this.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>Downloaded</span>';
    setTimeout(() => { this.innerHTML = original; }, 1500);
  });