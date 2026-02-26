// ─────────────────────────────────────────────
// 📋 Zod Input Schemas
// ─────────────────────────────────────────────
import { z } from "zod";
import { ARXIV_AI_CATEGORIES, RSS_SOURCES } from "./constants.js";
const validCategories = Object.keys(ARXIV_AI_CATEGORIES);
const validRssSources = [...Object.keys(RSS_SOURCES), "all"];
export const ArxivSearchSchema = z.object({
    query: z
        .string()
        .min(1)
        .max(200)
        .default("artificial intelligence")
        .describe("Search query (e.g., 'large language model', 'diffusion model', 'RL agent')"),
    category: z
        .enum(validCategories)
        .optional()
        .describe(`ArXiv category filter. Options: ${validCategories.join(", ")}. Leave empty for all AI categories.`),
    max_results: z
        .number()
        .int()
        .min(1)
        .max(20)
        .default(5)
        .describe("Number of papers to return (1–20)"),
    sort_by: z
        .enum(["submittedDate", "relevance"])
        .default("submittedDate")
        .describe("Sort order: 'submittedDate' (newest) or 'relevance'"),
}).strict();
export const HackerNewsSchema = z.object({
    max_results: z
        .number()
        .int()
        .min(1)
        .max(30)
        .default(10)
        .describe("Number of trending stories to fetch (1–30)"),
    filter_ai: z
        .boolean()
        .default(true)
        .describe("If true, only return AI/ML-related stories. If false, return all top tech stories."),
}).strict();
export const DevToSchema = z.object({
    tag: z
        .string()
        .min(1)
        .max(50)
        .default("machinelearning")
        .describe("Tag to search. Popular AI tags: 'machinelearning', 'deeplearning', 'ai', 'llm', 'openai', 'python'"),
    max_results: z
        .number()
        .int()
        .min(1)
        .max(20)
        .default(8)
        .describe("Number of articles to fetch (1–20)"),
}).strict();
export const RssFeedSchema = z.object({
    source: z
        .enum(validRssSources)
        .default("all")
        .describe(`News source. Options: ${validRssSources.join(", ")}`),
    max_results: z
        .number()
        .int()
        .min(1)
        .max(20)
        .default(8)
        .describe("Number of items to return (1–20)"),
}).strict();
export const TrendingSummarySchema = z.object({
    include_papers: z.boolean().default(true).describe("Include latest ArXiv papers"),
    include_news: z.boolean().default(true).describe("Include AI news from RSS feeds"),
    include_hn: z.boolean().default(true).describe("Include HackerNews AI stories"),
    max_items_each: z
        .number()
        .int()
        .min(1)
        .max(10)
        .default(5)
        .describe("Max items per category (1–10)"),
}).strict();
//# sourceMappingURL=schemas.js.map