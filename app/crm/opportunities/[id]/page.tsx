"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/Card/Card";
import Badge from "@/components/Badge/Badge";
import Button from "@/components/Button/Button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import {
  OPPORTUNITIES,
  OPPORTUNITY_DETAILS,
  type OpportunityDetail,
  type OpportunityRecord,
} from "@/lib/mock-data/colleague-opportunities";

function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${Math.round(value / 1_000)}k`;
  }
  return `$${value}`;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// Badge variant by status
const STATUS_BADGE_VARIANT: Record<
  string,
  "warning" | "info" | "success" | "error" | "outline"
> = {
  Lead: "warning",
  Open: "info",
  Won: "success",
  Lost: "error",
  Deferred: "outline",
};

// Activity icon wrapper classes by type
const ACTIVITY_ICON_CLASSES: Record<string, string> = {
  call: "bg-[#2C365D]/10 text-[#2C365D] dark:bg-[#7c8cb8]/20 dark:text-[#7c8cb8]",
  email: "bg-blue-50 text-[#0074C4] dark:bg-blue-950/30",
  meeting: "bg-green-50 text-[#008000] dark:bg-green-950/30",
  note: "bg-purple-50 text-[#8B5CF6] dark:bg-purple-950/30",
};

// Mock data for detail page sections (not in colleague data)
const MOCK_STAGE_HISTORY = [
  { stage: "Initial", date: "2025-01-15", note: "Opportunity created" },
  {
    stage: "Qualification",
    date: "2025-02-01",
    note: "Discovery call completed",
  },
  { stage: "Proposal", date: "2025-02-15", note: "Proposal sent" },
  { stage: "Contract", date: "2025-03-01", note: "Contract in review" },
];

const MOCK_ACTIVITIES = [
  {
    type: "call" as const,
    text: "Follow-up call with procurement",
    time: "2 hours ago",
  },
  {
    type: "email" as const,
    text: "Sent contract draft to legal",
    time: "1 day ago",
  },
  {
    type: "meeting" as const,
    text: "Discovery meeting with Sarah Mitchell",
    time: "3 days ago",
  },
  {
    type: "note" as const,
    text: "Updated pricing based on volume discount",
    time: "5 days ago",
  },
];

const MOCK_CONTRACTS = [
  { title: "Master Service Agreement v2.pdf", meta: "Uploaded Mar 1, 2025" },
  { title: "Pricing Schedule.xlsx", meta: "Uploaded Feb 28, 2025" },
];

function getDetailForOpp(
  opportunityId: string
): OpportunityDetail & { accountCreationBlocked?: boolean } {
  const stored = OPPORTUNITY_DETAILS[opportunityId];
  if (stored) return stored;

  const fromList = OPPORTUNITIES.find((o) => o.id === opportunityId);
  if (fromList) {
    const statusMap: Record<
      OpportunityRecord["status"],
      OpportunityDetail["status"]
    > = {
      lead: "Lead",
      open: "Open",
      won: "Won",
      lost: "Lost",
      deferred: "Deferred",
    };
    return {
      id: fromList.id,
      name: fromList.name,
      owner: fromList.owner,
      status: statusMap[fromList.status],
      stage: fromList.stage,
      value: fromList.value,
      startDate: fromList.startDate,
      contractsSigned: "No",
      accountCreationBlocked: true,
    };
  }

  // Fallback to OPP-2025-0034
  return (
    OPPORTUNITY_DETAILS["OPP-2025-0034"] ?? {
      id: "OPP-2025-0034",
      name: "Veolia Energy - Multi-site rollout",
      owner: "Sarah Mitchell",
      status: "Open",
      stage: "Qualification",
      value: 1200000,
      startDate: "2025-03-01",
      contractsSigned: "No",
      accountCreationBlocked: true,
    }
  );
}

export default function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: opportunityId } = React.use(params);
  const detail = getDetailForOpp(opportunityId);
  const badgeVariant =
    STATUS_BADGE_VARIANT[detail.status] ?? "info";

  return (
    <div className="min-w-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[1600px] p-density-xl">
        {/* Page header with back link */}
        <div className="mb-density-xl flex items-center justify-between">
          <div className="flex items-center gap-density-md">
            <Link
              href="/crm/opportunities"
              className="text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100"
            >
              <Icon
                name="arrow_back"
                size="var(--tally-icon-size-lg)"
              />
            </Link>
            <div>
              <div className="flex items-center gap-density-sm">
                <h1
                  className="font-bold text-gray-900 dark:text-gray-100"
                  style={{
                    fontSize: "var(--tally-font-size-3xl)",
                    lineHeight: "var(--tally-line-height-tight)",
                  }}
                >
                  {detail.name}
                </h1>
                <Badge variant={badgeVariant}>{detail.status}</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-density-sm">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
            >
              <Icon
                name="description"
                size="var(--tally-icon-size-md)"
              />
              Generate Contract
            </Button>
            <Button size="sm" className="gap-1.5">
              <Icon
                name="swap_horiz"
                size="var(--tally-icon-size-md)"
              />
              Change Stage
            </Button>
          </div>
        </div>

        {/* Summary card */}
        <Card className="mb-density-lg shadow-none">
          <CardContent className="p-density-xl">
            <div className="grid grid-cols-4 gap-density-lg">
              <div>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "var(--tally-font-size-xs)" }}
                >
                  Stage
                </p>
                <p
                  className="mt-density-xs font-semibold text-gray-900 dark:text-gray-100"
                  style={{ fontSize: "var(--tally-font-size-sm)" }}
                >
                  {detail.stage}
                </p>
              </div>
              <div>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "var(--tally-font-size-xs)" }}
                >
                  Expected Annual Value
                </p>
                <p
                  className="mt-density-xs font-semibold text-gray-900 dark:text-gray-100"
                  style={{ fontSize: "var(--tally-font-size-sm)" }}
                >
                  {formatCurrency(detail.value)}
                </p>
              </div>
              <div>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "var(--tally-font-size-xs)" }}
                >
                  Expected Start
                </p>
                <p
                  className="mt-density-xs font-semibold text-gray-900 dark:text-gray-100"
                  style={{ fontSize: "var(--tally-font-size-sm)" }}
                >
                  {formatDate(detail.startDate)}
                </p>
              </div>
              <div>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "var(--tally-font-size-xs)" }}
                >
                  Contracts Signed
                </p>
                <p
                  className="mt-density-xs font-semibold text-gray-900 dark:text-gray-100"
                  style={{ fontSize: "var(--tally-font-size-sm)" }}
                >
                  {detail.contractsSigned}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {detail.accountCreationBlocked && (
          <div className="mb-density-lg flex items-center gap-density-sm rounded-density-md border border-amber-200 bg-amber-50 px-density-lg py-density-md dark:border-amber-900 dark:bg-amber-950/30">
            <Icon
              name="warning"
              size="var(--tally-icon-size-md)"
              className="text-amber-600 dark:text-amber-400"
            />
            <p
              style={{ fontSize: "var(--tally-font-size-sm)" }}
              className="text-amber-800 dark:text-amber-300"
            >
              Account creation is blocked until contracts are
              confirmed signed.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-density-lg lg:grid-cols-[2fr_1fr]">
          {/* Left column */}
          <div>
            {/* Stage History */}
            <Card className="mb-density-lg shadow-none">
              <CardHeader>
                <CardTitle
                  style={{
                    fontSize: "var(--tally-font-size-sm)",
                  }}
                  className="uppercase tracking-wider"
                >
                  Stage History
                </CardTitle>
                <CardDescription
                  style={{ fontSize: "var(--tally-font-size-xs)" }}
                >
                  Progress through pipeline
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col gap-density-md">
                  {MOCK_STAGE_HISTORY.map((item) => (
                    <div
                      key={item.stage}
                      className="rounded-density-md border border-border p-density-md dark:border-gray-700"
                    >
                      <div
                        className="font-semibold text-gray-900 dark:text-gray-100"
                        style={{
                          fontSize: "var(--tally-font-size-sm)",
                        }}
                      >
                        {item.stage}
                      </div>
                      <div
                        className="mt-density-xs text-muted-foreground"
                        style={{
                          fontSize: "var(--tally-font-size-xs)",
                        }}
                      >
                        {item.note}
                      </div>
                      <div
                        className="mt-density-xs text-muted-foreground"
                        style={{
                          fontSize: "var(--tally-font-size-xs)",
                        }}
                      >
                        {formatDate(item.date)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activities */}
            <Card className="mb-density-lg shadow-none">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle
                      style={{
                        fontSize: "var(--tally-font-size-sm)",
                      }}
                      className="uppercase tracking-wider"
                    >
                      Activities
                    </CardTitle>
                    <CardDescription
                      style={{
                        fontSize: "var(--tally-font-size-xs)",
                      }}
                    >
                      Recent interactions
                    </CardDescription>
                  </div>
                  <Link
                    href="#"
                    className="font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]"
                    style={{
                      fontSize: "var(--tally-font-size-sm)",
                    }}
                  >
                    View all
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col">
                  {MOCK_ACTIVITIES.map((act, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-density-md py-density-md"
                    >
                      <div
                        className={cn(
                          "flex shrink-0 items-center justify-center rounded-density-sm p-density-xs",
                          ACTIVITY_ICON_CLASSES[act.type] ??
                            ACTIVITY_ICON_CLASSES.note
                        )}
                      >
                        <Icon
                          name={
                            act.type === "call"
                              ? "call"
                              : act.type === "email"
                                ? "mail"
                                : act.type === "meeting"
                                  ? "videocam"
                                  : "note"
                          }
                          size="var(--tally-icon-size-md)"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="font-medium text-gray-900 dark:text-gray-100"
                          style={{
                            fontSize: "var(--tally-font-size-sm)",
                          }}
                        >
                          {act.text}
                        </p>
                        <p
                          className="mt-density-xs text-muted-foreground"
                          style={{
                            fontSize: "var(--tally-font-size-xs)",
                          }}
                        >
                          {act.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contracts & Documents */}
            <Card className="mb-density-lg shadow-none">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle
                      style={{
                        fontSize: "var(--tally-font-size-sm)",
                      }}
                      className="uppercase tracking-wider"
                    >
                      Contracts &amp; Documents
                    </CardTitle>
                    <CardDescription
                      style={{
                        fontSize: "var(--tally-font-size-xs)",
                      }}
                    >
                      Attached files
                    </CardDescription>
                  </div>
                  <Link
                    href="#"
                    className="font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]"
                    style={{
                      fontSize: "var(--tally-font-size-sm)",
                    }}
                  >
                    Add document
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col">
                  {MOCK_CONTRACTS.map((doc) => (
                    <div
                      key={doc.title}
                      className="flex items-center justify-between border-b border-border py-density-sm last:border-b-0 dark:border-gray-700"
                    >
                      <div>
                        <div
                          className="flex items-center gap-density-sm font-medium text-gray-900 dark:text-gray-100"
                          style={{
                            fontSize: "var(--tally-font-size-sm)",
                          }}
                        >
                          <Icon
                            name="picture_as_pdf"
                            size="var(--tally-icon-size-md)"
                            className="text-muted-foreground"
                          />
                          {doc.title}
                        </div>
                        <p
                          className="mt-density-xs text-muted-foreground"
                          style={{
                            fontSize: "var(--tally-font-size-xs)",
                          }}
                        >
                          {doc.meta}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        aria-label="Download"
                      >
                        <Icon
                          name="download"
                          size="var(--tally-icon-size-md)"
                        />
                      </Button>
                    </div>
                  ))}
                  {MOCK_CONTRACTS.length === 0 && (
                    <p
                      className="py-density-md text-muted-foreground"
                      style={{
                        fontSize: "var(--tally-font-size-xs)",
                      }}
                    >
                      No documents attached.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div>
            {/* Account Creation */}
            <Card className="mb-density-lg shadow-none">
              <CardHeader>
                <CardTitle
                  style={{
                    fontSize: "var(--tally-font-size-sm)",
                  }}
                  className="uppercase tracking-wider"
                >
                  Account Creation
                </CardTitle>
                <CardDescription
                  style={{
                    fontSize: "var(--tally-font-size-xs)",
                  }}
                >
                  {detail.accountCreationBlocked
                    ? "Blocked until contracts signed"
                    : "Ready to create account"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  fullWidth
                  disabled={!!detail.accountCreationBlocked}
                  className="gap-density-sm"
                >
                  <Icon
                    name="person_add"
                    size="var(--tally-icon-size-md)"
                  />
                  Create Account
                </Button>
              </CardContent>
            </Card>

            {/* Opportunity Details */}
            <Card className="mb-density-lg shadow-none">
              <CardHeader>
                <CardTitle
                  style={{
                    fontSize: "var(--tally-font-size-sm)",
                  }}
                  className="uppercase tracking-wider"
                >
                  Opportunity Details
                </CardTitle>
                <CardDescription
                  style={{
                    fontSize: "var(--tally-font-size-xs)",
                  }}
                >
                  Key information
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between border-b border-border py-density-sm last:border-b-0 dark:border-gray-700">
                    <span
                      className="text-muted-foreground"
                      style={{
                        fontSize: "var(--tally-font-size-sm)",
                      }}
                    >
                      Opportunity ID
                    </span>
                    <span
                      className="font-medium text-gray-900 dark:text-gray-100"
                      style={{
                        fontSize: "var(--tally-font-size-sm)",
                      }}
                    >
                      {detail.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border py-density-sm last:border-b-0 dark:border-gray-700">
                    <span
                      className="text-muted-foreground"
                      style={{
                        fontSize: "var(--tally-font-size-sm)",
                      }}
                    >
                      Owner
                    </span>
                    <span
                      className="font-medium text-gray-900 dark:text-gray-100"
                      style={{
                        fontSize: "var(--tally-font-size-sm)",
                      }}
                    >
                      {detail.owner}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border py-density-sm last:border-b-0 dark:border-gray-700">
                    <span
                      className="text-muted-foreground"
                      style={{
                        fontSize: "var(--tally-font-size-sm)",
                      }}
                    >
                      Status
                    </span>
                    <span
                      className="font-medium text-gray-900 dark:text-gray-100"
                      style={{
                        fontSize: "var(--tally-font-size-sm)",
                      }}
                    >
                      {detail.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border py-density-sm last:border-b-0 dark:border-gray-700">
                    <span
                      className="text-muted-foreground"
                      style={{
                        fontSize: "var(--tally-font-size-sm)",
                      }}
                    >
                      Stage
                    </span>
                    <span
                      className="font-medium text-gray-900 dark:text-gray-100"
                      style={{
                        fontSize: "var(--tally-font-size-sm)",
                      }}
                    >
                      {detail.stage}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border py-density-sm last:border-b-0 dark:border-gray-700">
                    <span
                      className="text-muted-foreground"
                      style={{
                        fontSize: "var(--tally-font-size-sm)",
                      }}
                    >
                      Value
                    </span>
                    <span
                      className="font-medium text-gray-900 dark:text-gray-100"
                      style={{
                        fontSize: "var(--tally-font-size-sm)",
                      }}
                    >
                      {formatCurrency(detail.value)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border py-density-sm last:border-b-0 dark:border-gray-700">
                    <span
                      className="text-muted-foreground"
                      style={{
                        fontSize: "var(--tally-font-size-sm)",
                      }}
                    >
                      Expected Start
                    </span>
                    <span
                      className="font-medium text-gray-900 dark:text-gray-100"
                      style={{
                        fontSize: "var(--tally-font-size-sm)",
                      }}
                    >
                      {formatDate(detail.startDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border py-density-sm last:border-b-0 dark:border-gray-700">
                    <span
                      className="text-muted-foreground"
                      style={{
                        fontSize: "var(--tally-font-size-sm)",
                      }}
                    >
                      Contracts Signed
                    </span>
                    <span
                      className="font-medium text-gray-900 dark:text-gray-100"
                      style={{
                        fontSize: "var(--tally-font-size-sm)",
                      }}
                    >
                      {detail.contractsSigned}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance & Notes */}
            <Card className="mb-density-lg shadow-none">
              <CardHeader>
                <CardTitle
                  style={{
                    fontSize: "var(--tally-font-size-sm)",
                  }}
                  className="uppercase tracking-wider"
                >
                  Compliance &amp; Notes
                </CardTitle>
                <CardDescription
                  style={{
                    fontSize: "var(--tally-font-size-xs)",
                  }}
                >
                  Internal notes
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p
                  className="leading-relaxed text-muted-foreground"
                  style={{
                    fontSize: "var(--tally-font-size-xs)",
                    lineHeight: "var(--tally-line-height-relaxed)",
                  }}
                >
                  Awaiting legal review of contract terms.
                  Procurement team approved budget allocation.
                  Follow-up scheduled for next week.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-density-md gap-1.5"
                >
                  <Icon
                    name="edit"
                    size="var(--tally-icon-size-sm)"
                  />
                  Add Note
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
