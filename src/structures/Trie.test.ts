import { describe, expect, it } from "vitest";
import { Trie } from "@/structures/Trie";

describe("Trie", () => {
  it("inserts terms and traverses an existing prefix", () => {
    const trie = new Trie();
    trie.insert("react", "react");
    trie.insert("read", "read");
    const lookup = trie.lookup("rea");

    expect(lookup.found).toBe(true);
    expect(lookup.traversed.join("")).toBe("rea");
    expect(lookup.nodesVisited).toBe(4);
    expect(trie.collect(lookup.node!).ids.sort()).toEqual(["react", "read"]);
  });

  it("reports a missing prefix without throwing", () => {
    const trie = new Trie();
    trie.insert("trie", "trie");

    const lookup = trie.lookup("tree");
    expect(lookup.found).toBe(false);
    expect(lookup.traversed.join("")).toBe("tr");
  });

  it("does not double-count a duplicate document insertion", () => {
    const trie = new Trie();
    trie.insert("go", "go-doc");
    trie.insert("go", "go-doc");

    expect(trie.collect(trie.lookup("go").node!).ids).toEqual(["go-doc"]);
    expect(trie.getNodeDetails("go")?.wordsBelow).toBe(1);
  });

  it("handles empty and one-character terms", () => {
    const trie = new Trie();
    trie.insert("", "ignored");
    trie.insert("c", "c-doc");

    expect(trie.lookup("").found).toBe(true);
    expect(trie.collect(trie.lookup("c").node!).ids).toEqual(["c-doc"]);
  });
});