/* ============================================================
   HURLEY ENTERPRISE LLC — Social Proof Ticker
   js/social-proof.js
   ============================================================ */
(function () {
  'use strict';

  const NOTIFICATIONS = [
    { icon: '🏢', text: 'Sarah M. just inquired about City Centre office suites', time: '2 min ago' },
    { icon: '🔑', text: 'James T. scheduled a tour at Jamestown @ Shelby', time: '8 min ago' },
    { icon: '🎰', text: 'New inquiry on Center Point — Hard Rock Casino corridor', time: '11 min ago' },
    { icon: '🏭', text: 'Marcus R. requested info on the former Coca-Cola building', time: '14 min ago' },
    { icon: '🍕', text: 'Restaurant group inquired about 628 State Street', time: '19 min ago' },
    { icon: '💼', text: 'Local law firm inquired about City Centre executive suites', time: '23 min ago' },
    { icon: '🎰', text: 'Retail operator asking about Center Point units near Hard Rock', time: '27 min ago' },
    { icon: '🏠', text: 'Investor inquired about Bradley Street residential portfolio', time: '31 min ago' },
    { icon: '🏗️', text: 'Developer requested construction consultation', time: '35 min ago' },
    { icon: '🏢', text: 'Tech company inquired about large suite at City Centre', time: '41 min ago' },
    { icon: '💰', text: 'Property owner received a cash offer within 24 hrs', time: '44 min ago' },
    { icon: '🎰', text: 'Hospitality group looking at Commonwealth Ave retail', time: '48 min ago' },
    { icon: '🏡', text: 'Buyer touring 2409 Randolph St this weekend', time: '52 min ago' },
    { icon: '🍺', text: 'Craft brewery group exploring 628 State Street', time: '58 min ago' },
    { icon: '📋', text: 'Healthcare provider asking about Jamestown @ Shelby', time: '1 hr ago' },
    { icon: '🏭', text: 'Logistics firm requesting warehouse specs — Bristol VA', time: '1.2 hrs ago' },
    { icon: '🏠', text: 'Couple making offer on 2413 Randolph St remodel', time: '1.5 hrs ago' },
    { icon: '🎪', text: 'Corporate event booked at The Foundation Facility', time: '1.8 hrs ago' },
    { icon: '💼', text: 'Consulting firm moving from Kingsport to City Centre', time: '2 hrs ago' },
    { icon: '📈', text: 'Market Report downloaded — Bristol TN investor', time: '2.2 hrs ago' },
    { icon: '🔑', text: 'New lease signed on City Centre Suite 4A', time: '2.5 hrs ago' },
  ];

  // Shuffle
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildTicker() {
    const el = document.createElement('div');
    el.id = 'social-proof-ticker';
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-label', 'Recent property activity');
    el.innerHTML = `
      <div class="sp-card">
        <div class="sp-icon" id="sp-icon">🏢</div>
        <div class="sp-content">
          <div class="sp-action" id="sp-action">Loading…</div>
          <div class="sp-time" id="sp-time">just now</div>
        </div>
      </div>`;
    document.body.appendChild(el);
    return el;
  }

  function init() {
    const ticker = buildTicker();
    const iconEl   = document.getElementById('sp-icon');
    const actionEl = document.getElementById('sp-action');
    const timeEl   = document.getElementById('sp-time');
    const pool     = shuffle(NOTIFICATIONS);
    let idx = 0;

    function show() {
      const n = pool[idx % pool.length];
      idx++;
      ticker.classList.remove('visible');
      setTimeout(() => {
        iconEl.textContent   = n.icon;
        actionEl.textContent = n.text;
        timeEl.textContent   = n.time;
        ticker.classList.add('visible');
        // Hide after 4.5s
        setTimeout(() => ticker.classList.remove('visible'), 4500);
      }, 500);
    }

    // First show after 6s, then every 9s
    setTimeout(() => {
      show();
      setInterval(show, 9000);
    }, 6000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
