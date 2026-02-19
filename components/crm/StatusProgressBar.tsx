"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import type { CaseStatus } from "@/types/crm";

interface StatusProgressBarProps {
  currentStatus: CaseStatus;
  className?: string;
  /** When provided, steps (except current) become clickable; called with the clicked status. */
  onStatusChange?: (newStatus: CaseStatus) => void;
}

const STATUS_STEPS: { status: CaseStatus; icon: string }[] = [
  { status: "New", icon: "add_circle" },
  { status: "In Progress", icon: "pending" },
  { status: "Pending", icon: "hourglass_top" },
  { status: "Resolved", icon: "task_alt" },
  { status: "Closed", icon: "check_circle" },
];

export default function StatusProgressBar({
  currentStatus,
  className,
  onStatusChange,
}: StatusProgressBarProps) {
  const currentIndex = STATUS_STEPS.findIndex(
    (s) => s.status === currentStatus
  );

  return (
    <div className={cn("flex items-center", className)}>
      {STATUS_STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === STATUS_STEPS.length - 1;
        const isClickable = onStatusChange != null && !isCurrent;

        const stepContent = (
          <>
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                isClickable && "cursor-pointer hover:opacity-90",
                isCompleted &&
                  "border-[#008000] bg-[#008000] text-white",
                isCurrent &&
                  "border-[#2C365D] bg-[#2C365D] text-white",
                !isCompleted &&
                  !isCurrent &&
                  "border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500"
              )}
            >
              <Icon name={isCompleted ? "check" : step.icon} size={16} />
            </div>
            <span
              className={cn(
                "max-w-[80px] text-center text-[10px] font-medium leading-tight",
                isCurrent
                  ? "text-[#2C365D] dark:text-[#7c8cb8]"
                  : isCompleted
                    ? "text-[#008000]"
                    : "text-gray-400 dark:text-gray-500"
              )}
            >
              {step.status}
            </span>
          </>
        );

        return (
          <React.Fragment key={step.status}>
            <div className="flex flex-col items-center gap-1">
              {isClickable ? (
                <button
                  type="button"
                  onClick={() => onStatusChange(step.status)}
                  className="flex flex-col items-center gap-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#006180] focus-visible:ring-offset-2"
                  aria-label={`Change status to ${step.status}`}
                >
                  {stepContent}
                </button>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  {stepContent}
                </div>
              )}
            </div>
            {!isLast && (
              <div
                className={cn(
                  "mx-1 mb-5 h-0.5 flex-1",
                  index < currentIndex
                    ? "bg-[#008000]"
                    : "bg-gray-200 dark:bg-gray-700"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
