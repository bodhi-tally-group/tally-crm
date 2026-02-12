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
import SLAIndicator from "@/components/crm/SLAIndicator";
import type { CaseItem, CasePriority } from "@/types/crm";

type FilterView = "all" | "my" | "unassigned";
type SortField = "caseNumber" | "createdDate" | "priority" | "slaStatus";
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

const priorityVariant: Record<CasePriority, "error" | "warning" | "info" | "outline"> = {
  Critical: "error",
  High: "warning",
  Medium: "info",
  Low: "outline",
};

export default function CaseListPage() {
  const [filterView, setFilterView] = React.useState<FilterView>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortField, setSortField] = React.useState<SortField>("createdDate");
  const [sortDir, setSortDir] = React.useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = React.useMemo(() => {
    let result = [...mockCases];

    if (filterView === "my") {
      result = result.filter((c) => c.owner === "Priya Sharma");
    } else if (filterView === "unassigned") {
      result = result.filter((c) => c.owner === "Unassigned");
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
        case "priority":
          return dir * (priorityOrder[a.priority] - priorityOrder[b.priority]);
        case "slaStatus":
          return dir * (slaOrder[a.slaStatus] - slaOrder[b.slaStatus]);
        case "createdDate":
        default:
          return dir * a.createdDate.localeCompare(b.createdDate);
      }
    });

    return result;
  }, [filterView, searchQuery, sortField, sortDir]);

  const counts = React.useMemo(() => {
    return {
      all: mockCases.length,
      my: mockCases.filter((c) => c.owner === "Priya Sharma").length,
      unassigned: mockCases.filter((c) => c.owner === "Unassigned").length,
    };
  }, []);

  const SortHeader = ({
    field,
    children,
    className,
  }: {
    field: SortField;
    children: React.ReactNode;
    className?: string;
  }) => (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => handleSort(field)}
        className="inline-flex items-center gap-1 font-medium hover:text-gray-900 dark:hover:text-gray-100"
      >
        {children}
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
    <div className="min-w-0 flex-1 overflow-y-auto">
    <div className="mx-auto max-w-[1600px] p-density-xl">
      {/* Page header */}
      <div className="mb-density-xl flex items-center justify-between">
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
        <Button size="md" className="gap-1.5">
          <Icon name="add" size="var(--tally-icon-size-sm)" className="mr-1" />
          New Case
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-density-lg flex flex-wrap items-center gap-density-md">
        {/* View toggle */}
        <div className="inline-flex rounded-density-md border border-border bg-white p-0.5 dark:border-gray-700 dark:bg-gray-900">
          {(["all", "my", "unassigned"] as FilterView[]).map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => setFilterView(view)}
              className={cn(
                "rounded-md px-3 py-1.5 font-medium transition-colors",
                filterView === view
                  ? "bg-[#2C365D] text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              )}
              style={{ fontSize: "var(--tally-font-size-xs)" }}
            >
              {view === "all" && `All Cases (${counts.all})`}
              {view === "my" && `My Cases (${counts.my})`}
              {view === "unassigned" && `Unassigned (${counts.unassigned})`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1">
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

      {/* Table */}
      <div className="overflow-hidden rounded-density-md border border-border bg-white dark:border-gray-700 dark:bg-gray-900">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <SortHeader field="caseNumber">Case #</SortHeader>
              <TableHead>Account</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <SortHeader field="priority">Priority</SortHeader>
              <SortHeader field="slaStatus">SLA</SortHeader>
              <TableHead>Owner</TableHead>
              <SortHeader field="createdDate">Created</SortHeader>
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
          Showing {filtered.length} of {mockCases.length} cases
        </span>
        <div className="flex items-center gap-density-lg">
          <span className="flex items-center gap-density-xs">
            <span className="inline-block h-2 w-2 rounded-full bg-[#C40000]" />
            {mockCases.filter((c) => c.slaStatus === "Breached").length} breached
          </span>
          <span className="flex items-center gap-density-xs">
            <span className="inline-block h-2 w-2 rounded-full bg-[#C53B00]" />
            {mockCases.filter((c) => c.slaStatus === "At Risk").length} at risk
          </span>
        </div>
      </div>
    </div>
    </div>
  );
}

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
