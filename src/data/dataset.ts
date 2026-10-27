import type { DatasetPreset, SearchItem } from "@/types/search";

type Seed = {
  title: string;
  category: string;
  preset: Exclude<DatasetPreset, "all">;
  description: string;
  keywords: string[];
  popularity: number;
};

const seeds: Seed[] = [
  // Programming languages and frontend systems
  ["JavaScript", "Programming Language", "programming", "A high-level language used to build interactive web experiences and server-side applications.", ["ecmascript", "web", "frontend", "node"], 98],
  ["TypeScript", "Programming Language", "programming", "A typed superset of JavaScript that improves tooling, refactoring, and maintainability.", ["javascript", "types", "compiler", "web"], 95],
  ["Java", "Programming Language", "programming", "A class-based language widely used for enterprise services, Android development, and the JVM ecosystem.", ["jvm", "object oriented", "enterprise", "backend"], 93],
  ["Python", "Programming Language", "programming", "A readable general-purpose language popular in automation, data science, and backend development.", ["scripting", "data science", "machine learning", "backend"], 96],
  ["C++", "Programming Language", "programming", "A systems language offering low-level control and high-performance abstractions.", ["systems", "performance", "memory", "compiler"], 86],
  ["C#", "Programming Language", "programming", "A modern language for .NET applications, game development, and enterprise software.", ["dotnet", "unity", "microsoft", "backend"], 84],
  ["Go", "Programming Language", "programming", "A compiled language designed for simple, concurrent network services and tooling.", ["golang", "concurrency", "cloud", "backend"], 88],
  ["Rust", "Programming Language", "programming", "A systems language focused on memory safety, performance, and fearless concurrency.", ["systems", "memory safety", "wasm", "concurrency"], 89],
  ["Kotlin", "Programming Language", "programming", "A pragmatic language for Android, backend systems, and interoperable JVM applications.", ["android", "jvm", "mobile", "java"], 80],
  ["Swift", "Programming Language", "programming", "Apple's programming language for iOS, macOS, and modern platform development.", ["ios", "apple", "mobile", "macos"], 78],
  ["Ruby", "Programming Language", "programming", "A dynamic language known for developer ergonomics and the Rails web framework.", ["rails", "web", "dynamic", "backend"], 72],
  ["PHP", "Programming Language", "programming", "A server-side language powering a large portion of the web and content platforms.", ["web", "server", "laravel", "wordpress"], 71],
  ["Scala", "Programming Language", "programming", "A JVM language that blends object-oriented and functional programming styles.", ["functional", "jvm", "spark", "backend"], 65],
  ["Elixir", "Programming Language", "programming", "A functional, fault-tolerant language built on the Erlang virtual machine.", ["erlang", "concurrency", "distributed", "phoenix"], 64],
  ["Dart", "Programming Language", "programming", "A client-optimized language used primarily with Flutter for cross-platform applications.", ["flutter", "mobile", "web", "google"], 66],
  ["SQL", "Programming Language", "programming", "The declarative language used to query, model, and manipulate relational data.", ["database", "query", "relational", "data"], 94],
  ["Bash", "Programming Language", "programming", "A Unix shell language for scripting automation and developer workflows.", ["shell", "terminal", "linux", "automation"], 76],
  ["React", "Frontend Framework", "programming", "A component-based JavaScript library for building declarative user interfaces.", ["ui", "frontend", "components", "javascript"], 97],
  ["Next.js", "Web Framework", "programming", "A React framework for full-stack web applications, routing, and rendering strategies.", ["react", "ssr", "routing", "frontend"], 92],
  ["Vue", "Frontend Framework", "programming", "A progressive framework for building user interfaces with an approachable component model.", ["frontend", "ui", "javascript", "components"], 85],
  ["Angular", "Frontend Framework", "programming", "A TypeScript-first framework for structured, large-scale web applications.", ["typescript", "frontend", "components", "google"], 82],
  ["Svelte", "Frontend Framework", "programming", "A compiler-led UI framework that moves much of its work to build time.", ["frontend", "compiler", "ui", "javascript"], 78],
  ["SolidJS", "Frontend Framework", "programming", "A reactive UI library with fine-grained updates and familiar JSX ergonomics.", ["frontend", "reactive", "jsx", "ui"], 68],
  ["Astro", "Web Framework", "programming", "A content-focused web framework with islands architecture and selective hydration.", ["static site", "frontend", "islands", "content"], 72],
  ["Remix", "Web Framework", "programming", "A full-stack React framework designed around web standards and nested routes.", ["react", "routing", "server rendering", "web"], 67],
  ["Express", "Backend Framework", "programming", "A minimal Node.js framework for APIs, middleware, and web servers.", ["node", "api", "backend", "middleware"], 88],
  ["Fastify", "Backend Framework", "programming", "A high-performance Node.js framework with schema-based APIs and plugins.", ["node", "api", "backend", "performance"], 70],
  ["Django", "Backend Framework", "programming", "A batteries-included Python framework for secure, database-backed web applications.", ["python", "backend", "orm", "web"], 82],
  ["FastAPI", "Backend Framework", "programming", "A modern Python API framework built around type hints and asynchronous interfaces.", ["python", "api", "backend", "async"], 81],
  ["Spring Boot", "Backend Framework", "programming", "A convention-driven Java framework for production-ready services and APIs.", ["java", "jvm", "backend", "microservices"], 84],
  ["Laravel", "Backend Framework", "programming", "A PHP framework with expressive tooling for modern web application development.", ["php", "backend", "web", "eloquent"], 73],
  ["React Native", "Mobile Framework", "programming", "A framework for shipping native mobile apps with React and JavaScript.", ["react", "mobile", "ios", "android"], 83],
  ["Flutter", "Mobile Framework", "programming", "A cross-platform UI toolkit for mobile, desktop, and web applications.", ["dart", "mobile", "ui", "google"], 83],
  ["Node.js", "JavaScript Runtime", "programming", "A JavaScript runtime for event-driven servers, command-line tools, and build pipelines.", ["javascript", "backend", "runtime", "npm"], 94],
  ["Deno", "JavaScript Runtime", "programming", "A secure JavaScript and TypeScript runtime with a modern standard library.", ["typescript", "runtime", "javascript", "server"], 65],
  ["Vite", "Build Tool", "programming", "A fast frontend build tool with instant development startup and optimized production builds.", ["bundler", "frontend", "react", "typescript"], 90],
  ["Webpack", "Build Tool", "programming", "A module bundler that builds dependency graphs for web application assets.", ["bundler", "javascript", "frontend", "modules"], 76],
  ["Tailwind CSS", "CSS Framework", "programming", "A utility-first CSS framework for composing consistent interfaces directly in markup.", ["css", "frontend", "utility", "design system"], 86],
  ["GraphQL", "API Technology", "programming", "A query language and runtime for requesting precisely the data an application needs.", ["api", "schema", "frontend", "backend"], 82],
  ["REST API", "API Technology", "programming", "A resource-oriented architectural style for interoperable HTTP services.", ["http", "backend", "web", "api"], 84],
  ["WebAssembly", "Web Platform", "programming", "A compact binary instruction format for running high-performance code on the web.", ["wasm", "browser", "performance", "systems"], 72],
  ["Jest", "Testing Library", "programming", "A JavaScript testing framework with assertions, mocks, and snapshots.", ["testing", "javascript", "unit test", "frontend"], 77],
  ["Vitest", "Testing Library", "programming", "A Vite-native unit test framework designed for fast feedback in TypeScript projects.", ["testing", "vite", "typescript", "unit test"], 69],

  // Computer science and data structures
  ["Trie", "Data Structure", "computer-science", "A tree of characters optimized for prefix lookup, autocomplete, and dictionary traversal.", ["prefix", "autocomplete", "tree", "strings"], 84],
  ["Hash Map", "Data Structure", "computer-science", "A key-value structure that provides average constant-time lookup through hashing.", ["dictionary", "hash table", "lookup", "keys"], 91],
  ["Priority Queue", "Data Structure", "computer-science", "A queue that removes items by priority, commonly implemented with a binary heap.", ["heap", "top k", "ranking", "queue"], 80],
  ["Binary Heap", "Data Structure", "computer-science", "A complete tree that efficiently maintains a minimum or maximum element at its root.", ["priority queue", "min heap", "max heap", "top k"], 79],
  ["Linked List", "Data Structure", "computer-science", "A sequence of nodes connected by references, optimized for local insertions and removals.", ["nodes", "pointers", "list", "memory"], 72],
  ["Binary Search Tree", "Data Structure", "computer-science", "An ordered tree where smaller values appear left and larger values appear right.", ["tree", "ordered", "search", "nodes"], 76],
  ["B Tree", "Data Structure", "computer-science", "A balanced multi-way tree used by storage engines and database indexes.", ["database", "balanced tree", "index", "storage"], 68],
  ["Graph", "Data Structure", "computer-science", "A collection of vertices and edges for modeling networks, dependencies, and relationships.", ["vertices", "edges", "network", "algorithms"], 88],
  ["Stack", "Data Structure", "computer-science", "A last-in-first-out collection used in parsing, undo histories, and function calls.", ["lifo", "recursion", "memory", "queue"], 75],
  ["Queue", "Data Structure", "computer-science", "A first-in-first-out collection used for scheduling, buffering, and breadth-first traversal.", ["fifo", "bfs", "scheduling", "buffer"], 74],
  ["Bloom Filter", "Probabilistic Data Structure", "computer-science", "A compact probabilistic structure that quickly tests likely set membership.", ["hashing", "probabilistic", "cache", "membership"], 62],
  ["Inverted Index", "Information Retrieval", "computer-science", "A map from terms to documents that makes keyword search and filtering efficient.", ["search", "documents", "keywords", "index"], 82],
  ["Suffix Array", "Data Structure", "computer-science", "A sorted array of suffixes used for substring search and text indexing.", ["strings", "search", "text", "index"], 55],
  ["LRU Cache", "Data Structure", "computer-science", "A cache eviction policy that removes the least recently used value when capacity is reached.", ["cache", "hash map", "linked list", "eviction"], 77],
  ["Binary Search", "Algorithm", "computer-science", "A divide-and-conquer algorithm that finds an item in sorted data in logarithmic time.", ["sorted", "logarithmic", "search", "divide and conquer"], 91],
  ["Merge Sort", "Algorithm", "computer-science", "A stable divide-and-conquer sorting algorithm with predictable O(n log n) performance.", ["sorting", "divide and conquer", "stable", "recursion"], 75],
  ["Quick Sort", "Algorithm", "computer-science", "An in-place sorting algorithm that partitions data around a pivot value.", ["sorting", "partition", "divide and conquer", "recursion"], 78],
  ["Dijkstra Algorithm", "Graph Algorithm", "computer-science", "A shortest-path algorithm for graphs with non-negative edge weights.", ["graph", "shortest path", "priority queue", "routing"], 76],
  ["Depth First Search", "Graph Algorithm", "computer-science", "A traversal strategy that explores as far as possible before backtracking.", ["graph", "dfs", "recursion", "stack"], 82],
  ["Breadth First Search", "Graph Algorithm", "computer-science", "A level-by-level graph traversal that finds shortest unweighted paths.", ["graph", "bfs", "queue", "shortest path"], 82],
  ["Dynamic Programming", "Algorithmic Technique", "computer-science", "A strategy that solves overlapping subproblems by storing intermediate results.", ["memoization", "optimization", "recursion", "algorithms"], 83],
  ["Greedy Algorithm", "Algorithmic Technique", "computer-science", "A technique that makes locally optimal choices while constructing a solution.", ["optimization", "algorithms", "proof", "choices"], 67],
  ["Backtracking", "Algorithmic Technique", "computer-science", "A systematic search technique that abandons partial candidates that cannot succeed.", ["recursion", "search", "constraint", "algorithms"], 70],
  ["Big O Notation", "Complexity Analysis", "computer-science", "Notation for describing how runtime or memory grows with input size.", ["complexity", "performance", "algorithms", "runtime"], 90],
  ["Recursion", "Programming Concept", "computer-science", "A technique where a function calls itself until it reaches a base case.", ["stack", "functions", "algorithms", "base case"], 81],
  ["Concurrency", "Systems Concept", "computer-science", "The composition of independently progressing tasks in a program or system.", ["threads", "async", "parallelism", "race condition"], 81],
  ["Distributed System", "Systems Concept", "computer-science", "A collection of networked computers coordinating to provide a shared service.", ["network", "consensus", "scalability", "fault tolerance"], 79],
  ["CAP Theorem", "Distributed Systems", "computer-science", "A principle describing trade-offs among consistency, availability, and partition tolerance.", ["distributed systems", "consistency", "availability", "database"], 69],
  ["Consensus Algorithm", "Distributed Systems", "computer-science", "A protocol that helps distributed nodes agree on a value or sequence of events.", ["raft", "paxos", "distributed", "leader election"], 65],
  ["Compiler", "Computer Science Concept", "computer-science", "A program that translates source code into another representation such as machine code.", ["language", "parser", "optimization", "machine code"], 78],
  ["Operating System", "Computer Science Concept", "computer-science", "System software that manages hardware resources and provides common services to programs.", ["kernel", "processes", "memory", "scheduling"], 84],
  ["Garbage Collection", "Runtime Concept", "computer-science", "Automatic memory management that reclaims objects no longer reachable by a program.", ["memory", "runtime", "heap", "performance"], 73],
  ["Event Loop", "Runtime Concept", "computer-science", "A scheduling loop that coordinates asynchronous callbacks, tasks, and I/O events.", ["javascript", "async", "runtime", "queue"], 84],

  // Technology platforms, data, and developer tools
  ["PostgreSQL", "Database", "technology", "A powerful open-source relational database known for reliability and extensibility.", ["sql", "relational", "database", "data"], 91],
  ["MySQL", "Database", "technology", "A widely deployed relational database for web applications and operational workloads.", ["sql", "relational", "database", "data"], 86],
  ["MongoDB", "Database", "technology", "A document database that stores flexible JSON-like records and scales horizontally.", ["nosql", "documents", "database", "json"], 83],
  ["Redis", "In-Memory Database", "technology", "An in-memory data store used for caching, queues, sessions, and fast lookups.", ["cache", "key value", "database", "queue"], 88],
  ["Elasticsearch", "Search Engine", "technology", "A distributed search and analytics engine built around inverted indexes.", ["search", "index", "analytics", "documents"], 82],
  ["SQLite", "Database", "technology", "A compact embedded relational database stored in a single local file.", ["sql", "embedded", "database", "mobile"], 78],
  ["Neo4j", "Graph Database", "technology", "A graph database designed for relationship-rich data and Cypher queries.", ["graph", "database", "relationships", "cypher"], 61],
  ["Apache Kafka", "Streaming Platform", "technology", "A distributed event streaming platform for durable real-time data pipelines.", ["events", "streaming", "distributed", "messaging"], 80],
  ["RabbitMQ", "Message Broker", "technology", "A message broker that routes work between services using queues and exchanges.", ["messaging", "queue", "amqp", "distributed"], 68],
  ["Docker", "Developer Tool", "technology", "A platform for packaging applications and dependencies into portable containers.", ["containers", "devops", "deployment", "images"], 93],
  ["Kubernetes", "Container Orchestration", "technology", "A platform for deploying, scaling, and managing containerized workloads.", ["containers", "cloud", "orchestration", "devops"], 90],
  ["Terraform", "Infrastructure as Code", "technology", "A declarative tool for provisioning cloud infrastructure across providers.", ["cloud", "infrastructure", "devops", "automation"], 79],
  ["Git", "Version Control", "technology", "A distributed version control system for tracking changes and collaborating on code.", ["github", "branches", "commits", "collaboration"], 96],
  ["GitHub Actions", "CI/CD", "technology", "A workflow automation platform for testing, building, and deploying directly from repositories.", ["automation", "github", "ci", "deployment"], 83],
  ["Jenkins", "CI/CD", "technology", "An extensible automation server used to build continuous integration and delivery pipelines.", ["ci", "deployment", "automation", "devops"], 71],
  ["Linux", "Operating System", "technology", "An open-source operating system family used across servers, devices, and developer machines.", ["kernel", "unix", "server", "terminal"], 91],
  ["macOS", "Operating System", "technology", "Apple's desktop operating system for Mac computers and developer workstations.", ["apple", "unix", "desktop", "terminal"], 75],
  ["Windows", "Operating System", "technology", "Microsoft's desktop operating system and a major platform for enterprise software.", ["microsoft", "desktop", "enterprise", "development"], 80],
  ["AWS", "Cloud Platform", "technology", "Amazon's cloud platform for compute, storage, networking, and managed services.", ["cloud", "infrastructure", "serverless", "devops"], 92],
  ["Google Cloud", "Cloud Platform", "technology", "Google's cloud platform for infrastructure, data, AI, and application services.", ["cloud", "gcp", "data", "infrastructure"], 79],
  ["Microsoft Azure", "Cloud Platform", "technology", "Microsoft's cloud platform for enterprise infrastructure and managed application services.", ["cloud", "microsoft", "devops", "infrastructure"], 80],
  ["Cloudflare", "Edge Platform", "technology", "An edge network platform for application security, delivery, and serverless computing.", ["cdn", "security", "edge", "dns"], 78],
  ["Figma", "Design Tool", "technology", "A collaborative interface design tool used to prototype and hand off digital products.", ["design", "ui", "collaboration", "prototyping"], 80],
  ["VS Code", "Code Editor", "technology", "A lightweight extensible code editor with integrated debugging and language tooling.", ["editor", "microsoft", "extensions", "development"], 94],
  ["IntelliJ IDEA", "Code Editor", "technology", "A feature-rich IDE for JVM development with deep code analysis and refactoring.", ["java", "ide", "jetbrains", "development"], 75],
  ["npm", "Package Manager", "technology", "The package registry and command-line client at the center of the JavaScript ecosystem.", ["javascript", "packages", "node", "registry"], 89],
  ["pnpm", "Package Manager", "technology", "A fast package manager that uses content-addressable storage to save disk space.", ["javascript", "packages", "node", "monorepo"], 70],
  ["Yarn", "Package Manager", "technology", "A package manager for JavaScript projects with deterministic dependency resolution.", ["javascript", "packages", "node", "dependencies"], 73],
  ["OpenAI", "Technology Company", "technology", "An AI research and deployment company known for generative models and developer APIs.", ["artificial intelligence", "llm", "models", "api"], 87],
  ["Google", "Technology Company", "technology", "A global technology company spanning search, cloud, mobile, web, and AI products.", ["search", "cloud", "android", "web"], 91],
  ["Microsoft", "Technology Company", "technology", "A technology company behind Windows, Azure, GitHub, developer tools, and enterprise software.", ["azure", "windows", "github", "enterprise"], 88],
  ["Apple", "Technology Company", "technology", "A technology company building hardware, operating systems, and developer platforms.", ["ios", "macos", "swift", "hardware"], 87],
  ["Meta", "Technology Company", "technology", "A technology company that develops social platforms, immersive computing, and open-source tools.", ["react", "social", "open source", "vr"], 78],
  ["Stripe", "Payments Platform", "technology", "A developer-focused payments platform for online businesses and financial operations.", ["payments", "api", "fintech", "web"], 79],
  ["Sentry", "Observability Tool", "technology", "An application monitoring platform for error tracking, performance, and release health.", ["monitoring", "errors", "observability", "debugging"], 69],
].map(([title, category, preset, description, keywords, popularity]) => ({
  title,
  category,
  preset,
  description,
  keywords,
  popularity,
})) as Seed[];

