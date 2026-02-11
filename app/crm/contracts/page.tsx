"use client";

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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/Table/Table";
import { cn } from "@/lib/utils";

const CONTRACTS_DATA = [
  {
    id: "1",
    customer: "Veolia Energy",
    customerId: "TA-10042",
    initials: "VE",
    opportunity: "OPP-2024-0118",
    document: "Supply Agreement v1",
    generated: "08 Dec 2024",
    value: "$1,250,000",
    status: "pending",
  },
  {
    id: "2",
    customer: "Energy Plus Co",
    customerId: "TA-10038",
    initials: "EP",
    opportunity: "OPP-2024-0124",
    document: "Pricing Schedule v2",
    generated: "01 Dec 2024",
    value: "$890,000",
    status: "generated",
  },
  {
    id: "3",
    customer: "Aurora Power",
    customerId: "TA-10019",
    initials: "AP",
    opportunity: "OPP-2023-0098",
    document: "Full Service Agreement",
    generated: "15 Nov 2024",
    value: "$680,000",
    status: "failed",
  },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<
    string,
    { variant: "warning" | "success" | "error" }
  > = {
    pending: { variant: "warning" },
    generated: { variant: "success" },
    failed: { variant: "error" },
  };
  const c = config[status] ?? config.pending;
  return <Badge variant={c.variant}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
}

