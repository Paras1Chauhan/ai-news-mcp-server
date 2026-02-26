// ─────────────────────────────────────────────
// 🚀 AI News & Trends MCP Server — Main Entry
// ─────────────────────────────────────────────

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";

import {
  ArxivSearchSchema,
  HackerNewsSchema,
  DevToSchema,
  RssFeedSchema,
  TrendingSummarySchema,
  type TrendingSummaryInput,
} from "./schemas.js";

import { getArxivPapers } from "./tools/arxiv.js";
import { getHackerNewsStories } from "./tools/hackernews.js";
import { getDevToArticles } from "./tools/devto.js";
import { getRssFeed } from "./tools/rss.js";
import { handleError } from "./utils.js";

// ─────────────────────────────────────────────
// 🛠 Initialize MCP Server
// ─────────────────────────────────────────────
const server = new McpServer({
  name: "ai-news-mcp-server",
  version: "1.0.0",
});

// ─────────────────────────────────────────────
// 🔬 Tool 1: ArXiv AI Papers
// ─────────────────────────────────────────────
server.registerTool(
  "ai_news_get_arxiv_papers",
  {
    title: "Search Latest AI Research Papers on ArXiv",
    description: `Search ArXiv for the latest cutting-edge AI/ML research papers.
Returns paper titles, authors, abstracts, categories, links, and PDF URLs.

Args:
  - query (string): Search terms (e.g., 'large language model', 'diffusion model')
  - category (optional string): Filter by ArXiv category like 'cs.AI', 'cs.LG', 'cs.CL', 'cs.CV'
  - max_results (number): How many papers to return (1–20, default: 5)
  - sort_by ('submittedDate' | 'relevance'): Sort order (default: submittedDate)

Returns JSON with: { query, category_filter, count, papers: [ { title, authors, abstract, categories, published_date, arxiv_url, pdf_url } ] }`,
    inputSchema: ArxivSearchSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  async (params) => {
    const result = await getArxivPapers(params);
    return { content: [{ type: "text", text: result }] };
  }
);

// ─────────────────────────────────────────────
// 📰 Tool 2: Hacker News AI Stories
// ─────────────────────────────────────────────
server.registerTool(
  "ai_news_get_hackernews",
  {
    title: "Get Trending AI Stories from Hacker News",
    description: `Fetches trending stories from Hacker News, optionally filtered for AI/ML topics.
Uses the official HackerNews Firebase API.

Args:
  - max_results (number): Stories to return (1–30, default: 10)
  - filter_ai (boolean): If true, only return AI-related stories (default: true)

Returns JSON with: { source, filtered_for_ai, count, stories: [ { id, title, url, score, author, comment_count, posted_at, hn_discussion } ] }`,
    inputSchema: HackerNewsSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  },
  async (params) => {
    const result = await getHackerNewsStories(params);
    return { content: [{ type: "text", text: result }] };
  }
);

// ─────────────────────────────────────────────
// 👨‍💻 Tool 3: DEV.to Articles
// ─────────────────────────────────────────────
server.registerTool(
  "ai_news_get_devto_articles",
  {
    title: "Get AI/ML Developer Articles from DEV.to",
    description: `Fetches trending AI/ML developer articles from DEV.to community using their public API.

Args:
  - tag (string): Article tag to search (e.g., 'machinelearning', 'ai', 'llm', 'openai', default: 'machinelearning')
  - max_results (number): Number of articles to return (1–20, default: 8)

Returns JSON with: { source, tag, count, articles: [ { title, author, tags, description, reactions_count, reading_time_minutes, published_at, url } ] }`,
    inputSchema: DevToSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  async (params) => {
    const result = await getDevToArticles(params);
    return { content: [{ type: "text", text: result }] };
  }
);

// ─────────────────────────────────────────────
// 📡 Tool 4: AI News RSS Feeds
// ─────────────────────────────────────────────
server.registerTool(
  "ai_news_get_rss_feed",
  {
    title: "Get AI News from Top AI Organization RSS Feeds",
    description: `Fetch the latest AI news from official RSS feeds of top AI organizations.
Sources: MIT AI Lab, DeepMind, OpenAI, HuggingFace, Google AI Blog.

Args:
  - source (string): 'mit', 'deepmind', 'openai', 'huggingface', 'google_ai', or 'all' (default: 'all')
  - max_results (number): News items to return (1–20, default: 8)

Returns JSON with: { source_filter, count, news: [ { source, title, summary, published, url } ] }`,
    inputSchema: RssFeedSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  },
  async (params) => {
    const result = await getRssFeed(params);
    return { content: [{ type: "text", text: result }] };
  }
);

// ─────────────────────────────────────────────
// 🌐 Tool 5: Full AI Trends Dashboard
// ─────────────────────────────────────────────
server.registerTool(
  "ai_news_get_trending_summary",
  {
    title: "Get Full AI Trends Dashboard (Papers + News + HN)",
    description: `Aggregates AI trends from multiple sources into a single dashboard snapshot.
Combines ArXiv papers, RSS news feeds, and HackerNews stories concurrently.

Args:
  - include_papers (boolean): Include latest ArXiv AI papers (default: true)
  - include_news (boolean): Include AI news from RSS feeds (default: true)
  - include_hn (boolean): Include HackerNews AI stories (default: true)
  - max_items_each (number): Max items per category (1–10, default: 5)

Returns JSON dashboard with: { generated_at, summary: { papers?, hackernews?, news? } }`,
    inputSchema: TrendingSummarySchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  },
  async (params: TrendingSummaryInput) => {
    try {
      const dashboard: Record<string, unknown> = {
        generated_at: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
        summary: {},
      };

      const tasks: Promise<void>[] = [];
      const summary = dashboard.summary as Record<string, unknown>;

      if (params.include_papers) {
        tasks.push(
          getArxivPapers({
            query: "large language model OR diffusion OR transformer",
            max_results: params.max_items_each,
            sort_by: "submittedDate",
          }).then((r) => { summary.papers = JSON.parse(r); })
        );
      }

      if (params.include_hn) {
        tasks.push(
          getHackerNewsStories({
            max_results: params.max_items_each,
            filter_ai: true,
          }).then((r: string) => { summary.hackernews = JSON.parse(r); })
        );
      }

      if (params.include_news) {
        tasks.push(
          getRssFeed({
            source: "all",
            max_results: params.max_items_each,
          }).then((r) => { summary.news = JSON.parse(r); })
        );
      }

      await Promise.allSettled(tasks);

      return { content: [{ type: "text", text: JSON.stringify(dashboard, null, 2) }] };
    } catch (e) {
      return { content: [{ type: "text", text: handleError(e) }] };
    }
  }
);

// ─────────────────────────────────────────────
// 🔌 Transport Setup
// ─────────────────────────────────────────────

async function runStdio(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("✅ AI News MCP Server running in stdio mode");
}

async function runHttp(port: number): Promise<void> {
  const app = express();
  app.use(express.json());

  app.post("/mcp", async (req, res) => {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    res.on("close", () => transport.close());
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", server: "ai-news-mcp-server", version: "1.0.0" });
  });

  app.listen(port, () => {
    console.error(`✅ AI News MCP Server running at http://localhost:${port}/mcp`);
  });
}

// ─────────────────────────────────────────────
// ▶️ Start
// ─────────────────────────────────────────────
const transport = process.env.TRANSPORT ?? "stdio";
const port = parseInt(process.env.PORT ?? "3000");

if (transport === "http") {
  runHttp(port).catch((err) => {
    console.error("Server error:", err);
    process.exit(1);
  });
} else {
  runStdio().catch((err) => {
    console.error("Server error:", err);
    process.exit(1);
  });
}