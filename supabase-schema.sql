-- ═══════════════════════════════════════════════════
-- ON Coaching — Schéma Supabase
-- Coller dans Supabase SQL Editor et exécuter
-- ═══════════════════════════════════════════════════

-- ── Table : contenu des pages ─────────────────────
CREATE TABLE IF NOT EXISTS page_content (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key   TEXT UNIQUE NOT NULL,
  content    JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Table : soumissions formulaire ───────────────
CREATE TABLE IF NOT EXISTS submissions (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type            TEXT NOT NULL CHECK (type IN ('contact', 'rdv')),
  created_at      TIMESTAMPTZ DEFAULT now(),
  read            BOOLEAN DEFAULT false,
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  service         TEXT,
  subject         TEXT,
  message         TEXT,
  preferred_date  TEXT,
  preferred_time  TEXT,
  preferred_date2 TEXT,
  preferred_time2 TEXT,
  session_format  TEXT,
  note            TEXT
);

-- ── RLS : page_content ────────────────────────────
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique" ON page_content
  FOR SELECT USING (true);

CREATE POLICY "Écriture admin authentifié" ON page_content
  FOR ALL USING (auth.role() = 'authenticated');

-- ── RLS : submissions ─────────────────────────────
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insertion publique" ON submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Lecture/MAJ admin authentifié" ON submissions
  FOR ALL USING (auth.role() = 'authenticated');

-- ── Index performance ─────────────────────────────
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_read ON submissions (read);
CREATE INDEX IF NOT EXISTS idx_page_content_key ON page_content (page_key);

-- ── Trigger updated_at ────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_page_content_updated_at
  BEFORE UPDATE ON page_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
