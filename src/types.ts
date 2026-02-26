// ─────────────────────────────────────────────
// 📐 TypeScript Type Definitions
// ─────────────────────────────────────────────

export interface ArxivPaper {
  title: string;
  authors: string[];
  abstract: string;
  categories: string[];
  published_date: string;
  arxiv_url: string;
  pdf_url: string;
}

export interface HackerNewsStory {
  id: number;
  title: string;
  url: string;
  score: number;
  author: string;
  comment_count: number;
  posted_at: string;
  hn_discussion: string;
}

export interface DevToArticle {
  title: string;
  author: string;
  author_username: string;
  tags: string[];
  description: string;
  reactions_count: number;
  comments_count: number;
  reading_time_minutes: number;
  published_at: string;
  url: string;
}

export interface NewsItem {
  source: string;
  title: string;
  summary: string;
  published: string;
  url: string;
}

export interface HackerNewsItem {
  id: number;
  type: string;
  title?: string;
  url?: string;
  score?: number;
  by?: string;
  descendants?: number;
  time?: number;
}

export interface DevToApiArticle {
  title: string;
  user: { name: string; username: string };
  tag_list: string[];
  description: string;
  public_reactions_count: number;
  comments_count: number;
  reading_time_minutes: number;
  published_at: string;
  url: string;
}