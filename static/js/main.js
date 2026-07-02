/* ═══════════════════════════════════════════════════════════════════════════
   NutriGuru — Main JavaScript
   Global utilities: theme toggle, toasts, scroll effects
   ═══════════════════════════════════════════════════════════════════════════ */

// ── Theme Management ──────────────────────────────────────────────────────────
const THEME_KEY = 'nutriguru-theme';

function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-bs-theme', theme);
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    icon.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }
}

function toggleTheme() {
  const current = getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

// ── Toast Notifications ───────────────────────────────────────────────────────
function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: '✅', danger: '❌', warning: '⚠️', info: '💡' };
  const id = 'toast-' + Date.now();

  const toastEl = document.createElement('div');
  toastEl.id = id;
  toastEl.className = `toast align-items-center text-bg-${type} border-0 show animate__animated animate__fadeInRight`;
  toastEl.setAttribute('role', 'alert');
  toastEl.style.cssText = 'max-width: 360px; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.25);';
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body d-flex align-items-center gap-2">
        <span>${icons[type] || '💬'}</span>
        <span>${message}</span>
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto"
        onclick="document.getElementById('${id}').remove()"></button>
    </div>
  `;

  container.appendChild(toastEl);
  setTimeout(() => { if (toastEl.parentNode) toastEl.remove(); }, duration);
}

// ── Navbar Scroll Effect ──────────────────────────────────────────────────────
function initNavbarScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          nav.style.background = 'rgba(15, 23, 42, 0.95)';
        } else {
          nav.style.background = '';
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ── Intersection Observer Animations ─────────────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate__animated', 'animate__fadeInUp');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .stat-card, .glass-card, .member-card')
    .forEach(el => observer.observe(el));
}

// ── Copy to Clipboard Helper ──────────────────────────────────────────────────
function copyToClipboard(text, label = 'Content') {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
      .then(() => showToast(`${label} copied to clipboard! 📋`, 'success'));
  } else {
    // Fallback for non-HTTPS
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast(`${label} copied! 📋`, 'success');
  }
}

// ── Active Nav Link ───────────────────────────────────────────────────────────
function setActiveNavLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-pill').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });
}

// ── Smooth Scroll ─────────────────────────────────────────────────────────────
function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Format markdown in AI responses ──────────────────────────────────────────
function renderMarkdown(elementId) {
  const el = document.getElementById(elementId);
  if (el && typeof marked !== 'undefined') {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    el.innerHTML = marked.parse(el.textContent || '');
  }
}

// ── Debounce utility ──────────────────────────────────────────────────────────
function debounce(fn, wait) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), wait); };
}

// ── Init on DOM ready ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme
  applyTheme(getTheme());

  // Theme toggle button
  const toggle = document.getElementById('themeToggle');
  if (toggle) toggle.addEventListener('click', toggleTheme);

  // Navbar scroll behaviour
  initNavbarScroll();

  // Scroll-triggered animations
  initScrollAnimations();

  // Active nav link highlighting
  setActiveNavLink();

  // Configure marked.js
  if (typeof marked !== 'undefined') {
    marked.setOptions({ breaks: true, gfm: true });
  }

  // Add keyboard shortcut: Ctrl+/ to focus chat input
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      const chatInput = document.getElementById('chatInput');
      if (chatInput) { chatInput.focus(); chatInput.select(); }
    }
  });
});
