// ─────────────────────────────────────────────
// 📡 RSS News Feed Tool
// ─────────────────────────────────────────────
import { XMLParser } from "fast-xml-parser";
import { RSS_SOURCES } from "../constants.js";
import { fetchText, handleError } from "../utils.js";
const xmlParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
function extractLink(link) {
    if (!link)
        return "";
    if (typeof link === "string")
        return link;
    return link["@_href"] ?? "";
}
async function fetchRssSource(sourceKey, maxResults) {
    const source = RSS_SOURCES[sourceKey];
    if (!source)
        return [];
    try {
        const xmlText = await fetchText(source.url);
        const parsed = xmlParser.parse(xmlText);
        // Support both RSS 2.0 (channel.item) and Atom (feed.entry)
        const rawItems = parsed?.rss?.channel?.item ??
            parsed?.feed?.entry ??
            [];
        const items = Array.isArray(rawItems) ? rawItems : [rawItems];
        return items.slice(0, maxResults).map((item) => ({
            source: source.name,
            title: String(item.title ?? "").replace(/\s+/g, " ").trim(),
            summary: String(item.description ?? item.summary ?? "").replace(/<[^>]+>/g, "").slice(0, 300).trim(),
            published: String(item.pubDate ?? item.published ?? item.updated ?? "Unknown"),
            url: extractLink(item.link),
        }));
    }
    catch {
        return []; // Silently skip failed sources
    }
}
export async function getRssFeed(params) {
    try {
        let newsItems;
        if (params.source === "all") {
            const perSource = Math.ceil(params.max_results / Object.keys(RSS_SOURCES).length) + 1;
            const results = await Promise.all(Object.keys(RSS_SOURCES).map((key) => fetchRssSource(key, perSource)));
            newsItems = results.flat().slice(0, params.max_results);
        }
        else if (RSS_SOURCES[params.source]) {
            newsItems = await fetchRssSource(params.source, params.max_results);
        }
        else {
            const validSources = [...Object.keys(RSS_SOURCES), "all"].join(", ");
            return JSON.stringify({ error: `Unknown source '${params.source}'. Valid options: ${validSources}` });
        }
        return JSON.stringify({
            source_filter: params.source,
            count: newsItems.length,
            news: newsItems,
        }, null, 2);
    }
    catch (e) {
        return handleError(e);
    }
}
//# sourceMappingURL=rss.js.map