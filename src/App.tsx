import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Highlight } from "@/components/Highlight";
import { Icon } from "@/components/Icon";
import { TrieVisualizer } from "@/components/TrieVisualizer";
import { createCustomItem, getPresetDataset } from "@/data/dataset";
import { SearchEngine } from "@/search/SearchEngine";
import type { BenchmarkResult, DatasetPreset, SearchItem, SearchMode, SearchResult } from "@/types/search";
import { normalizeText } from "@/utils/normalization";

const HISTORY_KEY = "searchlab-history-v1";
const CUSTOM_TERMS_KEY = "searchlab-custom-terms-v1";

const modes: { id: SearchMode; label: string; detail: string }[] = [
  { id: "prefix", label: "Prefix", detail: "Trie autocomplete" },
  { id: "exact", label: "Exact", detail: "Hash map lookup" },
  { id: "keyword", label: "Keyword", detail: "Inverted index" },
];

const pipelineStages = ["Normalize", "Index lookup", "Collect", "Rank", "Top-K", "Results"];

function readHistory(): string[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    const value: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string").slice(0, 6) : [];
  } catch {
    return [];
  }
}

function readCustomTerms(): SearchItem[] {
  try {
    const raw = window.localStorage.getItem(CUSTOM_TERMS_KEY);
    const value: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(value) ? value as SearchItem[] : [];
  } catch {
    return [];
  }
}

function formatMilliseconds(value: number): string {
  return `${value < 0.1 ? value.toFixed(3) : value.toFixed(2)} ms`;
}

function modeName(mode: SearchMode): string {
  return modes.find((entry) => entry.id === mode)?.label ?? mode;
}

function ResultRow({ result, rank, query, expanded, onToggle }: { result: SearchResult; rank: number; query: string; expanded: boolean; onToggle: () => void }) {
  const { item, factors, score } = result;
  return (
    <article className="result-row">
      <div className="result-rank" aria-label={`Rank ${rank}`}><span>#{rank}</span><strong>{score}</strong></div>
      <div className="min-w-0 flex-1">
        <div className="result-title-line"><h3><Highlight text={item.title} query={query} /></h3>{item.isCustom && <span className="custom-tag">local</span>}</div>
        <div className="result-meta"><span>{item.category}</span><span>Popularity {item.popularity}</span>{result.matchedTerms.length > 0 && <span>Matched {result.matchedTerms.slice(0, 2).join(", ")}</span>}</div>
        <p>{item.description}</p>
        <button type="button" className="why-button" onClick={onToggle} aria-expanded={expanded}> {expanded ? "Hide ranking rationale" : "Why this result"}<Icon name="chevronDown" size={14} className={expanded ? "rotate-180" : ""} /></button>
        {expanded && <div className="ranking-rationale" aria-label={`Ranking rationale for ${item.title}`}>
          <div><span>Prefix match</span><b>+{factors.prefix}</b></div><div><span>Popularity</span><b>+{factors.popularity}</b></div><div><span>Keyword relevance</span><b>+{factors.keyword}</b></div><div><span>Concise title</span><b>+{factors.length}</b></div>{factors.exact > 0 && <div><span>Exact title</span><b>+{factors.exact}</b></div>}<div className="ranking-total"><span>Total score</span><b>{factors.total}</b></div>
        </div>}
      </div>
      <div className="result-score-bar" aria-label={`Relevance ${score} percent`}><span style={{ height: `${score}%` }} /></div>
    </article>
  );
}

