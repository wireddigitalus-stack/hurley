/**
 * Hurley Enterprise — Subcontractor Roster & Field Issue Tracker
 * Manages subcontractor database, trades, contact details, 1-5 star ratings,
 * and project-tagged field notes/issues (e.g. site cleanup, lights left on, praise).
 */

const SUB_ROSTER_KEY = 'hurley_sub_roster';

const DEFAULT_SUBS = [
  {
    id: 'sub_1',
    company: 'Apex Electrical & Controls LLC',
    trade: 'electrical',
    tradeLabel: '⚡ Electrical',
    pocName: 'Dave Vance',
    pocRole: 'Master Electrician / Owner',
    phone: '(423) 555-0144',
    email: 'dave@apexelectricllc.com',
    rating: 4,
    workedWith: true,
    createdAt: '2026-03-10T09:00:00Z',
    notes: [
      {
        id: 'sn_1',
        proj: '628 State St',
        flag: 'issue',
        text: 'Left the job site lights and main breaker on overnight after leaving on Friday. Reminded Dave on Monday — acknowledged and promised crew will double-check master switch on departures.',
        author: 'Jazmin',
        time: 'Oct 5, 2026 · 6:45 PM'
      },
      {
        id: 'sn_2',
        proj: 'City Centre (601 State St)',
        flag: 'praise',
        text: 'Flawless conduit run and panel upgrade for Suite 300 server room. Clean inspection signoff on first pass.',
        author: 'Allen',
        time: 'Sep 22, 2026 · 2:15 PM'
      }
    ]
  },
  {
    id: 'sub_2',
    company: 'Appalachian Mechanical & HVAC',
    trade: 'hvac',
    tradeLabel: '❄️ HVAC',
    pocName: 'Jason Miller',
    pocRole: 'Commercial Project Manager',
    phone: '(423) 555-0182',
    email: 'jmiller@appmech-hvac.com',
    rating: 5,
    workedWith: true,
    createdAt: '2026-03-12T10:30:00Z',
    notes: [
      {
        id: 'sn_3',
        proj: 'City Centre (601 State St)',
        flag: 'praise',
        text: 'Replaced 3 rooftop split units on schedule despite weekend rain. Excellent crane coordination and clean job site.',
        author: 'Jazmin',
        time: 'Sep 29, 2026 · 11:30 AM'
      }
    ]
  },
  {
    id: 'sub_3',
    company: 'Holston Valley Plumbing Co.',
    trade: 'plumbing',
    tradeLabel: '🚰 Plumbing',
    pocName: 'Mark Riddle',
    pocRole: 'Lead Master Plumber',
    phone: '(423) 555-0199',
    email: 'mriddle@holstonvalleyplumbing.com',
    rating: 5,
    workedWith: true,
    createdAt: '2026-03-15T08:00:00Z',
    notes: [
      {
        id: 'sn_4',
        proj: 'Jamestown @ Shelby',
        flag: 'note',
        text: 'Annual backflow prevention and pressure test completed. Certs filed with city water authority.',
        author: 'Staff',
        time: 'Sep 18, 2026 · 4:00 PM'
      }
    ]
  },
  {
    id: 'sub_4',
    company: 'Tri-Cities Framing & Drywall',
    trade: 'framing',
    tradeLabel: '🔨 Framing & Drywall',
    pocName: 'Travis Keene',
    pocRole: 'Field Superintendent',
    phone: '(423) 555-0128',
    email: 'travis@tricitiesframing.com',
    rating: 3,
    workedWith: true,
    createdAt: '2026-03-18T14:00:00Z',
    notes: [
      {
        id: 'sn_5',
        proj: '628 State St',
        flag: 'issue',
        text: 'Framing was solid and plumb, but drywall crew left scraps and joint compound buckets in common hallway over the weekend. Had to call Travis to send laborers back for clean-up.',
        author: 'Jazmin',
        time: 'Oct 2, 2026 · 9:15 AM'
      }
    ]
  },
  {
    id: 'sub_5',
    company: 'Mountain Empire Commercial Roofing',
    trade: 'roofing',
    tradeLabel: '🏠 Roofing',
    pocName: 'Sarah Jenkins',
    pocRole: 'Operations VP',
    phone: '(423) 555-0165',
    email: 'sjenkins@mtnempireroof.com',
    rating: 5,
    workedWith: true,
    createdAt: '2026-03-20T11:00:00Z',
    notes: [
      {
        id: 'sn_6',
        proj: 'Former Coca-Cola Facility',
        flag: 'praise',
        text: 'TPO membrane patch and flashing inspection under warranty completed with detailed drone imagery report.',
        author: 'Allen',
        time: 'Sep 14, 2026 · 3:20 PM'
      }
    ]
  },
  {
    id: 'sub_6',
    company: 'High Country Commercial Painting',
    trade: 'painting',
    tradeLabel: '🎨 Painting',
    pocName: 'Carlos Mendez',
    pocRole: 'Owner & Crew Lead',
    phone: '(423) 555-0173',
    email: 'carlos@highcountrycoatings.com',
    rating: 4,
    workedWith: true,
    createdAt: '2026-03-25T13:45:00Z',
    notes: [
      {
        id: 'sn_7',
        proj: 'Center Point Corridor',
        flag: 'billing',
        text: 'Quoted $1.15/sqft for high-durability epoxy floor coating in warehouse bay 2. Awaiting final PO approval.',
        author: 'Jazmin',
        time: 'Oct 4, 2026 · 1:10 PM'
      }
    ]
  },
  {
    id: 'sub_7',
    company: 'Tri-County Concrete & Paving',
    trade: 'concrete',
    tradeLabel: '🧱 Concrete & Masonry',
    pocName: 'Bill Crockett',
    pocRole: 'Estimator & Partner',
    phone: '(423) 555-0112',
    email: 'bill@tricountyconcreteva.com',
    rating: 4,
    workedWith: true,
    createdAt: '2026-04-01T09:30:00Z',
    notes: [
      {
        id: 'sn_8',
        proj: 'Jamestown @ Shelby',
        flag: 'note',
        text: 'Curb cut and ADA ramp pour scheduled for next Tuesday at 7:00 AM weather permitting.',
        author: 'Staff',
        time: 'Oct 6, 2026 · 10:45 AM'
      }
    ]
  },
  {
    id: 'sub_8',
    company: 'Blue Ridge Glass & Architectural Metal',
    trade: 'windows',
    tradeLabel: '🪟 Windows & Glass',
    pocName: 'Derek Campbell',
    pocRole: 'Senior Glazier',
    phone: '(423) 555-0137',
    email: 'derek@blueridgeglazing.com',
    rating: 4,
    workedWith: false,
    createdAt: '2026-04-05T15:20:00Z',
    notes: [
      {
        id: 'sn_9',
        proj: 'City Centre (601 State St)',
        flag: 'note',
        text: 'Tempered storefront glass measurements taken for front entrance replacement estimate.',
        author: 'Jazmin',
        time: 'Oct 7, 2026 · 2:00 PM'
      }
    ]
  }
];

