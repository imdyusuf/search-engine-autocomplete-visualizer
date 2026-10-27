import type { TrieVisualNode } from "@/types/search";

interface TrieVisualizerProps {
  tree: TrieVisualNode;
  selectedPrefix: string;
  onSelect: (prefix: string) => void;
}

function TreeBranch({ node, selectedPrefix, onSelect }: { node: TrieVisualNode; selectedPrefix: string; onSelect: (prefix: string) => void }) {
  const active = node.prefix === selectedPrefix;
  const label = node.char === " " ? "space" : node.char;
  return (
    <li className="trie-branch">
      <button
        type="button"
        onClick={() => onSelect(node.prefix)}
        className={`trie-node ${node.isPath ? "is-path" : ""} ${node.isCurrent ? "is-current" : ""} ${active ? "is-selected" : ""}`}
        aria-label={`${node.char === "root" ? "Root" : `Trie node ${label}`}, depth ${node.depth}, ${node.subtreeTerms} indexed terms below`}
      >
        <span>{node.char === "root" ? "root" : label}</span>
        {node.terminalCount > 0 && <i aria-label="word ending" />}
      </button>
      {node.children.length > 0 && (
        <ul className="trie-children">
          {node.children.map((child) => <TreeBranch key={child.id} node={child} selectedPrefix={selectedPrefix} onSelect={onSelect} />)}
          {node.hasMore && <li className="trie-more" aria-label="More trie branches">+{node.childCount - node.children.length}</li>}
        </ul>
      )}
    </li>
  );
}

export function TrieVisualizer({ tree, selectedPrefix, onSelect }: TrieVisualizerProps) {
  return (
    <div className="trie-scroll" aria-label="Interactive trie structure">
      <ul className="trie-tree">
        <TreeBranch node={tree} selectedPrefix={selectedPrefix} onSelect={onSelect} />
      </ul>
    </div>
  );
}