"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { Bot, User } from "lucide-react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "rounded";
  isAi?: boolean;
  status?: "online" | "busy" | "offline";
}

export function Avatar({
  className,
  src,
  alt = "Avatar",
  fallback,
  size = "md",
  shape = "circle",
  isAi = false,
  status,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const sizeStyles = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  const statusColors = {
    online: "bg-emerald-500",
    busy: "bg-amber-500",
    offline: "bg-muted",
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center shrink-0 bg-card border border-border text-text font-semibold overflow-hidden select-none",
        shape === "circle" ? "rounded-full" : "rounded-xl",
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          sizes="48px"
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      ) : fallback ? (
        <span className="uppercase">{fallback.slice(0, 2)}</span>
      ) : isAi ? (
        <Bot className={cn(iconSizes[size], "text-primary")} />
      ) : (
        <User className={cn(iconSizes[size], "text-muted")} />
      )}

      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-background",
            statusColors[status],
            size === "xs" ? "h-1.5 w-1.5" : size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5"
          )}
        />
      )}
    </div>
  );
}
