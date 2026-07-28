/* ============================================================
   HURLEY ENTERPRISE LLC — Dynamic Site CMS Synchronizer
   js/site-cms.js
   Syncs live site content, hero video, staff roster & property listings edited in dashboard
   ============================================================ */

(function() {
  const SITE_CONTENT_KEY = 'hurley_site_content';
  const SITE_PROP_KEY    = 'hurley_site_properties';
  const SITE_STAFF_KEY   = 'hurley_site_staff';

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

      // Hero Title (Homepage)
      if (c.heroTitle) {
        const heroH1 = document.querySelector('.home-hero h1.hero-headline');
        if (heroH1) heroH1.innerHTML = c.heroTitle;
      }

      // Hero Subtitle (Homepage)
      if (c.heroSub) {
        const heroSub = document.querySelector('.home-hero p.hero-sub');
        if (heroSub) heroSub.textContent = c.heroSub;
      }

      // Hero Video Banner (Homepage)
      if (c.heroVideo) {
        const video = document.querySelector('.hero-bg-video');
        if (video) {
          const source = video.querySelector('source');
          if (source && source.src !== c.heroVideo) {
            source.src = c.heroVideo;
            video.load();
          }
        }
      }

      // About Page Hero & Mission Text
      if (c.aboutTitle) {
        const aboutH1 = document.querySelector('.about-hero h1');
        if (aboutH1) aboutH1.textContent = c.aboutTitle;
      }
      if (c.aboutSub) {
        const aboutSub = document.querySelector('.about-hero p');
        if (aboutSub) aboutSub.textContent = c.aboutSub;
      }
      if (c.aboutMission) {
        const missionH2 = document.querySelector('.mission-grid h2.section-heading');
        if (missionH2) missionH2.textContent = c.aboutMission;
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

  function applyCmsStaff() {
    try {
      const raw = localStorage.getItem(SITE_STAFF_KEY);
      if (!raw) return;
      const staff = JSON.parse(raw);
      if (!staff || !staff.length) return;

      const leaderGrid = document.getElementById('team-leadership-grid');
      const supportGrid = document.getElementById('team-support-grid');

      const leaders = staff.filter(s => s.cat === 'leader' || !s.cat);
      const support = staff.filter(s => s.cat === 'support');

      if (leaderGrid && leaders.length) {
        leaderGrid.innerHTML = leaders.map(s => `
          <div class="team-card leader" id="staff-card-${s.id}">
            <div class="team-photo-wrap">
              <img src="${s.photo || 'img/office.png'}" alt="${s.name} — ${s.role}" loading="lazy">
              ${s.badge ? `<div style="position:absolute;top:0.75rem;left:0.75rem;background:rgba(201,168,76,0.92);color:#000;font-size:0.52rem;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;padding:0.3em 0.75em;border-radius:999px;white-space:nowrap;">${s.badge}</div>` : ''}
            </div>
            <div class="team-info">
              <p class="team-title">${s.role || 'Leadership'}</p>
              <h3 class="team-name">${s.name}</h3>
              <p class="team-bio">${s.bio || ''}</p>
            </div>
          </div>
        `).join('');
      }

      if (supportGrid && support.length) {
        supportGrid.innerHTML = support.map(s => `
          <div class="team-card support" id="staff-card-${s.id}">
            <div class="team-photo-wrap">
              <img src="${s.photo || 'img/office.png'}" alt="${s.name} — ${s.role}" loading="lazy">
            </div>
            <div class="team-info">
              <p class="team-title">${s.role || 'Team Member'}</p>
              <h3 class="team-name">${s.name}</h3>
              <p class="team-bio">${s.bio || ''}</p>
            </div>
          </div>
        `).join('');
      }
    } catch(e) { console.warn('CMS staff sync notice:', e); }
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
      applyCmsStaff();
      applyCmsProperties();
    });
  } else {
    applyCmsContent();
    applyCmsStaff();
    applyCmsProperties();
  }
})();
