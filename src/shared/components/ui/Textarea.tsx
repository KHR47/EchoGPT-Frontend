"use client";

import React, { forwardRef, useEffect, useId, useRef } from "react";
import { cn } from "@/shared/utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  autoResize?: boolean;
  maxRows?: number;
  wrapperClassName?: string;
  keyboardHint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      wrapperClassName,
      label,
      error,
      helperText,
      autoResize = true,
      maxRows = 8,
      id,
      disabled,
      value,
      keyboardHint,
      onChange,
      ...props
    },
    forwardedRef
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    const setRefs = (node: HTMLTextAreaElement | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    useEffect(() => {
      const textarea = internalRef.current;
      if (!textarea || !autoResize) return;

      textarea.style.height = "auto";
      const maxHeight = maxRows * 24;
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
    }, [value, autoResize, maxRows]);

    return (
      <div className={cn("flex flex-col gap-1.5 w-full", wrapperClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-semibold tracking-wide text-text flex items-center justify-between"
          >
            <span>{label}</span>
            {keyboardHint && (
              <span className="text-[10px] font-normal text-muted">
                {keyboardHint}
              </span>
            )}
          </label>
        )}

        <div
          className={cn(
            "relative flex items-center w-full rounded-xl bg-surface border transition-all duration-200",
            error
              ? "border-error focus-within:ring-2 focus-within:ring-error/20"
              : "border-border hover:border-border-strong focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
            disabled && "opacity-50 cursor-not-allowed bg-card"
          )}
        >
          <textarea
            ref={setRefs}
            id={textareaId}
            disabled={disabled}
            value={value}
            onChange={(e) => {
              onChange?.(e);
            }}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "w-full bg-transparent px-3.5 py-2.5 text-sm text-text placeholder:text-muted/60 outline-none resize-none disabled:cursor-not-allowed min-h-[80px]",
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p id={errorId} role="alert" className="text-xs text-error font-medium">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={helperId} className="text-xs text-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
