"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/shared/utils/cn";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  className,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";

      const timer = setTimeout(() => {
        if (modalRef.current) {
          const focusable = modalRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length > 0) {
            focusable[0].focus();
          } else {
            modalRef.current.focus();
          }
        }
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
        previouslyFocusedRef.current?.focus();
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || document.activeElement === modalRef.current) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw] h-[90vh]",
  };

  const titleId = title ? "modal-dialog-title" : undefined;
  const descId = description ? "modal-dialog-desc" : undefined;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >

      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fade-in"
      />

      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          "relative z-10 w-full max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] rounded-xl bg-surface border border-border p-4 sm:p-6 shadow-xl animate-scale-in overflow-hidden flex flex-col focus:outline-none",
          sizeStyles[size],
          className
        )}
      >

        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 p-1.5 rounded-lg text-muted hover:text-text hover:bg-card transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X className="w-4 h-4" />
        </button>

        {(title || description) && (
          <div className="mb-4 pr-8">
            {title && (
              <h2 id={titleId} className="text-lg font-bold text-text tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p id={descId} className="text-xs text-muted mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function ModalFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2.5 pt-4 mt-6 border-t border-border",
        className
      )}
    >
      {children}
    </div>
  );
}
