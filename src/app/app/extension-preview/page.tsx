"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Smartphone,
  Tablet,
  Laptop,
  Moon,
  Sun,
  ExternalLink,
} from "lucide-react";
import { AppNavigationTabs } from "@/components/navigation/AppNavigationTabs";

const VIEWPORT_SIZES = [
  { id: "compact", name: "320px", label: "Compact (320px)", width: 320, icon: Smartphone },
  { id: "default", name: "380px", label: "Standard (380px)", width: 380, icon: Tablet },
  { id: "wide", name: "460px", label: "Expanded (460px)", width: 460, icon: Laptop },
];

export default function ExtensionPreviewPage() {
  const [selectedWidth, setSelectedWidth] = useState(380);
  const [activeTheme, setActiveTheme] = useState<"dark" | "light">("dark");

  return (
    <div className="min-h-screen bg-background text-text flex flex-col font-sans">
      <header className="h-14 border-b border-border bg-surface px-4 lg:px-8 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            aria-label="Back to chat"
            className="flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors p-1.5 rounded-lg hover:bg-card shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <h1 className="font-semibold text-sm">Extension Preview</h1>
        </div>

        <div className="hidden lg:flex items-center">
          <AppNavigationTabs activePage="extension" />
        </div>

        <div className="flex items-center gap-2">
          <div
            role="radiogroup"
            aria-label="Simulated side panel width"
            className="flex items-center bg-card p-0.5 rounded-lg border border-border"
          >
            {VIEWPORT_SIZES.map((size) => {
              const Icon = size.icon;
              const isSelected = selectedWidth === size.width;
              return (
                <button
                  key={size.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={size.label}
                  onClick={() => setSelectedWidth(size.width)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isSelected
                      ? "bg-primary text-white shadow-xs"
                      : "text-muted hover:text-text"
                  }`}
                  title={size.label}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">{size.name}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-label={`Switch theme to ${activeTheme === "dark" ? "light" : "dark"}`}
            onClick={() => setActiveTheme(activeTheme === "dark" ? "light" : "dark")}
            className="p-1.5 text-xs rounded-lg border border-border bg-card text-muted hover:text-text transition-colors cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title={`Switch to ${activeTheme === "dark" ? "light" : "dark"} mode`}
          >
            {activeTheme === "dark" ? (
              <Sun className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          <a
            href="/extension/sidepanel.html"
            target="_blank"
            rel="noreferrer"
            aria-label="Open extension in new tab"
            className="flex items-center gap-1.5 text-xs text-muted hover:text-text px-2.5 py-1.5 rounded-lg border border-border bg-card hover:bg-surface transition-colors shrink-0"
            title="Open standalone side panel"
          >
            <span className="hidden sm:inline">Open</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-8 flex flex-col items-center justify-center overflow-y-auto">
        <div
          style={{ width: `${selectedWidth}px`, height: "660px", maxHeight: "calc(100vh - 120px)" }}
          className="relative max-w-full rounded-2xl shadow-xl border border-border bg-surface overflow-hidden flex flex-col transition-all duration-200"
        >
          <div className="h-8 bg-surface border-b border-border px-3 flex items-center justify-between text-[11px] text-muted select-none shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-border" />
              <span className="w-2 h-2 rounded-full bg-border" />
              <span className="w-2 h-2 rounded-full bg-border" />
              <span className="ml-2 font-mono text-[10px] text-muted">EchoGPT Side Panel</span>
            </div>
            <span className="text-[10px] text-muted font-mono">
              {selectedWidth}px
            </span>
          </div>

          <div className="flex-1 w-full h-full overflow-hidden">
            <iframe
              src={`/extension/sidepanel.html?theme=${activeTheme}`}
              title="EchoGPT Chrome Side Panel"
              className="w-full h-full border-0"
            />
          </div>
        </div>

        <p className="mt-4 text-xs text-muted text-center font-mono">
          Shortcut: Alt + E &middot; Manifest V3 Side Panel
        </p>
      </main>
    </div>
  );
}
