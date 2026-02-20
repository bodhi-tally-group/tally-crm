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
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { dataVisualizationColors } from "@/lib/tokens/colors";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const CHART_BLUE = dataVisualizationColors.dataFSolid.hex;
const CHART_COLORS = [
  dataVisualizationColors.dataASolid.hex,
  dataVisualizationColors.dataBSolid.hex,
  dataVisualizationColors.dataCSolid.hex,
  dataVisualizationColors.dataDSolid.hex,
  dataVisualizationColors.dataESolid.hex,
  dataVisualizationColors.dataFSolid.hex,
  "#06B6D4",
  "#EC4899",
  "#84CC16",
  "#F97316",
];

// Mock trend: cases created per month (Apr 2024 – Dec 2025)
const trendCasesCreated = [
  { month: "Apr 2024", count: 179 },
  { month: "May 2024", count: 252 },
  { month: "Jun 2024", count: 238 },
  { month: "Jul 2024", count: 301 },
  { month: "Aug 2024", count: 248 },
  { month: "Sep 2024", count: 253 },
  { month: "Oct 2024", count: 220 },
  { month: "Nov 2024", count: 325 },
  { month: "Dec 2024", count: 356 },
  { month: "Jan 2025", count: 341 },
  { month: "Feb 2025", count: 335 },
  { month: "Mar 2025", count: 413 },
  { month: "Apr 2025", count: 513 },
  { month: "May 2025", count: 527 },
  { month: "Jun 2025", count: 374 },
  { month: "Jul 2025", count: 422 },
  { month: "Aug 2025", count: 535 },
  { month: "Sep 2025", count: 519 },
  { month: "Oct 2025", count: 919 },
  { month: "Nov 2025", count: 480 },
  { month: "Dec 2025", count: 338 },
];

// Mock trend: cases closed per month
const trendCasesClosed = [
  { month: "Apr 2024", count: 164 },
  { month: "May 2024", count: 255 },
  { month: "Jun 2024", count: 224 },
  { month: "Jul 2024", count: 311 },
  { month: "Aug 2024", count: 226 },
  { month: "Sep 2024", count: 238 },
  { month: "Oct 2024", count: 275 },
  { month: "Nov 2024", count: 224 },
  { month: "Dec 2024", count: 346 },
  { month: "Jan 2025", count: 298 },
  { month: "Feb 2025", count: 285 },
  { month: "Mar 2025", count: 410 },
  { month: "Apr 2025", count: 392 },
  { month: "May 2025", count: 368 },
  { month: "Jun 2025", count: 411 },
  { month: "Jul 2025", count: 388 },
  { month: "Aug 2025", count: 479 },
  { month: "Sep 2025", count: 546 },
  { month: "Oct 2025", count: 881 },
  { month: "Nov 2025", count: 474 },
  { month: "Dec 2025", count: 290 },
];

// Mock trend: average resolution time (e.g. days) per month
const trendResolutionTime = [
  { month: "Apr 2024", avgAge: 0.7 },
  { month: "May 2024", avgAge: 1.4 },
  { month: "Jun 2024", avgAge: 2 },
  { month: "Jul 2024", avgAge: 1.3 },
  { month: "Aug 2024", avgAge: 3.5 },
  { month: "Sep 2024", avgAge: 3.7 },
  { month: "Oct 2024", avgAge: 4 },
  { month: "Nov 2024", avgAge: 4 },
  { month: "Dec 2024", avgAge: 4.2 },
  { month: "Jan 2025", avgAge: 4.2 },
  { month: "Feb 2025", avgAge: 5.7 },
  { month: "Mar 2025", avgAge: 4.2 },
  { month: "Apr 2025", avgAge: 7.6 },
  { month: "May 2025", avgAge: 6.2 },
  { month: "Jun 2025", avgAge: 10.6 },
  { month: "Jul 2025", avgAge: 3.9 },
  { month: "Aug 2025", avgAge: 2.7 },
  { month: "Sep 2025", avgAge: 17 },
  { month: "Oct 2025", avgAge: 3.1 },
  { month: "Nov 2025", avgAge: 6 },
  { month: "Dec 2025", avgAge: 3 },
];