const specials: Seed[] = [
  ["Java Runtime Environment", "Java Platform", "programming", "The runtime environment that provides libraries and a Java Virtual Machine for Java applications.", ["java", "jvm", "runtime", "enterprise"], 85],
  ["Java Virtual Machine", "Java Platform", "programming", "The virtual machine that executes Java bytecode and enables JVM language portability.", ["java", "jvm", "bytecode", "runtime"], 87],
  ["Java Collections", "Java Platform", "programming", "The Java framework of reusable collection interfaces and implementations such as lists, sets, and maps.", ["java", "data structures", "collections", "hash map"], 81],
  ["Java Streams", "Java Platform", "programming", "A Java API for expressing aggregate operations over data collections in a declarative style.", ["java", "functional", "collections", "stream"], 79],
  ["JavaScript Promise", "JavaScript Concept", "programming", "An object representing the eventual completion or failure of an asynchronous operation.", ["javascript", "async", "event loop", "frontend"], 86],
  ["JavaScript Array", "JavaScript Concept", "programming", "An ordered JavaScript collection with methods for transforming, filtering, and iterating data.", ["javascript", "data structures", "array", "frontend"], 84],
  ["JavaScript Event Loop", "JavaScript Concept", "programming", "The runtime mechanism that coordinates tasks, microtasks, timers, and callbacks in JavaScript.", ["javascript", "async", "runtime", "queue"], 86],
  ["React Query", "React Library", "programming", "A server-state management library for fetching, caching, and synchronizing asynchronous React data.", ["react", "data fetching", "cache", "frontend"], 83],
  ["React Router", "React Library", "programming", "A client-side routing library for React applications and nested user interfaces.", ["react", "routing", "frontend", "spa"], 85],
  ["React Hooks", "React Concept", "programming", "Functions that let React components use state, effects, context, and reusable behavior.", ["react", "state", "frontend", "javascript"], 90],
  ["Binary Search Tree Traversal", "Data Structure", "computer-science", "Techniques for visiting an ordered tree in pre-order, in-order, or post-order.", ["tree", "dfs", "recursion", "algorithms"], 74],
  ["Search Ranking", "Information Retrieval", "computer-science", "The process of ordering candidate documents using relevance signals and scoring functions.", ["search", "ranking", "relevance", "top k"], 79],
  ["Text Normalization", "Information Retrieval", "computer-science", "Preparing text for indexing by standardizing case, spacing, accents, and token boundaries.", ["search", "strings", "tokens", "index"], 66],
  ["Amazon DynamoDB", "Database", "technology", "A managed key-value and document database designed for predictable performance at scale.", ["aws", "nosql", "database", "key value"], 74],
].map(([title, category, preset, description, keywords, popularity]) => ({
  title,
  category,
  preset,
  description,
  keywords,
  popularity,
})) as Seed[];

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function companionLabels(seed: Seed): [string, string] {
  if (seed.category.includes("Database")) return ["Indexing", "Query Patterns"];
  if (seed.category.includes("Algorithm") || seed.category.includes("Data Structure")) return ["Implementation", "Complexity"];
  if (seed.category.includes("Framework") || seed.category.includes("Library")) return ["Patterns", "Architecture"];
  if (seed.category.includes("Cloud") || seed.category.includes("Platform")) return ["Architecture", "Workflow"];
  if (seed.category.includes("Language") || seed.category.includes("Runtime")) return ["Fundamentals", "Patterns"];
  return ["Workflow", "Fundamentals"];
}

