import { supabase } from "@/lib/supabase";

const TOKEN_KEY = "onc_github_token";

export const auth = {
  async login(email: string, password: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  async getUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  // GitHub token — still stored in localStorage (used by CMS)
  getToken(): string {
    return localStorage.getItem(TOKEN_KEY) ?? "";
  },

  setToken(t: string): void {
    localStorage.setItem(TOKEN_KEY, t);
  },
};
