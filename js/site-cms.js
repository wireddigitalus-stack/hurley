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

      // Hero Bullets (Homepage)
      if (c.heroBullet1) {
        const b1 = document.querySelector('.cms-hero-bullet-1');
        if (b1) b1.textContent = c.heroBullet1;
      }
      if (c.heroBullet2) {
        const b2 = document.querySelector('.cms-hero-bullet-2');
        if (b2) b2.textContent = c.heroBullet2;
      }
      if (c.heroBullet3) {
        const b3 = document.querySelector('.cms-hero-bullet-3');
        if (b3) b3.textContent = c.heroBullet3;
      }

      // About Page Hero, Story & Mission Text
      if (c.aboutTitle) {
        const aboutH1 = document.querySelector('.about-hero h1');
        if (aboutH1) aboutH1.textContent = c.aboutTitle;
      }
      if (c.aboutSub) {
        const aboutSub = document.querySelector('.about-hero p');
        if (aboutSub) aboutSub.textContent = c.aboutSub;
      }
      if (c.aboutStory) {
        const storyP = document.querySelector('.mission-body p:nth-of-type(2)');
        if (storyP) storyP.textContent = c.aboutStory;
      }
      if (c.aboutMission) {
        const missionH2 = document.querySelector('.mission-grid h2.section-heading');
        if (missionH2) missionH2.textContent = c.aboutMission;
      }
      if (c.aboutQuote) {
        const quoteP = document.querySelector('blockquote p:first-child');
        if (quoteP) quoteP.textContent = `"${c.aboutQuote.replace(/^["']|["']$/g, '')}"`;
      }

      // Stats Bar Strip (Homepage & About Page)
      const statNums = document.querySelectorAll('.stat-item-num');
      const statLbls = document.querySelectorAll('.stat-item-label');
      if (statNums.length >= 4) {
        if (c.stat1Num) statNums[0].textContent = c.stat1Num;
        if (c.stat2Num) statNums[1].textContent = c.stat2Num;
        if (c.stat3Num) statNums[2].textContent = c.stat3Num;
        if (c.stat4Num) statNums[3].textContent = c.stat4Num;
      }
      if (statLbls.length >= 4) {
        if (c.stat1Lbl) statLbls[0].textContent = c.stat1Lbl;
        if (c.stat2Lbl) statLbls[1].textContent = c.stat2Lbl;
        if (c.stat3Lbl) statLbls[2].textContent = c.stat3Lbl;
        if (c.stat4Lbl) statLbls[3].textContent = c.stat4Lbl;
      }

      // Core Services Teaser Cards (Homepage)
      if (c.srv1Title) {
        const s1t = document.querySelector('.cms-srv-1-title');
        if (s1t) s1t.textContent = c.srv1Title;
      }
      if (c.srv1Desc) {
        const s1d = document.querySelector('.cms-srv-1-desc');
        if (s1d) s1d.textContent = c.srv1Desc;
      }
      if (c.srv2Title) {
        const s2t = document.querySelector('.cms-srv-2-title');
        if (s2t) s2t.textContent = c.srv2Title;
      }
      if (c.srv2Desc) {
        const s2d = document.querySelector('.cms-srv-2-desc');
        if (s2d) s2d.textContent = c.srv2Desc;
      }
      if (c.srv3Title) {
        const s3t = document.querySelector('.cms-srv-3-title');
        if (s3t) s3t.textContent = c.srv3Title;
      }
      if (c.srv3Desc) {
        const s3d = document.querySelector('.cms-srv-3-desc');
        if (s3d) s3d.textContent = c.srv3Desc;
      }

      // Services Page Copy (services.html)
      if (c.servicesTitle) {
        const st = document.querySelector('.services-hero h1');
        if (st) st.textContent = c.servicesTitle;
      }
      if (c.servicesSub) {
        const ss = document.querySelector('.services-hero p');
        if (ss) ss.textContent = c.servicesSub;
      }

      // Properties Page Copy (for-sale-lease.html)
      if (c.propsTitle) {
        const pt = document.querySelector('.props-hero h1');
        if (pt) pt.textContent = c.propsTitle;
      }
      if (c.propsCtaHeading) {
        const pct = document.querySelector('.props-cta h2');
        if (pct) pct.textContent = c.propsCtaHeading;
      }
      if (c.propsCtaSub) {
        const pcs = document.querySelector('.props-cta p');
        if (pcs) pcs.textContent = c.propsCtaSub;
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
