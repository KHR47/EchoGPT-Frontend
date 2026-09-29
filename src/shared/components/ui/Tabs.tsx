"use client";

import React, { createContext, useContext, useState } from "react";
import { cn } from "@/shared/utils/cn";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
  variant: "pills" | "underline";
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: "pills" | "underline";
  className?: string;
  children: React.ReactNode;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  variant = "pills",
  className,
  children,
}: TabsProps) {
  const [internalTab, setInternalTab] = useState(defaultValue);
  const activeTab = value !== undefined ? value : internalTab;

  const setActiveTab = (newTab: string) => {
    if (value === undefined) {
      setInternalTab(newTab);
    }
    onValueChange?.(newTab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant }}>
      <div className={cn("flex flex-col w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = useContext(TabsContext);
  const listRef = React.useRef<HTMLDivElement>(null);
  if (!context) throw new Error("TabsList must be used within Tabs");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!listRef.current) return;
    const tabs = Array.from(
      listRef.current.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')
    );
    if (tabs.length === 0) return;

    const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);
    if (currentIndex === -1) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % tabs.length;
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      tabs[prevIndex].focus();
      tabs[prevIndex].click();
    } else if (e.key === "Home") {
      e.preventDefault();
      tabs[0].focus();
      tabs[0].click();
    } else if (e.key === "End") {
      e.preventDefault();
      tabs[tabs.length - 1].focus();
      tabs[tabs.length - 1].click();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex items-center gap-1",
        context.variant === "pills"
          ? "p-1 bg-card rounded-xl border border-border"
          : "border-b border-border gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function TabsTrigger({
  value,
  children,
  className,
  disabled = false,
}: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");

  const isActive = context.activeTab === value;

  const pillStyles = isActive
    ? "bg-surface text-primary shadow-xs font-semibold"
    : "text-muted hover:text-text hover:bg-surface/50 font-medium";

  const underlineStyles = isActive
    ? "border-b-2 border-primary text-primary font-semibold -mb-px"
    : "border-b-2 border-transparent text-muted hover:text-text font-medium";

  return (
    <button
      type="button"
      role="tab"
      id={`tab-${value}`}
      aria-controls={`tabpanel-${value}`}
      disabled={disabled}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={() => context.setActiveTab(value)}
      className={cn(
        "px-3.5 py-1.5 text-xs rounded-lg transition-all duration-150 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none",
        context.variant === "pills" ? pillStyles : underlineStyles,
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  if (context.activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      tabIndex={0}
      className={cn("pt-4 animate-in fade-in-0 duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl", className)}
    >
      {children}
    </div>
  );
}
