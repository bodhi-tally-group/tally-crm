"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Button from "@/components/Button/Button";
import { Icon } from "@/components/ui/icon";
import { getOrgById } from "@/lib/mock-data/accounts";
import type { Account, Contact } from "@/types/crm";

interface ContactContextPanelProps {
  contact: Contact;
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
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-xs text-gray-900 dark:text-gray-100">
        {value ?? "—"}
      </span>
    </div>
  );
}

const QUICK_ACTIONS = [
  { label: "Note", icon: "edit" as const },
  { label: "Email", icon: "mail" as const },
  { label: "Call", icon: "call" as const },
  { label: "Task", icon: "assignment" as const },
  { label: "Meeting", icon: "event" as const },
] as const;

export default function ContactContextPanel({
  contact,
  account,
  className,
}: ContactContextPanelProps) {
  const initials = contact.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <aside
      className={cn(
        "flex min-h-0 w-52 min-w-0 shrink-0 flex-col border-r border-border bg-white dark:border-gray-800 dark:bg-gray-950 sm:w-64 md:w-72",
        className
      )}
    >
      {/* Header — avatar + name + email, Edit button */}
      <div className="flex items-center gap-2 border-b border-border px-3 py-2 dark:border-gray-800">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2C365D] text-[10px] font-bold text-white">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-gray-900 dark:text-gray-100">
            {contact.name}
          </p>
          <p className="truncate text-[11px] text-muted-foreground" title={contact.email}>
            {contact.email || "—"}
          </p>
        </div>
        <Button variant="outline" size="sm" className="h-7 shrink-0 gap-1 px-2 text-xs">
          <Icon name="edit" size={14} />
          Edit
        </Button>
      </div>

      {/* Quick actions — separate section */}
      <div className="border-b border-border px-3 py-2 dark:border-gray-800">
        <div className="flex flex-wrap gap-1">
          {QUICK_ACTIONS.map(({ label, icon }) => (
            <button
              key={label}
              type="button"
              className="flex flex-col items-center gap-0.5 rounded p-1.5 text-muted-foreground transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              title={label}
            >
              <Icon name={icon} size={18} />
              <span className="text-[10px]">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Org — single full-width border below only (above = Quick actions' border-b) */}
      <div className="border-b border-border dark:border-gray-800">
        <div className="px-3 py-3">
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Org
          </span>
          {(() => {
            const org = getOrgById(account.orgId);
            return org ? (
              <Link
                href="/crm/customer/orgs"
                className="mt-1 block truncate text-sm font-medium text-[#006180] hover:underline dark:text-[#80E0FF]"
              >
                {org.name}
              </Link>
            ) : (
              <p className="mt-1 truncate text-sm text-muted-foreground">—</p>
            );
          })()}
        </div>
      </div>

      {/* Contact details — scrollable */}
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-2">
        <div className="space-y-2.5 pl-0 pr-1">
          <DataRow label="Role" value={contact.role} />
          <DataRow label="Email" value={contact.email} />
          <DataRow label="Phone number" value={contact.phone} />
          <DataRow label="Preferred channels" value={contact.preferredChannels} />
          <DataRow label="Create date" value={contact.createDate} />
        </div>
      </div>
    </aside>
  );
}
