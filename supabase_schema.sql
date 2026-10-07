-- ==============================================================================
-- HURLEY ENTERPRISE - LEADS & INQUIRIES CRM SCHEMA (SUPABASE POSTGRESQL)
-- Project: https://lwwqihohuzjttwblizvg.supabase.co
-- ==============================================================================

-- 1. Main Leads Table
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  space_type TEXT DEFAULT 'Office',
  budget TEXT DEFAULT '',
  timeline TEXT DEFAULT 'Exploring options',
  team_size TEXT DEFAULT 'Solo',
  score INTEGER DEFAULT 50,
  score_label TEXT DEFAULT 'Prospect Lead', -- 'Verified Lead' (70+), 'MQL' (40-69), 'Prospect Lead' (<40), 'Draft', 'Potential Spam'
  reasoning TEXT DEFAULT '',
  matched_properties JSONB DEFAULT '[]'::jsonb,
  is_whale BOOLEAN DEFAULT FALSE,
  whale_tier TEXT DEFAULT NULL,            -- 'gold' ($8k+/mo), 'silver' ($4k+/mo)
  whale_keywords TEXT[] DEFAULT '{}',
  source TEXT DEFAULT 'manual',            -- 'website', 'manual', 'draft', 'referral', 'riley', 'evaluator'
  medium TEXT DEFAULT '',
  campaign TEXT DEFAULT '',
  additional_info TEXT DEFAULT '',
  follow_up_date DATE DEFAULT NULL,
  created_by_employee TEXT DEFAULT 'Staff',
  assigned_employee TEXT DEFAULT '',
  progress TEXT DEFAULT 'New Inquiry',     -- 'New Inquiry', 'Contacted', 'Tour Scheduled', 'Proposal Sent', 'Contract Signed', 'Lost'
  archived_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_score_label ON leads(score_label);
CREATE INDEX IF NOT EXISTS idx_leads_progress ON leads(progress);
CREATE INDEX IF NOT EXISTS idx_leads_follow_up ON leads(follow_up_date);
CREATE INDEX IF NOT EXISTS idx_leads_archived ON leads(archived_at);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- 2. Call Logs Table
CREATE TABLE IF NOT EXISTS call_logs (
  id TEXT PRIMARY KEY,
  lead_id TEXT REFERENCES leads(id) ON DELETE CASCADE,
  caller_name TEXT NOT NULL,
  outcome TEXT NOT NULL, -- 'Spoke to Lead', 'Left Voicemail', 'No Answer', 'Bad Number', 'Follow-up Needed'
  duration_minutes NUMERIC DEFAULT 0,
  notes TEXT DEFAULT '',
  scheduled_follow_up DATE DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_call_logs_lead_id ON call_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_created_at ON call_logs(created_at DESC);

-- 3. Lead Comments & Activity Thread
CREATE TABLE IF NOT EXISTS lead_comments (
  id TEXT PRIMARY KEY,
  lead_id TEXT REFERENCES leads(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_comments_lead_id ON lead_comments(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_comments_created_at ON lead_comments(created_at DESC);

-- 4. Unified Audit Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  actor_name TEXT NOT NULL,
  actor_email TEXT DEFAULT '',
  action TEXT NOT NULL, -- 'create_lead', 'update_lead', 'assign_lead', 'archive_lead', 'save_draft'
  entity_type TEXT DEFAULT 'lead',
  entity_id TEXT NOT NULL,
  details TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_id ON activity_logs(entity_id);

-- 5. Row Level Security (RLS) Configuration
-- Enable RLS on all CRM tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow full access for anon and authenticated users (protected by dashboard PIN / service role)
DROP POLICY IF EXISTS "Allow anon and auth full access to leads" ON leads;
CREATE POLICY "Allow anon and auth full access to leads" ON leads FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon and auth full access to call_logs" ON call_logs;
CREATE POLICY "Allow anon and auth full access to call_logs" ON call_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon and auth full access to lead_comments" ON lead_comments;
CREATE POLICY "Allow anon and auth full access to lead_comments" ON lead_comments FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon and auth full access to activity_logs" ON activity_logs;
CREATE POLICY "Allow anon and auth full access to activity_logs" ON activity_logs FOR ALL USING (true) WITH CHECK (true);
