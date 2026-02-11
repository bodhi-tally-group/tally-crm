"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/Card/Card";
import Button from "@/components/Button/Button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const TIMELINE_ITEMS = [
  {
    id: "1",
    type: "call" as const,
    typeLabel: "Outbound Call",
    time: "2 hours ago",
    title: "Contract Renewal Discussion",
    customer: "Veolia Energy",
    summary: "Discussed renewal terms and pricing for Q2 2025. Customer requested volume discount proposal.",
    meta: { duration: "18 min" },
  },
  {
    id: "2",
    type: "email" as const,
    typeLabel: "Email Sent",
    time: "5 hours ago",
    title: "Billing Statement - November 2024",
    customer: "Energy Plus Co",
    summary: "Sent monthly billing statement and payment reminder.",
    meta: { user: "Priya Sharma" },
  },
  {
    id: "3",
    type: "meeting" as const,
    typeLabel: "Meeting Completed",
    time: "Yesterday",
    title: "Quarterly Business Review",
    customer: "Green Solutions",
    summary: "QBR covered usage trends, cost savings, and roadmap for 2025.",
    meta: { user: "Daniel Cooper" },
  },
  {
    id: "4",
    type: "note" as const,
    typeLabel: "Note Added",
    time: "2 days ago",
    title: "Meter Transfer Issue",
    customer: "Aurora Power",
    summary: "Customer reported delay in meter transfer. Follow-up scheduled for next week.",
    meta: { attachments: "1 file" },
  },
];

type FilterType = "all" | "call" | "email" | "meeting" | "note";

const TIMELINE_ICON_CLASSES = {
  call: "bg-[#2C365D]/10 text-[#2C365D] dark:bg-[#7c8cb8]/20 dark:text-[#7c8cb8]",
  email: "bg-blue-50 text-[#0074C4] dark:bg-blue-950/30",
  meeting: "bg-green-50 text-[#008000] dark:bg-green-950/30",
  note: "bg-purple-50 text-[#8B5CF6] dark:bg-purple-950/30",
};

const TIMELINE_TYPE_LABEL_CLASSES = {
  call: "text-[#2C365D] dark:text-[#7c8cb8]",
  email: "text-[#0074C4]",
  meeting: "text-[#008000]",
  note: "text-[#8B5CF6]",
};

