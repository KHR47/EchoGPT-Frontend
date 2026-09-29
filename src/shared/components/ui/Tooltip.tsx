"use client";

import React, { useId, useState } from "react";
import { cn } from "@/shared/utils/cn";

export interface TooltipProps {
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delayMs?: number;
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  className?: string;
}

export function Tooltip({
  content,
  position = "top",
  delayMs = 150,
  children,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const tooltipId = useId();

  const show = () => {
    const id = setTimeout(() => setIsVisible(true), delayMs);
    setTimeoutId(id);
  };

  const hide = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          hide();
        }
      }}
    >
      {React.cloneElement(children, {
        "aria-describedby": isVisible ? tooltipId : undefined,
      })}

      {isVisible && content && (
        <div
          id={tooltipId}
          role="tooltip"
          className={cn(
            "absolute z-50 px-2.5 py-1 text-xs font-medium text-white bg-neutral-900 border border-border-strong rounded-lg shadow-lg whitespace-nowrap pointer-events-none transition-all duration-150 animate-in fade-in-0 zoom-in-95",
            positionStyles[position],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