export default function ContractsPage() {
  return (
    <div className="min-w-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[1600px] p-density-xl">
        {/* Page header */}
        <div className="mb-density-xl flex items-center justify-between">
          <div>
            <h1
              className="font-bold text-gray-900 dark:text-gray-100"
              style={{
                fontSize: "var(--tally-font-size-3xl)",
                lineHeight: "var(--tally-line-height-tight)",
              }}
            >
              Contract Documents
            </h1>
            <p
              className="mt-density-xs text-muted-foreground"
              style={{ fontSize: "var(--tally-font-size-sm)" }}
            >
              View and manage contract artefacts
            </p>
          </div>
          <div className="flex items-center gap-density-sm">
            <div className="relative">
              <Icon
                name="search"
                size="var(--tally-icon-size-md)"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search contract documents..."
                className="w-[280px] rounded-density-md border border-border bg-white py-2 pl-9 pr-3 outline-none placeholder:text-muted-foreground focus:border-[#2C365D] focus:ring-1 focus:ring-[#2C365D] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                style={{ fontSize: "var(--tally-font-size-sm)" }}
              />
            </div>
            <Button size="sm" className="gap-1.5">
              <Icon name="add" size="var(--tally-icon-size-sm)" className="mr-1" />
              Generate Contract
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="mb-density-xl grid grid-cols-1 gap-density-lg sm:grid-cols-2 xl:grid-cols-4">
          <Link href="/crm/contracts" className="block no-underline">
            <Card className="shadow-none transition-colors hover:border-[#2C365D] dark:hover:border-[#7c8cb8]">
              <CardContent className="p-density-xl pt-density-xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p
                      className="font-medium text-muted-foreground uppercase"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Contract Documents
                    </p>
                    <p
                      className="mt-density-sm font-bold text-gray-900 dark:text-gray-100"
                      style={{ fontSize: "var(--tally-font-size-3xl)" }}
                    >
                      156
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center justify-center rounded-density-md bg-[#2C365D]/10 p-density-md dark:bg-[#7c8cb8]/20">
                    <Icon
                      name="description"
                      size="var(--tally-icon-size-lg)"
                      className="text-[#2C365D] dark:text-[#7c8cb8]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/crm/contracts" className="block no-underline">
            <Card className="shadow-none transition-colors hover:border-[#2C365D] dark:hover:border-[#7c8cb8]">
              <CardContent className="p-density-xl pt-density-xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p
                      className="font-medium text-muted-foreground uppercase"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Awaiting Manual Confirmation
                    </p>
                    <p
                      className="mt-density-sm font-bold text-gray-900 dark:text-gray-100"
                      style={{ fontSize: "var(--tally-font-size-3xl)" }}
                    >
                      12
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center justify-center rounded-density-md bg-[#C53B00]/10 p-density-md">
                    <Icon
                      name="schedule"
                      size="var(--tally-icon-size-lg)"
                      className="text-[#C53B00]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/crm/contracts" className="block no-underline">
            <Card className="shadow-none transition-colors hover:border-[#2C365D] dark:hover:border-[#7c8cb8]">
              <CardContent className="p-density-xl pt-density-xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p
                      className="font-medium text-muted-foreground uppercase"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Promoted to Tally Docs
                    </p>
                    <p
                      className="mt-density-sm font-bold text-gray-900 dark:text-gray-100"
                      style={{ fontSize: "var(--tally-font-size-3xl)" }}
                    >
                      48
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center justify-center rounded-density-md bg-[#0074C4]/10 p-density-md">
                    <Icon
                      name="link"
                      size="var(--tally-icon-size-lg)"
                      className="text-[#0074C4]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/crm/contracts" className="block no-underline">
            <Card className="shadow-none transition-colors hover:border-[#2C365D] dark:hover:border-[#7c8cb8]">
              <CardContent className="p-density-xl pt-density-xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p
                      className="font-medium text-muted-foreground uppercase"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Confirmed Signed
                    </p>
                    <p
                      className="mt-density-sm font-bold text-gray-900 dark:text-gray-100"
                      style={{ fontSize: "var(--tally-font-size-3xl)" }}
                    >
                      8
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center justify-center rounded-density-md bg-[#008000]/10 p-density-md">
                    <Icon
                      name="check"
                      size="var(--tally-icon-size-lg)"
                      className="text-[#008000]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Contracts table */}
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border py-density-lg dark:border-gray-700">
            <div>
              <CardTitle
                className="uppercase tracking-wider"
                style={{ fontSize: "var(--tally-font-size-sm)" }}
              >
                All Contract Documents
              </CardTitle>
            </div>
            <select
              className="rounded-density-md border border-border bg-white px-density-md py-density-sm outline-none focus:border-[#2C365D] focus:ring-1 focus:ring-[#2C365D] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              style={{ fontSize: "var(--tally-font-size-xs)" }}
              defaultValue="All Status"
            >
              <option>All Status</option>
              <option>Generated</option>
              <option>Pending Signature</option>
              <option>Failed</option>
            </select>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden rounded-b-density-md">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead
                      className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Customer
                    </TableHead>
                    <TableHead
                      className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Opportunity
                    </TableHead>
                    <TableHead
                      className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Document
                    </TableHead>
                    <TableHead
                      className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Generated
                    </TableHead>
                    <TableHead
                      className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Value
                    </TableHead>
                    <TableHead
                      className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Status
                    </TableHead>
                    <TableHead
                      className="bg-gray-50 dark:bg-gray-800/50"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CONTRACTS_DATA.map((row) => (
                    <TableRow key={row.id} className="group">
                      <TableCell style={{ fontSize: "var(--tally-font-size-sm)" }}>
                        <div className="flex items-center gap-density-md">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-density-md bg-gray-100 font-medium text-muted-foreground dark:bg-gray-800">
                            {row.initials}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {row.customer}
                            </div>
                            <div className="text-muted-foreground" style={{ fontSize: "var(--tally-font-size-xs)" }}>
                              {row.customerId}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-gray-100" style={{ fontSize: "var(--tally-font-size-sm)" }}>
                        {row.opportunity}
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-gray-100" style={{ fontSize: "var(--tally-font-size-sm)" }}>
                        {row.document}
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-gray-100" style={{ fontSize: "var(--tally-font-size-sm)" }}>
                        {row.generated}
                      </TableCell>
                      <TableCell style={{ fontSize: "var(--tally-font-size-sm)" }}>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {row.value}
                        </span>
                      </TableCell>
                      <TableCell style={{ fontSize: "var(--tally-font-size-sm)" }}>
                        <StatusBadge status={row.status} />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Icon name="more_vert" size="var(--tally-icon-size-sm)" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <p
          className="mt-density-md text-muted-foreground"
          style={{ fontSize: "var(--tally-font-size-xs)" }}
        >
          Phase 1 stores contract artefacts only. Signing workflow is manual and
          confirmation is required before account creation.
        </p>
      </div>
    </div>
  );
}
