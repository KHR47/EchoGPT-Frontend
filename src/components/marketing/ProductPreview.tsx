"use client";

import React, { useState } from "react";
import { Badge, Button } from "@/shared/components/ui";
import {
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Send,
  Paperclip,
  Mic,
  Maximize2,
  Columns,
  MessageSquare,
  FileText,
} from "lucide-react";
import { ChromeIcon } from "@/shared/components/icons/ChromeIcon";

export function ProductPreview() {
  const [activeTab, setActiveTab] = useState<"chat" | "compare" | "extension">("chat");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="preview" className="py-12 md:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="text-center space-y-2.5">
        <Badge variant="primary" size="sm">
          Interactive Workspace Preview
        </Badge>
        <h2 className="font-heading font-normal sm:font-medium text-2xl sm:text-3xl md:text-4xl text-text tracking-tight">
          Experience the Multi-AI Canvas
        </h2>
        <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto">
          Explore EchoGPT&apos;s actual interfaces: the unified single-model studio, parallel multi-model battle mode, and ambient Chrome Side Panel.
        </p>

        <div className="flex justify-center pt-2 max-w-full overflow-x-auto scrollbar-none px-1">
          <div className="inline-flex p-1 bg-card rounded-xl border border-border max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === "chat"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted hover:text-text hover:bg-surface/50"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Unified Chat Studio</span>
              <span className="sm:hidden">Studio</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("compare")}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === "compare"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted hover:text-text hover:bg-surface/50"
              }`}
            >
              <Columns className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Multi-Model Battle Mode</span>
              <span className="sm:hidden">Battle Arena</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("extension")}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === "extension"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted hover:text-text hover:bg-surface/50"
              }`}
            >
              <ChromeIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Chrome Side Panel</span>
              <span className="sm:hidden">Side Panel</span>
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface shadow-lg overflow-hidden transition-all duration-300">

        <div className="px-4 py-3 bg-card border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-[11px] font-mono text-muted ml-3 hidden sm:inline-block">
              {activeTab === "chat"
                ? "https://echogpt.live/app · Studio Canvas"
                : activeTab === "compare"
                ? "https://echogpt.live/app/compare · Parallel Battle Mode"
                : "chrome-extension://echogpt/sidepanel.html · Ambient Web Reading"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="primary" size="xs">
              Live Mock Simulation
            </Badge>
            <a href="/app" className="text-muted hover:text-text">
              <Maximize2 className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {activeTab === "chat" && (
          <div className="p-4 sm:p-6 md:p-8 space-y-6 bg-background/50 min-h-[440px] flex flex-col justify-between animate-fade-in">

            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-bold flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5" />
                  <span>Claude 3.5 Sonnet</span>
                </div>
                <span className="text-[11px] text-muted hidden sm:inline-block">
                  Press Cmd+K to switch model anytime
                </span>
              </div>
              <Badge variant="success" size="xs" dot dotPulse>
                320+ Models Ready
              </Badge>
            </div>

            <div className="space-y-4 max-w-3xl mx-auto w-full">

              <div className="flex gap-3 justify-end">
                <div className="bg-primary text-white rounded-xl rounded-tr-xs px-4 py-2.5 text-xs sm:text-sm max-w-lg shadow-xs">
                  Write a TypeScript utility function to calculate consensus agreement score between multiple AI responses.
                </div>
                <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 bg-surface border border-border rounded-xl rounded-tl-xs p-4 space-y-3 text-xs sm:text-sm text-text shadow-xs">
                  <div className="flex items-center justify-between text-xs text-muted pb-1">
                    <span className="font-semibold text-primary">Claude 3.5 Sonnet (Anthropic)</span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex items-center gap-1 hover:text-text cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied" : "Copy code"}</span>
                    </button>
                  </div>
                  <p className="leading-relaxed">
                    Here is a robust cosine similarity and n-gram consensus calculator designed for EchoGPT&apos;s multi-model comparison engine:
                  </p>
                  <div className="rounded-lg bg-black/80 border border-neutral-800 p-3 font-mono text-[11px] sm:text-xs text-emerald-400 overflow-x-auto">
                    <code>
                      {`export function calculateConsensus(responses: string[]): number {\n  if (responses.length < 2) return 1.0;\n  const tokenSets = responses.map(r => new Set(r.toLowerCase().split(/\\s+/)));\n  const intersection = [...tokenSets[0]].filter(t => tokenSets.every(s => s.has(t)));\n  return Number((intersection.length / tokenSets[0].size).toFixed(2));\n}`}
                    </code>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto w-full pt-4">
              <div className="rounded-xl border border-border bg-surface p-2 shadow-xs flex items-center gap-2">
                <div className="px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold shrink-0">
                  Claude 3.5 ▾
                </div>
                <input
                  type="text"
                  readOnly
                  value="How does this compare with DeepSeek R1 reasoning trace?"
                  className="bg-transparent flex-1 text-xs sm:text-sm text-text outline-none"
                />
                <div className="flex items-center gap-1.5 text-muted shrink-0">
                  <button type="button" className="p-1.5 hover:text-text rounded-md cursor-pointer">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-1.5 hover:text-text rounded-md cursor-pointer">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-lg bg-primary text-white hover:bg-primary-hover shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "compare" && (
          <div className="p-4 sm:p-6 md:p-8 space-y-4 bg-background/50 min-h-[440px] animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Badge variant="primary">Prompt</Badge>
                <span className="text-xs sm:text-sm font-semibold text-text">
                  &ldquo;Explain quantum entanglement to a software engineer in 2 sentences.&rdquo;
                </span>
              </div>
              <Badge variant="muted" size="xs">
                3 Models Streaming Simultaneously
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="p-4 rounded-xl bg-surface border border-border space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-text">GPT-4o</span>
                  </div>
                  <span className="text-[10px] text-muted">210ms · 48 t/s</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Quantum entanglement is like two distributed pointers that instantly reference the same synchronized memory address, regardless of network distance. When you write or observe the state of pointer A, pointer B instantaneously updates without passing packets across space.
                </p>
                <div className="pt-2">
                  <Badge variant="success" size="xs">Cleanest Analogy</Badge>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-primary/40 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-xs font-bold text-primary">Claude 3.5 Sonnet</span>
                  </div>
                  <span className="text-[10px] text-muted">340ms · 42 t/s</span>
                </div>
                <p className="text-xs text-text leading-relaxed">
                  Imagine an immutable tuple whose properties are evaluated lazily only upon inspection: reading property A immediately computes and fixes property B&apos;s value. There is no message passing or latency; the two variables simply share a single entangled state function.
                </p>
                <div className="pt-2">
                  <Badge variant="primary" size="xs">Best Code Concept</Badge>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-bold text-text">DeepSeek R1</span>
                  </div>
                  <span className="text-[10px] text-muted">520ms · Reasoning</span>
                </div>
                <div className="p-2 rounded-lg bg-card/60 text-[10px] text-muted font-mono">
                  &lt;think&gt; Target audience: dev. Analogy needed: shared state / zero lag... &lt;/think&gt;
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Entanglement is zero-latency distributed state replication where two qubits share an atomic lock without RPC overhead. Mutating one state collapses the second instantly, defying local causality.
                </p>
                <div className="pt-2">
                  <Badge variant="secondary" size="xs">Deep Reasoning</Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "extension" && (
          <div className="p-4 sm:p-6 md:p-8 bg-background/50 min-h-[440px] flex flex-col md:flex-row gap-4 animate-fade-in">

            <div className="flex-1 p-4 rounded-xl bg-card border border-border/80 space-y-3 opacity-90">
              <div className="flex items-center gap-2 text-xs text-muted pb-2 border-b border-border">
                <FileText className="w-3.5 h-3.5 text-primary" />
                <span className="font-mono text-[11px]">arxiv.org/abs/2412.0123 · Research Paper</span>
              </div>
              <h3 className="text-sm font-bold text-text">
                Scaling Laws for Mixture-of-Experts and Parallel Inference Architectures
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Modern foundational models achieve orders of magnitude lower compute cost by activating sparse parameter sets during runtime. However, multi-token inference patterns introduce distinct memory bandwidth ceilings across distributed GPU clusters...
              </p>
              <div className="p-2 rounded-lg bg-surface/80 border border-primary/30 text-xs text-primary font-medium flex items-center justify-between">
                <span>Selected: &ldquo;sparse parameter sets during runtime&rdquo;</span>
                <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold">
                  EchoGPT In-Page Rewrite
                </span>
              </div>
            </div>

            <div className="w-full md:w-80 rounded-xl bg-surface border border-border p-4 space-y-3 shadow-md">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center text-white">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-text">EchoGPT Side Panel</span>
                </div>
                <Badge variant="success" size="xs">
                  Active Tab Hooked
                </Badge>
              </div>

              <div className="p-2.5 rounded-lg bg-card border border-border space-y-2">
                <div className="text-[11px] font-semibold text-text truncate">
                  📄 Scaling Laws for MoE Architectures
                </div>
                <div className="flex gap-1.5">
                  <Button variant="primary" size="xs" className="w-full text-[10px]">
                    ⚡ Summarize Page
                  </Button>
                  <Button variant="secondary" size="xs" className="w-full text-[10px]">
                    📌 Key Takeaways
                  </Button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-background/80 border border-border text-xs space-y-1.5">
                <div className="font-semibold text-primary text-[11px]">Executive Summary:</div>
                <ul className="list-disc list-inside text-muted text-[11px] space-y-1">
                  <li>Sparse MoE cuts compute by 68% while matching dense model fidelity.</li>
                  <li>Memory bandwidth bottleneck resolved by token caching.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
