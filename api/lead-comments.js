// api/lead-comments.js — Vercel Serverless Function
// Manages team notes and comment activity thread for a lead

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
    // ── GET: Fetch comments by leadId ────────────────────────────────────
    if (req.method === 'GET') {
      const { leadId } = req.query || {};
      if (!leadId) return res.status(400).json({ error: 'leadId query parameter is required' });

      const response = await fetch(`${SUPABASE_URL}/rest/v1/lead_comments?lead_id=eq.${encodeURIComponent(leadId)}&order=created_at.asc`, {
        headers: getHeaders()
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: 'Failed to fetch comments', detail: errText });
      }

      const comments = await response.json();
      return res.status(200).json({ comments });
    }

    // ── POST: Add a new comment / team note ──────────────────────────────
    if (req.method === 'POST') {
      const body = req.body || {};
      const { lead_id, author_name, comment } = body;

      if (!lead_id || !author_name || !comment) {
        return res.status(400).json({ error: 'lead_id, author_name, and comment are required fields' });
      }

      const commentId = `comment_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newComment = {
        id: commentId,
        lead_id,
        author_name,
        comment: comment.trim(),
        created_at: new Date().toISOString()
      };

      const response = await fetch(`${SUPABASE_URL}/rest/v1/lead_comments`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newComment)
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: 'Failed to create comment', detail: errText });
      }

      const created = await response.json();

      // Log in activity_logs
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/activity_logs`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            actor_name: author_name,
            action: 'add_comment',
            entity_type: 'lead',
            entity_id: lead_id,
            details: `Note added: "${comment.substring(0, 40)}${comment.length > 40 ? '...' : ''}"`,
            created_at: new Date().toISOString()
          })
        });
      } catch (e) {}

      return res.status(201).json({ comment: Array.isArray(created) ? created[0] : created });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('lead-comments error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
};
