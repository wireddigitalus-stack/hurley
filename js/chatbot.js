/* ============================================================
   HURLEY ENTERPRISE LLC — Riley AI Chatbot v3
   Smart context memory · Lead capture · NLP scoring
   Full Bristol TN/VA city knowledge · 50+ KB entries
   ============================================================ */
(function () {
  'use strict';

  /* ── Knowledge Base ─────────────────────────────────────────── */
  const KB = [

    // ── GREETINGS ───────────────────────────────────────────────
    { id:'greet', intent:'greet',
      keys: ['hello','hi','hey','good morning','good afternoon','good evening','howdy','sup','what up','yo','hiya','greet','start'],
      replies: [
        "Hey there! 👋 I'm **Riley** — Hurley Enterprise's local market expert. I know every property, street, and opportunity in Bristol TN/VA inside and out.\n\nAsk me anything — property availability, the Hard Rock Casino market, Bristol history, where to eat, or how to sell your property fast.",
        "Hi! I'm **Riley** with Hurley Enterprise LLC — Bristol TN/VA's premier commercial developer since 2004. 🏗️\n\nI can help with leasing, buying, selling, development, or just answering questions about Bristol and the Tri-Cities. What's on your mind?"
      ]
    },

    // ── PROPERTIES / LISTINGS ───────────────────────────────────
    { id:'listings', intent:'listings',
      keys: ['properties','listings','what properties','what do you have','available properties','available spaces','show me properties','what spaces','for sale','for lease','for rent','inventory','what is available'],
      reply: "Here's everything we currently have available:\n\n🏢 **Commercial Lease**\n• <a href='for-sale-lease.html' style='color:var(--gold);font-weight:700;'>City Centre</a> — 100 5th St, Bristol TN (120–6,000 sqft, all-inclusive)\n• <a href='for-sale-lease.html' style='color:var(--gold);font-weight:700;'>628 State St</a> — 8,500 sqft restaurant/bar with full bar build-out\n• <a href='for-sale-lease.html' style='color:var(--gold);font-weight:700;'>Jamestown @ Shelby</a> — 1,200–4,500 sqft, zero CAM fees\n• <a href='for-sale-lease.html' style='color:var(--gold);font-weight:700;'>1916 W. State St</a> — 8K office + 45,500 sqft warehouse\n• <a href='for-sale-lease.html' style='color:var(--gold);font-weight:700;'>Center Point</a> — Commonwealth Ave, directly across from Hard Rock\n\n🎉 **Event Venue**\n• The Foundation — 620 State St, 15–100 guests\n\n🏠 **Residential / Investment**\n• Bradley St Portfolio — 3 homes, casino-adjacent\n• Randolph St — 2 fully remodeled homes\n\nWhich type interests you most?"
    },

    // ── CITY CENTRE / 100 5TH ───────────────────────────────────
    { id:'citycentre', intent:'lease',
      keys: ['city centre','city center','5th st','5th street','office suite','all inclusive','all-inclusive','100 5th','downtown office','suite','100 fifth'],
      reply: "**City Centre at 100 5th Street** is our flagship Bristol TN address — and our own headquarters:\n\n• 📐 Suites from **120 to 6,000 sqft** — scale as you grow\n• ⚡ **All-inclusive rent** — electric, water, WiFi, cleaning, security cameras & fitness access included\n• 🚗 Off-street parking included (rare downtown)\n• 🎵 Heart of The Birthplace of Country Music district\n• 🏛️ Historic renovated building with premium finishes\n• 🔑 Flexible terms — startups to established firms\n\nTenants include law firms, consultants, tech companies, and media businesses. Want to **schedule a tour**?"
    },

    // ── 628 STATE STREET ────────────────────────────────────────
    { id:'state628', intent:'lease',
      keys: ['628 state','628','restaurant space','bar space','mezzanine','8500 sqft','8,500','kitchen','brewery','entertainment venue','bar build','nightlife space','restaurant building'],
      reply: "**628 State Street** is a showstopper — 8,500 sqft on Bristol's iconic State Street:\n\n• 🍺 Full **bar build-out** already in place (saves $150K+)\n• 🏛️ Dramatic **mezzanine level** perfect for VIP or private dining\n• 🍳 **Commercial kitchen infrastructure** ready to go\n• 📍 On State Street — Bristol's main nightlife and entertainment corridor\n• 🎸 Walking distance from the Hard Rock Casino corridor\n• 🔊 Sound infrastructure already roughed in\n\nThis is THE space for a high-volume restaurant, craft brewery, or live music venue. Want to arrange a private showing?"
    },

    // ── JAMESTOWN / SHELBY ──────────────────────────────────────
    { id:'jamestown', intent:'lease',
      keys: ['jamestown','shelby','815 shelby','no cam','cam fee','cam fees','no hidden fees','professional office'],
      reply: "**Jamestown @ Shelby (815 Shelby St)** — professional office space with complete pricing transparency:\n\n• 📏 **1,200–4,500 sqft** of flexible office layouts\n• ✅ **Zero CAM fees** — your quoted rate is your rate, period\n• 🚗 Off-street parking included\n• 🏛️ Distinctive downtown Bristol TN architecture\n• 👔 Established professional tenants — great for networking\n\nPopular with law firms, financial advisors, medical practices, and consulting firms. Want the floor plans?"
    },

    // ── THE FOUNDATION ──────────────────────────────────────────
    { id:'foundation', intent:'venue',
      keys: ['foundation','event','venue','meeting room','event space','event facility','620 state','private event','corporate event','book a space','conference','party venue','reception'],
      reply: "**The Foundation Event Facility (620 State Street)** — Bristol TN's most versatile event space:\n\n• 🎉 **Three distinct rooms** — 15 to 100 guests\n• 💼 Perfect for corporate meetings, training sessions, team-building\n• 🥂 Private celebrations, rehearsal dinners, networking events\n• 📍 Prime State Street location — walkable to restaurants & parking\n• 💵 Very competitive rates vs. hotel conference rooms\n• 📅 Flexible booking — half-day, full-day, or evening\n\nWant availability for a specific date, or general pricing info?"
    },

    // ── COCA-COLA WAREHOUSE ─────────────────────────────────────
    { id:'cocacola', intent:'industrial',
      keys: ['coca cola','1916','coca-cola','warehouse','45500','45,500','dock','tractor','loading dock','industrial space','distribution','w state','west state','large warehouse','manufacturing'],
      reply: "**1916 W. State Street** — the iconic former Coca-Cola bottling plant in Bristol VA:\n\n• 🏢 **8,000 sqft** of renovated office space (executive quality)\n• 🏭 **45,500+ sqft** of warehouse with **26-ft ceiling clearance**\n• 🚛 Full tractor-trailer access + **rear loading docks**\n• 🏛️ Historic landmark building with incredible character\n• ⚡ Heavy 3-phase power available\n• 📍 Bristol VA — easy highway access\n\nIdeal for: regional distribution, light manufacturing, e-commerce fulfillment, or mixed office/warehouse. Are you in logistics or manufacturing?"
    },

    // ── CENTER POINT / CASINO CORRIDOR ──────────────────────────
    { id:'centerpoint', intent:'lease',
      keys: ['center point','centre point','commonwealth','commonwealth ave','across from casino','casino corridor','casino adjacent','high foot traffic'],
      reply: "**Center Point on Commonwealth Ave, Bristol VA** — the single most coveted commercial address in the Tri-Cities right now:\n\n• 📍 **Directly across from the Hard Rock Hotel & Casino**\n• 🚶 Thousands of casino visitors walk by daily\n• 📈 Corridor vacancy: **18% → 11%** in 12 months\n• 🍽️ Perfect for restaurant, retail, hospitality-adjacent business\n• 💡 Premium visibility units still available\n\nIf you want **maximum foot traffic and visibility**, there is literally no better address in the region. Want to talk terms?"
    },

    // ── BRADLEY STREET HOMES ────────────────────────────────────
    { id:'bradley', intent:'residential',
      keys: ['bradley','2412','2414','2416','three homes','3 homes','airbnb','vrbo','short term rental','investment property','residential portfolio','casino adjacent home'],
      reply: "The **Bradley Street Portfolio** — 2412, 2414, and 2416 Bradley Street, Bristol VA:\n\n• 🏠 **Three homes on one parcel** — acquire together for maximum ROI\n• 📍 Walking distance to the Hard Rock Casino Bristol VA\n• 📈 Fastest-appreciating residential corridor in the Tri-Cities\n• 💰 Ideal for **Airbnb/VRBO** — casino visitors need hotel alternatives\n• 🔑 Move-in ready, no deferred maintenance\n• 💵 Strong projected cap rate at current pricing\n\nThe casino demand for non-hotel lodging is real — this portfolio is positioned perfectly. Want the numbers?"
    },

    // ── RANDOLPH STREET HOMES ───────────────────────────────────
    { id:'randolph', intent:'residential',
      keys: ['randolph','2409','2413','remodeled home','3 bed','3br','3 bedroom','turnkey home','residential home','renovated home'],
      reply: "Two fully remodeled homes on **Randolph Street, Bristol VA**:\n\n• 🏡 **2409 Randolph** — 3BR/2BA, completely updated, move-in ready\n• 🏡 **2413 Randolph** — 3BR/2.5BA, full renovation, premium finishes\n• 📍 Minutes from the Hard Rock Casino corridor\n• ✅ All work done — roof, HVAC, plumbing, kitchen, baths\n• 🏘️ Established neighborhood with strong rental demand\n\nOwner-occupant or investor — both scenarios make sense here. Want to schedule a showing?"
    },

    // ── WE BUY PROPERTY ─────────────────────────────────────────
    { id:'webuy', intent:'sell',
      keys: ['sell','sell my','cash offer','we buy','buy my','buy my house','buy my property','cash buyer','sell fast','fast close','no repairs','as is','as-is','getting rid of','offload','liquidate','inherited','estate property'],
      reply: "We make **selling simple, fast, and fair**:\n\n• 💵 **All-cash offers** — no financing, no contingencies\n• 🔨 **Buy as-is** — no repairs, cleaning, or showings needed\n• 📅 **Close in 14 days** — or we work around YOUR timeline\n• 📍 We buy in Bristol TN/VA, Kingsport, Johnson City, Abingdon, and surrounding areas\n• 🤝 20+ years in this market — we make fair, competitive offers\n• 🏠 Residential, commercial, land, and multi-family\n\nTell me a little about your property — what's the general address or area, and what's the situation?"
    },

    // ── DEVELOPMENT / CONSTRUCTION ──────────────────────────────
    { id:'develop', intent:'develop',
      keys: ['develop','development','construction','build','contractor','ground up','renovation','tenant improvement','ti','historic','site development','architect','permit','new building','rebuild','remodel'],
      reply: "Hurley Enterprise is a **licensed commercial developer** — 20+ years of Tri-Cities projects:\n\n• 🏗️ **Ground-up commercial construction** — concept through certificate of occupancy\n• 🏛️ **Historic building renovation** — we specialize in adaptive reuse\n• 🔧 **Tenant improvement** — custom build-outs for your specific business\n• 🌍 **Site development** — land prep, permitting, utilities, infrastructure\n• 📐 **Design-build** — one point of contact for the entire project\n\nWe've done everything from small office renovations to $5M+ complex developments. Do you have a site in mind, or are you still in the exploration phase?"
    },

    // ── HARD ROCK CASINO (detailed) ─────────────────────────────
    { id:'casino', intent:'market',
      keys: ['hard rock','casino','hard rock casino','bristol casino','hotel casino','casino corridor','new casino','gaming','slots','resort','casino hotel','hard rock hotel'],
      reply: "The **Hard Rock Hotel & Casino Bristol VA** opened in 2024 and has completely transformed this market:\n\n🎰 **The property itself:**\n• 900+ gaming positions, 300+ hotel rooms\n• Multiple restaurants, bars, concert venue (3,000 capacity)\n• $400M+ total development investment\n\n📈 **Market impact:**\n• **$845M estimated annual economic impact** for the Bristol MSA\n• Commercial vacancy fell from 18% → 11% in 12 months\n• Hotel ADR up 34% in the corridor\n• Restaurant and retail demand surged across both Bristol TN & VA\n\n💼 **The opportunity:**\nWe have properties **directly in the casino corridor** — the highest-appreciation addresses in the entire Tri-Cities. Want to see them?"
    },

    // ── BRISTOL MOTOR SPEEDWAY ──────────────────────────────────
    { id:'speedway', intent:'bristol',
      keys: ['bristol motor speedway','speedway','nascar','race track','bristol speedway','dirt track','racing','night race','bms','thunder valley'],
      reply: "**Bristol Motor Speedway** — one of the most iconic venues in American sports:\n\n• 🏁 **The World's Fastest Half-Mile** — NASCAR's most coveted ticket\n• 🏟️ Capacity: ~150,000 fans (one of the largest stadiums on Earth)\n• 📅 Hosts multiple NASCAR Cup Series events per year\n• 🌙 The **Bristol Night Race** is legendary — sells out years in advance\n• 🏔️ One of only two dirt track race weekends on the NASCAR schedule\n\nThe Speedway brings **hundreds of thousands of visitors** to Bristol every year — a massive hospitality and retail boost for local businesses.\n\nInterestingly, this is one reason commercial real estate in Bristol holds value so well. Destination tourism is built into the market."
    },

    // ── BIRTHPLACE OF COUNTRY MUSIC ─────────────────────────────
    { id:'countrymusic', intent:'bristol',
      keys: ['birthplace of country music','bristol sessions','country music','ralph peer','carter family','jimmie rodgers','bom','country music museum','music history','1927'],
      reply: "Bristol is famous as the **Birthplace of Country Music** — a major point of civic pride and a real economic driver:\n\n🎵 **The Bristol Sessions (1927)**\n• Legendary producer **Ralph Peer** recorded the first commercial country music recordings right here on State Street\n• The **Carter Family** and **Jimmie Rodgers** both recorded their breakthrough sessions in Bristol VA\n• UNESCO recognized Bristol's significance in American musical heritage\n\n🏛️ **The Museum**\n• The **Birthplace of Country Music Museum** sits on State Street — an incredible facility\n• Part of the Smithsonian Affiliate network\n• Draws visitors from across the US and internationally\n\nThis cultural identity gives Bristol a unique brand that other Tri-Cities markets don't have — it attracts a creative economy and tourist trade that supports commercial real estate values."
    },

    // ── BRISTOL CITY INFO ────────────────────────────────────────
    { id:'bristolcity', intent:'bristol',
      keys: ['bristol','city of bristol','bristol tn','bristol va','what is bristol','tell me about bristol','bristol city','about bristol','bristol tennessee','bristol virginia'],
      reply: "**Bristol, Tennessee/Virginia** — one of the most unique cities in America:\n\n🗺️ **The Basics**\n• Population: ~47,000 combined (Bristol TN ~28K, Bristol VA ~17K)\n• **State Street literally divides Tennessee from Virginia** — the city line runs right down the center\n• Part of the **Kingsport-Bristol-Bristol** MSA (~300,000 people)\n\n⚡ **Why it's exciting right now:**\n• **Hard Rock Hotel & Casino** (2024) — first casino in Virginia\n• Downtown revitalization on both sides of State Street\n• Strong healthcare, manufacturing, and professional services base\n• **NASCAR** + **Birthplace of Country Music** = year-round tourism\n• Extremely affordable cost of living vs. larger metros\n\nFor commercial real estate, this market is genuinely undervalued relative to the economic activity here. Any specific part of Bristol you want to know more about?"
    },

    // ── STATE STREET ────────────────────────────────────────────
    { id:'statestreet', intent:'bristol',
      keys: ['state street','state line','tn va border','tennessee virginia','two states','state street bristol','downtown bristol','main street','border'],
      reply: "**State Street** is one of the most unique streets in America — the center line of the road is literally the **state border between Tennessee and Virginia**:\n\n• 🗺️ Walk from TN to VA just by crossing the street\n• 🎵 The **Birthplace of Country Music Museum** is here\n• 🍽️ Bristol's main restaurant, nightlife, and retail corridor\n• 🏛️ Historic storefronts with authentic character\n• 🚶 Heavy pedestrian traffic, especially on weekends\n\nWe have **628 State Street** available — 8,500 sqft of prime restaurant/entertainment space right on this iconic block. Want details?"
    },

    // ── BRISTOL ECONOMY ─────────────────────────────────────────
    { id:'economy', intent:'market',
      keys: ['economy','major employers','jobs','employment','industry','economic','who works','healthcare','manufacturing','workforce','job market'],
      reply: "Bristol's economy is more diverse and resilient than most people expect:\n\n🏥 **Healthcare** — Dominant sector\n• Bristol Regional Medical Center (major regional hospital)\n• Wellmont Health System\n• Valley Health — extensive network across both states\n\n🏭 **Manufacturing & Distribution**\n• Strong industrial corridor in Kingsport/Bristol VA\n• Several Fortune 500 distribution operations in the region\n\n🎰 **Tourism & Hospitality** (booming)\n• Hard Rock Casino (3,000+ employees)\n• Bristol Motor Speedway complex\n• Country Music tourism\n\n💼 **Professional Services**\n• Growing legal, financial, and technical workforce\n\nThe diversification makes commercial real estate here more stable than single-industry markets."
    },

    // ── SCHOOLS / EDUCATION ─────────────────────────────────────
    { id:'schools', intent:'bristol',
      keys: ['schools','education','university','college','k-12','high school','elementary','king university','vc','student','etsu','tennessee high','virginia high'],
      reply: "Bristol has solid educational infrastructure on both sides of the state line:\n\n🏫 **K-12 Schools**\n• **Sullivan County Schools** (TN side) — strong ratings\n• **Bristol Virginia Schools** — small district, community feel\n• Tennessee High School and Virginia High School — long-standing rivals\n\n🎓 **Higher Education**\n• **King University** — private liberal arts, right in Bristol TN\n• **Virginia Intermont College** — historic campus in Bristol VA\n• **ETSU** (East Tennessee State University) — 30 min in Johnson City\n• **UVA Wise** — 45 min in Wise, VA\n\nThe university presence creates both a rental demand and a skilled workforce pipeline that benefits commercial real estate."
    },

    // ── HEALTHCARE ──────────────────────────────────────────────
    { id:'healthcare', intent:'bristol',
      keys: ['hospital','healthcare','medical','doctor','clinic','emergency','bristol regional','wellmont','health system','urgent care'],
      reply: "Bristol has excellent healthcare access for a city its size:\n\n🏥 **Bristol Regional Medical Center**\n• Full-service regional hospital on the TN side\n• Level II Trauma Center\n• Part of Ballad Health system\n• One of the largest employers in the area\n\n🏥 **Valley Health / Wellmont**\n• Additional facilities on the VA side\n• Multi-specialty clinics throughout the region\n\nThe strong healthcare presence is actually a major commercial real estate driver — medical office space demand is consistently strong, and healthcare workers are a reliable tenant base for residential properties too."
    },

    // ── RESTAURANTS / THINGS TO DO ──────────────────────────────
    { id:'thingstodo', intent:'bristol',
      keys: ['restaurants','eat','food','things to do','things to see','entertainment','nightlife','brewery','bar','downtown','visit bristol','tourism','what to do'],
      reply: "Bristol has more going on than most people realize:\n\n🍽️ **Food & Drink**\n• **State Street** — walkable dining, craft cocktail bars, local spots\n• **Tennessee Mountaintop Brewery** — great local craft beer\n• Bristol's food scene has really elevated in the past 3 years\n\n🎭 **Entertainment**\n• **Hard Rock Hotel & Casino** — gaming, concerts, dining\n• **Birthplace of Country Music Museum** — world-class facility\n• **Bristol Motor Speedway** events and concerts\n\n🌿 **Outdoors**\n• **South Holston Lake** — 30 minutes away, stunning reservoir\n• **Appalachian Trail** — Bristol is close to multiple access points\n• Virginia Creeper Trail (Damascus) — 20 minutes away\n\nOverall, the quality of life is extremely high for the cost of living here."
    },

    // ── INVESTMENT / ROI ────────────────────────────────────────
    { id:'investment', intent:'market',
      keys: ['invest','investment','roi','return','cap rate','cash flow','rental income','appreciation','buy and hold','is it a good market','should i invest','good investment'],
      reply: "Bristol is genuinely one of the most compelling investment markets in the Southeast right now:\n\n📈 **The macro tailwinds:**\n• Hard Rock Casino opened 2024 — $845M annual economic impact\n• Residential values appreciated 24% over the past 3 years\n• Commercial vacancy falling fast — demand outstripping supply\n• Zero state income tax (TN side) — attractive for investors\n\n💰 **The numbers:**\n• Cap rates on local commercial: **7.5% – 10%** (well above national average)\n• Short-term rental (Airbnb) occupancy in casino corridor: **68%+**\n• Industrial lease rates up 18% YoY\n\n🔑 **The window:**\nThis market is still **underpriced relative to the economic activity**. That's the opportunity. 12–18 months from now, this conversation will cost more.\n\nWhat type of investment are you considering — residential, commercial, or land?"
    },

    // ── MARKET / PRICING DATA ───────────────────────────────────
    { id:'marketdata', intent:'market',
      keys: ['market','vacancy','cap rate','rent growth','appreciation','market trends','real estate market','commercial market','residential market','home prices','property values','market conditions'],
      reply: "Here's the Bristol/Tri-Cities market snapshot for 2026:\n\n**Commercial:**\n• Overall vacancy: dropped from 18% → 11% (12 months)\n• Casino corridor asking rents: up 22% YoY\n• Industrial: near 0% vacancy, strong rent growth\n• Retail on State Street: highest occupancy since 2008\n\n**Residential:**\n• Median home price: ~$195,000 (TN side), ~$175,000 (VA side)\n• 3-year appreciation: ~24% average\n• Days on market: 18 (down from 42 in 2021)\n• Short-term rental demand: surging near casino corridor\n\n**Investment Grade:**\n• Commercial cap rates: 7.5% – 10%\n• Industrial: near-zero vacancy\n\nFor the full data package → <a href='market-report.html' style='color:var(--gold);font-weight:700;'>Download our free 2026 Market Report</a>"
    },

    // ── MARKET REPORT ───────────────────────────────────────────
    { id:'report', intent:'report',
      keys: ['market report','2026 report','market analysis','download report','get report','free report','research','data report','tri-cities market report'],
      reply: "Our **2026 Tri-Cities Commercial Real Estate Market Report** is the most comprehensive local data available:\n\n📊 **What's inside:**\n• Hard Rock Casino economic impact analysis ($845M)\n• Corridor-by-corridor vacancy & rent trends\n• Top 5 investment opportunities for 2026\n• Cap rate benchmarks vs. comparable markets\n• 5-year price appreciation by neighborhood\n• Short-term rental demand heat map\n\n→ <a href='market-report.html' style='color:var(--gold);font-weight:700;'>Get the full report here — free</a>\n\nJust enter your name and email for instant access. No spam, no sales calls."
    },

    // ── PRICING / RATES ─────────────────────────────────────────
    { id:'pricing', intent:'pricing',
      keys: ['price','cost','rent','rate','lease rate','how much','pricing','what does it cost','monthly','per sqft','per square foot','affordable','budget'],
      reply: "Great question. Here's the honest breakdown:\n\n🏢 **Office Space (City Centre / Jamestown)**\n• All-inclusive: varies by suite size — contact us for current availability\n• Generally competitive vs. comparable Tri-Cities markets\n\n🏭 **Warehouse (1916 W. State)**\n• Industrial pricing on request — structured for your specific use\n\n🎉 **Event Venue (The Foundation)**\n• Half-day, full-day, and evening packages available\n\n🏠 **Residential (Bradley / Randolph)**\n• Priced to move — competitive with current market comps\n\n**The honest answer:** We'd rather have a 5-minute call and give you a real number than post something generic online. Want me to have someone reach out today?"
    },

    // ── HURLEY TEAM / LEADERSHIP ────────────────────────────────
    { id:'team', intent:'about',
      keys: ['team','staff','who runs','leadership','ceo','management','allen hurley','who owns','founder','principal'],
      reply: "**Hurley Enterprise LLC** is led by **Allen Hurley**, who founded the company in 2004 after recognizing the long-term development potential of the Bristol TN/VA market.\n\n20+ years deep in this region means Allen and his team have relationships with every major landlord, tenant, bank, and city official in the Tri-Cities — that local intelligence is genuinely impossible to replicate.\n\nThe team handles:\n• Commercial leasing & property management\n• Acquisitions (cash buyer, fast close)\n• Ground-up development & construction\n• Investment consulting for out-of-area buyers\n\n<a href='about.html' style='color:var(--gold);font-weight:700;'>Meet the full team →</a>"
    },

    // ── ABOUT HURLEY ────────────────────────────────────────────
    { id:'about', intent:'about',
      keys: ['who are you','about hurley','about you','who is hurley','tell me about','your company','how long','since when','history','experience','background','your business'],
      reply: "**Hurley Enterprise LLC** has been building, leasing, and acquiring real estate in the Tri-Cities since **2004** — over 20 years of hyperlocal expertise.\n\n**What makes us different:**\n• 🏘️ We own and manage the properties we lease — no middleman\n• 💵 We buy with cash — fastest closes in the market\n• 🏗️ We're active developers, not just brokers\n• 📊 We publish the region's best market data (free)\n• 📞 Direct access to decision-makers — no runaround\n\nWe're not a national chain. Every deal goes through people who've lived and worked in Bristol their entire careers.\n\n<a href='about.html' style='color:var(--gold);font-weight:700;'>Learn more about us →</a>"
    },

    // ── SERVICES ────────────────────────────────────────────────
    { id:'services', intent:'about',
      keys: ['services','what do you do','what do you offer','help with','can you help','capabilities','what can you do for me'],
      reply: "Here's everything Hurley Enterprise offers:\n\n🏢 **Commercial Leasing** — office, retail, warehouse, event venue\n💵 **Property Acquisition** — cash buyer, any condition, fast close\n🏗️ **Development & Construction** — ground-up or renovation\n🔧 **Tenant Improvement** — custom build-outs for your business\n🏠 **Residential Investment** — curated income property portfolio\n📊 **Market Intelligence** — free reports and investment analysis\n🤝 **1031 Exchange Guidance** — help identifying replacement properties\n\nWhich of these is most relevant to what you're working on?"
    },

    // ── CONTACT / PHONE ─────────────────────────────────────────
    { id:'contact', intent:'contact',
      keys: ['phone','call','number','contact','reach','email','message','get in touch','talk to','speak with','human','person','representative'],
      reply: "Here's how to reach the Hurley Enterprise team:\n\n• 📞 **Call/Text:** <a href='tel:+14237427219' style='color:var(--gold);font-weight:700;'>423-742-7219</a>\n• 📧 **Email:** <a href='mailto:info@hurleyenterprisellc.com' style='color:var(--gold);font-weight:700;'>info@hurleyenterprisellc.com</a>\n• 📋 **Contact form:** <a href='contact.html' style='color:var(--gold);font-weight:700;'>Click here</a>\n• 📍 **Walk in:** 100 5th St., Suite 2W, Bristol, TN 37620\n\nOr just tell me what you need — I can capture your info right here and have the right person call you."
    },

    // ── OFFICE HOURS ────────────────────────────────────────────
    { id:'hours', intent:'contact',
      keys: ['hours','open','office hours','when are you','when can i call','business hours','what time','closed','weekend'],
      reply: "The office is open **Monday – Friday, 8:30 AM – 5:00 PM Eastern**.\n\nI'm available 24/7 right here — ask me anything anytime.\n\nFor urgent matters outside business hours, you can text <a href='tel:+14237427219' style='color:var(--gold);font-weight:700;'>423-742-7219</a> and the team typically responds same day."
    },

    // ── LOCATION / DIRECTIONS ───────────────────────────────────
    { id:'location', intent:'contact',
      keys: ['location','address','where are you','where is your office','directions','find you','your office','where located','come in','walk in'],
      reply: "📍 **Hurley Enterprise LLC**\n100 5th Street, Suite 2W\nBristol, TN 37620\n\nRight in the heart of downtown Bristol — the **Birthplace of Country Music** district. Free street parking available on 5th Street.\n\nWe're in **City Centre**, our own flagship building — which happens to be one of our best leasing options! If you stop by for a meeting, you'll see firsthand why our tenants love it."
    },

    // ── SERVICE AREA ────────────────────────────────────────────
    { id:'area', intent:'market',
      keys: ['kingsport','johnson city','tri cities','tri-cities','service area','abingdon','virginia','where do you','what areas','region','coverage','how far','greeneville','elizabethton','norton va'],
      reply: "We cover the **entire Tri-Cities region and beyond**:\n\n• 🏙️ **Bristol TN & VA** — home base, deepest relationships & inventory\n• 🏭 **Kingsport, TN** — strong industrial and healthcare corridor\n• 🎓 **Johnson City, TN** — ETSU market, growing tech sector\n• 🌳 **Abingdon, VA** — charming, growing, undervalued market\n• ⛰️ **Marion & Wytheville, VA** — emerging rural opportunity zones\n• 🏔️ **Greeneville / Morristown, TN** — expanding coverage\n\nEvery sub-market has different dynamics right now. Which area are you most focused on?"
    },

    // ── TOUR REQUEST ────────────────────────────────────────────
    { id:'tour', intent:'tour',
      keys: ['tour','schedule a tour','show me','visit','walk through','walk-through','see the space','showing','in person','can i see','view'],
      reply: "I'd love to get a tour set up! 🏢\n\nOur team usually accommodates **next-day showings** — we try to make it as easy as possible.\n\nTo lock in a time: **what's your name and the best phone number to reach you?**\n\n(Or call directly: <a href='tel:+14237427219' style='color:var(--gold);font-weight:700;'>423-742-7219</a>)"
    },

    // ── OFFER / QUOTE ───────────────────────────────────────────
    { id:'quote', intent:'quote',
      keys: ['quote','get a quote','give me a quote','what would you offer','what can you offer','make an offer','offer on my property','cash offer on','value my property','appraise'],
      reply: "Happy to work up numbers for you. To get **accurate figures fast**, our team needs a quick conversation.\n\n**What's your name and phone number?** Someone from our acquisition or leasing team will reach out within a few hours — usually same day, often faster.\n\n(Or call us direct: <a href='tel:+14237427219' style='color:var(--gold);font-weight:700;'>423-742-7219</a>)"
    },

    // ── DEVELOPMENT CONSTRUCTION PAGE ───────────────────────────
    { id:'devpage', intent:'develop',
      keys: ['development page','development construction','build for me','build to suit','custom build','new development','want to build'],
      reply: "Our <a href='development-construction.html' style='color:var(--gold);font-weight:700;'>Development & Construction page</a> covers our full capabilities:\n\n• Ground-up commercial builds\n• Historic building adaptive reuse\n• Tenant improvement & custom fit-out\n• Site development & permitting\n• Commercial renovation\n\nWe've completed projects across the full spectrum — small suite renovations to multi-million dollar complex developments. What are you trying to build?"
    },

    // ── POPULATION / DEMOGRAPHICS ───────────────────────────────
    { id:'demographics', intent:'bristol',
      keys: ['population','demographic','how many people','residents','how big is','demographics','households','median income','age','who lives'],
      reply: "Bristol by the numbers:\n\n👥 **Population**\n• Bristol TN: ~28,500\n• Bristol VA: ~17,000\n• Combined Bristol MSA: ~47,000\n• Kingsport-Bristol-Bristol MSA: ~300,000\n\n💰 **Income & Economy**\n• Median household income: ~$42,000 (TN) / ~$38,000 (VA)\n• Cost of living index: ~82 (US average = 100) — very affordable\n• Unemployment rate: below state averages for both TN and VA\n\n🏠 **Housing**\n• Median home value: ~$195K TN / ~$175K VA\n• High homeownership rates — stable community\n\nThe affordability factor is one of the big drivers of in-migration from larger MSAs right now."
    },

    // ── COST OF LIVING ──────────────────────────────────────────
    { id:'cofliving', intent:'bristol',
      keys: ['cost of living','affordable','cheap','expensive','live here','moving to bristol','relocate','relocation'],
      reply: "Bristol has a **cost of living roughly 18% below the national average** — which is remarkable given the quality of life:\n\n• 🏠 Median home price ~$185,000 (vs. $400K+ national average)\n• 🛒 Groceries, utilities, services all below national benchmark\n• 🚗 Easy commutes — this is not a traffic-jam city\n• 🏥 Excellent healthcare access at local prices\n\nFor businesses, this translates to:\n• Lower labor costs than comparable metros\n• Easier employee recruitment & retention\n• Commercial lease rates well below what you'd pay in Knoxville, Roanoke, or Charlotte\n\nIt's genuinely one of the best-value markets in the Southeast."
    },

    // ── SOUTH HOLSTON LAKE / OUTDOORS ───────────────────────────
    { id:'outdoors', intent:'bristol',
      keys: ['south holston','lake','hiking','outdoors','nature','appalachian trail','virginia creeper','trail','fishing','camping','mountain','recreation'],
      reply: "Bristol's outdoor recreation is exceptional and underrated:\n\n🏞️ **South Holston Lake** — 30 minutes away\n• 7,000+ acre reservoir in the mountains\n• World-class trout fishing (one of the best tailwaters on the East Coast)\n• Boating, paddleboarding, lakeside cabins\n\n🥾 **Hiking & Trails**\n• **Appalachian Trail** access within 45 minutes\n• **Virginia Creeper Trail** (Damascus) — 20 min away, iconic rail trail\n• Iron Mountain Trail system nearby\n\n🏔️ **Mountain Access**\n• Cherokee National Forest borders the region\n• Multiple waterfalls, overlooks within an hour\n\nThis outdoor quality of life is a big draw for remote workers and retirees relocating to the area — which is driving residential demand."
    },

    // ── 1031 EXCHANGE ───────────────────────────────────────────
    { id:'exchange1031', intent:'market',
      keys: ['1031','1031 exchange','exchange','like kind','replacement property','tax deferred','capital gains','defer taxes'],
      reply: "**1031 Exchanges** are something we work with regularly — and Bristol/Tri-Cities is a great target market for replacement properties:\n\n• 🏭 Industrial properties with strong cap rates (7.5%–10%)\n• 🏢 Commercial parcels in the casino corridor appreciating fast\n• 🏠 Residential portfolios with strong rental demand\n\nWe've helped multiple out-of-market investors identify and close on replacement properties within the 45/180-day exchange window.\n\n**The key things we need from you:** your equity amount, preferred property type, and timeline. Want to have a quick conversation with our team?"
    },

    // ── BLOG / INSIGHTS ─────────────────────────────────────────
    { id:'blog', intent:'about',
      keys: ['blog','articles','insights','read','seo','news','updates','latest','research','content'],
      reply: "We publish **in-depth local market articles** on our blog — the best free resource on Bristol real estate:\n\n📰 **Recent articles:**\n• *Hard Rock Casino Bristol: Impact on Commercial Real Estate*\n• *How to Sell Your House Fast in Bristol VA*\n• *Office Space in Downtown Bristol TN: 2026 Tenant's Guide*\n\n→ <a href='blog.html' style='color:var(--gold);font-weight:700;'>Read all articles here</a>\n\nThese aren't generic content — they're written by people who live, work, and invest in this market every day."
    },

    // ── THANK YOU / POSITIVE FEEDBACK ──────────────────────────
    { id:'thanks', intent:'greet',
      keys: ['thank','thanks','thx','appreciate','great','perfect','awesome','helpful','love it','nice','wonderful','brilliant'],
      reply: "Happy to help! 😊 That's exactly what I'm here for. If anything else comes up — properties, market questions, Bristol trivia, or anything Tri-Cities — just ask.\n\nAnd if you ever want to talk to a real person on the Hurley team, just say the word."
    },

    // ── WEATHER / CLIMATE ───────────────────────────────────────
    { id:'weather', intent:'bristol',
      keys: ['weather','climate','temperature','snow','rain','seasons','hot','cold','humid','winter','summer','spring','fall'],
      reply: "Bristol has a **four-season Appalachian climate** — genuinely pleasant most of the year:\n\n🌸 **Spring** — mild, beautiful, 50s–70s°F\n☀️ **Summer** — warm but not brutal (mostly 75–88°F), low humidity vs. coastal cities\n🍂 **Fall** — spectacular mountain foliage, 50s–70s°F\n❄️ **Winter** — occasional snow (usually 6–12 inches/year total), 30s–45°F avg\n\nNo hurricanes, no extreme heat, no severe flood risk. It's one of the genuinely comfortable climates in the East — which is part of why retirees and remote workers are moving here in numbers."
    },

    // ── DISTANCE FROM OTHER CITIES ──────────────────────────────
    { id:'distance', intent:'bristol',
      keys: ['far from','how far','drive to','distance','knoxville','nashville','charlotte','roanoke','drive time','how long to get','near','close to'],
      reply: "Bristol's location is genuinely one of its strengths — it's close to a lot:\n\n• 🏙️ **Knoxville, TN** — 110 miles (~1.5 hrs)\n• 🏙️ **Roanoke, VA** — 130 miles (~2 hrs)\n• 🎸 **Nashville, TN** — 320 miles (~4.5 hrs)\n• 🏛️ **Charlotte, NC** — 200 miles (~3 hrs)\n• ✈️ **Tri-Cities Airport (TRI)** — 15 minutes (direct flights to major hubs)\n• 🌆 **Johnson City / Kingsport** — 20–30 minutes\n\nFor businesses, the location offers access to multiple metro markets while maintaining the cost structure of a smaller city."
    },

    // ── AIRBNB / SHORT TERM RENTAL ──────────────────────────────
    { id:'airbnb', intent:'residential',
      keys: ['airbnb','vrbo','short term rental','short-term','vacation rental','str','rental income','host','nightly rate'],
      reply: "Short-term rentals (Airbnb/VRBO) are booming in Bristol right now — driven by the Hard Rock Casino:\n\n📊 **The numbers:**\n• Casino-adjacent properties: **68%+ average occupancy**\n• Average nightly rate: **$120–$185** for a well-positioned 3BR\n• Race weekends (Bristol Motor Speedway): **$400–$800/night**\n• NASCAR events sell out **12+ months in advance**\n\nBristol has become one of the top STR markets in the Southeast for these reasons — and we have **casino-adjacent residential properties** that are perfectly positioned for exactly this use.\n\nWant to see the Bradley Street portfolio?"
    },

    // ── RILEY SELF / WHAT CAN YOU DO ────────────────────────────
    { id:'whatcanriley', intent:'greet',
      keys: ['what can you do','what do you know','what are you','who are you riley','are you ai','are you a bot','are you real','chatbot','assistant','help me with'],
      reply: "I'm **Riley** — Hurley Enterprise's AI-powered local market guide. 🤖\n\nHere's what I actually know:\n\n🏢 **Every property** in our portfolio — sizes, features, pricing\n🏙️ **Bristol TN/VA** history, demographics, economy, things to do\n🎰 **Hard Rock Casino** market impact and investment thesis\n📈 **Market data** — vacancy rates, cap rates, appreciation trends\n💵 **Buying & selling** — cash offers, as-is acquisitions, timelines\n🏗️ **Development** — construction, renovation, tenant improvements\n🎵 **Country music history**, Bristol Motor Speedway, outdoors — you name it\n\nAsk me anything. If I genuinely don't know, I'll tell you and connect you with our team."
    },

    // ── FINANCING / MORTGAGE ────────────────────────────────────
    { id:'financing', intent:'market',
      keys: ['financing','mortgage','loan','lender','bank','sba','commercial loan','down payment','interest rate','finance','fund','money'],
      reply: "On financing, here's what's helpful to know in this market:\n\n🏦 **For commercial leases** — no financing needed, just your business and lease terms\n\n🏦 **For purchases (investment/owner-occupied):**\n• Local banks often have better commercial terms than nationals here\n• **SBA 504 loans** are excellent for owner-occupied commercial\n• **USDA Business programs** available for some rural-adjacent parcels\n• For our cash acquisitions — we don't require financing from you at all\n\n🏦 **For residential investors:**\n• DSCR loans (based on rental income) work well in this market\n• Hard money available locally for quick closes\n\nWe can connect you with trusted local lenders if that's helpful. Want to know more about any of these options?"
    },

    // ── ZONING / PERMITS ────────────────────────────────────────
    { id:'zoning', intent:'develop',
      keys: ['zoning','permit','planning','city ordinance','b-2','commercial zone','mixed use','rezoning','building code','variance'],
      reply: "Zoning in the Bristol market is business-friendly, especially for commercial and mixed-use:\n\n• **Bristol TN** — B-2 and B-3 commercial zones cover most of downtown and State Street\n• **Bristol VA** — Similar B-2/commercial designations with active City Council support for development\n• Both cities have streamlined permitting for downtown redevelopment\n• Historic Preservation overlay districts exist in parts of downtown — but we know how to work within them\n\nWe've navigated permitting on dozens of projects and have strong relationships with both planning departments. If you're looking at a specific parcel, we can usually tell you the zoning situation quickly.\n\nWhat kind of project are you considering?"
    },

  ];

  /* ── Context memory & lead capture ─────────────────────────── */
  const ctx = {
    intent:        null,
    askedName:     false,
    askedPhone:    false,
    capturedName:  null,
    capturedPhone: null,
    messageCount:  0,
    lastTopic:     null,
    topicHistory:  [],
  };

  /* ── Fallback — topic-aware suggestions ─────────────────────── */
  const SUGGEST_TOPICS = [
    "Our available properties",
    "Hard Rock Casino market impact",
    "Bristol TN/VA city overview",
    "Investment opportunities",
    "Sell my property fast",
  ];

  function fallbackReply() {
    const suggestions = SUGGEST_TOPICS
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(t => `• **${t}**`)
      .join('\n');
    const varies = [
      `I may not have a specific answer for that, but I know a lot about Bristol and Hurley Enterprise — try one of these:\n\n${suggestions}\n\nOr call the team directly: <a href='tel:+14237427219' style='color:var(--gold);font-weight:700;'>423-742-7219</a>`,
      `That's a bit outside my knowledge base — but I can probably help with something related. Here's what I know well:\n\n${suggestions}\n\nOr I can connect you with the team right now if you share your name and number.`,
      `Good question — the team would have a better answer than I do on that specific point. You can reach them at <a href='tel:+14237427219' style='color:var(--gold);font-weight:700;'>423-742-7219</a>.\n\nIn the meantime, here are topics I have solid answers on:\n\n${suggestions}`,
    ];
    return varies[ctx.messageCount % varies.length];
  }

  /* ── Context-aware chips ────────────────────────────────────── */
  const CHIPS_DEFAULT = [
    "What spaces are available?",
    "Hard Rock Casino area?",
    "Sell my property fast",
    "About Bristol TN/VA",
    "Get the market report",
  ];

  const CHIPS_BY_INTENT = {
    lease:      ["City Centre details","628 State St","Jamestown @ Shelby","Warehouse space?","Schedule a tour"],
    sell:       ["How fast can you close?","No repairs needed?","What's my property worth?","Get a cash offer","Call me back"],
    develop:    ["Ground-up construction","Historic renovation","Tenant improvement","Development timeline","Get a quote"],
    market:     ["Casino corridor listings","Vacancy rate data","Get market report","Investment ROI?","1031 Exchange?"],
    residential:["Bradley St portfolio","Randolph St homes","Airbnb returns?","Casino proximity?","Schedule a showing"],
    tour:       ["Call 423-742-7219","City Centre details","628 State St","Other properties","Maybe another time"],
    contact:    ["Call 423-742-7219","Send a message","Office hours","Our location","Start a chat"],
    venue:      ["Capacity details","Pricing?","Corporate packages","Book the Foundation","Other properties"],
    industrial: ["45,500 sqft warehouse","Loading dock specs","Office portion?","Investment potential","Schedule a tour"],
    bristol:    ["Hard Rock Casino impact","Bristol Motor Speedway","Birthplace of Country Music","Investment market","Things to do"],
    about:      ["Meet the team","Available properties","Development capabilities","Contact us","Market report"],
    pricing:    ["City Centre rates","Warehouse pricing","Get a quote","Schedule a tour","Market report"],
    report:     ["Download free report","Investment opportunities","Market data","Casino corridor","Schedule a call"],
  };

  const CHIPS_CAPTURE_NAME  = ["My name is…", "📞 Call me instead", "Maybe later"];
  const CHIPS_CAPTURE_PHONE = ["📞 Call 423-742-7219", "Skip for now", "Use contact form"];

  function getChips() {
    if (ctx.askedName  && !ctx.capturedName)  return CHIPS_CAPTURE_NAME;
    if (ctx.askedPhone && !ctx.capturedPhone) return CHIPS_CAPTURE_PHONE;
    return CHIPS_BY_INTENT[ctx.intent] || CHIPS_DEFAULT;
  }

  /* ── NLP: score-based matching ──────────────────────────────── */
  const NAV_PATTERN = /^(tell|show|what|how|where|who|when|can|is|are|do|does|i|get|give|help|about|more|yes|no|maybe|sure|ok|okay|schedule|book|view|see|list|find|info|details|pricing|price|available|please|the|a|an|want|need|looking)/i;

  function getReply(q) {
    const lower = q.toLowerCase().replace(/[^\w\s]/g, ' ');
    const words = lower.split(/\s+/);

    // ── Lead capture flow ────────────────────────────────────────
    if (ctx.askedName && !ctx.capturedName) {
      const potential = q.trim();
      if (potential.length > 1 && !NAV_PATTERN.test(potential)) {
        ctx.capturedName = potential;
        ctx.askedName    = false;
        ctx.askedPhone   = true;
        return `Nice to meet you, **${ctx.capturedName.split(' ')[0]}**! 😊 What's the best phone number to reach you? We'll have someone call within a few hours — no pressure.`;
      }
      if (NAV_PATTERN.test(potential)) {
        ctx.askedName = false;
      }
    }

    if (ctx.askedPhone && !ctx.capturedPhone) {
      const phoneMatch = q.replace(/\D/g, '');
      if (phoneMatch.length >= 7) {
        ctx.capturedPhone = q.trim();
        ctx.askedPhone    = false;
        saveLead();
        return `Perfect — got it! ✅ **${ctx.capturedName ? ctx.capturedName.split(' ')[0] : 'Our team'}** will reach out at **${ctx.capturedPhone}** shortly.\n\nAnything else I can help you with?`;
      } else if (!NAV_PATTERN.test(q.trim())) {
        return "Just need a phone number to pass along — or call us direct: <a href='tel:+14237427219' style='color:var(--gold);font-weight:700;'>423-742-7219</a>";
      } else {
        ctx.askedPhone = false;
      }
    }

    // ── Score every KB entry ─────────────────────────────────────
    let best = null, bestScore = 0;
    for (const entry of KB) {
      let score = 0;
      for (const key of entry.keys) {
        if (lower.includes(key)) {
          score += key.split(' ').length * 3;  // phrase bonus
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
      ctx.topicHistory.push(best.id);

      if (['tour','quote'].includes(best.intent) && !ctx.capturedName) {
        ctx.askedName = true;
      }

      const reply = Array.isArray(best.replies)
        ? best.replies[Math.floor(Math.random() * best.replies.length)]
        : best.reply;
      return reply;
    }

    // ── Contextual follow-ups ────────────────────────────────────
    if (ctx.lastTopic) {
      if (/\b(yes|sure|more|details|tell me|go ahead|sounds good|interested|absolutely|definitely|love to|please)\b/.test(lower)) {
        ctx.askedName = true;
        return `Great! I'll have someone reach out with full details. **What's your name?**`;
      }
      if (/\b(no|not now|maybe later|pass|later|not interested)\b/.test(lower)) {
        return `No problem at all! I'm here whenever you're ready. Feel free to browse all our listings at <a href='for-sale-lease.html' style='color:var(--gold);font-weight:700;'>for-sale-lease.html</a> anytime. Anything else I can tell you about Bristol or the Tri-Cities market?`;
      }
    }

    // ── Thank you ────────────────────────────────────────────────
    if (/\b(thank|thanks|thx|appreciate|great|perfect|awesome|helpful)\b/.test(lower)) {
      return `Happy to help! 😊 That's what I'm here for — ask anything else about Bristol, properties, or the market anytime.`;
    }

    // ── FALLBACK ─────────────────────────────────────────────────
    ctx.messageCount++;
    return fallbackReply();
  }

  /* ── Save captured lead ─────────────────────────────────────── */
  function saveLead() {
    const topicMap = {
      citycentre:'City Centre office suite inquiry',
      state628:'628 State Street restaurant/bar space',
      jamestown:'Jamestown @ Shelby office space',
      foundation:'The Foundation event venue',
      cocacola:'1916 W. State St warehouse/industrial',
      centerpoint:'Center Point Commonwealth Ave',
      bradley:'Bradley Street residential portfolio',
      randolph:'Randolph Street homes',
      webuy:'Cash offer / sell property inquiry',
      develop:'Development / construction project',
      casino:'Hard Rock Casino corridor inquiry',
      listings:'General property listings inquiry',
      tour:'Tour request',
      quote:'Offer / quote request',
      investment:'Investment inquiry',
      airbnb:'Short-term rental / Airbnb inquiry',
      exchange1031:'1031 exchange replacement property',
    };
    const lead = {
      id:          'riley_' + Date.now(),
      source:      'riley',
      temperature: 'hot',
      status:      'new',
      timestamp:   new Date().toISOString(),
      contact:     {
        firstName: ctx.capturedName ? ctx.capturedName.split(' ')[0] : '',
        lastName:  ctx.capturedName ? ctx.capturedName.split(' ').slice(1).join(' ') : '',
        phone:     ctx.capturedPhone || '',
        email:     ''
      },
      notes: `Riley chatbot lead — ${topicMap[ctx.lastTopic] || 'General inquiry'}. Topics discussed: ${ctx.topicHistory.slice(-3).join(', ')||'general'}. Intent: ${ctx.intent||'unknown'}.`
    };
    try {
      const existing = JSON.parse(localStorage.getItem('hurley_leads') || '[]');
      existing.unshift(lead);
      localStorage.setItem('hurley_leads', JSON.stringify(existing));
    } catch(e) { console.warn('Lead save failed', e); }
  }

  /* ── Build DOM ──────────────────────────────────────────────── */
  function buildUI() {
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
        <div><div class="pop-card-name">Riley</div><div class="pop-card-role">Hurley Enterprise Local Expert</div></div>
      </div>
      <p class="pop-card-msg">👋 Hi! I'm Riley — ask me anything about Bristol TN/VA properties, the Hard Rock Casino market, or selling your property fast.</p>
      <div class="pop-card-actions">
        <button class="pop-card-btn pop-card-btn--primary" id="pop-card-open">Chat with Me →</button>
        <button class="pop-card-btn pop-card-btn--dismiss" id="pop-card-dismiss">Maybe Later</button>
      </div>`;

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

    const win = document.createElement('div');
    win.id = 'chat-window';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'Chat with Riley — Hurley Enterprise');
    win.innerHTML = `
      <div class="chat-header">
        <div class="chat-avatar">R</div>
        <div class="chat-header-info">
          <div class="chat-name">Riley <span style="font-size:0.6rem;font-weight:600;color:var(--gold);vertical-align:middle;margin-left:4px;background:rgba(201,168,76,0.15);padding:0.1em 0.5em;border-radius:999px;">AI</span></div>
          <div class="chat-status"><span class="chat-status-dot"></span>Bristol TN/VA Expert · Online</div>
        </div>
        <button class="chat-header-close" id="chat-close" aria-label="Close chat">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="chat-messages" id="chat-messages" aria-live="polite" aria-label="Chat messages"></div>
      <div class="chat-suggestions" id="chat-chips"></div>
      <div class="chat-input-row">
        <input type="text" id="chat-input" placeholder="Ask about properties, Bristol, the casino market…" autocomplete="off" autocorrect="off" autocapitalize="sentences" enterkeyhint="send" maxlength="200">
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

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => {
        if (win.classList.contains('open')) {
          const offset = window.innerHeight - window.visualViewport.height;
          win.style.transform = offset > 50 ? `translateY(-${offset}px) scale(1)` : '';
        }
      });
    }

    function greet() {
      addMsg("Hi! I'm **Riley** 👋 — your Hurley Enterprise local expert. How can I help you?", 'bot');
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

    function typingDelay(reply) {
      const words = reply.replace(/<[^>]+>/g, '').split(' ').length;
      return Math.min(500 + words * 16, 2000) + Math.random() * 250;
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
