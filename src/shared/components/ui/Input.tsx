import React, { forwardRef, useId } from "react";
import { cn } from "@/shared/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      wrapperClassName,
      type = "text",
      label,
      error,
      helperText,
      leftAdornment,
      rightAdornment,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className={cn("flex flex-col gap-1.5 w-full", wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold tracking-wide text-text flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}

        <div
          className={cn(
            "relative flex items-center w-full rounded-lg bg-surface border transition-colors duration-150 shadow-2xs",
            error
              ? "border-error focus-within:ring-1 focus-within:ring-error"
              : "border-border hover:border-border-strong focus-within:border-primary focus-within:ring-1 focus-within:ring-primary",
            disabled && "opacity-50 cursor-not-allowed bg-card"
          )}
        >
          {leftAdornment && (
            <div className="pl-3.5 pr-1 flex items-center text-muted shrink-0">
              {leftAdornment}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "w-full bg-transparent px-3.5 py-2.5 text-sm text-text placeholder:text-muted/60 outline-none disabled:cursor-not-allowed",
              leftAdornment && "pl-1.5",
              rightAdornment && "pr-1.5",
              className
            )}
            {...props}
          />

          {rightAdornment && (
            <div className="pr-3.5 pl-1 flex items-center text-muted shrink-0">
              {rightAdornment}
            </div>
          )}
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

Input.displayName = "Input";
