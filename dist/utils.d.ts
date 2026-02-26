/**
 * Fetch JSON data from a URL with optional query parameters.
 */
export declare function fetchJson<T>(url: string, params?: Record<string, string | number>): Promise<T>;
/**
 * Fetch raw text from a URL with optional query parameters.
 */
export declare function fetchText(url: string, params?: Record<string, string | number>): Promise<string>;
/**
 * Custom HTTP error class for status-code-based handling.
 */
export declare class HttpError extends Error {
    status: number;
    constructor(status: number, message: string);
}
/**
 * Convert Unix timestamp to a human-readable UTC string.
 */
export declare function formatTimestamp(ts?: number): string;
/**
 * Consistent error message handler across all tools.
 */
export declare function handleError(e: unknown): string;
/**
 * Check if a string contains any AI-related keywords.
 */
export declare function isAiRelated(text: string, keywords: string[]): boolean;
//# sourceMappingURL=utils.d.ts.map