"use client";

import React, { useState, useMemo } from "react";
import { FEATURED_MODELS } from "@/shared/mock/models.mock";
import { Modal } from "@/shared/components/ui";
import { Search, Check, X } from "lucide-react";
import { useChatStore } from "@/shared/stores/useChatStore";

interface ModelSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModelSelectorModal({ isOpen, onClose }: ModelSelectorModalProps) {
  const { activeModelSlug, setActiveModel } = useChatStore();
  const [search, setSearch] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string>("all");

  const providers = [
    { id: "all", label: "All" },
    { id: "anthropic", label: "Anthropic" },
    { id: "openai", label: "OpenAI" },
    { id: "deepseek", label: "DeepSeek" },
    { id: "google", label: "Google" },
    { id: "meta", label: "Meta" },
    { id: "mistral", label: "Mistral" },
  ];

  const filtered = useMemo(() => {
    return FEATURED_MODELS.filter((m) => {
      const matchP = selectedProvider === "all" || m.provider.toLowerCase() === selectedProvider.toLowerCase();
      const matchS =
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.provider.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase());
      return matchP && matchS;
    });
  }, [search, selectedProvider]);

  const handleSelect = (slug: string) => {
    setActiveModel(slug);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Model"
      size="md"
    >
      <div className="space-y-3 pt-1">
        <div className="relative flex items-center px-3 py-2 rounded-xl bg-surface border border-border focus-within:border-primary/50 transition-colors">
          <Search className="w-4 h-4 text-muted mr-2.5 shrink-0" />
          <input
            type="text"
            placeholder="Search models..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-text placeholder:text-muted/60 focus:outline-none"
            autoFocus
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="p-0.5 rounded text-muted hover:text-text cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
          {providers.map((p) => {
            const isActive = selectedProvider === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProvider(p.id)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? "bg-card text-text shadow-2xs font-semibold"
                    : "text-muted hover:text-text hover:bg-card/40"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="max-h-[360px] overflow-y-auto space-y-0.5 pr-1 scrollbar-thin">
          {filtered.map((model) => {
            const isSelected = activeModelSlug === model.slug;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => handleSelect(model.slug)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer group ${
                  isSelected
                    ? "bg-card text-text font-medium"
                    : "text-muted hover:text-text hover:bg-card/60"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                      isSelected
                        ? "bg-primary"
                        : "bg-border-strong group-hover:bg-primary/50"
                    }`}
                  />
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-xs sm:text-sm font-medium text-text truncate">
                      {model.title}
                    </span>
                    <span className="text-[10px] uppercase font-mono text-muted/60 shrink-0">
                      {model.provider}
                    </span>
                    {model.capabilities.reasoning && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-secondary/10 text-secondary border border-secondary/20 font-medium shrink-0">
                        Reasoning
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] font-mono text-muted/60">
                    {model.contextWindow ? `${Math.round(model.contextWindow / 1000)}k` : "128k"}
                  </span>
                  {isSelected ? (
                    <Check className="w-4 h-4 text-primary shrink-0" />
                  ) : (
                    <div className="w-4 h-4" />
                  )}
                </div>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-8 text-center text-xs text-muted/60">
              No models matching &ldquo;{search}&rdquo;
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
