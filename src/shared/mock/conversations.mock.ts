import type { ChatMessage } from "@/shared/types";

export interface MockConversation {
  id: string;
  title: string;
  modelSlug: string;
  modelTitle: string;
  updatedAt: string;
  dateGroup: "Today" | "Yesterday" | "Previous 7 Days" | "Last Month";
  isPinned?: boolean;
  messages: ChatMessage[];
}

export const INITIAL_CONVERSATIONS: MockConversation[] = [
  {
    id: "conv-1",
    title: "TypeScript Consensus Calculator",
    modelSlug: "anthropic/claude-3.5-sonnet",
    modelTitle: "Claude 3.5 Sonnet",
    updatedAt: "12m ago",
    dateGroup: "Today",
    isPinned: true,
    messages: [
      {
        messageId: "m1-1",
        chatId: "conv-1",
        role: "user",
        content: "Can you write a TypeScript utility that calculates an agreement score between multiple AI model outputs?",
        createdAt: "10:15 AM",
      },
      {
        messageId: "m1-2",
        chatId: "conv-1",
        role: "assistant",
        modelSlug: "anthropic/claude-3.5-sonnet",
        content: `Here is a high-performance consensus calculator using token set Jaccard similarity and character n-gram overlaps.

\`\`\`typescript
export function calculateConsensus(responses: string[]): {
  score: number;
  level: "High" | "Moderate" | "Low";
  commonTokens: string[];
} {
  if (responses.length < 2) {
    return { score: 1.0, level: "High", commonTokens: [] };
  }

  const tokenSets = responses.map((r) =>
    new Set(r.toLowerCase().replace(/[^a-z0-9\\s]/g, "").split(/\\s+/).filter(Boolean))
  );

  const common = [...tokenSets[0]].filter((token) =>
    tokenSets.every((set) => set.has(token))
  );

  const avgSize = tokenSets.reduce((sum, s) => sum + s.size, 0) / tokenSets.length;
  const score = Number(Math.min(1.0, common.length / (avgSize || 1)).toFixed(2));

  const level = score > 0.65 ? "High" : score > 0.35 ? "Moderate" : "Low";

  return { score, level, commonTokens: common.slice(0, 10) };
}
\`\`\`

### Key Features:
1. **Normalizes whitespace and punctuation** to avoid false negatives.
2. **Handles edge cases** like empty strings or single inputs cleanly.
3. **Returns human-readable agreement tier** (\`High\`, \`Moderate\`, \`Low\`) for quick UI rendering in Battle Mode.`,
        createdAt: "10:16 AM",
      },
    ],
  },
  {
    id: "conv-2",
    title: "Quantum Entanglement & Distributed Systems",
    modelSlug: "deepseek/deepseek-r1",
    modelTitle: "DeepSeek R1",
    updatedAt: "2h ago",
    dateGroup: "Today",
    messages: [
      {
        messageId: "m2-1",
        chatId: "conv-2",
        role: "user",
        content: "Explain quantum entanglement to a distributed systems engineer in 2 sentences.",
        createdAt: "8:30 AM",
      },
      {
        messageId: "m2-2",
        chatId: "conv-2",
        role: "assistant",
        modelSlug: "deepseek/deepseek-r1",
        reasoningContent: "Thinking Process:\n1. Target Audience: Distributed systems engineer.\n2. Concepts they understand: State replication, consensus protocols (Raft/Paxos), atomic commits, latency, RPC.\n3. Analogy: Entangled particles behave like replicas sharing an atomic register with zero-latency synchronization, without exchanging network packets.\n4. Drafting 2 precise, punchy sentences.",
        content: `Quantum entanglement is like two distributed nodes that share an atomic state register without network latency or RPC message passing.

When an observer reads the state on node A, node B's state collapses into the complementary value instantaneously, regardless of physical distance.`,
        createdAt: "8:31 AM",
      },
    ],
  },
  {
    id: "conv-3",
    title: "Next.js 16 Server Components Architecture",
    modelSlug: "openai/gpt-4o",
    modelTitle: "GPT-4o",
    updatedAt: "Yesterday",
    dateGroup: "Yesterday",
    messages: [
      {
        messageId: "m3-1",
        chatId: "conv-3",
        role: "user",
        content: "What are the core differences between Server Components and Client Components in Next.js App Router?",
        createdAt: "Yesterday, 4:20 PM",
      },
      {
        messageId: "m3-2",
        chatId: "conv-3",
        role: "assistant",
        modelSlug: "openai/gpt-4o",
        content: `Here is a concise breakdown of how Server Components and Client Components divide responsibilities:

| Capability | React Server Components (RSC) | Client Components (\`"use client"\`) |
|---|---|---|
| **Execution Environment** | Server-only (build time or request time) | Server-rendered initial HTML, then hydrated in Browser |
| **Bundle Size Cost** | **Zero client JS** (HTML & payload only) | Added to browser JavaScript bundle |
| **Data Fetching** | Direct access to DB, file system, internal APIs | Via browser \`fetch()\` or Server Actions |
| **Interactive Events** | Cannot use \`onClick\`, \`onChange\` | Full DOM event listeners supported |
| **React Hooks** | Cannot use \`useState\`, \`useEffect\` | All state and lifecycle hooks available |

**Rule of Thumb:** Keep components as Server Components by default. Push Client Components to the leaves of your component tree where user interaction, event listeners, or browser APIs are required.`,
        createdAt: "Yesterday, 4:21 PM",
      },
    ],
  },
  {
    id: "conv-4",
    title: "pgvector Index Tuning for AI Embeddings",
    modelSlug: "mistral/mistral-large-2407",
    modelTitle: "Mistral Large 2",
    updatedAt: "3d ago",
    dateGroup: "Previous 7 Days",
    messages: [
      {
        messageId: "m4-1",
        chatId: "conv-4",
        role: "user",
        content: "Should I use HNSW or IVFFlat for indexing 1536-dimensional embeddings in PostgreSQL with pgvector?",
        createdAt: "Sep 26",
      },
      {
        messageId: "m4-2",
        chatId: "conv-4",
        role: "assistant",
        modelSlug: "mistral/mistral-large-2407",
        content: `For high-dimensional embeddings (like OpenAI 1536d or Voyage AI), **HNSW (Hierarchical Navigable Small World)** is almost always the superior choice over IVFFlat for production workloads.

### Why HNSW wins:
- **Higher Recall:** Achieves >95% recall out of the box without extensive hyperparameter re-tuning.
- **Dynamic Inserts:** You can create the HNSW index on an empty table and insert rows without degradation. (IVFFlat requires training on existing data, meaning index quality drops if data shifts).
- **Lower Query Latency:** Traversal is logarithmic rather than checking list centroids.

### Trade-off:
- HNSW uses more RAM during index creation and has slightly slower build times. Ensure your \`maintenance_work_mem\` is set to at least 1GB–2GB during index creation.`,
        createdAt: "Sep 26",
      },
    ],
  },
  {
    id: "conv-5",
    title: "MCP Connector Setup for SQLite Database",
    modelSlug: "meta/llama-3.3-70b-instruct",
    modelTitle: "Llama 3.3 70B",
    updatedAt: "5d ago",
    dateGroup: "Previous 7 Days",
    messages: [
      {
        messageId: "m5-1",
        chatId: "conv-5",
        role: "user",
        content: "How does EchoGPT connect to a Model Context Protocol (MCP) server running on localhost?",
        createdAt: "Sep 24",
      },
      {
        messageId: "m5-2",
        chatId: "conv-5",
        role: "assistant",
        modelSlug: "meta/llama-3.3-70b-instruct",
        content: `EchoGPT connects to MCP servers using either stdio over WebSocket or SSE (Server-Sent Events) HTTP transport:

1. **Start your local MCP server:**
   \`\`\`bash
   npx -y @modelcontextprotocol/server-sqlite --db-path ./workspace.db
   \`\`\`
2. **Open EchoGPT Connectors Hub:**
   Navigate to \`/app/connectors\` and click **Add Connector**.
3. **Register Endpoint:**
   Enter \`http://localhost:8000/sse\` (or your configured port).
4. **Tool Auto-Discovery:**
   EchoGPT will query \`tools/list\` via JSON-RPC 2.0 and expose discovered tools (e.g. \`read_query\`, \`list_tables\`) directly to your active chat session.`,
        createdAt: "Sep 24",
      },
    ],
  },
  {
    id: "conv-6",
    title: "AI SaaS Dual Currency Strategy (USD & BDT)",
    modelSlug: "google/gemini-1.5-pro",
    modelTitle: "Gemini 1.5 Pro",
    updatedAt: "2w ago",
    dateGroup: "Last Month",
    messages: [
      {
        messageId: "m6-1",
        chatId: "conv-6",
        role: "user",
        content: "What are the key considerations when implementing dual pricing in Stripe (USD) and SSLCommerz (BDT)?",
        createdAt: "Sep 15",
      },
      {
        messageId: "m6-2",
        chatId: "conv-6",
        role: "assistant",
        modelSlug: "google/gemini-1.5-pro",
        content: `Implementing localized dual-gateway billing requires handling currency conversion variance, IP geo-detection, and asynchronous webhook lifecycle:

- **Geo-IP Routing:** Detect user location on entry and default to BDT pricing with local payment methods (bKash, Nagad, Rocket).
- **Price Parity:** Fixed local tiers (e.g. ৳999/mo) convert better in emerging markets than volatile dynamic exchange rates.
- **Webhook Reconciliation:** Centralize subscription entitlements in a single database schema with \`gateway_provider: 'stripe' | 'sslcommerz'\` to keep feature access unified.`,
        createdAt: "Sep 15",
      },
    ],
  },
];
