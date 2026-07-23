/* ============================================================
   HURLEY ENTERPRISE LLC — Dynamic Site CMS Synchronizer
   js/site-cms.js
   Syncs live site content & property listings edited in dashboard
   ============================================================ */

(function() {
  const SITE_CONTENT_KEY = 'hurley_site_content';
  const SITE_PROP_KEY    = 'hurley_site_properties';

  function applyCmsContent() {
    try {
      const raw = localStorage.getItem(SITE_CONTENT_KEY);
      if (!raw) return;
      const c = JSON.parse(raw);

      // Phone numbers
      if (c.phone) {
        document.querySelectorAll('a[href^="tel:"]').forEach(a => {
          a.href = 'tel:+1' + c.phone.replace(/\D/g, '');
          if (a.textContent.includes('423-') || a.textContent.includes('(423)')) {
            a.textContent = c.phone;
          }
        });
      }

      // Email addresses
      if (c.email) {
        document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
          a.href = 'mailto:' + c.email;
          if (a.textContent.includes('@')) {
            a.textContent = c.email;
          }
        });
      }

      // Hero Title
      if (c.heroTitle) {
        const heroH1 = document.querySelector('h1.hero-title, .hero h1, header h1');
        if (heroH1) heroH1.textContent = c.heroTitle;
      }

      // Hero Subtitle
      if (c.heroSub) {
        const heroSub = document.querySelector('.hero-subtitle, p.hero-desc, .hero p');
        if (heroSub) heroSub.textContent = c.heroSub;
      }

      // Hero Tagline / Eyebrow
      if (c.heroTagline) {
        const tagline = document.querySelector('.hero-eyebrow, .hero-tagline, .overline');
        if (tagline) tagline.textContent = c.heroTagline;
      }

      // Physical Address
      if (c.address) {
        document.querySelectorAll('.cms-address, address').forEach(el => {
          el.textContent = c.address;
        });
      }

      // Business Hours
      if (c.hours) {
        document.querySelectorAll('.cms-hours').forEach(el => {
          el.textContent = c.hours;
        });
      }

      // CEO Name
      if (c.ceoName) {
        document.querySelectorAll('.cms-ceo-name').forEach(el => {
          el.textContent = c.ceoName;
        });
      }

      // CEO Bio
      if (c.ceoBio) {
        document.querySelectorAll('.cms-ceo-bio').forEach(el => {
          el.textContent = c.ceoBio;
        });
      }
    } catch(e) { console.warn('CMS content sync notice:', e); }
  }

  function applyCmsProperties() {
    try {
      const raw = localStorage.getItem(SITE_PROP_KEY);
      if (!raw) return;
      const props = JSON.parse(raw);
      if (!props || !props.length) return;

      const grid = document.getElementById('listings-grid');
      if (!grid) return;

      // Re-render property cards from CMS
      grid.innerHTML = props.map(p => {
        const tagsHtml = p.specs ? p.specs.split(',').map(s => `<span class="listing-tag">${s.trim()}</span>`).join('') : '';
        return `
          <article class="listing-card" data-category="${p.category || 'office'}" id="listing-${p.id}" itemscope itemtype="https://schema.org/RealEstateListing">
            <div class="listing-image">
              <img src="${p.img || 'img/office.png'}" alt="${p.title}" loading="lazy" itemprop="image">
              <div class="listing-status">
                <span class="status-badge status-featured">${p.status || 'For Lease'}</span>
              </div>
            </div>
            <div class="listing-body">
              <p class="listing-type">${p.category ? p.category.toUpperCase() : 'COMMERCIAL'} · ${p.address}</p>
              <h2 class="listing-name" itemprop="name">${p.title}</h2>
              <p class="listing-location" itemprop="address">📍 ${p.address}</p>
              <p class="listing-price" style="color:var(--gold);font-weight:800;margin:0.4rem 0;">${p.price}</p>
              <p class="listing-desc" itemprop="description">${p.desc}</p>
              <div class="listing-tags" style="margin-top:0.75rem;">
                ${tagsHtml}
              </div>
              <a href="contact.html" class="btn btn--primary" style="width:100%;justify-content:center;margin-top:1rem;">
                Inquire About Property →
              </a>
            </div>
          </article>
        `;
      }).join('');
    } catch(e) { console.warn('CMS property sync notice:', e); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      applyCmsContent();
      applyCmsProperties();
    });
  } else {
    applyCmsContent();
    applyCmsProperties();
  }
})();
