import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  || "";
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.warn("[supabase] Missing env vars — DB features disabled.");
}

export const supabase = createClient(
  SUPABASE_URL  || "https://placeholder.supabase.co",
  SUPABASE_ANON || "placeholder-key"
);

// ─── Types base de données ────────────────────────────────────────────────────

export interface PageContentRow {
  id:         string;
  page_key:   string;
  content:    Record<string, unknown>;
  updated_at: string;
}

export interface SubmissionRow {
  id:              string;
  type:            "contact" | "rdv";
  created_at:      string;
  read:            boolean;
  name:            string;
  email:           string;
  phone?:          string;
  service?:        string;
  subject?:        string;
  message?:        string;
  preferred_date?: string;
  preferred_time?: string;
  preferred_date2?:string;
  preferred_time2?:string;
  session_format?: string;
  note?:           string;
}
