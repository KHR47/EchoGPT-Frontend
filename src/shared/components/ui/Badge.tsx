import React from "react";
import { cn } from "@/shared/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "muted"
    | "outline";
  size?: "xs" | "sm" | "md";
  dot?: boolean;
  dotPulse?: boolean;
}

export function Badge({
  className,
  variant = "primary",
  size = "sm",
  dot = false,
  dotPulse = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary: "bg-primary-subtle text-primary border-primary/20",
    secondary: "bg-secondary-subtle text-secondary border-secondary/20",
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    error: "bg-red-500/10 text-red-500 border-red-500/20",
    muted: "bg-card text-muted border-border",
    outline: "bg-transparent text-text border-border",
  };

  const dotColors = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
    muted: "bg-muted",
    outline: "bg-text",
  };

  const sizeStyles = {
    xs: "text-[10px] px-2 py-0.5 rounded-full font-medium gap-1",
    sm: "text-xs px-2.5 py-0.5 rounded-full font-medium gap-1.5",
    md: "text-xs px-3 py-1 rounded-full font-semibold gap-2",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center border font-sans tracking-wide transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {dotPulse && (
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                dotColors[variant]
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex rounded-full h-1.5 w-1.5",
              dotColors[variant]
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
}
