"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { changelogEntries } from "@/lib/changelog";

export default function ChangelogPage() {
  return (
    <div className="min-w-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[720px] p-density-xl">
        <Link
          href="/crm"
          className="mb-6 inline-flex items-center gap-1.5 text-muted-foreground hover:text-[#2C365D] hover:underline dark:hover:text-[#7c8cb8]"
          style={{ fontSize: "var(--tally-font-size-sm)" }}
        >
          <Icon name="arrow_back" size={20} />
          Back to Home
        </Link>

        <h1
          className="font-bold text-gray-900 dark:text-gray-100"
          style={{
            fontSize: "var(--tally-font-size-3xl)",
            lineHeight: "var(--tally-line-height-tight)",
          }}
        >
          Changelog
        </h1>
        <p
          className="mt-1 text-muted-foreground"
          style={{ fontSize: "var(--tally-font-size-sm)" }}
        >
          Release history and changes logged when we push to Git.
        </p>

        <div className="mt-8 space-y-10">
          {changelogEntries.map((entry) => (
            <section
              key={entry.version}
              className="rounded-lg border border-border bg-white p-6 dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="flex flex-wrap items-baseline gap-3">
                <h2
                  className="font-semibold text-gray-900 dark:text-gray-100"
                  style={{ fontSize: "var(--tally-font-size-xl)" }}
                >
                  Version {entry.version}
                </h2>
                <time
                  className="text-muted-foreground"
                  style={{ fontSize: "var(--tally-font-size-sm)" }}
                  dateTime={entry.date}
                >
                  {entry.date}
                </time>
              </div>
              <ul className="mt-4 list-inside list-disc space-y-1.5 text-gray-700 dark:text-gray-300" style={{ fontSize: "var(--tally-font-size-sm)" }}>
                {entry.changes.map((change, i) => (
                  <li key={i}>{change}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {changelogEntries.length === 0 && (
          <p className="mt-8 text-muted-foreground" style={{ fontSize: "var(--tally-font-size-sm)" }}>
            No releases logged yet.
          </p>
        )}
      </div>
    </div>
  );
}
