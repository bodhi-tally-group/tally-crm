"use client";

import React from "react";
import { useParams } from "next/navigation";
import { getContactWithAccount } from "@/lib/mock-data/accounts";
import ContactContextPanel from "@/components/crm/ContactContextPanel";
import ContactDetailContent from "@/components/crm/ContactDetailContent";

export default function ContactDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const contactWithAccount = getContactWithAccount(id);

  if (!contactWithAccount) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-muted-foreground">Contact not found.</p>
      </div>
    );
  }

  const { contact, account } = contactWithAccount;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
      <ContactContextPanel contact={contact} account={account} />

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-auto">
        <ContactDetailContent
          contact={contact}
          account={account}
          showBreadcrumbs
        />
      </div>
    </div>
  );
}
