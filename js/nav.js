/* HURLEY ENTERPRISE LLC — Navigation JS */
(function () {
  'use strict';
  const nav      = document.getElementById('site-nav') || document.getElementById('main-nav');
  const toggle   = document.getElementById('nav-toggle') || document.getElementById('nav-hamburger');
  const menu     = document.getElementById('mobile-menu');
  const body     = document.body;
  const progress = document.getElementById('scroll-progress');

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

  function openMenu() { menu?.classList.add('open'); toggle?.classList.add('active'); body.classList.add('menu-open'); toggle?.setAttribute('aria-expanded','true'); }
  function closeMenu() { menu?.classList.remove('open'); toggle?.classList.remove('active'); body.classList.remove('menu-open'); toggle?.setAttribute('aria-expanded','false'); }
  toggle?.addEventListener('click', () => { menu?.classList.contains('open') ? closeMenu() : openMenu(); });
  document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', closeMenu));
  menu?.addEventListener('click', (e) => { if (e.target === menu) closeMenu(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu?.classList.contains('open')) closeMenu(); });

  // Mark active link — works for both .nav-link class and bare anchors in .nav-links
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .nav-links a').forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop() || '';
    if (href === currentPath || (currentPath === '' && href === 'index.html')) link.classList.add('active');
  });
})();
