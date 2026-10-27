import type { NodeDetails, TrieVisualNode } from "@/types/search";

export class TrieNode {
  public readonly children = new Map<string, TrieNode>();
  public readonly documentIds = new Set<string>();
  public subtreeTerms = 0;
}

export interface PrefixLookup {
  found: boolean;
  node?: TrieNode;
  traversed: string[];
  nodesVisited: number;
}

export interface CandidateCollection {
  ids: string[];
  nodesVisited: number;
}

export class Trie {
  public readonly root = new TrieNode();
  private nodeCount = 1;

  public insert(term: string, documentId: string): void {
    if (!term) return;
    let node = this.root;
    const visited = [node];
    for (const char of term) {
      let next = node.children.get(char);
      if (!next) {
        next = new TrieNode();
        node.children.set(char, next);
        this.nodeCount += 1;
      }
      node = next;
      visited.push(node);
    }
    if (node.documentIds.has(documentId)) return;
    node.documentIds.add(documentId);
    visited.forEach((visitedNode) => { visitedNode.subtreeTerms += 1; });
  }

  public lookup(prefix: string): PrefixLookup {
    let node = this.root;
    let nodesVisited = 1;
    const traversed: string[] = [];
    for (const char of prefix) {
      const next = node.children.get(char);
      if (!next) return { found: false, traversed, nodesVisited };
      node = next;
      traversed.push(char);
      nodesVisited += 1;
    }
    return { found: true, node, traversed, nodesVisited };
  }

  public collect(node: TrieNode, limit = Number.POSITIVE_INFINITY): CandidateCollection {
    const ids: string[] = [];
    let nodesVisited = 0;
    const visit = (current: TrieNode): void => {
      if (ids.length >= limit) return;
      nodesVisited += 1;
      current.documentIds.forEach((id) => {
        if (ids.length < limit) ids.push(id);
      });
      if (ids.length >= limit) return;
      current.children.forEach(visit);
    };
    visit(node);
    return { ids, nodesVisited };
  }

  public get size(): number {
    return this.nodeCount;
  }

  public getNodeDetails(prefix: string): NodeDetails | null {
    const lookup = this.lookup(prefix);
    if (!lookup.found || !lookup.node) return null;
    return {
      char: prefix.at(-1) ?? "root",
      prefix,
      depth: prefix.length,
      children: lookup.node.children.size,
      isWord: lookup.node.documentIds.size > 0,
      wordsBelow: lookup.node.subtreeTerms,
    };
  }

  public makeVisualTree(prefix: string, breadth = 6, descendantDepth = 2): TrieVisualNode {
    const lookup = this.lookup(prefix);
    const path = prefix;
    const create = (
      node: TrieNode,
      char: string,
      nodePrefix: string,
      depth: number,
      remaining: number,
      pathPosition: number,
    ): TrieVisualNode => {
      const isPath = pathPosition <= path.length && nodePrefix === path.slice(0, nodePrefix.length);
      const isCurrent = lookup.found && nodePrefix === path;
      const branches = [...node.children.entries()].sort((a, b) => b[1].subtreeTerms - a[1].subtreeTerms);
      let visible = branches.slice(0, breadth);
      if (pathPosition < path.length) {
        const requiredChar = path[pathPosition];
        const required = node.children.get(requiredChar);
        if (required && !visible.some(([key]) => key === requiredChar)) {
          visible = [...visible.slice(0, Math.max(0, breadth - 1)), [requiredChar, required]];
        }
      }
      const shouldExpand = nodePrefix === "" || isCurrent || (pathPosition < path.length && isPath);
      const children = shouldExpand && remaining > 0
        ? visible.map(([key, child]) => create(child, key, `${nodePrefix}${key}`, depth + 1, remaining - 1, pathPosition + 1))
        : [];
      return {
        id: nodePrefix || "root",
        char,
        prefix: nodePrefix,
        depth,
        childCount: node.children.size,
        terminalCount: node.documentIds.size,
        subtreeTerms: node.subtreeTerms,
        isPath,
        isCurrent,
        hasMore: branches.length > visible.length,
        children,
      };
    };

    if (prefix && lookup.found) {
      return create(this.root, "root", "", 0, prefix.length + descendantDepth, 0);
    }
    return create(this.root, "root", "", 0, 2, 0);
  }
}