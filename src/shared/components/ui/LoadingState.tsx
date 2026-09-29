import React from "react";
import { cn } from "@/shared/utils/cn";
import { Loader2 } from "lucide-react";
import { Skeleton } from "./Skeleton";

export interface LoadingStateProps
  extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  subMessage?: string;
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "skeleton";
}

export function LoadingState({
  className,
  message = "Loading...",
  subMessage,
  size = "md",
  variant = "spinner",
  ...props
}: LoadingStateProps) {
  const spinnerSizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  if (variant === "skeleton") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn("w-full space-y-3 p-4 sm:p-6", className)}
        {...props}
      >
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-10 w-4/5" />
        <span className="sr-only">Loading content, please wait...</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center my-6",
        className
      )}
      {...props}
    >
      <div className="relative flex items-center justify-center mb-3">
        <Loader2
          className={cn(
            "animate-spin text-primary shrink-0",
            spinnerSizes[size]
          )}
        />
      </div>
      {message && (
        <p className="text-sm font-semibold text-text tracking-wide">
          {message}
        </p>
      )}
      {subMessage && (
        <p className="text-xs text-muted mt-1 max-w-xs">{subMessage}</p>
      )}
      <span className="sr-only">Loading, please wait...</span>
    </div>
  );
}
