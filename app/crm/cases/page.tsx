"use client";

import React from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/Table/Table";
import Badge from "@/components/Badge/Badge";
import Button from "@/components/Button/Button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { mockCases } from "@/lib/mock-data/cases";
import { getAccountById, mockAccounts } from "@/lib/mock-data/accounts";
import SLAIndicator from "@/components/crm/SLAIndicator";
import CaseListSidebar from "@/components/crm/CaseListSidebar";
import AccountContextPanel from "@/components/crm/AccountContextPanel";
import CaseDetailContent from "@/components/crm/CaseDetailContent";
import LinkCaseModal from "@/components/crm/LinkCaseModal";
import NewCaseModal from "@/components/crm/NewCaseModal";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/Tooltip/Tooltip";
import { useCaseLinksOverrides } from "@/lib/case-links-overrides";
import type { CaseItem, CasePriority, CaseStatus, CaseType } from "@/types/crm";
type ViewMode = "kanban" | "list" | "tab";

const CASE_STATUSES: CaseStatus[] = [
  "New",
  "In Progress",
  "Pending",
  "Resolved",
  "Closed",
];

const statusColors: Record<CaseStatus, string> = {
  New: "bg-blue-500",
  "In Progress": "bg-[#0074C4]",
  Pending: "bg-[#C53B00]",
  Resolved: "bg-[#008000]",
  Closed: "bg-gray-400",
};

type ListViewId =
  | "all"
  | "all_open"
  | "my"
  | "my_open"
  | "recently_viewed"
  | "recently_viewed_cases"
  | "support_queue"
  | "unassigned";

const LIST_VIEWS: { id: ListViewId; label: string; pinned?: boolean }[] = [
  { id: "all", label: "All Cases", pinned: true },
  { id: "all_open", label: "All Open Cases" },
  { id: "my", label: "My Cases" },
  { id: "my_open", label: "My Open Cases" },
  { id: "recently_viewed", label: "Recently Viewed" },
  { id: "recently_viewed_cases", label: "Recently Viewed Cases" },
  { id: "support_queue", label: "Support Queue" },
  { id: "unassigned", label: "Unassigned" },
];
type SortField = "caseNumber" | "accountName" | "type" | "status" | "priority" | "slaStatus" | "owner" | "createdDate";
type SortDirection = "asc" | "desc";

const priorityOrder: Record<CasePriority, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

const slaOrder: Record<string, number> = {
  Breached: 0,
  "At Risk": 1,
  "On Track": 2,
};

const statusOrder: Record<string, number> = {
  New: 0,
  "In Progress": 1,
  Pending: 2,
  Resolved: 3,
  Closed: 4,
};

const priorityVariant: Record<CasePriority, "error" | "warning" | "info" | "outline"> = {
  Critical: "error",
  High: "warning",
  Medium: "info",
  Low: "outline",
};

