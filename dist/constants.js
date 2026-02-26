// ─────────────────────────────────────────────
// 📌 Shared Constants
// ─────────────────────────────────────────────
export const ARXIV_API_URL = "http://export.arxiv.org/api/query";
export const HACKERNEWS_API_URL = "https://hacker-news.firebaseio.com/v0";
export const DEVTO_API_URL = "https://dev.to/api/articles";
export const TIMEOUT_MS = 15_000;
export const MAX_ABSTRACT_LENGTH = 500;
export const AI_KEYWORDS = [
    "artificial intelligence", "machine learning", "deep learning",
    "llm", "gpt", "neural network", "transformer", "diffusion",
    "reinforcement learning", "ai safety", "generative ai", "claude",
    "openai", "anthropic", "gemini", "mistral", "computer vision",
    "nlp", "natural language", "robotics", "chatbot", "autonomous"
];
export const ARXIV_AI_CATEGORIES = {
    "cs.AI": "Artificial Intelligence",
    "cs.LG": "Machine Learning",
    "cs.CL": "Computation & Language (NLP)",
    "cs.CV": "Computer Vision",
    "cs.RO": "Robotics",
    "stat.ML": "Machine Learning (Statistics)",
    "cs.NE": "Neural & Evolutionary Computing",
};
export const RSS_SOURCES = {
    mit: {
        name: "MIT AI News",
        url: "https://news.mit.edu/topic/artificial-intelligence2/rss",
    },
    deepmind: {
        name: "DeepMind Blog",
        url: "https://deepmind.google/blog/rss.xml",
    },
    openai: {
        name: "OpenAI Blog",
        url: "https://openai.com/blog/rss",
    },
    huggingface: {
        name: "Hugging Face Blog",
        url: "https://huggingface.co/blog/feed.xml",
    },
    google_ai: {
        name: "Google AI Blog",
        url: "https://blog.google/technology/ai/rss/",
    },
};
//# sourceMappingURL=constants.js.map