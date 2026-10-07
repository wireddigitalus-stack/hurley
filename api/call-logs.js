// api/call-logs.js — Vercel Serverless Function
// Tracks phone calls, outcomes, call notes, and scheduled follow-up dates

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

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!SUPABASE_KEY) {
    return res.status(500).json({ error: 'Supabase key is not configured.' });
  }

  try {
    // ── GET: Fetch call logs by leadId ──────────────────────────────────
    if (req.method === 'GET') {
      const { leadId } = req.query || {};
      if (!leadId) return res.status(400).json({ error: 'leadId query parameter is required' });

      const response = await fetch(`${SUPABASE_URL}/rest/v1/call_logs?lead_id=eq.${encodeURIComponent(leadId)}&order=created_at.desc`, {
        headers: getHeaders()
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: 'Failed to fetch call logs', detail: errText });
      }

      const logs = await response.json();
      return res.status(200).json({ callLogs: logs });
    }

    // ── POST: Record a new call log ───────────────────────────────────────
    if (req.method === 'POST') {
      const body = req.body || {};
      const { lead_id, caller_name, outcome, duration_minutes, notes, scheduled_follow_up } = body;

      if (!lead_id || !caller_name || !outcome) {
        return res.status(400).json({ error: 'lead_id, caller_name, and outcome are required fields' });
      }

      const logId = `call_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newCallLog = {
        id: logId,
        lead_id,
        caller_name,
        outcome,
        duration_minutes: Number(duration_minutes) || 0,
        notes: notes || '',
        scheduled_follow_up: scheduled_follow_up || null,
        created_at: new Date().toISOString()
      };

      const response = await fetch(`${SUPABASE_URL}/rest/v1/call_logs`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newCallLog)
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: 'Failed to create call log', detail: errText });
      }

      const created = await response.json();

      // If scheduled_follow_up was set, also update the parent lead's follow_up_date
      if (scheduled_follow_up) {
        try {
          await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${encodeURIComponent(lead_id)}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({
              follow_up_date: scheduled_follow_up,
              updated_at: new Date().toISOString()
            })
          });
        } catch (e) {
          console.warn('Failed to update lead follow_up_date:', e.message);
        }
      }

      // Log in activity_logs
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/activity_logs`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            actor_name: caller_name,
            action: 'call_lead',
            entity_type: 'lead',
            entity_id: lead_id,
            details: `Logged call: ${outcome} (${duration_minutes || 0} mins)`,
            created_at: new Date().toISOString()
          })
        });
      } catch (e) {}

      return res.status(201).json({ callLog: Array.isArray(created) ? created[0] : created });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('call-logs error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
};
