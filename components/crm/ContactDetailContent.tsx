"use client";

import React from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Tabs/Tabs";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { Account, Contact } from "@/types/crm";

function DataHighlight({
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
        {value ?? "—"}
      </span>
    </div>
  );
}

interface ContactDetailContentProps {
  contact: Contact;
  account: Account;
  showBreadcrumbs?: boolean;
}

const ACTIVITY_COUNT = 5;

export default function ContactDetailContent({
  contact,
  account,
  showBreadcrumbs = true,
}: ContactDetailContentProps) {
  const [activeTab, setActiveTab] = React.useState("overview");

  return (
    <div className="min-w-0 w-full px-density-xl pt-4 pb-density-xl">
      <div className="mx-auto w-full min-w-0 max-w-[1400px]">
        {showBreadcrumbs && (
          <nav className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link
              href="/crm/customer/contacts"
              className="transition-colors hover:text-gray-900 dark:hover:text-gray-100"
            >
              Contacts
            </Link>
            <Icon name="chevron_right" size={14} />
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {contact.name}
            </span>
          </nav>
        )}

        {/* Header */}
        <div className="mb-2">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {contact.name}
          </h1>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Small viewport: dropdown */}
          <div className="relative mb-3 sm:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-border bg-gray-100 py-2.5 pl-3 pr-9 text-sm font-medium text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="overview">Overview</option>
              <option value="activities">Activities</option>
            </select>
            <Icon
              name="expand_more"
              size={20}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            />
          </div>

          {/* Horizontal tabs */}
          <div className="mb-3">
            <TabsList className="hidden h-10 gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800 sm:inline-flex">
              <TabsTrigger
                value="overview"
                className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="activities"
                className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100"
              >
                Activities
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview tab */}
          <TabsContent value="overview" className="mt-0 w-full">
            <div className="space-y-4">
              {/* Data highlights */}
              <section className="rounded-lg border border-border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    Data highlights
                  </h3>
                  <button
                    type="button"
                    className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Settings"
                  >
                    <Icon name="settings" size={16} className="text-muted-foreground" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <DataHighlight label="Create date" value={contact.createDate} />
                  <DataHighlight label="Lifecycle stage" value={contact.lifecycleStage} />
                  <DataHighlight label="Last activity date" value={contact.lastActivityDate} />
                </div>
              </section>

              {/* Recent activities */}
              <section className="rounded-lg border border-border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    Recent activities
                  </h3>
                </div>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <div className="relative flex-1 min-w-[180px]">
                    <Icon
                      name="search"
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="search"
                      placeholder="Search activities"
                      className="w-full rounded-lg border border-border bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-[#2C365D] focus:ring-1 focus:ring-[#2C365D] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Filter by: {ACTIVITY_COUNT} activities
                    <Icon name="expand_more" size={16} />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    All time so far
                  </button>
                </div>
                {/* Empty state */}
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 dark:border-gray-700">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <Icon name="search" size={32} className="text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    No activities.
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Activities for this contact will appear here.
                  </p>
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="mt-0 w-full">
            <div className="rounded-lg border border-border bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Activities
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Activity history for this contact.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
