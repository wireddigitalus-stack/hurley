/* ============================================================
   HURLEY ENTERPRISE — Construction Command Center Engine
   js/construction.js
   Handles: Calendar, Materials, Budget, Crew/Contractor Directory,
   Tab switching, and enhanced demo data
   ============================================================ */

/* ── STORAGE KEYS ────────────────────────────── */
const MATERIALS_KEY = 'hurley_materials';
const CREW_KEY      = 'hurley_crew';

/* ── CONSTRUCTION TAB SWITCHING ─────────────── */
function switchCcTab(tab) {
  document.querySelectorAll('.cc-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.cc-section').forEach(s => s.classList.remove('active'));
  const section = document.getElementById('cc-' + tab);
  if (section) section.classList.add('active');
  // Activate matching tab button
  const tabs = document.querySelectorAll('.cc-tab');
  const tabMap = { tickets:0, calendar:1, materials:2, budget:3, crew:4 };
  if (tabs[tabMap[tab]]) tabs[tabMap[tab]].classList.add('active');
  // Render tab content
  if (tab === 'calendar') renderCalendar();
  if (tab === 'materials') renderMaterials();
  if (tab === 'budget') renderBudget();
  if (tab === 'crew') renderCrew();
}

/* ═══════════════════════════════════════════════
   CALENDAR ENGINE
   ═══════════════════════════════════════════════ */
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();
let calView = 'month';
let calSelectedDay = null;

function calNav(dir) {
  if (calView === 'month') {
    calMonth += dir;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    if (calMonth < 0)  { calMonth = 11; calYear--; }
  } else {
    // Week nav: move 7 days
    const d = new Date(calYear, calMonth, calSelectedDay || new Date().getDate());
    d.setDate(d.getDate() + (dir * 7));
    calYear = d.getFullYear(); calMonth = d.getMonth(); calSelectedDay = d.getDate();
  }
  renderCalendar();
}

function setCalView(v) {
  calView = v;
  document.getElementById('cal-view-month').classList.toggle('active', v === 'month');
  document.getElementById('cal-view-week').classList.toggle('active', v === 'week');
  renderCalendar();
}

function getTicketsForDate(y, m, d) {
  const tickets = typeof getTickets === 'function' ? getTickets() : [];
  const dateStr = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  return tickets.filter(t => {
    const due = t.dueDate || '';
    const start = t.startDate || '';
    if (due === dateStr || start === dateStr) return true;
    // Check if date falls within start-due range
    if (start && due && dateStr >= start && dateStr <= due) return true;
    return false;
  });
}

function renderCalendar() {
  const container = document.getElementById('cal-grid-container');
  const detailContainer = document.getElementById('cal-day-detail-container');
  if (!container) return;

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const label = document.getElementById('cal-month-label');
  if (label) label.textContent = `${months[calMonth]} ${calYear}`;

  if (calView === 'month') {
    renderMonthView(container);
  } else {
    renderWeekView(container);
  }
  if (detailContainer) detailContainer.innerHTML = '';
  calSelectedDay = null;
}

