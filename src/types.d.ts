export type SearchResponse = string[];

export type SearchRequest = {
    prefix?: string;
    count?: number;
    randomDelay?: boolean;
}