export default function CaseListPage() {
  const [viewMode, setViewMode] = React.useState<ViewMode>("list");
  const [tabViewSelectedCaseId, setTabViewSelectedCaseId] = React.useState<string | null>(null);
  const [listView, setListView] = React.useState<ListViewId>("my");
  const kanbanRef = React.useRef<HTMLDivElement>(null);
  const [cases, setCases] = React.useState(mockCases);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [accountFilter, setAccountFilter] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortField, setSortField] = React.useState<SortField>("createdDate");
  const [sortDir, setSortDir] = React.useState<SortDirection>("desc");
  const [linkModalOpen, setLinkModalOpen] = React.useState(false);
  type PendingReason = "Customer" | "3rd Party" | "On Hold";
  const [pendingFiltersSelected, setPendingFiltersSelected] = React.useState<
    Set<PendingReason>
  >(new Set());
  const { getRelatedCases, addLink } = useCaseLinksOverrides();

  // Convert vertical mouse-wheel into horizontal scroll for kanban board
  React.useEffect(() => {
    const el = kanbanRef.current;
    if (!el || viewMode !== "kanban") return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      if (el.scrollWidth <= el.clientWidth) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [viewMode]);

  const accountNames = React.useMemo(
    () => Array.from(new Set(mockCases.map((c) => c.accountName))).sort(),
    []
  );

  const handleDrop = (caseId: string, newStatus: CaseStatus) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c))
    );
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = React.useMemo(() => {
    let result = [...cases];

    // Apply list-view filter
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
      // "all", "recently_viewed", "recently_viewed_cases" show all for now
      default:
        break;
    }

    // Account filter
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
          c.description.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortField) {
        case "caseNumber":
          return dir * a.caseNumber.localeCompare(b.caseNumber);
        case "accountName":
          return dir * a.accountName.localeCompare(b.accountName);
        case "type":
          return dir * a.type.localeCompare(b.type);
        case "status":
          return dir * ((statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99));
        case "priority":
          return dir * (priorityOrder[a.priority] - priorityOrder[b.priority]);
        case "slaStatus":
          return dir * ((slaOrder[a.slaStatus] ?? 99) - (slaOrder[b.slaStatus] ?? 99));
        case "owner":
          return dir * a.owner.localeCompare(b.owner);
        case "createdDate":
        default:
          return dir * a.createdDate.localeCompare(b.createdDate);
      }
    });

    return result;
  }, [cases, listView, accountFilter, searchQuery, sortField, sortDir]);

  const pendingCounts = React.useMemo(() => {
    const allPending = filtered.filter((c) => c.status === "Pending");
    return {
      Customer: allPending.filter((c) => c.pendingReason === "Customer").length,
      "3rd Party": allPending.filter((c) => c.pendingReason === "3rd Party").length,
      "On Hold": allPending.filter((c) => c.pendingReason === "On Hold").length,
    };
  }, [filtered]);

  const togglePendingFilter = React.useCallback((reason: PendingReason) => {
    setPendingFiltersSelected((prev) => {
      const next = new Set(prev);
      if (next.has(reason)) next.delete(reason);
      else next.add(reason);
      return next;
    });
  }, []);

  // In Tab view, keep selection in sync with filtered list (e.g. when filters change)
  React.useEffect(() => {
    if (viewMode !== "tab" || !tabViewSelectedCaseId) return;
    const isInFiltered = filtered.some((c) => c.id === tabViewSelectedCaseId);
    if (!isInFiltered) {
      setTabViewSelectedCaseId(filtered[0]?.id ?? null);
    }
  }, [viewMode, filtered, tabViewSelectedCaseId]);

  const kanbanByStatus = React.useMemo(() => {
    const byStatus: Record<string, CaseItem[]> = {};
    for (const status of CASE_STATUSES) {
      let casesForStatus = filtered.filter((c) => c.status === status);
      if (status === "Pending" && pendingFiltersSelected.size > 0) {
        casesForStatus = casesForStatus.filter(
          (c) => c.pendingReason && pendingFiltersSelected.has(c.pendingReason)
        );
      }
      byStatus[status] = casesForStatus;
    }
    return byStatus;
  }, [filtered, pendingFiltersSelected]);

  const renderSortHeader = (field: SortField, label: string, className?: string) => (
    <TableHead key={field} className={className}>
      <button
        type="button"
        onClick={() => handleSort(field)}
        className="inline-flex items-center gap-1 font-medium hover:text-gray-900 dark:hover:text-gray-100"
      >
        {label}
        {sortField === field && (
          <Icon
            name={sortDir === "asc" ? "arrow_upward" : "arrow_downward"}
            size={14}
          />
        )}
      </button>
    </TableHead>
  );

  return (
    <div
      className={cn(
        "min-w-0 flex-1 overflow-x-hidden",
        viewMode === "tab" ? "flex min-h-0 flex-col overflow-hidden" : "overflow-y-auto"
      )}
    >
    <div
      className={cn(
        "mx-auto w-full min-w-0 max-w-[1600px] p-density-xl",
        viewMode === "tab" && "flex min-h-0 flex-1 flex-col"
      )}
    >
      {/* Page header */}
      <div className={cn("mb-density-xl flex items-center justify-between", viewMode === "tab" && "shrink-0")}>
        <div>
          <h1
            className="font-bold text-gray-900 dark:text-gray-100"
            style={{ fontSize: "var(--tally-font-size-3xl)", lineHeight: "var(--tally-line-height-tight)" }}
          >
            Case Queue
          </h1>
          <p
            className="mt-density-xs text-muted-foreground"
            style={{ fontSize: "var(--tally-font-size-sm)" }}
          >
            Manage and track support cases
          </p>
        </div>
        <Button size="md" className="gap-1.5" onClick={() => setModalOpen(true)}>
          <Icon name="add" size="var(--tally-icon-size-sm)" className="mr-1" />
          New Case
        </Button>
      </div>

      {/* Filters */}
      <div className={cn("mb-density-lg flex flex-wrap items-center gap-density-md", viewMode === "tab" && "shrink-0")}>
        {/* Left: list view, account filter, search (search grows) */}
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-density-md">
          <div className="relative min-w-[140px]">
            <select
              value={listView}
              onChange={(e) => setListView(e.target.value as ListViewId)}
              className="w-full cursor-pointer appearance-none rounded-density-md border border-border bg-white py-2 pl-3 pr-9 font-medium transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-100"
              style={{ fontSize: "var(--tally-font-size-sm)" }}
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
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>

          <div className="relative max-w-[180px]">
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="w-full cursor-pointer truncate appearance-none rounded-density-md border border-border bg-white py-2 pl-3 pr-9 font-medium transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-100"
              style={{ fontSize: "var(--tally-font-size-sm)" }}
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
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>

          <div className="relative min-w-[120px] flex-1">
            <Icon
              name="search"
              size="var(--tally-icon-size-md)"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cases..."
              className="w-full rounded-density-md border border-border bg-white py-2 pl-9 pr-3 outline-none placeholder:text-muted-foreground focus:border-[#2C365D] focus:ring-1 focus:ring-[#2C365D] dark:border-gray-700 dark:bg-gray-900"
              style={{ fontSize: "var(--tally-font-size-sm)" }}
            />
          </div>
        </div>

        {/* Right: List / Kanban / Tab view toggle — aligned to container edge */}
        <div className="inline-flex shrink-0 rounded-density-md border border-border bg-white p-0.5 dark:border-gray-700 dark:bg-gray-900">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center rounded px-2.5 py-1 font-medium transition-colors",
              viewMode === "list"
                ? "bg-[#2C365D] text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            )}
            style={{ fontSize: "var(--tally-font-size-xs)" }}
          >
            <Icon name="list" size="var(--tally-icon-size-sm)" className="mr-1" />
            List
          </button>
          <button
            type="button"
            onClick={() => setViewMode("kanban")}
            className={cn(
              "flex items-center rounded px-2.5 py-1 font-medium transition-colors",
              viewMode === "kanban"
                ? "bg-[#2C365D] text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            )}
            style={{ fontSize: "var(--tally-font-size-xs)" }}
          >
            <Icon name="view_kanban" size="var(--tally-icon-size-sm)" className="mr-1" />
            Kanban
          </button>
          <button
            type="button"
            onClick={() => {
              setViewMode("tab");
              if (filtered.length > 0 && !tabViewSelectedCaseId) {
                setTabViewSelectedCaseId(filtered[0].id);
              }
            }}
            className={cn(
              "flex items-center rounded px-2.5 py-1 font-medium transition-colors",
              viewMode === "tab"
                ? "bg-[#2C365D] text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            )}
            style={{ fontSize: "var(--tally-font-size-xs)" }}
          >
            <Icon name="tab" size="var(--tally-icon-size-sm)" className="mr-1" />
            Tab
          </button>
        </div>
      </div>

      {/* Tab view (sidebar + case detail) — stays inside viewport; scroll only inside this box */}
      {viewMode === "tab" && (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-white dark:border-gray-700 dark:bg-gray-900">
          <div className="flex min-h-0 min-w-0 flex-1 overflow-auto" style={{ minWidth: 0 }}>
            <div className="flex min-h-0 w-full min-w-0">
              <CaseListSidebar
                cases={filtered}
                currentCaseId={tabViewSelectedCaseId ?? ""}
                onSelectCase={(id) => setTabViewSelectedCaseId(id)}
                compact
              />
              {tabViewSelectedCaseId ? (() => {
                const caseItem = cases.find((c) => c.id === tabViewSelectedCaseId) ?? mockCases.find((c) => c.id === tabViewSelectedCaseId);
                const account = caseItem ? getAccountById(caseItem.accountId) : null;
                if (!caseItem || !account) {
                  return (
                    <div className="flex min-w-0 flex-1 items-center justify-center text-muted-foreground">
                      Case or account not found.
                    </div>
                  );
                }
                const relatedCaseNumbers = getRelatedCases(caseItem.id);
                return (
                  <>
                    <AccountContextPanel
                      account={account}
                      linkedCaseNumbers={relatedCaseNumbers}
                      currentCaseId={caseItem.id}
                      onOpenLinkModal={() => setLinkModalOpen(true)}
                    />
                    <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-auto">
                      <CaseDetailContent
                        caseItem={caseItem}
                        account={account}
                        showBreadcrumbs={false}
                        showOpenInFullPage
                        relatedCaseNumbers={relatedCaseNumbers}
                        onOpenLinkModal={() => setLinkModalOpen(true)}
                      />
                    </div>
                    <LinkCaseModal
                      open={linkModalOpen}
                      onOpenChange={setLinkModalOpen}
                      currentCaseId={caseItem.id}
                      account={account}
                      existingRelatedCaseNumbers={relatedCaseNumbers}
                      onSelectCase={(caseNumber) => addLink(caseItem.id, caseNumber)}
                    />
                  </>
                );
              })() : (
                <div className="flex min-w-0 flex-1 items-center justify-center text-muted-foreground">
                  Select a case from the list
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Kanban view */}
      {viewMode === "kanban" && (
        <div
          ref={kanbanRef}
          style={{ overflowX: "auto" }}
        >
          <div
            className="grid gap-density-lg pb-density-md"
            style={{ gridTemplateColumns: `repeat(${CASE_STATUSES.length}, minmax(260px, 1fr))` }}
          >
            {CASE_STATUSES.map((status) => {
              const statusCases = kanbanByStatus[status] ?? [];
              return (
                <CaseKanbanColumn
                  key={status}
                  status={status}
                  cases={statusCases}
                  onDrop={handleDrop}
                  pendingFiltersSelected={
                    status === "Pending" ? pendingFiltersSelected : undefined
                  }
                  onPendingFilterToggle={
                    status === "Pending" ? togglePendingFilter : undefined
                  }
                  pendingCounts={status === "Pending" ? pendingCounts : undefined}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* List view */}
      {viewMode === "list" && (
        <>
          <div className="overflow-hidden rounded-density-md border border-border bg-white dark:border-gray-700 dark:bg-gray-900">
            <Table dense>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {renderSortHeader("caseNumber", "Case #")}
                  {renderSortHeader("accountName", "Account")}
                  {renderSortHeader("type", "Type")}
                  {renderSortHeader("status", "Status")}
                  {renderSortHeader("priority", "Priority")}
                  {renderSortHeader("slaStatus", "SLA")}
                  {renderSortHeader("owner", "Owner")}
                  {renderSortHeader("createdDate", "Created")}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((caseItem) => (
                  <TableRow key={caseItem.id} className="group">
                    <TableCell>
                      <Link
                        href={`/crm/cases/${caseItem.id}`}
                        className="font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]"
                      >
                        {caseItem.caseNumber}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-gray-700 dark:text-gray-300">
                      {caseItem.accountName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{caseItem.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={caseItem.status} />
                    </TableCell>
                    <TableCell>
                      <Badge variant={priorityVariant[caseItem.priority]}>
                        {caseItem.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <SLAIndicator
                        status={caseItem.slaStatus}
                        timeRemaining={caseItem.slaTimeRemaining}
                      />
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {caseItem.owner}
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">
                      {caseItem.createdDate}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                      No cases match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="mt-density-md flex items-center justify-between text-muted-foreground" style={{ fontSize: "var(--tally-font-size-xs)" }}>
            <span>
              Showing {filtered.length} of {cases.length} cases
            </span>
            <div className="flex items-center gap-density-lg">
              <span className="flex items-center gap-density-xs">
                <span className="inline-block h-2 w-2 rounded-full bg-[#C40000]" />
                {cases.filter((c) => c.slaStatus === "Breached").length} breached
              </span>
              <span className="flex items-center gap-density-xs">
                <span className="inline-block h-2 w-2 rounded-full bg-[#C53B00]" />
                {cases.filter((c) => c.slaStatus === "At Risk").length} at risk
              </span>
            </div>
          </div>
        </>
      )}

      {/* New Case Modal */}
      {modalOpen && (
        <NewCaseModal
          onClose={() => setModalOpen(false)}
          onCreate={(newCase) => {
            setCases((prev) => [newCase, ...prev]);
          }}
          caseCount={cases.length}
        />
      )}
    </div>
    </div>
  );
}

/* ─── Kanban Column ────────────────────────────────────────────────────── */

const PENDING_FILTER_CONFIG: {
  reason: "Customer" | "3rd Party" | "On Hold";
  icon: string;
}[] = [
  { reason: "Customer", icon: "person" },
  { reason: "3rd Party", icon: "group" },
  { reason: "On Hold", icon: "pause" },
];

function CaseKanbanColumn({
  status,
  cases: columnCases,
  onDrop,
  pendingFiltersSelected,
  onPendingFilterToggle,
  pendingCounts,
}: {
  status: CaseStatus;
  cases: CaseItem[];
  onDrop: (caseId: string, newStatus: CaseStatus) => void;
  pendingFiltersSelected?: Set<"Customer" | "3rd Party" | "On Hold">;
  onPendingFilterToggle?: (reason: "Customer" | "3rd Party" | "On Hold") => void;
  pendingCounts?: { Customer: number; "3rd Party": number; "On Hold": number };
}) {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const caseId = e.dataTransfer.getData("text/plain");
    if (caseId) onDrop(caseId, status);
  };

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col rounded-lg border border-border bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50",
        isDragOver &&
          "border-[#2C365D] bg-[#2C365D]/5 dark:border-[#7c8cb8] dark:bg-[#7c8cb8]/5"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div className="flex items-center justify-between gap-2 rounded-t-lg border-b border-border bg-white px-3 py-2.5 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", statusColors[status])} />
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {status}
          </span>
          <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
            {columnCases.length}
          </span>
        </div>
        {status === "Pending" && onPendingFilterToggle && pendingCounts && (
          <div className="flex shrink-0 items-center gap-1">
            {PENDING_FILTER_CONFIG.map(({ reason, icon }) => {
              const selected = pendingFiltersSelected?.has(reason) ?? false;
              const count = pendingCounts[reason];
              return (
                <div key={reason} className="relative">
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => onPendingFilterToggle(reason)}
                        className={cn(
                          "flex items-center gap-0.5 rounded p-1 transition-colors",
                          selected
                            ? "text-[#C53B00] hover:text-[#C53B00]/90 dark:text-[#C53B00] dark:hover:text-[#e85c1a]"
                            : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                        )}
                      >
                        <Icon name={icon} size={16} />
                        <span className="text-[10px] font-medium tabular-nums">{count}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="!border-0 !bg-white !px-4 !py-2.5 !text-sm !font-normal !text-gray-900 !shadow-md dark:!bg-gray-800 dark:!text-gray-100"
                      style={{
                        boxShadow:
                          "0 2px 2px -1px rgba(10,13,18,0.04), 0 4px 6px -2px rgba(10,13,18,0.03), 0 12px 16px -4px rgba(10,13,18,0.08)",
                      }}
                    >
                      <span className="whitespace-nowrap">{reason}</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="flex min-h-[120px] flex-1 flex-col gap-2 overflow-y-auto p-2">
        {columnCases.map((c) => (
          <CaseKanbanCard key={c.id} caseItem={c} />
        ))}
        {columnCases.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-8 text-sm text-muted-foreground">
            No cases
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Kanban Card ─────────────────────────────────────────────────────── */

function CaseKanbanCard({ caseItem }: { caseItem: CaseItem }) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", caseItem.id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <Link
      href={`/crm/cases/${caseItem.id}`}
      draggable
      onDragStart={handleDragStart}
      className="block cursor-grab rounded-lg border border-border bg-white p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing dark:border-gray-700 dark:bg-gray-900"
    >
      {/* Case number + priority */}
      <div className="flex items-center justify-between">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
          {caseItem.caseNumber}
        </p>
        <Badge
          variant={priorityVariant[caseItem.priority]}
          className="shrink-0 text-[10px]"
        >
          {caseItem.priority}
        </Badge>
      </div>

      {/* Account name */}
      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
        {caseItem.accountName}
      </p>

      {/* Type + SLA row */}
      <div className="mt-2 flex items-center justify-between">
        <Badge variant="outline" className="text-[10px]">
          {caseItem.type}
        </Badge>
        <SLAIndicator
          status={caseItem.slaStatus}
          timeRemaining={caseItem.slaTimeRemaining}
        />
      </div>

      {/* Owner + Date */}
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Icon name="person" size={12} />
          {caseItem.owner}
        </span>
        <span>{caseItem.createdDate}</span>
      </div>
    </Link>
  );
}

/* ─── Status Badge (for list view) ────────────────────────────────────── */

function StatusBadge({ status }: { status: CaseItem["status"] }) {
  const config: Record<
    string,
    { variant: "default" | "info" | "warning" | "success" | "outline"; dot?: string }
  > = {
    New: { variant: "outline", dot: "bg-blue-500" },
    "In Progress": { variant: "info" },
    Pending: { variant: "warning" },
    Resolved: { variant: "success" },
    Closed: { variant: "default" },
  };

  const c = config[status] ?? config["New"];

  return (
    <Badge variant={c.variant} className="gap-1">
      {c.dot && <span className={cn("inline-block h-1.5 w-1.5 rounded-full", c.dot)} />}
      {status}
    </Badge>
  );
}

