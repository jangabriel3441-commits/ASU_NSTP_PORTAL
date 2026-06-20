const tabs = document.querySelectorAll('.tab');
const navBtns = document.querySelectorAll('.nav-btn');
const panels = {
  home: document.getElementById('panel-home'),
  modules: document.getElementById('panel-modules'),
  grades: document.getElementById('panel-grades')
};
const progressFill = document.getElementById('progress-fill');
const progressLabel = document.getElementById('progress-label');
const downloadBtn = document.getElementById('download-btn');

function activate(name) {
  Object.keys(panels).forEach(key => {
    const active = key === name;
    panels[key].classList.toggle('active', active);
  });
  tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === name));
  navBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === name));
}

function updateProgress(value) {
  progressFill.style.width = `${value}%`;
  progressLabel.textContent = `Progress: ${value}%`;
  progressFill.dataset.progress = value;
}

function animateProgress(start, end) {
  let current = start;
  const step = end > start ? 2 : -2;
  const interval = setInterval(() => {
    current += step;
    updateProgress(current);
    if ((step > 0 && current >= end) || (step < 0 && current <= end)) {
      clearInterval(interval);
    }
  }, 10);
}

tabs.forEach(tab => tab.addEventListener('click', () => activate(tab.dataset.tab)));
navBtns.forEach(btn => btn.addEventListener('click', () => activate(btn.dataset.tab)));

downloadBtn.addEventListener('click', () => {
  const current = parseInt(progressFill.dataset.progress || '60', 10);
  const next = Math.min(100, current + 10);
  animateProgress(current, next);
  const originalText = downloadBtn.innerHTML;
  downloadBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>Downloaded</span>';
  setTimeout(() => {
    downloadBtn.innerHTML = originalText;
  }, 1600);
});

window.addEventListener('load', () => {
  updateProgress(0);
  setTimeout(() => animateProgress(0, 60), 240);
});
