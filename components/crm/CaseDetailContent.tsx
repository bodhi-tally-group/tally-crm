"use client";

import React from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Tabs/Tabs";
import Badge from "@/components/Badge/Badge";
import Button from "@/components/Button/Button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import SLAIndicator from "@/components/crm/SLAIndicator";
import StatusProgressBar from "@/components/crm/StatusProgressBar";
import CommunicationTimeline from "@/components/crm/CommunicationTimeline";
import ActivityTimeline from "@/components/crm/ActivityTimeline";
import DocumentAttachments from "@/components/crm/DocumentAttachments";
import { getCaseByCaseNumber } from "@/lib/mock-data/cases";
import { getAccountById } from "@/lib/mock-data/accounts";
import type { Account, CaseItem, CasePriority, CaseStatus, Contact } from "@/types/crm";

const CASE_STATUSES: CaseStatus[] = ["New", "In Progress", "Pending", "Resolved", "Closed"];

const priorityVariant: Record<CasePriority, "error" | "warning" | "info" | "outline" | "yellow"> = {
  Critical: "error",
  High: "warning",
  Medium: "yellow",
  Low: "outline",
};

function DataField({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span
        className="font-medium uppercase tracking-wide text-muted-foreground"
        style={{ fontSize: "var(--tally-font-size-xs)" }}
      >
        {label}
      </span>
      <span
        className="text-gray-900 dark:text-gray-100"
        style={{ fontSize: "var(--tally-font-size-sm)" }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

interface CaseDetailContentProps {
  caseItem: CaseItem;
  account: Account;
  showBreadcrumbs?: boolean;
  /** When true, show an "Open in full page" control next to Assign (e.g. in tab view) */
  showOpenInFullPage?: boolean;
  /** When set, used for Related tab and allows linking (from overrides store) */
  relatedCaseNumbers?: string[];
  /** Callback to open the link-case modal */
  onOpenLinkModal?: () => void;
  /** When set (e.g. DB mode), updates are persisted via API */
  onUpdateCase?: (payload: Partial<CaseItem>) => void | Promise<void>;
  /** When set (e.g. DB mode), show Delete button and call this on confirm */
  onDeleteCase?: () => void | Promise<void>;
  /** When set (e.g. DB mode), resolve related case numbers to CaseItem for links */
  relatedCasesMap?: Map<string, CaseItem>;
}

export default function CaseDetailContent({
  caseItem,
  account,
  showBreadcrumbs = true,
  showOpenInFullPage = false,
  relatedCaseNumbers: relatedCaseNumbersProp,
  onOpenLinkModal,
  onUpdateCase,
  onDeleteCase,
  relatedCasesMap,
}: CaseDetailContentProps) {
  const resolveCase = (caseNum: string) => relatedCasesMap?.get(caseNum) ?? getCaseByCaseNumber(caseNum);
  const relatedCaseNumbers = relatedCaseNumbersProp ?? caseItem.relatedCases;
  const [activeTab, setActiveTab] = React.useState("request");
  const [statusEditOpen, setStatusEditOpen] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);

  return (
    <div className="min-w-0 w-full p-density-xl">
      <div className="mx-auto w-full min-w-0 max-w-[1400px]">
      {showBreadcrumbs && (
        <nav
          className="mb-density-md flex items-center gap-1.5 text-muted-foreground"
          style={{ fontSize: "var(--tally-font-size-sm)" }}
        >
          <Link href="/crm/cases" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            Cases
          </Link>
          <Icon name="chevron_right" size={14} />
          <span
            className="font-medium text-gray-900 dark:text-gray-100"
            style={{ fontSize: "var(--tally-font-size-sm)" }}
          >
            {caseItem.caseNumber}
          </span>
        </nav>
      )}

      {/* Header */}
      <div className="mb-density-xl">
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1
                className="font-bold text-gray-900 dark:text-gray-100"
                style={{
                  fontSize: "var(--tally-font-size-xl)",
                  lineHeight: "var(--tally-line-height-tight)",
                }}
              >
                {caseItem.caseNumber}
              </h1>
              <Badge
                variant={priorityVariant[caseItem.priority]}
                style={{ fontSize: "var(--tally-font-size-xs)" }}
              >
                {caseItem.priority}
              </Badge>
              <Badge
                variant="outline"
                style={{ fontSize: "var(--tally-font-size-xs)" }}
              >
                {caseItem.type}
              </Badge>
            </div>
            <p
              className="mt-1 text-muted-foreground"
              style={{ fontSize: "var(--tally-font-size-sm)" }}
            >
              {caseItem.subType} · {caseItem.accountName}
            </p>
          </div>
          <div className="flex shrink-0 items-start gap-2">
            {onUpdateCase && (
              <Button
                variant="outline"
                size="md"
                className="gap-1.5"
                disabled={updating}
                onClick={() => setStatusEditOpen((v) => !v)}
              >
                <Icon name="edit" size="var(--tally-icon-size-sm)" />
                Edit
              </Button>
            )}
            <Button variant="outline" size="md" className="gap-1.5">
              <Icon name="person_add" size="var(--tally-icon-size-sm)" />
              Assign
            </Button>
            {onDeleteCase && (
              <Button
                variant="outline"
                size="md"
                className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                disabled={updating}
                onClick={() => onDeleteCase()}
              >
                <Icon name="delete" size="var(--tally-icon-size-sm)" />
                Delete
              </Button>
            )}
            {showOpenInFullPage && (
              <Link
                href={`/crm/cases/${caseItem.id}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                aria-label="Open case in full page"
                title="Open in full page"
              >
                <Icon name="open_in_new" size={20} />
              </Link>
            )}
          </div>
        </div>

        {/* Inline status edit (when onUpdateCase and statusEditOpen) */}
        {onUpdateCase && statusEditOpen && (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
            <select
              id="case-status-edit"
              defaultValue={caseItem.status}
              className="rounded-md border border-border bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              onChange={(e) => {
                const newStatus = e.target.value as CaseStatus;
                setUpdating(true);
                Promise.resolve(onUpdateCase({ status: newStatus })).finally(() => {
                  setUpdating(false);
                  setStatusEditOpen(false);
                });
              }}
            >
              {CASE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm" onClick={() => setStatusEditOpen(false)}>
              Cancel
            </Button>
          </div>
        )}

        {/* Status bar and SLA */}
        <div className="mt-4 flex min-w-0 flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <StatusProgressBar
            currentStatus={caseItem.status}
            className="min-w-0 flex-1"
          />
          <div className="flex shrink-0 items-center gap-4 border-border dark:border-gray-700 sm:border-l sm:pl-4">
            <div className="text-right">
              <p
                className="font-medium uppercase tracking-wide text-muted-foreground"
                style={{ fontSize: "var(--tally-font-size-xs)" }}
              >
                SLA Deadline
              </p>
              <p
                className="font-medium text-gray-900 dark:text-gray-100"
                style={{ fontSize: "var(--tally-font-size-sm)" }}
              >
                {caseItem.slaDeadline}
              </p>
            </div>
            <SLAIndicator
              status={caseItem.slaStatus}
              timeRemaining={caseItem.slaTimeRemaining}
              size="md"
            />
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Small viewport: dropdown */}
        <div className="mb-4 sm:hidden">
          <div className="relative">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-border bg-gray-100 py-2.5 pl-3 pr-9 font-medium text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              style={{ fontSize: "var(--tally-font-size-sm)" }}
            >
              <option value="request">Request Information</option>
              <option value="communications">
                Communications ({caseItem.communications.length})
              </option>
              <option value="related">Related</option>
              <option value="history">History ({caseItem.activities.length})</option>
            </select>
            <Icon
              name="expand_more"
              size={20}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            />
          </div>
        </div>

        {/* Larger viewport: horizontal tabs */}
        <TabsList className="mb-4 hidden h-10 gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800 sm:inline-flex">
          <TabsTrigger
            value="request"
            className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100"
            style={{ fontSize: "var(--tally-font-size-sm)" }}
          >
            Request Information
          </TabsTrigger>
          <TabsTrigger
            value="communications"
            className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100"
            style={{ fontSize: "var(--tally-font-size-sm)" }}
          >
            Communications ({caseItem.communications.length})
          </TabsTrigger>
          <TabsTrigger
            value="related"
            className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100"
            style={{ fontSize: "var(--tally-font-size-sm)" }}
          >
            Related
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100"
            style={{ fontSize: "var(--tally-font-size-sm)" }}
          >
            History ({caseItem.activities.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="request" className="mt-0 w-full">
          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <h3
                className="mb-4 font-bold text-gray-900 dark:text-gray-100"
                style={{ fontSize: "var(--tally-font-size-sm)" }}
              >
                Case Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <DataField label="Case Number" value={caseItem.caseNumber} />
                <DataField label="Type" value={caseItem.type} />
                <DataField label="Sub-Type" value={caseItem.subType} />
                <DataField
                  label="Priority"
                  value={
                    <Badge
                      variant={priorityVariant[caseItem.priority]}
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      {caseItem.priority}
                    </Badge>
                  }
                />
                <DataField label="Status" value={caseItem.status} />
                <DataField label="SLA Status" value={<SLAIndicator status={caseItem.slaStatus} />} />
                <DataField label="Created" value={caseItem.createdDate} />
                <DataField label="Last Updated" value={caseItem.updatedDate} />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <h3
                className="mb-4 font-bold text-gray-900 dark:text-gray-100"
                style={{ fontSize: "var(--tally-font-size-sm)" }}
              >
                Assignment
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <DataField label="Owner" value={caseItem.owner} />
                <DataField label="Team" value={caseItem.team} />
                <DataField label="SLA Deadline" value={caseItem.slaDeadline} />
                <DataField
                  label="Time Remaining"
                  value={
                    <span
                      className={cn(
                        "font-medium",
                        caseItem.slaStatus === "Breached" && "text-[#C40000]",
                        caseItem.slaStatus === "At Risk" && "text-[#C53B00]"
                      )}
                      style={{ fontSize: "var(--tally-font-size-sm)" }}
                    >
                      {caseItem.slaTimeRemaining}
                    </span>
                  }
                />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-white p-4 lg:col-span-2 dark:border-gray-700 dark:bg-gray-900">
              <h3
                className="mb-3 font-bold text-gray-900 dark:text-gray-100"
                style={{ fontSize: "var(--tally-font-size-sm)" }}
              >
                Description
              </h3>
              <p
                className="leading-relaxed text-gray-700 dark:text-gray-300"
                style={{
                  fontSize: "var(--tally-font-size-sm)",
                  lineHeight: "var(--tally-line-height-relaxed)",
                }}
              >
                {caseItem.description}
              </p>
            </div>
            {caseItem.resolution && (
              <div className="rounded-lg border border-[#008000]/20 bg-[#008000]/5 p-4 lg:col-span-2 dark:border-green-800/30 dark:bg-green-950/20">
                <h3
                  className="mb-3 flex items-center gap-1.5 font-bold text-[#008000]"
                  style={{ fontSize: "var(--tally-font-size-sm)" }}
                >
                  <Icon name="task_alt" size={16} />
                  Resolution
                </h3>
                <p
                  className="leading-relaxed text-gray-700 dark:text-gray-300"
                  style={{
                    fontSize: "var(--tally-font-size-sm)",
                    lineHeight: "var(--tally-line-height-relaxed)",
                  }}
                >
                  {caseItem.resolution}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="communications" className="mt-0 w-full">
          <div className="w-full rounded-lg border border-border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <CommunicationTimeline communications={caseItem.communications} />
            {caseItem.communications.length === 0 && (
              <p
                className="py-8 text-center text-muted-foreground"
                style={{ fontSize: "var(--tally-font-size-sm)" }}
              >
                No communications recorded for this case.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="related" className="mt-0 w-full">
          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <DocumentAttachments attachments={caseItem.attachments} />
            </div>
            <div className="rounded-lg border border-border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <h3
                className="mb-3 font-medium text-gray-900 dark:text-gray-100"
                style={{ fontSize: "var(--tally-font-size-sm)" }}
              >
                Contacts ({account.contacts.length})
              </h3>
              <div className="divide-y divide-border dark:divide-gray-700">
                {account.contacts.map((contact: Contact) => (
                  <div key={contact.id} className="flex items-center gap-3 py-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      <Icon name="person" size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className="font-medium text-gray-900 dark:text-gray-100"
                          style={{ fontSize: "var(--tally-font-size-sm)" }}
                        >
                          {contact.name}
                        </p>
                        {contact.isPrimary && (
                          <Badge
                            variant="default"
                            className="px-1.5 py-0"
                            style={{ fontSize: "var(--tally-font-size-xs)" }}
                          >
                            Primary
                          </Badge>
                        )}
                      </div>
                      <p
                        className="text-muted-foreground"
                        style={{ fontSize: "var(--tally-font-size-xs)" }}
                      >
                        {contact.role} · {contact.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-white p-4 lg:col-span-2 dark:border-gray-700 dark:bg-gray-900">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3
                  className="font-medium text-gray-900 dark:text-gray-100"
                  style={{ fontSize: "var(--tally-font-size-sm)" }}
                >
                  Related Cases (
                  {
                    relatedCaseNumbers.filter((caseNum) => {
                      const c = resolveCase(caseNum);
                      return c && getAccountById(c.accountId)?.orgId === account.orgId;
                    }).length
                  }
                  )
                </h3>
                {onOpenLinkModal && (
                  <Button variant="outline" size="sm" className="gap-1" onClick={onOpenLinkModal}>
                    <Icon name="link" size={14} />
                    Link case
                  </Button>
                )}
              </div>
              {(() => {
                const relatedSameOrg = relatedCaseNumbers.filter((caseNum) => {
                  const c = resolveCase(caseNum);
                  return c != null && getAccountById(c.accountId)?.orgId === account.orgId;
                });
                return relatedSameOrg.length > 0 ? (
                  <div className="space-y-2">
                    {relatedSameOrg.map((caseNum) => {
                      const linkedCase = resolveCase(caseNum);
                      if (!linkedCase) return null;
                      return (
                        <Link
                          key={linkedCase.id}
                          href={`/crm/cases/${linkedCase.id}`}
                          className="flex items-center gap-2 rounded border border-border px-3 py-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/60"
                        >
                          <Icon name="link" size={16} className="text-gray-400" />
                          <span
                            className="font-medium text-[#2C365D] dark:text-[#7c8cb8]"
                            style={{ fontSize: "var(--tally-font-size-sm)" }}
                          >
                            {linkedCase.caseNumber}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p
                    className="py-4 text-center text-muted-foreground"
                    style={{ fontSize: "var(--tally-font-size-sm)" }}
                  >
                    {onOpenLinkModal
                      ? "No related cases. Use \"Link case\" to add one from the same organisation."
                      : "No related cases in the same organisation."}
                  </p>
                );
              })()}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0 w-full">
          <div className="w-full rounded-lg border border-border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <h3
              className="mb-4 font-bold text-gray-900 dark:text-gray-100"
              style={{ fontSize: "var(--tally-font-size-sm)" }}
            >
              Activity History
            </h3>
            <ActivityTimeline activities={caseItem.activities} />
            {caseItem.activities.length === 0 && (
              <p
                className="py-8 text-center text-muted-foreground"
                style={{ fontSize: "var(--tally-font-size-sm)" }}
              >
                No activity recorded for this case.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
