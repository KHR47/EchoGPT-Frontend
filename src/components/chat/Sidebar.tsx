"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useChatStore } from "@/shared/stores/useChatStore";
import { EchoLogo } from "@/shared/components/icons/EchoLogo";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
} from "@/shared/components/ui";
import {
  Plus,
  MessageSquare,
  Swords,
  Laptop,
  SlidersHorizontal,
  Sparkles,
  Search,
  Download,
  Trash2,
  X,
  ChevronDown,
  LogOut,
  ExternalLink,
  CreditCard,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
  onOpenSearch: () => void;
  onOpenCommandPalette?: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  onOpenSettings,
  onOpenSearch,
  onOpenCommandPalette,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const conversations = useChatStore((s) => s.conversations);
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const selectConversation = useChatStore((s) => s.selectConversation);
  const startNewChat = useChatStore((s) => s.startNewChat);
  const deleteConversation = useChatStore((s) => s.deleteConversation);

  const isChatActive = pathname === "/app" && activeConversationId !== null;

  const handleSelect = (id: string) => {
    selectConversation(id);
    onClose();
  };

  const handleNewChat = () => {
    startNewChat();
    onClose();
  };

  const handleExportAll = () => {
    if (conversations.length === 0) return;
    const blob = new Blob([JSON.stringify(conversations, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `echogpt_conversations_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden animate-fade-in"
        />
      )}

      <aside
        aria-label="Workspace Navigation & History"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-surface border-r border-border flex flex-col justify-between transition-transform duration-200 ease-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          <div className="p-3.5 space-y-3">
            <div className="flex items-center justify-between px-1">
              <Link
                href="/app"
                className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                aria-label="EchoGPT Studio"
              >
                <EchoLogo className="w-6 h-6 shrink-0 shadow-2xs" size={24} />
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold text-base tracking-tight text-text">
                    Echo<span className="text-primary">GPT</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-primary/10 text-primary border border-primary/20 font-bold uppercase">
                    Studio
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close sidebar"
                className="p-1 rounded-md text-muted hover:text-text lg:hidden cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleNewChat}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-card hover:bg-card-hover border border-border text-sm font-medium text-text transition-colors cursor-pointer shadow-2xs group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span>New Chat</span>
              </div>
              <span className="text-[10px] text-muted font-mono bg-surface px-1.5 py-0.5 rounded border border-border">
                ⌘N
              </span>
            </button>

            <nav className="space-y-0.5 text-xs font-medium text-muted">
              <Link
                href="/app"
                onClick={() => {
                  if (activeConversationId === null) handleNewChat();
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  pathname === "/app"
                    ? "bg-card text-text font-semibold shadow-2xs"
                    : "hover:bg-card/70 hover:text-text"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className={`w-4 h-4 ${pathname === "/app" ? "text-primary" : "text-muted"}`} />
                  <span>Chat Workspace</span>
                </div>
              </Link>

              <Link
                href="/app/compare"
                onClick={onClose}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  pathname === "/app/compare"
                    ? "bg-card text-text font-semibold shadow-2xs"
                    : "hover:bg-card/70 hover:text-text"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Swords className={`w-4 h-4 ${pathname === "/app/compare" ? "text-secondary" : "text-muted"}`} />
                  <span>Model Arena</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-secondary/15 text-secondary border border-secondary/20 font-bold uppercase">
                  3-Way
                </span>
              </Link>

              <Link
                href="/app/extension-preview"
                onClick={onClose}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  pathname === "/app/extension-preview"
                    ? "bg-card text-text font-semibold shadow-2xs"
                    : "hover:bg-card/70 hover:text-text"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Laptop className={`w-4 h-4 ${pathname === "/app/extension-preview" ? "text-primary" : "text-muted"}`} />
                  <span>Extension Studio</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold uppercase">
                  MV3
                </span>
              </Link>

              <Link
                href="/app/pricing"
                onClick={onClose}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  pathname === "/app/pricing"
                    ? "bg-card text-text font-semibold shadow-2xs"
                    : "hover:bg-card/70 hover:text-text"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className={`w-4 h-4 ${pathname === "/app/pricing" ? "text-primary" : "text-muted"}`} />
                  <span>Pricing Plans</span>
                </div>
              </Link>

              <Link
                href="/app/settings"
                onClick={onClose}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  pathname === "/app/settings"
                    ? "bg-card text-text font-semibold shadow-2xs"
                    : "hover:bg-card/70 hover:text-text"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal className={`w-4 h-4 ${pathname === "/app/settings" ? "text-primary" : "text-muted"}`} />
                  <span>Settings & Keys</span>
                </div>
              </Link>

              <Link
                href="/landing"
                onClick={onClose}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-card/70 hover:text-text transition-colors cursor-pointer text-muted"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Product Showcase</span>
                </div>
                <ExternalLink className="w-3 h-3 text-muted/60" />
              </Link>

              {onOpenCommandPalette && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCommandPalette();
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-card/70 hover:text-text transition-colors text-left cursor-pointer text-muted pt-1"
                >
                  <div className="flex items-center gap-2.5">
                    <Search className="w-4 h-4 text-muted" />
                    <span>Command Menu</span>
                  </div>
                  <kbd className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface border border-border text-muted">
                    ⌘K
                  </kbd>
                </button>
              )}
            </nav>
          </div>

          <div className="flex-1 flex flex-col min-h-0 px-3 pt-2">
            <div className="flex items-center justify-between px-2 pb-1.5 text-[11px] font-medium text-muted">
              <span>Chats and tasks</span>
              <span className="text-[10px] font-mono text-muted/60">{conversations.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-0.5 scrollbar-thin">
              {conversations.map((c) => {
                const isActive = isChatActive && activeConversationId === c.id;
                return (
                  <div
                    key={c.id}
                    className={`group relative flex items-center justify-between rounded-lg text-xs transition-colors ${
                      isActive
                        ? "bg-card text-text font-medium"
                        : "text-muted hover:bg-card/60 hover:text-text"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelect(c.id)}
                      className="flex-1 flex items-center gap-2 truncate px-2.5 py-1.5 text-left cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-lg"
                    >
                      <span className="w-1 h-1 rounded-full bg-border-strong group-hover:bg-primary shrink-0" />
                      <span className="truncate">{c.title}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(c.id);
                      }}
                      className="p-1 mr-1 rounded text-muted/50 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer focus:opacity-100"
                      aria-label={`Delete ${c.title}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}

              {conversations.length === 0 && (
                <div className="py-6 text-center text-xs text-muted/60">
                  No conversations yet
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-border flex items-center justify-between gap-2">
          <Dropdown className="flex-1 min-w-0">
            <DropdownTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-card transition-colors cursor-pointer w-full text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-primary min-w-0"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs font-bold text-white shadow-2xs shrink-0">
                  H
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <div className="text-text font-medium truncate flex items-center gap-1.5">
                    <span>Hasan</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-primary/15 text-primary border border-primary/25 font-bold uppercase">Pro</span>
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-muted shrink-0" />
              </button>
            </DropdownTrigger>

            <DropdownMenu align="left" className="w-56 mb-2 bottom-full top-auto">
              <div className="px-3 py-2 border-b border-border text-[11px] text-muted">
                Signed in as <strong className="text-text">hasan@echogpt.live</strong>
              </div>

              <DropdownItem
                icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
                onClick={() => {
                  router.push("/app/settings");
                  onClose();
                }}
              >
                Account Settings & Keys
              </DropdownItem>

              <DropdownItem
                icon={<Swords className="w-3.5 h-3.5 text-secondary" />}
                onClick={() => {
                  router.push("/app/compare");
                  onClose();
                }}
              >
                Model Arena
              </DropdownItem>

              <DropdownItem
                icon={<Laptop className="w-3.5 h-3.5 text-primary" />}
                onClick={() => {
                  router.push("/app/extension-preview");
                  onClose();
                }}
              >
                Extension Studio
              </DropdownItem>

              <DropdownItem
                icon={<CreditCard className="w-3.5 h-3.5 text-primary" />}
                onClick={() => {
                  router.push("/app/pricing");
                  onClose();
                }}
              >
                Pricing Plans
              </DropdownItem>

              <DropdownItem
                icon={<Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                onClick={() => {
                  router.push("/landing");
                  onClose();
                }}
              >
                Product Showcase
              </DropdownItem>

              {onOpenSettings && (
                <DropdownItem
                  icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
                  onClick={() => {
                    onOpenSettings();
                    onClose();
                  }}
                >
                  Quick Preferences Modal
                </DropdownItem>
              )}

              <DropdownSeparator />

              <DropdownItem
                icon={<Download className="w-3.5 h-3.5" />}
                onClick={handleExportAll}
              >
                Export All Conversations
              </DropdownItem>

              <DropdownItem
                icon={<Search className="w-3.5 h-3.5" />}
                onClick={() => {
                  if (onOpenCommandPalette) onOpenCommandPalette();
                  else onOpenSearch();
                }}
              >
                Command Menu (⌘K)
              </DropdownItem>

              <DropdownSeparator />

              <DropdownItem destructive icon={<LogOut className="w-3.5 h-3.5" />}>
                Sign Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleExportAll}
              className="p-1.5 rounded-md text-muted hover:text-text hover:bg-card transition-colors cursor-pointer"
              title="Download data"
              aria-label="Download all conversations"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenCommandPalette) onOpenCommandPalette();
                else onOpenSearch();
              }}
              className="p-1.5 rounded-md text-muted hover:text-text hover:bg-card transition-colors cursor-pointer"
              title="Search (⌘K)"
              aria-label="Search conversations"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
