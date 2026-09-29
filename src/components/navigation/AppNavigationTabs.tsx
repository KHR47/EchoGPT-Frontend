"use client";

import React from "react";
import Link from "next/link";
import {
  MessageSquare,
  Swords,
  Laptop,
  SlidersHorizontal,
  Sparkles,
  CreditCard,
} from "lucide-react";

export type AppPageKey = "chat" | "compare" | "extension" | "pricing" | "settings" | "landing";

interface AppNavigationTabsProps {
  activePage: AppPageKey;
  className?: string;
}

export function AppNavigationTabs({ activePage, className = "" }: AppNavigationTabsProps) {
  const tabs = [
    {
      key: "chat" as const,
      label: "Chat",
      href: "/app",
      icon: MessageSquare,
    },
    {
      key: "compare" as const,
      label: "Arena",
      href: "/app/compare",
      icon: Swords,
      badge: "3-Way",
    },
    {
      key: "extension" as const,
      label: "Extension",
      href: "/app/extension-preview",
      icon: Laptop,
      badge: "MV3",
    },
    {
      key: "pricing" as const,
      label: "Pricing",
      href: "/app/pricing",
      icon: CreditCard,
    },
    {
      key: "settings" as const,
      label: "Settings",
      href: "/app/settings",
      icon: SlidersHorizontal,
    },
    {
      key: "landing" as const,
      label: "Showcase",
      href: "/landing",
      icon: Sparkles,
    },
  ];

  return (
    <nav
      aria-label="App Navigation"
      className={`inline-flex items-center p-1 rounded-xl bg-card/60 backdrop-blur-xs border border-border text-xs ${className}`}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activePage === tab.key;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
              isActive
                ? "bg-surface text-text shadow-2xs font-semibold"
                : "text-muted hover:text-text hover:bg-card/80"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? "text-primary" : "text-muted"}`} />
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "bg-surface text-muted/80"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
