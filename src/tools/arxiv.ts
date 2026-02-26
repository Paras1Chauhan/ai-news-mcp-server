// ─────────────────────────────────────────────
// 🔬 ArXiv Papers Tool
// ─────────────────────────────────────────────

import { XMLParser } from "fast-xml-parser";
import { ARXIV_API_URL, ARXIV_AI_CATEGORIES, MAX_ABSTRACT_LENGTH } from "../constants.js";
import { fetchText, handleError } from "../utils.js";
import type { ArxivPaper } from "../types.js";
import type { ArxivSearchInput } from "../schemas.js";

const xmlParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

interface ArxivEntry {
  title: string | { "#text": string };
  author: { name: string } | Array<{ name: string }>;
  summary: string;
  category: { "@_term": string } | Array<{ "@_term": string }>;
  published: string;
  id: string;
  link: { "@_href": string; "@_type"?: string } | Array<{ "@_href": string; "@_type"?: string }>;
}

function extractText(val: unknown): string {
  if (typeof val === "string") return val;
  if (val && typeof val === "object" && "#text" in (val as Record<string, unknown>)) {
    return String((val as Record<string, unknown>)["#text"]);
  }
  return "";
}

function toArray<T>(val: T | T[] | undefined): T[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

export async function getArxivPapers(params: ArxivSearchInput): Promise<string> {
  try {
    // Build category filter
    const catFilter = params.category
      ? `cat:${params.category}`
      : `(${Object.keys(ARXIV_AI_CATEGORIES).map((c) => `cat:${c}`).join(" OR ")})`;

    const searchQuery = `${catFilter} AND ${params.query}`;

    const xmlText = await fetchText(ARXIV_API_URL, {
      search_query: searchQuery,
      start: 0,
      max_results: params.max_results,
      sortBy: params.sort_by,
      sortOrder: "descending",
    });

    const parsed = xmlParser.parse(xmlText);
    const feed = parsed?.feed;
    const rawEntries = feed?.entry;

    if (!rawEntries) {
      return JSON.stringify({ query: params.query, count: 0, papers: [], message: "No papers found. Try a broader search term." });
    }

    const entries: ArxivEntry[] = toArray(rawEntries);

    const papers: ArxivPaper[] = entries.map((entry) => {
      const authors = toArray(entry.author)
        .map((a) => a.name)
        .slice(0, 5);

      const categories = toArray(entry.category).map((c) => c["@_term"]);

      const links = toArray(entry.link);
      const pdfLink = links.find((l) => l["@_type"] === "application/pdf");
      const absLink = links.find((l) => !l["@_type"] || l["@_type"] === "text/html");

      const arxivUrl = extractText(entry.id).trim();
      const pdfUrl = pdfLink?.["@_href"] ?? arxivUrl.replace("/abs/", "/pdf/");

      const abstract = extractText(entry.summary).replace(/\s+/g, " ").trim();

      return {
        title: extractText(entry.title).replace(/\s+/g, " ").trim(),
        authors,
        abstract: abstract.length > MAX_ABSTRACT_LENGTH
          ? abstract.slice(0, MAX_ABSTRACT_LENGTH) + "..."
          : abstract,
        categories,
        published_date: entry.published ?? "Unknown",
        arxiv_url: absLink?.["@_href"] ?? arxivUrl,
        pdf_url: pdfUrl,
      };
    });

    return JSON.stringify({
      query: params.query,
      category_filter: params.category ?? "All AI Categories",
      sort_by: params.sort_by,
      count: papers.length,
      papers,
    }, null, 2);
  } catch (e) {
    return handleError(e);
  }
}