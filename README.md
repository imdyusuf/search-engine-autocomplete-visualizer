# SearchLab Engine

SearchLab Engine is a browser-only mini search engine and algorithm explorer built for a software engineering portfolio. It pairs a polished search interface with an inspectable view of how autocomplete, ranking, and lightweight full-text search work internally.

Everything runs locally in the browser. There is no backend, account system, external search service, or network dependency for indexing.

## Highlights

- Trie-backed autocomplete with live prefix-path visualization
- Prefix, exact, and keyword search modes
- Lightweight inverted index for title, description, category, and keyword search
- Hash-map document metadata and exact-title lookup
- Heap-based Top-K candidate selection rather than sorting every candidate
- Deterministic multi-factor ranking with per-result score explanations
- Actual traversal, candidate, heap, and timing metrics
- Trie versus linear-scan browser benchmark
- Keyboard-accessible autocomplete with Arrow Up, Arrow Down, Enter, and Escape
- Local search history and custom term persistence through `localStorage`
- Dataset presets, custom term insertion, and line-based mini dataset import
- Responsive developer mode and simplified search mode

## Data Structures And Algorithms

| Structure / algorithm | Role in SearchLab | Complexity |
| --- | --- | --- |
| Trie | Traverses titles character-by-character for autocomplete and prefix candidate generation | Lookup: `O(m)`, plus descendant traversal |
| Hash Map (`Map`) | Stores document metadata and normalized exact-title lookup | `O(1)` average lookup |
| Inverted Index (`Map<string, Set<string>>`) | Maps normalized terms to matching document IDs for keyword search | `O(q + p)` for query token lookup and posting traversal |
| Min Heap / Priority Queue | Keeps only the top `k` scored candidates during ranking | Push/pop: `O(log k)` |
| Linear scan | Included solely as an actual baseline for prefix benchmark comparison | `O(n)` title checks |

The bundled dataset contains hundreds of generated-but-meaningful software engineering records across programming, computer science, and technology. Each record has a title, description, category, keywords, popularity score, and preset metadata.

## Search Pipeline

```text
Query
  -> Normalize whitespace and casing
  -> Trie / Hash Map / Inverted Index lookup
  -> Candidate collection
  -> Multi-factor scoring
  -> Min-heap Top-K selection
  -> Ranked results and live metrics
```

`prefix` mode uses the Trie as its primary candidate generator. `exact` mode performs a normalized title lookup through a hash map. `keyword` mode obtains document candidates from the inverted index, which is intentionally different from the Trie: a Trie answers "which titles start with this character sequence?" while an inverted index answers "which documents contain this normalized token?"

## Ranking

Every candidate is scored deterministically. The application exposes the score contribution for each returned result:

```text
score = prefix quality
      + popularity contribution
      + keyword relevance
      + concise-title contribution
      + exact-title bonus
```

Prefix quality rewards titles beginning with the query, with shorter completions ranked more highly. Popularity contributes a bounded fraction of the item metadata. Keyword matching matters most in keyword mode, and an exact normalized title receives an explicit bonus. Candidates are fed into a reusable min heap; when the heap reaches `k`, only candidates better than the current minimum replace it.

## Architecture

```text
src/
  components/
    Highlight.tsx             Matching text renderer
    Icon.tsx                  Local SVG icon set
    TrieVisualizer.tsx        Clickable tree rendering
  data/
    dataset.ts                Bundled dataset, presets, custom item factory
  search/
    SearchEngine.ts           Search controller and ranking orchestration
  structures/
    Trie.ts                   Trie insert, prefix lookup, candidate traversal, view data
    PriorityQueue.ts          Generic binary min heap
    InvertedIndex.ts          Token-to-document posting lists
  types/
    search.ts                 Shared strict TypeScript types
  utils/
    normalization.ts          Text normalization and tokenization
  App.tsx                     Responsive application composition and interaction state
```

The data structures and search engine are independent from React. React is responsible for input state, local persistence, keyboard behavior, and visualizing immutable search responses.

## Running Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production Build

```bash
npm run build
npm run preview
```

This is a static Vite application. Deploy the generated `dist/` directory to GitHub Pages, Netlify, Cloudflare Pages, Vercel, or any static host.

## Tests

Focused Vitest suites cover the core engine behavior:

```bash
npx vitest run
```

The included test cases cover Trie insert/traversal/missing-prefix/duplicate behavior, min-heap ordering and replacement, normalized autocomplete, Top-K behavior, exact hash-map search, keyword inverted-index search, and no-result responses.

## Engineering Decisions

**Trie for autocomplete.** Prefix lookup traverses only the query path rather than checking each title. The visualizer intentionally limits displayed branch depth and breadth so the structure remains understandable without changing search correctness.

**Inverted index for keyword search.** Prefix and full-text search are separate problems. Indexing tokenized document fields into posting sets enables keyword candidate generation without trying to turn a Trie into a document search engine.

**Min heap for Top-K.** Candidate collection can produce more documents than the UI needs. Maintaining a heap of size `k` avoids sorting every candidate when only the best results are displayed.

**Measured metrics.** Search time, ranking time, nodes visited, collected candidates, and heap size come from the implementation. The benchmark repeatedly measures the current browser, dataset, and query, so it explicitly avoids claiming the Trie is always faster.

**Local-first state.** Search history and custom items use `localStorage`; no user search data is transmitted.

## Accessibility And Responsive Behavior

- The search field uses `combobox`, `listbox`, and `option` semantics.
- Suggestions support Arrow Up, Arrow Down, Enter, and Escape.
- Buttons, fields, and interactive Trie nodes have visible focus treatments and accessible labels.
- The visualizer is horizontally scrollable inside its own container on small displays, preventing page-level overflow.
- Developer metrics collapse into a vertical layout on tablet and mobile.
- Animation and transitions respect `prefers-reduced-motion`.

## Future Improvements

- Fuzzy matching and edit-distance suggestions
- Query suggestions informed by local search history
- BM25-style field weighting for keyword relevance
- Stemming and richer language-aware tokenization
- Web Worker indexing for much larger custom datasets
- Virtualized result lists and broader benchmark reporting

## Resume-Ready Description

Built **SearchLab Engine**, a browser-based search and autocomplete visualizer using React and TypeScript. Implemented Trie-driven prefix autocomplete, hash-map exact lookup, inverted-index keyword search, deterministic relevance ranking, and a reusable min-heap for Top-K selection; added interactive Trie inspection, measured search metrics, local dataset management, responsive UI, keyboard accessibility, and unit tests for the core data structures.