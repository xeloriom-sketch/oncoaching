const AUTH_KEY = "onc_admin_auth";
const TOKEN_KEY = "onc_github_token";
const PWD_KEY = "onc_admin_pwd";

export const DEFAULT_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? "oncoaching2024";

export const auth = {
  login(pwd: string): boolean {
    if (pwd === this.getPassword()) {
      localStorage.setItem(AUTH_KEY, "1");
      return true;
    }
    return false;
  },

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
  },

  isLoggedIn(): boolean {
    return localStorage.getItem(AUTH_KEY) === "1";
  },

  getToken(): string {
    return localStorage.getItem(TOKEN_KEY) ?? "";
  },

  setToken(t: string): void {
    localStorage.setItem(TOKEN_KEY, t);
  },

  getPassword(): string {
    return localStorage.getItem(PWD_KEY) ?? DEFAULT_PASSWORD;
  },

  setPassword(p: string): void {
    localStorage.setItem(PWD_KEY, p);
  },
};
