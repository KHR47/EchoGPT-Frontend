"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { useChatStore } from "@/shared/stores/useChatStore";
import { FEATURED_MODELS } from "@/shared/mock/models.mock";
import { Badge, ErrorState, Tooltip } from "@/shared/components/ui";
import {
  Sparkles,
  Copy,
  Check,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  RotateCw,
  Brain,
  ChevronDown,
  ChevronRight,
  User,
} from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";

export function MessageStream() {
  const conversations = useChatStore((s) => s.conversations);
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const activeModelSlug = useChatStore((s) => s.activeModelSlug);
  const isGenerating = useChatStore((s) => s.isGenerating);
  const streamingContent = useChatStore((s) => s.streamingContent);
  const error = useChatStore((s) => s.error);
  const clearError = useChatStore((s) => s.clearError);
  const regenerateLastMessage = useChatStore((s) => s.regenerateLastMessage);
  const setMessageFeedback = useChatStore((s) => s.setMessageFeedback);

  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const activeModel =
    FEATURED_MODELS.find((m) => m.slug === activeModelSlug) || FEATURED_MODELS[0];

  const messages = useMemo(() => (activeConv ? activeConv.messages : []), [activeConv]);

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent, isGenerating]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSpeak = (id: string) => {
    if (speakingId === id) {
      setSpeakingId(null);
    } else {
      setSpeakingId(id);
      setTimeout(() => setSpeakingId(null), 5000);
    }
  };

  const toggleReasoning = (id: string) => {
    setExpandedReasoning((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleFeedback = (messageId: string, currentFeedback: "like" | "dislike" | null, next: "like" | "dislike") => {
    if (currentFeedback === next) {
      setMessageFeedback(messageId, null);
    } else {
      setMessageFeedback(messageId, next);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 py-6 space-y-6">
      <div className="max-w-3xl lg:max-w-4xl mx-auto space-y-6">

        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {isGenerating ? `EchoGPT is generating a response using ${activeModel.title}...` : ""}
        </div>

        {error && (
          <div className="animate-in fade-in-0 slide-in-from-top-4 duration-300">
            <ErrorState
              title="Model Inference Error"
              message={error}
              onRetry={() => {
                clearError();
                regenerateLastMessage();
              }}
              retryLabel="Retry with exponential backoff"
              className="my-3 border-error/40 bg-error/10 text-left"
            />
          </div>
        )}

        {messages.length === 0 && !isGenerating && null}

        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          const isLastAssistant =
            !isUser && index === messages.length - 1;

          const model = msg.modelSlug
            ? FEATURED_MODELS.find((m) => m.slug === msg.modelSlug) || activeModel
            : activeModel;

          return (
            <div
              key={msg.messageId}
              className={`flex gap-3 sm:gap-4 ${
                isUser ? "justify-end" : "justify-start"
              } animate-message-enter`}
            >

              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shrink-0 shadow-2xs mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] rounded-2xl p-3.5 sm:p-4.5 ${
                  isUser
                    ? "bg-surface border border-border text-text rounded-br-xs shadow-xs"
                    : "bg-card border border-border text-text rounded-tl-xs shadow-xs space-y-3"
                }`}
              >

                {!isUser && (
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/50 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text">{model.title}</span>
                      <Badge variant="muted" size="xs">
                        {model.provider.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-muted">{msg.createdAt}</span>
                  </div>
                )}

                {!isUser && msg.reasoningContent && (
                  <div className="rounded-lg border border-secondary/30 bg-secondary/5 overflow-hidden text-xs">
                    <button
                      type="button"
                      aria-expanded={!!expandedReasoning[msg.messageId]}
                      onClick={() => toggleReasoning(msg.messageId)}
                      className="w-full flex items-center justify-between p-2.5 font-medium text-secondary hover:bg-secondary/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                    >
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-secondary" aria-hidden="true" />
                        <span>Thinking Trace (4.2s)</span>
                      </div>
                      {expandedReasoning[msg.messageId] ? (
                        <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                    </button>
                    {expandedReasoning[msg.messageId] && (
                      <div className="p-3 pt-0 border-t border-secondary/20 text-muted whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                        {msg.reasoningContent}
                      </div>
                    )}
                  </div>
                )}

                <div className={isUser ? "text-sm sm:text-[15px] leading-relaxed" : ""}>
                  {isUser ? msg.content : <MarkdownRenderer content={msg.content} />}
                </div>

                {isUser && (
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-white/70 text-[11px]">
                    <span>{msg.createdAt}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.messageId, msg.content)}
                      className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      title="Copy prompt"
                      aria-label="Copy prompt"
                    >
                      {copiedId === msg.messageId ? (
                        <Check className="w-3 h-3 text-white" aria-hidden="true" />
                      ) : (
                        <Copy className="w-3 h-3" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                )}

                {!isUser && (
                  <div className="flex items-center justify-between pt-2.5 border-t border-border/50 text-muted">
                    <div className="flex items-center gap-1">

                      <Tooltip content={copiedId === msg.messageId ? "Copied!" : "Copy message"}>
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.messageId, msg.content)}
                          className="p-1.5 rounded-lg hover:text-text hover:bg-surface transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          aria-label="Copy response"
                        >
                          {copiedId === msg.messageId ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          )}
                        </button>
                      </Tooltip>

                      {isLastAssistant && (
                        <Tooltip content="Regenerate this response with active model">
                          <button
                            type="button"
                            onClick={() => regenerateLastMessage()}
                            className="p-1.5 rounded-lg hover:text-text hover:bg-surface transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            aria-label="Regenerate response"
                          >
                            <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </Tooltip>
                      )}

                      <Tooltip content={speakingId === msg.messageId ? "Stop speech" : "Read aloud"}>
                        <button
                          type="button"
                          onClick={() => handleToggleSpeak(msg.messageId)}
                          className={`p-1.5 rounded-lg hover:text-text hover:bg-surface transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                            speakingId === msg.messageId ? "text-primary animate-pulse" : ""
                          }`}
                          aria-label={speakingId === msg.messageId ? "Stop read aloud" : "Read response aloud"}
                        >
                          {speakingId === msg.messageId ? (
                            <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                          )}
                        </button>
                      </Tooltip>

                      <Tooltip content="Good response">
                        <button
                          type="button"
                          onClick={() => handleFeedback(msg.messageId, msg.feedback || null, "like")}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                            msg.feedback === "like"
                              ? "text-emerald-500 bg-emerald-500/10"
                              : "hover:text-text hover:bg-surface"
                          }`}
                          aria-label="Thumbs up"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </Tooltip>

                      <Tooltip content="Poor response">
                        <button
                          type="button"
                          onClick={() => handleFeedback(msg.messageId, msg.feedback || null, "dislike")}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                            msg.feedback === "dislike"
                              ? "text-rose-500 bg-rose-500/10"
                              : "hover:text-text hover:bg-surface"
                          }`}
                          aria-label="Thumbs down"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </Tooltip>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-muted font-mono">
                      <span>
                        {msg.usage ? `${msg.usage.totalTokens} tokens` : "420 tokens"}
                      </span>
                      <span>·</span>
                      <span>1.2s</span>
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center text-xs font-bold text-text shrink-0 mt-0.5 shadow-2xs">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex gap-3 sm:gap-4 justify-start animate-message-enter">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shrink-0 shadow-2xs mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            <div className="max-w-[85%] sm:max-w-[80%] md:max-w-[75%] rounded-xl rounded-tl-xs p-3.5 sm:p-4.5 bg-card border border-border text-text shadow-xs space-y-3">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/50 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text">{activeModel.title}</span>
                  <Badge variant="primary" size="xs">
                    Generating...
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-primary font-mono">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" /> streaming tokens
                </div>
              </div>

              <div className="text-sm sm:text-[15px] leading-relaxed">
                {streamingContent ? (
                  <>
                    <MarkdownRenderer content={streamingContent} />
                    <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />
                  </>
                ) : (
                  <div className="flex items-center gap-2.5 py-3 text-muted text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary animate-typing-dot [animation-delay:0ms]" />
                      <span className="w-2 h-2 rounded-full bg-primary animate-typing-dot [animation-delay:200ms]" />
                      <span className="w-2 h-2 rounded-full bg-primary animate-typing-dot [animation-delay:400ms]" />
                    </div>
                    <span>EchoGPT is synthesizing response across models...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div ref={scrollBottomRef} className="h-4" />
      </div>
    </div>
  );
}
