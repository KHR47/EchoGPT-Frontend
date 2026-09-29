"use client";

import React, { useState, useMemo } from "react";
import { useChatStore } from "@/shared/stores/useChatStore";
import { Modal, Input, Badge } from "@/shared/components/ui";
import { Search, Clock, MessageSquare, ArrowRight, X } from "lucide-react";

interface ConversationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConversationSearchModal({ isOpen, onClose }: ConversationSearchModalProps) {
  const {
    conversations,
    selectConversation,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  } = useChatStore();

  const [query, setQuery] = useState("");

  const matchingConversations = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;

    return conversations.filter((c) => {
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchModel = c.modelTitle.toLowerCase().includes(q);
      const matchContent = c.messages.some((m) => m.content.toLowerCase().includes(q));
      return matchTitle || matchModel || matchContent;
    });
  }, [conversations, query]);

  const handleSelectConversation = (id: string) => {
    if (query.trim()) {
      addRecentSearch(query.trim());
    }
    selectConversation(id);
    onClose();
  };

  const handleSelectRecent = (term: string) => {
    setQuery(term);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Search Conversations"
      description="Quickly jump to previous conversations across topics, models, and code snippets."
      size="lg"
    >
      <div className="space-y-4 pt-1">

        <div className="relative">
          <Input
            aria-label="Search conversations by topic, model, or keywords"
            placeholder="Search by topic, model, or keywords (e.g. Next.js, Stripe, DeepSeek)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftAdornment={<Search className="w-4 h-4 text-muted" aria-hidden="true" />}
            rightAdornment={
              query ? (
                <button
                  type="button"
                  aria-label="Clear search input"
                  onClick={() => setQuery("")}
                  className="p-1 text-muted hover:text-text cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              ) : null
            }
            autoFocus
            className="h-10 text-sm bg-surface"
          />
        </div>

        {recentSearches.length > 0 && !query && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted">
              <span className="flex items-center gap-1 font-semibold uppercase tracking-wider text-[10px]">
                <Clock className="w-3 h-3 text-muted" aria-hidden="true" />
                Recent Searches
              </span>
              <button
                type="button"
                aria-label="Clear all recent searches"
                onClick={clearRecentSearches}
                className="text-[11px] text-muted hover:text-text cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded px-1"
              >
                Clear
              </button>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {recentSearches.map((term, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectRecent(term)}
                  className="px-2.5 py-1 rounded-lg bg-card hover:bg-surface border border-border text-xs text-text transition-colors cursor-pointer flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Clock className="w-3 h-3 text-muted/60" aria-hidden="true" />
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted pt-1">
          <span role="status" aria-live="polite">
            {query ? `Found ${matchingConversations.length} matching conversations` : "All Conversations"}
          </span>
          <span className="font-mono text-[10px]">Press Enter to select</span>
        </div>

        <div
          role="region"
          aria-label="Matching conversations"
          className="max-h-72 overflow-y-auto space-y-1.5 pr-1"
        >
          {matchingConversations.map((c) => {
            const lastMessage = c.messages[c.messages.length - 1]?.content || "";
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectConversation(c.id)}
                className="w-full text-left group p-3 rounded-lg bg-surface hover:bg-card border border-border hover:border-primary/40 transition-colors duration-150 cursor-pointer flex items-center justify-between gap-3 shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="min-w-0 space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                    <span className="text-xs font-bold text-text group-hover:text-primary transition-colors truncate">
                      {c.title}
                    </span>
                    <Badge variant="muted" size="xs" className="shrink-0">
                      {c.modelTitle}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-muted truncate pl-5">
                    {lastMessage.slice(0, 90)}...
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-muted/70">{c.dateGroup}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-primary transition-colors" aria-hidden="true" />
                </div>
              </button>
            );
          })}

          {matchingConversations.length === 0 && (
            <div role="status" className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center text-muted mx-auto shadow-2xs">
                <Search className="w-5 h-5 text-muted" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-text">No conversations found</h4>
                <p className="text-xs text-muted max-w-xs mx-auto mt-1">
                  No previous conversations match &ldquo;{query}&rdquo;. Try searching by model name like &ldquo;Claude&rdquo; or by topic like &ldquo;consensus&rdquo;.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
