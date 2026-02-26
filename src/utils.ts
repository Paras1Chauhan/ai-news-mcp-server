// ─────────────────────────────────────────────
// 🔧 Shared Utility Functions
// ─────────────────────────────────────────────

import { TIMEOUT_MS } from "./constants.js";

/**
 * Fetch JSON data from a URL with optional query parameters.
 */
export async function fetchJson<T>(url: string, params?: Record<string, string | number>): Promise<T> {
  const fullUrl = params
    ? `${url}?${new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString()}`
    : url;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(fullUrl, { signal: controller.signal });
    if (!res.ok) {
      throw new HttpError(res.status, res.statusText);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch raw text from a URL with optional query parameters.
 */
export async function fetchText(url: string, params?: Record<string, string | number>): Promise<string> {
  const fullUrl = params
    ? `${url}?${new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()}`
    : url;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(fullUrl, { signal: controller.signal });
    if (!res.ok) {
      throw new HttpError(res.status, res.statusText);
    }
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Custom HTTP error class for status-code-based handling.
 */
export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}

/**
 * Convert Unix timestamp to a human-readable UTC string.
 */
export function formatTimestamp(ts?: number): string {
  if (!ts) return "Unknown";
  return new Date(ts * 1000).toISOString().replace("T", " ").slice(0, 19) + " UTC";
}

/**
 * Consistent error message handler across all tools.
 */
export function handleError(e: unknown): string {
  if (e instanceof HttpError) {
    if (e.status === 404) return JSON.stringify({ error: "Resource not found. Please verify your query." });
    if (e.status === 429) return JSON.stringify({ error: "Rate limit exceeded. Please wait before retrying." });
    if (e.status === 503) return JSON.stringify({ error: "Service temporarily unavailable. Try again shortly." });
    return JSON.stringify({ error: `API request failed with status ${e.status}.` });
  }
  if (e instanceof Error && e.name === "AbortError") {
    return JSON.stringify({ error: "Request timed out. The service may be slow. Try again." });
  }
  if (e instanceof Error) {
    return JSON.stringify({ error: `Unexpected error: ${e.name}: ${e.message}` });
  }
  return JSON.stringify({ error: "An unknown error occurred." });
}

/**
 * Check if a string contains any AI-related keywords.
 */
export function isAiRelated(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}