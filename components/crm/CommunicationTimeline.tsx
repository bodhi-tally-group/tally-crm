"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import Badge from "@/components/Badge/Badge";
import Button from "@/components/Button/Button";
import type { Communication } from "@/types/crm";

interface CommunicationTimelineProps {
  communications: Communication[];
  className?: string;
}

const directionConfig = {
  Inbound: { icon: "call_received", color: "text-[#0074C4]", label: "Inbound" },
  Outbound: { icon: "call_made", color: "text-[#008000]", label: "Outbound" },
  Internal: { icon: "forum", color: "text-[#595767]", label: "Internal" },
};

const typeIcons: Record<string, string> = {
  Email: "mail",
  Phone: "phone",
  Note: "edit_note",
  System: "settings",
};

export default function CommunicationTimeline({
  communications,
  className,
}: CommunicationTimelineProps) {
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(
    new Set(communications.length > 0 ? [communications[0].id] : [])
  );

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Sort by timestamp descending (newest first)
  const sorted = [...communications].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className={cn("space-y-1", className)}>
      {/* Compose button */}
      <div className="mb-3 flex items-center gap-2">
        <Button size="sm" className="gap-1.5">
          <Icon name="edit" size={16} />
          Compose
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Icon name="reply" size={16} />
          Reply
        </Button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />

        {sorted.map((comm) => {
          const isExpanded = expandedIds.has(comm.id);
          const dirConfig = directionConfig[comm.direction];

          return (
            <div key={comm.id} className="relative pb-4 pl-10">
              {/* Timeline dot */}
              <div
                className={cn(
                  "absolute left-2 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-gray-950",
                  dirConfig.color
                )}
              >
                <Icon name={typeIcons[comm.type] ?? "mail"} size={14} />
              </div>

              {/* Communication card */}
              <div className="rounded-lg border border-border bg-white dark:border-gray-700 dark:bg-gray-900">
                {/* Header */}
                <button
                  type="button"
                  onClick={() => toggleExpanded(comm.id)}
                  className="flex w-full items-start justify-between gap-2 px-3 py-2.5 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                        {comm.subject}
                      </span>
                      <Badge
                        variant={
                          comm.direction === "Inbound"
                            ? "info"
                            : comm.direction === "Outbound"
                              ? "success"
                              : "outline"
                        }
                        className="shrink-0 text-[10px] px-1.5 py-0"
                      >
                        {dirConfig.label}
                      </Badge>
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                      {comm.direction === "Inbound" ? "From" : "To"}:{" "}
                      {comm.direction === "Inbound" ? comm.from : comm.to}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground">
                      {comm.timestamp}
                    </span>
                    <Icon
                      name={isExpanded ? "expand_less" : "expand_more"}
                      size={18}
                      className="text-gray-400"
                    />
                  </div>
                </button>

                {/* Expanded body */}
                {isExpanded && (
                  <div className="border-t border-border px-3 py-3 dark:border-gray-700">
                    {/* Metadata */}
                    <div className="mb-3 space-y-0.5 text-[11px] text-muted-foreground">
                      <p>
                        <span className="font-medium">From:</span> {comm.from}
                      </p>
                      <p>
                        <span className="font-medium">To:</span> {comm.to}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {comm.timestamp}
                      </p>
                    </div>

                    {/* Body */}
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {comm.body}
                    </div>

                    {/* Attachments */}
                    {comm.attachments.length > 0 && (
                      <div className="mt-3 border-t border-border pt-3 dark:border-gray-700">
                        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          Attachments
                        </p>
                        {comm.attachments.map((att) => (
                          <div
                            key={att.id}
                            className="inline-flex items-center gap-1.5 rounded border border-border bg-gray-50 px-2 py-1 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          >
                            <Icon name="attach_file" size={14} />
                            {att.name}
                            <span className="text-muted-foreground">
                              ({att.size})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
