"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "h-11 w-full rounded-2xl border border-border bg-surface-solid px-4 text-sm text-foreground placeholder:text-[color:var(--color-muted)] shadow-sm outline-none transition focus:ring-2 focus:ring-[color:var(--color-ring)]",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

