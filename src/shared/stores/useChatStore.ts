import { create } from "zustand";
import { INITIAL_CONVERSATIONS, type MockConversation } from "@/shared/mock/conversations.mock";
import { FEATURED_MODELS } from "@/shared/mock/models.mock";
import type { ChatMessage } from "@/shared/types";
import {
  aiInferenceService,
  type QuickActionType,
  type ContextAttachment,
} from "@/shared/services/aiInferenceService";

interface ChatStore {
  conversations: MockConversation[];
  activeConversationId: string | null;
  searchQuery: string;
  activeModelSlug: string;
  inputPrompt: string;
  activeContext: ContextAttachment | null;
  activeQuickAction: QuickActionType | null;
  isGenerating: boolean;
  streamingContent: string;
  error: string | null;
  recentSearches: string[];

  selectConversation: (id: string) => void;
  startNewChat: () => void;
  setSearchQuery: (query: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  setActiveModel: (slug: string) => void;
  setInputPrompt: (prompt: string) => void;
  setActiveContext: (context: ContextAttachment | null) => void;
  setContextMode: (mode: "none" | "webpage" | "selection") => void;
  removeContext: () => void;
  setActiveQuickAction: (action: QuickActionType | null) => void;
  sendMessage: (customPrompt?: string, actionOverride?: QuickActionType) => Promise<void>;
  regenerateLastMessage: () => Promise<void>;
  setMessageFeedback: (messageId: string, feedback: "like" | "dislike" | null) => void;
  renameConversation: (id: string, newTitle: string) => void;
  clearConversationMessages: (id: string) => void;
  togglePinConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  clearError: () => void;
  triggerSimulatedError: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: INITIAL_CONVERSATIONS,
  activeConversationId: null,
  searchQuery: "",
  recentSearches: ["Next.js 15 migration", "DeepSeek reasoning", "Stripe webhooks", "Tailwind CSS v4"],
  activeModelSlug: "anthropic/claude-3.5-sonnet",
  inputPrompt: "",
  activeContext: null,
  activeQuickAction: null,
  isGenerating: false,
  streamingContent: "",
  error: null,

  setInputPrompt: (prompt: string) => set({ inputPrompt: prompt }),
  setActiveContext: (context) => set({ activeContext: context }),
  setContextMode: (mode: "none" | "webpage" | "selection") => {
    if (mode === "none") {
      set({ activeContext: null });
    } else if (mode === "webpage") {
      set({
        activeContext: {
          type: "webpage",
          title: "React Documentation",
          sourceUrl: "https://react.dev/learn",
          content:
            "React is a library for web and native user interfaces. Build user interfaces out of individual pieces called components written in JavaScript. Combine them into entire screens, pages, and apps.",
          tokenCount: 124,
        },
      });
    } else if (mode === "selection") {
      set({
        activeContext: {
          type: "selection",
          title: "Selected Text from React Docs",
          content:
            "React lets you combine your markup, CSS, and JavaScript into custom 'components', reusable UI elements for your app.",
          tokenCount: 32,
        },
      });
    }
  },
  removeContext: () => set({ activeContext: null }),
  setActiveQuickAction: (action) => set({ activeQuickAction: action }),

  addRecentSearch: (query: string) => {
    const q = query.trim();
    if (!q) return;
    set((state) => ({
      recentSearches: [q, ...state.recentSearches.filter((s) => s.toLowerCase() !== q.toLowerCase())].slice(0, 6),
    }));
  },

  clearRecentSearches: () => set({ recentSearches: [] }),

  selectConversation: (id: string) => {
    const target = get().conversations.find((c) => c.id === id);
    set({
      activeConversationId: id,
      activeModelSlug: target ? target.modelSlug : get().activeModelSlug,
      error: null,
      isGenerating: false,
      streamingContent: "",
    });
  },

  startNewChat: () => {
    set({
      activeConversationId: null,
      error: null,
      isGenerating: false,
      streamingContent: "",
    });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setActiveModel: (slug: string) => {
    set({ activeModelSlug: slug });
  },

  clearError: () => set({ error: null }),

  triggerSimulatedError: () => {
    set({
      error: "Gateway Timeout (504): The model endpoint failed to respond within 15 seconds. Please retry.",
      isGenerating: false,
    });
  },

  sendMessage: async (customPrompt?: string, actionOverride?: QuickActionType) => {
    const promptToSend = (customPrompt !== undefined ? customPrompt : get().inputPrompt).trim();
    if (!promptToSend || get().isGenerating) return;

    const {
      activeConversationId,
      conversations,
      activeModelSlug,
      activeContext,
      activeQuickAction,
    } = get();

    const quickAction = actionOverride !== undefined ? actionOverride : activeQuickAction;
    const model = FEATURED_MODELS.find((m) => m.slug === activeModelSlug) || FEATURED_MODELS[0];

    const userMessage: ChatMessage = {
      messageId: `msg-${Date.now()}-u`,
      chatId: activeConversationId || `conv-${Date.now()}`,
      role: "user",
      content: promptToSend,
      createdAt: "Just now",
    };

    let targetConvId = activeConversationId;

    if (!targetConvId) {
      targetConvId = `conv-${Date.now()}`;
      const newConv: MockConversation = {
        id: targetConvId,
        title: promptToSend.slice(0, 36) + (promptToSend.length > 36 ? "..." : ""),
        modelSlug: activeModelSlug,
        modelTitle: model.title,
        updatedAt: "Just now",
        dateGroup: "Today",
        messages: [userMessage],
      };
      set({
        conversations: [newConv, ...conversations],
        activeConversationId: targetConvId,
        isGenerating: true,
        streamingContent: "",
        inputPrompt: "",
        error: null,
      });
    } else {
      const updated = conversations.map((conv) => {
        if (conv.id === targetConvId) {
          return {
            ...conv,
            updatedAt: "Just now",
            dateGroup: "Today" as const,
            messages: [...conv.messages, userMessage],
          };
        }
        return conv;
      });
      set({
        conversations: updated,
        isGenerating: true,
        streamingContent: "",
        inputPrompt: "",
        error: null,
      });
    }

    try {
      const result = await aiInferenceService.streamInference(
        {
          prompt: promptToSend,
          modelSlug: activeModelSlug,
          conversationId: targetConvId,
          context: activeContext,
          quickAction,
        },
        (chunk) => {
          set({ streamingContent: chunk });
        }
      );

      const assistantMessage: ChatMessage = {
        messageId: `msg-${Date.now()}-a`,
        chatId: targetConvId,
        role: "assistant",
        modelSlug: activeModelSlug,
        reasoningContent: result.reasoningContent,
        content: result.content,
        createdAt: "Just now",
        usage: result.usage,
      };

      set((state) => ({
        isGenerating: false,
        streamingContent: "",
        conversations: state.conversations.map((c) =>
          c.id === targetConvId
            ? { ...c, messages: [...c.messages, assistantMessage] }
            : c
        ),
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Inference failed";
      set({
        isGenerating: false,
        error: message,
      });
    }
  },

  regenerateLastMessage: async () => {
    const { activeConversationId, conversations, activeModelSlug, activeContext, activeQuickAction } = get();
    if (!activeConversationId || get().isGenerating) return;

    const currentConv = conversations.find((c) => c.id === activeConversationId);
    if (!currentConv || currentConv.messages.length === 0) return;

    let lastUserPrompt = "";
    const filteredMessages = [...currentConv.messages];
    const lastMsg = filteredMessages[filteredMessages.length - 1];

    if (lastMsg.role === "assistant") {
      filteredMessages.pop();
    }

    for (let i = filteredMessages.length - 1; i >= 0; i--) {
      if (filteredMessages[i].role === "user") {
        lastUserPrompt = filteredMessages[i].content;
        break;
      }
    }

    if (!lastUserPrompt) return;

    set((state) => ({
      isGenerating: true,
      streamingContent: "",
      error: null,
      conversations: state.conversations.map((c) =>
        c.id === activeConversationId ? { ...c, messages: filteredMessages } : c
      ),
    }));

    try {
      const result = await aiInferenceService.streamInference(
        {
          prompt: lastUserPrompt,
          modelSlug: activeModelSlug,
          conversationId: activeConversationId,
          context: activeContext,
          quickAction: activeQuickAction,
        },
        (chunk) => {
          set({ streamingContent: chunk });
        }
      );

      const newAssistantMessage: ChatMessage = {
        messageId: `msg-${Date.now()}-regen`,
        chatId: activeConversationId,
        role: "assistant",
        modelSlug: activeModelSlug,
        reasoningContent: result.reasoningContent,
        content: result.content,
        createdAt: "Just now",
        usage: result.usage,
      };

      set((state) => ({
        isGenerating: false,
        streamingContent: "",
        conversations: state.conversations.map((c) =>
          c.id === activeConversationId
            ? { ...c, messages: [...c.messages, newAssistantMessage] }
            : c
        ),
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Regeneration failed";
      set({
        isGenerating: false,
        error: message,
      });
    }
  },

  setMessageFeedback: (messageId: string, feedback: "like" | "dislike" | null) => {
    set((state) => ({
      conversations: state.conversations.map((c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.messageId === messageId ? { ...m, feedback } : m
        ),
      })),
    }));
  },

  renameConversation: (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, title: newTitle.trim() } : c
      ),
    }));
  },

  clearConversationMessages: (id: string) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, messages: [] } : c
      ),
    }));
  },

  togglePinConversation: (id: string) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, isPinned: !c.isPinned } : c
      ),
    }));
  },

  deleteConversation: (id: string) => {
    set((state) => {
      const remaining = state.conversations.filter((c) => c.id !== id);
      return {
        conversations: remaining,
        activeConversationId:
          state.activeConversationId === id
            ? remaining.length > 0
              ? remaining[0].id
              : null
            : state.activeConversationId,
      };
    });
  },
}));