const TRADE_LABELS = {
  electrical: '⚡ Electrical',
  plumbing: '🚰 Plumbing',
  hvac: '❄️ HVAC',
  roofing: '🏠 Roofing',
  framing: '🔨 Framing & Drywall',
  painting: '🎨 Painting',
  concrete: '🧱 Concrete & Masonry',
  windows: '🪟 Windows & Glass',
  cleanup: '🧹 Cleanup & Demo',
  general: '🏗️ General Contractor',
  other: '🔧 Specialized Trade'
};

const FLAG_CONFIG = {
  issue: { icon: '⚠️', label: 'Site Issue / Watch', cls: 'sub-flag-issue' },
  praise: { icon: '👍', label: 'Praise / Recommended', cls: 'sub-flag-praise' },
  note: { icon: '📌', label: 'Field Note', cls: 'sub-flag-note' },
  billing: { icon: '💰', label: 'Billing / Quote', cls: 'sub-flag-billing' }
};

const RATING_TEXTS = {
  5: '5.0 ★ · Premier Preferred Partner',
  4: '4.0 ★ · Highly Recommended Sub',
  3: '3.0 ★ · Acceptable · Monitor Closely',
  2: '2.0 ★ · Needs Improvement / Issues',
  1: '1.0 ★ · Critical Issues · Do Not Rehire',
  0: 'Unrated · Newly Added Sub'
};

