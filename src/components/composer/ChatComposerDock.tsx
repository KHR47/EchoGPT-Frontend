"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useChatStore } from "@/shared/stores/useChatStore";
import { FEATURED_MODELS } from "@/shared/mock/models.mock";
import {
  Plus,
  ArrowUp,
  Square,
  Mic,
  MicOff,
  ChevronDown,
  X,
  Globe,
  Highlighter,
  FileCode,
  AudioWaveform,
} from "lucide-react";

interface ChatComposerDockProps {
  onOpenModelModal: () => void;
  isCentered?: boolean;
}

export function ChatComposerDock({ onOpenModelModal, isCentered = false }: ChatComposerDockProps) {
  const activeModelSlug = useChatStore((s) => s.activeModelSlug);
  const isGenerating = useChatStore((s) => s.isGenerating);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const inputPrompt = useChatStore((s) => s.inputPrompt);
  const setInputPrompt = useChatStore((s) => s.setInputPrompt);
  const activeContext = useChatStore((s) => s.activeContext);
  const setContextMode = useChatStore((s) => s.setContextMode);
  const removeContext = useChatStore((s) => s.removeContext);

  const [isRecording, setIsRecording] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [activeMode, setActiveMode] = useState<"chat" | "cowork">("chat");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);

  const activeModel =
    FEATURED_MODELS.find((m) => m.slug === activeModelSlug) || FEATURED_MODELS[0];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 48), 180)}px`;
    }
  }, [inputPrompt]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) {
        setShowAttachMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = () => {
    if (!inputPrompt.trim() || isGenerating) return;
    const messageToSend = attachedFile
      ? `[Attached: ${attachedFile}]\n\n${inputPrompt}`
      : inputPrompt;
    sendMessage(messageToSend);
    setInputPrompt("");
    setAttachedFile(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setInputPrompt(
          inputPrompt
            ? `${inputPrompt} Compare DeepSeek R1 and Sonnet 3.5.`
            : "Compare DeepSeek R1 and Sonnet 3.5."
        );
        setIsRecording(false);
      }, 2000);
    }
  };

  const modelDisplayName = activeModel.title
    .replace(/^Claude\s*/i, "")
    .replace(/^Anthropic\s*/i, "");

  return (
    <div className={isCentered ? "w-full" : "p-3 sm:p-4 max-w-3xl mx-auto w-full"}>
      <div className="relative rounded-2xl bg-card border border-border shadow-xs focus-within:border-border-strong transition-all duration-150 overflow-hidden w-full flex flex-col justify-between min-h-[120px]">
        {activeContext && (
          <div className="px-3.5 pt-3 pb-1 flex items-center justify-between text-xs animate-context-pop">
            <div className="flex items-center gap-1.5 min-w-0">
              {activeContext.type === "webpage" ? (
                <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
              ) : (
                <Highlighter className="w-3.5 h-3.5 text-primary shrink-0" />
              )}
              <span className="font-medium text-text truncate max-w-[280px]">
                {activeContext.title}
              </span>
              <span className="text-[10px] text-muted font-mono">
                ({activeContext.tokenCount} tokens)
              </span>
            </div>
            <button
              type="button"
              onClick={removeContext}
              className="p-1 rounded text-muted hover:text-text cursor-pointer"
              aria-label="Remove context"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {attachedFile && (
          <div className="px-3.5 pt-3 pb-1 flex items-center gap-2 animate-context-pop">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface border border-border text-xs text-text">
              <FileCode className="w-3.5 h-3.5 text-primary" />
              <span className="font-mono text-[11px] truncate max-w-[180px]">
                {attachedFile}
              </span>
              <button
                type="button"
                onClick={() => setAttachedFile(null)}
                className="p-0.5 rounded text-muted hover:text-text cursor-pointer"
                aria-label="Remove file"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <textarea
          ref={textareaRef}
          rows={1}
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Prompt input"
          placeholder={isCentered ? "Ask anything, compare models, or summarize context..." : "Message EchoGPT..."}
          className="w-full bg-transparent px-4 pt-3.5 pb-2 text-sm sm:text-base text-text placeholder:text-muted focus:outline-none resize-none leading-relaxed min-h-[52px]"
        />

        <div className="flex items-center justify-between px-3 pb-3 pt-1 gap-2 relative">
          <div className="flex items-center gap-2" ref={attachMenuRef}>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="w-8 h-8 rounded-full border border-border hover:bg-surface text-muted hover:text-text flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Attach file or context"
                aria-expanded={showAttachMenu}
              >
                <Plus className="w-4 h-4" />
              </button>

              {showAttachMenu && (
                <div className="absolute left-0 bottom-full mb-2 w-52 p-1.5 rounded-xl bg-card border border-border shadow-md z-30 space-y-1 text-xs animate-scale-in">
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedFile("architecture.ts (4.8 KB)");
                      setShowAttachMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-surface text-text text-left cursor-pointer transition-colors"
                  >
                    <FileCode className="w-4 h-4 text-muted" />
                    <span>Upload file</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setContextMode("webpage");
                      setShowAttachMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-surface text-text text-left cursor-pointer transition-colors"
                  >
                    <Globe className="w-4 h-4 text-muted" />
                    <span>Attach current webpage</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setContextMode("selection");
                      setShowAttachMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-surface text-text text-left cursor-pointer transition-colors"
                  >
                    <Highlighter className="w-4 h-4 text-muted" />
                    <span>Attach selected text</span>
                  </button>
                </div>
              )}
            </div>

            <div className="inline-flex items-center p-0.5 rounded-lg bg-surface border border-border text-xs">
              <button
                type="button"
                onClick={() => setActiveMode("chat")}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeMode === "chat"
                    ? "bg-card text-text shadow-2xs font-semibold"
                    : "text-muted hover:text-text"
                }`}
              >
                Chat
              </button>
              <Link
                href="/app/compare"
                className="px-2.5 py-1 rounded-md font-medium text-muted hover:text-text transition-colors"
              >
                Arena
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenModelModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-muted hover:text-text hover:bg-surface transition-colors cursor-pointer"
              title="Select model"
            >
              <span className="truncate max-w-[120px] text-text font-medium">{modelDisplayName}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-card border border-border text-primary font-mono font-medium">
                {activeModel.provider}
              </span>
              <ChevronDown className="w-3 h-3 text-muted/60" />
            </button>

            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isRecording
                  ? "text-secondary animate-pulse"
                  : "text-muted hover:text-text hover:bg-surface"
              }`}
              aria-label="Voice input"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {isGenerating ? (
              <button
                type="button"
                onClick={() => useChatStore.setState({ isGenerating: false })}
                className="w-8 h-8 rounded-full bg-error text-white flex items-center justify-center cursor-pointer shadow-xs"
                aria-label="Stop generation"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : inputPrompt.trim() ? (
              <button
                type="button"
                onClick={handleSend}
                className="w-8 h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                aria-label="Send message"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleToggleVoice}
                className="w-8 h-8 rounded-full hover:bg-surface text-muted hover:text-text flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Voice dictation"
              >
                <AudioWaveform className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