export default function App() {
  const [developerMode, setDeveloperMode] = useState(true);
  const [mode, setMode] = useState<SearchMode>("prefix");
  const [preset, setPreset] = useState<DatasetPreset>("all");
  const [customTerms, setCustomTerms] = useState<SearchItem[]>(readCustomTerms);
  const [query, setQuery] = useState("jav");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [history, setHistory] = useState<string[]>(readHistory);
  const [selectedPrefix, setSelectedPrefix] = useState("jav");
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const [pipelineStep, setPipelineStep] = useState(5);
  const [benchmark, setBenchmark] = useState<BenchmarkResult | null>(null);
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("Custom Concept");
  const [popularity, setPopularity] = useState(65);
  const [importText, setImportText] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const dataset = useMemo(() => [...getPresetDataset(preset), ...customTerms], [preset, customTerms]);
  const engine = useMemo(() => new SearchEngine(dataset), [dataset]);
  const suggestions = useMemo(() => engine.autocomplete(query, 8), [engine, query]);
  const searchResponse = useMemo(() => engine.search(query, mode, 18), [engine, mode, query]);
  const indexStats = useMemo(() => engine.getStatistics(), [engine]);
  const trieTree = useMemo(() => engine.getTrieView(query), [engine, query]);
  const nodeDetails = engine.getNodeDetails(selectedPrefix) ?? engine.getNodeDetails("");

  useEffect(() => { window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); }, [history]);
  useEffect(() => { window.localStorage.setItem(CUSTOM_TERMS_KEY, JSON.stringify(customTerms)); }, [customTerms]);

  useEffect(() => {
    setSelectedPrefix(normalizeText(query));
    setExpandedResult(null);
    setBenchmark(null);
  }, [query, engine]);

  useEffect(() => {
    if (!query.trim()) { setPipelineStep(0); return undefined; }
    setPipelineStep(0);
    const timers = pipelineStages.map((_, index) => window.setTimeout(() => setPipelineStep(index), 90 + index * 70));
    return () => timers.forEach(window.clearTimeout);
  }, [query, mode, engine]);

  const addToHistory = (value: string) => {
    const clean = value.trim();
    if (!clean) return;
    setHistory((existing) => [clean, ...existing.filter((entry) => normalizeText(entry) !== normalizeText(clean))].slice(0, 6));
  };
  const submitSearch = () => { if (!query.trim()) return; addToHistory(query); setSuggestionsOpen(false); setActiveSuggestion(-1); };
  const selectSuggestion = (value: string) => { setQuery(value); addToHistory(value); setSuggestionsOpen(false); setActiveSuggestion(-1); inputRef.current?.focus(); };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!suggestions.results.length) return;
      setSuggestionsOpen(true);
      setActiveSuggestion((current) => {
        if (current === -1) return event.key === "ArrowDown" ? 0 : suggestions.results.length - 1;
        return event.key === "ArrowDown" ? (current + 1) % suggestions.results.length : (current - 1 + suggestions.results.length) % suggestions.results.length;
      });
      return;
    }
    if (event.key === "Enter") { event.preventDefault(); const active = suggestions.results[activeSuggestion]; if (suggestionsOpen && active) selectSuggestion(active.item.title); else submitSearch(); return; }
    if (event.key === "Escape") { setSuggestionsOpen(false); setActiveSuggestion(-1); }
  };

  const addCustomTerm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const clean = term.trim();
    if (clean.length < 2) { setFormMessage("Use at least two characters for a term."); return; }
    if (engine.hasTitle(clean)) { setFormMessage(`"${clean}" is already in this active index.`); return; }
    const item = createCustomItem(clean, category, popularity);
    setCustomTerms((items) => [...items, item]);
    setTerm("");
    setFormMessage(`Indexed ${item.title} locally.`);
    setQuery(item.title);
  };

  const importTerms = () => {
    const seen = new Set(dataset.map((item) => normalizeText(item.title)));
    const additions = importText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).filter((line) => line.length >= 2 && !seen.has(normalizeText(line))).map((line, index) => { seen.add(normalizeText(line)); return { ...createCustomItem(line, "Imported Term", 55), id: `imported-${Date.now()}-${index}` }; });
    if (!additions.length) { setFormMessage("No new lines were available to index."); return; }
    setCustomTerms((items) => [...items, ...additions]);
    setImportText("");
    setFormMessage(`Indexed ${additions.length} imported terms locally.`);
  };

  const changePreset = (next: DatasetPreset) => { setPreset(next); setQuery(""); setSuggestionsOpen(false); setBenchmark(null); setFormMessage(`Rebuilt the ${next === "all" ? "complete" : next.replace("-", " ")} index.`); };
  const activeModeDetail = modes.find((entry) => entry.id === mode)?.detail ?? "";
  const complexity = mode === "prefix" ? "Traverse O(m), then visit matching descendants; Top-K selection is O(c log k)." : mode === "exact" ? "Average O(1) title lookup through a hash map." : "Posting-list lookup O(q + p), then Top-K selection O(c log k).";

  return <div className="app-shell">
    <header className="site-header">
      <a className="brand" href="#search" aria-label="SearchLab home"><span className="brand-mark"><Icon name="command" size={20} /></span><span><strong>SearchLab</strong><small>MINI SEARCH ENGINE</small></span></a>
      <div className="header-actions">
        <button type="button" className={`mode-toggle ${developerMode ? "is-developer" : ""}`} onClick={() => setDeveloperMode((value) => !value)} aria-pressed={developerMode}><Icon name="code" size={15} /><span>{developerMode ? "Developer mode" : "Simple mode"}</span><i /></button>
        <a className="github-link" href="https://github.com/" target="_blank" rel="noreferrer"><Icon name="github" size={17} /><span>GitHub</span><Icon name="external" size={12} /></a>
      </div>
    </header>

    <main>
      <section className="search-hero" id="search">
        <div className="hero-orbit orbit-one" aria-hidden="true" /><div className="hero-orbit orbit-two" aria-hidden="true" />
        <div className="section-kicker"><span /> Browser-native search playground</div>
        <h1>SearchLab <em>Engine</em></h1>
        <p>Explore how autocomplete, indexing, and ranking work in a live, inspectable search system.</p>
        <div className="search-control-wrap">
          <div className="search-control" role="search"><Icon name="search" size={22} />
            <input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setSuggestionsOpen(true); setActiveSuggestion(-1); }} onFocus={() => setSuggestionsOpen(true)} onBlur={() => window.setTimeout(() => setSuggestionsOpen(false), 130)} onKeyDown={handleInputKeyDown} placeholder="Try javascript, trie, docker..." type="search" role="combobox" aria-autocomplete="list" aria-controls="autocomplete-list" aria-expanded={suggestionsOpen && Boolean(query.trim())} aria-activedescendant={activeSuggestion >= 0 ? `suggestion-${activeSuggestion}` : undefined} aria-label="Search the local engineering index" />
            <kbd>ESC</kbd><button type="button" onClick={submitSearch} aria-label="Search index"><Icon name="arrowRight" size={20} /></button>
          </div>
          {suggestionsOpen && query.trim() && <div className="suggestion-menu" id="autocomplete-list" role="listbox" aria-label="Autocomplete suggestions">
            <div className="suggestion-menu-head"><span><Icon name="tree" size={14} /> Trie candidates</span><b>{suggestions.stats.candidates} found</b></div>
            {suggestions.results.length > 0 ? suggestions.results.map((suggestion, index) => <button key={suggestion.item.id} id={`suggestion-${index}`} type="button" role="option" aria-selected={activeSuggestion === index} className={activeSuggestion === index ? "is-active" : ""} onMouseDown={(event) => event.preventDefault()} onClick={() => selectSuggestion(suggestion.item.title)}><span className="suggestion-icon"><Icon name="search" size={15} /></span><span className="suggestion-copy"><strong><Highlight text={suggestion.item.title} query={query} /></strong><small>{suggestion.item.category}</small></span><b>{suggestion.score}</b></button>) : <p className="no-suggestion">No title begins with <strong>{query}</strong></p>}
            <div className="suggestion-footer"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> select</span></div>
          </div>}
        </div>
        <div className="mode-selector" aria-label="Search modes">{modes.map((entry) => <button key={entry.id} type="button" onClick={() => setMode(entry.id)} className={mode === entry.id ? "is-active" : ""} aria-pressed={mode === entry.id}><span>{entry.label}</span><small>{entry.detail}</small></button>)}</div>
        <div className="hero-index-line"><span className="status-dot" /> <b>{indexStats.documents.toLocaleString()}</b> documents in this local index <span className="hero-line-divider" /> No network requests</div>
      </section>

      <div className={`workspace ${developerMode ? "with-explorer" : "simple-workspace"}`}>
        <section className="surface results-surface" aria-labelledby="results-heading">
          <div className="surface-heading"><div><span className="eyebrow">{modeName(mode)} search</span><h2 id="results-heading">{query ? <>Results for <mark>"{query}"</mark></> : "Ready to search"}</h2></div><div className="results-count"><strong>{searchResponse.stats.returned}</strong><span>of {searchResponse.stats.candidates} ranked</span></div></div>
          {query && searchResponse.results.length > 0 ? <div className="results-list">{searchResponse.results.map((result, index) => <ResultRow key={result.item.id} result={result} rank={index + 1} query={query} expanded={expandedResult === result.item.id} onToggle={() => setExpandedResult((current) => current === result.item.id ? null : result.item.id)} />)}</div> : query ? <div className="empty-state"><Icon name="search" size={24} /><h3>No indexed match</h3><p>{mode === "prefix" ? "Try a shorter prefix or switch to keyword search for descriptions and metadata." : "Try related engineering terminology or switch search modes."}</p></div> : <div className="empty-state"><Icon name="spark" size={24} /><h3>Your local search lab is ready</h3><p>Try a programming language, data structure, or developer tool.</p></div>}
          <div className="history-block"><div><Icon name="history" size={16} /><span>Recent local searches</span></div>{history.length > 0 ? <ul>{history.map((entry) => <li key={entry}><button type="button" onClick={() => { setQuery(entry); addToHistory(entry); }}>{entry}</button><button type="button" onClick={() => setHistory((items) => items.filter((item) => item !== entry))} aria-label={`Remove ${entry} from search history`}><Icon name="x" size={13} /></button></li>)}</ul> : <p>Searches stay in your browser and appear here.</p>}{history.length > 0 && <button type="button" className="clear-history" onClick={() => setHistory([])}>Clear history</button>}</div>
        </section>

        {developerMode && <aside className="surface trie-surface" aria-labelledby="trie-heading">
          <div className="surface-heading compact"><div><span className="eyebrow"><Icon name="tree" size={13} /> Live data structure</span><h2 id="trie-heading">Trie traversal</h2></div><span className="trie-query">{query ? `/${normalizeText(query)}` : "root"}</span></div>
          <p className="surface-intro">Cyan follows the prefix path. Violet marks the current prefix node; click any node to inspect it.</p>
          <TrieVisualizer tree={trieTree} selectedPrefix={selectedPrefix} onSelect={setSelectedPrefix} />
          {nodeDetails && <div className="node-details"><div className="node-details-head"><span>Node details</span><b>{nodeDetails.prefix ? `"${nodeDetails.prefix}"` : "root"}</b></div><dl><div><dt>Character</dt><dd>{nodeDetails.char === " " ? "space" : nodeDetails.char}</dd></div><div><dt>Depth</dt><dd>{nodeDetails.depth}</dd></div><div><dt>Children</dt><dd>{nodeDetails.children}</dd></div><div><dt>Completes word</dt><dd>{nodeDetails.isWord ? "Yes" : "No"}</dd></div><div><dt>Terms below</dt><dd>{nodeDetails.wordsBelow}</dd></div></dl></div>}
        </aside>}
      </div>

      {developerMode && <>
        <section className="pipeline-section" aria-labelledby="pipeline-heading"><div className="pipeline-title"><span className="eyebrow">Request trace</span><h2 id="pipeline-heading">From query to ranked results</h2><p>{query ? `"${normalizeText(query)}" uses ${activeModeDetail.toLocaleLowerCase()} before the result set is finalized.` : "Enter a query to animate the request pipeline."}</p></div><div className="pipeline-track">{pipelineStages.map((stage, index) => <div key={stage} className={`pipeline-stage ${index <= pipelineStep ? "is-complete" : ""} ${index === pipelineStep ? "is-current" : ""}`}><span>{String(index + 1).padStart(2, "0")}</span><b>{index === 1 ? (mode === "prefix" ? "Trie lookup" : mode === "exact" ? "Hash map" : "Inverted index") : stage}</b></div>)}</div></section>
        <section className="developer-grid" aria-label="Developer search metrics">
          <article className="surface metrics-surface"><div className="surface-heading compact"><div><span className="eyebrow"><Icon name="barChart" size={13} /> Actual execution metrics</span><h2>Search statistics</h2></div><span className="metric-query">{searchResponse.stats.indexType}</span></div><dl className="metrics-table"><div><dt>Normalized query</dt><dd>{searchResponse.stats.normalizedQuery || "-"}</dd></div><div><dt>Traversal depth</dt><dd>{searchResponse.stats.traversalDepth}</dd></div><div><dt>Nodes visited</dt><dd>{searchResponse.stats.nodesVisited}</dd></div><div><dt>Candidates collected</dt><dd>{searchResponse.stats.candidates}</dd></div><div><dt>Heap / Top-K</dt><dd>{searchResponse.stats.heapSize} / {searchResponse.stats.topK}</dd></div><div><dt>Ranking time</dt><dd>{formatMilliseconds(searchResponse.stats.rankingTimeMs)}</dd></div><div><dt>Total search time</dt><dd className="metric-highlight">{formatMilliseconds(searchResponse.stats.searchTimeMs)}</dd></div></dl></article>
          <article className="surface complexity-surface"><div className="surface-heading compact"><div><span className="eyebrow"><Icon name="code" size={13} /> Complexity lens</span><h2>Why this structure?</h2></div></div><div className="complexity-code"><span>{mode === "prefix" ? "Trie prefix lookup" : mode === "exact" ? "Hash map lookup" : "Inverted index lookup"}</span><strong>{mode === "prefix" ? "O(m) + traversal" : mode === "exact" ? "O(1) average" : "O(q + p)"}</strong></div><p>{complexity}</p><div className="benchmark-block"><div><span>Prefix benchmark</span><small>Actual browser timings; results depend on dataset size and query shape.</small></div><button type="button" onClick={() => setBenchmark(engine.benchmark(query))} disabled={!query.trim()}><Icon name="clock" size={14} /> Run comparison</button></div>{benchmark && <div className="benchmark-results"><div><span>Trie</span><b>{formatMilliseconds(benchmark.trieMs)}</b><small>{benchmark.trieCandidates} candidates</small></div><div><span>Linear scan</span><b>{formatMilliseconds(benchmark.linearMs)}</b><small>{benchmark.linearCandidates} candidates</small></div></div>}</article>
        </section>
        <section className="structures-section" aria-labelledby="structures-heading"><div className="structures-intro"><span className="eyebrow">The toolkit</span><h2 id="structures-heading">Four structures, four jobs</h2><p>Autocomplete and full-text search have different access patterns. The engine chooses the smallest useful structure for each step.</p></div><div className="structure-list"><article><Icon name="tree" size={20} /><div><h3>Trie</h3><p>Character-by-character prefix traversal for autocomplete.</p><code>lookup: O(m)</code></div></article><article><Icon name="database" size={20} /><div><h3>Hash map</h3><p>Title and metadata access without scanning documents.</p><code>average: O(1)</code></div></article><article><Icon name="layers" size={20} /><div><h3>Inverted index</h3><p>Maps tokens to matching document identifiers.</p><code>term -&gt; posting list</code></div></article><article><Icon name="barChart" size={20} /><div><h3>Min heap</h3><p>Keeps only the best K candidates during ranking.</p><code>push/pop: O(log k)</code></div></article></div></section>
      </>}

      <section className="index-management" aria-labelledby="index-heading"><div className="management-intro"><span className="eyebrow">Local index management</span><h2 id="index-heading">Control the dataset</h2><p>Switch presets or add terms. Each change rebuilds a browser-only Trie, hash map, and inverted index.</p></div><div className="preset-control" aria-label="Dataset presets"><span>Dataset preset</span><div>{(["all", "programming", "computer-science", "technology"] as DatasetPreset[]).map((entry) => <button key={entry} type="button" onClick={() => changePreset(entry)} className={preset === entry ? "is-active" : ""}>{entry === "all" ? "Complete index" : entry.replace("-", " ")}</button>)}</div></div><div className="index-stat-row"><div><span>Terms</span><b>{indexStats.terms.toLocaleString()}</b></div><div><span>Trie nodes</span><b>{indexStats.trieNodes.toLocaleString()}</b></div><div><span>Categories</span><b>{indexStats.categories}</b></div><div><span>Index tokens</span><b>{indexStats.keywords.toLocaleString()}</b></div><div><span>Custom terms</span><b>{customTerms.length}</b></div></div><div className="management-grid"><form className="add-term-form" onSubmit={addCustomTerm}><div className="form-title"><Icon name="plus" size={16} /><span>Add a term to the index</span></div><label>Term<input value={term} onChange={(event) => setTerm(event.target.value)} placeholder="e.g. Web Worker" maxLength={90} /></label><label>Category<input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Custom Concept" maxLength={48} /></label><label className="range-label">Popularity <b>{popularity}</b><input type="range" min="1" max="100" value={popularity} onChange={(event) => setPopularity(Number(event.target.value))} /></label><button type="submit"><Icon name="plus" size={16} /> Add to index</button></form><div className="import-panel"><div className="form-title"><Icon name="layers" size={16} /><span>Import a tiny dataset</span></div><p>Paste one term per line. Every term stays in local storage on this device.</p><textarea value={importText} onChange={(event) => setImportText(event.target.value)} placeholder={"React Server Components\nVector Database\nWeb Worker"} maxLength={2000} /><div className="import-actions"><button type="button" onClick={importTerms} disabled={!importText.trim()}>Import lines</button><button type="button" className="danger-button" onClick={() => { setCustomTerms([]); setFormMessage("Removed all locally added terms."); }} disabled={!customTerms.length}><Icon name="trash" size={14} /> Reset custom data</button></div></div></div>{formMessage && <p className="form-message"><Icon name="info" size={14} /> {formMessage}</p>}</section>
    </main>
    <footer><div className="brand"><span className="brand-mark"><Icon name="command" size={18} /></span><span><strong>SearchLab</strong><small>MINI SEARCH ENGINE</small></span></div><p>Built to explore practical search algorithms, data structures, and frontend engineering.</p><span>React + TypeScript <i /> Trie <i /> Hash map <i /> Heap <i /> Inverted index</span></footer>
  </div>;
}