import { FEATURED_MODELS } from "@/shared/mock/models.mock";

export type QuickActionType =
  | "summarize"
  | "explain"
  | "extract_key_points"
  | "rewrite"
  | "ask_about"
  | "translate"
  | "code"
  | "research";

export type ContextMode = "none" | "webpage" | "selection";

export interface ContextAttachment {
  type: "webpage" | "selection";
  title: string;
  content: string;
  sourceUrl?: string;
  tokenCount: number;
}

export const PRESET_WEBPAGE_CONTEXT: ContextAttachment = {
  type: "webpage",
  title: "React Documentation",
  sourceUrl: "https://react.dev/learn",
  content:
    "React is a library for web and native user interfaces. Build user interfaces out of individual pieces called components written in JavaScript. Combine them into entire screens, pages, and apps.",
  tokenCount: 124,
};

export const PRESET_SELECTION_CONTEXT: ContextAttachment = {
  type: "selection",
  title: "Selected Text from React Docs",
  content:
    "React lets you combine your markup, CSS, and JavaScript into custom 'components', reusable UI elements for your app.",
  tokenCount: 32,
};

export interface InferenceRequest {
  prompt: string;
  modelSlug: string;
  conversationId: string;
  context?: ContextAttachment | null;
  quickAction?: QuickActionType | null;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface InferenceResult {
  content: string;
  reasoningContent?: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs: number;
  modelSlug: string;
  modelTitle: string;
}

function buildMockResponse(request: InferenceRequest): {
  content: string;
  reasoning?: string;
} {
  const { prompt, modelSlug, quickAction, context } = request;
  const model = FEATURED_MODELS.find((m) => m.slug === modelSlug) || FEATURED_MODELS[0];
  const contextPrefix = context
    ? `*(Grounded in attached ${context.type === "webpage" ? "webpage" : "selection"}: **${context.title}**)*\n\n`
    : "";

  if (quickAction === "extract_key_points") {
    return {
      content: `${contextPrefix}### Key Points Extracted from Context

1. **Component-Centric Design**: Applications are composed of isolated, reusable UI units combining markup, styling, and logic.
2. **Encapsulated Scope**: Component boundaries ensure styling and state changes do not leak across unrelated views.
3. **High Composability**: Small components assemble naturally into larger feature containers, pages, and complete screen flows.
4. **Declarative Rendering**: Updates reconcile automatically based on underlying state mutations rather than manual DOM manipulation.`,
      reasoning: model.capabilities.reasoning
        ? `1. Read attached context snippet (${context?.content.length || 0} chars).\n2. Extracted 4 primary architectural invariants.\n3. Formatted into numbered points.`
        : undefined,
    };
  }

  if (quickAction === "ask_about") {
    return {
      content: `${contextPrefix}### Contextual Analysis: "${context?.title || "Attached Context"}"

In response to your query regarding **"${prompt}"**:

- **Context Grounding**: The attached content explicitly emphasizes that components function as custom, reusable elements encapsulating markup and behavior.
- **Key Takeaway**: When structuring your architecture, prioritize atomic component boundaries to maximize composability and testing isolation.
- **Best Practice**: Pass pure data down via typed props and elevate state transitions via explicit callbacks.`,
    };
  }

  if (quickAction === "summarize") {
    return {
      content: `${contextPrefix}### Executive Summary

- **Primary Objective**: Address core technical trade-offs and streamline multi-model execution.
- **Key Findings**: Token caching reduces latency by 48% across repeat prompts; model fallback routing maintains 99.98% uptime.
- **Action Items**:
  1. Standardize streaming protocol with Server-Sent Events (SSE).
  2. Implement client-side debounce on prompt composer.
  3. Deploy automated model consensus checks for mission-critical turns.`,
      reasoning: model.capabilities.reasoning
        ? `1. Read input text (${prompt.length} chars).\n2. Extracted main themes: latency, architecture, reliability.\n3. Structured 3-tier bullet summary with actionable takeaways.`
        : undefined,
    };
  }

  if (quickAction === "explain") {
    return {
      content: `${contextPrefix}### Step-by-Step Breakdown: ${prompt.slice(0, 40)}...

#### 1. The Core Concept
At its essence, this problem centers on reconciling state consistency across distributed systems without incurring quadratic latency overhead.

#### 2. How It Works Under The Hood
\`\`\`text
[ Client Query ]
       │
       ▼
[ EchoGPT Gateway ] ──► [ Model Router (Claude / GPT / DeepSeek) ]
       │                                │
       ▼                                ▼
[ Context Caching ] ◄─────── [ Token Stream Delivery ]
\`\`\`

#### 3. Key Trade-offs
- **Pros**: Minimal coupling, instant model switching mid-turn, graceful fallback on rate limits.
- **Cons**: Requires normalized message schemas across provider interfaces.`,
      reasoning: model.capabilities.reasoning
        ? `1. Identified conceptual domain: Distributed systems architecture.\n2. Drafted conceptual hierarchy: definition -> mechanics diagram -> trade-offs.\n3. Formatted for high readability.`
        : undefined,
    };
  }

  if (quickAction === "rewrite") {
    return {
      content: `${contextPrefix}### Polished & Refined Version:

> "${prompt.trim()}."

---

#### Key Improvements Made:
- **Clarity**: Removed extraneous filler and strengthened active voice.
- **Precision**: Replaced ambiguous qualifiers with concrete metrics.
- **Tone**: Calibrated for an authoritative engineering context.`,
    };
  }

  if (quickAction === "translate") {
    return {
      content: `${contextPrefix}### English Translation:

> "${prompt.trim()}."

#### Linguistic & Terminology Notes:
- Preserved technical domain terms without colloquial distortion.
- Calibrated grammar for international software specifications.`,
    };
  }

  if (quickAction === "code") {
    return {
      content: `${contextPrefix}Here is a production-ready, type-safe implementation:

\`\`\`typescript
import { z } from "zod";

export const InferencePayloadSchema = z.object({
  model: z.string().min(1),
  prompt: z.string().max(32000),
  temperature: z.number().min(0).max(2).default(0.7),
  stream: z.boolean().default(true),
});

export type InferencePayload = z.infer<typeof InferencePayloadSchema>;

export async function executeMultiModelInference(
  payload: InferencePayload,
  signal?: AbortSignal
): Promise<ReadableStream<Uint8Array> | null> {
  const validated = InferencePayloadSchema.parse(payload);

  const response = await fetch("/api/v1/inference", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-EchoGPT-Client": "v2.0-web",
    },
    body: JSON.stringify(validated),
    signal,
  });

  if (!response.ok) {
    throw new Error(\`Gateway error \${response.status}: \${await response.text()}\`);
  }

  return response.body;
}
\`\`\`

### Key Features:
1. **Schema Validation**: Uses Zod for strict runtime boundaries.
2. **Cancellation Support**: Accepts an optional \`AbortSignal\` to halt generation on user demand.
3. **Zero Leaks**: Streams directly into the consuming component buffer.`,
      reasoning: model.capabilities.reasoning
        ? `1. Parsed code generation requirements.\n2. Selected Zod + fetch API for standard browser edge execution.\n3. Included error propagation and AbortSignal cancellation.`
        : undefined,
    };
  }

  if (quickAction === "research") {
    return {
      content: `${contextPrefix}### Deep Research & Comparative Matrix

| Evaluation Criterion | Front-runner A (Claude 3.5 Sonnet) | Alternative B (DeepSeek R1) | Baseline C (GPT-4o) |
| :--- | :--- | :--- | :--- |
| **Reasoning Depth** | 9.6 / 10 (Instructional coding) | 9.8 / 10 (Math & logic) | 9.2 / 10 (Generalist) |
| **Context Window** | 200,000 tokens | 64,000 tokens | 128,000 tokens |
| **Time-to-First-Token** | ~280ms | ~450ms | ~220ms |
| **Pricing / 1M Output** | $15.00 | $2.19 | $10.00 |

#### Recommendation:
- Use **Claude 3.5 Sonnet** for complex codebase refactoring and design systems.
- Use **DeepSeek R1** for algorithmic puzzles, formal verification, and cost-efficient batch reasoning.
- Use **GPT-4o** for rapid conversational drafting and multi-modal image inputs.`,
      reasoning: model.capabilities.reasoning
        ? `1. Identified comparison dimensions: reasoning, latency, context, pricing.\n2. Built matrix comparing Sonnet 3.5, DeepSeek R1, GPT-4o.\n3. Formulated definitive architectural verdict.`
        : undefined,
    };
  }

  if (modelSlug === "deepseek/deepseek-r1") {
    return {
      content: `${contextPrefix}Based on step-by-step verification, here is the solution:

1. **State Isolation**: Ensure each model worker runs inside an isolated execution sandbox.
2. **Context Window Allocation**: Allocate memory blocks dynamically up to 64k tokens.
3. **Consensus Validation**: If confidence is below 92%, cross-validate output with an auxiliary model turn.

\`\`\`typescript
export function verifyConsensus(scores: number[]): boolean {
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  return average >= 0.92;
}
\`\`\`

The solution maintains strict consistency while avoiding unnecessary token consumption.`,
      reasoning: `Thinking Process:
1. User prompt: "${prompt.slice(0, 50)}..."
2. Analyzing mathematical invariants and concurrency conditions.
3. Formulating theorem verification and pseudo-code.
4. Ensuring optimal token usage and verifiable correctness.`,
    };
  }

  if (modelSlug === "anthropic/claude-3.5-sonnet") {
    return {
      content: `${contextPrefix}Here is an architectural solution designed for high maintainability:

\`\`\`typescript
export class WorkspaceSessionManager {
  private activeModel: string;
  private tokenQuota: number;

  constructor(model: string, quota: number = 200000) {
    this.activeModel = model;
    this.tokenQuota = quota;
  }

  public canProcess(tokens: number): boolean {
    return tokens <= this.tokenQuota;
  }
}
\`\`\`

### Architectural Principles:
- **Clean Boundaries**: Keeps UI separate from model orchestration.
- **Fail-Safe Design**: Automatically falls back to secondary frontier models if rate-limited.
- **Zero Hallucination**: Emphasizes explicit constraints and schema validation.`,
    };
  }

  return {
    content: `${contextPrefix}I processed your request using **${model.title}** (${model.provider.toUpperCase()} tier).

Here are the key takeaways:
- **Inference Pipeline**: Routed through EchoGPT high-speed proxy with sub-300ms latency.
- **Capabilities Applied**: ${
      model.capabilities.reasoning
        ? "Advanced chain-of-thought verification."
        : "Frontier language synthesis and contextual reasoning."
    }
- **Context Depth**: ${model.contextWindow ? (model.contextWindow / 1000).toFixed(0) + "k tokens" : "Standard"} allocation.

Would you like to refine this, run a benchmark against another model in the Arena, or generate test cases?`,
  };
}

export const aiInferenceService = {
  async streamInference(
    request: InferenceRequest,
    onTokenChunk: (accumulated: string) => void,
    signal?: AbortSignal
  ): Promise<InferenceResult> {
    const startTime = performance.now();
    const model = FEATURED_MODELS.find((m) => m.slug === request.modelSlug) || FEATURED_MODELS[0];

    await new Promise((r) => setTimeout(r, 280));
    if (signal?.aborted) throw new Error("Inference aborted by user");

    const mock = buildMockResponse(request);
    const tokens = mock.content.split(" ");
    let accumulated = "";

    for (let i = 0; i < tokens.length; i++) {
      if (signal?.aborted) throw new Error("Inference aborted by user");
      const word = tokens[i];
      accumulated += (i > 0 ? " " : "") + word;
      onTokenChunk(accumulated);
      await new Promise((r) => setTimeout(r, 18));
    }

    const latencyMs = Math.round(performance.now() - startTime);

    return {
      content: mock.content,
      reasoningContent: mock.reasoning,
      usage: {
        promptTokens: Math.round(request.prompt.length / 4) + (request.context?.tokenCount || 0),
        completionTokens: Math.round(mock.content.length / 4),
        totalTokens:
          Math.round(request.prompt.length / 4) +
          (request.context?.tokenCount || 0) +
          Math.round(mock.content.length / 4),
      },
      latencyMs,
      modelSlug: model.slug,
      modelTitle: model.title,
    };
  },
};
