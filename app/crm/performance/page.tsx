import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/Card/Card";
import Badge from "@/components/Badge/Badge";
import Button from "@/components/Button/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/Table/Table";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const SLA_TYPES = [
  {
    name: "Enquiry",
    desc: "General customer enquiries",
    responseTarget: "Immediate",
    resolutionTarget: "24h",
    performance: 96,
    performanceClass: "excellent" as const,
  },
  {
    name: "Meter Transfer",
    desc: "Meter transfer requests",
    responseTarget: "4h",
    resolutionTarget: "48h",
    performance: 88,
    performanceClass: "good" as const,
  },
  {
    name: "New Site Roll-in",
    desc: "New site onboarding",
    responseTarget: "24h",
    resolutionTarget: "5 business days",
    performance: 92,
    performanceClass: "excellent" as const,
  },
  {
    name: "Billing Query",
    desc: "Billing and payment queries",
    responseTarget: "4h",
    resolutionTarget: "24h",
    performance: 78,
    performanceClass: "warning" as const,
  },
];

const OVERDUE_ACTIONS = [
  { case: "CASE-2024-0891", type: "Response", owner: "Priya Sharma", overdue: "2h" },
  { case: "CASE-2024-0887", type: "Resolution", owner: "Daniel Cooper", overdue: "1d" },
  { case: "CASE-2024-0882", type: "Response", owner: "Unassigned", overdue: "3h" },
];

const slaBarColor: Record<string, string> = {
  excellent: "#008000",
  good: "#0074C4",
  warning: "#C53B00",
  danger: "#C40000",
};

const slaCardBefore: Record<string, string> = {
  excellent: "before:bg-[#008000]",
  good: "before:bg-[#0074C4]",
  warning: "before:bg-[#C53B00]",
  danger: "before:bg-[#C40000]",
};

const perfValueColor: Record<string, string> = {
  excellent: "text-[#008000]",
  good: "text-[#0074C4]",
  warning: "text-[#C53B00]",
  danger: "text-[#C40000]",
};