function renderMonthView(container) {
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();

  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let html = '<div class="cal-grid">';
  dayNames.forEach(d => html += `<div class="cal-hdr">${d}</div>`);

  // Pad start
  const prevMonthDays = new Date(calYear, calMonth, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    html += `<div class="cal-day other-month"><div class="cal-day-num">${prevMonthDays - i}</div></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = (d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear());
    const tickets = getTicketsForDate(calYear, calMonth, d);
    let dotsHtml = '<div class="cal-dots">';
    tickets.forEach(t => {
      const cls = t.status === 'completed' ? 'done' : (t.priority || 'medium');
      dotsHtml += `<div class="cal-dot ${cls}"></div>`;
    });
    dotsHtml += '</div>';

    html += `<div class="cal-day${isToday ? ' today' : ''}" onclick="selectCalDay(${d})">
      <div class="cal-day-num">${d}</div>${dotsHtml}
    </div>`;
  }

  // Pad end
  const totalCells = firstDay + daysInMonth;
  const remaining = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    html += `<div class="cal-day other-month"><div class="cal-day-num">${i}</div></div>`;
  }

  html += '</div>';
  container.innerHTML = html;
}

function renderWeekView(container) {
  const today = new Date();
  const targetDate = new Date(calYear, calMonth, calSelectedDay || today.getDate());
  const dayOfWeek = targetDate.getDay();
  const weekStart = new Date(targetDate);
  weekStart.setDate(weekStart.getDate() - dayOfWeek);

  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let html = '<div class="cal-week-grid">';

  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const isToday = (d.toDateString() === today.toDateString());
    const tickets = getTicketsForDate(d.getFullYear(), d.getMonth(), d.getDate());

    html += `<div class="cal-week-col">
      <div class="cal-week-hdr" style="${isToday ? 'color:var(--gold);' : ''}">${dayNames[i]} ${d.getDate()}</div>`;

    if (tickets.length === 0) {
      html += `<div class="cal-week-card" style="color:var(--t3);font-style:italic;">No jobs</div>`;
    } else {
      tickets.forEach(t => {
        const priColor = t.priority === 'high' ? 'var(--hot)' : t.priority === 'normal' ? 'var(--cool)' : 'var(--gold)';
        html += `<div class="cal-week-card" style="border-left:3px solid ${priColor};">
          <div style="font-weight:800;font-size:0.65rem;color:var(--gold);text-transform:uppercase;letter-spacing:0.06em;">${t.property || ''}</div>
          <div style="font-weight:700;margin-top:0.15rem;">${t.title || ''}</div>
          <div style="font-size:0.6rem;color:var(--t3);margin-top:0.2rem;">${t.contractor || 'In-House'}</div>
        </div>`;
      });
    }
    html += '</div>';
  }
  html += '</div>';
  container.innerHTML = html;
}

function selectCalDay(day) {
  calSelectedDay = day;
  const tickets = getTicketsForDate(calYear, calMonth, day);
  const container = document.getElementById('cal-day-detail-container');
  if (!container) return;

  // Highlight selected day
  document.querySelectorAll('.cal-day').forEach(el => el.classList.remove('selected'));
  const days = document.querySelectorAll('.cal-day:not(.other-month)');
  if (days[day - 1]) days[day - 1].classList.add('selected');

  if (!tickets.length) {
    container.innerHTML = `<div class="cal-day-detail">
      <div class="cal-day-detail-title">📅 ${new Date(calYear, calMonth, day).toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}</div>
      <div style="color:var(--t3);font-size:0.78rem;">No construction activity scheduled for this day.</div>
    </div>`;
    return;
  }

  const statusLabels = { open:'📋 Open', progress:'🚧 In Progress', blocked:'⏸️ On Hold', review:'🔍 Inspection', completed:'✅ Done' };

  container.innerHTML = `<div class="cal-day-detail">
    <div class="cal-day-detail-title">📅 ${new Date(calYear, calMonth, day).toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })} — ${tickets.length} Job${tickets.length !== 1 ? 's' : ''}</div>
    ${tickets.map(t => `
      <div class="cal-mini-ticket">
        <div>
          <div style="font-weight:800;color:var(--off-white);">${t.title}</div>
          <div style="font-size:0.68rem;color:var(--t2);">${t.property} · ${t.contractor || 'In-House'}</div>
        </div>
        <span class="t-badge tb-${t.status}">${statusLabels[t.status] || t.status}</span>
      </div>
    `).join('')}
  </div>`;
}

/* ═══════════════════════════════════════════════
   MATERIALS ENGINE
   ═══════════════════════════════════════════════ */
const DEMO_MATERIALS = [
  { id:'m1', item:'HVAC Compressor Unit — 5-Ton Carrier', supplier:'AirTech Commercial HVAC', po:'PO-2026-0047', qty:2, unitCost:'$2,400', totalCost:'$4,800', status:'delivered', expectedDelivery:'2026-07-25', property:'628 State St', notes:'Rooftop unit replacement. Crane lift scheduled.' },
  { id:'m2', item:'Commercial LED Panel Fixtures (4x2 ft)', supplier:'Tri-Cities Electrical Supply', po:'PO-2026-0051', qty:24, unitCost:'$85', totalCost:'$2,040', status:'installed', expectedDelivery:'2026-07-18', property:'City Centre', notes:'Suite 3A office lighting upgrade. All panels installed.' },
  { id:'m3', item:'Fire-Rated Drywall Sheets (5/8" Type X)', supplier:'Lowe\'s Commercial', po:'PO-2026-0055', qty:80, unitCost:'$18', totalCost:'$1,440', status:'delivered', expectedDelivery:'2026-07-22', property:'Center Point Corridor', notes:'Interior partition walls for new tenant buildout.' },
  { id:'m4', item:'RTU Ductwork Transition Kit', supplier:'AirTech Commercial HVAC', po:'PO-2026-0058', qty:1, unitCost:'$1,200', totalCost:'$1,200', status:'shipped', expectedDelivery:'2026-07-30', property:'628 State St', notes:'Custom fab for rooftop HVAC connection.' },
  { id:'m5', item:'Vinyl Plank Flooring — Luxury Grade', supplier:'Shaw Commercial Flooring', po:'PO-2026-0061', qty:1200, unitCost:'$3.50/sqft', totalCost:'$4,200', status:'ordered', expectedDelivery:'2026-08-05', property:'Jamestown @ Shelby', notes:'Bldg A common area refresh. Color: Weathered Oak.' },
  { id:'m6', item:'ADA Compliant Exterior Signage Package', supplier:'Bristol Sign Co', po:'PO-2026-0063', qty:3, unitCost:'$650', totalCost:'$1,950', status:'ordered', expectedDelivery:'2026-08-10', property:'City Centre', notes:'New suite directory + exterior wayfinding signs.' }
];

function getMaterials() {
  try {
    const raw = localStorage.getItem(MATERIALS_KEY);
    const d = raw ? JSON.parse(raw) : [];
    if (!d.length) { saveMaterials(DEMO_MATERIALS); return DEMO_MATERIALS; }
    return d;
  } catch(e) { return DEMO_MATERIALS; }
}

function saveMaterials(m) { localStorage.setItem(MATERIALS_KEY, JSON.stringify(m)); }

function renderMaterials() {
  const feed = document.getElementById('materials-feed');
  const pipeline = document.getElementById('mat-pipeline-kpis');
  if (!feed) return;

  const all = getMaterials();
  const statusFilter = document.getElementById('mat-filter-status')?.value || 'all';
  let filtered = statusFilter === 'all' ? all : all.filter(m => m.status === statusFilter);

  // Pipeline KPIs
  const counts = { ordered:0, shipped:0, delivered:0, installed:0 };
  all.forEach(m => { if (counts[m.status] !== undefined) counts[m.status]++; });

  if (pipeline) {
    pipeline.innerHTML = `
      <div class="mat-pipe-card ordered"><div class="mat-pipe-count">${counts.ordered}</div><div class="mat-pipe-label">📝 Ordered</div></div>
      <div class="mat-pipe-card shipped"><div class="mat-pipe-count">${counts.shipped}</div><div class="mat-pipe-label">🚚 Shipped</div></div>
      <div class="mat-pipe-card delivered"><div class="mat-pipe-count">${counts.delivered}</div><div class="mat-pipe-label">📦 Delivered</div></div>
      <div class="mat-pipe-card installed"><div class="mat-pipe-count">${counts.installed}</div><div class="mat-pipe-label">✅ Installed</div></div>
    `;
  }

  const statusLabels = { ordered:'📝 Ordered', shipped:'🚚 Shipped', delivered:'📦 Delivered', installed:'✅ Installed' };
  const statusClasses = { ordered:'tb-ordered', shipped:'tb-shipped', delivered:'tb-delivered', installed:'tb-installed' };

  if (!filtered.length) {
    feed.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--t3);font-size:0.8rem;">No material orders match your filter.</div>`;
    return;
  }

  feed.innerHTML = filtered.map(m => `
    <div class="ticket-card mat-card ${m.status}">
      <div class="tc-header">
        <div class="tc-title-wrap">
          <div class="tc-prop">${m.property || 'Unassigned'}</div>
          <div class="tc-title">${m.item}</div>
          <div class="tc-badges">
            <span class="t-badge ${statusClasses[m.status] || ''}">${statusLabels[m.status] || m.status}</span>
            <span class="t-badge" style="background:rgba(255,255,255,0.04);color:var(--t2);border:1px solid var(--border);">${m.po || 'No PO'}</span>
          </div>
        </div>
        <select class="tc-status-sel" onchange="updateMaterialStatus('${m.id}',this.value)">
          <option value="ordered" ${m.status==='ordered'?'selected':''}>📝 Ordered</option>
          <option value="shipped" ${m.status==='shipped'?'selected':''}>🚚 Shipped</option>
          <option value="delivered" ${m.status==='delivered'?'selected':''}>📦 Delivered</option>
          <option value="installed" ${m.status==='installed'?'selected':''}>✅ Installed</option>
        </select>
      </div>
      <div class="tc-details">
        <div class="tc-det-item"><span class="tc-det-lbl">Supplier</span><span class="tc-det-val">${m.supplier || 'TBD'}</span></div>
        <div class="tc-det-item"><span class="tc-det-lbl">Qty</span><span class="tc-det-val">${m.qty || '—'}</span></div>
        <div class="tc-det-item"><span class="tc-det-lbl">Total Cost</span><span class="tc-det-val" style="color:var(--gold);">${m.totalCost || 'TBD'}</span></div>
        <div class="tc-det-item"><span class="tc-det-lbl">ETA</span><span class="tc-det-val">${m.expectedDelivery ? new Date(m.expectedDelivery).toLocaleDateString('en-US',{month:'short',day:'numeric'}) : 'TBD'}</span></div>
      </div>
      ${m.notes ? `<div style="font-size:0.75rem;color:var(--t2);line-height:1.5;margin-top:0.3rem;">${m.notes}</div>` : ''}
      <div class="tc-actions">
        <button class="act-btn" onclick="editMaterial('${m.id}')" style="font-size:0.68rem;padding:0.35em 0.7em;">✏️ Edit</button>
        <button class="act-btn del" onclick="deleteMaterial('${m.id}')" style="font-size:0.68rem;padding:0.35em 0.7em;">Delete</button>
      </div>
    </div>
  `).join('');
}

