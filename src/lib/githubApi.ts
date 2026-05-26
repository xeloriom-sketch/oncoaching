export const GITHUB_OWNER = "xeloriom-sketch";
export const GITHUB_REPO = "oncoaching";
export const GITHUB_BRANCH = "main";

const BASE_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents`;
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;

async function handleResponse(res: Response): Promise<unknown> {
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const json = await res.json() as { message?: string };
      if (json.message) message = `HTTP ${res.status}: ${json.message}`;
    } catch {
      // ignore JSON parse error
    }
    throw new Error(message);
  }
  return res.json();
}

export const githubApi = {
  async getFile(path: string, token: string): Promise<{ content: unknown; sha: string }> {
    const res = await fetch(`${BASE_URL}/${path}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${token}`,
      },
    });
    const data = await handleResponse(res) as { content: string; sha: string };
    const decoded = JSON.parse(atob(data.content.replace(/\n/g, ""))) as unknown;
    return { content: decoded, sha: data.sha };
  },

  async updateFile(
    path: string,
    content: unknown,
    sha: string,
    token: string,
    commitMessage = `Update ${path}`
  ): Promise<{ sha: string }> {
    const res = await fetch(`${BASE_URL}/${path}`, {
      method: "PUT",
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage,
        content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
        sha,
        branch: GITHUB_BRANCH,
      }),
    });
    const data = await handleResponse(res) as { content: { sha: string } };
    return { sha: data.content.sha };
  },

  async getRawFile(path: string): Promise<unknown> {
    const res = await fetch(`${RAW_BASE}/${path}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to fetch ${path}`);
    }
    return res.json();
  },
};
