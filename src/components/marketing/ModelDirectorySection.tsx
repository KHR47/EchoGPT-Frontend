"use client";

import React, { useState, useMemo } from "react";
import { FEATURED_MODELS, PROVIDER_STATS } from "@/shared/mock/models.mock";
import { Badge, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "@/shared/components/ui";
import { Search, Cpu, Zap, Eye, Brain, ArrowRight } from "lucide-react";

export function ModelDirectorySection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string>("all");

  const providers = [
    { id: "all", label: "All 320+ Models" },
    { id: "openai", label: "OpenAI" },
    { id: "anthropic", label: "Anthropic" },
    { id: "deepseek", label: "DeepSeek" },
    { id: "google", label: "Google" },
    { id: "meta", label: "Meta" },
    { id: "mistral", label: "Mistral" },
    { id: "open-source", label: "Open Source" },
  ];

  const filteredModels = useMemo(() => {
    return FEATURED_MODELS.filter((model) => {
      const matchesProvider =
        selectedProvider === "all" || model.provider === selectedProvider;
      const matchesSearch =
        model.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesProvider && matchesSearch;
    });
  }, [searchQuery, selectedProvider]);

  return (
    <section id="models" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <Badge variant="primary" size="sm">
          Frontier AI Library
        </Badge>
        <h2 className="font-heading font-normal sm:font-medium text-2xl sm:text-4xl text-text tracking-tight">
          320+ Models. One Unified Account.
        </h2>
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          EchoGPT integrates with OpenAI, Anthropic, Google, DeepSeek, Meta, and hundreds of open-weights weights. Pick the optimal engine for coding, reasoning, analysis, or fast chats.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {PROVIDER_STATS.map((stat) => (
          <button
            key={stat.provider}
            type="button"
            onClick={() => {
              const pId = stat.provider.toLowerCase().replace(" ", "-");
              setSelectedProvider(selectedProvider === pId ? "all" : pId);
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedProvider === stat.provider.toLowerCase().replace(" ", "-")
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-border bg-surface hover:border-border-strong"
            }`}
          >
            <div className="text-xs font-bold text-text">{stat.provider}</div>
            <div className="text-lg font-extrabold text-primary">{stat.count}</div>
            <div className="text-[10px] text-muted truncate mt-0.5">{stat.badge}</div>
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">

        <div className="w-full md:w-80">
          <Input
            placeholder="Search models (e.g. Sonnet, R1, 4o)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftAdornment={<Search className="w-4 h-4 text-muted" />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {providers.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedProvider(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedProvider === p.id
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface text-muted hover:text-text border border-border"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredModels.map((model) => (
          <Card key={model.id} variant="interactive" className="flex flex-col justify-between">
            <CardHeader className="mb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center text-primary shrink-0 shadow-2xs">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{model.title}</CardTitle>
                    <div className="text-[11px] font-mono text-muted uppercase tracking-wider">
                      {model.provider}
                    </div>
                  </div>
                </div>

                <Badge
                  variant={model.freeAccess ? "success" : "primary"}
                  size="xs"
                >
                  {model.freeAccess ? "Free Tier" : "Advanced"}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2 mt-2">
                {model.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pt-2">

              <div className="flex items-center justify-between text-[11px] text-muted font-medium bg-card/60 p-2 rounded-lg border border-border/60">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>{model.latencyTier}</span>
                </span>
                <span className="font-mono text-text">
                  {model.contextWindow ? `${(model.contextWindow / 1000).toFixed(0)}k context` : "Standard"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {model.capabilities.reasoning && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary-subtle text-primary text-[10px] font-semibold">
                    <Brain className="w-3 h-3" />
                    <span>Reasoning</span>
                  </span>
                )}
                {model.capabilities.vision && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary-subtle text-secondary text-[10px] font-semibold">
                    <Eye className="w-3 h-3" />
                    <span>Vision</span>
                  </span>
                )}
                {model.capabilities.text && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-card text-muted text-[10px] font-semibold border border-border">
                    <span>Text & Code</span>
                  </span>
                )}
              </div>
            </CardContent>

            <CardFooter className="pt-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs text-muted">Ready to chat</span>
              <a href="/app">
                <Button size="xs" variant="ghost" rightIcon={<ArrowRight className="w-3 h-3" />}>
                  Select Model
                </Button>
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="p-12 text-center border border-dashed border-border rounded-xl">
          <p className="text-sm font-semibold text-text">No models match your search.</p>
          <p className="text-xs text-muted mt-1">Try clearing your search query or selecting &quot;All 320+ Models&quot;.</p>
          <Button size="sm" variant="secondary" className="mt-4" onClick={() => { setSearchQuery(""); setSelectedProvider("all"); }}>
            Reset Filters
          </Button>
        </div>
      )}
    </section>
  );
}
