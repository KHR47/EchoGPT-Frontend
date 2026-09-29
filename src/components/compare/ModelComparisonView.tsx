"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FEATURED_MODELS } from "@/shared/mock/models.mock";
import { Button, Badge } from "@/shared/components/ui";
import {
  ArrowLeft,
  Play,
  Check,
  Zap,
  Brain,
  Trophy,
  Copy,
  ChevronDown,
} from "lucide-react";
import { MarkdownRenderer } from "../chat/MarkdownRenderer";
import { AppNavigationTabs } from "@/components/navigation/AppNavigationTabs";

interface ModelColumnState {
  modelSlug: string;
  isStreaming: boolean;
  content: string;
  reasoning?: string;
  latencyMs: number;
  tokensPerSec: number;
  totalTokens: number;
  isWinner: boolean;
}

const SAMPLE_COMPARISONS: Record<string, Record<string, { content: string; reasoning?: string }>> = {
  "default": {
    "anthropic/claude-3.5-sonnet": {
      content: `### Clean TypeScript Architecture

Here is an idiomatic solution prioritizing type safety and runtime error boundaries:

\`\`\`typescript
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debounced, setDebounced] = React.useState<T>(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
\`\`\`

**Strengths:**
- Preserves generic type \`T\` cleanly.
- Strict cleanup on unmount prevents memory leaks.
- Zero external dependencies.`,
    },
    "deepseek/deepseek-r1": {
      reasoning: `Thinking Trace:
1. The user asks for an optimal debounce implementation.
2. Consider edge cases: value updates during pending timers, re-renders, cancellation.
3. Validate memory overhead and timer callback cleanup.
4. Construct rigorous explanation with formal verification guarantees.`,
      content: `### Algorithmic Optimization & Proof

Analyzing the lifecycle guarantees of timed debounced state:

\`\`\`typescript
export function useDebounceValue<T>(value: T, delay: number): T {
  const [state, setState] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setState(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);

  return state;
}
\`\`\`

**Mathematical Invariants:**
1. Given continuous events $e_1, e_2, \\dots, e_n$ separated by $\\Delta t < delay$, exactly 1 evaluation triggers at $t_n + delay$.
2. State transition count is strictly bounded by $O(1)$ per stationary window.`,
    },
    "openai/gpt-4o": {
      content: `### Production-Ready Implementation

Here is how to implement a debounced value hook with immediate execution options:

\`\`\`typescript
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
\`\`\`

**Quick Usage:**
\`\`\`tsx
const [search, setSearch] = useState("");
const debouncedSearch = useDebounce(search, 400);
\`\`\`

**Takeaway:** Fast, clean, and directly compatible with Next.js App Router client components.`,
    },
    "google/gemini-1.5-pro": {
      content: `### Context-Optimized Approach

This implementation balances React 19 concurrent features with predictable timer schedules:

\`\`\`typescript
import { useState, useEffect } from "react";

export function useDebouncedState<T>(initial: T, delay = 350): [T, (val: T) => void] {
  const [val, setVal] = useState<T>(initial);
  const [debounced, setDebounced] = useState<T>(initial);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(val), delay);
    return () => clearTimeout(id);
  }, [val, delay]);

  return [debounced, setVal];
}
\`\`\`

**Benefits:** Returns both the debounced reader and immediate setter for responsive two-way inputs.`,
    },
  },
};

