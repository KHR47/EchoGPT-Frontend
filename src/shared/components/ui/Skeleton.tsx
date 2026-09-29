import React from "react";
import { cn } from "@/shared/utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: "rectangle" | "circle";
}

export function Skeleton({
  className,
  shape = "rectangle",
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-shimmer bg-card/80 border border-border/40 overflow-hidden",
        shape === "circle" ? "rounded-full" : "rounded-lg",
        className
      )}
      {...props}
    />
  );
}
