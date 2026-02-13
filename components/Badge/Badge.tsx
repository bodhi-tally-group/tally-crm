import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "error" | "info" | "outline";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
      default:
        "bg-[#2C365D] text-white dark:bg-[#7c8cb8] dark:text-white",
      secondary:
        "bg-[#00D2A2] text-white dark:bg-[#00D2A2] dark:text-white",
      success:
        "bg-[#008000] text-white dark:bg-[#22c55e] dark:text-white",
      warning:
        "bg-[#C53B00] text-white dark:bg-[#ea580c] dark:text-white",
      error:
        "bg-[#C40000] text-white dark:bg-[#dc2626] dark:text-white",
      info:
        "bg-[#0074C4] text-white dark:bg-[#0ea5e9] dark:text-white",
      outline:
        "border border-[#2C365D] text-[#2C365D] bg-transparent dark:border-gray-400 dark:text-gray-200 dark:bg-gray-700/50",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export default Badge;

