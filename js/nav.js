/* HURLEY ENTERPRISE LLC — Navigation JS */
(function () {
  'use strict';
  const nav      = document.getElementById('site-nav') || document.getElementById('main-nav');
  const toggle   = document.getElementById('nav-toggle') || document.getElementById('nav-hamburger');
  const menu     = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('drawer-backdrop');
  const body     = document.body;
  const progress = document.getElementById('scroll-progress');

  /* ── Scroll progress + nav shadow ── */
  function onScroll() {
    const y = window.scrollY;
    if (y > 40) { nav?.classList.add('scrolled'); } else { nav?.classList.remove('scrolled'); }
    if (progress) {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Drawer open / close ── */
  function openMenu() {
    menu?.classList.add('open');
    backdrop?.classList.add('open');
    toggle?.classList.add('active');
    toggle?.setAttribute('aria-expanded', 'true');
    body.classList.add('menu-open');
    body.style.overflow = 'hidden'; // prevent scroll behind drawer
  }
  function closeMenu() {
    menu?.classList.remove('open');
    backdrop?.classList.remove('open');
    toggle?.classList.remove('active');
    toggle?.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
    body.style.overflow = '';
  }

  toggle?.addEventListener('click', () => {
    menu?.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close on backdrop click
  backdrop?.addEventListener('click', closeMenu);

  // Close on drawer-close button
  document.querySelector('.drawer-close')?.addEventListener('click', closeMenu);

  // Close on nav link click
  document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', closeMenu));

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu?.classList.contains('open')) closeMenu();
  });

  /* ── Active link highlight ── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .nav-links a, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop() || '';
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();
