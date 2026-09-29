import React, { forwardRef } from "react";
import { cn } from "@/shared/utils/cn";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "subtle";
  size?: "xs" | "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors duration-150 cursor-pointer disabled:pointer-events-none disabled:opacity-50 select-none outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:opacity-90";

    const variantStyles = {
      primary:
        "bg-primary hover:bg-primary-hover text-primary-foreground font-semibold shadow-xs hover:shadow-sm border border-primary-hover/30",
      secondary:
        "bg-surface hover:bg-card text-text border border-border hover:border-border-strong shadow-xs",
      outline:
        "bg-transparent hover:bg-primary-subtle text-primary border border-border hover:border-primary/50",
      ghost:
        "bg-transparent hover:bg-card text-text hover:text-primary",
      destructive:
        "bg-error hover:bg-red-600 text-white shadow-xs border border-transparent",
      subtle:
        "bg-primary-subtle hover:bg-primary/20 text-primary border border-transparent",
    };

    const sizeStyles = {
      xs: "text-xs h-7 px-2.5 rounded-md gap-1.5",
      sm: "text-xs h-8 px-3 rounded-lg gap-2",
      md: "text-sm h-9 px-3.5 rounded-lg gap-2",
      lg: "text-base h-11 px-5 rounded-xl gap-2.5",
      icon: "h-9 w-9 p-0 rounded-lg justify-center",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
