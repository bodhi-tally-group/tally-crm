"use client";

import React from "react";
import { useParams } from "next/navigation";
import { getCaseById, mockCases } from "@/lib/mock-data/cases";
import { getAccountById } from "@/lib/mock-data/accounts";
import { useCaseLinksOverrides } from "@/lib/case-links-overrides";
import AccountContextPanel from "@/components/crm/AccountContextPanel";
import CaseDetailContent from "@/components/crm/CaseDetailContent";
import LinkCaseModal from "@/components/crm/LinkCaseModal";

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.id as string;
  const [linkModalOpen, setLinkModalOpen] = React.useState(false);
  const { getRelatedCases, addLink } = useCaseLinksOverrides();

  const caseItem = getCaseById(caseId) ?? mockCases[0];
  const account = getAccountById(caseItem.accountId);
  const relatedCaseNumbers = getRelatedCases(caseItem.id);

  if (!account) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Account not found.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
      <AccountContextPanel
        account={account}
        linkedCaseNumbers={relatedCaseNumbers}
        currentCaseId={caseItem.id}
        onOpenLinkModal={() => setLinkModalOpen(true)}
      />

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-auto">
        <CaseDetailContent
          caseItem={caseItem}
          account={account}
          showBreadcrumbs
          relatedCaseNumbers={relatedCaseNumbers}
          onOpenLinkModal={() => setLinkModalOpen(true)}
        />
      </div>

      <LinkCaseModal
        open={linkModalOpen}
        onOpenChange={setLinkModalOpen}
        currentCaseId={caseItem.id}
        account={account}
        existingRelatedCaseNumbers={relatedCaseNumbers}
        onSelectCase={(caseNumber) => addLink(caseItem.id, caseNumber)}
      />
    </div>
  );
}
