// api/lease-bot.js — Vercel Serverless Function
// Public Intake & AI Lead Qualification Engine for Hurley Enterprise

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lwwqihohuzjttwblizvg.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getHeaders() {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };
}

// Helper: Parse budget numbers from strings like "$5,000/mo", "4000-6000", "8k"
function parseMonthlyBudget(budgetStr) {
  if (!budgetStr) return 0;
  const clean = budgetStr.toLowerCase().replace(/,/g, '');
  
  // match patterns like 8k or 8000
  const kMatch = clean.match(/(\d+(?:\.\d+)?)\s*k/);
  if (kMatch) return parseFloat(kMatch[1]) * 1000;

  const numMatch = clean.match(/\$?(\d{3,7})/);
  if (numMatch) return parseInt(numMatch[1], 10);

  return 0;
}

// Rule-based heuristic scoring engine (0 to 100 points)
function calculateHeuristicScore(lead) {
  let score = 0;
  const reasoning = [];

  // 1. Budget Score (0-40 pts)
  const monthlyBudget = parseMonthlyBudget(lead.budget);
  if (monthlyBudget >= 8000) {
    score += 40;
    reasoning.push('Enterprise monthly budget ($8k+) [40/40]');
  } else if (monthlyBudget >= 4000) {
    score += 35;
    reasoning.push('Strong commercial budget ($4k-$8k) [35/40]');
  } else if (monthlyBudget >= 2000) {
    score += 25;
    reasoning.push('Standard commercial budget ($2k-$4k) [25/40]');
  } else if (monthlyBudget > 0) {
    score += 15;
    reasoning.push('Entry-level budget [15/40]');
  } else {
    score += 10;
    reasoning.push('Budget not specified [10/40]');
  }

  // 2. Timeline Score (0-30 pts)
  const timeline = (lead.timeline || '').toLowerCase();
  if (timeline.includes('asap') || timeline.includes('immediately') || timeline.includes('30 days') || timeline.includes('now')) {
    score += 30;
    reasoning.push('Immediate move-in intent [30/30]');
  } else if (timeline.includes('1-3') || timeline.includes('month') || timeline.includes('soon')) {
    score += 20;
    reasoning.push('1-3 month timeframe [20/30]');
  } else if (timeline.includes('exploring') || timeline.includes('planning')) {
    score += 10;
    reasoning.push('Exploring options [10/30]');
  } else {
    score += 5;
    reasoning.push('Timeline unspecified [5/30]');
  }

  // 3. Contact Completeness (0-20 pts)
  const hasPhone = Boolean(lead.phone && lead.phone.replace(/\D/g, '').length >= 10);
  const hasEmail = Boolean(lead.email && lead.email.includes('@'));
  if (hasPhone && hasEmail) {
    score += 20;
    reasoning.push('Full verified contact details (Phone + Email) [20/20]');
  } else if (hasPhone) {
    score += 12;
    reasoning.push('Direct phone number provided [12/20]');
  } else if (hasEmail) {
    score += 8;
    reasoning.push('Email provided without phone [8/20]');
  }

  // 4. Specific Requirements / Business Notes (0-10 pts)
  const notes = (lead.additional_info || lead.notes || '').trim();
  if (notes.length > 50) {
    score += 10;
    reasoning.push('Detailed business specifications provided [10/10]');
  } else if (notes.length > 10) {
    score += 5;
    reasoning.push('Basic requirements stated [5/10]');
  }

  // Score label
  let scoreLabel = 'Prospect Lead';
  if (score >= 70) scoreLabel = 'Verified Lead';
  else if (score >= 40) scoreLabel = 'MQL';
  else if (score <= 10 && (!hasPhone && !hasEmail)) scoreLabel = 'Potential Spam';

  // Whale detection
  let isWhale = false;
  let whaleTier = null;
  const whaleKeywords = [];

  if (monthlyBudget >= 8000) {
    isWhale = true;
    whaleTier = 'gold';
    whaleKeywords.push('$8k+/mo budget', 'Enterprise');
  } else if (monthlyBudget >= 4000) {
    isWhale = true;
    whaleTier = 'silver';
    whaleKeywords.push('$4k+/mo budget', 'High-value');
  }

  return {
    score,
    scoreLabel,
    reasoning: reasoning.join(' | '),
    isWhale,
    whaleTier,
    whaleKeywords
  };
}