function updateMaterialStatus(id, status) {
  const mats = getMaterials();
  const m = mats.find(x => x.id === id);
  if (m) { m.status = status; saveMaterials(mats); renderMaterials(); toast('Material status updated ✓','ok'); }
}

function openMaterialModal(id) {
  const el = (fld) => document.getElementById(fld);
  el('mm-id').value = '';
  el('mm-modal-title').textContent = '📦 Add Material Order';
  ['mm-item','mm-supplier','mm-po','mm-qty','mm-unit-cost','mm-total','mm-delivery','mm-property','mm-notes'].forEach(f => { if(el(f)) el(f).value=''; });
  document.getElementById('material-overlay').classList.add('open');
  setTimeout(() => el('mm-item').focus(), 320);
}

function editMaterial(id) {
  const m = getMaterials().find(x => x.id === id);
  if (!m) return;
  const el = (f) => document.getElementById(f);
  el('mm-id').value = m.id;
  el('mm-modal-title').textContent = '✏️ Edit Material Order';
  el('mm-item').value = m.item || '';
  el('mm-supplier').value = m.supplier || '';
  el('mm-po').value = m.po || '';
  el('mm-qty').value = m.qty || '';
  el('mm-unit-cost').value = m.unitCost || '';
  el('mm-total').value = m.totalCost || '';
  el('mm-status').value = m.status || 'ordered';
  el('mm-delivery').value = m.expectedDelivery || '';
  el('mm-property').value = m.property || '';
  el('mm-notes').value = m.notes || '';
  document.getElementById('material-overlay').classList.add('open');
}

