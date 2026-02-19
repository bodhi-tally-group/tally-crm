"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import Badge from "@/components/Badge/Badge";
import type { Communication } from "@/types/crm";

interface CommunicationTimelineProps {
  communications: Communication[];
  className?: string;
  /** Controlled expand state; when provided with onExpandedIdsChange, component is controlled */
  expandedIds?: Set<string>;
  onExpandedIdsChange?: (ids: Set<string>) => void;
}

const directionConfig = {
  Inbound: { icon: "call_received", label: "Inbound" },
  Outbound: { icon: "call_made", label: "Outbound" },
  Internal: { icon: "forum", label: "Internal" },
};

const typeIcons: Record<string, string> = {
  Email: "mail",
  Phone: "phone",
  Note: "edit_note",
  System: "settings",
};

const typeLoggedLabel: Record<string, string> = {
  Email: "Logged Email",
  Phone: "Logged Call",
  Note: "Logged Note",
  System: "Logged",
};

function formatTimestampDisplay(ts: string): string {
  const d = new Date(ts);
  if (!Number.isFinite(d.getTime())) return ts;
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Australia/Sydney",
    timeZoneName: "short",
  }).format(d);
}

export default function CommunicationTimeline({
  communications,
  className,
  expandedIds: controlledExpandedIds,
  onExpandedIdsChange,
}: CommunicationTimelineProps) {
  const [internalExpandedIds, setInternalExpandedIds] = React.useState<Set<string>>(
    new Set(communications.length > 0 ? [communications[0].id] : [])
  );
  const isControlled = controlledExpandedIds !== undefined && onExpandedIdsChange != null;
  const expandedIds = isControlled ? controlledExpandedIds : internalExpandedIds;

  const toggleExpanded = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    if (isControlled && onExpandedIdsChange) {
      onExpandedIdsChange(next);
    } else {
      setInternalExpandedIds(next);
    }
  };

  // Sort by latest first: timestamp descending, then by array index (later = newer)
  const sorted = [...communications]
    .map((c, i) => ({ c, i }))
    .sort((a, b) => {
      const tA = new Date(a.c.timestamp).getTime();
      const tB = new Date(b.c.timestamp).getTime();
      const aValid = Number.isFinite(tA);
      const bValid = Number.isFinite(tB);
      if (aValid && bValid) return tB - tA;
      if (!aValid && !bValid) return b.i - a.i;
      return aValid ? -1 : 1;
    })
    .map((x) => x.c);

  return (
    <div className={cn("space-y-1", className)}>
      {sorted.map((comm) => {
        const isExpanded = expandedIds.has(comm.id);
        const dirConfig = directionConfig[comm.direction];

        return (
          <div key={comm.id} className="pb-4 last:pb-0">
            <div className="rounded-lg border border-border bg-white dark:border-gray-700 dark:bg-gray-900">
              {/* Header */}
              <button
                type="button"
                onClick={() => toggleExpanded(comm.id)}
                className="flex w-full flex-col gap-1 px-3 py-2.5 text-left"
              >
                <div className="flex w-full items-center gap-2">
                  <div className="flex shrink-0 items-center text-muted-foreground">
                    <Icon name={typeIcons[comm.type] ?? "mail"} size={20} />
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {typeLoggedLabel[comm.type] ?? "Logged"} by {comm.loggedBy ?? "—"}
                  </span>
                </div>
                <div className="flex w-full items-start justify-between gap-2">
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
                      {formatTimestampDisplay(comm.timestamp)}
                    </span>
                    <Icon
                      name={isExpanded ? "expand_less" : "expand_more"}
                      size={18}
                      className="text-gray-400"
                    />
                  </div>
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
                        {formatTimestampDisplay(comm.timestamp)}
                      </p>
                    </div>

                    {/* Body (Notes may contain HTML) */}
                    {comm.type === "Note" && /<[a-zA-Z]/.test(comm.body) ? (
                      <div
                        className="prose prose-sm max-w-none text-sm leading-relaxed text-gray-700 dark:prose-invert dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: comm.body }}
                      />
                    ) : (
                      <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                        {comm.body}
                      </div>
                    )}

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
  );
}
