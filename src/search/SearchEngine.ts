import { InvertedIndex } from "@/structures/InvertedIndex";
import { PriorityQueue } from "@/structures/PriorityQueue";
import { Trie } from "@/structures/Trie";
import type {
  BenchmarkResult,
  IndexStatistics,
  NodeDetails,
  SearchItem,
  SearchMode,
  SearchResponse,
  SearchResult,
  SearchStats,
  TrieVisualNode,
} from "@/types/search";
import { clamp, normalizeText, tokenize } from "@/utils/normalization";

const EMPTY_STATS = (mode: SearchMode): SearchStats => ({
  query: "",
  normalizedQuery: "",
  mode,
  traversalDepth: 0,
  nodesVisited: 0,
  candidates: 0,
  returned: 0,
  topK: 8,
  searchTimeMs: 0,
  rankingTimeMs: 0,
  heapSize: 0,
  indexType: mode === "keyword" ? "inverted-index" : mode === "exact" ? "hash-map" : "trie",
});

export class SearchEngine {
  private readonly trie = new Trie();
  private readonly invertedIndex = new InvertedIndex();
  private readonly documents = new Map<string, SearchItem>();
  private readonly titles = new Map<string, string[]>();
  private readonly categories = new Set<string>();

  public constructor(private readonly items: SearchItem[]) {
    items.forEach((item) => this.add(item));
  }

  public add(item: SearchItem): void {
    const normalizedTitle = normalizeText(item.title);
    if (!normalizedTitle || this.documents.has(item.id)) return;
    this.documents.set(item.id, item);
    this.categories.add(item.category);
    this.trie.insert(normalizedTitle, item.id);
    this.invertedIndex.addDocument(item.id, [item.title, item.description, item.category, ...item.keywords]);
    this.titles.set(normalizedTitle, [...(this.titles.get(normalizedTitle) ?? []), item.id]);
  }

  public hasTitle(title: string): boolean {
    return this.titles.has(normalizeText(title));
  }

  public autocomplete(query: string, topK = 8): SearchResponse {
    return this.performSearch(query, "prefix", topK);
  }

  public search(query: string, mode: SearchMode, topK = 18): SearchResponse {
    return this.performSearch(query, mode, topK);
  }

  public getStatistics(): IndexStatistics {
    return {
      terms: this.documents.size,
      trieNodes: this.trie.size,
      categories: this.categories.size,
      keywords: this.invertedIndex.size,
      documents: this.documents.size,
    };
  }

  public getTrieView(query: string): TrieVisualNode {
    return this.trie.makeVisualTree(normalizeText(query));
  }

  public getNodeDetails(prefix: string): NodeDetails | null {
    return this.trie.getNodeDetails(prefix);
  }

  public benchmark(query: string): BenchmarkResult | null {
    const normalized = normalizeText(query);
    if (!normalized) return null;
    const repetitions = 7;
    let trieCandidates = 0;
    const trieStart = performance.now();
    for (let run = 0; run < repetitions; run += 1) {
      const lookup = this.trie.lookup(normalized);
      trieCandidates = lookup.found && lookup.node ? this.trie.collect(lookup.node).ids.length : 0;
    }
    const trieMs = (performance.now() - trieStart) / repetitions;

    let linearCandidates = 0;
    const linearStart = performance.now();
    for (let run = 0; run < repetitions; run += 1) {
      linearCandidates = this.items.filter((item) => normalizeText(item.title).startsWith(normalized)).length;
    }
    const linearMs = (performance.now() - linearStart) / repetitions;
    return { trieMs, linearMs, trieCandidates, linearCandidates };
  }

