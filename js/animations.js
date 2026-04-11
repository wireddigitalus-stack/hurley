/* HURLEY ENTERPRISE LLC — Scroll Animations */
(function () {
  'use strict';
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .stagger-reveal').forEach(el => io.observe(el));
})();
