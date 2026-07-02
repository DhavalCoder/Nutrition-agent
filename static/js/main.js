/* ═══════════════════════════════════════════════════════════════════════════
   NutriGuru — Main JavaScript
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
  }
}

function toggleTheme() {
  const current = getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
  
  // Subtle transition effect
  document.body.style.transition = 'background 0.5s cubic-bezier(0.4, 0, 0.2, 1), color 0.5s';
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
  toastEl.style.cssText = 'max-width: 360px; border-radius: 14px;';
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body d-flex align-items-center gap-2">
        <span style="font-size:1.1rem">${icons[type] || '💬'}</span>
        <span style="font-family:Plus Jakarta Sans,sans-serif;font-weight:600">${message}</span>
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

  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 100) {
          nav.style.background = 'rgba(10, 14, 18, 0.95)';
          nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.2)';
        } else {
          nav.style.background = 'rgba(10, 14, 18, 0.85)';
          nav.style.boxShadow = 'none';
        }
        
        // Hide/show on scroll
        if (currentScroll > lastScroll && currentScroll > 300) {
          nav.style.transform = 'translateY(-100%)';
        } else {
          nav.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ── Intersection Observer for Scroll Animations ──────────────────────────────
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-up, .fade-in-right, .bento-card, .food-card, .stat-mini')
    .forEach(el => observer.observe(el));
}

// ── Smooth Scroll for Anchor Links ───────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ── Copy to Clipboard Helper ──────────────────────────────────────────────────
function copyToClipboard(text, label = 'Content') {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
      .then(() => showToast(`${label} copied! 📋`, 'success'));
  } else {
    // Fallback
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

// ── Debounce Utility ──────────────────────────────────────────────────────────
function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

// ── Page Load Animation ───────────────────────────────────────────────────────
window.addEventListener('load', () => {
  // Hide loader
  setTimeout(() => {
    const loader = document.getElementById('pageLoader');
    if (loader) loader.classList.add('loaded');
  }, 300);
});

// ── Initialize on DOM Ready ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme
  applyTheme(getTheme());

  // Theme toggle
  const toggle = document.getElementById('themeToggle');
  if (toggle) toggle.addEventListener('click', toggleTheme);

  // Navbar effects
  initNavbarScroll();

  // Scroll animations
  initScrollAnimations();

  // Smooth scroll
  initSmoothScroll();

  // Configure marked.js for markdown parsing
  if (typeof marked !== 'undefined') {
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: false,
      mangle: false
    });
  }

  // Keyboard shortcut: Ctrl+/ to focus chat input
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      const chatInput = document.getElementById('chatInput');
      if (chatInput) {
        chatInput.focus();
        chatInput.select();
      }
    }
  });

  // Add transition to body after load
  setTimeout(() => {
    document.body.style.transition = 'background 0.5s cubic-bezier(0.4, 0, 0.2, 1), color 0.5s';
  }, 500);
});

// ── Parallax Effect on Hero Images (if on homepage) ───────────────────────────
if (window.location.pathname === '/') {
  let mouseMoveHandler = null;
  
  window.addEventListener('load', () => {
    const imgs = document.querySelectorAll('.hero-img');
    if (imgs.length === 0) return;

    mouseMoveHandler = debounce((e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      imgs.forEach((img, i) => {
        const speed = (i + 1) * 8;
        const translateX = x * speed;
        const translateY = y * speed;
        const scale = 1 + (i * 0.015);
        img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
      });
    }, 10);

    document.addEventListener('mousemove', mouseMoveHandler);
  });
}

// ── Export for use in templates ───────────────────────────────────────────────
window.showToast = showToast;
window.copyToClipboard = copyToClipboard;