export default function CommunicationsPage() {
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");

  const filteredItems =
    typeFilter === "all"
      ? TIMELINE_ITEMS
      : TIMELINE_ITEMS.filter((item) => item.type === typeFilter);

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
              Communications
            </h1>
            <p
              className="mt-density-xs text-muted-foreground"
              style={{ fontSize: "var(--tally-font-size-sm)" }}
            >
              Log calls, emails, meetings, and notes
            </p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mb-density-xl grid grid-cols-1 gap-density-lg sm:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Log Call", desc: "Record an outbound or inbound call", icon: "call", iconColor: "text-[#2C365D] dark:text-[#7c8cb8]" },
            { title: "Send Email", desc: "Compose and send an email to customer", icon: "mail", iconColor: "text-[#0074C4] dark:text-blue-400" },
            { title: "Schedule Meeting", desc: "Book a meeting or call with customer", icon: "event_available", iconColor: "text-[#008000] dark:text-green-400" },
            { title: "Add Note", desc: "Add an internal note or update", icon: "note", iconColor: "text-[#8B5CF6] dark:text-purple-400" },
          ].map((action) => (
            <Card
              key={action.title}
              className="group cursor-pointer transition-all shadow-none hover:border-[#2C365D] hover:shadow-sm dark:hover:border-[#7c8cb8]"
              onClick={() => {}}
            >
              <div className="flex items-center gap-density-md p-density-lg">
                <Icon name={action.icon} size="var(--tally-icon-size-lg)" className={action.iconColor} />
                <div className="min-w-0 flex-1">
                  <p
                    className="font-bold leading-tight text-gray-900 dark:text-gray-100"
                    style={{ fontSize: "var(--tally-font-size-sm)" }}
                  >
                    {action.title}
                  </p>
                  <p
                    className="mt-0.5 truncate text-muted-foreground"
                    style={{ fontSize: "var(--tally-font-size-xs)" }}
                  >
                    {action.desc}
                  </p>
                </div>
                <Icon name="arrow_forward" size="var(--tally-icon-size-md)" className="shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-[#2C365D] dark:group-hover:text-[#7c8cb8]" />
              </div>
            </Card>
          ))}
        </div>

        <p
          className="mb-density-xl text-muted-foreground"
          style={{ fontSize: "var(--tally-font-size-xs)" }}
        >
          Outbound customer emails are sent via SendGrid.
        </p>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-density-lg lg:grid-cols-[1fr_350px]">
          {/* Left: Recent Activity */}
          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-density-lg pb-0">
              <CardTitle
                className="uppercase tracking-wider text-gray-900 dark:text-gray-100"
                style={{ fontSize: "var(--tally-font-size-sm)" }}
              >
                Recent Activity
              </CardTitle>
              <select
                className="rounded-density-md border border-border bg-white py-1.5 px-3 outline-none focus:border-[#2C365D] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                style={{ fontSize: "var(--tally-font-size-sm)" }}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as FilterType)}
              >
                <option value="all">All Types</option>
                <option value="call">Call</option>
                <option value="email">Email</option>
                <option value="meeting">Meeting</option>
                <option value="note">Note</option>
              </select>
            </CardHeader>
            <CardContent className="p-density-lg">
              <div className="relative flex flex-col before:absolute before:bottom-0 before:left-4 before:top-0 before:w-0.5 before:bg-gray-200 before:content-[''] dark:before:bg-gray-700">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative pb-density-lg pl-10 last:pb-0"
                  >
                    <div
                      className={cn(
                        "absolute left-1 top-0 z-[1] flex h-6 w-6 items-center justify-center rounded-full",
                        TIMELINE_ICON_CLASSES[item.type]
                      )}
                    >
                      <Icon
                        name={
                          item.type === "call"
                            ? "call"
                            : item.type === "email"
                              ? "mail"
                              : item.type === "meeting"
                                ? "event_available"
                                : "note"
                        }
                        size="var(--tally-icon-size-sm)"
                      />
                    </div>
                    <div className="rounded-density-md bg-gray-50 p-density-md dark:bg-gray-800">
                      <div className="mb-density-sm flex items-center justify-between">
                        <span
                          className={cn(
                            "font-bold uppercase tracking-wider",
                            TIMELINE_TYPE_LABEL_CLASSES[item.type]
                          )}
                          style={{ fontSize: "var(--tally-font-size-xs)" }}
                        >
                          {item.typeLabel}
                        </span>
                        <span
                          className="text-muted-foreground"
                          style={{ fontSize: "var(--tally-font-size-xs)" }}
                        >
                          {item.time}
                        </span>
                      </div>
                      <div
                        className="mb-density-xs font-medium text-gray-900 dark:text-gray-100"
                        style={{ fontSize: "var(--tally-font-size-sm)" }}
                      >
                        {item.title} with {item.customer}
                      </div>
                      <div
                        className="mb-density-xs text-muted-foreground"
                        style={{ fontSize: "var(--tally-font-size-sm)" }}
                      >
                        {item.customer}
                      </div>
                      <div
                        className="mb-density-sm text-gray-700 dark:text-gray-300"
                        style={{
                          fontSize: "var(--tally-font-size-sm)",
                          lineHeight: "var(--tally-line-height-relaxed)",
                        }}
                      >
                        {item.summary}
                      </div>
                      <div
                        className="flex gap-density-md text-muted-foreground"
                        style={{ fontSize: "var(--tally-font-size-xs)" }}
                      >
                        {"duration" in item.meta && (
                          <span className="flex items-center gap-density-xs">
                            <Icon
                              name="schedule"
                              size="var(--tally-icon-size-sm)"
                            />{" "}
                            {item.meta.duration}
                          </span>
                        )}
                        {"user" in item.meta && (
                          <span className="flex items-center gap-density-xs">
                            <Icon
                              name="person"
                              size="var(--tally-icon-size-sm)"
                            />{" "}
                            {item.meta.user}
                          </span>
                        )}
                        {"attachments" in item.meta && (
                          <span className="flex items-center gap-density-xs">
                            <Icon
                              name="attach_file"
                              size="var(--tally-icon-size-sm)"
                            />{" "}
                            {item.meta.attachments}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Right: Log Communication */}
          <Card className="shadow-none">
            <CardHeader className="p-density-lg pb-density-md">
              <CardTitle
                className="uppercase tracking-wider text-gray-900 dark:text-gray-100"
                style={{ fontSize: "var(--tally-font-size-sm)" }}
              >
                Log Communication
              </CardTitle>
            </CardHeader>
            <CardContent className="p-density-lg pt-0">
              <form>
                <div className="grid grid-cols-2 gap-density-md">
                  <div className="rounded-density-md bg-gray-50 p-density-md dark:bg-gray-800">
                    <label
                      className="mb-density-xs block font-medium text-muted-foreground"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Customer
                    </label>
                    <input
                      type="text"
                      placeholder="Select customer"
                      className="w-full bg-transparent outline-none text-gray-900 placeholder:text-muted-foreground dark:text-gray-100"
                      style={{ fontSize: "var(--tally-font-size-sm)" }}
                    />
                  </div>
                  <div className="rounded-density-md bg-gray-50 p-density-md dark:bg-gray-800">
                    <label
                      className="mb-density-xs block font-medium text-muted-foreground"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Type
                    </label>
                    <input
                      type="text"
                      placeholder="Call, Email, Meeting, Note"
                      className="w-full bg-transparent outline-none text-gray-900 placeholder:text-muted-foreground dark:text-gray-100"
                      style={{ fontSize: "var(--tally-font-size-sm)" }}
                    />
                  </div>
                  <div className="rounded-density-md bg-gray-50 p-density-md dark:bg-gray-800">
                    <label
                      className="mb-density-xs block font-medium text-muted-foreground"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Owner
                    </label>
                    <input
                      type="text"
                      placeholder="Assign owner"
                      className="w-full bg-transparent outline-none text-gray-900 placeholder:text-muted-foreground dark:text-gray-100"
                      style={{ fontSize: "var(--tally-font-size-sm)" }}
                    />
                  </div>
                  <div className="rounded-density-md bg-gray-50 p-density-md dark:bg-gray-800">
                    <label
                      className="mb-density-xs block font-medium text-muted-foreground"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 15 min"
                      className="w-full bg-transparent outline-none text-gray-900 placeholder:text-muted-foreground dark:text-gray-100"
                      style={{ fontSize: "var(--tally-font-size-sm)" }}
                    />
                  </div>
                </div>
                <div className="mt-density-lg">
                  <label
                    className="mb-density-xs block font-medium text-muted-foreground"
                    style={{ fontSize: "var(--tally-font-size-xs)" }}
                  >
                    Summary
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter summary..."
                    className="w-full resize-y rounded-density-md border border-border bg-white p-density-md outline-none placeholder:text-muted-foreground focus:border-[#2C365D] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                    style={{ fontSize: "var(--tally-font-size-sm)" }}
                  />
                </div>
                <Button type="submit" size="sm" className="mt-density-lg">
                  Save
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