/* ── DATA ACCESSORS ────────────────────────────── */

function getSubRoster() {
  try {
    const raw = localStorage.getItem(SUB_ROSTER_KEY);
    if (!raw) {
      saveSubRoster(DEFAULT_SUBS);
      return DEFAULT_SUBS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveSubRoster(DEFAULT_SUBS);
      return DEFAULT_SUBS;
    }
    return parsed;
  } catch (e) {
    console.error('Error loading sub roster:', e);
    return DEFAULT_SUBS;
  }
}

function saveSubRoster(subs) {
  try {
    localStorage.setItem(SUB_ROSTER_KEY, JSON.stringify(subs));
  } catch (e) {
    console.error('Error saving sub roster:', e);
  }
}

/* ── RENDER SUB ROSTER ─────────────────────────── */

function renderSubRoster() {
  const container = document.getElementById('sub-roster-feed');
  if (!container) return;

  const subs = getSubRoster();
  updateSubRosterKPIs(subs);

  // Apply search & filters
  const searchInput = document.getElementById('sub-search-input');
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const tradeFilter = document.getElementById('sub-trade-filter') ? document.getElementById('sub-trade-filter').value : 'all';
  const ratingFilter = document.getElementById('sub-rating-filter') ? document.getElementById('sub-rating-filter').value : 'all';
  const workedFilter = document.getElementById('sub-worked-filter') ? document.getElementById('sub-worked-filter').value : 'all';

  const filtered = subs.filter(sub => {
    // Search query match
    if (query) {
      const matchCompany = (sub.company || '').toLowerCase().includes(query);
      const matchPoc = (sub.pocName || '').toLowerCase().includes(query);
      const matchRole = (sub.pocRole || '').toLowerCase().includes(query);
      const matchTrade = (sub.trade || '').toLowerCase().includes(query) || (sub.tradeLabel || '').toLowerCase().includes(query);
      const matchPhone = (sub.phone || '').toLowerCase().includes(query);
      const matchEmail = (sub.email || '').toLowerCase().includes(query);
      const matchNotes = (sub.notes || []).some(n => (n.text || '').toLowerCase().includes(query) || (n.proj || '').toLowerCase().includes(query));
      if (!matchCompany && !matchPoc && !matchRole && !matchTrade && !matchPhone && !matchEmail && !matchNotes) {
        return false;
      }
    }

    // Trade match
    if (tradeFilter !== 'all' && sub.trade !== tradeFilter) return false;

    // Rating match
    if (ratingFilter !== 'all') {
      const r = Number(sub.rating) || 0;
      if (ratingFilter === '5' && r !== 5) return false;
      if (ratingFilter === '4+' && r < 4) return false;
      if (ratingFilter === '3+' && r < 3) return false;
      if (ratingFilter === 'low' && (r < 1 || r > 2)) return false;
      if (ratingFilter === '0' && r !== 0) return false;
    }

    // Worked with match
    if (workedFilter === 'worked' && !sub.workedWith) return false;
    if (workedFilter === 'prospective' && sub.workedWith) return false;

    return true;
  });

  const countBadge = document.getElementById('sub-results-count');
  if (countBadge) {
    countBadge.textContent = `${filtered.length} subcontractor${filtered.length === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:3rem 1.5rem;background:var(--card-bg);border:1px dashed var(--border);border-radius:14px;">
        <div style="font-size:2.4rem;margin-bottom:0.75rem;">🔍</div>
        <div style="font-size:1.1rem;font-weight:700;color:var(--gold-lt);margin-bottom:0.35rem;">No Subcontractors Found</div>
        <div style="font-size:0.84rem;color:var(--t2);max-width:400px;margin:0 auto 1.25rem;">No subcontractors matched your active search query or filter criteria.</div>
        <button class="add-btn" onclick="resetSubFilters()" style="margin:0 auto;">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(sub => renderSubCard(sub)).join('');
}

function updateSubRosterKPIs(subs) {
  const totalEl = document.getElementById('sub-kpi-total');
  const fiveStarEl = document.getElementById('sub-kpi-5star');
  const issuesEl = document.getElementById('sub-kpi-issues');
  const tradesEl = document.getElementById('sub-kpi-trades');

  if (!totalEl) return;

  const total = subs.length;
  const fiveStars = subs.filter(s => Number(s.rating) === 5).length;
  const totalIssues = subs.reduce((acc, s) => {
    return acc + (s.notes || []).filter(n => n.flag === 'issue').length;
  }, 0);
  const uniqueTrades = new Set(subs.map(s => s.trade)).size;

  totalEl.textContent = total;
  if (fiveStarEl) fiveStarEl.textContent = fiveStars;
  if (issuesEl) issuesEl.textContent = totalIssues;
  if (tradesEl) tradesEl.textContent = uniqueTrades;
}

function renderSubCard(sub) {
  const rating = Number(sub.rating) || 0;
  const ratingText = RATING_TEXTS[rating] || `${rating} Stars`;
  const tradeDisplay = sub.tradeLabel || TRADE_LABELS[sub.trade] || sub.trade || 'Trade';
  const notes = sub.notes || [];
  const issueCount = notes.filter(n => n.flag === 'issue').length;

  // Star generation with interactive click handler
  let starsHtml = '';
  for (let i = 1; i <= 5; i++) {
    const isFilled = i <= rating;
    starsHtml += `
      <button type="button" 
              class="sub-star-btn ${isFilled ? 'filled' : ''}" 
              onclick="updateSubRating('${sub.id}', ${i})" 
              title="Set rating to ${i} star${i > 1 ? 's' : ''}">
        ★
      </button>
    `;
  }

  const workedBadge = sub.workedWith
    ? `<span class="sub-worked-badge worked">✅ Worked With</span>`
    : `<span class="sub-worked-badge prospective">🆕 Prospective</span>`;

  const issueBadge = issueCount > 0
    ? `<span class="sub-issue-pill" title="${issueCount} flagged site issue${issueCount > 1 ? 's' : ''}">⚠️ ${issueCount} Issue${issueCount > 1 ? 's' : ''} Logged</span>`
    : '';

  return `
    <div class="sub-card" id="sub-card-${sub.id}">
      <!-- TOP ROW: Company name + Trade + Status -->
      <div class="sub-card-header">
        <div style="flex:1;min-width:0;">
          <div class="sub-company-row">
            <span class="sub-company-name">${escapeHtml(sub.company)}</span>
            <span class="sub-trade-badge trade-${escapeHtml(sub.trade)}">${tradeDisplay}</span>
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-top:0.35rem;">
            ${workedBadge}
            ${issueBadge}
          </div>
        </div>
        <div class="sub-card-top-actions">
          <button class="sub-icon-btn" onclick="editSub('${sub.id}')" title="Edit Subcontractor Details">✏️</button>
          <button class="sub-icon-btn danger" onclick="deleteSub('${sub.id}')" title="Delete Subcontractor">🗑️</button>
        </div>
      </div>

      <!-- RATING ROW (Interactive 1-5 Stars) -->
      <div class="sub-rating-bar">
        <div class="sub-stars-group">
          ${starsHtml}
        </div>
        <span class="sub-rating-label" id="sub-rating-label-${sub.id}">${ratingText}</span>
      </div>

      <!-- POC & CONTACT DETAILS -->
      <div class="sub-contact-box">
        <div class="sub-poc-header">
          <div class="sub-poc-avatar">👤</div>
          <div>
            <div class="sub-poc-name">${escapeHtml(sub.pocName || 'No Contact Specified')}</div>
            <div class="sub-poc-role">${escapeHtml(sub.pocRole || 'Point of Contact')}</div>
          </div>
        </div>
        <div class="sub-contact-links">
          ${sub.phone ? `<a href="tel:${escapeHtml(sub.phone)}" class="sub-contact-btn tel"><span class="sub-btn-icon">📞</span> ${escapeHtml(sub.phone)}</a>` : '<span class="sub-contact-btn disabled">📞 No Phone</span>'}
          ${sub.email ? `<a href="mailto:${escapeHtml(sub.email)}" class="sub-contact-btn email"><span class="sub-btn-icon">✉️</span> ${escapeHtml(sub.email)}</a>` : '<span class="sub-contact-btn disabled">✉️ No Email</span>'}
        </div>
      </div>

      <!-- NOTES & ISSUES SECTION -->
      <div class="sub-notes-section">
        <div class="sub-notes-hdr">
          <div class="sub-notes-title">
            <span>📝 Project Notes &amp; Field Issues</span>
            <span class="sub-notes-count">${notes.length}</span>
          </div>
          <button class="sub-toggle-notes-btn" onclick="toggleSubNoteComposer('${sub.id}')" id="sub-toggle-btn-${sub.id}">
            ➕ Add Note / Issue
          </button>
        </div>

        <!-- Inline Note Composer (Collapsible / expandable) -->
        <div class="sub-note-composer" id="sub-composer-${sub.id}" style="display:none;">
          <div class="sub-composer-fields">
            <select class="sub-comp-select" id="sn-proj-${sub.id}">
              <option value="628 State St">📍 628 State St</option>
              <option value="City Centre (601 State St)">📍 City Centre</option>
              <option value="Jamestown @ Shelby">📍 Jamestown @ Shelby</option>
              <option value="Center Point Corridor">📍 Center Point</option>
              <option value="Former Coca-Cola Facility">📍 Former Coca-Cola</option>
              <option value="Bradley St Residential">📍 Bradley St</option>
              <option value="Randolph St Residential">📍 Randolph St</option>
              <option value="General / All Sites">📍 General / All Sites</option>
            </select>
            <select class="sub-comp-select" id="sn-flag-${sub.id}">
              <option value="issue">⚠️ Site Issue / Watch</option>
              <option value="praise">👍 Praise / Good Work</option>
              <option value="note">📌 General Field Note</option>
              <option value="billing">💰 Billing / Pricing</option>
            </select>
          </div>
          <div class="sub-composer-input-row">
            <textarea class="sub-note-textarea" 
                      id="sn-text-${sub.id}" 
                      rows="2" 
                      placeholder="e.g. Left the job site lights and main breaker on overnight after leaving..."></textarea>
            <button class="save-btn" 
                    id="sn-save-btn-${sub.id}" 
                    onclick="saveSubNote('${sub.id}')">
              Save Note
            </button>
          </div>
        </div>

        <!-- Notes Feed (Newest first) -->
        <div class="sub-notes-list" id="sub-notes-list-${sub.id}">
          ${notes.length > 0 
            ? notes.map(n => renderSubNoteItem(sub.id, n)).join('')
            : `<div class="sub-empty-notes">No site notes or issues logged yet. Click &quot;Add Note / Issue&quot; above to record field feedback.</div>`
          }
        </div>
      </div>
    </div>
  `;
}

function renderSubNoteItem(subId, note) {
  const flag = FLAG_CONFIG[note.flag] || FLAG_CONFIG.note;
  return `
    <div class="sub-note-item ${flag.cls}" id="sub-note-${note.id}">
      <div class="sub-note-top">
        <div class="sub-note-tags">
          <span class="sub-note-flag">${flag.icon} ${flag.label}</span>
          <span class="sub-note-proj">${escapeHtml(note.proj || 'Job Site')}</span>
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <span class="sub-note-time">${escapeHtml(note.time || '')}</span>
          <button class="sub-note-del" onclick="deleteSubNote('${subId}', '${note.id}')" title="Delete this note">✕</button>
        </div>
      </div>
      <div class="sub-note-body">${escapeHtml(note.text)}</div>
      ${note.author ? `<div class="sub-note-author">— Logged by ${escapeHtml(note.author)}</div>` : ''}
    </div>
  `;
}

/* ── QUICK STAR RATING UPDATE ──────────────────── */

function updateSubRating(subId, newRating) {
  const subs = getSubRoster();
  const sub = subs.find(s => s.id === subId);
  if (!sub) return;

  sub.rating = Number(newRating);
  saveSubRoster(subs);

  // Update label and star states instantly without re-rendering entire list for snappy feel
  const labelEl = document.getElementById(`sub-rating-label-${subId}`);
  if (labelEl) {
    labelEl.textContent = RATING_TEXTS[newRating] || `${newRating} Stars`;
  }

  const card = document.getElementById(`sub-card-${subId}`);
  if (card) {
    const starBtns = card.querySelectorAll('.sub-star-btn');
    starBtns.forEach((btn, index) => {
      if (index < newRating) {
        btn.classList.add('filled');
      } else {
        btn.classList.remove('filled');
      }
    });
  }

  // Update KPIs
  updateSubRosterKPIs(subs);
  showSubToast(`Updated rating for ${sub.company} to ${newRating} ★`, 'success');
}

/* ── NOTES & ISSUES OPERATIONS ─────────────────── */

function toggleSubNoteComposer(subId) {
  const composer = document.getElementById(`sub-composer-${subId}`);
  const toggleBtn = document.getElementById(`sub-toggle-btn-${subId}`);
  if (!composer) return;

  const isHidden = composer.style.display === 'none' || !composer.style.display;
  if (isHidden) {
    composer.style.display = 'block';
    if (toggleBtn) toggleBtn.textContent = '✕ Close Note Form';
    const textarea = document.getElementById(`sn-text-${subId}`);
    if (textarea) textarea.focus();
  } else {
    composer.style.display = 'none';
    if (toggleBtn) toggleBtn.textContent = '➕ Add Note / Issue';
  }
}

function saveSubNote(subId) {
  const textEl = document.getElementById(`sn-text-${subId}`);
  const projEl = document.getElementById(`sn-proj-${subId}`);
  const flagEl = document.getElementById(`sn-flag-${subId}`);
  const saveBtn = document.getElementById(`sn-save-btn-${subId}`);

  if (!textEl || !textEl.value.trim()) {
    if (textEl) {
      textEl.style.borderColor = 'var(--coral)';
      textEl.focus();
    }
    return;
  }

  const text = textEl.value.trim();
  const proj = projEl ? projEl.value : 'General';
  const flag = flagEl ? flagEl.value : 'note';

  const subs = getSubRoster();
  const sub = subs.find(s => s.id === subId);
  if (!sub) return;

  if (!sub.notes) sub.notes = [];

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const newNote = {
    id: 'sn_' + Date.now(),
    proj: proj,
    flag: flag,
    text: text,
    author: (typeof CFG !== 'undefined' && CFG.name) ? CFG.name : 'Jazmin',
    time: `${dateStr} · ${timeStr}`
  };

  sub.notes.unshift(newNote); // Prepend to top
  saveSubRoster(subs);

  // Visual button feedback
  if (saveBtn) {
    saveBtn.classList.add('saved');
    saveBtn.textContent = 'Saved!';
    setTimeout(() => {
      saveBtn.classList.remove('saved');
      saveBtn.textContent = 'Save Note';
    }, 1500);
  }

  textEl.value = '';
  toggleSubNoteComposer(subId);
  renderSubRoster();
  showSubToast(`Logged new note for ${sub.company}`, 'success');
}

function deleteSubNote(subId, noteId) {
  if (!confirm('Are you sure you want to remove this project note/issue?')) return;

  const subs = getSubRoster();
  const sub = subs.find(s => s.id === subId);
  if (!sub || !sub.notes) return;

  sub.notes = sub.notes.filter(n => n.id !== noteId);
  saveSubRoster(subs);
  renderSubRoster();
  showSubToast('Note removed', 'info');
}

/* ── SUBCONTRACTOR MODAL (ADD / EDIT) ──────────── */

function openSubModal(subId = null) {
  const overlay = document.getElementById('sub-modal-overlay');
  const title = document.getElementById('sub-modal-title');
  const idInput = document.getElementById('ms-id');
  const companyInput = document.getElementById('ms-company');
  const tradeInput = document.getElementById('ms-trade');
  const customTradeWrap = document.getElementById('ms-custom-trade-wrap');
  const customTradeInput = document.getElementById('ms-custom-trade');
  const pocNameInput = document.getElementById('ms-poc-name');
  const pocRoleInput = document.getElementById('ms-poc-role');
  const phoneInput = document.getElementById('ms-phone');
  const emailInput = document.getElementById('ms-email');
  const ratingInput = document.getElementById('ms-rating');
  const workedInput = document.getElementById('ms-worked');
  const initialNoteWrap = document.getElementById('ms-initial-note-wrap');
  const initialNoteInput = document.getElementById('ms-initial-note');

  if (!overlay) return;

  if (subId) {
    // Edit existing
    const subs = getSubRoster();
    const sub = subs.find(s => s.id === subId);
    if (!sub) return;

    if (title) title.textContent = '✏️ Edit Subcontractor';
    if (idInput) idInput.value = sub.id;
    if (companyInput) companyInput.value = sub.company || '';
    if (pocNameInput) pocNameInput.value = sub.pocName || '';
    if (pocRoleInput) pocRoleInput.value = sub.pocRole || '';
    if (phoneInput) phoneInput.value = sub.phone || '';
    if (emailInput) emailInput.value = sub.email || '';
    if (ratingInput) ratingInput.value = String(sub.rating || 5);
    if (workedInput) workedInput.value = sub.workedWith ? 'true' : 'false';

    if (tradeInput) {
      if (TRADE_LABELS[sub.trade]) {
        tradeInput.value = sub.trade;
        if (customTradeWrap) customTradeWrap.style.display = 'none';
      } else {
        tradeInput.value = 'other';
        if (customTradeWrap) customTradeWrap.style.display = 'block';
        if (customTradeInput) customTradeInput.value = sub.tradeLabel || sub.trade || '';
      }
    }
    if (initialNoteWrap) initialNoteWrap.style.display = 'none';
  } else {
    // Add new
    if (title) title.textContent = '👷 Add Subcontractor to Roster';
    if (idInput) idInput.value = '';
    if (companyInput) companyInput.value = '';
    if (tradeInput) tradeInput.value = 'electrical';
    if (customTradeWrap) customTradeWrap.style.display = 'none';
    if (customTradeInput) customTradeInput.value = '';
    if (pocNameInput) pocNameInput.value = '';
    if (pocRoleInput) pocRoleInput.value = '';
    if (phoneInput) phoneInput.value = '';
    if (emailInput) emailInput.value = '';
    if (ratingInput) ratingInput.value = '5';
    if (workedInput) workedInput.value = 'true';
    if (initialNoteWrap) initialNoteWrap.style.display = 'block';
    if (initialNoteInput) initialNoteInput.value = '';
  }

  overlay.classList.add('open');
  if (companyInput) companyInput.focus();
}

function editSub(subId) {
  openSubModal(subId);
}

function closeSubModal() {
  const overlay = document.getElementById('sub-modal-overlay');
  if (overlay) overlay.classList.remove('open');
}

function handleSubTradeChange() {
  const tradeInput = document.getElementById('ms-trade');
  const customTradeWrap = document.getElementById('ms-custom-trade-wrap');
  if (!tradeInput || !customTradeWrap) return;
  if (tradeInput.value === 'other') {
    customTradeWrap.style.display = 'block';
    const custom = document.getElementById('ms-custom-trade');
    if (custom) custom.focus();
  } else {
    customTradeWrap.style.display = 'none';
  }
}

function submitSubModal() {
  const idInput = document.getElementById('ms-id');
  const companyInput = document.getElementById('ms-company');
  const tradeInput = document.getElementById('ms-trade');
  const customTradeInput = document.getElementById('ms-custom-trade');
  const pocNameInput = document.getElementById('ms-poc-name');
  const pocRoleInput = document.getElementById('ms-poc-role');
  const phoneInput = document.getElementById('ms-phone');
  const emailInput = document.getElementById('ms-email');
  const ratingInput = document.getElementById('ms-rating');
  const workedInput = document.getElementById('ms-worked');
  const initialNoteInput = document.getElementById('ms-initial-note');

  const company = companyInput ? companyInput.value.trim() : '';
  const pocName = pocNameInput ? pocNameInput.value.trim() : '';

  if (!company) {
    if (companyInput) {
      companyInput.style.borderColor = 'var(--coral)';
      companyInput.focus();
    }
    showSubToast('Please enter the Subcontractor Company Name.', 'error');
    return;
  }

  let trade = tradeInput ? tradeInput.value : 'general';
  let tradeLabel = TRADE_LABELS[trade] || 'Specialty Trade';
  if (trade === 'other') {
    const custom = customTradeInput ? customTradeInput.value.trim() : '';
    if (custom) {
      trade = custom.toLowerCase().replace(/[^a-z0-9]/g, '_');
      tradeLabel = '🔧 ' + custom;
    }
  }

  const rating = ratingInput ? Number(ratingInput.value) : 5;
  const workedWith = workedInput ? (workedInput.value === 'true') : true;
  const isEditing = idInput && idInput.value;

  const subs = getSubRoster();

  if (isEditing) {
    const sub = subs.find(s => s.id === idInput.value);
    if (sub) {
      sub.company = company;
      sub.trade = trade;
      sub.tradeLabel = tradeLabel;
      sub.pocName = pocName;
      sub.pocRole = pocRoleInput ? pocRoleInput.value.trim() : '';
      sub.phone = phoneInput ? phoneInput.value.trim() : '';
      sub.email = emailInput ? emailInput.value.trim() : '';
      sub.rating = rating;
      sub.workedWith = workedWith;
      saveSubRoster(subs);
      showSubToast(`Updated ${company}`, 'success');
    }
  } else {
    const newId = 'sub_' + Date.now();
    const newNotes = [];

    const initText = initialNoteInput ? initialNoteInput.value.trim() : '';
    if (initText) {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      newNotes.push({
        id: 'sn_' + Date.now(),
        proj: 'General / All Sites',
        flag: 'note',
        text: initText,
        author: (typeof CFG !== 'undefined' && CFG.name) ? CFG.name : 'Jazmin',
        time: `${dateStr} · ${timeStr}`
      });
    }

    const newSub = {
      id: newId,
      company: company,
      trade: trade,
      tradeLabel: tradeLabel,
      pocName: pocName,
      pocRole: pocRoleInput ? pocRoleInput.value.trim() : '',
      phone: phoneInput ? phoneInput.value.trim() : '',
      email: emailInput ? emailInput.value.trim() : '',
      rating: rating,
      workedWith: workedWith,
      createdAt: new Date().toISOString(),
      notes: newNotes
    };

    subs.unshift(newSub);
    saveSubRoster(subs);
    showSubToast(`Added ${company} to Sub Roster`, 'success');
  }

  closeSubModal();
  renderSubRoster();
}

function deleteSub(subId) {
  const subs = getSubRoster();
  const sub = subs.find(s => s.id === subId);
  if (!sub) return;

  if (!confirm(`Are you sure you want to remove "${sub.company}" and all its logged notes from the Sub Roster?`)) {
    return;
  }

  const remaining = subs.filter(s => s.id !== subId);
  saveSubRoster(remaining);
  renderSubRoster();
  showSubToast(`Removed ${sub.company}`, 'info');
}

/* ── SEARCH & FILTER CONTROLS ──────────────────── */

function applySubFilters() {
  renderSubRoster();
}

function resetSubFilters() {
  const searchInput = document.getElementById('sub-search-input');
  const tradeFilter = document.getElementById('sub-trade-filter');
  const ratingFilter = document.getElementById('sub-rating-filter');
  const workedFilter = document.getElementById('sub-worked-filter');

  if (searchInput) searchInput.value = '';
  if (tradeFilter) tradeFilter.value = 'all';
  if (ratingFilter) ratingFilter.value = 'all';
  if (workedFilter) workedFilter.value = 'all';

  renderSubRoster();
}

/* ── TOAST NOTIFICATIONS ───────────────────────── */

function showSubToast(msg, type = 'info') {
  let toast = document.getElementById('sub-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'sub-toast';
    toast.className = 'sub-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.className = `sub-toast show ${type}`;

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Auto-render if panel is active on load
document.addEventListener('DOMContentLoaded', () => {
  const panel = document.getElementById('panel-subroster');
  if (panel && panel.classList.contains('active')) {
    renderSubRoster();
  }
});