  private performSearch(query: string, mode: SearchMode, topK: number): SearchResponse {
    const started = performance.now();
    const normalized = normalizeText(query);
    if (!normalized) {
      return { results: [], stats: { ...EMPTY_STATS(mode), topK } };
    }

    let candidateIds: string[] = [];
    let matchCounts = new Map<string, number>();
    let traversalDepth = 0;
    let nodesVisited = 0;
    let indexType: SearchStats["indexType"] = "trie";

    if (mode === "prefix") {
      const lookup = this.trie.lookup(normalized);
      traversalDepth = lookup.traversed.length;
      nodesVisited = lookup.nodesVisited;
      if (lookup.found && lookup.node) {
        const collected = this.trie.collect(lookup.node);
        candidateIds = collected.ids;
        nodesVisited += collected.nodesVisited;
      }
    } else if (mode === "exact") {
      candidateIds = this.titles.get(normalized) ?? [];
      traversalDepth = normalized.length;
      nodesVisited = 1;
      indexType = "hash-map";
      candidateIds.forEach((id) => matchCounts.set(id, 1));
    } else {
      matchCounts = this.invertedIndex.search(normalized);
      candidateIds = [...matchCounts.keys()];
      nodesVisited = tokenize(normalized).length;
      indexType = "inverted-index";
    }

    const rankingStarted = performance.now();
    const ranked = this.selectTopK(candidateIds, normalized, mode, matchCounts, topK);
    const rankingTimeMs = performance.now() - rankingStarted;
    const searchTimeMs = performance.now() - started;

    return {
      results: ranked.results,
      stats: {
        query,
        normalizedQuery: normalized,
        mode,
        traversalDepth,
        nodesVisited,
        candidates: candidateIds.length,
        returned: ranked.results.length,
        topK,
        searchTimeMs,
        rankingTimeMs,
        heapSize: ranked.heapSize,
        indexType,
      },
    };
  }

  private selectTopK(
    candidateIds: string[],
    query: string,
    mode: SearchMode,
    matchCounts: Map<string, number>,
    topK: number,
  ): { results: SearchResult[]; heapSize: number } {
    const heap = new PriorityQueue<SearchResult>((a, b) => a.score - b.score || a.item.title.localeCompare(b.item.title));
    const queryTokens = tokenize(query);
    candidateIds.forEach((id) => {
      const item = this.documents.get(id);
      if (!item) return;
      const result = this.makeResult(item, query, mode, matchCounts.get(id) ?? 0, queryTokens);
      if (heap.size < topK) {
        heap.push(result);
      } else if ((heap.peek()?.score ?? Number.NEGATIVE_INFINITY) < result.score) {
        heap.replaceTop(result);
      }
    });
    return { results: heap.toArray().sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title)), heapSize: heap.size };
  }

  private makeResult(
    item: SearchItem,
    query: string,
    mode: SearchMode,
    keywordMatchCount: number,
    queryTokens: string[],
  ): SearchResult {
    const title = normalizeText(item.title);
    const exactMatch = title === query;
    const prefixMatch = title.startsWith(query);
    const titleContains = title.includes(query);
    const titleTokens = tokenize(item.title);
    const matchingKeywords = item.keywords.filter((keyword) => normalizeText(keyword).includes(query));
    const matchingTitleTokens = titleTokens.filter((token) => queryTokens.includes(token));
    const prefix = prefixMatch ? 40 + clamp((query.length / Math.max(title.length, 1)) * 16, 0, 16) : titleContains ? 20 : 0;
    const popularity = item.popularity * 0.26;
    const keyword = mode === "keyword"
      ? clamp((keywordMatchCount / Math.max(queryTokens.length, 1)) * 15 + matchingTitleTokens.length * 4, 0, 19)
      : matchingKeywords.length > 0 ? 7 : 2;
    const length = prefixMatch ? clamp(8 - (title.length - query.length) * 0.18, 1, 8) : 1;
    const exact = exactMatch ? 18 : 0;
    const total = clamp(prefix + popularity + keyword + length + exact, 0, 100);
    const matchedTerms = [...new Set([...matchingTitleTokens, ...matchingKeywords.slice(0, 2)])];
    return {
      item,
      score: Math.round(total),
      factors: {
        prefix: Math.round(prefix),
        popularity: Math.round(popularity),
        keyword: Math.round(keyword),
        length: Math.round(length),
        exact,
        total: Math.round(total),
      },
      matchedTerms,
    };
  }
}