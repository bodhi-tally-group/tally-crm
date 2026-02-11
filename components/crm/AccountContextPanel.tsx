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
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm text-gray-900 dark:text-gray-100">
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
        "flex w-72 shrink-0 flex-col border-r border-border bg-white dark:border-gray-800 dark:bg-gray-950",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center border-b border-border px-4 py-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2C365D] text-xs font-bold text-white">
            {account.name
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("")}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
              {account.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {account.accountNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <div className="space-y-4">
          {/* Account type and status */}
          <div className="flex items-center gap-2">
            <Badge variant={accountTypeVariant} className="text-xs">
              {account.type}
            </Badge>
            <Badge
              variant={account.status === "Active" ? "success" : "error"}
              className="text-xs"
            >
              {account.status}
            </Badge>
          </div>

          {/* NMIs */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              NMI{account.nmis.length > 1 ? "s" : ""}
            </span>
            {account.nmis.map((nmi) => (
              <div
                key={nmi}
                className="flex items-center gap-2 rounded bg-gray-50 px-2.5 py-1.5 text-sm font-mono text-gray-800 dark:bg-gray-900 dark:text-gray-200"
              >
                <Icon
                  name="electric_meter"
                  size={16}
                  className="text-gray-400"
                />
                {nmi}
              </div>
            ))}
          </div>

          {/* Key fields */}
          <DataRow label="Energy Type" value={account.energyType} />
          <DataRow label="Address" value={account.address} />
          <DataRow
            label="Annual Consumption"
            value={account.annualConsumption}
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
          />
          <DataRow
            label="Last Payment"
            value={`${account.lastPaymentAmount} on ${account.lastPaymentDate}`}
          />
          <DataRow
            label="Contract End"
            value={account.contractEndDate}
          />

          {/* Divider */}
          <div className="border-t border-border dark:border-gray-800" />

          {/* Primary contact */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Primary Contact
            </span>
            <div className="rounded-md border border-border bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {account.primaryContact.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {account.primaryContact.role}
              </p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <Icon name="mail" size={14} />
                  {account.primaryContact.email}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <Icon name="phone" size={14} />
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
