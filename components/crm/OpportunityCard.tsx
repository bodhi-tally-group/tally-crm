import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import Badge from "@/components/Badge/Badge";
import { formatCurrency } from "@/lib/mock-data/pipeline";
import type { Opportunity } from "@/types/crm";

interface OpportunityCardProps {
  opportunity: Opportunity;
  className?: string;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}

const docuSignColors: Record<string, string> = {
  "Not Started": "text-gray-400",
  Sent: "text-[#0074C4]",
  Viewed: "text-[#C53B00]",
  Signed: "text-[#008000]",
  Completed: "text-[#008000]",
};

export default function OpportunityCard({
  opportunity,
  className,
  draggable = true,
  onDragStart,
}: OpportunityCardProps) {
  return (
    <Link
      href={`/crm/pipeline/${opportunity.id}`}
      draggable={draggable}
      onDragStart={onDragStart}
      className={cn(
        "block cursor-pointer rounded-lg border border-border bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900",
        draggable && "cursor-grab active:cursor-grabbing",
        className
      )}
    >
      {/* Title */}
      <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
        {opportunity.name}
      </p>
      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
        {opportunity.accountName}
      </p>

      {/* Value + Probability */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {formatCurrency(opportunity.value)}
        </span>
        <Badge
          variant={
            opportunity.probability >= 70
              ? "success"
              : opportunity.probability >= 40
                ? "warning"
                : "outline"
          }
          className="text-[10px]"
        >
          {opportunity.probability}%
        </Badge>
      </div>

      {/* Meta */}
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Icon name="person" size={12} />
          {opportunity.owner}
        </span>
        <span>{opportunity.expectedCloseDate}</span>
      </div>

      {/* DocuSign indicator */}
      {opportunity.docuSignStatus !== "Not Started" && (
        <div className="mt-1.5 flex items-center gap-1 text-[10px]">
          <Icon
            name="verified"
            size={12}
            className={docuSignColors[opportunity.docuSignStatus]}
          />
          <span className="text-muted-foreground">
            DocuSign: {opportunity.docuSignStatus}
          </span>
        </div>
      )}
    </Link>
  );
}
