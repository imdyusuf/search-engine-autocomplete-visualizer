export type SearchMode = "prefix" | "exact" | "keyword";
export type DatasetPreset = "all" | "programming" | "computer-science" | "technology";

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  popularity: number;
  preset: Exclude<DatasetPreset, "all">;
  isCustom?: boolean;
}

export interface RankingFactors {
  prefix: number;
  popularity: number;
  keyword: number;
  length: number;
  exact: number;
  total: number;
}

export interface SearchResult {
  item: SearchItem;
  score: number;
  factors: RankingFactors;
  matchedTerms: string[];
}

export interface SearchStats {
  query: string;
  normalizedQuery: string;
  mode: SearchMode;
  traversalDepth: number;
  nodesVisited: number;
  candidates: number;
  returned: number;
  topK: number;
  searchTimeMs: number;
  rankingTimeMs: number;
  heapSize: number;
  indexType: "trie" | "hash-map" | "inverted-index";
}

export interface SearchResponse {
  results: SearchResult[];
  stats: SearchStats;
}

export interface IndexStatistics {
  terms: number;
  trieNodes: number;
  categories: number;
  keywords: number;
  documents: number;
}

export interface TrieVisualNode {
  id: string;
  char: string;
  prefix: string;
  depth: number;
  childCount: number;
  terminalCount: number;
  subtreeTerms: number;
  isPath: boolean;
  isCurrent: boolean;
  hasMore: boolean;
  children: TrieVisualNode[];
}

export interface BenchmarkResult {
  trieMs: number;
  linearMs: number;
  trieCandidates: number;
  linearCandidates: number;
}

export interface NodeDetails {
  char: string;
  prefix: string;
  depth: number;
  children: number;
  isWord: boolean;
  wordsBelow: number;
}