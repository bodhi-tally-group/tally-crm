"use client";

import React from "react";
import { Icon } from "@/components/ui/icon";
import SLAIndicator from "@/components/crm/SLAIndicator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/Dialog/Dialog";
import { mockCases } from "@/lib/mock-data/cases";
import { getAccountById } from "@/lib/mock-data/accounts";
import type { Account, CaseItem } from "@/types/crm";

interface LinkCaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCaseId: string;
  account: Account;
  existingRelatedCaseNumbers: string[];
  onSelectCase: (caseNumber: string) => void;
}

export default function LinkCaseModal({
  open,
  onOpenChange,
  currentCaseId,
  account,
  existingRelatedCaseNumbers,
  onSelectCase,
}: LinkCaseModalProps) {
  const [search, setSearch] = React.useState("");

  const candidates = React.useMemo(() => {
    const set = new Set(existingRelatedCaseNumbers);
    return mockCases.filter((c) => {
      if (c.id === currentCaseId) return false;
      if (set.has(c.caseNumber)) return false;
      const acc = getAccountById(c.accountId);
      if (acc?.orgId !== account.orgId) return false;
      return true;
    });
  }, [currentCaseId, account.orgId, existingRelatedCaseNumbers]);

  const filtered = React.useMemo(() => {
    if (!search.trim()) return candidates;
    const q = search.trim().toLowerCase();
    return candidates.filter(
      (c) =>
        c.caseNumber.toLowerCase().includes(q) ||
        c.accountName.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q)
    );
  }, [candidates, search]);

  const handleSelect = (c: CaseItem) => {
    onSelectCase(c.caseNumber);
    onOpenChange(false);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] flex flex-col gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-border px-4 py-3 dark:border-gray-700">
          <DialogTitle className="text-base">Link a case</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Choose a case from the same organisation to link.
          </p>
          <DialogClose />
        </DialogHeader>

        <div className="flex flex-col min-h-0 flex-1">
          <div className="border-b border-border px-4 py-2 dark:border-gray-700">
            <div className="relative">
              <Icon
                name="search"
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by case number, account, or status..."
                className="w-full rounded-md border border-border bg-white py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-[#2C365D] focus:ring-1 focus:ring-[#2C365D] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <ul className="overflow-y-auto p-2 max-h-[50vh] space-y-2">
            {filtered.length === 0 ? (
              <li className="py-8 text-center text-sm text-muted-foreground">
                {candidates.length === 0
                  ? "No other cases in this organisation to link."
                  : "No cases match your search."}
              </li>
            ) : (
              filtered.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(c)}
                    className="flex w-full flex-col rounded-lg border border-border bg-gray-50/80 px-3 py-2.5 text-left transition-colors hover:border-[#2C365D] hover:bg-[#2C365D]/5 dark:border-gray-700 dark:bg-gray-800/40 dark:hover:border-[#7c8cb8] dark:hover:bg-[#7c8cb8]/10"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {c.caseNumber}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground" title={c.accountName}>
                      {c.accountName}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <span className="truncate text-[11px] text-muted-foreground">{c.status}</span>
                      <SLAIndicator status={c.slaStatus} size="sm" showIcon={false} className="shrink-0 text-[11px]" />
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
