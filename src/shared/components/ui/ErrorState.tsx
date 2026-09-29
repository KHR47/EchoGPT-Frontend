"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./Button";

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  className,
  title = "Something went wrong",
  message = "An unexpected error occurred while loading this view. Please try again.",
  onRetry,
  retryLabel = "Try again",
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-10 text-center rounded-xl border border-error/30 bg-error/5 max-w-md mx-auto my-6",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-error/10 text-error mb-3.5 border border-error/20 shadow-xs">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-sm sm:text-base font-bold text-text tracking-tight mb-1.5">
        {title}
      </h3>
      <p className="text-xs text-muted leading-relaxed max-w-xs mb-4">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
