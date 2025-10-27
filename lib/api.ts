const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://106.14.242.106:38080";
import { getToken, clearToken } from "./auth";

async function jsonFetch(path: string, init?: RequestInit) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 401) {
      clearToken();
      const isTestEnv = process.env.NODE_ENV === 'test' || !!process.env.JEST_WORKER_ID;
      if (typeof window !== "undefined" && !isTestEnv) {
        const next = encodeURIComponent(window.location.pathname);
        window.location.href = `/login?next=${next}`;
      }
    }
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function getProjects() {
  return jsonFetch("/projects");
}

export async function login(payload: { email: string; password: string }) {
  return jsonFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function register(payload: { email: string; password: string }) {
  return jsonFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMe() {
  return jsonFetch("/me");
}

export async function getDashboard() {
  return jsonFetch("/dashboard");
}