export interface Submission {
  id: string;
  type: "contact" | "rdv";
  /** ISO timestamp from Supabase — "2025-01-12T14:30:00.000Z" */
  created_at: string;
  read: boolean;
  name: string;
  email: string;
  phone?: string | null;
  service?: string | null;
  // contact:
  subject?: string | null;
  message?: string | null;
  // rdv:
  preferred_date?: string | null;
  preferred_time?: string | null;
  preferred_date2?: string | null;
  preferred_time2?: string | null;
  session_format?: string | null;
  note?: string | null;
  // réponse admin
  reply_text?: string | null;
  replied_at?: string | null;
}
