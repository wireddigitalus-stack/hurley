/* ============================================================
   HURLEY ENTERPRISE LLC — Riley AI Chatbot
   js/chatbot.js
   ============================================================ */
(function () {
  'use strict';

  /* ── Knowledge base ─────────────────────────────────────────── */
  const KB = [
    { keys: ['city centre','5th st','5th street','office suite','all inclusive','100 5th'],
      reply: "City Centre at 100 5th Street is our premier downtown Bristol TN address — office suites from 120 to 6,000 sqft. All-inclusive rent covers power, water, cleaning, security cams, and fitness access. No surprise bills, ever. Want to schedule a tour?" },
    { keys: ['628 state','state street','restaurant','bar','mezzanine','8500','8,500','kitchen'],
      reply: "628 State Street is a stunning 8,500 sqft commercial space on Bristol's iconic State Street — bar build-out, mezzanine, commercial kitchen infrastructure. Perfect for a high-volume restaurant, brewery, or entertainment venue. Ideal location between downtown and the Hard Rock Casino corridor." },
    { keys: ['jamestown','shelby','815 shelby','no cam'],
      reply: "Jamestown @ Shelby at 815 Shelby Street offers 1,200–4,500 sqft of professional office space with no extra CAM fees. Off-street parking included. A distinctive downtown Bristol TN address with real character." },
    { keys: ['foundation','event','venue','meeting','620 state'],
      reply: "The Foundation Event Facility at 620 State Street is Bristol TN's premier event venue — three unique spaces for 15 to 100 guests. Perfect for corporate meetings, private celebrations, and networking events. Affordable packages available." },
    { keys: ['coca cola','1916','coca-cola','warehouse','45500','45,500','dock','tractor'],
      reply: "1916 W. State Street is the former Coca-Cola building in Bristol VA — 8,000 sqft of office space plus over 45,500 sqft of tractor-trailer accessible warehouse with 26-foot clearance and rear loading docks. A landmark investment opportunity." },
    { keys: ['center point','centre point','commonwealth','casino corridor','hard rock corridor'],
      reply: "Center Point on Commonwealth Ave in Bristol VA is located directly across from the Hard Rock Hotel & Casino — the epicenter of Bristol's economic transformation. Retail vacancy here dropped from 18% to 11% in just 12 months. Premium units available." },
    { keys: ['bradley','2412','2414','2416','three homes','3 homes'],
      reply: "The Bradley Street portfolio — 2412, 2414, and 2416 Bradley Street — is three homes on one parcel, walking distance from the Hard Rock Casino Bristol VA. An exceptional residential investor opportunity in the fastest-appreciating neighborhood in the Tri-Cities." },
    { keys: ['randolph','2409','2413'],
      reply: "We have two fully remodeled homes on Randolph Street in Bristol VA — 2409 (3BR/2BA) and 2413 (3BR/2.5BA). Both are move-in ready and conveniently located near the Hard Rock Casino corridor." },
    { keys: ['hard rock','casino','bristol casino','hotel casino'],
      reply: "The Hard Rock Hotel & Casino Bristol VA is the biggest economic catalyst the Tri-Cities has seen in decades. It's driving unprecedented demand for commercial leasing, residential housing, and new development across the Bristol MSA. Several of our properties are in the direct impact zone." },
    { keys: ['bristol hotel','bristol casino hotel','new hotel','the bristol'],
      reply: "The new Bristol Hotel development on the VA side is further accelerating the market — adding hospitality capacity that will drive even more demand for nearby retail, restaurant, and office space. Our Center Point property is positioned perfectly to capture that traffic." },
    { keys: ['buy','sell my property','cash offer','sell my house','we buy'],
      reply: "We Buy Property fast, anywhere in Bristol TN/VA, Kingsport, or Johnson City. Cash offer, no repairs required, and we can close in as little as 14 days. Tell me about your property and I'll connect you with our acquisition team." },
    { keys: ['develop','construction','build','contractor','ground up','renovation'],
      reply: "Hurley Enterprise LLC is a licensed commercial developer with 20+ years in the Tri-Cities. We handle ground-up construction, tenant improvement, historic renovation, and site development. Want to discuss a development project?" },
    { keys: ['price','cost','rent','rate','lease rate','how much'],
      reply: "Pricing varies by property and configuration. Most of our spaces are contact-for-pricing — we tailor terms to fit your business. Want me to connect you with our team for a quick quote?" },
    { keys: ['hours','open','office hours','when'],
      reply: "Our office is open Monday–Friday, 8:30 AM – 5:00 PM EST. You can also reach us anytime at 423-742-7219 or drop us a message through our contact form." },
    { keys: ['phone','call','number','contact','reach'],
      reply: "You can reach us directly at 📞 423-742-7219 or visit our contact page to send a message. Our team typically responds within a few hours during business hours." },
    { keys: ['location','address','where are you','office location'],
      reply: "Our main office is at 100 5th Street, Suite 2W, Bristol, TN 37620 — right in the heart of downtown, The Birthplace of Country Music. We serve the entire Tri-Cities: Bristol TN/VA, Kingsport, and Johnson City." },
    { keys: ['kingsport','johnson city','tri cities','tri-cities','service area'],
      reply: "We serve the entire Tri-Cities region — Bristol TN & VA, Kingsport, Johnson City, and surrounding areas including Abingdon VA, Marion VA, and beyond. We know every market in the region." },
    { keys: ['market report','market','2026 report'],
      reply: "Our 2026 Tri-Cities Commercial Real Estate Market Report is available for download on our website. It covers Hard Rock Casino economic impact, vacancy trends, rent growth forecasts, and the new Bristol Hotel catalyst. Would you like the link?" },
    { keys: ['hello','hi','hey','good morning','good afternoon','howdy','sup'],
      reply: "Hey there! 👋 I'm Riley, your Hurley Enterprise guide. Whether you're looking to lease office or warehouse space, sell a property for cash, or explore development opportunities in Bristol TN/VA — I've got you covered. What can I help with?" },
  ];

  const FALLBACK = "Great question — that's one for our team to answer properly. You can reach us at 📞 423-742-7219 or <a href='contact.html' style='color:var(--gold);font-weight:700;'>send a message here</a>. We typically respond same day.";

  const CHIPS = [
    "Office space available?",
    "628 State St details",
    "Casino corridor listings",
    "Sell my property",
    "Development inquiry",
  ];

  /* ── Build DOM ──────────────────────────────────────────────── */
  function buildUI() {
    // Pop card
    const popCard = document.createElement('div');
    popCard.id = 'chat-pop-card';
    popCard.setAttribute('role', 'dialog');
    popCard.setAttribute('aria-label', 'Chat with Riley');
    popCard.innerHTML = `
      <div class="pop-card-header">
        <div class="pop-card-avatar">R</div>
        <div><div class="pop-card-name">Riley</div><div class="pop-card-role">Hurley Enterprise Guide</div></div>
      </div>
      <p class="pop-card-msg">👋 Hi! I'm Riley — your guide to Hurley Enterprise properties &amp; services. Looking for space in Bristol TN/VA?</p>
      <div class="pop-card-actions">
        <button class="pop-card-btn pop-card-btn--primary" id="pop-card-open">Chat with Me →</button>
        <button class="pop-card-btn pop-card-btn--dismiss" id="pop-card-dismiss">Maybe Later</button>
      </div>`;

    // Toggle button
    const toggle = document.createElement('button');
    toggle.id = 'chat-toggle';
    toggle.setAttribute('aria-label', 'Open chat');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = `
      <svg class="icon-chat" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
      <svg class="icon-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>`;

    // Window
    const win = document.createElement('div');
    win.id = 'chat-window';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'Chat with Riley — Hurley Enterprise');
    win.innerHTML = `
      <div class="chat-header">
        <div class="chat-avatar">R</div>
        <div class="chat-header-info">
          <div class="chat-name">Riley</div>
          <div class="chat-status"><span class="chat-status-dot"></span>Hurley Enterprise Guide · Online</div>
        </div>
        <button class="chat-header-close" id="chat-close" aria-label="Close chat">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="chat-messages" id="chat-messages" aria-live="polite" aria-label="Chat messages"></div>
      <div class="chat-suggestions" id="chat-chips"></div>
      <div class="chat-input-row">
        <input type="text" id="chat-input" placeholder="Ask about spaces, pricing, development…" autocomplete="off" autocorrect="off" autocapitalize="sentences" enterkeyhint="send" maxlength="200">
        <button id="chat-send" aria-label="Send message">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>`;

    document.body.appendChild(popCard);
    document.body.appendChild(toggle);
    document.body.appendChild(win);
    return { popCard, toggle, win };
  }

  /* ── Logic ──────────────────────────────────────────────────── */
  function init() {
    const { popCard, toggle, win } = buildUI();
    const messages  = document.getElementById('chat-messages');
    const input     = document.getElementById('chat-input');
    const sendBtn   = document.getElementById('chat-send');
    const closeBtn  = document.getElementById('chat-close');
    const chipsZone = document.getElementById('chat-chips');
    const popOpen   = document.getElementById('pop-card-open');
    const popDismiss= document.getElementById('pop-card-dismiss');

    let popDismissed = false;
    let chatOpened   = false;

    // Show pop card after 6s
    setTimeout(() => {
      if (!chatOpened) { popCard.classList.add('visible'); }
    }, 6000);

    popOpen.addEventListener('click', () => { popCard.classList.remove('visible'); openChat(); });
    popDismiss.addEventListener('click', () => { popCard.classList.remove('visible'); popDismissed = true; });

    function openChat() {
      chatOpened = true;
      popCard.classList.remove('visible');
      win.classList.add('open');
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      if (!messages.children.length) { greet(); buildChips(); }
      setTimeout(() => input.focus(), 350);
    }

    function closeChat() {
      win.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', () => { win.classList.contains('open') ? closeChat() : openChat(); });
    closeBtn.addEventListener('click', closeChat);

    // iOS keyboard shrink fix
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => {
        if (win.classList.contains('open')) {
          const offset = window.innerHeight - window.visualViewport.height;
          win.style.transform = offset > 50 ? `translateY(-${offset}px) scale(1)` : '';
        }
      });
    }

    function greet() {
      addMsg("Hi! I'm **Riley** 👋 — your Hurley Enterprise guide. I can help with office &amp; warehouse leasing in Bristol TN/VA, property sales, Hard Rock Casino corridor opportunities, and more. What are you looking for?", 'bot');
    }

    function buildChips() {
      chipsZone.innerHTML = '';
      CHIPS.forEach(label => {
        const chip = document.createElement('button');
        chip.className = 'chat-chip';
        chip.textContent = label;
        chip.addEventListener('click', () => { handleSend(label); });
        chipsZone.appendChild(chip);
      });
    }

    function addMsg(text, who) {
      const div = document.createElement('div');
      div.className = `chat-msg chat-msg--${who}`;
      const bubble = document.createElement('div');
      bubble.className = 'chat-msg-bubble';
      // render **bold** and links
      bubble.innerHTML = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
      if (who === 'bot') {
        const av = document.createElement('div');
        av.className = 'chat-msg-avatar';
        av.textContent = 'R';
        div.appendChild(av);
      }
      div.appendChild(bubble);
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function showTyping() {
      const t = document.createElement('div');
      t.className = 'chat-msg chat-msg--bot';
      t.id = 'typing-indicator';
      const av = document.createElement('div');
      av.className = 'chat-msg-avatar';
      av.textContent = 'R';
      const b = document.createElement('div');
      b.className = 'chat-typing';
      b.innerHTML = '<span></span><span></span><span></span>';
      t.appendChild(av); t.appendChild(b);
      messages.appendChild(t);
      messages.scrollTop = messages.scrollHeight;
    }

    function removeTyping() {
      const t = document.getElementById('typing-indicator');
      if (t) t.remove();
    }

    function getReply(q) {
      const lower = q.toLowerCase();
      for (const entry of KB) {
        if (entry.keys.some(k => lower.includes(k))) return entry.reply;
      }
      return FALLBACK;
    }

    function handleSend(text) {
      const q = (text || input.value).trim();
      if (!q) return;
      addMsg(q, 'user');
      input.value = '';
      chipsZone.innerHTML = '';
      showTyping();
      setTimeout(() => {
        removeTyping();
        addMsg(getReply(q), 'bot');
      }, 900 + Math.random() * 500);
    }

    sendBtn.addEventListener('click', () => handleSend());
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
