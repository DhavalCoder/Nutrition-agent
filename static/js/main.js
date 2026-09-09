/* ═══════════════════════════════════════════════════════════════
   NUTRIGURU — main.js v6
   Premium Interactions · Reduced Motion · Accessible
   ═══════════════════════════════════════════════════════════════ */

// ── Reduced Motion Check ──────────────────────────────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Theme ─────────────────────────────────────────────────────────────────────
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
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

// ── Toast Notifications ───────────────────────────────────────────────────────
function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: '✅', danger: '❌', warning: '⚠️', info: '💡' };
  const id = 'toast-' + Date.now();
  const el = document.createElement('div');
  el.id = id;
  el.setAttribute('role', 'alert');
  el.setAttribute('aria-live', 'assertive');
  el.className = `toast align-items-center text-bg-${type} border-0 show`;
  if (!prefersReducedMotion) el.classList.add('animate__animated', 'animate__fadeInRight');
  el.style.cssText = 'max-width:360px;border-radius:14px;margin-bottom:8px';
  el.innerHTML = `
    <div class="d-flex">
      <div class="toast-body d-flex align-items-center gap-2">
        <span aria-hidden="true">${icons[type] || '💬'}</span>
        <span>${message}</span>
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto"
        aria-label="Close" onclick="document.getElementById('${id}').remove()"></button>
    </div>`;
  container.appendChild(el);
  setTimeout(() => { if (el.parentNode) el.remove(); }, duration);
}

// ── Copy to Clipboard ─────────────────────────────────────────────────────────
function copyToClipboard(text, label = 'Content') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => showToast(`${label} copied! 📋`, 'success'));
  } else {
    const el = document.createElement('textarea');
    el.value = text; el.style.position = 'absolute'; el.style.left = '-9999px';
    document.body.appendChild(el); el.select(); document.execCommand('copy');
    document.body.removeChild(el); showToast(`${label} copied! 📋`, 'success');
  }
}

// ── Debounce ──────────────────────────────────────────────────────────────────
function debounce(fn, wait) {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); };
}

// ── Navbar: Scroll Hide/Show ──────────────────────────────────────────────────
function initNavbar() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const noHide = document.body.classList.contains('no-hide-nav');
  let lastY = 0, ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y > 60) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
      if (!noHide && !prefersReducedMotion) {
        nav.style.transform = (y > lastY && y > 280) ? 'translateY(-100%)' : 'translateY(0)';
      }
      lastY = y; ticking = false;
    });
    ticking = true;
  }, { passive: true });
}

// ── Scroll Animations (IntersectionObserver) ──────────────────────────────────
function initScrollAnimations() {
  if (prefersReducedMotion) {
    // Make everything immediately visible
    document.querySelectorAll('.reveal, .reveal-mask, .fade-in-up, .fade-in-right').forEach(el => {
      el.style.opacity = '1'; el.style.transform = 'none';
      if(el.classList.contains('reveal-mask')) {
        Array.from(el.children).forEach(child => child.style.transform = 'none');
      }
    });
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-mask, .fade-in-up, .fade-in-right').forEach(el => obs.observe(el));
}

// ── Number Counter Animation ──────────────────────────────────────────────────
function initCounters() {
  if (prefersReducedMotion) {
    document.querySelectorAll('[data-count]').forEach(el => {
      el.textContent = Number(el.dataset.count).toLocaleString();
    });
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.floor(eased * target);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString() + suffix;
      };
      requestAnimationFrame(update);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
}

// ── Cursor Dot (desktop only) ─────────────────────────────────────────────────
function initCursorDot() {
  if (prefersReducedMotion) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot = document.createElement('div');
  dot.id = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  }, { passive: true });

  // Grow on interactive elements
  document.querySelectorAll('a, button, [role="button"], .bento-card, .food-card').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.style.transform = 'translate(-50%,-50%) scale(3)'; dot.style.opacity = '0.25'; });
    el.addEventListener('mouseleave', () => { dot.style.transform = 'translate(-50%,-50%) scale(1)'; dot.style.opacity = '0.55'; });
  });
}

// ── Hero Image Parallax ───────────────────────────────────────────────────────
function initParallax() {
  if (prefersReducedMotion) return;
  const imgs = document.querySelectorAll('.hero-img');
  if (!imgs.length) return;

  const handler = debounce((e) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    imgs.forEach((img, i) => {
      const s = (i + 1) * 7;
      img.style.transform = `translate(${x*s}px, ${y*s}px) scale(${1 + i * 0.012})`;
    });
  }, 8);

  document.addEventListener('mousemove', handler, { passive: true });
}

// ── Smooth Scroll ─────────────────────────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

// ── Page Loader ───────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('pageLoader');
    if (loader) loader.classList.add('loaded');
  }, prefersReducedMotion ? 0 : 280);
});

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getTheme());

  const toggle = document.getElementById('themeToggle');
  if (toggle) toggle.addEventListener('click', toggleTheme);

  initNavbar();
  initScrollAnimations();
  initCounters();
  initSmoothScroll();

  if (window.location.pathname === '/') {
    window.addEventListener('load', () => { initParallax(); initCursorDot(); });
  } else {
    initCursorDot();
  }

  if (typeof marked !== 'undefined') {
    marked.setOptions({ breaks: true, gfm: true });
  }

  // Ctrl+/ → focus chat input
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      const inp = document.getElementById('chatInput');
      if (inp) { inp.focus(); inp.select(); }
    }
  });
});

// ── Exports ───────────────────────────────────────────────────────────────────
window.showToast = showToast;
window.copyToClipboard = copyToClipboard;
