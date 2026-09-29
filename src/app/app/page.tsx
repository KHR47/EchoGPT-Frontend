"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Sidebar } from "@/components/chat/Sidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageStream } from "@/components/chat/MessageStream";
import { ChatComposerDock } from "@/components/composer/ChatComposerDock";
import { EchoLogo } from "@/shared/components/icons/EchoLogo";
import { useChatStore } from "@/shared/stores/useChatStore";
import {
  Code2,
  Pencil,
  Brain,
  Swords,
  Globe,
} from "lucide-react";

const ModelSelectorModal = dynamic(
  () => import("@/components/chat/ModelSelectorModal").then((mod) => mod.ModelSelectorModal),
  { ssr: false }
);

const SettingsModal = dynamic(
  () => import("@/components/chat/SettingsModal").then((mod) => mod.SettingsModal),
  { ssr: false }
);

const ConversationSearchModal = dynamic(
  () => import("@/components/chat/ConversationSearchModal").then((mod) => mod.ConversationSearchModal),
  { ssr: false }
);

const CommandPalette = dynamic(
  () => import("@/components/command/CommandPalette").then((mod) => mod.CommandPalette),
  { ssr: false }
);

export default function AppPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [modelModalOpen, setModelModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const conversations = useChatStore((s) => s.conversations);
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const isGenerating = useChatStore((s) => s.isGenerating);
  const setInputPrompt = useChatStore((s) => s.setInputPrompt);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const messages = activeConv ? activeConv.messages : [];
  const hasMessages = messages.length > 0 || isGenerating;

  const quickFilters = [
    {
      label: "Code & Build",
      icon: <Code2 className="w-3.5 h-3.5 text-primary" />,
      prompt: "Help me architect and write high-performance TypeScript code for: ",
    },
    {
      label: "Draft & Refine",
      icon: <Pencil className="w-3.5 h-3.5 text-amber-400" />,
      prompt: "Help me draft a clear, persuasive document for: ",
    },
    {
      label: "Deep Reasoning",
      icon: <Brain className="w-3.5 h-3.5 text-secondary" />,
      prompt: "Use DeepSeek R1 reasoning to break down step-by-step: ",
    },
    {
      label: "Compare Models",
      icon: <Swords className="w-3.5 h-3.5 text-indigo-400" />,
      prompt: "Compare how Claude 3.5 Sonnet, GPT-4o, and DeepSeek R1 approach: ",
    },
    {
      label: "Web Context",
      icon: <Globe className="w-3.5 h-3.5 text-emerald-400" />,
      prompt: "Analyze the key takeaways and technical architecture from this page: ",
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative flex h-screen w-full bg-background text-text overflow-hidden font-sans">
      <a href="#main-content" className="skip-to-content">
        Skip to chat stream & composer
      </a>

      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden lg:pl-64 transition-[padding] duration-200">
        <ChatHeader
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenModelModal={() => setModelModalOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        <main id="main-content" className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          {hasMessages ? (
            <>
              <MessageStream />
              <ChatComposerDock
                onOpenModelModal={() => setModelModalOpen(true)}
              />
            </>
          ) : (
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 flex flex-col items-center justify-center max-w-2xl sm:max-w-3xl mx-auto w-full text-center space-y-6 animate-fade-in py-8">
              <div className="flex flex-col items-center justify-center gap-3 text-center">
                <div className="relative group">
                  <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/30 blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
                  <EchoLogo className="w-13 h-13 sm:w-14 sm:h-14 relative shadow-lg" size={56} />
                </div>
                <h1 className="font-heading font-medium text-3xl sm:text-4xl text-text tracking-tight">
                  Where should we begin?
                </h1>
              </div>

              <div className="w-full">
                <ChatComposerDock
                  onOpenModelModal={() => setModelModalOpen(true)}
                  isCentered
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {quickFilters.map((qf) => (
                  <button
                    key={qf.label}
                    type="button"
                    onClick={() => setInputPrompt(qf.prompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card hover:bg-card-hover border border-border text-xs text-muted hover:text-text transition-colors cursor-pointer"
                  >
                    {qf.icon}
                    <span>{qf.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {modelModalOpen && (
        <ModelSelectorModal
          isOpen={modelModalOpen}
          onClose={() => setModelModalOpen(false)}
        />
      )}

      {settingsModalOpen && (
        <SettingsModal
          isOpen={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
        />
      )}

      {searchModalOpen && (
        <ConversationSearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
        />
      )}

      {commandPaletteOpen && (
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          onOpenModelModal={() => setModelModalOpen(true)}
          onOpenSettingsModal={() => setSettingsModalOpen(true)}
          onOpenSearchModal={() => setSearchModalOpen(true)}
        />
      )}
    </div>
  );
}
