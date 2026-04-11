/* ============================================================
   HURLEY ENTERPRISE LLC — Riley AI Chatbot v2
   Smart context memory · Lead capture · NLP scoring
   ============================================================ */
(function () {
  'use strict';

  /* ── Knowledge Base ─────────────────────────────────────────── */
  const KB = [

    // GREETINGS
    { id:'greet', score:0, intent:'greet',
      keys: ['hello','hi','hey','good morning','good afternoon','good evening','howdy','sup','what up','yo','hiya'],
      replies: [
        "Hey there! 👋 I'm **Riley** — Hurley Enterprise's local market expert. I know every property and corridor in Bristol TN/VA inside and out.\n\nAre you looking to **lease space**, **sell a property**, or explore the **investment opportunities** around the Hard Rock Casino?",
        "Hi! Great to meet you. I'm **Riley** with Hurley Enterprise LLC — Bristol TN/VA's premier commercial developer since 2004. 🏗️\n\nWhat brings you by today — leasing, buying, selling, or just exploring the market?"
      ]
    },

    // HARD ROCK / CASINO
    { id:'casino', score:0, intent:'market',
      keys: ['hard rock','casino','hard rock casino','bristol casino','hotel casino','casino corridor','new casino'],
      reply: "The **Hard Rock Hotel & Casino Bristol VA** is the single biggest economic catalyst this region has seen in a generation. Here's what that means for you:\n\n• 🏢 **Commercial vacancy** dropped from 18% → 11% in 12 months\n• 💰 **$845M estimated economic impact** for the Bristol MSA\n• 📈 Properties within a mile are appreciating the fastest\n• 🍽️ Massive demand for restaurant, retail, and hospitality space\n\nWe have **several properties directly in the casino corridor**. Want me to walk you through them?"
    },

    // CITY CENTRE / 100 5TH
    { id:'citycentre', score:0, intent:'lease',
      keys: ['city centre','5th st','5th street','office suite','all inclusive','100 5th','downtown office','suite'],
      reply: "**City Centre at 100 5th Street** is our flagship downtown Bristol TN address. Here's why people love it:\n\n• 📐 Suites from **120 to 6,000 sqft** — grow with us\n• ⚡ **All-inclusive rent** — power, water, cleaning, security cams & fitness access\n• 🚗 Off-street parking included\n• 🎵 Right in the heart of The Birthplace of Country Music district\n• 🔑 Flexible lease terms — we work with startups and established firms alike\n\nWant to **schedule a tour**? I can make that happen right now."
    },

    // 628 STATE STREET (Restaurant)
    { id:'state628', score:0, intent:'lease',
      keys: ['628 state','state street','restaurant','bar','mezzanine','8500','8,500','kitchen','brewery','entertainment','bar build'],
      reply: "**628 State Street** is a showstopper — 8,500 sqft of prime commercial space on Bristol's iconic State Street:\n\n• 🍺 Full **bar build-out** already in place\n• 🏛️ Dramatic **mezzanine level** for dining or events\n• 🍳 **Commercial kitchen infrastructure** ready to go\n• 📍 Positioned perfectly between downtown and the Hard Rock Casino corridor\n• 🎸 State Street is Bristol's premier nightlife and entertainment strip\n\nThis is the space for a **high-volume restaurant, brewery, or entertainment venue**. Serious inquiries only — want to arrange a viewing?"
    },

    // JAMESTOWN / SHELBY
    { id:'jamestown', score:0, intent:'lease',
      keys: ['jamestown','shelby','815 shelby','no cam','cam fee','cam fees'],
      reply: "**Jamestown @ Shelby (815 Shelby St)** is a standout for businesses tired of hidden fees:\n\n• 📏 **1,200–4,500 sqft** of professional office space\n• ✅ **Zero CAM fees** — what you see is what you pay\n• 🚗 Off-street parking included\n• 🏛️ Distinctive downtown Bristol TN architecture\n• 🤝 Professional community of established tenants\n\nGreat for law firms, consultants, medical offices, and financial practices. Want to know more?"
    },

    // FOUNDATION / EVENT VENUE
    { id:'foundation', score:0, intent:'venue',
      keys: ['foundation','event','venue','meeting room','event space','event facility','620 state','private event','corporate event'],
      reply: "**The Foundation Event Facility (620 State Street)** is Bristol TN's most unique event space:\n\n• 🎉 **Three distinct spaces** — 15 to 100 guests\n• 💼 Corporate meetings, team-building, networking events\n• 🥂 Private celebrations, rehearsal dinners, milestone events\n• 📍 Right on iconic State Street\n• 💵 Affordable packages with flexible booking\n\nPerfect for businesses that need a professional, memorable setting without the hotel price tag. Want availability info?"
    },

    // COCA-COLA WAREHOUSE
    { id:'cocacola', score:0, intent:'industrial',
      keys: ['coca cola','1916','coca-cola','warehouse','45500','45,500','dock','tractor','loading dock','industrial','distribution','w state'],
      reply: "**1916 W. State Street** — the iconic former Coca-Cola building in Bristol VA — is a rare opportunity:\n\n• 🏢 **8,000 sqft** of finished office space\n• 🏭 **45,500+ sqft** of warehouse with **26-ft ceiling clearance**\n• 🚛 Tractor-trailer accessible with **rear loading docks**\n• 🏛️ Historic landmark building with incredible character\n• 💼 Ideal for distribution, manufacturing, or mixed-use\n\nThis is a once-in-a-generation asset. Are you in logistics, manufacturing, or investment?"
    },

    // CENTER POINT / CASINO CORRIDOR
    { id:'centerpoint', score:0, intent:'lease',
      keys: ['center point','centre point','commonwealth','commonwealth ave','across from casino','casino corridor'],
      reply: "**Center Point on Commonwealth Ave** — Bristol VA's most coveted commercial address right now:\n\n• 📍 **Directly across from the Hard Rock Hotel & Casino**\n• 📈 Retail vacancy in this corridor: **18% → 11%** in 12 months\n• 🚶 Unprecedented foot traffic from casino visitors\n• 🍽️ Perfect for restaurant, retail, hotel-adjacent services\n• 💡 Premium units still available\n\nThis is where the action is. If you're looking for visibility, there's no better spot in the Tri-Cities. Want to discuss terms?"
    },

    // BRADLEY STREET HOMES
    { id:'bradley', score:0, intent:'residential',
      keys: ['bradley','2412','2414','2416','three homes','3 homes','residential','investor','investment property'],
      reply: "The **Bradley Street Portfolio** — 2412, 2414, and 2416 Bradley Street — is a serious investor's play:\n\n• 🏠 **Three homes on one parcel** — buy them together\n• 📍 Walking distance from the Hard Rock Casino Bristol VA\n• 📈 Fastest-appreciating neighborhood in the Tri-Cities\n• 💰 Short-term rental (Airbnb/VRBO) or long-term rental income potential\n• 🔑 Move-in ready condition\n\nThe casino is driving residential demand for hotel alternatives. This portfolio could be a cash machine. Want the details?"
    },

    // RANDOLPH STREET
    { id:'randolph', score:0, intent:'residential',
      keys: ['randolph','2409','2413','remodeled home','3 bed','3br','residential home'],
      reply: "We have two fully remodeled homes on **Randolph Street** in Bristol VA:\n\n• 🏡 **2409 Randolph** — 3BR/2BA, move-in ready\n• 🏡 **2413 Randolph** — 3BR/2.5BA, fully upgraded\n• 📍 Near the Hard Rock Casino corridor\n• ✅ Both fully renovated — no work needed\n\nThese are priced competitively for the current market. Would you like to arrange a showing?"
    },

    // WE BUY PROPERTY
    { id:'webuy', score:0, intent:'sell',
      keys: ['sell','sell my','cash offer','we buy','buy my','buy my house','buy my property','cash buyer','sell fast','fast close','no repairs','as is','as-is'],
      reply: "We make **selling your property simple and fast**:\n\n• 💵 **All-cash offers** — no financing contingencies\n• 🔨 **No repairs needed** — we buy as-is\n• 📅 **Close in as little as 14 days** — or on your timeline\n• 📍 Bristol TN/VA, Kingsport, Johnson City, and surrounding areas\n• 🤝 20+ years of local knowledge — we pay fair market values\n\nTell me a bit about your property and I'll put you in touch with our acquisition team. What's the address or general area?"
    },

    // DEVELOPMENT / CONSTRUCTION
    { id:'develop', score:0, intent:'develop',
      keys: ['develop','development','construction','build','contractor','ground up','renovation','tenant improvement','ti','historic','site development','architect'],
      reply: "Hurley Enterprise is a **licensed commercial developer** with 20+ years of Tri-Cities experience.\n\nOur capabilities:\n• 🏗️ **Ground-up commercial construction**\n• 🏛️ **Historic building renovation** (we love character properties)\n• 🔧 **Tenant improvement** — we customize spaces for your business\n• 🌍 **Site development** — land prep, permitting, infrastructure\n• 📋 Full project management from concept to certificate of occupancy\n\nDo you have a project in mind, or are you looking for the right site?"
    },

    // PRICING / RATES
    { id:'pricing', score:0, intent:'pricing',
      keys: ['price','cost','rent','rate','lease rate','how much','pricing','what does it cost','monthly','per sqft','per square foot'],
      reply: "Great question on pricing. Here's the honest answer:\n\n• 📐 Rates vary by property, size, and lease term\n• 🏢 **Office suites** — typically contact-for-pricing (we structure deals to fit your budget)\n• 🏭 **Warehouse/industrial** — competitive vs. market comps\n• 🔑 All-inclusive options available at City Centre (no surprise bills)\n\nWe'd rather have a 5-minute conversation and give you a real number than post a price that doesn't fit your situation. Want me to have someone reach out to you today?"
    },

    // MARKET REPORT
    { id:'report', score:0, intent:'report',
      keys: ['market report','market','2026 report','market data','market analysis','report','tri-cities market','commercial market','vacancy rate'],
      reply: "Our **2026 Tri-Cities Commercial Real Estate Market Report** is a must-read right now:\n\n📊 What's inside:\n• Hard Rock Casino economic impact data ($845M)\n• Vacancy & rent growth by corridor\n• Top investment opportunities for 2026\n• Bristol Hotel & Casino catalyst analysis\n• Cap rate trends across the region\n\n→ **<a href='market-report.html' style='color:var(--gold);font-weight:700;'>Get the full report here</a>** — just enter your name and contact info for free access."
    },

    // HOURS / CONTACT
    { id:'hours', score:0, intent:'contact',
      keys: ['hours','open','office hours','when are you','schedule','available'],
      reply: "We're available **Monday–Friday, 8:30 AM – 5:00 PM EST**.\n\nBest ways to reach us:\n• 📞 **Call/Text:** <a href='tel:+14237427219' style='color:var(--gold);font-weight:700;'>423-742-7219</a>\n• 📧 **Email:** <a href='mailto:info@hurleyenterprisellc.com' style='color:var(--gold);font-weight:700;'>info@hurleyenterprisellc.com</a>\n• 💬 **This chat** — I'm here 24/7\n• 📍 Walk in: 100 5th St., Suite 2W, Bristol, TN 37620\n\nOr I can have someone call **you** — want to leave your number?"
    },

    // CONTACT / PHONE
    { id:'contact', score:0, intent:'contact',
      keys: ['phone','call','number','contact','reach','email','message','get in touch','talk to'],
      reply: "Here's how to reach the Hurley Enterprise team:\n\n• 📞 **Direct line:** <a href='tel:+14237427219' style='color:var(--gold);font-weight:700;'>423-742-7219</a>\n• 📧 **Email:** <a href='mailto:info@hurleyenterprisellc.com' style='color:var(--gold);font-weight:700;'>info@hurleyenterprisellc.com</a>\n• 📋 **Contact form:** <a href='contact.html' style='color:var(--gold);font-weight:700;'>Click here</a>\n\nOr just tell me what you're looking for — I can often answer questions right here and connect you directly."
    },

    // LOCATION
    { id:'location', score:0, intent:'contact',
      keys: ['location','address','where are you','where is your office','directions','find you','your office'],
      reply: "We're located at:\n\n📍 **100 5th Street, Suite 2W**\n**Bristol, TN 37620**\n\nRight in the heart of downtown — The Birthplace of Country Music. Easy to find, free visitor parking nearby.\n\nWe serve the **entire Tri-Cities**: Bristol TN & VA, Kingsport, Johnson City, and surrounding areas including Abingdon VA and Marion VA."
    },

    // SERVICE AREA
    { id:'area', score:0, intent:'market',
      keys: ['kingsport','johnson city','tri cities','tri-cities','service area','abingdon','virginia','where do you','what areas','region'],
      reply: "We know the **entire Tri-Cities region** inside and out:\n\n• 🏙️ **Bristol TN & VA** — our home turf, deepest inventory\n• 🏭 **Kingsport, TN** — strong industrial and healthcare corridor\n• 🎓 **Johnson City, TN** — university market, growing tech sector\n• 🌳 **Abingdon & Marion, VA** — emerging markets with great value\n\nEvery market has different dynamics right now. Which area are you most focused on?"
    },

    // TOUR REQUEST
    { id:'tour', score:0, intent:'tour',
      keys: ['tour','schedule a tour','show me','visit','walk through','walk-through','see the space','showing','in person'],
      reply: "I'd love to set up a tour for you! 🏢\n\nOur team can usually accommodate next-day showings. To confirm a time, I just need a couple quick things:\n\n**What's your name and the best phone number to reach you?**\n\n(You can also call directly: <a href='tel:+14237427219' style='color:var(--gold);font-weight:700;'>423-742-7219</a>)"
    },

    // OFFER / QUOTE
    { id:'quote', score:0, intent:'quote',
      keys: ['quote','get a quote','give me a quote','what would you offer','what can you offer','make an offer','offer on my property'],
      reply: "Happy to work on a quote for you. To get you accurate numbers fast, our team will need a quick call.\n\n**Can I get your name and phone number?** Someone from our acquisition/leasing team will reach out within a few hours — usually same day.\n\n(Or call us direct: <a href='tel:+14237427219' style='color:var(--gold);font-weight:700;'>423-742-7219</a>)"
    },

    // WHO ARE YOU / ABOUT HURLEY
    { id:'about', score:0, intent:'about',
      keys: ['who are you','about hurley','about you','who is hurley','tell me about','your company','how long','since when','history','experience'],
      reply: "**Hurley Enterprise LLC** has been building and transforming the Tri-Cities since **2004** — over 20 years of local expertise.\n\nWhat we do:\n• 🏗️ Commercial development & ground-up construction\n• 🏢 Office, retail & warehouse leasing\n• 💵 Property acquisition (we buy fast, cash)\n• 🏛️ Historic renovation & adaptive reuse\n• 📊 Market intelligence — we know this region cold\n\nWe're not a national chain. We're local, responsive, and we know every block of Bristol TN & VA. <a href='about.html' style='color:var(--gold);font-weight:700;'>Learn more about us →</a>"
    },

    // PROPERTIES / LISTINGS
    { id:'listings', score:0, intent:'listings',
      keys: ['properties','listings','what properties','what do you have','available properties','available spaces','show me properties','what spaces','for sale','for lease','for rent'],
      reply: "Here's a quick overview of what we have available:\n\n🏢 **Commercial Lease**\n• City Centre — 100 5th St, Bristol TN (120–6,000 sqft, all-inclusive)\n• 628 State St — 8,500 sqft restaurant/bar space\n• Jamestown @ Shelby — 815 Shelby St, no CAM fees\n• 1916 W. State St — 8,000 sqft office + 45,500 sqft warehouse\n• Center Point — Commonwealth Ave, Bristol VA (across from Hard Rock)\n\n🎉 **Event Venue**\n• The Foundation — 620 State St, 15–100 guests\n\n🏠 **Residential / Investment**\n• Bradley St Portfolio — 3 homes, casino adjacent\n• Randolph St — 2 remodeled homes\n\n→ <a href='for-sale-lease.html' style='color:var(--gold);font-weight:700;'>View all listings with full details</a>\n\nWhich type of property are you most interested in?"
    },

  ];

  /* ── Context memory & lead capture ─────────────────────────── */
  const ctx = {
    intent:        null,      // last detected intent
    askedName:     false,
    askedPhone:    false,
    capturedName:  null,
    capturedPhone: null,
    messageCount:  0,
    lastTopic:     null,
  };

  const FALLBACK_REPLIES = [
    "That's a great question — let me connect you with the right person. We're available at 📞 <a href='tel:+14237427219' style='color:var(--gold);font-weight:700;'>423-742-7219</a> or you can <a href='contact.html' style='color:var(--gold);font-weight:700;'>send us a message here</a>. We typically respond same day.",
    "Hmm, I don't have a specific answer for that in my knowledge base — but our team definitely does. 📞 <a href='tel:+14237427219' style='color:var(--gold);font-weight:700;'>423-742-7219</a> or <a href='contact.html' style='color:var(--gold);font-weight:700;'>contact us here</a>. Want me to note your question to pass along?",
    "I want to make sure you get an accurate answer on that. Our team at <a href='tel:+14237427219' style='color:var(--gold);font-weight:700;'>423-742-7219</a> will know exactly. Can I get your name and number so the right person can follow up?"
  ];

  /* ── Context-aware chips ────────────────────────────────────── */
  const CHIPS_DEFAULT = [
    "What spaces are available?",
    "Hard Rock Casino area?",
    "Sell my property fast",
    "Schedule a tour",
    "Get the market report",
  ];

  const CHIPS_BY_INTENT = {
    lease:      ["City Centre details","628 State St","Jamestown @ Shelby","Warehouse space?","Schedule a tour"],
    sell:       ["How fast can you close?","No repairs needed?","What's my property worth?","Get a cash offer","Call me back"],
    develop:    ["Ground-up construction","Historic renovation","Tenant improvement","Development timeline","Get a quote"],
    market:     ["Casino corridor listings","Vacancy rate data","Get market report","Top investments 2026","Tell me about Bristol"],
    residential:["Bradley St portfolio","Randolph St homes","Investor returns?","Casino proximity?","Schedule a showing"],
    tour:       ["📞 Call 423-742-7219","Drop my number","Tell me about City Centre","628 State St","Other properties"],
    contact:    ["Call 423-742-7219","Send a message","Office hours","Our location","Start a chat"],
    venue:      ["Capacity details","Pricing?","Corporate packages","Book the Foundation","Other properties"],
    industrial: ["45,500 sqft warehouse","Loading dock specs","Office portion?","Investment potential","Schedule a tour"],
  };

  /* ── NLP: score-based matching ──────────────────────────────── */
  function getReply(q) {
    const lower = q.toLowerCase().replace(/[^\w\s]/g, ' ');
    const words = lower.split(/\s+/);

    // ── Lead capture flow ─────────────────────────────────────
    if (ctx.askedName && !ctx.capturedName) {
      const potential = q.trim();
      if (potential.length > 1) {
        ctx.capturedName = potential;
        ctx.askedName    = false;
        ctx.askedPhone   = true;
        return `Nice to meet you, **${ctx.capturedName.split(' ')[0]}**! 😊 And what's the best phone number to reach you? (We'll have someone call you shortly — no pressure at all)`;
      }
    }
    if (ctx.askedPhone && !ctx.capturedPhone) {
      const phoneMatch = q.replace(/\D/g, '');
      if (phoneMatch.length >= 7) {
        ctx.capturedPhone = q.trim();
        ctx.askedPhone    = false;
        saveLead();
        return `Perfect — got it! ✅ **${ctx.capturedName ? ctx.capturedName.split(' ')[0] : 'Someone'}** from our team will reach out to you at **${ctx.capturedPhone}** shortly — usually within a couple hours during business hours.\n\nAnything else I can help you with while you have me here?`;
      } else {
        return "Just need a phone number I can pass along — even approximate is fine. (Or call us direct at <a href='tel:+14237427219' style='color:var(--gold);font-weight:700;'>423-742-7219</a>)";
      }
    }

    // ── Score every KB entry ──────────────────────────────────
    let best = null, bestScore = 0;
    for (const entry of KB) {
      let score = 0;
      for (const key of entry.keys) {
        if (lower.includes(key)) {
          score += key.split(' ').length * 2; // multi-word phrases score higher
        }
        for (const w of words) {
          if (key === w) score += 1;
        }
      }
      if (score > bestScore) { bestScore = score; best = entry; }
    }

    if (best && bestScore > 0) {
      ctx.intent    = best.intent;
      ctx.lastTopic = best.id;

      // Check if it's a tour/quote intent + inject lead capture
      if (['tour','quote'].includes(best.intent) && !ctx.capturedName) {
        ctx.askedName = true;
      }

      // Pick reply (some entries have multiple for variety)
      const reply = Array.isArray(best.replies)
        ? best.replies[Math.floor(Math.random() * best.replies.length)]
        : best.reply;

      return reply;
    }

    // ── Contextual follow-ups ─────────────────────────────────
    if (ctx.lastTopic) {
      // "yes / more / tell me more" after a property description
      if (/\b(yes|sure|more|details|tell me|go ahead|sounds good|interested|absolutely|definitely)\b/.test(lower)) {
        ctx.askedName = true;
        return `Great! I'll have someone from our team reach out with full details and to answer any questions you have. **What's your name?**`;
      }
      if (/\b(no|not now|maybe later|pass|later)\b/.test(lower)) {
        return `No problem at all! I'm here if you change your mind. You can also browse all our listings at <a href='for-sale-lease.html' style='color:var(--gold);font-weight:700;'>for-sale-lease.html</a> anytime. Is there anything else I can tell you about the Bristol/Tri-Cities market?`;
      }
    }

    // ── Thank you ─────────────────────────────────────────────
    if (/\b(thank|thanks|thx|appreciate|great|perfect|awesome)\b/.test(lower)) {
      return `Happy to help! 😊 That's what I'm here for. If anything else comes up — about properties, the market, or anything Tri-Cities — just ask. We'd love to earn your business.`;
    }

    // ── FALLBACK ──────────────────────────────────────────────
    ctx.messageCount++;
    return FALLBACK_REPLIES[Math.min(ctx.messageCount - 1, FALLBACK_REPLIES.length - 1)];
  }

  /* ── Save captured lead ─────────────────────────────────────── */
  function saveLead() {
    const lead = {
      id:          'riley_' + Date.now(),
      source:      'riley_chatbot',
      temperature: 'hot',
      status:      'new',
      timestamp:   new Date().toISOString(),
      contact:     {
        firstName: ctx.capturedName ? ctx.capturedName.split(' ')[0] : '',
        lastName:  ctx.capturedName ? ctx.capturedName.split(' ').slice(1).join(' ') : '',
        phone:     ctx.capturedPhone || '',
        email:     ''
      },
      notes: `Riley chatbot lead. Last topic: ${ctx.lastTopic || 'general'}. Intent: ${ctx.intent || 'unknown'}.`
    };
    try {
      const existing = JSON.parse(localStorage.getItem('hurley_leads') || '[]');
      existing.unshift(lead);
      localStorage.setItem('hurley_leads', JSON.stringify(existing));
    } catch(e) { console.warn('Lead save failed', e); }
  }

  /* ── Get context-aware chips ────────────────────────────────── */
  function getChips() {
    return CHIPS_BY_INTENT[ctx.intent] || CHIPS_DEFAULT;
  }

  /* ── Build DOM ──────────────────────────────────────────────── */
  function buildUI() {
    // Pop card
    const popCard = document.createElement('div');
    popCard.id = 'chat-pop-card';
    popCard.setAttribute('role', 'dialog');
    popCard.setAttribute('aria-label', 'Chat with Riley');
    popCard.innerHTML = `
      <button class="pop-card-close" id="pop-card-close" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="pop-card-header">
        <div class="pop-card-avatar">R</div>
        <div><div class="pop-card-name">Riley</div><div class="pop-card-role">Hurley Enterprise Guide</div></div>
      </div>
      <p class="pop-card-msg">👋 Hi! I'm Riley — your Hurley Enterprise AI guide. Ask me anything about Bristol TN/VA properties, the Hard Rock Casino market, or selling your property fast.</p>
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

    // Chat window
    const win = document.createElement('div');
    win.id = 'chat-window';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'Chat with Riley — Hurley Enterprise');
    win.innerHTML = `
      <div class="chat-header">
        <div class="chat-avatar">R</div>
        <div class="chat-header-info">
          <div class="chat-name">Riley <span style="font-size:0.6rem;font-weight:600;color:var(--gold);vertical-align:middle;margin-left:4px;background:rgba(201,168,76,0.15);padding:0.1em 0.5em;border-radius:999px;">AI</span></div>
          <div class="chat-status"><span class="chat-status-dot"></span>Hurley Enterprise Guide · Online</div>
        </div>
        <button class="chat-header-close" id="chat-close" aria-label="Close chat">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="chat-messages" id="chat-messages" aria-live="polite" aria-label="Chat messages"></div>
      <div class="chat-suggestions" id="chat-chips"></div>
      <div class="chat-input-row">
        <input type="text" id="chat-input" placeholder="Ask about spaces, prices, the casino market…" autocomplete="off" autocorrect="off" autocapitalize="sentences" enterkeyhint="send" maxlength="200">
        <button id="chat-send" aria-label="Send message">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>`;

    document.body.appendChild(popCard);
    document.body.appendChild(toggle);
    document.body.appendChild(win);
    return { popCard, toggle, win };
  }

  /* ── Main init ──────────────────────────────────────────────── */
  function init() {
    const { popCard, toggle, win } = buildUI();
    const messages  = document.getElementById('chat-messages');
    const input     = document.getElementById('chat-input');
    const sendBtn   = document.getElementById('chat-send');
    const closeBtn  = document.getElementById('chat-close');
    const chipsZone = document.getElementById('chat-chips');
    const popOpen    = document.getElementById('pop-card-open');
    const popDismiss = document.getElementById('pop-card-dismiss');
    const popClose   = document.getElementById('pop-card-close');

    let chatOpened = false;

    function dismissPop() { popCard.classList.remove('visible'); }

    // Show pop card after 6s
    setTimeout(() => { if (!chatOpened) popCard.classList.add('visible'); }, 6000);

    popOpen.addEventListener('click',    () => { popCard.classList.remove('visible'); openChat(); });
    popDismiss.addEventListener('click', dismissPop);
    popClose.addEventListener('click',   dismissPop);

    function openChat() {
      chatOpened = true;
      popCard.classList.remove('visible');
      win.classList.add('open');
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      if (!messages.children.length) { greet(); buildChips(CHIPS_DEFAULT); }
      setTimeout(() => input.focus(), 350);
    }

    function closeChat() {
      win.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', () => win.classList.contains('open') ? closeChat() : openChat());
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
      addMsg("Hi! I'm **Riley** 👋 — Hurley Enterprise's local market expert. I can help with:\n\n• 🏢 **Leasing** office, retail, warehouse & event space in Bristol TN/VA\n• 💵 **Selling your property** — fast cash offers, any condition\n• 📈 **Market intel** — Hard Rock Casino impact, vacancy trends, opportunities\n• 🏗️ **Development** — ground-up, renovation, tenant improvement\n\nWhat can I help you with today?", 'bot');
    }

    function buildChips(chips) {
      chipsZone.innerHTML = '';
      chips.forEach(label => {
        const chip = document.createElement('button');
        chip.className = 'chat-chip';
        chip.textContent = label;
        chip.addEventListener('click', () => handleSend(label));
        chipsZone.appendChild(chip);
      });
    }

    function addMsg(text, who) {
      const div = document.createElement('div');
      div.className = `chat-msg chat-msg--${who}`;
      const bubble = document.createElement('div');
      bubble.className = 'chat-msg-bubble';
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

    // Realistic typing delay — longer for longer responses
    function typingDelay(reply) {
      const words = reply.replace(/<[^>]+>/g, '').split(' ').length;
      return Math.min(500 + words * 18, 2200) + Math.random() * 300;
    }

    function handleSend(text) {
      const q = (text || input.value).trim();
      if (!q) return;
      addMsg(q, 'user');
      input.value = '';
      chipsZone.innerHTML = '';
      showTyping();
      const reply = getReply(q);
      setTimeout(() => {
        removeTyping();
        addMsg(reply, 'bot');
        // Rebuild chips based on new context
        buildChips(getChips());
        messages.scrollTop = messages.scrollHeight;
      }, typingDelay(reply));
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
