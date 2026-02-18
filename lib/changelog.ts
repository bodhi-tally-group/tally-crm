/**
 * Changelog entries for Tally CRM. Add a new entry when you push to Git.
 * Version 1 = launch product. Pre-launch versions use 0.x (e.g. 0.1, 0.2).
 */

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export const changelogEntries: ChangelogEntry[] = [
  {
    version: "0.1",
    date: "2026-02-18",
    changes: [
      "Case management: Case Queue with list, kanban, and tab views; create, view, edit, delete cases.",
      "SQLite + Prisma for local case persistence (optional); mock data when DB not configured.",
      "Customer management: Orgs, Accounts, Contacts.",
      "New Case modal: Org name and Account name search; Case Owner defaults to logged-in user.",
      "Pipeline page hidden from nav (to be re-enabled later).",
      "Changelog page and version link under logo.",
    ],
  },
];