function closeMaterialModal() { document.getElementById('material-overlay').classList.remove('open'); }

function submitMaterial() {
  const el = (f) => document.getElementById(f)?.value?.trim() || '';
  const item = el('mm-item');
  if (!item) { toast('Item description is required','info'); return; }
  const mid = el('mm-id') || ('m_' + Date.now());
  const mat = { id:mid, item, supplier:el('mm-supplier'), po:el('mm-po'), qty:parseInt(el('mm-qty'))||1, unitCost:el('mm-unit-cost'), totalCost:el('mm-total'), status:document.getElementById('mm-status').value, expectedDelivery:el('mm-delivery'), property:el('mm-property'), notes:el('mm-notes') };
  const mats = getMaterials();
  const idx = mats.findIndex(x => x.id === mid);
  if (idx !== -1) mats[idx] = mat; else mats.unshift(mat);
  saveMaterials(mats); closeMaterialModal(); renderMaterials(); toast('Material order saved ✓','ok');
}

function deleteMaterial(id) {
  if (!confirm('Delete this material order?')) return;
  saveMaterials(getMaterials().filter(x => x.id !== id)); renderMaterials(); toast('Material removed','info');
}

/* ═══════════════════════════════════════════════
   BUDGET ENGINE
   ═══════════════════════════════════════════════ */
