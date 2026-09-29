"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/shared/utils/cn";

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  close: () => void;
  setTriggerElement: (node: HTMLElement | null) => void;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export function Dropdown({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  const setTriggerElement = useCallback((node: HTMLElement | null) => {
    triggerElementRef.current = node;
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    triggerElementRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close]);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, close, setTriggerElement }}>
      <div ref={containerRef} className={cn("relative inline-block text-left", className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownTrigger({
  children,
  asChild = false,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("DropdownTrigger must be used within Dropdown");

  const { isOpen, setIsOpen, setTriggerElement } = context;
  const toggle = () => setIsOpen((prev) => !prev);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void; onKeyDown?: (e: React.KeyboardEvent) => void; "aria-expanded"?: boolean; ref?: (node: HTMLElement | null) => void }>, {
      onClick: toggle,
      onKeyDown: handleKeyDown,
      "aria-expanded": isOpen,
      ref: setTriggerElement,
    });
  }

  return (
    <button
      ref={setTriggerElement}
      type="button"
      onClick={toggle}
      onKeyDown={handleKeyDown}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      className="inline-flex items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
    >
      {children}
    </button>
  );
}

export function DropdownMenu({
  children,
  align = "right",
  className,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  const context = useContext(DropdownContext);
  const menuRef = useRef<HTMLDivElement>(null);
  if (!context) throw new Error("DropdownMenu must be used within Dropdown");

  useEffect(() => {
    if (context.isOpen && menuRef.current) {
      const items = menuRef.current.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([disabled])'
      );
      if (items.length > 0) {
        items[0].focus();
      }
    }
  }, [context.isOpen]);

  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!menuRef.current) return;
    const items = Array.from(
      menuRef.current.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])')
    );
    if (items.length === 0) return;

    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % items.length;
      items[nextIndex].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + items.length) % items.length;
      items[prevIndex].focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0].focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1].focus();
    } else if (e.key === "Tab") {
      context.close();
    }
  };

  if (!context.isOpen) return null;

  return (
    <div
      ref={menuRef}
      role="menu"
      tabIndex={-1}
      onKeyDown={handleMenuKeyDown}
      className={cn(
        "absolute z-50 mt-1.5 min-w-[200px] max-w-[calc(100vw-24px)] rounded-xl bg-surface border border-border p-1.5 shadow-lg focus:outline-none animate-dropdown-enter",
        align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left",
        className
      )}
    >
      {children}
    </div>
  );
}

export interface DropdownItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  destructive?: boolean;
  shortcut?: string;
}

export function DropdownItem({
  children,
  icon,
  destructive = false,
  shortcut,
  className,
  onClick,
  ...props
}: DropdownItemProps) {
  const context = useContext(DropdownContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    context?.close();
  };

  return (
    <button
      type="button"
      role="menuitem"
      onClick={handleClick}
      className={cn(
        "flex w-full items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer select-none text-left",
        destructive
          ? "text-error hover:bg-error/10"
          : "text-text hover:bg-card hover:text-primary",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="shrink-0 text-muted">{icon}</span>}
        <span>{children}</span>
      </div>
      {shortcut && (
        <span className="text-[10px] text-muted tracking-wider">{shortcut}</span>
      )}
    </button>
  );
}

export function DropdownSeparator({ className }: { className?: string }) {
  return <div className={cn("my-1 h-px bg-border", className)} />;
}
