// api/riley.js — Vercel serverless function
// Proxies Riley chatbot messages to Gemini 2.0 Flash
// API key stays server-side; never exposed to the browser

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, history = [] } = req.body || {};
  if (!message) return res.status(400).json({ error: 'No message provided' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  const SYSTEM_PROMPT = `You are Riley, the friendly and knowledgeable AI assistant for Hurley Enterprise LLC — Bristol TN/VA's premier commercial real estate and development firm since 2004.

Your personality: warm, confident, locally fluent, helpful. Always professional but never stiff.

ABOUT HURLEY ENTERPRISE:
- Founded 2004 by J. Allen Hurley II (CEO & President)
- 20+ years serving Bristol TN/VA and the Tri-Cities region
- Manages 1M+ sq ft of commercial and residential property
- Services: commercial leasing, property sales, ground-up development, tenant improvement, we-buy-property (cash offers)
- Office: 100 5th St., Suite 2W, Bristol TN 37620
- Phone: 423-742-7219
- Email: info@hurleyenterprisellc.com
- Hours: Mon–Fri 8:30 AM–5:00 PM Eastern

CURRENT AVAILABLE SPACES:
1. City Centre Professional Office Suites — 100 5th St Bristol TN. 120–6,000 sqft. All-inclusive rent (power, water, cleaning, security, fitness center). Class A downtown address.
2. 628 State Street (Kress Building) — 8,500 sqft restaurant/bar/entertainment/retail. Historic downtown Bristol TN. Fully built out, premium location.
3. Jamestown at Shelby — 815 Shelby St Bristol TN. Office suites 1,200–4,500 sqft. No CAM fees.
4. Foundation Event Facility — Event venue, bookings open. Bristol TN.
5. Centre Point — Commonwealth Ave Bristol VA, Hard Rock Casino corridor. Prime retail/restaurant.
6. Former Coca-Cola Building — 1916 W State St Bristol VA. 45,500 sqft warehouse + 8,000 sqft office. Investment or owner-user.

BRISTOL TN/VA MARKET INTEL:
- Hard Rock Hotel & Casino Bristol opened 2024 — transforming the regional economy
- Bristol Motor Speedway nearby — major events driver
- Dual-state market: Tennessee AND Virginia sides of Bristol
- Tri-Cities region: Bristol, Kingsport, Johnson City
- Growing demand for office and retail space near the casino corridor
- Low vacancy rates in Class A downtown office

KEY RULES:
- Always encourage them to call 423-742-7219 or visit contact page for tours/offers
- If they want to sell their property, direct them to the "We Buy Property" page — Hurley makes fast cash offers
- Never make up prices or specific lease rates — say "contact us for current pricing"
- Keep responses concise (2–4 sentences max unless they need more detail)
- If asked something you don't know, say so honestly and offer to connect them with Allen's team
- You can answer general questions about Bristol TN/VA history, economy, neighborhoods, things to do`;

  // Build Gemini conversation format
  const contents = [];

  // Add history (alternating user/model)
  for (const turn of history.slice(-8)) { // last 8 turns max
    if (turn.role === 'user') {
      contents.push({ role: 'user', parts: [{ text: turn.text }] });
    } else if (turn.role === 'bot') {
      contents.push({ role: 'model', parts: [{ text: turn.text }] });
    }
  }

  // Add current message
  contents.push({ role: 'user', parts: [{ text: message }] });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
            topP: 0.9,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          ]
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini API error:', err);
      return res.status(502).json({ error: 'Gemini API error', detail: err });
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure about that — give Allen's team a call at 423-742-7219 and they'll sort you out!";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Riley proxy error:', err);
    return res.status(500).json({ error: 'Internal error', detail: err.message });
  }
}
