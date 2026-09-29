"use client";

import React from "react";
import Link from "next/link";
import { Modal, ModalFooter, Button, Badge } from "@/shared/components/ui";
import { useTheme } from "@/shared/components/ThemeProvider";
import { useSettingsStore } from "@/shared/stores/useSettingsStore";
import { FEATURED_MODELS } from "@/shared/mock/models.mock";
import {
  Sun,
  Moon,
  Monitor,
  ExternalLink,
  Globe,
  Highlighter,
  Sliders,
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const settings = useSettingsStore();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Workspace Settings"
      description="Adjust essential appearance, default models, and context grounding preferences."
      size="md"
    >
      <div className="space-y-5 pt-2">

        <div className="space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-muted flex items-center justify-between">
            <span>Appearance & Theme</span>
            <Badge variant="muted" size="xs">
              Live Preview
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setTheme("dark");
                settings.updateAppearance({ theme: "dark" });
              }}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                theme === "dark"
                  ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                  : "border-border bg-card text-muted hover:text-text"
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span className="text-xs">Dark Void</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTheme("light");
                settings.updateAppearance({ theme: "light" });
              }}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                theme === "light"
                  ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                  : "border-border bg-card text-muted hover:text-text"
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="text-xs">Lilac Light</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTheme("system");
                settings.updateAppearance({ theme: "system" });
              }}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                theme === "system"
                  ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                  : "border-border bg-card text-muted hover:text-text"
              }`}
            >
              <Monitor className="w-4 h-4 text-muted" />
              <span className="text-xs">System</span>
            </button>
          </div>
        </div>

        <div className="space-y-1.5 pt-3 border-t border-border/50">
          <label className="text-xs font-bold text-text block">Default Startup AI Model</label>
          <select
            value={settings.defaultModelSlug}
            onChange={(e) => settings.updateAIModels({ defaultModelSlug: e.target.value })}
            className="w-full bg-surface border border-border text-xs text-text rounded-xl p-2.5 focus:outline-none"
          >
            {FEATURED_MODELS.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.title} ({m.provider.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 pt-3 border-t border-border/50">
          <div className="text-xs font-bold uppercase tracking-wider text-muted">
            Context Grounding
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-border">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium">Webpage Grounding Context</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.enableWebpageContext}
              onClick={() =>
                settings.updateContext({ enableWebpageContext: !settings.enableWebpageContext })
              }
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                settings.enableWebpageContext ? "bg-primary" : "bg-card border border-border"
              }`}
            >
              <span
                className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  settings.enableWebpageContext ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-border">
            <div className="flex items-center gap-2">
              <Highlighter className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-medium">Selected-Text Context</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.enableSelectedTextContext}
              onClick={() =>
                settings.updateContext({
                  enableSelectedTextContext: !settings.enableSelectedTextContext,
                })
              }
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                settings.enableSelectedTextContext ? "bg-primary" : "bg-card border border-border"
              }`}
            >
              <span
                className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  settings.enableSelectedTextContext ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <Sliders className="w-4 h-4 text-secondary" />
            <div>
              <div className="font-bold text-text">Advanced Settings Suite</div>
              <div className="text-[10px] text-muted">7 categories: BYOK API keys, shortcuts, alerts</div>
            </div>
          </div>
          <Link
            href="/app/settings"
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface hover:bg-border text-xs font-semibold text-text border border-border transition-colors shrink-0"
          >
            <span>Open Settings</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <ModalFooter>
        <Button variant="primary" size="sm" onClick={onClose} className="w-full">
          Done
        </Button>
      </ModalFooter>
    </Modal>
  );
}
