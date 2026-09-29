"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/shared/stores/useChatStore";
import { useTheme } from "@/shared/components/ThemeProvider";
import {
  Search,
  Plus,
  Sparkles,
  Settings,
  Sun,
  Moon,
  Swords,
  Highlighter,
  Globe,
  CornerDownLeft,
  X,
  Command,
  MessageSquare,
  Laptop,
  SlidersHorizontal,
  CreditCard,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenModelModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenSearchModal: () => void;
}

interface PaletteAction {
  id: string;
  category: "Navigation" | "Chat & History" | "Context & Productivity" | "System & Workspace";
  title: string;
  description: string;
  icon: React.ReactNode;
  shortcut?: string;
  run: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onOpenModelModal,
  onOpenSettingsModal,
  onOpenSearchModal,
}: CommandPaletteProps) {
  const router = useRouter();
  const { startNewChat, setContextMode, setActiveQuickAction, setInputPrompt } = useChatStore();
  const { resolvedTheme, setTheme } = useTheme();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else if (previouslyFocusedRef.current) {
      previouslyFocusedRef.current.focus();
      previouslyFocusedRef.current = null;
    }
  }, [isOpen]);

  const actions: PaletteAction[] = useMemo(() => [
    {
      id: "go-chat",
      category: "Navigation",
      title: "Go to Chat Workspace",
      description: "Main multi-model chat and conversation thread",
      icon: <MessageSquare className="w-4 h-4 text-primary" />,
      shortcut: "⌘1",
      run: () => {
        onClose();
        router.push("/app");
      },
    },
    {
      id: "go-arena",
      category: "Navigation",
      title: "Go to Model Arena",
      description: "Compare Claude, GPT-4o, and DeepSeek side-by-side",
      icon: <Swords className="w-4 h-4 text-secondary" />,
      shortcut: "⌘2",
      run: () => {
        onClose();
        router.push("/app/compare");
      },
    },
    {
      id: "go-extension",
      category: "Navigation",
      title: "Go to Extension Studio",
      description: "Interactive Chrome Side Panel simulator with DOM context",
      icon: <Laptop className="w-4 h-4 text-primary" />,
      shortcut: "⌘3",
      run: () => {
        onClose();
        router.push("/app/extension-preview");
      },
    },
    {
      id: "go-settings",
      category: "Navigation",
      title: "Go to Settings & Keys",
      description: "Manage BYO API keys, custom system instructions, and themes",
      icon: <SlidersHorizontal className="w-4 h-4 text-emerald-400" />,
      shortcut: "⌘4",
      run: () => {
        onClose();
        router.push("/app/settings");
      },
    },
    {
      id: "go-pricing",
      category: "Navigation",
      title: "View Pricing Plans",
      description: "Compare Free, Plus, Pro, and Max tiers and capabilities",
      icon: <CreditCard className="w-4 h-4 text-primary" />,
      shortcut: "⌘5",
      run: () => {
        onClose();
        router.push("/app/pricing");
      },
    },
    {
      id: "go-landing",
      category: "Navigation",
      title: "Go to Product Showcase",
      description: "Explore marketing overview, 320+ model directory, and FAQ",
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      shortcut: "⌘6",
      run: () => {
        onClose();
        router.push("/landing");
      },
    },
    {
      id: "new-chat",
      category: "Chat & History",
      title: "New Conversation",
      description: "Start a fresh multi-model discussion",
      icon: <Plus className="w-4 h-4 text-primary" />,
      shortcut: "⌘N",
      run: () => {
        startNewChat();
        onClose();
      },
    },
    {
      id: "search-chats",
      category: "Chat & History",
      title: "Search Conversations",
      description: "Find previous topics, models, or code",
      icon: <Search className="w-4 h-4 text-emerald-400" />,
      shortcut: "⌘F",
      run: () => {
        onClose();
        onOpenSearchModal();
      },
    },
    {
      id: "summarize-page",
      category: "Context & Productivity",
      title: "Summarize Page",
      description: "Attach current webpage context & generate summary",
      icon: <Globe className="w-4 h-4 text-secondary" />,
      shortcut: "⌘⇧S",
      run: () => {
        setContextMode("webpage");
        setActiveQuickAction("summarize");
        setInputPrompt("Summarize the key takeaways and practical insights from this page.");
        onClose();
      },
    },
    {
      id: "explain-selection",
      category: "Context & Productivity",
      title: "Explain Selection",
      description: "Attach highlighted text & break down concepts",
      icon: <Highlighter className="w-4 h-4 text-amber-400" />,
      shortcut: "⌘⇧E",
      run: () => {
        setContextMode("selection");
        setActiveQuickAction("explain");
        setInputPrompt("Explain this selected text step-by-step with practical examples.");
        onClose();
      },
    },
    {
      id: "change-model",
      category: "Context & Productivity",
      title: "Change AI Model",
      description: "Switch between 320+ models (Claude, GPT, DeepSeek)",
      icon: <Sparkles className="w-4 h-4 text-primary" />,
      shortcut: "⌘M",
      run: () => {
        onClose();
        onOpenModelModal();
      },
    },
    {
      id: "arena-compare",
      category: "System & Workspace",
      title: "Multi-Model Arena",
      description: "Compare Claude, DeepSeek, and GPT side-by-side",
      icon: <Swords className="w-4 h-4 text-secondary" />,
      shortcut: "⌘B",
      run: () => {
        onClose();
        router.push("/app/compare");
      },
    },
    {
      id: "open-settings",
      category: "System & Workspace",
      title: "Open Settings",
      description: "Manage appearance, streaming speed, and billing",
      icon: <Settings className="w-4 h-4 text-muted" />,
      shortcut: "⌘,",
      run: () => {
        onClose();
        onOpenSettingsModal();
      },
    },
    {
      id: "toggle-theme",
      category: "System & Workspace",
      title: `Toggle Theme (${resolvedTheme === "dark" ? "Light" : "Dark"})`,
      description: `Switch to ${resolvedTheme === "dark" ? "Lilac Light" : "Obsidian Dark"} theme`,
      icon: resolvedTheme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />,
      shortcut: "⌘T",
      run: () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        onClose();
      },
    },
  ], [
    onClose,
    onOpenModelModal,
    onOpenSearchModal,
    onOpenSettingsModal,
    resolvedTheme,
    router,
    setActiveQuickAction,
    setContextMode,
    setInputPrompt,
    setTheme,
    startNewChat,
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }, [actions, query]);

  const executeAction = useCallback((action: PaletteAction) => {
    action.run();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable && focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        } else {
          e.preventDefault();
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          executeAction(filtered[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [filtered, selectedIndex, executeAction, onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4"
    >

      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fade-in"
      />

      <div
        ref={dialogRef}
        onKeyDown={handleKeyDown}
        className="relative w-full max-w-xl rounded-xl bg-surface border border-border shadow-xl overflow-hidden z-10 animate-scale-in"
      >

        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-card/40">
          <Command className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-controls="command-actions-list"
            aria-activedescendant={filtered[selectedIndex] ? `cmd-opt-${filtered[selectedIndex].id}` : undefined}
            aria-label="Type a command or search actions"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search actions..."
            autoFocus
            className="w-full bg-transparent text-sm text-text placeholder:text-muted/60 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear query input"
              onClick={() => setQuery("")}
              className="p-1 rounded text-muted hover:text-text cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          ) : (
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-muted" aria-hidden="true">
              ESC
            </kbd>
          )}
        </div>

        <div
          id="command-actions-list"
          role="listbox"
          aria-label="Available commands"
          className="max-h-80 overflow-y-auto p-2 space-y-1"
        >
          {filtered.map((action, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={action.id}
                id={`cmd-opt-${action.id}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => executeAction(action)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between p-2.5 rounded-lg transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                    : "text-text hover:bg-card border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? "bg-primary text-white" : "bg-surface border border-border text-muted"
                    }`}
                  >
                    {action.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{action.title}</div>
                    <div className="text-[11px] text-muted truncate">{action.description}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {action.shortcut && (
                    <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border/70 text-[10px] font-mono text-muted">
                      {action.shortcut}
                    </kbd>
                  )}
                  {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-primary" aria-hidden="true" />}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div role="status" className="py-8 text-center text-xs text-muted">
              No commands matching &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-surface/90 border-t border-border/70 flex items-center justify-between text-[11px] text-muted" aria-hidden="true">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono">
              <kbd className="px-1 py-0.5 rounded bg-card border border-border text-[9px]">↑</kbd>
              <kbd className="px-1 py-0.5 rounded bg-card border border-border text-[9px]">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1 font-mono">
              <kbd className="px-1.5 py-0.5 rounded bg-card border border-border text-[9px]">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <span className="text-[10px] font-medium text-primary">EchoGPT Command Bar</span>
        </div>
      </div>
    </div>
  );
}
