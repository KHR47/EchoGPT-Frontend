"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useChatStore } from "@/shared/stores/useChatStore";
import { useTheme } from "@/shared/components/ThemeProvider";
import { AppNavigationTabs } from "@/components/navigation/AppNavigationTabs";
import {
  Menu,
  Sun,
  Moon,
  Check,
  Pencil,
  Search,
} from "lucide-react";

interface ChatHeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenModelModal?: () => void;
  onOpenCommandPalette?: () => void;
}

export function ChatHeader({
  onOpenMobileSidebar,
  onOpenCommandPalette,
}: ChatHeaderProps) {
  const conversations = useChatStore((s) => s.conversations);
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const renameConversation = useChatStore((s) => s.renameConversation);
  const { resolvedTheme, setTheme } = useTheme();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const title = activeConv ? activeConv.title : "";
  const hasMessages = (activeConv?.messages || []).length > 0;

  const handleStartRename = () => {
    setEditedTitle(title);
    setIsEditingTitle(true);
  };

  const handleSaveRename = () => {
    if (activeConversationId && editedTitle.trim()) {
      renameConversation(activeConversationId, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="h-13 px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 z-20 border-b border-border/40">
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open sidebar"
          className="lg:hidden p-1.5 rounded-md text-muted hover:text-text hover:bg-card transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {hasMessages && (
          <div className="flex items-center gap-1.5 min-w-0">
            {isEditingTitle ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveRename();
                    if (e.key === "Escape") setIsEditingTitle(false);
                  }}
                  autoFocus
                  className="bg-card border border-border text-text px-2 py-0.5 rounded text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveRename}
                  className="p-1 rounded text-primary hover:bg-primary/10 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartRename}
                className="group flex items-center gap-1 text-xs text-muted hover:text-text cursor-pointer truncate max-w-[160px] sm:max-w-xs focus:outline-none"
              >
                <span className="truncate">{title}</span>
                <Pencil className="w-3 h-3 text-muted/40 group-hover:text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="hidden md:flex items-center">
        <AppNavigationTabs activePage="chat" />
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3 text-xs">
        {onOpenCommandPalette && (
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card/60 hover:bg-card border border-border text-muted hover:text-text transition-colors cursor-pointer"
            aria-label="Search and command palette"
          >
            <Search className="w-3.5 h-3.5 text-muted" />
            <span className="hidden sm:inline text-[11px]">Search</span>
            <kbd className="hidden sm:inline-block px-1 py-0.2 rounded bg-surface border border-border/80 text-[10px] font-mono text-muted/80">
              ⌘K
            </kbd>
          </button>
        )}

        <div className="hidden xs:flex items-center gap-1.5 text-xs">
          <Link
            href="/app/compare"
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20 transition-colors font-semibold text-[11px]"
          >
            <span>320+ Models</span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-card transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500" />
          )}
        </button>
      </div>
    </header>
  );
}
