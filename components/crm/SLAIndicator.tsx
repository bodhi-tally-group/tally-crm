import React from "react";
import Badge from "@/components/Badge/Badge";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { SLAStatus } from "@/types/crm";

interface SLAIndicatorProps {
  status: SLAStatus;
  timeRemaining?: string;
  showIcon?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const slaConfig: Record<
  SLAStatus,
  { variant: "success" | "warning" | "error"; icon: string }
> = {
  "On Track": { variant: "success", icon: "check_circle" },
  "At Risk": { variant: "warning", icon: "warning" },
  Breached: { variant: "error", icon: "error" },
};

export default function SLAIndicator({
  status,
  timeRemaining,
  showIcon = true,
  size = "sm",
  className,
}: SLAIndicatorProps) {
  const config = slaConfig[status];
  const iconSize = size === "sm" ? 14 : 16;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <Badge
        variant={config.variant}
        className={cn(
          "gap-1",
          size === "sm" && "px-2 py-0.5 text-[11px]",
          size === "md" && "px-2.5 py-1 text-xs"
        )}
      >
        {showIcon && (
          <Icon name={config.icon} size={iconSize} className="shrink-0" />
        )}
        {status}
      </Badge>
      {timeRemaining && (
        <span
          className={cn(
            "font-medium text-muted-foreground",
            size === "sm" && "text-[11px]",
            size === "md" && "text-xs"
          )}
        >
          {timeRemaining}
        </span>
      )}
    </div>
  );
}
