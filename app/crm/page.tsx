"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/Button/Button";
import NewCaseModal from "@/components/crm/NewCaseModal";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { mockCases } from "@/lib/mock-data/cases";
import type { CaseItem } from "@/types/crm";

const useDatabase = () =>
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_USE_DATABASE === "true";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-AU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Mock meetings schedule
const mockMeetings = [
  { id: "1", time: "9:00 AM", title: "Stand-up", attendees: "Product team", duration: "15 min" },
  { id: "2", time: "10:30 AM", title: "Client call – Bowen Basin", attendees: "James Whitfield", duration: "45 min" },
  { id: "3", time: "2:00 PM", title: "Pipeline review", attendees: "Sales team", duration: "1 hr" },
  { id: "4", time: "4:00 PM", title: "Sprint planning", attendees: "Engineering", duration: "1 hr" },
];

// Mock tasks (open and completed)
const mockTasksOpen = [
  { id: "t1", title: "Follow up with Brians Carpentry", due: "Today", status: "Open" },
  { id: "t2", title: "Send proposal to Gladstone Aluminium", due: "Tomorrow", status: "Open" },
  { id: "t3", title: "Update case LM-0045721 notes", due: "Today", status: "Open" },
];
const mockTasksCompleted = [
  { id: "t4", title: "Review contract terms", due: "Yesterday", status: "Completed" },
  { id: "t5", title: "Schedule site visit", due: "Yesterday", status: "Completed" },
];

// ─── Page ───────────────────────────────────────────────────────────────────

