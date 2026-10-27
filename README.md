# SearchLab Engine - Mini Search Visualizer

**Explore how search engines find, rank, and recommend results—one query at a time.**

SearchLab Engine is an interactive search-engine playground that demonstrates the inner workings of autocomplete, document retrieval, relevance ranking, and top-result selection. It transforms abstract search algorithms into a hands-on experience, allowing users to experiment with queries, explore search structures, inspect ranking decisions, and compare search performance.

Whether you're learning about search algorithms, studying data structures, or simply curious about what happens behind a search box, SearchLab Engine provides a visual and interactive way to understand the process.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Search Modes](#search-modes)
- [How It Works](#how-it-works)
- [Interactive Visualizations](#interactive-visualizations)
- [Understanding Search Rankings](#understanding-search-rankings)
- [Performance Benchmarking](#performance-benchmarking)
- [Getting Started](#getting-started)
- [How to Use](#how-to-use)
- [Working with Custom Data](#working-with-custom-data)
- [Example Searches](#example-searches)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Limitations](#limitations)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Search engines do more than find matching words. They retrieve relevant information, evaluate potential matches, rank results, and present the most useful answers first.

SearchLab Engine makes these operations visible through an interactive search environment.

Instead of treating search as a black box, the project lets you explore the individual stages involved in producing results:

- Enter a query and receive autocomplete suggestions.
- Switch between different search strategies.
- Examine how candidate documents are retrieved.
- Understand why certain results rank above others.
- Explore the structure behind prefix-based search.
- Compare Trie-based prefix lookup with a linear scan.
- Add custom entries and experiment with different datasets.

The application includes a collection of software-engineering-related content and supports interactive experimentation with search behavior.

### Project Goals

- **Make search algorithms understandable:** Turn abstract concepts into observable behavior.
- **Demonstrate practical data structures:** Show how different indexing strategies solve different search problems.
- **Explain relevance ranking:** Reveal the factors contributing to each result's score.
- **Encourage experimentation:** Allow users to change queries, search modes, and searchable content.
- **Explore performance:** Compare alternative approaches using measured execution times.

---

## Key Features

### 1. Real-Time Autocomplete

Receive relevant suggestions as you type.

Autocomplete helps users discover matching titles before submitting a complete query. Suggestions are generated using prefix-based retrieval.

Features include:

- Dynamic suggestions based on the current query.
- Case-insensitive matching.
- Keyboard navigation through suggestions.
- Quick selection of a suggested result.
- Integration with the main search experience.

The goal is to demonstrate how search suggestions can be generated efficiently while providing an intuitive user experience.

### 2. Three Search Modes

Choose the retrieval strategy that best matches the question you want to answer.

| Search Mode | What It Does | Best For |
|---|---|---|
| **Prefix Search** | Finds titles beginning with the entered query. | Autocomplete and partial-title discovery. |
| **Exact Search** | Finds titles matching the complete normalized query. | Looking up a known title. |
| **Keyword Search** | Finds documents containing searchable query terms. | Discovering content by topic or subject. |

Each mode uses a different retrieval approach, making it possible to compare their behavior on the same dataset.

### 3. Interactive Trie Visualization

Explore the tree structure behind prefix-based search.

The visualization represents indexed titles as shared character paths. Prefixes lead to nodes, and branches represent possible continuations.

You can inspect the tree to understand how titles share prefixes and how the search engine navigates the structure.

Highlights include:

- Interactive node selection.
- Visual identification of the current query path.
- Indication of nodes representing complete indexed terms.
- Display of relevant prefix information.
- Controlled tree expansion to keep the visualization manageable.

This feature is especially useful for understanding why a Trie can retrieve prefix matches without examining every title individually.

### 4. Explainable Search Rankings

Every search result has a relevance score based on a combination of ranking factors.

Rather than showing an unexplained list of results, SearchLab Engine allows you to inspect the contributions that influence a result's score.

The ranking model considers factors such as:

- Prefix-match quality.
- Popularity.
- Keyword relevance.
- Title length.
- Exact-title matches.

Expand a result to explore its ranking breakdown and understand why it received its position.

### 5. Search Performance Benchmarking

Compare Trie-based prefix lookup against a straightforward linear scan.

The benchmark measures the execution time of both approaches and reports their observed performance.

Explore how the results change with different queries and matching patterns.

The benchmark helps illustrate an important algorithmic principle: **an approach that performs fewer unnecessary comparisons can offer an advantage, but actual performance depends on the workload and implementation.**

### 6. Search Statistics and Diagnostics

Inspect information about the search process, including:

- Original query.
- Normalized query.
- Selected search mode.
- Number of candidates retrieved.
- Number of results returned.
- Result limit.
- Index traversal information.
- Search execution time.
- Ranking execution time.
- Priority queue size.
- Index type used.

These statistics help connect the visible search results to the operations that produced them.

### 7. Custom Search Entries

Extend the searchable collection without modifying the bundled dataset manually.

Create custom entries with information such as:

- Title.
- Category.
- Keywords.
- Popularity.

The new entries become available to the search engine, allowing you to test how additional content affects retrieval and ranking.

### 8. Dataset Presets

Explore the available dataset presets to change the collection of searchable content.

Presets provide a convenient way to experiment with different content selections without manually adding every entry.

The active collection determines which documents are available for autocomplete and search.

### 9. Import Custom Terms

Add multiple custom entries through the application's import interface.

The import workflow processes nonempty lines as candidate entries and applies input validation and duplicate checks.

This is useful for testing search behavior with your own collections of terms.

### 10. Persistent Search History

Revisit recent queries without entering them again.

The application retains a short history of recent searches in browser storage.

This history is local to the browser and is designed to make repeated experimentation more convenient.

### 11. Keyboard-Friendly Interaction

Navigate autocomplete suggestions using the keyboard.

| Key | Action |
|---|---|
| `Arrow Down` | Move to the next suggestion. |
| `Arrow Up` | Move to the previous suggestion. |
| `Enter` | Select the active suggestion or submit the query. |
| `Escape` | Close the suggestion list. |

This makes the search experience faster and more accessible.

### 12. Multiple Interface Views

The application provides a streamlined experience for everyday searching and a more detailed view for exploring search behavior.

Use the simpler interface to focus on queries and results, or explore the additional visualizations, statistics, and ranking explanations when you want to understand the underlying process.

---

## Search Modes

SearchLab Engine supports three distinct approaches to retrieving information.

Understanding their differences is central to understanding the project.

### Prefix Search

Prefix search finds titles that begin with the entered text.

For example, the query:

`jav`

could match titles such as:

- Java
- Java Programming
- JavaScript
- Java Data Structures

The application uses a **Trie**, a tree organized around character sequences, to locate the requested prefix.

Once the prefix node is found, the engine collects the matching documents and ranks the candidates.

**Use prefix search when:** You are typing a partial title or exploring autocomplete suggestions.

### Exact Search

Exact search looks for a complete title match after text normalization.

For example:

`Java Programming`

can match the complete title `Java Programming` without treating every title beginning with `Java` as an exact match.

Normalization makes matching more consistent across differences in capitalization and whitespace.

The application uses a title lookup map to retrieve the matching document IDs efficiently.

**Use exact search when:** You know the title you want to find.

### Keyword Search

Keyword search finds documents containing terms from the query.

For example:

`graph algorithms`

can retrieve documents associated with `graph`, `algorithms`, or both terms.

The engine uses an **inverted index**, which maps searchable terms to the documents containing them.

Documents matching more query terms can receive a stronger keyword contribution during ranking.

Unlike exact search, keyword search does not require the entire query to match a title.

**Use keyword search when:** You want to discover relevant content by subject rather than by an exact title or prefix.

---

## How It Works

SearchLab Engine organizes the search process into a sequence of distinct stages.

```text
                  USER QUERY
                       |
                       v
              TEXT NORMALIZATION
                       |
                       v
              SELECT SEARCH MODE
                       |
          +------------+------------+
          |            |            |
          v            v            v
       PREFIX        EXACT        KEYWORD
          |            |            |
          v            v            v
         TRIE       TITLE MAP   INVERTED INDEX
          |            |            |
          +------------+------------+
                       |
                       v
               CANDIDATE RETRIEVAL
                       |
                       v
              RELEVANCE SCORING
                       |
                       v
               TOP-K SELECTION
                       |
                       v
               RESULT ORDERING
                       |
                       v
              RESULTS & STATISTICS
```

### Step 1: Normalize the Query

The query is converted into a consistent representation before searching.

Normalization handles:

- Capitalization.
- Leading and trailing whitespace.
- Repeated whitespace.
- Unicode normalization.
- Certain combining diacritical marks.

This reduces unnecessary differences between the text entered by the user and the text stored in the search indexes.

### Step 2: Retrieve Candidate Documents

The selected search mode determines which index is used.

- Prefix search follows a character path in the Trie.
- Exact search looks up a normalized title.
- Keyword search retrieves document IDs from the relevant posting lists.

The result of this stage is a collection of candidate documents that can be evaluated further.

### Step 3: Calculate Relevance Scores

Each candidate receives a score based on the ranking rules.

The scoring model considers how well the document matches the query, its popularity, keyword overlap, title length, and exact-match status.

This helps distinguish stronger matches from weaker ones.

### Step 4: Select the Top Results

When the candidate collection is larger than the requested result limit, a priority queue helps maintain the best candidates.

This avoids requiring a complete sort of every candidate merely to identify a limited number of results.

### Step 5: Present the Results

The selected candidates are ordered for display.

The interface presents the results along with relevant information, ranking explanations, and search statistics.

The result is a search experience in which both the answers and the process behind them can be explored.

---

## Interactive Visualizations

SearchLab Engine includes visual tools designed to make search operations easier to understand.

### Trie Explorer

The Trie Explorer displays the character-based structure used for prefix retrieval.

It helps answer questions such as:

- How are titles with shared prefixes organized?
- What happens when a query follows a valid character path?
- Where does a prefix lookup stop when a character is missing?
- Which nodes represent complete indexed titles?
- How can one prefix lead to multiple matching documents?

Selecting nodes allows you to investigate the structure interactively.

### Ranking Breakdown

The ranking explanation reveals how a result's score is assembled.

It helps answer questions such as:

- Why does one title rank above another?
- How much does an exact match contribute?
- How does popularity affect the score?
- Why can a shorter prefix completion receive a better score?
- How do matching query terms influence keyword search?

The scoring system is deliberately understandable rather than intended to reproduce the complete ranking systems of large commercial search engines.

### Search Diagnostics

The statistics panel exposes information about candidate retrieval and result selection.

You can use it to investigate:

- How many candidates a query produces.
- Whether the result limit is being reached.
- Which retrieval structure is used.
- How the observed execution time changes between queries.
- How many results survive the Top-K selection process.

Together, these tools make SearchLab Engine useful for experimentation, demonstrations, and learning.

---

## Understanding Search Rankings

SearchLab Engine uses a weighted scoring model to estimate the relevance of candidate documents.

The model considers five primary factors.

| Ranking Factor | Purpose |
|---|---|
| Prefix quality | Rewards titles that begin with the query. |
| Popularity | Incorporates the document's popularity value. |
| Keyword relevance | Rewards matching searchable terms. |
| Title length | Can favor shorter prefix completions. |
| Exact-title match | Rewards a complete normalized title match. |

The contributions are combined into a total score capped at 100.

The score helps determine the order in which results appear.

### Why use multiple ranking factors?

Consider a search for `java`.

Several documents may match the query, but not all matches are equally useful.

A title that exactly matches `java` should generally receive an advantage over a longer title that merely begins with the same characters.

Popularity and keyword relevance can provide additional signals when comparing candidates.

Combining these factors demonstrates how a search engine can move beyond simple matching and produce an ordered list of results.

### Important considerations

The ranking formula is a heuristic designed for educational exploration.

It does not guarantee that the first result is always the most useful to every user. Popularity values, title length, and keyword overlap are imperfect indicators of relevance.

The displayed score is a ranking signal, not a probability that the result is correct.

---

## Performance Benchmarking

The built-in benchmark compares two approaches to prefix retrieval.

### Trie-Based Lookup

The Trie follows the query's character path and collects matching candidates from the corresponding subtree.

Its lookup cost depends primarily on query length, while collecting the matching documents requires additional work.

### Linear Scan

The linear approach examines titles one by one and checks whether each title begins with the query.

Its work generally grows with the number of indexed titles.

### What the Benchmark Measures

The benchmark:

1. Runs the Trie-based approach.
2. Runs the linear-scan approach.
3. Repeats each measurement seven times.
4. Calculates the average elapsed time.
5. Reports the number of matching candidates.

### Interpreting the Results

A Trie can offer an advantage when it avoids examining large numbers of unrelated titles.

However, the result depends on the dataset, query length, number of matches, browser conditions, and implementation overhead.

For a small collection, a linear scan may be just as fast or faster.

**The purpose of the benchmark is to encourage measurement and analysis, not to claim that one approach always wins.**

The benchmark focuses on prefix retrieval rather than the entire search pipeline, so its results should not be interpreted as a comparison of complete end-to-end search performance.

---

## Getting Started

Follow these steps to run SearchLab Engine locally.

### Prerequisites

- A computer with a supported Node.js installation.
- npm.
- A modern web browser.

### 1. Download the Project

Clone the repository:

```bash
git clone https://github.com/imdyusuf/search-engine-autocomplete-visualizer
```

### 2. Open the Project Directory

```bash
cd search-engine-autocomplete-visualizer
```

Make sure the directory contains `package.json`.

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Application

```bash
npm run dev
```

Open the local address printed in the terminal.

The application should now be available in your browser.

### 5. Explore the Search Experience

Start with a short query, inspect the suggestions, and switch between the available search modes.

Then explore the Trie visualization, ranking breakdowns, search statistics, and performance benchmark.

You can also add custom entries to experiment with your own searchable content.

---

## How to Use

### Basic Search

1. Open SearchLab Engine.
2. Enter a word or phrase in the search field.
3. Review the autocomplete suggestions.
4. Select a suggestion or submit your query.
5. Explore the returned results.

### Change the Search Mode

1. Choose Prefix, Exact, or Keyword search.
2. Enter a query appropriate to the selected mode.
3. Compare the results with those produced by other modes.
4. Observe how the retrieval strategy affects the candidate set and ranking.

### Explore the Trie

1. Open the Trie visualization.
2. Inspect the character paths representing indexed titles.
3. Follow the path associated with your query.
4. Select nodes to explore the corresponding prefixes.
5. Observe how different titles share parts of the tree.

### Investigate Ranking

1. Perform a search.
2. Expand a result's ranking explanation.
3. Inspect the individual scoring factors.
4. Compare the scores of different results.
5. Change the query and observe how the ranking changes.

### Run a Performance Benchmark

1. Open the benchmarking controls.
2. Select or enter a prefix query.
3. Run the comparison.
4. Review the measured times and candidate counts.
5. Repeat with different prefixes to explore how the workload affects performance.

### Review Search Statistics

After running a query, inspect the available diagnostics.

Compare the number of candidates with the number of returned results and examine the recorded search and ranking times.

This helps explain how the search engine transforms a query into a limited, ordered result set.

---

## Working with Custom Data

SearchLab Engine supports custom entries so you can experiment with content beyond the bundled collection.

### Add an Entry

Use the custom-entry controls to supply a title and the available metadata, such as category, keywords, and popularity.

The application validates the input before adding the entry to the active collection.

### Import Multiple Entries

Use the import interface to submit multiple lines of text.

Nonempty lines are processed as potential entries. Validation and duplicate checks help prevent unsuitable or repeated additions.

### Experiment with Popularity

Create similar titles with different popularity values.

Compare their rankings to see how popularity influences the overall score.

### Experiment with Keywords

Add different keywords to otherwise similar documents.

Use keyword search to observe how the overlap between query terms and document content influences ranking.

### Experiment with Prefixes

Create titles that share the same starting characters.

Then use prefix search and the Trie Explorer to observe how the titles share nodes and branch into different completions.

### Persistence

Custom entries and recent search history are retained in browser storage.

This allows you to continue experimenting after refreshing the page in the same browser environment.

Browser storage is local to the browser and is not a shared database or a synchronization mechanism between users.

---

## Example Searches

The following examples illustrate how to explore different search behaviors. Results depend on the active dataset.

| Query | Suggested Mode | What to Explore |
|---|---|---|
| `jav` | Prefix | Autocomplete and shared prefixes. |
| `javascript` | Exact | Complete-title matching. |
| `python` | Prefix | Matching titles and ranking differences. |
| `graph algorithms` | Keyword | Documents matching one or more query terms. |
| `trie` | Keyword | Topic-based retrieval. |
| A nonexistent title | Exact | No-result behavior. |

For a more controlled experiment, add your own entries and use them to compare the three modes.

---

## Project Structure

The project is organized around search functionality, data structures, visual components, and supporting utilities.

```text
search-engine-autocomplete-visualizer/
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── components/
    │   ├── Highlight.tsx
    │   ├── Icon.tsx
    │   └── TrieVisualizer.tsx
    ├── data/
    │   └── dataset.ts
    ├── search/
    │   ├── SearchEngine.ts
    │   └── SearchEngine.test.ts
    ├── structures/
    │   ├── Trie.ts
    │   ├── Trie.test.ts
    │   ├── InvertedIndex.ts
    │   ├── PriorityQueue.ts
    │   └── PriorityQueue.test.ts
    ├── types/
    │   └── search.ts
    └── utils/
        ├── normalization.ts
        └── cn.ts
```

### Main Areas

| Area | Responsibility |
|---|---|
| Application interface | Search interaction, controls, results, and visualizations. |
| Search engine | Coordinates retrieval, scoring, result selection, and diagnostics. |
| Search structures | Implements prefix indexing, keyword indexing, and priority-based selection. |
| Dataset | Supplies searchable content and supports custom entries. |
| Shared types | Defines the structure of search items, results, and statistics. |
| Utilities | Provides text normalization and supporting functions. |
| Tests | Verify core search operations and data-structure behavior. |

---

## Testing

The project includes automated tests for its core search behavior and data structures.

The tests cover areas such as:

- Trie insertion and prefix lookup.
- Candidate collection.
- Handling missing prefixes.
- Priority queue ordering.
- Heap root replacement.
- Normalized prefix search.
- Exact-title lookup.
- Keyword retrieval.
- Result limits.
- Queries that produce no results.

### Run the Test Suite

From the project directory, run:

```bash
npx vitest run
```

### Verify the Production Build

```bash
npm run build
```

Running both commands is recommended before submitting changes or sharing a new version of the project.

---

## Limitations

SearchLab Engine is an educational search environment rather than a production-scale search service.

Its current limitations include:

- **Limited ranking model:** The scoring formula uses handcrafted weights rather than a full information-retrieval ranking model.
- **No typo-tolerant retrieval:** Prefix search requires a matching character sequence after normalization.
- **Candidate collection costs:** Locating a prefix is only one stage; collecting a large number of matches can still require substantial work.
- **Dataset scale:** The application is designed for interactive experimentation with a manageable collection of documents.
- **Browser-based persistence:** Custom entries and search history are stored locally rather than synchronized across users or devices.
- **Benchmark variability:** Measured performance can vary with the dataset, query, browser, and execution environment.

These limitations are useful starting points for further experimentation and improvement.

---

## Future Enhancements

Possible directions for extending SearchLab Engine include:

- **Fuzzy Search:** Support approximate matches and common typing mistakes.
- **Advanced Ranking:** Explore BM25 or other information-retrieval ranking methods.
- **Field-Specific Weighting:** Assign different relevance weights to titles, descriptions, categories, and keywords.
- **Expanded Benchmarking:** Compare multiple dataset sizes and query patterns using additional statistical measurements.
- **Index Visualization:** Provide more detailed views of posting lists, index contents, and candidate retrieval.
- **Incremental Indexing:** Update search indexes when entries are added or removed without rebuilding the entire engine.
- **Additional Search Strategies:** Experiment with alternative indexing and retrieval approaches.
- **Extended Test Coverage:** Add more edge cases and tests for ranking consistency, imports, and user interactions.

These are potential extensions, not features currently guaranteed by the application.

---

## Contributing

Contributions that improve usability, correctness, accessibility, documentation, or search experimentation are welcome.

To contribute:

1. Fork the repository.
2. Create a branch for your change.
3. Make a focused improvement.
4. Run the automated tests.
5. Verify that the project builds successfully.
6. Submit a pull request describing the change and its purpose.

For substantial changes, consider opening an issue first to discuss the proposed functionality.

When contributing to the search algorithms, include tests for important edge cases and explain any changes to ranking or retrieval behavior.

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Why SearchLab Engine?

SearchLab Engine brings together the major stages of a search experience in one interactive environment.

It demonstrates how search strategies retrieve candidates, how ranking factors influence relevance, and how a priority queue helps select the best results. Its visualizations and diagnostics make these operations easier to inspect, while custom entries and performance benchmarks encourage experimentation.

**Explore the query. Follow the index. Understand the ranking. Measure the performance.**

SearchLab Engine turns the mechanics of search into something you can see, test, and understand.
