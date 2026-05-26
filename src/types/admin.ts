export interface Submission {
  id: string;
  type: "contact" | "rdv";
  date: string; // "YYYY-MM-DD HH:MM:SS"
  read: boolean;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  // contact:
  subject?: string;
  message?: string;
  // rdv:
  preferredDate?: string;
  preferredTime?: string;
  preferredDate2?: string;
  preferredTime2?: string;
  sessionFormat?: string;
  note?: string;
}
