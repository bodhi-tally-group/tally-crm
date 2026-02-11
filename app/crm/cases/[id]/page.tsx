"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Tabs/Tabs";
import Badge from "@/components/Badge/Badge";
import Button from "@/components/Button/Button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { getCaseById, mockCases } from "@/lib/mock-data/cases";
import { getAccountById } from "@/lib/mock-data/accounts";
import AccountContextPanel from "@/components/crm/AccountContextPanel";
import SLAIndicator from "@/components/crm/SLAIndicator";
import StatusProgressBar from "@/components/crm/StatusProgressBar";
import CommunicationTimeline from "@/components/crm/CommunicationTimeline";
import ActivityTimeline from "@/components/crm/ActivityTimeline";
import DocumentAttachments from "@/components/crm/DocumentAttachments";
import type { CasePriority, Contact } from "@/types/crm";

const priorityVariant: Record<CasePriority, "error" | "warning" | "info" | "outline"> = {
  Critical: "error",
  High: "warning",
  Medium: "info",
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
      <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm text-gray-900 dark:text-gray-100">
        {value || "—"}
      </span>
    </div>
  );
}

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.id as string;

  const caseItem = getCaseById(caseId) ?? mockCases[0];
  const account = getAccountById(caseItem.accountId);
  const [activeTab, setActiveTab] = React.useState("request");

  if (!account) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Account not found.</p>
      </div>
    );
  }

  return (
    <>
      {/* Account Context Panel — persistent left side */}
      <AccountContextPanel account={account} />

      {/* Main Content */}
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1400px] p-density-xl">
          {/* Header */}
          <div className="mb-density-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {caseItem.caseNumber}
                  </h1>
                  <Badge
                    variant={priorityVariant[caseItem.priority]}
                    className="text-[10px]"
                  >
                    {caseItem.priority}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {caseItem.type}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {caseItem.subType} · {caseItem.accountName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Icon name="edit" size={16} />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Icon name="person_add" size={16} />
                  Assign
                </Button>
              </div>
            </div>

            {/* Status bar and SLA */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <StatusProgressBar
                currentStatus={caseItem.status}
                className="flex-1"
              />
              <div className="flex items-center gap-4 border-l border-border pl-4 dark:border-gray-700">
                <div className="text-right">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    SLA Deadline
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
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
            <TabsList className="mb-4 h-10 gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
              <TabsTrigger
                value="request"
                className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100"
              >
                Request Information
              </TabsTrigger>
              <TabsTrigger
                value="communications"
                className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100"
              >
                Communications ({caseItem.communications.length})
              </TabsTrigger>
              <TabsTrigger
                value="related"
                className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100"
              >
                Related
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100"
              >
                History ({caseItem.activities.length})
              </TabsTrigger>
            </TabsList>

            {/* Request Information Tab */}
            <TabsContent value="request" className="mt-0">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Case details */}
                <div className="rounded-lg border border-border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                  <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-gray-100">
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
                          className="text-[10px]"
                        >
                          {caseItem.priority}
                        </Badge>
                      }
                    />
                    <DataField label="Status" value={caseItem.status} />
                    <DataField
                      label="SLA Status"
                      value={
                        <SLAIndicator status={caseItem.slaStatus} />
                      }
                    />
                    <DataField label="Created" value={caseItem.createdDate} />
                    <DataField label="Last Updated" value={caseItem.updatedDate} />
                  </div>
                </div>

                {/* Assignment */}
                <div className="rounded-lg border border-border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                  <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-gray-100">
                    Assignment
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <DataField label="Owner" value={caseItem.owner} />
                    <DataField label="Team" value={caseItem.team} />
                    <DataField
                      label="SLA Deadline"
                      value={caseItem.slaDeadline}
                    />
                    <DataField
                      label="Time Remaining"
                      value={
                        <span
                          className={cn(
                            "font-medium",
                            caseItem.slaStatus === "Breached" && "text-[#C40000]",
                            caseItem.slaStatus === "At Risk" && "text-[#C53B00]"
                          )}
                        >
                          {caseItem.slaTimeRemaining}
                        </span>
                      }
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-lg border border-border bg-white p-4 lg:col-span-2 dark:border-gray-700 dark:bg-gray-900">
                  <h3 className="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">
                    Description
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {caseItem.description}
                  </p>
                </div>

                {/* Resolution */}
                {caseItem.resolution && (
                  <div className="rounded-lg border border-[#008000]/20 bg-[#008000]/5 p-4 lg:col-span-2 dark:border-green-800/30 dark:bg-green-950/20">
                    <h3 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-[#008000]">
                      <Icon name="task_alt" size={16} />
                      Resolution
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {caseItem.resolution}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Communications Tab */}
            <TabsContent value="communications" className="mt-0">
              <div className="rounded-lg border border-border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                <CommunicationTimeline
                  communications={caseItem.communications}
                />
                {caseItem.communications.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No communications recorded for this case.
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Related Tab */}
            <TabsContent value="related" className="mt-0">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Attachments */}
                <div className="rounded-lg border border-border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                  <DocumentAttachments attachments={caseItem.attachments} />
                </div>

                {/* Contacts */}
                <div className="rounded-lg border border-border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                  <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                    Contacts ({account.contacts.length})
                  </h3>
                  <div className="divide-y divide-border dark:divide-gray-700">
                    {account.contacts.map((contact: Contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center gap-3 py-2.5"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                          <Icon name="person" size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {contact.name}
                            </p>
                            {contact.isPrimary && (
                              <Badge variant="default" className="text-[9px] px-1.5 py-0">
                                Primary
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            {contact.role} · {contact.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related cases */}
                <div className="rounded-lg border border-border bg-white p-4 lg:col-span-2 dark:border-gray-700 dark:bg-gray-900">
                  <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                    Related Cases ({caseItem.relatedCases.length})
                  </h3>
                  {caseItem.relatedCases.length > 0 ? (
                    <div className="space-y-2">
                      {caseItem.relatedCases.map((rc) => (
                        <div
                          key={rc}
                          className="flex items-center gap-2 rounded border border-border px-3 py-2 dark:border-gray-700"
                        >
                          <Icon
                            name="link"
                            size={16}
                            className="text-gray-400"
                          />
                          <span className="text-sm font-medium text-[#2C365D] dark:text-[#7c8cb8]">
                            {rc}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      No related cases.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="mt-0">
              <div className="rounded-lg border border-border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-gray-100">
                  Activity History
                </h3>
                <ActivityTimeline activities={caseItem.activities} />
                {caseItem.activities.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No activity recorded for this case.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
