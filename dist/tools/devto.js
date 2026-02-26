// ─────────────────────────────────────────────
// 👨‍💻 DEV.to Articles Tool
// ─────────────────────────────────────────────
import { DEVTO_API_URL } from "../constants.js";
import { fetchJson, handleError } from "../utils.js";
export async function getDevToArticles(params) {
    try {
        const data = await fetchJson(DEVTO_API_URL, {
            tag: params.tag,
            per_page: params.max_results,
            top: 1,
        });
        const articles = data.slice(0, params.max_results).map((item) => ({
            title: item.title ?? "",
            author: item.user?.name ?? "Unknown",
            author_username: item.user?.username ?? "",
            tags: item.tag_list ?? [],
            description: (item.description ?? "").slice(0, 300),
            reactions_count: item.public_reactions_count ?? 0,
            comments_count: item.comments_count ?? 0,
            reading_time_minutes: item.reading_time_minutes ?? 0,
            published_at: item.published_at ?? "Unknown",
            url: item.url ?? "",
        }));
        return JSON.stringify({
            source: "DEV.to",
            tag: params.tag,
            count: articles.length,
            articles,
        }, null, 2);
    }
    catch (e) {
        return handleError(e);
    }
}
//# sourceMappingURL=devto.js.map