export function ModelComparisonView() {
  const [prompt, setPrompt] = useState(
    "Write an optimized React hook for debouncing search input in TypeScript."
  );
  const [activeTab, setActiveTab] = useState(0);
  const [mobileViewMode, setMobileViewMode] = useState<"swipe" | "stacked" | "tabs">("swipe");
  const [isRunning, setIsRunning] = useState(false);
  const [copiedCol, setCopiedCol] = useState<number | null>(null);

  const [columns, setColumns] = useState<ModelColumnState[]>([
    {
      modelSlug: "anthropic/claude-3.5-sonnet",
      isStreaming: false,
      content: SAMPLE_COMPARISONS["default"]["anthropic/claude-3.5-sonnet"].content,
      latencyMs: 280,
      tokensPerSec: 88,
      totalTokens: 245,
      isWinner: false,
    },
    {
      modelSlug: "deepseek/deepseek-r1",
      isStreaming: false,
      content: SAMPLE_COMPARISONS["default"]["deepseek/deepseek-r1"].content,
      reasoning: SAMPLE_COMPARISONS["default"]["deepseek/deepseek-r1"].reasoning,
      latencyMs: 440,
      tokensPerSec: 64,
      totalTokens: 310,
      isWinner: false,
    },
    {
      modelSlug: "openai/gpt-4o",
      isStreaming: false,
      content: SAMPLE_COMPARISONS["default"]["openai/gpt-4o"].content,
      latencyMs: 220,
      tokensPerSec: 96,
      totalTokens: 260,
      isWinner: true,
    },
  ]);

  const handleRunComparison = async () => {
    if (!prompt.trim() || isRunning) return;
    setIsRunning(true);

    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        isStreaming: true,
        content: "",
      }))
    );

    const promises = columns.map(async (col, colIdx) => {
      const sample =
        SAMPLE_COMPARISONS["default"][col.modelSlug] ||
        SAMPLE_COMPARISONS["default"]["anthropic/claude-3.5-sonnet"];

      const targetText = sample.content;
      const chunks = targetText.split(" ");
      let accumulated = "";

      await new Promise((r) => setTimeout(r, 150 + colIdx * 120));

      for (let i = 0; i < chunks.length; i++) {
        await new Promise((r) => setTimeout(r, 20));
        accumulated += (i > 0 ? " " : "") + chunks[i];

        setColumns((current) =>
          current.map((c, idx) =>
            idx === colIdx ? { ...c, content: accumulated } : c
          )
        );
      }

      setColumns((current) =>
        current.map((c, idx) =>
          idx === colIdx
            ? {
                ...c,
                isStreaming: false,
                content: targetText,
                reasoning: sample.reasoning,
              }
            : c
        )
      );
    });

    await Promise.all(promises);
    setIsRunning(false);
  };

  const handleSelectWinner = (colIdx: number) => {
    setColumns((prev) =>
      prev.map((c, idx) => ({
        ...c,
        isWinner: idx === colIdx,
      }))
    );
  };

  const handleCopyCode = (colIdx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCol(colIdx);
    setTimeout(() => setCopiedCol(null), 2000);
  };

  const handleModelChange = (colIdx: number, newSlug: string) => {
    setColumns((prev) =>
      prev.map((c, idx) => (idx === colIdx ? { ...c, modelSlug: newSlug } : c))
    );
  };

  const samplePrompts = [
    "Write an optimized React hook for debouncing search input in TypeScript.",
    "Explain Raft vs Paxos consensus mechanisms with clear tradeoffs.",
    "Design a scalable rate-limiting algorithm using Redis and token bucket.",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-text animate-page-enter">
      <header className="h-14 px-4 sm:px-6 border-b border-border bg-surface sticky top-0 z-30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors p-1.5 rounded-lg hover:bg-card shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Back to chat"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <h1 className="text-sm font-semibold text-text">Arena</h1>
        </div>

        <div className="hidden lg:flex items-center">
          <AppNavigationTabs activePage="compare" />
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="primary"
            size="sm"
            onClick={handleRunComparison}
            disabled={isRunning || !prompt.trim()}
            isLoading={isRunning}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            className="font-medium text-xs px-3"
          >
            Run
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-4">
        <div className="rounded-xl bg-surface border border-border p-3 space-y-2.5">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRunComparison();
              }}
              placeholder="Enter a prompt to compare models..."
              aria-label="Shared prompt input across all models"
              className="flex-1 bg-card px-3.5 py-2 rounded-lg border border-border text-xs sm:text-sm text-text placeholder:text-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pt-0.5">
            <span className="text-muted shrink-0">Try:</span>
            {samplePrompts.map((sp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(sp)}
                className="px-2 py-0.5 rounded-md bg-card hover:bg-surface border border-border text-muted hover:text-text transition-colors cursor-pointer truncate max-w-[200px] shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {sp.split(" ").slice(0, 4).join(" ")}...
              </button>
            ))}
          </div>
        </div>

        <div className="lg:hidden flex items-center justify-between gap-2 p-1.5 rounded-lg bg-card border border-border">
          <div
            role="radiogroup"
            aria-label="Arena layout mode"
            className="flex rounded-md bg-surface p-0.5 border border-border"
          >
            <button
              type="button"
              role="radio"
              aria-checked={mobileViewMode === "swipe"}
              onClick={() => setMobileViewMode("swipe")}
              className={`px-2 py-1 text-xs rounded transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                mobileViewMode === "swipe"
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted hover:text-text"
              }`}
            >
              Swipe
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={mobileViewMode === "stacked"}
              onClick={() => setMobileViewMode("stacked")}
              className={`px-2 py-1 text-xs rounded transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                mobileViewMode === "stacked"
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted hover:text-text"
              }`}
            >
              Stacked
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={mobileViewMode === "tabs"}
              onClick={() => setMobileViewMode("tabs")}
              className={`px-2 py-1 text-xs rounded transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                mobileViewMode === "tabs"
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted hover:text-text"
              }`}
            >
              Tabs
            </button>
          </div>

          {mobileViewMode === "tabs" && (
            <div
              role="tablist"
              aria-label="Model Columns"
              className="flex rounded-md bg-surface p-0.5 border border-border overflow-x-auto"
            >
              {columns.map((col, idx) => {
                const m =
                  FEATURED_MODELS.find((mod) => mod.slug === col.modelSlug) ||
                  FEATURED_MODELS[0];
                const isActive = activeTab === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(idx)}
                    className={`min-w-[60px] py-0.5 text-xs rounded transition-colors cursor-pointer truncate px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive
                        ? "bg-card text-text font-semibold"
                        : "text-muted hover:text-text"
                    }`}
                  >
                    {m.title.split(" ")[0]}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div
          className={
            mobileViewMode === "swipe"
              ? "flex lg:grid lg:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
              : mobileViewMode === "stacked"
              ? "flex flex-col lg:grid lg:grid-cols-3 gap-4"
              : "grid grid-cols-1 lg:grid-cols-3 gap-4"
          }
        >
          {columns.map((col, colIdx) => {
            const isVisible =
              mobileViewMode !== "tabs" || activeTab === colIdx;

            return (
              <div
                key={colIdx}
                className={`rounded-xl border transition-colors flex flex-col justify-between overflow-hidden ${
                  mobileViewMode === "swipe"
                    ? "min-w-[285px] sm:min-w-[320px] max-w-[360px] lg:max-w-none flex-shrink-0 lg:flex-shrink snap-center"
                    : "w-full"
                } ${
                  col.isWinner
                    ? "border-primary/40 bg-surface ring-1 ring-primary/20"
                    : "border-border bg-surface"
                } ${isVisible ? "flex" : "hidden lg:flex"}`}
              >
                <div className="p-3 border-b border-border space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="relative">
                      <select
                        value={col.modelSlug}
                        onChange={(e) => handleModelChange(colIdx, e.target.value)}
                        aria-label={`Select AI model for column ${colIdx + 1}`}
                        className="bg-card text-xs font-medium text-text border border-border rounded-md py-1 px-2 pr-6 appearance-none cursor-pointer focus:outline-none hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {FEATURED_MODELS.slice(0, 10).map((m) => (
                          <option key={m.slug} value={m.slug}>
                            {m.title}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3 h-3 text-muted absolute right-2 top-2 pointer-events-none" />
                    </div>

                    {col.isWinner && (
                      <Badge variant="primary" size="xs" className="gap-1 font-medium">
                        <Trophy className="w-3 h-3" />
                        <span>Winner</span>
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-muted">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      {col.latencyMs}ms
                    </span>
                    <span>{col.tokensPerSec} tok/s</span>
                    <span>{col.totalTokens} tok</span>
                  </div>
                </div>

                <div className="p-4 flex-1 overflow-y-auto max-h-[500px] space-y-3 text-xs leading-relaxed">
                  {col.reasoning && (
                    <div className="p-2.5 rounded-lg border border-border bg-card text-[11px] font-mono text-muted space-y-1">
                      <div className="flex items-center gap-1 font-semibold text-text text-[10px] uppercase">
                        <Brain className="w-3 h-3 text-secondary" />
                        <span>Reasoning</span>
                      </div>
                      <p className="whitespace-pre-line">{col.reasoning}</p>
                    </div>
                  )}

                  {col.isStreaming ? (
                    <div className="space-y-2">
                      <p className="whitespace-pre-wrap text-text">{col.content}</p>
                      <span className="inline-block w-2 h-3.5 bg-primary animate-pulse" />
                    </div>
                  ) : (
                    <MarkdownRenderer content={col.content} className="text-text" />
                  )}
                </div>

                <div className="p-2.5 border-t border-border bg-card/40 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => handleCopyCode(colIdx, col.content)}
                    aria-label={`Copy response for column ${colIdx + 1}`}
                    className="flex items-center gap-1.5 text-muted hover:text-text px-2 py-1 rounded-md hover:bg-card transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {copiedCol === colIdx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectWinner(colIdx)}
                    aria-label={`Vote column ${colIdx + 1} as arena winner`}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      col.isWinner
                        ? "bg-primary text-white"
                        : "text-muted hover:text-text hover:bg-card border border-border"
                    }`}
                  >
                    <Trophy className="w-3 h-3" />
                    <span>{col.isWinner ? "Winner" : "Vote"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