function parseCost(s) {
  if (!s) return 0;
  return parseFloat(String(s).replace(/[^0-9.\-]/g, '')) || 0;
}

function renderBudget() {
  const tickets = typeof getTickets === 'function' ? getTickets() : [];
  const mats = getMaterials();

  let totalEstimated = 0, totalActual = 0, totalMaterials = 0;
  const propBudgets = {};
  const tradeBudgets = {};

  tickets.forEach(t => {
    const est = parseCost(t.budget);
    const act = parseCost(t.actualCost);
    totalEstimated += est;
    totalActual += act;
    const prop = t.property || 'Other';
    if (!propBudgets[prop]) propBudgets[prop] = { est:0, act:0 };
    propBudgets[prop].est += est;
    propBudgets[prop].act += act;
    const trade = t.category || 'other';
    if (!tradeBudgets[trade]) tradeBudgets[trade] = 0;
    tradeBudgets[trade] += est;
  });

  mats.forEach(m => { totalMaterials += parseCost(m.totalCost); });

  const variance = totalEstimated - totalActual;
  const varianceClass = variance >= 0 ? 'cool' : 'hot';
  const fmt = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits:0, maximumFractionDigits:0 });

  // KPI Cards
  const kpiContainer = document.getElementById('budget-kpi-cards');
  if (kpiContainer) {
    kpiContainer.innerHTML = `
      <div class="stat-card"><div class="stat-label">Total Estimated</div><div class="stat-number" style="color:var(--off-white);">${fmt(totalEstimated)}</div><div class="stat-sub">All job ticket budgets</div></div>
      <div class="stat-card"><div class="stat-label">Total Actual Spent</div><div class="stat-number" style="color:var(--gold);">${fmt(totalActual)}</div><div class="stat-sub">Recorded actual costs</div></div>
      <div class="stat-card"><div class="stat-label">Variance</div><div class="stat-number" style="color:var(--${varianceClass});">${variance >= 0 ? '+' : ''}${fmt(variance)}</div><div class="stat-sub">${variance >= 0 ? 'Under budget' : 'Over budget'}</div></div>
      <div class="stat-card"><div class="stat-label">Material Orders</div><div class="stat-number" style="color:var(--info);">${fmt(totalMaterials)}</div><div class="stat-sub">${mats.length} orders total</div></div>
    `;
  }

  // Per-Property Bars
  const propContainer = document.getElementById('budget-property-bars');
  if (propContainer) {
    const maxEst = Math.max(...Object.values(propBudgets).map(v => v.est), 1);
    propContainer.innerHTML = Object.entries(propBudgets).sort((a,b) => b[1].est - a[1].est).map(([prop, v]) => {
      const pct = Math.min((v.act / Math.max(v.est, 1)) * 100, 100);
      const barClass = pct > 100 ? 'over' : pct > 75 ? 'on-track' : 'under';
      return `<div class="budget-bar-item">
        <div class="budget-bar-label"><span class="budget-bar-name">${prop}</span><span class="budget-bar-val">${fmt(v.act)} / ${fmt(v.est)}</span></div>
        <div class="budget-bar-track"><div class="budget-bar-fill ${barClass}" style="width:${Math.min(pct, 100)}%;"></div></div>
      </div>`;
    }).join('');
  }

  // Cost by Trade
  const tradeContainer = document.getElementById('budget-trade-bars');
  if (tradeContainer) {
    const catLabels = { construction:'🏗️ Buildout', electrical:'⚡ Electrical', plumbing:'🚰 Plumbing', hvac:'❄️ HVAC', maintenance:'🔧 Maintenance', siteprep:'🚜 Site Prep', other:'📋 Other' };
    const maxTrade = Math.max(...Object.values(tradeBudgets), 1);
    tradeContainer.innerHTML = Object.entries(tradeBudgets).sort((a,b) => b[1] - a[1]).map(([trade, amt]) => {
      const pct = (amt / maxTrade) * 100;
      return `<div class="budget-bar-item">
        <div class="budget-bar-label"><span class="budget-bar-name">${catLabels[trade] || trade}</span><span class="budget-bar-val">${fmt(amt)}</span></div>
        <div class="budget-bar-track"><div class="budget-bar-fill on-track" style="width:${pct}%;"></div></div>
      </div>`;
    }).join('');
  }
}

