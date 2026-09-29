import React from "react";
import { cn } from "@/shared/utils/cn";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: string;
}

export function Separator({
  className,
  orientation = "horizontal",
  label,
  ...props
}: SeparatorProps) {
  if (label && orientation === "horizontal") {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn("flex items-center w-full my-4", className)}
        {...props}
      >
        <div className="flex-1 h-px bg-border" />
        <span className="px-3 text-[11px] font-semibold tracking-wider uppercase text-muted">
          {label}
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-px w-full my-4" : "w-px h-full mx-4",
        className
      )}
      {...props}
    />
  );
}
