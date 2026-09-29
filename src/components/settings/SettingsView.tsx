"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSettingsStore } from "@/shared/stores/useSettingsStore";
import { useTheme } from "@/shared/components/ThemeProvider";
import { FEATURED_MODELS } from "@/shared/mock/models.mock";
import { Badge, Button, Input } from "@/shared/components/ui";
import { AppNavigationTabs } from "@/components/navigation/AppNavigationTabs";
import {
  ArrowLeft,
  Sun,
  Moon,
  Monitor,
  Cpu,
  Layers,
  Keyboard,
  Bell,
  User,
  Check,
  RotateCcw,
  Globe,
  Highlighter,
  Sliders,
  ShieldCheck,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";

type SettingsSection =
  | "general"
  | "appearance"
  | "aiModels"
  | "context"
  | "keyboard"
  | "notifications"
  | "account";

export function SettingsView() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("general");
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});

  const { theme, setTheme } = useTheme();

  const settings = useSettingsStore();

  const handleSaveNotification = () => {
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2000);
  };

  const toggleShowKey = (provider: string) => {
    setShowApiKey((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  const navItems: Array<{ id: SettingsSection; label: string; icon: React.ReactNode }> = [
    { id: "general", label: "General", icon: <Sliders className="w-4 h-4" /> },
    { id: "appearance", label: "Appearance", icon: <Sun className="w-4 h-4" /> },
    { id: "aiModels", label: "AI Models", icon: <Cpu className="w-4 h-4" /> },
    { id: "context", label: "Context", icon: <Layers className="w-4 h-4" /> },
    { id: "keyboard", label: "Keyboard Shortcuts", icon: <Keyboard className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "account", label: "Account", icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background text-text flex flex-col animate-page-enter">

      <header className="h-16 px-4 sm:px-8 border-b border-border/80 bg-surface/85 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="p-2 rounded-xl text-muted hover:text-text hover:bg-card border border-border/60 transition-colors cursor-pointer"
            title="Back to Workspace"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-text">Workspace Settings</h1>
              <Badge variant="primary" size="xs">
                Local Persistence
              </Badge>
            </div>
            <p className="text-[11px] text-muted hidden sm:block">
              Configure models, context grounding, shortcuts, and themes.
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center">
          <AppNavigationTabs activePage="settings" />
        </div>

        <div className="flex items-center gap-3">
          {showSavedFeedback && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold animate-in fade-in-0"
            >
              <Check className="w-4 h-4" aria-hidden="true" />
              <span>Saved to localStorage</span>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              settings.resetAllToDefaults();
              handleSaveNotification();
            }}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Reset All
          </Button>
        </div>
      </header>

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col md:flex-row gap-6 lg:gap-10">

        <nav
          aria-label="Settings Navigation"
          className="w-full md:w-60 shrink-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? "true" : undefined}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive
                    ? "bg-primary text-white shadow-xs font-bold"
                    : "text-muted hover:text-text hover:bg-card"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <main className="flex-1 bg-card/60 border border-border/80 rounded-2xl p-5 sm:p-8 space-y-8 shadow-xs min-h-[500px]">

          {activeSection === "general" && (
            <div className="space-y-6 animate-in fade-in-0 duration-200">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h2 className="text-base font-bold text-text">General Preferences</h2>
                  <p className="text-xs text-muted">Manage language, currency, and generation dynamics.</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    settings.resetSectionToDefaults("general");
                    handleSaveNotification();
                  }}
                  className="text-xs text-muted hover:text-text"
                >
                  Reset Section
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label htmlFor="workspace-language" className="text-xs font-bold text-text block">Workspace Language</label>
                  <p className="text-[11px] text-muted">Primary interface language.</p>
                </div>
                <select
                  id="workspace-language"
                  value={settings.language}
                  onChange={(e) => {
                    settings.updateGeneral({ language: e.target.value as "en" | "es" | "de" | "fr" | "bn" });
                    handleSaveNotification();
                  }}
                  className="bg-surface border border-border text-xs text-text rounded-xl p-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="en">English (US)</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                  <option value="fr">Français</option>
                  <option value="bn">বাংলা (Bengali)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-3 border-t border-border/40">
                <div>
                  <span id="billing-currency-label" className="text-xs font-bold text-text block">Billing Currency</span>
                  <p className="text-[11px] text-muted">Display currency for EchoGPT Pro subscriptions.</p>
                </div>
                <div role="radiogroup" aria-labelledby="billing-currency-label" className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={settings.currency === "usd"}
                    onClick={() => {
                      settings.updateGeneral({ currency: "usd" });
                      handleSaveNotification();
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      settings.currency === "usd"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-surface text-muted"
                    }`}
                  >
                    <span>USD ($)</span>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={settings.currency === "bdt"}
                    onClick={() => {
                      settings.updateGeneral({ currency: "bdt" });
                      handleSaveNotification();
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      settings.currency === "bdt"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-surface text-muted"
                    }`}
                  >
                    <span>BDT (৳)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-3 border-t border-border/40">
                <div>
                  <label htmlFor="stream-speed" className="text-xs font-bold text-text block">Simulated Stream Speed</label>
                  <p className="text-[11px] text-muted">Controls token generator timing.</p>
                </div>
                <select
                  id="stream-speed"
                  value={settings.streamSpeed}
                  onChange={(e) => {
                    settings.updateGeneral({ streamSpeed: e.target.value as "fast" | "standard" | "realistic" });
                    handleSaveNotification();
                  }}
                  className="bg-surface border border-border text-xs text-text rounded-xl p-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="fast">Ultra Fast (Low Latency)</option>
                  <option value="realistic">Realistic (Human-paced streaming)</option>
                  <option value="standard">Standard</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div>
                  <label id="auto-title-label" className="text-xs font-bold text-text block">Auto-Title Conversations</label>
                  <p className="text-[11px] text-muted">Summarize first user message into chat title automatically.</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-labelledby="auto-title-label"
                  aria-checked={settings.autoTitleConversations}
                  onClick={() => {
                    settings.updateGeneral({ autoTitleConversations: !settings.autoTitleConversations });
                    handleSaveNotification();
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    settings.autoTitleConversations ? "bg-primary" : "bg-surface border border-border"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.autoTitleConversations ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {activeSection === "appearance" && (
            <div className="space-y-6 animate-in fade-in-0 duration-200">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h2 className="text-base font-bold text-text">Appearance & Theme</h2>
                  <p className="text-xs text-muted">Customize the visual theme and typography.</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    settings.resetSectionToDefaults("appearance");
                    setTheme("dark");
                    handleSaveNotification();
                  }}
                  className="text-xs text-muted hover:text-text"
                >
                  Reset Section
                </Button>
              </div>

              <div className="space-y-3">
                <span id="theme-picker-label" className="text-xs font-bold text-text block">Color Theme</span>
                <div role="radiogroup" aria-labelledby="theme-picker-label" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={theme === "light"}
                    onClick={() => {
                      setTheme("light");
                      settings.updateAppearance({ theme: "light" });
                      handleSaveNotification();
                    }}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      theme === "light"
                        ? "border-primary bg-primary/10 shadow-xs font-bold"
                        : "border-border bg-surface text-muted hover:text-text"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Sun className="w-5 h-5 text-amber-500" />
                      {theme === "light" && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-text">Lilac Light</div>
                      <div className="text-[10px] text-muted">Clean studio light canvas</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    role="radio"
                    aria-checked={theme === "dark"}
                    onClick={() => {
                      setTheme("dark");
                      settings.updateAppearance({ theme: "dark" });
                      handleSaveNotification();
                    }}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      theme === "dark"
                        ? "border-primary bg-primary/10 shadow-xs font-bold"
                        : "border-border bg-surface text-muted hover:text-text"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Moon className="w-5 h-5 text-indigo-400" />
                      {theme === "dark" && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-text">Obsidian Dark</div>
                      <div className="text-[10px] text-muted">OLED deep void palette</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    role="radio"
                    aria-checked={theme === "system"}
                    onClick={() => {
                      setTheme("system");
                      settings.updateAppearance({ theme: "system" });
                      handleSaveNotification();
                    }}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      theme === "system"
                        ? "border-primary bg-primary/10 shadow-xs font-bold"
                        : "border-border bg-surface text-muted hover:text-text"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Monitor className="w-5 h-5 text-muted" />
                      {theme === "system" && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-text">System Default</div>
                      <div className="text-[10px] text-muted">Sync with operating system</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-3 border-t border-border/40">
                <div>
                  <label htmlFor="workspace-font-size" className="text-xs font-bold text-text block">Workspace Text Size</label>
                  <p className="text-[11px] text-muted">Adjust message body readability.</p>
                </div>
                <select
                  id="workspace-font-size"
                  value={settings.fontSize}
                  onChange={(e) => {
                    settings.updateAppearance({ fontSize: e.target.value as "sm" | "md" | "lg" });
                    handleSaveNotification();
                  }}
                  className="bg-surface border border-border text-xs text-text rounded-xl p-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="sm">Compact (13px)</option>
                  <option value="md">Default (14px)</option>
                  <option value="lg">Comfortable (16px)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-3 border-t border-border/40">
                <div>
                  <label htmlFor="code-block-font" className="text-xs font-bold text-text block">Code Block Font</label>
                  <p className="text-[11px] text-muted">Font used for syntax highlighted fences.</p>
                </div>
                <select
                  id="code-block-font"
                  value={settings.codeFont}
                  onChange={(e) => {
                    settings.updateAppearance({ codeFont: e.target.value as "JetBrains Mono" | "Fira Code" | "Geist Mono" });
                    handleSaveNotification();
                  }}
                  className="bg-surface border border-border text-xs text-text rounded-xl p-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary font-mono"
                >
                  <option value="JetBrains Mono">JetBrains Mono</option>
                  <option value="Fira Code">Fira Code</option>
                  <option value="Geist Mono">Geist Mono</option>
                </select>
              </div>
            </div>
          )}

          {activeSection === "aiModels" && (
            <div className="space-y-6 animate-in fade-in-0 duration-200">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h2 className="text-base font-bold text-text">AI Models Configuration</h2>
                  <p className="text-xs text-muted">Control default models, active list, and multi-model arena.</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    settings.resetSectionToDefaults("aiModels");
                    handleSaveNotification();
                  }}
                  className="text-xs text-muted hover:text-text"
                >
                  Reset Section
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label htmlFor="default-model-slug" className="text-xs font-bold text-text block">Default Startup Model</label>
                  <p className="text-[11px] text-muted">Model selected when opening a new chat.</p>
                </div>
                <select
                  id="default-model-slug"
                  value={settings.defaultModelSlug}
                  onChange={(e) => {
                    settings.updateAIModels({ defaultModelSlug: e.target.value });
                    handleSaveNotification();
                  }}
                  className="bg-surface border border-border text-xs font-bold text-text rounded-xl p-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {FEATURED_MODELS.map((m) => (
                    <option key={m.slug} value={m.slug}>
                      {m.title} ({m.provider.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-3 border-t border-border/40">
                <div>
                  <span id="arena-layout-label" className="text-xs font-bold text-text block">Arena Comparison Layout</span>
                  <p className="text-[11px] text-muted">Default number of models run in parallel.</p>
                </div>
                <div role="radiogroup" aria-labelledby="arena-layout-label" className="grid grid-cols-3 gap-2">
                  {(["2-way", "3-way", "4-way"] as const).map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      role="radio"
                      aria-checked={settings.comparisonPreference === pref}
                      onClick={() => {
                        settings.updateAIModels({ comparisonPreference: pref });
                        handleSaveNotification();
                      }}
                      className={`p-2 rounded-xl border text-xs font-semibold cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        settings.comparisonPreference === pref
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : "border-border bg-surface text-muted"
                      }`}
                    >
                      {pref.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-border/40">
                <div>
                  <span id="quick-palette-label" className="text-xs font-bold text-text block">Quick Model Palette</span>
                  <p className="text-[11px] text-muted">
                    Toggle which frontier models appear in the quick selector dropdowns.
                  </p>
                </div>

                <div role="group" aria-labelledby="quick-palette-label" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FEATURED_MODELS.slice(0, 8).map((m) => {
                    const isEnabled = settings.enabledModelSlugs.includes(m.slug);
                    return (
                      <button
                        key={m.slug}
                        type="button"
                        role="checkbox"
                        aria-checked={isEnabled}
                        aria-label={`Include ${m.title} in quick model palette`}
                        onClick={() => {
                          settings.toggleEnabledModel(m.slug);
                          handleSaveNotification();
                        }}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                          isEnabled
                            ? "border-primary/40 bg-surface text-text"
                            : "border-border/60 bg-surface/40 text-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              isEnabled ? "bg-emerald-500" : "bg-muted/40"
                            }`}
                          />
                          <span className="text-xs font-bold truncate">{m.title}</span>
                        </div>
                        <Badge variant={isEnabled ? "primary" : "muted"} size="xs">
                          {m.provider.toUpperCase()}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div>
                  <label id="auto-reasoning-label" className="text-xs font-bold text-text block">Auto-Expand Reasoning</label>
                  <p className="text-[11px] text-muted">
                    Show DeepSeek R1 & reasoning traces open by default.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-labelledby="auto-reasoning-label"
                  aria-checked={settings.autoReasoningTrace}
                  onClick={() => {
                    settings.updateAIModels({ autoReasoningTrace: !settings.autoReasoningTrace });
                    handleSaveNotification();
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    settings.autoReasoningTrace ? "bg-primary" : "bg-surface border border-border"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.autoReasoningTrace ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {activeSection === "context" && (
            <div className="space-y-6 animate-in fade-in-0 duration-200">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h2 className="text-base font-bold text-text">Context Grounding</h2>
                  <p className="text-xs text-muted">
                    Manage webpage extraction, selected-text capture, and token limits.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    settings.resetSectionToDefaults("context");
                    handleSaveNotification();
                  }}
                  className="text-xs text-muted hover:text-text"
                >
                  Reset Section
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span id="webpage-context-label" className="text-xs font-bold text-text">Enable Webpage Context</span>
                  </div>
                  <p className="text-[11px] text-muted">
                    Extract active browser DOM and metadata to ground responses in page content.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-labelledby="webpage-context-label"
                  aria-checked={settings.enableWebpageContext}
                  onClick={() => {
                    settings.updateContext({ enableWebpageContext: !settings.enableWebpageContext });
                    handleSaveNotification();
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    settings.enableWebpageContext ? "bg-primary" : "bg-surface border border-border"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.enableWebpageContext ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Highlighter className="w-4 h-4 text-amber-400" />
                    <span id="selected-text-label" className="text-xs font-bold text-text">Enable Selected-Text Context</span>
                  </div>
                  <p className="text-[11px] text-muted">
                    Allow the Chrome side-panel to instantly attach highlighted text snippets.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-labelledby="selected-text-label"
                  aria-checked={settings.enableSelectedTextContext}
                  onClick={() => {
                    settings.updateContext({
                      enableSelectedTextContext: !settings.enableSelectedTextContext,
                    });
                    handleSaveNotification();
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    settings.enableSelectedTextContext ? "bg-primary" : "bg-surface border border-border"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.enableSelectedTextContext ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span id="context-confirm-label" className="text-xs font-bold text-text">Context Confirmation</span>
                  </div>
                  <p className="text-[11px] text-muted">
                    Display an explicit confirmation preview before submitting large payloads (&gt;2k tokens).
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-labelledby="context-confirm-label"
                  aria-checked={settings.contextConfirmation}
                  onClick={() => {
                    settings.updateContext({ contextConfirmation: !settings.contextConfirmation });
                    handleSaveNotification();
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    settings.contextConfirmation ? "bg-primary" : "bg-surface border border-border"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.contextConfirmation ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-3 border-t border-border/40">
                <div>
                  <label htmlFor="max-context-tokens" className="text-xs font-bold text-text block">Max Context Budget</label>
                  <p className="text-[11px] text-muted">Hard cap on attached document & DOM tokens.</p>
                </div>
                <select
                  id="max-context-tokens"
                  value={settings.maxContextTokens}
                  onChange={(e) => {
                    settings.updateContext({ maxContextTokens: Number(e.target.value) });
                    handleSaveNotification();
                  }}
                  className="bg-surface border border-border text-xs text-text rounded-xl p-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value={4000}>4,000 tokens (~3,000 words)</option>
                  <option value={8000}>8,000 tokens (~6,000 words)</option>
                  <option value={16000}>16,000 tokens (~12,000 words)</option>
                  <option value={32000}>32,000 tokens (Frontier)</option>
                </select>
              </div>
            </div>
          )}

          {activeSection === "keyboard" && (
            <div className="space-y-6 animate-in fade-in-0 duration-200">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h2 className="text-base font-bold text-text">Keyboard Shortcuts</h2>
                  <p className="text-xs text-muted">Quick hotkeys for seamless multi-model productivity.</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    settings.resetSectionToDefaults("keyboard");
                    handleSaveNotification();
                  }}
                  className="text-xs text-muted hover:text-text"
                >
                  Reset Shortcuts
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface border border-border">
                  <div>
                    <div className="text-xs font-bold text-text">Open Command Palette</div>
                    <div className="text-[11px] text-muted">Access all commands, modes, and actions</div>
                  </div>
                  <kbd className="px-2 py-1 rounded bg-card border border-border text-xs font-mono text-primary font-bold">
                    {settings.commandPalette}
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface border border-border">
                  <div>
                    <div className="text-xs font-bold text-text">New Conversation</div>
                    <div className="text-[11px] text-muted">Clear active chat and start fresh turn</div>
                  </div>
                  <kbd className="px-2 py-1 rounded bg-card border border-border text-xs font-mono text-text">
                    {settings.newChat}
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface border border-border">
                  <div>
                    <div className="text-xs font-bold text-text">Open EchoGPT Side Panel</div>
                    <div className="text-[11px] text-muted">Toggle native Chrome side panel</div>
                  </div>
                  <kbd className="px-2 py-1 rounded bg-card border border-border text-xs font-mono text-text">
                    {settings.openEchoGPT}
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface border border-border">
                  <div>
                    <div className="text-xs font-bold text-text">Toggle Theme</div>
                    <div className="text-[11px] text-muted">Switch between Obsidian Dark and Lilac Light</div>
                  </div>
                  <kbd className="px-2 py-1 rounded bg-card border border-border text-xs font-mono text-text">
                    {settings.toggleTheme}
                  </kbd>
                </div>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="space-y-6 animate-in fade-in-0 duration-200">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h2 className="text-base font-bold text-text">Notification Alerts</h2>
                  <p className="text-xs text-muted">Stay notified about background jobs and quota limits.</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    settings.resetSectionToDefaults("notifications");
                    handleSaveNotification();
                  }}
                  className="text-xs text-muted hover:text-text"
                >
                  Reset Section
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span id="desktop-notif-label" className="text-xs font-bold text-text block">Desktop Notifications</span>
                  <p className="text-[11px] text-muted">
                    Notify when long-running reasoning tasks complete while tab is in background.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-labelledby="desktop-notif-label"
                  aria-checked={settings.desktopNotifications}
                  onClick={() => {
                    settings.updateNotifications({
                      desktopNotifications: !settings.desktopNotifications,
                    });
                    handleSaveNotification();
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    settings.desktopNotifications ? "bg-primary" : "bg-surface border border-border"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.desktopNotifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div>
                  <span id="sound-effects-label" className="text-xs font-bold text-text block">Completion Sound Chime</span>
                  <p className="text-[11px] text-muted">Play a gentle auditory chime upon assistant response finish.</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-labelledby="sound-effects-label"
                  aria-checked={settings.soundEffects}
                  onClick={() => {
                    settings.updateNotifications({ soundEffects: !settings.soundEffects });
                    handleSaveNotification();
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    settings.soundEffects ? "bg-primary" : "bg-surface border border-border"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.soundEffects ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div>
                  <span id="quota-alerts-label" className="text-xs font-bold text-text block">Quota Warning Alerts</span>
                  <p className="text-[11px] text-muted">
                    Show notification banner when remaining daily messages drop below 10.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-labelledby="quota-alerts-label"
                  aria-checked={settings.quotaAlerts}
                  onClick={() => {
                    settings.updateNotifications({ quotaAlerts: !settings.quotaAlerts });
                    handleSaveNotification();
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    settings.quotaAlerts ? "bg-primary" : "bg-surface border border-border"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.quotaAlerts ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {activeSection === "account" && (
            <div className="space-y-6 animate-in fade-in-0 duration-200">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h2 className="text-base font-bold text-text">Account & Connectors</h2>
                  <p className="text-xs text-muted">Manage profile details and custom BYOK API keys.</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    settings.resetSectionToDefaults("account");
                    handleSaveNotification();
                  }}
                  className="text-xs text-muted hover:text-text"
                >
                  Reset Section
                </Button>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-base shadow-md shadow-primary/20">
                    AM
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text">{settings.name}</div>
                    <div className="text-xs text-muted">{settings.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="md">
                    {settings.plan}
                  </Badge>
                  <Link
                    href="/app/pricing"
                    className="text-xs text-primary hover:underline font-semibold px-2 py-0.5 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    Manage Plans
                  </Link>
                  <span className="text-xs text-emerald-400 font-semibold font-mono">
                    {settings.messagesRemaining} msgs left
                  </span>
                </div>
              </div>

              <div className="space-y-4 pt-3 border-t border-border/40">
                <div>
                  <div className="text-xs font-bold text-text flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                    <span>Custom API Keys (BYOK)</span>
                  </div>
                  <p className="text-[11px] text-muted">
                    Provide your own provider keys for unlimited inference without touching your EchoGPT quota.
                  </p>
                </div>

                <div className="space-y-3">

                  <div className="space-y-1">
                    <label htmlFor="openai-api-key" className="text-[11px] font-bold text-muted uppercase block">OpenAI Key</label>
                    <div className="flex gap-2">
                      <Input
                        id="openai-api-key"
                        type={showApiKey["openai"] ? "text" : "password"}
                        value={settings.openaiApiKey}
                        onChange={(e) => {
                          settings.updateAccount({ openaiApiKey: e.target.value });
                          handleSaveNotification();
                        }}
                        className="text-xs font-mono bg-surface h-9"
                        placeholder="sk-..."
                      />
                      <button
                        type="button"
                        aria-label={showApiKey["openai"] ? "Hide OpenAI API Key" : "Show OpenAI API Key"}
                        onClick={() => toggleShowKey("openai")}
                        className="px-3 rounded-xl border border-border bg-surface text-muted hover:text-text cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {showApiKey["openai"] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="anthropic-api-key" className="text-[11px] font-bold text-muted uppercase block">Anthropic Key</label>
                    <div className="flex gap-2">
                      <Input
                        id="anthropic-api-key"
                        type={showApiKey["anthropic"] ? "text" : "password"}
                        value={settings.anthropicApiKey}
                        onChange={(e) => {
                          settings.updateAccount({ anthropicApiKey: e.target.value });
                          handleSaveNotification();
                        }}
                        className="text-xs font-mono bg-surface h-9"
                        placeholder="sk-ant-..."
                      />
                      <button
                        type="button"
                        aria-label={showApiKey["anthropic"] ? "Hide Anthropic API Key" : "Show Anthropic API Key"}
                        onClick={() => toggleShowKey("anthropic")}
                        className="px-3 rounded-xl border border-border bg-surface text-muted hover:text-text cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {showApiKey["anthropic"] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="deepseek-api-key" className="text-[11px] font-bold text-muted uppercase block">DeepSeek Key</label>
                    <div className="flex gap-2">
                      <Input
                        id="deepseek-api-key"
                        type={showApiKey["deepseek"] ? "text" : "password"}
                        value={settings.deepseekApiKey}
                        onChange={(e) => {
                          settings.updateAccount({ deepseekApiKey: e.target.value });
                          handleSaveNotification();
                        }}
                        className="text-xs font-mono bg-surface h-9"
                        placeholder="sk-..."
                      />
                      <button
                        type="button"
                        aria-label={showApiKey["deepseek"] ? "Hide DeepSeek API Key" : "Show DeepSeek API Key"}
                        onClick={() => toggleShowKey("deepseek")}
                        className="px-3 rounded-xl border border-border bg-surface text-muted hover:text-text cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {showApiKey["deepseek"] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
