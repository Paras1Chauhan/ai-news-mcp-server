import { z } from "zod";
export declare const ArxivSearchSchema: z.ZodObject<{
    query: z.ZodDefault<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<[string, ...string[]]>>;
    max_results: z.ZodDefault<z.ZodNumber>;
    sort_by: z.ZodDefault<z.ZodEnum<["submittedDate", "relevance"]>>;
}, "strict", z.ZodTypeAny, {
    query: string;
    max_results: number;
    sort_by: "submittedDate" | "relevance";
    category?: string | undefined;
}, {
    query?: string | undefined;
    category?: string | undefined;
    max_results?: number | undefined;
    sort_by?: "submittedDate" | "relevance" | undefined;
}>;
export declare const HackerNewsSchema: z.ZodObject<{
    max_results: z.ZodDefault<z.ZodNumber>;
    filter_ai: z.ZodDefault<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    max_results: number;
    filter_ai: boolean;
}, {
    max_results?: number | undefined;
    filter_ai?: boolean | undefined;
}>;
export declare const DevToSchema: z.ZodObject<{
    tag: z.ZodDefault<z.ZodString>;
    max_results: z.ZodDefault<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    max_results: number;
    tag: string;
}, {
    max_results?: number | undefined;
    tag?: string | undefined;
}>;
export declare const RssFeedSchema: z.ZodObject<{
    source: z.ZodDefault<z.ZodEnum<[string, ...string[]]>>;
    max_results: z.ZodDefault<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    max_results: number;
    source: string;
}, {
    max_results?: number | undefined;
    source?: string | undefined;
}>;
export declare const TrendingSummarySchema: z.ZodObject<{
    include_papers: z.ZodDefault<z.ZodBoolean>;
    include_news: z.ZodDefault<z.ZodBoolean>;
    include_hn: z.ZodDefault<z.ZodBoolean>;
    max_items_each: z.ZodDefault<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    include_papers: boolean;
    include_news: boolean;
    include_hn: boolean;
    max_items_each: number;
}, {
    include_papers?: boolean | undefined;
    include_news?: boolean | undefined;
    include_hn?: boolean | undefined;
    max_items_each?: number | undefined;
}>;
export type ArxivSearchInput = z.infer<typeof ArxivSearchSchema>;
export type HackerNewsInput = z.infer<typeof HackerNewsSchema>;
export type DevToInput = z.infer<typeof DevToSchema>;
export type RssFeedInput = z.infer<typeof RssFeedSchema>;
export type TrendingSummaryInput = z.infer<typeof TrendingSummarySchema>;
//# sourceMappingURL=schemas.d.ts.map