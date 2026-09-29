import React from "react";
import { cn } from "@/shared/utils/cn";
import { Sparkles } from "lucide-react";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  className,
  icon = <Sparkles className="w-8 h-8 text-primary" />,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-10 text-center rounded-xl border border-dashed border-border bg-surface/60 max-w-md mx-auto my-6",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-subtle text-primary mb-3.5 border border-primary/20 shadow-xs">
        {icon}
      </div>
      <h3 className="text-sm sm:text-base font-bold text-text tracking-tight mb-1.5">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-muted leading-relaxed max-w-xs mb-4">
          {description}
        </p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
