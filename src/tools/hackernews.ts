// ─────────────────────────────────────────────
// 📰 Hacker News Tool
// ─────────────────────────────────────────────

import { HACKERNEWS_API_URL, AI_KEYWORDS } from "../constants.js";
import { fetchJson, formatTimestamp, handleError, isAiRelated } from "../utils.js";
import type { HackerNewsItem, HackerNewsStory } from "../types.js";
import type { HackerNewsInput } from "../schemas.js";

export async function getHackerNewsStories(params: HackerNewsInput): Promise<string> {
  try {
    const topIds = await fetchJson<number[]>(`${HACKERNEWS_API_URL}/topstories.json`);
    const fetchLimit = Math.min(100, topIds.length);

    // Fetch stories concurrently
    const results = await Promise.allSettled(
      topIds.slice(0, fetchLimit).map((id) =>
        fetchJson<HackerNewsItem>(`${HACKERNEWS_API_URL}/item/${id}.json`)
      )
    );

    const stories: HackerNewsStory[] = [];

    for (const result of results) {
      if (result.status !== "fulfilled") continue;
      const item = result.value;
      if (!item || item.type !== "story" || !item.title) continue;

      // Optionally filter for AI-related content
      if (params.filter_ai) {
        const text = `${item.title ?? ""} ${item.url ?? ""}`;
        if (!isAiRelated(text, AI_KEYWORDS)) continue;
      }

      stories.push({
        id: item.id,
        title: item.title ?? "",
        url: item.url ?? `https://news.ycombinator.com/item?id=${item.id}`,
        score: item.score ?? 0,
        author: item.by ?? "unknown",
        comment_count: item.descendants ?? 0,
        posted_at: formatTimestamp(item.time),
        hn_discussion: `https://news.ycombinator.com/item?id=${item.id}`,
      });

      if (stories.length >= params.max_results) break;
    }

    // Sort by score descending
    stories.sort((a, b) => b.score - a.score);

    return JSON.stringify({
      source: "Hacker News",
      filtered_for_ai: params.filter_ai,
      count: stories.length,
      stories,
    }, null, 2);
  } catch (e) {
    return handleError(e);
  }
}