function buildItem(seed: Seed, title: string, index: number, variant = false): SearchItem {
  const suffix = title.slice(seed.title.length).trim();
  return {
    id: `${slugify(title)}-${index}`,
    title,
    description: variant
      ? `${seed.description} This focused entry explores practical ${suffix.toLowerCase()} decisions for modern engineering teams.`
      : seed.description,
    category: variant ? `${seed.category} / ${suffix}` : seed.category,
    keywords: [...seed.keywords, seed.title, suffix, seed.category].filter(Boolean),
    popularity: Math.max(36, seed.popularity - (variant ? 7 + (index % 6) : 0)),
    preset: seed.preset,
  };
}

const generatedDataset: SearchItem[] = [...seeds, ...specials].flatMap((seed, seedIndex) => {
  const main = buildItem(seed, seed.title, seedIndex);
  const [first, second] = companionLabels(seed);
  return [
    main,
    buildItem(seed, `${seed.title} ${first}`, seedIndex + 1000, true),
    buildItem(seed, `${seed.title} ${second}`, seedIndex + 2000, true),
  ];
});

export const DEFAULT_DATASET = generatedDataset;

export function getPresetDataset(preset: DatasetPreset): SearchItem[] {
  return preset === "all" ? DEFAULT_DATASET : DEFAULT_DATASET.filter((item) => item.preset === preset);
}

export function createCustomItem(term: string, category: string, popularity: number): SearchItem {
  const cleanTitle = term.trim().replace(/\s+/g, " ");
  return {
    id: `custom-${slugify(cleanTitle)}-${Date.now()}`,
    title: cleanTitle,
    description: `A custom indexed term added locally to explore autocomplete and keyword search behavior.`,
    category: category.trim() || "Custom Term",
    keywords: [cleanTitle, category.trim() || "custom", "user added"],
    popularity,
    preset: "technology",
    isCustom: true,
  };
}