// Mock account status distribution
const accountsByStatus = [
  { status: "Billing", count: 10 },
  { status: "Closed", count: 221 },
  { status: "Cancelled", count: 5 },
  { status: "Transfer In", count: 1 },
  { status: "Parent Billing", count: 62 },
  { status: "Non Billing Parent", count: 105 },
  { status: "Parent Closed", count: 8 },
  { status: "Pending Closure", count: 1 },
];

const totalAccountRecords = accountsByStatus.reduce((s, r) => s + r.count, 0);

// Top 20 customers by case count (previous quarter) – for donut
const topCustomersByCases = [
  { name: "Customer A", count: 52 },
  { name: "Customer B", count: 24 },
  { name: "Customer C", count: 22 },
  { name: "Customer D", count: 21 },
  { name: "Customer E", count: 20 },
  { name: "Customer F", count: 19 },
  { name: "Customer G", count: 18 },
  { name: "Customer H", count: 17 },
  { name: "Customer I", count: 15 },
  { name: "Customer J", count: 14 },
  { name: "Customer K", count: 13 },
  { name: "Customer L", count: 11 },
  { name: "Customer M", count: 10 },
  { name: "Customer N", count: 10 },
  { name: "Customer O", count: 9 },
  { name: "Customer P", count: 8 },
  { name: "Customer Q", count: 7 },
  { name: "Customer R", count: 6 },
  { name: "Customer S", count: 5 },
  { name: "Customer T", count: 4 },
];

const totalCasesTop20 = topCustomersByCases.reduce((s, r) => s + r.count, 0);

// Key metrics (mock – replace with real case data when available)
const AVG_TIME_TO_RESOLVED_DAYS = 4.2;
const OPEN_CASES_COUNT = 24;

// Mock trend per card: up/down icon + label; positive = green (good), negative = red (bad)
// Cases and total records going up = bad (red). Resolution time and open cases going down = good (green).
const METRIC_TRENDS = [
  { direction: "up" as const, text: "+4.2% from last month", positive: false }, // growth in cases = negative
  { direction: "down" as const, text: "-0.3 days from last month", positive: true }, // faster resolution = positive
  { direction: "down" as const, text: "-5 from last month", positive: true }, // fewer open cases = positive
  { direction: "up" as const, text: "+6.8% from last month", positive: false }, // more total records = negative
];

