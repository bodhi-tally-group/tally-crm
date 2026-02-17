"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import SLAIndicator from "@/components/crm/SLAIndicator";
import type { CaseItem } from "@/types/crm";

type ListViewId =
  | "all"
  | "all_open"
  | "my"
  | "my_open"
  | "unassigned"
  | "support_queue";

const LIST_VIEWS: { id: ListViewId; label: string }[] = [
  { id: "all", label: "All Cases" },
  { id: "all_open", label: "All Open" },
  { id: "my", label: "My Cases" },
  { id: "my_open", label: "My Open" },
  { id: "unassigned", label: "Unassigned" },
  { id: "support_queue", label: "Support Queue" },
];

interface CaseListSidebarProps {
  cases: CaseItem[];
  currentCaseId: string;
  /** When set, list items call this instead of navigating (for embedded tab view). */
  onSelectCase?: (caseId: string) => void;
  /** When true, hide "Back to list", heading, search, and filters (Tab view only shows case cards). */
  compact?: boolean;
  className?: string;
}

export default function CaseListSidebar({
  cases,
  currentCaseId,
  onSelectCase,
  compact = false,
  className,
}: CaseListSidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [listView, setListView] = React.useState<ListViewId>("my");
  const [accountFilter, setAccountFilter] = React.useState("");

  const accountNames = React.useMemo(
    () => Array.from(new Set(cases.map((c) => c.accountName))).sort(),
    [cases]
  );

  const filtered = React.useMemo(() => {
    let result = [...cases];

    switch (listView) {
      case "my":
        result = result.filter((c) => c.owner === "John Smith");
        break;
      case "my_open":
        result = result.filter(
          (c) => c.owner === "John Smith" && c.status !== "Closed" && c.status !== "Resolved"
        );
        break;
      case "all_open":
        result = result.filter((c) => c.status !== "Closed" && c.status !== "Resolved");
        break;
      case "unassigned":
        result = result.filter((c) => c.owner === "Unassigned");
        break;
      case "support_queue":
        result = result.filter((c) => c.team === "Large Market Support");
        break;
      default:
        break;
    }

    if (accountFilter) {
      result = result.filter((c) => c.accountName === accountFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.caseNumber.toLowerCase().includes(q) ||
          c.accountName.toLowerCase().includes(q) ||
          c.type.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }

    return result;
  }, [cases, listView, accountFilter, searchQuery]);

  // In compact (tab) mode, the page header controls filtering; show the cases we're given without re-filtering.
  const displayList = compact ? cases : filtered;

  return (
    <aside
      className={cn(
        "flex min-h-0 shrink-0 flex-col border-r border-border bg-white dark:border-gray-800 dark:bg-gray-950",
        compact ? "w-52 min-w-0 sm:w-64" : "w-72",
        className
      )}
    >
      {!compact && (
        <>
          <div className="border-b border-border px-3 py-3 dark:border-gray-800">
            <Link
              href="/crm/cases"
              className="text-xs font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]"
            >
              ← Back to list
            </Link>
            <h2 className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-gray-400">
              Cases
            </h2>
          </div>

          {/* Search */}
          <div className="border-b border-border px-2 py-2 dark:border-gray-800">
            <div className="relative">
              <Icon
                name="search"
                size={16}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cases..."
                className="w-full rounded-md border border-border bg-white py-1.5 pl-8 pr-2 text-sm outline-none placeholder:text-muted-foreground focus:border-[#2C365D] focus:ring-1 focus:ring-[#2C365D] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>

            {/* List view + Account filter side by side */}
            <div className="mt-2 flex gap-1.5">
              <div className="relative min-w-0 flex-1">
                <select
                  value={listView}
                  onChange={(e) => setListView(e.target.value as ListViewId)}
                  className="w-full cursor-pointer appearance-none rounded-md border border-border bg-white py-1.5 pl-2 pr-7 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                >
                  {LIST_VIEWS.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
                <Icon
                  name="expand_more"
                  size={16}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
              <div className="relative min-w-0 flex-1">
                <select
                  value={accountFilter}
                  onChange={(e) => setAccountFilter(e.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-md border border-border bg-white py-1.5 pl-2 pr-7 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                >
                  <option value="">All Accounts</option>
                  {accountNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <Icon
                  name="expand_more"
                  size={16}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              {displayList.length} of {cases.length} case{cases.length !== 1 ? "s" : ""}
            </p>
          </div>
        </>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {displayList.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">
            No cases match your filters.
          </p>
        ) : (
          <ul className="space-y-2">
            {displayList.map((c) => {
              const isActive = c.id === currentCaseId;
              const cardClass = cn(
                "block w-full rounded-lg border px-2.5 py-2 text-left transition-colors",
                isActive
                  ? "border-[#2C365D] bg-[#2C365D]/5 dark:border-[#7c8cb8] dark:bg-[#7c8cb8]/10"
                  : "border-border bg-gray-50/80 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/40 dark:hover:bg-gray-800/60"
              );
              return (
                <li key={c.id}>
                  {onSelectCase ? (
                    <button
                      type="button"
                      onClick={() => onSelectCase(c.id)}
                      className={cardClass}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "truncate text-sm font-medium",
                            isActive
                              ? "text-[#2C365D] dark:text-[#7c8cb8]"
                              : "text-gray-900 dark:text-gray-100"
                          )}
                        >
                          {c.caseNumber}
                        </span>
                        {isActive && (
                          <Icon name="chevron_right" size={14} className="shrink-0 text-muted-foreground" />
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground" title={c.accountName}>
                        {c.accountName}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <span className="truncate text-[11px] text-muted-foreground">{c.status}</span>
                        <SLAIndicator status={c.slaStatus} size="sm" showIcon={false} className="shrink-0 text-[11px]" />
                      </div>
                    </button>
                  ) : (
                    <Link href={`/crm/cases/${c.id}`} className={cardClass}>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "truncate text-sm font-medium",
                            isActive
                              ? "text-[#2C365D] dark:text-[#7c8cb8]"
                              : "text-gray-900 dark:text-gray-100"
                          )}
                        >
                          {c.caseNumber}
                        </span>
                        {isActive && (
                          <Icon name="chevron_right" size={14} className="shrink-0 text-muted-foreground" />
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground" title={c.accountName}>
                        {c.accountName}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <span className="truncate text-[11px] text-muted-foreground">{c.status}</span>
                        <SLAIndicator status={c.slaStatus} size="sm" showIcon={false} className="shrink-0 text-[11px]" />
                      </div>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
