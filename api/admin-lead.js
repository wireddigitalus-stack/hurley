// api/admin-lead.js — Vercel Serverless Function
// Handles Staff Intake, Updates, Inline Edits, Drafts, and Lead Listing for Hurley Enterprise CRM

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!SUPABASE_KEY) {
    return res.status(500).json({ error: 'Supabase key is not configured in environment variables (SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY).' });
  }

  try {
    // ── GET: Fetch leads with filtering ──────────────────────────────────
    if (req.method === 'GET') {
      const { filter, scoreLabel, progress, search, limit = 200 } = req.query || {};
      
      let url = `${SUPABASE_URL}/rest/v1/leads?select=*&order=created_at.desc&limit=${limit}`;

      if (filter === 'archived') {
        url += '&archived_at=not.is.null';
      } else if (filter === 'drafts') {
        url += '&score_label=eq.Draft&archived_at=is.null';
      } else if (filter === 'active') {
        url += '&score_label=neq.Draft&archived_at=is.null';
      } else {
        // default show non-archived unless explicitly requesting all
        if (filter !== 'all') {
          url += '&archived_at=is.null';
        }
      }

      if (scoreLabel && scoreLabel !== 'all') {
        url += `&score_label=eq.${encodeURIComponent(scoreLabel)}`;
      }

      if (progress && progress !== 'all') {
        url += `&progress=eq.${encodeURIComponent(progress)}`;
      }

      const response = await fetch(url, { headers: getHeaders() });
      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: 'Failed to fetch leads', detail: errText });
      }

      let data = await response.json();

      // Client-requested search filtering if provided
      if (search && typeof search === 'string') {
        const q = search.toLowerCase();
        data = data.filter(l => 
          (l.name && l.name.toLowerCase().includes(q)) ||
          (l.phone && l.phone.toLowerCase().includes(q)) ||
          (l.email && l.email.toLowerCase().includes(q)) ||
          (l.additional_info && l.additional_info.toLowerCase().includes(q)) ||
          (l.assigned_employee && l.assigned_employee.toLowerCase().includes(q))
        );
      }

      return res.status(200).json({ leads: data, total: data.length });
    }

    // ── POST: Standard Entry or Save Draft ─────────────────────────────────
    if (req.method === 'POST') {
      const body = req.body || {};
      const isDraft = body.isDraft || body.score_label === 'Draft';

      const leadId = body.id || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      
      const newLead = {
        id: leadId,
        timestamp: new Date().toISOString(),
        name: body.name || (isDraft ? 'Untitled Draft' : 'New Prospect'),
        email: body.email || '',
        phone: body.phone || '',
        space_type: body.space_type || 'Office',
        budget: body.budget || '',
        timeline: body.timeline || 'Exploring options',
        team_size: body.team_size || 'Solo',
        score: isDraft ? 0 : (body.score !== undefined ? body.score : 50),
        score_label: isDraft ? 'Draft' : (body.score_label || 'Prospect Lead'),
        reasoning: body.reasoning || (isDraft ? 'Incomplete staff draft saved to finish later' : ''),
        matched_properties: body.matched_properties || [],
        is_whale: Boolean(body.is_whale),
        whale_tier: body.whale_tier || null,
        whale_keywords: body.whale_keywords || [],
        source: body.source || (isDraft ? 'draft' : 'manual'),
        medium: body.medium || '',
        campaign: body.campaign || '',
        additional_info: body.additional_info || body.notes || '',
        follow_up_date: body.follow_up_date || null,
        created_by_employee: body.created_by_employee || 'Staff',
        assigned_employee: body.assigned_employee || '',
        progress: isDraft ? 'Draft' : (body.progress || 'New Inquiry'),
        archived_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const response = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newLead)
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: 'Failed to create lead', detail: errText });
      }

      const created = await response.json();

      // Log activity
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/activity_logs`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            actor_name: body.created_by_employee || 'Staff',
            action: isDraft ? 'save_draft' : 'create_lead',
            entity_type: 'lead',
            entity_id: leadId,
            details: `Lead ${isDraft ? 'draft saved' : 'created'} for ${newLead.name}`,
            created_at: new Date().toISOString()
          })
        });
      } catch (e) {
        console.warn('Activity log failed:', e.message);
      }

      return res.status(201).json({ lead: Array.isArray(created) ? created[0] : created });
    }

    // ── PATCH: Inline Updates (progress, assignee, follow-up, notes, archive) ───
    if (req.method === 'PATCH') {
      const { id, ...updates } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Lead ID is required for updates' });

      updates.updated_at = new Date().toISOString();

      const response = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: 'Failed to update lead', detail: errText });
      }

      const updated = await response.json();

      // Log activity
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/activity_logs`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            actor_name: updates.updated_by || 'Staff',
            action: updates.archived_at ? 'archive_lead' : 'update_lead',
            entity_type: 'lead',
            entity_id: id,
            details: `Updated fields: ${Object.keys(updates).join(', ')}`,
            created_at: new Date().toISOString()
          })
        });
      } catch (e) {
        console.warn('Activity log failed:', e.message);
      }

      return res.status(200).json({ lead: Array.isArray(updated) ? updated[0] : updated });
    }

    // ── DELETE: Hard Delete ───────────────────────────────────────────────
    if (req.method === 'DELETE') {
      const { id } = req.query || req.body || {};
      if (!id) return res.status(400).json({ error: 'Lead ID is required for deletion' });

      const response = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: 'Failed to delete lead', detail: errText });
      }

      return res.status(200).json({ message: 'Lead successfully deleted', id });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('admin-lead error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
};