/* ═══════════════════════════════════════════════
   CREW & CONTRACTOR DIRECTORY
   ═══════════════════════════════════════════════ */
const DEMO_CREW = [
  { id:'c1', name:'Noah Hurley', company:'Hurley Enterprise LLC', type:'inhouse', role:'Foreman', trade:'general', phone:'(423) 742-7219', email:'noah@hurleyllc.com', rating:5, notes:'Leads all in-house buildout crews. On-site daily across all properties.', status:'active' },
  { id:'c2', name:'Allen Hurley', company:'Hurley Enterprise LLC', type:'inhouse', role:'Owner', trade:'general', phone:'(423) 742-7219', email:'allen@hurleyllc.com', rating:5, notes:'CEO & Project Lead. Final approval on all budgets, change orders, and vendor selections.', status:'active' },
  { id:'c3', name:'Jake Thompson', company:'AirTech Commercial HVAC', type:'outside', role:'Lead Tech', trade:'hvac', phone:'(423) 555-0399', email:'jake@airtechhvac.com', rating:4, notes:'Handles all commercial rooftop units and ductwork. Fast turnaround, fair pricing.', status:'preferred' },
  { id:'c4', name:'Marcus Bell', company:'Tri-Cities Electrical', type:'outside', role:'Superintendent', trade:'electrical', phone:'(423) 555-0188', email:'marcus@tcelectrical.com', rating:5, notes:'Licensed commercial electrician. Panel upgrades, fire alarm, LED retrofits.', status:'preferred' },
  { id:'c5', name:'Dave Wilson', company:'ProWash Tri-Cities', type:'outside', role:'Owner', trade:'cleaning', phone:'(423) 555-0711', email:'dave@prowash.com', rating:4, notes:'Exterior pressure washing, facade cleaning, parking lot maintenance.', status:'active' }
];