// AI Scoring via Gemini if configured
async function runAIScoring(lead) {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) return null;

  try {
    const prompt = `You are the Commercial Real Estate Lead Evaluator for Hurley Enterprise LLC.
Analyze this inbound commercial inquiry:
Name: ${lead.name || 'Unknown'}
Email: ${lead.email || 'None'}
Phone: ${lead.phone || 'None'}
Space Type: ${lead.space_type || 'Office'}
Budget: ${lead.budget || 'Not specified'}
Timeline: ${lead.timeline || 'Exploring options'}
Team Size: ${lead.team_size || 'Solo'}
Notes: ${lead.additional_info || 'None'}

Return ONLY a JSON object:
{
  "score": number (0-100),
  "scoreLabel": "Verified Lead" (70-100) | "MQL" (40-69) | "Prospect Lead" (1-39) | "Potential Spam",
  "reasoning": "brief explanation",
  "isWhale": boolean,
  "whaleTier": "gold" (budget >= $8000/mo) | "silver" (budget >= $4000/mo) | null
}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, responseMimeType: 'application/json' }
      })
    });

    if (!res.ok) return null;
    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(rawText);
  } catch (e) {
    console.warn('Gemini qualification fallback to heuristic:', e.message);
    return null;
  }
}

// Optional instant email notification via Resend
async function dispatchNotificationEmail(lead, scoring) {
  const resendKey = process.env.RESEND_API_KEY;
  const recipient = process.env.NOTIFICATION_EMAIL || 'jazmin@hurleyenterprisellc.com';
  if (!resendKey) return;

  try {
    const whaleBadge = scoring.isWhale ? `🔥 ${scoring.whaleTier.toUpperCase()} WHALE LEAD` : '';
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Hurley Enterprise Leads <leads@hurleyenterprisellc.com>',
        to: [recipient],
        subject: `${whaleBadge ? whaleBadge + ' — ' : ''}New Inbound Lead: ${lead.name} (${scoring.scoreLabel})`,
        html: `
          <div style="font-family:sans-serif;line-height:1.6;color:#222;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;padding:24px;">
            <h2 style="color:#C9A84C;margin-top:0;">Hurley Enterprise — New Lead Received</h2>
            <p><strong>Name:</strong> ${lead.name}</p>
            <p><strong>Phone:</strong> <a href="tel:${lead.phone}">${lead.phone || 'N/A'}</a></p>
            <p><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email || 'N/A'}</a></p>
            <p><strong>Desired Space:</strong> ${lead.space_type || 'Office'}</p>
            <p><strong>Budget:</strong> ${lead.budget || 'N/A'}</p>
            <p><strong>Timeline:</strong> ${lead.timeline || 'N/A'}</p>
            <hr style="border:0;border-top:1px solid #eee;margin:16px 0;" />
            <p><strong>AI Score:</strong> <span style="font-size:1.2em;font-weight:bold;color:${scoring.score >= 70 ? '#3ECF8E' : '#C9A84C'};">${scoring.score}/100 (${scoring.scoreLabel})</span></p>
            ${scoring.isWhale ? `<p style="background:#fff3cd;padding:8px;border-radius:4px;color:#856404;font-weight:bold;">🚨 Whale Status: ${scoring.whaleTier.toUpperCase()} WHALE</p>` : ''}
            <p><strong>Reasoning:</strong> ${scoring.reasoning}</p>
            <p><strong>Notes:</strong> ${lead.additional_info || 'None'}</p>
            <a href="https://hurleyenterprisellc.com/dashboard.html" style="display:inline-block;background:#C9A84C;color:#000;font-weight:bold;padding:10px 18px;border-radius:6px;text-decoration:none;margin-top:12px;">Open CEO Dashboard</a>
          </div>
        `
      })
    });
  } catch (e) {
    console.warn('Email dispatch error:', e.message);
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};
  if (!body.name && !body.phone && !body.email) {
    return res.status(400).json({ error: 'Please provide at least a name, phone number, or email.' });
  }

  try {
    // 1. Evaluate lead with AI or Heuristic
    const aiResult = await runAIScoring(body);
    const heuristic = calculateHeuristicScore(body);
    const scoring = aiResult || heuristic;

    // 2. Prepare Lead Record
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newLead = {
      id: leadId,
      timestamp: new Date().toISOString(),
      name: body.name || 'Anonymous Inquiry',
      email: body.email || '',
      phone: body.phone || '',
      space_type: body.space_type || 'Office',
      budget: body.budget || '',
      timeline: body.timeline || 'Exploring options',
      team_size: body.team_size || 'Solo',
      score: scoring.score,
      score_label: scoring.scoreLabel,
      reasoning: scoring.reasoning || '',
      matched_properties: body.matched_properties || [],
      is_whale: scoring.isWhale,
      whale_tier: scoring.whaleTier,
      whale_keywords: scoring.whaleKeywords || [],
      source: body.source || 'website',
      medium: body.medium || '',
      campaign: body.campaign || '',
      additional_info: body.additional_info || body.notes || '',
      follow_up_date: null,
      created_by_employee: 'Website Intake',
      assigned_employee: '',
      progress: 'New Inquiry',
      archived_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 3. Save to Supabase
    if (SUPABASE_KEY) {
      const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newLead)
      });

      if (!dbRes.ok) {
        const errText = await dbRes.text();
        console.error('Supabase insert error in lease-bot:', errText);
      } else {
        // Audit log
        try {
          await fetch(`${SUPABASE_URL}/rest/v1/activity_logs`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
              id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              actor_name: 'Inbound Webhook',
              action: 'create_lead',
              entity_type: 'lead',
              entity_id: leadId,
              details: `Inbound submission from ${newLead.name} (${scoring.scoreLabel})`,
              created_at: new Date().toISOString()
            })
          });
        } catch(e) {}
      }
    }

    // 4. Send Instant Email Alert
    dispatchNotificationEmail(newLead, scoring);

    return res.status(200).json({
      success: true,
      leadId,
      score: scoring.score,
      scoreLabel: scoring.scoreLabel,
      isWhale: scoring.isWhale,
      whaleTier: scoring.whaleTier,
      message: 'Lead received and qualified successfully'
    });

  } catch (err) {
    console.error('lease-bot error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
};
