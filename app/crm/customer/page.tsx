"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

const sections = [
  {
    title: "Org Management",
    description: "Parent companies and organisations",
    href: "/crm/customer/orgs",
    icon: "apartment",
  },
  {
    title: "Account management",
    description: "Accounts within each org — departments, sections, and sites",
    href: "/crm/customer/accounts",
    icon: "business",
  },
  {
    title: "Contact management",
    description: "People associated with orgs and accounts",
    href: "/crm/customer/contacts",
    icon: "person",
  },
] as const;

export default function CustomerManagementPage() {
  return (
    <div className="min-w-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[900px] p-density-xl">
        <div className="mb-density-xl">
          <h1
            className="font-bold text-gray-900 dark:text-gray-100"
            style={{
              fontSize: "var(--tally-font-size-3xl)",
              lineHeight: "var(--tally-line-height-tight)",
            }}
          >
            Customer Management
          </h1>
          <p
            className="mt-density-xs text-muted-foreground"
            style={{ fontSize: "var(--tally-font-size-sm)" }}
          >
            Orgs, accounts, and contacts
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {sections.map(({ title, description, href, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col gap-3 rounded-lg border border-border bg-white p-6 transition-colors hover:border-[#2C365D] hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-[#2C365D] dark:hover:bg-gray-800"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2C365D]/10 text-[#2C365D] dark:bg-[#2C365D]/20 dark:text-[#80E0FF]">
                <Icon name={icon} size={24} />
              </span>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-[#006180] dark:text-[#80E0FF]">
                Open
                <Icon name="arrow_forward" size={16} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