export default function CRMHomePage() {
  const router = useRouter();
  const [taskFilter, setTaskFilter] = React.useState<"open" | "completed">("open");
  const [newCaseModalOpen, setNewCaseModalOpen] = React.useState(false);
  const useDb = useDatabase();
  const greeting = getGreeting();
  const displayName = "John"; // From user John Smith; could come from auth/session

  const createCaseViaApi = React.useCallback(
    (caseData: CaseItem) =>
      fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(caseData),
      }).then((r) => {
        if (!r.ok) throw new Error("Create failed");
        return r.json() as Promise<CaseItem>;
      }),
    []
  );

  return (
    <div className="min-w-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[900px] p-density-xl">
        {/* Date, greeting, and Cases / New Case actions */}
        <div className="flex flex-wrap items-start justify-between gap-density-lg">
          <div>
            <p
              className="text-muted-foreground"
              style={{ fontSize: "var(--tally-font-size-sm)" }}
            >
              {formatDate(new Date())}
            </p>
            <h1
              className="mt-density-xs font-bold text-gray-900 dark:text-gray-100"
              style={{
                fontSize: "var(--tally-font-size-4xl)",
                lineHeight: "var(--tally-line-height-tight)",
              }}
            >
              {greeting}, {displayName}
            </h1>
          </div>
          <div className="flex items-center gap-density-md">
            <Link
              href="/crm/cases"
              className="font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]"
              style={{ fontSize: "var(--tally-font-size-sm)" }}
            >
              My Cases
            </Link>
            <Button size="md" className="gap-1.5" onClick={() => setNewCaseModalOpen(true)}>
              <Icon name="add" size="var(--tally-icon-size-sm)" className="mr-1" />
              New Case
            </Button>
          </div>
        </div>

        {/* Meetings block */}
        <div className="mt-density-xl">
          <div className="mb-density-md flex items-center gap-density-sm">
            <Icon
              name="calendar_month"
              size="var(--tally-icon-size-lg)"
              className="text-[#2C365D] dark:text-[#7c8cb8]"
            />
            <h2
              className="font-semibold text-gray-900 dark:text-gray-100"
              style={{ fontSize: "var(--tally-font-size-lg)" }}
            >
              Meetings
            </h2>
          </div>
          <div className="overflow-x-auto rounded-density-md border border-border bg-white dark:border-gray-700 dark:bg-gray-800">
            <table className="w-full border-collapse" style={{ fontSize: "var(--tally-font-size-sm)" }}>
              <thead>
                <tr className="border-b border-border bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                  <th className="px-density-lg py-density-md text-left font-medium text-muted-foreground">Time</th>
                  <th className="px-density-lg py-density-md text-left font-medium text-muted-foreground">Meeting</th>
                  <th className="px-density-lg py-density-md text-left font-medium text-muted-foreground">Attendees</th>
                  <th className="px-density-lg py-density-md text-left font-medium text-muted-foreground">Duration</th>
                </tr>
              </thead>
              <tbody>
                {mockMeetings.map((meeting) => (
                  <tr
                    key={meeting.id}
                    className="border-b border-border last:border-b-0 dark:border-gray-700"
                  >
                    <td className="px-density-lg py-density-md text-gray-900 dark:text-gray-100">{meeting.time}</td>
                    <td className="px-density-lg py-density-md font-medium text-gray-900 dark:text-gray-100">{meeting.title}</td>
                    <td className="px-density-lg py-density-md text-muted-foreground">{meeting.attendees}</td>
                    <td className="px-density-lg py-density-md text-muted-foreground">{meeting.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tasks block */}
        <div className="mt-density-xxl">
          <div className="mb-density-md flex flex-wrap items-center justify-between gap-density-md">
            <div className="flex items-center gap-density-sm">
              <Icon
                name="task_alt"
                size="var(--tally-icon-size-lg)"
                className="text-[#2C365D] dark:text-[#7c8cb8]"
              />
              <h2
                className="font-semibold text-gray-900 dark:text-gray-100"
                style={{ fontSize: "var(--tally-font-size-lg)" }}
              >
                Tasks
              </h2>
              <button
                type="button"
                className="ml-density-sm rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Add task"
              >
                <Icon name="add" size="var(--tally-icon-size-md)" className="text-muted-foreground" />
              </button>
            </div>
            <div className="flex rounded-density-sm border border-border dark:border-gray-600">
              <button
                type="button"
                onClick={() => setTaskFilter("open")}
                className={cn(
                  "px-density-md py-density-sm text-left transition-colors",
                  taskFilter === "open"
                    ? "bg-[#2C365D] font-medium text-white dark:bg-[#7c8cb8]"
                    : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                )}
                style={{ fontSize: "var(--tally-font-size-xs)" }}
              >
                Open
              </button>
              <button
                type="button"
                onClick={() => setTaskFilter("completed")}
                className={cn(
                  "px-density-md py-density-sm text-left transition-colors",
                  taskFilter === "completed"
                    ? "bg-[#2C365D] font-medium text-white dark:bg-[#7c8cb8]"
                    : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                )}
                style={{ fontSize: "var(--tally-font-size-xs)" }}
              >
                Completed
              </button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-density-md border border-border bg-white dark:border-gray-700 dark:bg-gray-800">
            <table className="w-full border-collapse" style={{ fontSize: "var(--tally-font-size-sm)" }}>
              <thead>
                <tr className="border-b border-border bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                  <th className="px-density-lg py-density-md text-left font-medium text-muted-foreground">Task</th>
                  <th className="px-density-lg py-density-md text-left font-medium text-muted-foreground">Due</th>
                  <th className="px-density-lg py-density-md text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {(taskFilter === "open" ? mockTasksOpen : mockTasksCompleted).map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-border last:border-b-0 dark:border-gray-700"
                  >
                    <td className="px-density-lg py-density-md font-medium text-gray-900 dark:text-gray-100">{task.title}</td>
                    <td className="px-density-lg py-density-md text-muted-foreground">{task.due}</td>
                    <td className="px-density-lg py-density-md text-muted-foreground">{task.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link
            href="#"
            className="mt-density-md inline-block font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]"
            style={{ fontSize: "var(--tally-font-size-sm)" }}
          >
            See all tasks
          </Link>
        </div>

        {newCaseModalOpen && (
          <NewCaseModal
            onClose={() => setNewCaseModalOpen(false)}
            onCreate={(newCase) => {
              setNewCaseModalOpen(false);
              if (useDb && newCase?.id) router.push(`/crm/cases/${newCase.id}`);
            }}
            caseCount={mockCases.length}
            createViaApi={useDb ? createCaseViaApi : undefined}
          />
        )}
      </div>
    </div>
  );
}
