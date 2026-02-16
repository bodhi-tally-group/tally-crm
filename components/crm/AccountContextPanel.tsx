"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import Badge from "@/components/Badge/Badge";
import SLAIndicator from "@/components/crm/SLAIndicator";
import { getCaseByCaseNumber } from "@/lib/mock-data/cases";
import { getAccountById } from "@/lib/mock-data/accounts";
import type { Account } from "@/types/crm";

interface AccountContextPanelProps {
  account: Account;
  /** Case numbers of manually linked cases to show in Linked Cases section */
  linkedCaseNumbers?: string[];
  /** When set, show "Link case" button and allow adding links */
  currentCaseId?: string;
  /** Callback to open the link-case modal */
  onOpenLinkModal?: () => void;
  className?: string;
}

function DataRow({
  label,
  value,
  className,
  compact,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span
        className={cn(
          "font-medium uppercase tracking-wide text-muted-foreground",
          compact ? "text-[10px]" : "text-xs"
        )}
      >
        {label}
      </span>
      <span className={cn("text-gray-900 dark:text-gray-100", compact ? "text-xs" : "text-sm")}>
        {value}
      </span>
    </div>
  );
}

export default function AccountContextPanel({
  account,
  linkedCaseNumbers = [],
  currentCaseId,
  onOpenLinkModal,
  className,
}: AccountContextPanelProps) {
  const accountTypeVariant =
    account.type === "Industrial"
      ? "default"
      : account.type === "Commercial"
        ? "info"
        : "secondary";

  return (
    <aside
      className={cn(
        "flex min-h-0 w-52 min-w-0 shrink-0 flex-col border-r border-border bg-white dark:border-gray-800 dark:bg-gray-950 sm:w-64 md:w-72",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center border-b border-border px-3 py-2 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2C365D] text-[10px] font-bold text-white">
            {account.name
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("")}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-gray-900 dark:text-gray-100">
              {account.name}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {account.accountNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Content — scrollable when taller than panel */}
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-2">
        <div className="space-y-2.5">
          {/* Account type and status */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={accountTypeVariant} className="text-[10px] px-1.5 py-0">
              {account.type}
            </Badge>
            <Badge
              variant={account.status === "Active" ? "success" : "error"}
              className="text-[10px] px-1.5 py-0"
            >
              {account.status}
            </Badge>
          </div>

          {/* NMIs */}
          <div className="space-y-1">
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              NMI{account.nmis.length > 1 ? "s" : ""}
            </span>
            {account.nmis.map((nmi) => (
              <div
                key={nmi}
                className="flex items-center gap-1.5 rounded bg-gray-50 px-2 py-1 text-xs font-mono text-gray-800 dark:bg-gray-900 dark:text-gray-200"
              >
                <Icon
                  name="electric_meter"
                  size={14}
                  className="shrink-0 text-gray-400"
                />
                <span className="truncate">{nmi}</span>
              </div>
            ))}
          </div>

          {/* Key fields */}
          <DataRow label="Energy Type" value={account.energyType} compact />
          <DataRow label="Address" value={account.address} compact />
          <DataRow
            label="Annual Consumption"
            value={account.annualConsumption}
            compact
          />

          {/* Divider */}
          <div className="border-t border-border dark:border-gray-800" />

          {/* Financial */}
          <DataRow
            label="Account Balance"
            value={
              <span
                className={cn(
                  "font-semibold",
                  account.accountBalance.startsWith("-")
                    ? "text-[#C40000]"
                    : "text-[#008000]"
                )}
              >
                {account.accountBalance}
              </span>
            }
            compact
          />
          <DataRow
            label="Last Payment"
            value={`${account.lastPaymentAmount} on ${account.lastPaymentDate}`}
            compact
          />
          <DataRow
            label="Contract End"
            value={account.contractEndDate}
            compact
          />

          {/* Divider */}
          <div className="border-t border-border dark:border-gray-800" />

          {/* Primary contact */}
          <div className="space-y-1">
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Primary Contact
            </span>
            <div className="rounded border border-border bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-900">
              <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                {account.primaryContact.name}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {account.primaryContact.role}
              </p>
              <div className="mt-1.5 space-y-0.5">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-gray-400">
                  <Icon name="mail" size={12} className="shrink-0" />
                  <span className="truncate">{account.primaryContact.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-gray-400">
                  <Icon name="phone" size={12} className="shrink-0" />
                  {account.primaryContact.phone}
                </div>
              </div>
            </div>
          </div>

          {/* Linked Cases — only show cases from the same org; optional "Link case" button */}
          {(linkedCaseNumbers.length > 0 || onOpenLinkModal) && (
            <>
              <div className="border-t border-border dark:border-gray-800" />
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Linked Cases
                  </span>
                  {onOpenLinkModal && (
                    <button
                      type="button"
                      onClick={onOpenLinkModal}
                      className="text-[10px] font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]"
                    >
                      + Link case
                    </button>
                  )}
                </div>
                {(() => {
                  const linkedCasesSameOrg = linkedCaseNumbers
                    .map((caseNum) => getCaseByCaseNumber(caseNum))
                    .filter((c): c is NonNullable<typeof c> => c != null)
                    .filter((linkedCase) => getAccountById(linkedCase.accountId)?.orgId === account.orgId);
                  if (linkedCasesSameOrg.length === 0 && !onOpenLinkModal) return null;
                  if (linkedCasesSameOrg.length === 0) {
                    return (
                      <p className="text-[11px] text-muted-foreground">
                        No linked cases. Use &quot;Link case&quot; to add one.
                      </p>
                    );
                  }
                  return (
                    <ul className="space-y-2">
                      {linkedCasesSameOrg.map((linkedCase) => (
                        <li key={linkedCase.id}>
                          <Link
                            href={`/crm/cases/${linkedCase.id}`}
                            className="block w-full rounded-lg border border-border bg-gray-50/80 px-2.5 py-2 text-left transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/40 dark:hover:bg-gray-800/60"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                                {linkedCase.caseNumber}
                              </span>
                            </div>
                            <p className="mt-0.5 truncate text-xs text-muted-foreground" title={linkedCase.accountName}>
                              {linkedCase.accountName}
                            </p>
                            <div className="mt-1.5 flex items-center justify-between gap-2">
                              <span className="truncate text-[11px] text-muted-foreground">{linkedCase.status}</span>
                              <SLAIndicator status={linkedCase.slaStatus} size="sm" showIcon={false} className="shrink-0 text-[11px]" />
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
