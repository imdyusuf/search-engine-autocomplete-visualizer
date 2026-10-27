import { describe, expect, it } from "vitest";
import { SearchEngine } from "@/search/SearchEngine";
import type { SearchItem } from "@/types/search";

const items: SearchItem[] = [
  { id: "java", title: "Java", description: "A JVM language for backend services.", category: "Language", keywords: ["jvm", "backend"], popularity: 92, preset: "programming" },
  { id: "javascript", title: "JavaScript", description: "A frontend language with an event loop.", category: "Language", keywords: ["frontend", "web"], popularity: 98, preset: "programming" },
  { id: "react", title: "React", description: "A component library for frontend interfaces.", category: "Framework", keywords: ["frontend", "components"], popularity: 97, preset: "programming" },
  { id: "trie", title: "Trie", description: "A prefix tree for autocomplete.", category: "Data Structure", keywords: ["prefix", "search"], popularity: 80, preset: "computer-science" },
];

describe("SearchEngine", () => {
  it("uses the trie for normalized prefix autocomplete and limits results", () => {
    const engine = new SearchEngine(items);
    const response = engine.autocomplete(" JAV ", 1);

    expect(response.stats.indexType).toBe("trie");
    expect(response.stats.candidates).toBe(2);
    expect(response.results).toHaveLength(1);
    expect(response.results[0].item.title).toBe("Java");
  });

  it("uses a title map for exact search", () => {
    const engine = new SearchEngine(items);
    const response = engine.search(" REACT ", "exact");

    expect(response.stats.indexType).toBe("hash-map");
    expect(response.results.map((entry) => entry.item.title)).toEqual(["React"]);
  });

  it("uses the inverted index for keyword search", () => {
    const engine = new SearchEngine(items);
    const response = engine.search("frontend", "keyword");

    expect(response.stats.indexType).toBe("inverted-index");
    expect(response.results.map((entry) => entry.item.id)).toEqual(expect.arrayContaining(["javascript", "react"]));
  });

  it("returns a stable no-results response for unmatched queries", () => {
    const engine = new SearchEngine(items);
    const response = engine.search("quantum zebra", "prefix");

    expect(response.results).toEqual([]);
    expect(response.stats.candidates).toBe(0);
  });
});