function getCrew() {
  try {
    const raw = localStorage.getItem(CREW_KEY);
    const d = raw ? JSON.parse(raw) : [];
    if (!d.length) { saveCrew(DEMO_CREW); return DEMO_CREW; }
    return d;
  } catch(e) { return DEMO_CREW; }
}

function saveCrew(c) { localStorage.setItem(CREW_KEY, JSON.stringify(c)); }

function renderCrew() {
  const typeFilter = document.getElementById('crew-filter-type')?.value || 'all';
  const tradeFilter = document.getElementById('crew-filter-trade')?.value || 'all';
  let crew = getCrew();
  if (typeFilter !== 'all') crew = crew.filter(c => c.type === typeFilter);
  if (tradeFilter !== 'all') crew = crew.filter(c => c.trade === tradeFilter);

  const inhouse = crew.filter(c => c.type === 'inhouse');
  const outside = crew.filter(c => c.type === 'outside');

  const tradeLabels = { general:'🏗️ General', electrical:'⚡ Electrical', hvac:'❄️ HVAC', plumbing:'🚰 Plumbing', roofing:'🏠 Roofing', painting:'🎨 Painting', cleaning:'🧹 Cleaning' };
  const stars = (n) => '⭐'.repeat(n);

  function renderCrewCards(list) {
    return list.map(c => {
      const pDigits = (c.phone || '').replace(/\D/g, '');
      const callBtn = pDigits ? `<a href="tel:+1${pDigits}" class="act-btn call" style="font-size:0.68rem;padding:0.35em 0.75em;">📞 Call</a>` : '';
      const typeBadge = c.type === 'inhouse' ? '<span class="t-badge tb-inhouse">🏠 In-House</span>' : '<span class="t-badge tb-outside">🤝 Trusted Firm</span>';
      const statusBadge = c.status === 'preferred' ? ' <span class="t-badge tb-preferred">⭐ Preferred</span>' : '';
      return `
        <div class="crew-card ${c.type}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.5rem;">
            <div>
              <div class="crew-name">${c.name}</div>
              <div class="crew-role">${c.role || ''} · ${c.company || ''}</div>
              <div class="tc-badges" style="margin-top:0.35rem;">
                ${typeBadge}${statusBadge}
                <span class="t-badge" style="background:rgba(255,255,255,0.04);color:var(--t2);border:1px solid var(--border);">${tradeLabels[c.trade] || c.trade}</span>
              </div>
            </div>
            <div style="display:flex;gap:0.3rem;">
              <button class="act-btn" onclick="editCrew('${c.id}')" style="font-size:0.65rem;padding:0.3em 0.6em;">✏️</button>
              <button class="act-btn del" onclick="deleteCrew('${c.id}')" style="font-size:0.65rem;padding:0.3em 0.6em;">✕</button>
            </div>
          </div>
          <div class="crew-stars">${stars(c.rating || 3)}</div>
          <div class="crew-contact">
            ${callBtn}
            ${c.phone ? `<span style="font-size:0.72rem;color:var(--t2);">${c.phone}</span>` : ''}
          </div>
          ${c.notes ? `<div style="font-size:0.72rem;color:var(--t3);margin-top:0.5rem;line-height:1.4;">${c.notes}</div>` : ''}
        </div>
      `;
    }).join('');
  }

  const inhouseSection = document.getElementById('crew-inhouse-section');
  const outsideSection = document.getElementById('crew-outside-section');

  if (inhouseSection) {
    if (typeFilter === 'outside') { inhouseSection.innerHTML = ''; }
    else {
      inhouseSection.innerHTML = `
        <div class="crew-section-hdr" onclick="toggleCrewSection('inhouse')">
          <div class="crew-section-title">🏠 In-House Crew — ${inhouse.length} Member${inhouse.length !== 1 ? 's' : ''}</div>
          <div class="crew-section-chevron open" id="crew-chev-inhouse">▼</div>
        </div>
        <div class="crew-grid" id="crew-grid-inhouse">${renderCrewCards(inhouse)}</div>
      `;
    }
  }

  if (outsideSection) {
    if (typeFilter === 'inhouse') { outsideSection.innerHTML = ''; }
    else {
      outsideSection.innerHTML = `
        <div class="crew-section-hdr" onclick="toggleCrewSection('outside')" style="margin-top:1rem;">
          <div class="crew-section-title">🤝 Trusted Outside Firms — ${outside.length} Contractor${outside.length !== 1 ? 's' : ''}</div>
          <div class="crew-section-chevron open" id="crew-chev-outside">▼</div>
        </div>
        <div class="crew-grid" id="crew-grid-outside">${renderCrewCards(outside)}</div>
      `;
    }
  }
}