export default function PerformancePage() {
  return (
    <div className="min-w-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[1600px] p-density-xl">
        <div className="mb-density-xl flex items-center justify-between">
          <div>
            <h1
              className="font-bold text-gray-900 dark:text-gray-100"
              style={{
                fontSize: "var(--tally-font-size-3xl)",
                lineHeight: "var(--tally-line-height-tight)",
              }}
            >
              Performance &amp; SLA Management
            </h1>
            <p
              className="mt-density-xs text-muted-foreground"
              style={{ fontSize: "var(--tally-font-size-sm)" }}
            >
              Monitor SLA compliance and overdue actions
            </p>
          </div>
          <div className="flex items-center gap-density-md">
            <select
              className="rounded-density-md border border-border bg-white py-1.5 px-3 outline-none focus:border-[#2C365D] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
              style={{ fontSize: "var(--tally-font-size-sm)" }}
            >
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 90 days</option>
            </select>
            <Button size="sm">Export Report</Button>
          </div>
        </div>

        {/* SLA Overview cards */}
        <div className="mb-density-xl grid grid-cols-1 gap-density-lg sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/crm/performance" className="block no-underline">
            <Card
              className={cn(
                "relative overflow-hidden shadow-none transition-all hover:border-[#2C365D] hover:shadow-sm dark:hover:border-[#7c8cb8] before:absolute before:left-0 before:right-0 before:top-0 before:h-[3px] before:content-['']",
                slaCardBefore.excellent
              )}
            >
              <CardContent className="p-density-lg">
                <div
                  className="mb-density-sm font-medium uppercase tracking-wider text-muted-foreground"
                  style={{ fontSize: "var(--tally-font-size-xs)" }}
                >
                  First Response SLA
                </div>
                <div
                  className="mb-density-sm font-bold text-gray-900 dark:text-gray-100"
                  style={{ fontSize: "var(--tally-font-size-4xl)" }}
                >
                  94.2%
                </div>
                <div
                  className="text-muted-foreground"
                  style={{ fontSize: "var(--tally-font-size-xs)" }}
                >
                  Target: <span className="font-semibold">90%</span>
                </div>
                <div className="mt-density-sm flex items-center gap-density-xs font-semibold text-[#008000]">
                  <Icon name="arrow_upward" size="var(--tally-icon-size-sm)" />
                  <span style={{ fontSize: "var(--tally-font-size-xs)" }}>
                    +2.4%
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/crm/performance" className="block no-underline">
            <Card
              className={cn(
                "relative overflow-hidden shadow-none transition-all hover:border-[#2C365D] hover:shadow-sm dark:hover:border-[#7c8cb8] before:absolute before:left-0 before:right-0 before:top-0 before:h-[3px] before:content-['']",
                slaCardBefore.good
              )}
            >
              <CardContent className="p-density-lg">
                <div
                  className="mb-density-sm font-medium uppercase tracking-wider text-muted-foreground"
                  style={{ fontSize: "var(--tally-font-size-xs)" }}
                >
                  Resolution SLA
                </div>
                <div
                  className="mb-density-sm font-bold text-gray-900 dark:text-gray-100"
                  style={{ fontSize: "var(--tally-font-size-4xl)" }}
                >
                  88.5%
                </div>
                <div
                  className="text-muted-foreground"
                  style={{ fontSize: "var(--tally-font-size-xs)" }}
                >
                  Target: <span className="font-semibold">85%</span>
                </div>
                <div className="mt-density-sm flex items-center gap-density-xs font-semibold text-[#008000]">
                  <Icon name="arrow_upward" size="var(--tally-icon-size-sm)" />
                  <span style={{ fontSize: "var(--tally-font-size-xs)" }}>
                    +1.8%
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/crm/performance" className="block no-underline">
            <Card
              className={cn(
                "relative overflow-hidden shadow-none transition-all hover:border-[#2C365D] hover:shadow-sm dark:hover:border-[#7c8cb8] before:absolute before:left-0 before:right-0 before:top-0 before:h-[3px] before:content-['']",
                slaCardBefore.warning
              )}
            >
              <CardContent className="p-density-lg">
                <div
                  className="mb-density-sm font-medium uppercase tracking-wider text-muted-foreground"
                  style={{ fontSize: "var(--tally-font-size-xs)" }}
                >
                  Customer Satisfaction
                </div>
                <div
                  className="mb-density-sm font-bold text-gray-900 dark:text-gray-100"
                  style={{ fontSize: "var(--tally-font-size-4xl)" }}
                >
                  76.3%
                </div>
                <div
                  className="text-muted-foreground"
                  style={{ fontSize: "var(--tally-font-size-xs)" }}
                >
                  Target: <span className="font-semibold">80%</span>
                </div>
                <div className="mt-density-sm flex items-center gap-density-xs font-semibold text-[#C40000]">
                  <Icon name="arrow_downward" size="var(--tally-icon-size-sm)" />
                  <span style={{ fontSize: "var(--tally-font-size-xs)" }}>
                    -1.2%
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/crm/performance" className="block no-underline">
            <Card
              className={cn(
                "relative overflow-hidden shadow-none transition-all hover:border-[#2C365D] hover:shadow-sm dark:hover:border-[#7c8cb8] before:absolute before:left-0 before:right-0 before:top-0 before:h-[3px] before:content-['']",
                slaCardBefore.danger
              )}
            >
              <CardContent className="p-density-lg">
                <div
                  className="mb-density-sm font-medium uppercase tracking-wider text-muted-foreground"
                  style={{ fontSize: "var(--tally-font-size-xs)" }}
                >
                  SLA Breaches
                </div>
                <div
                  className="mb-density-sm font-bold text-gray-900 dark:text-gray-100"
                  style={{ fontSize: "var(--tally-font-size-4xl)" }}
                >
                  3
                </div>
                <div
                  className="text-muted-foreground"
                  style={{ fontSize: "var(--tally-font-size-xs)" }}
                >
                  Response/Resolution
                </div>
                <div className="mt-density-sm flex items-center gap-density-xs font-semibold text-[#C40000]">
                  <Icon name="arrow_downward" size="var(--tally-icon-size-sm)" />
                  <span style={{ fontSize: "var(--tally-font-size-xs)" }}>
                    +1
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 gap-density-lg lg:grid-cols-[2fr_1fr]">
          {/* SLA Performance by Request Type */}
          <Card className="shadow-none">
            <CardHeader className="p-density-lg pb-0">
              <CardTitle
                className="uppercase tracking-wider text-gray-900 dark:text-gray-100"
                style={{ fontSize: "var(--tally-font-size-sm)" }}
              >
                SLA Performance by Request Type
              </CardTitle>
            </CardHeader>
            <CardContent className="p-density-lg pt-density-md">
              <Table>
                <TableHeader>
                  <TableRow className="border-border dark:border-gray-700">
                    <TableHead
                      className="py-density-md font-bold uppercase tracking-wider text-muted-foreground"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Request Type
                    </TableHead>
                    <TableHead
                      className="py-density-md font-bold uppercase tracking-wider text-muted-foreground"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Response Target
                    </TableHead>
                    <TableHead
                      className="py-density-md font-bold uppercase tracking-wider text-muted-foreground"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Resolution Target
                    </TableHead>
                    <TableHead
                      className="py-density-md font-bold uppercase tracking-wider text-muted-foreground"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Performance
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SLA_TYPES.map((row) => (
                    <TableRow
                      key={row.name}
                      className="border-border dark:border-gray-700"
                    >
                      <TableCell
                        className="py-density-md text-gray-900 dark:text-gray-100"
                        style={{ fontSize: "var(--tally-font-size-sm)" }}
                      >
                        <div className="font-medium">{row.name}</div>
                        <div
                          className="mt-density-xs text-muted-foreground"
                          style={{ fontSize: "var(--tally-font-size-xs)" }}
                        >
                          {row.desc}
                        </div>
                      </TableCell>
                      <TableCell
                        className="py-density-md font-semibold text-gray-900 dark:text-gray-100"
                        style={{ fontSize: "var(--tally-font-size-sm)" }}
                      >
                        {row.responseTarget}
                      </TableCell>
                      <TableCell
                        className="py-density-md font-semibold text-gray-900 dark:text-gray-100"
                        style={{ fontSize: "var(--tally-font-size-sm)" }}
                      >
                        {row.resolutionTarget}
                      </TableCell>
                      <TableCell
                        className="py-density-md text-gray-900 dark:text-gray-100"
                        style={{ fontSize: "var(--tally-font-size-sm)" }}
                      >
                        <div className="flex items-center gap-density-md">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${row.performance}%`,
                                backgroundColor: slaBarColor[row.performanceClass],
                              }}
                            />
                          </div>
                          <span
                            className={cn(
                              "min-w-[36px] font-bold",
                              perfValueColor[row.performanceClass]
                            )}
                            style={{ fontSize: "var(--tally-font-size-xs)" }}
                          >
                            {row.performance}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Overdue Actions */}
          <Card className="shadow-none">
            <CardHeader className="p-density-lg pb-0">
              <CardTitle
                className="uppercase tracking-wider text-gray-900 dark:text-gray-100"
                style={{ fontSize: "var(--tally-font-size-sm)" }}
              >
                Overdue Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-density-lg pt-density-md">
              <Table>
                <TableHeader>
                  <TableRow className="border-border dark:border-gray-700">
                    <TableHead
                      className="py-density-md font-bold uppercase text-muted-foreground"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Case
                    </TableHead>
                    <TableHead
                      className="py-density-md font-bold uppercase text-muted-foreground"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Type
                    </TableHead>
                    <TableHead
                      className="py-density-md font-bold uppercase text-muted-foreground"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Owner
                    </TableHead>
                    <TableHead
                      className="py-density-md font-bold uppercase text-muted-foreground"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Overdue
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {OVERDUE_ACTIONS.map((row) => (
                    <TableRow
                      key={row.case}
                      className="border-border dark:border-gray-700"
                    >
                      <TableCell
                        className="py-density-md"
                        style={{ fontSize: "var(--tally-font-size-sm)" }}
                      >
                        <Link
                          href={`/crm/cases/${row.case}`}
                          className="font-medium text-[#2C365D] no-underline hover:underline dark:text-[#7c8cb8]"
                        >
                          {row.case}
                        </Link>
                      </TableCell>
                      <TableCell
                        className="py-density-md"
                        style={{ fontSize: "var(--tally-font-size-sm)" }}
                      >
                        <Badge variant="error">{row.type}</Badge>
                      </TableCell>
                      <TableCell
                        className="py-density-md text-gray-900 dark:text-gray-100"
                        style={{ fontSize: "var(--tally-font-size-sm)" }}
                      >
                        {row.owner}
                      </TableCell>
                      <TableCell
                        className="py-density-md text-gray-900 dark:text-gray-100"
                        style={{ fontSize: "var(--tally-font-size-sm)" }}
                      >
                        {row.overdue}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-density-lg grid grid-cols-3 gap-density-md rounded-density-md bg-gray-50 p-density-lg dark:bg-gray-800">
                <div className="text-center">
                  <div
                    className="font-bold text-gray-900 dark:text-gray-100"
                    style={{ fontSize: "var(--tally-font-size-xl)" }}
                  >
                    12
                  </div>
                  <div
                    className="mt-density-xs text-muted-foreground"
                    style={{ fontSize: "var(--tally-font-size-xs)" }}
                  >
                    Overdue Responses
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="font-bold text-gray-900 dark:text-gray-100"
                    style={{ fontSize: "var(--tally-font-size-xl)" }}
                  >
                    6
                  </div>
                  <div
                    className="mt-density-xs text-muted-foreground"
                    style={{ fontSize: "var(--tally-font-size-xs)" }}
                  >
                    Overdue Resolutions
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="font-bold text-gray-900 dark:text-gray-100"
                    style={{ fontSize: "var(--tally-font-size-xl)" }}
                  >
                    18
                  </div>
                  <div
                    className="mt-density-xs text-muted-foreground"
                    style={{ fontSize: "var(--tally-font-size-xs)" }}
                  >
                    Total Overdue
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
