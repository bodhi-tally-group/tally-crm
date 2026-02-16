"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import Badge from "@/components/Badge/Badge";
import type { Account } from "@/types/crm";

interface AccountContextPanelProps {
  account: Account;
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

      {/* Content — no internal scroll; compact so it fits */}
      <div className="flex-1 overflow-hidden px-3 py-2">
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
        </div>
      </div>
    </aside>
  );
}