function formatAsOf() {
  const d = new Date();
  return d.toLocaleString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function CasesSummaryDashboardPage() {
  return (
    <div className="min-w-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full min-w-0 max-w-[1600px] p-density-xl">
        {/* Page header */}
        <div className="mb-density-lg">
          <Link
            href="/crm/cases"
            className="mb-density-sm inline-flex items-center gap-1 text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100"
            style={{ fontSize: "var(--tally-font-size-sm)" }}
          >
            <Icon name="arrow_back" size={18} />
            Back to Cases
          </Link>
          <h1
            className="font-bold text-gray-900 dark:text-gray-100"
            style={{
              fontSize: "var(--tally-font-size-3xl)",
              lineHeight: "var(--tally-line-height-tight)",
            }}
          >
            Case Summary Dashboard
          </h1>
          <p
            className="mt-density-xs text-muted-foreground"
            style={{ fontSize: "var(--tally-font-size-sm)" }}
          >
            Cases, resolution, and account metrics
          </p>
        </div>

        {/* Key metrics – 4 across, highlighted numbers */}
        <div className="mb-density-lg grid grid-cols-1 gap-density-md sm:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden border border-border bg-white shadow-none dark:border-gray-700 dark:bg-gray-900">
            <CardContent className="flex flex-col justify-center px-6 pt-6 pb-5">
              <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                Cases this quarter by client
              </p>
              <p
                className="mt-3 font-bold text-gray-900 dark:text-gray-100"
                style={{ fontSize: "var(--tally-font-size-4xl)", lineHeight: "var(--tally-line-height-tight)" }}
              >
                {totalCasesTop20.toLocaleString()}
              </p>
              <div
                className={cn(
                  "mt-3 flex items-center gap-1.5 text-xs font-medium",
                  METRIC_TRENDS[0].positive ? "text-[#008000] dark:text-green-400" : "text-[#C40000] dark:text-red-400"
                )}
              >
                <Icon
                  name={METRIC_TRENDS[0].direction === "up" ? "trending_up" : "trending_down"}
                  size={16}
                />
                <span>{METRIC_TRENDS[0].text}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border border-border bg-white shadow-none dark:border-gray-700 dark:bg-gray-900">
            <CardContent className="flex flex-col justify-center px-6 pt-6 pb-5">
              <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                Average time to resolved
              </p>
              <p
                className="mt-3 font-bold text-gray-900 dark:text-gray-100"
                style={{ fontSize: "var(--tally-font-size-4xl)", lineHeight: "var(--tally-line-height-tight)" }}
              >
                {AVG_TIME_TO_RESOLVED_DAYS} days
              </p>
              <div
                className={cn(
                  "mt-3 flex items-center gap-1.5 text-xs font-medium",
                  METRIC_TRENDS[1].positive ? "text-[#008000] dark:text-green-400" : "text-[#C40000] dark:text-red-400"
                )}
              >
                <Icon
                  name={METRIC_TRENDS[1].direction === "up" ? "trending_up" : "trending_down"}
                  size={16}
                />
                <span>{METRIC_TRENDS[1].text}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border border-border bg-white shadow-none dark:border-gray-700 dark:bg-gray-900">
            <CardContent className="flex flex-col justify-center px-6 pt-6 pb-5">
              <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                Open cases
              </p>
              <p
                className="mt-3 font-bold text-gray-900 dark:text-gray-100"
                style={{ fontSize: "var(--tally-font-size-4xl)", lineHeight: "var(--tally-line-height-tight)" }}
              >
                {OPEN_CASES_COUNT.toLocaleString()}
              </p>
              <div
                className={cn(
                  "mt-3 flex items-center gap-1.5 text-xs font-medium",
                  METRIC_TRENDS[2].positive ? "text-[#008000] dark:text-green-400" : "text-[#C40000] dark:text-red-400"
                )}
              >
                <Icon
                  name={METRIC_TRENDS[2].direction === "up" ? "trending_up" : "trending_down"}
                  size={16}
                />
                <span>{METRIC_TRENDS[2].text}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border border-border bg-white shadow-none dark:border-gray-700 dark:bg-gray-900">
            <CardContent className="flex flex-col justify-center px-6 pt-6 pb-5">
              <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                Total records (contact roles)
              </p>
              <p
                className="mt-3 font-bold text-gray-900 dark:text-gray-100"
                style={{ fontSize: "var(--tally-font-size-4xl)", lineHeight: "var(--tally-line-height-tight)" }}
              >
                948
              </p>
              <div
                className={cn(
                  "mt-3 flex items-center gap-1.5 text-xs font-medium",
                  METRIC_TRENDS[3].positive ? "text-[#008000] dark:text-green-400" : "text-[#C40000] dark:text-red-400"
                )}
              >
                <Icon
                  name={METRIC_TRENDS[3].direction === "up" ? "trending_up" : "trending_down"}
                  size={16}
                />
                <span>{METRIC_TRENDS[3].text}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trend of Cases Created */}
        <Card className="mb-density-lg overflow-hidden border border-border bg-white shadow-none dark:border-gray-700 dark:bg-gray-900">
          <CardHeader>
            <CardTitle>Trend of Cases Created</CardTitle>
            <CardDescription>Record count by opened date</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: "280px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendCasesCreated} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="trendCreatedFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_BLUE} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={CHART_BLUE} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" height={56} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => (v >= 1000 ? `${v / 1000}K` : String(v))} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
                    formatter={(value: number | undefined) => [value ?? 0, "Record Count"]}
                    labelFormatter={(label) => `Opened Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke={CHART_BLUE}
                    fill="url(#trendCreatedFill)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-border pt-2 dark:border-gray-700">
              <Link
                href="/crm/cases"
                className="text-sm font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]"
              >
                View Report (Trend of Cases Created)
              </Link>
              <span className="text-xs text-muted-foreground">As of {formatAsOf()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Two trend charts side by side */}
        <div className="mb-density-lg grid grid-cols-1 gap-density-lg lg:grid-cols-2">
          <Card className="overflow-hidden border border-border bg-white shadow-none dark:border-gray-700 dark:bg-gray-900">
            <CardHeader>
              <CardTitle>Trend of Cases Closed</CardTitle>
              <CardDescription>Number of cases closed by date</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: "260px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendCasesClosed} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" height={56} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
                      formatter={(value: number | undefined) => [value ?? 0, "Number of Cases Closed"]}
                      labelFormatter={(label) => `Date/Time Closed: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke={CHART_BLUE}
                      strokeWidth={2}
                      dot={{ fill: CHART_BLUE, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border pt-2 dark:border-gray-700">
                <Link
                  href="/crm/cases"
                  className="text-sm font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]"
                >
                  View Report (Trend of Cases Closed)
                </Link>
                <span className="text-xs text-muted-foreground">As of {formatAsOf()}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border border-border bg-white shadow-none dark:border-gray-700 dark:bg-gray-900">
            <CardHeader>
              <CardTitle>Trend of Case Resolution Time</CardTitle>
              <CardDescription>Average age by date closed</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: "260px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendResolutionTime} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" height={56} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
                      formatter={(value: number | undefined) => [value ?? 0, "Average Age"]}
                      labelFormatter={(label) => `Date/Time Closed: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="avgAge"
                      stroke={CHART_BLUE}
                      strokeWidth={2}
                      dot={{ fill: CHART_BLUE, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border pt-2 dark:border-gray-700">
                <Link
                  href="/crm/cases"
                  className="text-sm font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]"
                >
                  View Report (Trend of Case Resolution Time)
                </Link>
                <span className="text-xs text-muted-foreground">As of {formatAsOf()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Accounts By Account Status + Top 20 Customers */}
        <div className="grid grid-cols-1 gap-density-lg lg:grid-cols-2">
          <Card className="overflow-hidden border border-border bg-white shadow-none dark:border-gray-700 dark:bg-gray-900">
            <CardHeader>
              <CardTitle>Accounts By Account Status</CardTitle>
              <CardDescription>Record count by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg font-semibold text-[#2C365D] dark:text-[#7c8cb8]">
                  {(totalAccountRecords / 1000).toFixed(1)}k
                </span>
                <span className="text-sm text-muted-foreground">total records</span>
              </div>
              <div style={{ height: "280px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={accountsByStatus} layout="vertical" margin={{ left: 8, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : String(v))} />
                    <YAxis type="category" dataKey="status" tick={{ fontSize: 11 }} width={120} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
                      formatter={(value: number | undefined) => [value ?? 0, "Record Count"]}
                    />
                    <Bar dataKey="count" fill={CHART_BLUE} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border pt-2 dark:border-gray-700">
                <Link
                  href="/crm/customer/accounts"
                  className="text-sm font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]"
                >
                  View Report (Accounts By Account Status)
                </Link>
                <span className="text-xs text-muted-foreground">As of {formatAsOf()}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border border-border bg-white shadow-none dark:border-gray-700 dark:bg-gray-900">
            <CardHeader>
              <CardTitle>Top 20 Customers by Number of Cases (Previous Quarter)</CardTitle>
              <CardDescription>Record count by client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative flex items-center justify-center" style={{ height: "260px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topCustomersByCases}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="count"
                      nameKey="name"
                      paddingAngle={1}
                    >
                      {topCustomersByCases.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
                      formatter={(value: number | undefined, name: string | undefined) => [value ?? 0, name ?? ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="text-xs font-medium text-muted-foreground">Record Count</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {totalCasesTop20}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border pt-2 dark:border-gray-700">
                <Link
                  href="/crm/cases"
                  className="text-sm font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]"
                >
                  View Report (Amount of Cases this Quarter by Client)
                </Link>
                <span className="text-xs text-muted-foreground">As of {formatAsOf()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
