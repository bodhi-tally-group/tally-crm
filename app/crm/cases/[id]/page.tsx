"use client";

import React from "react";
import { useParams } from "next/navigation";
import { getCaseById, mockCases } from "@/lib/mock-data/cases";
import { getAccountById } from "@/lib/mock-data/accounts";
import AccountContextPanel from "@/components/crm/AccountContextPanel";
import CaseDetailContent from "@/components/crm/CaseDetailContent";

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.id as string;

  const caseItem = getCaseById(caseId) ?? mockCases[0];
  const account = getAccountById(caseItem.accountId);

  if (!account) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Account not found.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
      <AccountContextPanel account={account} />

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-auto">
        <CaseDetailContent caseItem={caseItem} account={account} showBreadcrumbs />
      </div>
    </div>
  );
}
