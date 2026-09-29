import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface SettingsState {

  language: "en" | "es" | "de" | "fr" | "bn";
  currency: "usd" | "bdt";
  streamSpeed: "fast" | "standard" | "realistic";
  autoTitleConversations: boolean;

  theme: "dark" | "light" | "system";
  fontSize: "sm" | "md" | "lg";
  codeFont: "JetBrains Mono" | "Fira Code" | "Geist Mono";

  defaultModelSlug: string;
  enabledModelSlugs: string[];
  comparisonPreference: "2-way" | "3-way" | "4-way";
  autoReasoningTrace: boolean;

  enableWebpageContext: boolean;
  enableSelectedTextContext: boolean;
  contextConfirmation: boolean;
  maxContextTokens: number;

  openEchoGPT: string;
  newChat: string;
  commandPalette: string;
  toggleTheme: string;

  desktopNotifications: boolean;
  soundEffects: boolean;
  quotaAlerts: boolean;

  name: string;
  email: string;
  plan: string;
  messagesRemaining: number;
  openaiApiKey: string;
  anthropicApiKey: string;
  deepseekApiKey: string;

  updateGeneral: (partial: Partial<Pick<SettingsState, "language" | "currency" | "streamSpeed" | "autoTitleConversations">>) => void;
  updateAppearance: (partial: Partial<Pick<SettingsState, "theme" | "fontSize" | "codeFont">>) => void;
  updateAIModels: (partial: Partial<Pick<SettingsState, "defaultModelSlug" | "enabledModelSlugs" | "comparisonPreference" | "autoReasoningTrace">>) => void;
  toggleEnabledModel: (slug: string) => void;
  updateContext: (partial: Partial<Pick<SettingsState, "enableWebpageContext" | "enableSelectedTextContext" | "contextConfirmation" | "maxContextTokens">>) => void;
  updateKeyboardShortcuts: (partial: Partial<Pick<SettingsState, "openEchoGPT" | "newChat" | "commandPalette" | "toggleTheme">>) => void;
  updateNotifications: (partial: Partial<Pick<SettingsState, "desktopNotifications" | "soundEffects" | "quotaAlerts">>) => void;
  updateAccount: (partial: Partial<Pick<SettingsState, "name" | "email" | "plan" | "messagesRemaining" | "openaiApiKey" | "anthropicApiKey" | "deepseekApiKey">>) => void;
  resetSectionToDefaults: (section: "general" | "appearance" | "aiModels" | "context" | "keyboard" | "notifications" | "account") => void;
  resetAllToDefaults: () => void;
}

const DEFAULT_SETTINGS = {
  language: "en" as const,
  currency: "usd" as const,
  streamSpeed: "realistic" as const,
  autoTitleConversations: true,

  theme: "dark" as const,
  fontSize: "md" as const,
  codeFont: "JetBrains Mono" as const,

  defaultModelSlug: "anthropic/claude-3.5-sonnet",
  enabledModelSlugs: [
    "anthropic/claude-3.5-sonnet",
    "deepseek/deepseek-r1",
    "openai/gpt-4o",
    "google/gemini-1.5-pro",
    "meta/llama-3.3-70b-instruct",
  ],
  comparisonPreference: "3-way" as const,
  autoReasoningTrace: true,

  enableWebpageContext: true,
  enableSelectedTextContext: true,
  contextConfirmation: false,
  maxContextTokens: 8000,

  openEchoGPT: "Alt + E",
  newChat: "Cmd/Ctrl + N",
  commandPalette: "Cmd/Ctrl + K",
  toggleTheme: "Cmd/Ctrl + T",

  desktopNotifications: true,
  soundEffects: false,
  quotaAlerts: true,

  name: "Alex Mercer",
  email: "alex@echogpt.live",
  plan: "Pro Plan",
  messagesRemaining: 42,
  openaiApiKey: "sk-proj-••••••••••••••••",
  anthropicApiKey: "sk-ant-••••••••••••••••",
  deepseekApiKey: "sk-dsk-••••••••••••••••",
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      updateGeneral: (partial) => set((state) => ({ ...state, ...partial })),
      updateAppearance: (partial) => set((state) => ({ ...state, ...partial })),
      updateAIModels: (partial) => set((state) => ({ ...state, ...partial })),

      toggleEnabledModel: (slug) =>
        set((state) => {
          const exists = state.enabledModelSlugs.includes(slug);
          if (exists) {

            if (state.enabledModelSlugs.length <= 2) return state;
            return {
              enabledModelSlugs: state.enabledModelSlugs.filter((s) => s !== slug),
            };
          }
          return { enabledModelSlugs: [...state.enabledModelSlugs, slug] };
        }),

      updateContext: (partial) => set((state) => ({ ...state, ...partial })),
      updateKeyboardShortcuts: (partial) => set((state) => ({ ...state, ...partial })),
      updateNotifications: (partial) => set((state) => ({ ...state, ...partial })),
      updateAccount: (partial) => set((state) => ({ ...state, ...partial })),

      resetSectionToDefaults: (section) => {
        set((state) => {
          switch (section) {
            case "general":
              return {
                ...state,
                language: DEFAULT_SETTINGS.language,
                currency: DEFAULT_SETTINGS.currency,
                streamSpeed: DEFAULT_SETTINGS.streamSpeed,
                autoTitleConversations: DEFAULT_SETTINGS.autoTitleConversations,
              };
            case "appearance":
              return {
                ...state,
                theme: DEFAULT_SETTINGS.theme,
                fontSize: DEFAULT_SETTINGS.fontSize,
                codeFont: DEFAULT_SETTINGS.codeFont,
              };
            case "aiModels":
              return {
                ...state,
                defaultModelSlug: DEFAULT_SETTINGS.defaultModelSlug,
                enabledModelSlugs: DEFAULT_SETTINGS.enabledModelSlugs,
                comparisonPreference: DEFAULT_SETTINGS.comparisonPreference,
                autoReasoningTrace: DEFAULT_SETTINGS.autoReasoningTrace,
              };
            case "context":
              return {
                ...state,
                enableWebpageContext: DEFAULT_SETTINGS.enableWebpageContext,
                enableSelectedTextContext: DEFAULT_SETTINGS.enableSelectedTextContext,
                contextConfirmation: DEFAULT_SETTINGS.contextConfirmation,
                maxContextTokens: DEFAULT_SETTINGS.maxContextTokens,
              };
            case "keyboard":
              return {
                ...state,
                openEchoGPT: DEFAULT_SETTINGS.openEchoGPT,
                newChat: DEFAULT_SETTINGS.newChat,
                commandPalette: DEFAULT_SETTINGS.commandPalette,
                toggleTheme: DEFAULT_SETTINGS.toggleTheme,
              };
            case "notifications":
              return {
                ...state,
                desktopNotifications: DEFAULT_SETTINGS.desktopNotifications,
                soundEffects: DEFAULT_SETTINGS.soundEffects,
                quotaAlerts: DEFAULT_SETTINGS.quotaAlerts,
              };
            case "account":
              return {
                ...state,
                name: DEFAULT_SETTINGS.name,
                email: DEFAULT_SETTINGS.email,
                openaiApiKey: DEFAULT_SETTINGS.openaiApiKey,
                anthropicApiKey: DEFAULT_SETTINGS.anthropicApiKey,
                deepseekApiKey: DEFAULT_SETTINGS.deepseekApiKey,
              };
            default:
              return state;
          }
        });
      },

      resetAllToDefaults: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: "echogpt_settings_v2",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