function toggleCrewSection(type) {
  const grid = document.getElementById('crew-grid-' + type);
  const chevron = document.getElementById('crew-chev-' + type);
  if (!grid) return;
  const isOpen = grid.style.display !== 'none';
  grid.style.display = isOpen ? 'none' : 'grid';
  if (chevron) chevron.classList.toggle('open', !isOpen);
}

function openCrewModal() {
  const el = (f) => document.getElementById(f);
  el('mc-id').value = '';
  el('mc-modal-title').textContent = '👷 Add Crew Member / Contractor';
  ['mc-name','mc-company','mc-phone','mc-email','mc-notes'].forEach(f => { if(el(f)) el(f).value=''; });
  el('mc-type').value = 'inhouse';
  el('mc-role').value = 'Crew';
  el('mc-trade').value = 'general';
  el('mc-rating').value = '5';
  document.getElementById('crew-overlay').classList.add('open');
  setTimeout(() => el('mc-name').focus(), 320);
}

function editCrew(id) {
  const c = getCrew().find(x => x.id === id);
  if (!c) return;
  const el = (f) => document.getElementById(f);
  el('mc-id').value = c.id;
  el('mc-modal-title').textContent = '✏️ Edit Team Member';
  el('mc-name').value = c.name || '';
  el('mc-company').value = c.company || '';
  el('mc-type').value = c.type || 'outside';
  el('mc-role').value = c.role || 'Crew';
  el('mc-trade').value = c.trade || 'general';
  el('mc-rating').value = String(c.rating || 3);
  el('mc-phone').value = c.phone || '';
  el('mc-email').value = c.email || '';
  el('mc-notes').value = c.notes || '';
  document.getElementById('crew-overlay').classList.add('open');
}

function closeCrewModal() { document.getElementById('crew-overlay').classList.remove('open'); }

function submitCrew() {
  const el = (f) => document.getElementById(f)?.value?.trim() || '';
  const name = el('mc-name');
  if (!name) { toast('Name is required','info'); return; }
  const cid = el('mc-id') || ('c_' + Date.now());
  const member = { id:cid, name, company:el('mc-company'), type:document.getElementById('mc-type').value, role:document.getElementById('mc-role').value, trade:document.getElementById('mc-trade').value, phone:el('mc-phone'), email:el('mc-email'), rating:parseInt(document.getElementById('mc-rating').value)||5, notes:el('mc-notes'), status:'active' };
  const crew = getCrew();
  const idx = crew.findIndex(x => x.id === cid);
  if (idx !== -1) crew[idx] = member; else crew.unshift(member);
  saveCrew(crew); closeCrewModal(); renderCrew(); toast('Team member saved ✓','ok');
}

function deleteCrew(id) {
  if (!confirm('Remove this team member?')) return;
  saveCrew(getCrew().filter(x => x.id !== id)); renderCrew(); toast('Team member removed','info');
}
