"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import Button from "@/components/Button/Button";
import { getContactWithAccount } from "@/lib/mock-data/accounts";
import type { Contact } from "@/types/crm";

export default function ContactDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const initial = getContactWithAccount(id);

  const [contact, setContact] = React.useState<Contact | null>(() =>
    initial ? { ...initial.contact } : null
  );
  const [accountName, setAccountName] = React.useState<string>(
    () => initial?.account.name ?? ""
  );
  const [accountId, setAccountId] = React.useState<string>(
    () => initial?.account.id ?? ""
  );
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    const next = getContactWithAccount(id);
    if (next) {
      setContact({ ...next.contact });
      setAccountName(next.account.name);
      setAccountId(next.account.id);
    } else {
      setContact(null);
    }
  }, [id]);

  const updateContact = (updates: Partial<Contact>) => {
    setContact((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    const next = getContactWithAccount(id);
    if (next) {
      setContact({ ...next.contact });
    }
    setIsEditing(false);
  };

  if (!contact) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-muted-foreground">Contact not found.</p>
      </div>
    );
  }

  const formInput =
    "h-10 w-full rounded-density-md border border-border bg-white px-3 text-sm outline-none focus:border-[#2C365D] focus:ring-1 focus:ring-[#2C365D] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";
  const formLabel = "text-sm font-medium text-gray-900 dark:text-gray-100";
  const labelClass =
    "text-xs font-medium uppercase tracking-wide text-muted-foreground";

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[900px] p-6">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link
            href="/crm/customer"
            className="transition-colors hover:text-gray-900 dark:hover:text-gray-100"
          >
            Customer Management
          </Link>
          <Icon name="chevron_right" size={14} />
          <Link
            href="/crm/customer/contacts"
            className="transition-colors hover:text-gray-900 dark:hover:text-gray-100"
          >
            Contact management
          </Link>
          <Icon name="chevron_right" size={14} />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {contact.name}
          </span>
        </nav>

        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {contact.name}
          </h1>
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" size="md" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="md" onClick={handleSave}>
                Save
              </Button>
            </div>
          ) : (
            <Button size="md" onClick={() => setIsEditing(true)}>
              <Icon name="edit" size={18} className="mr-1.5" />
              Edit
            </Button>
          )}
        </div>

        <section className="rounded-lg border border-border bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Contact details
          </h2>

          {isEditing ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className={formLabel}>Name</label>
                <input
                  type="text"
                  className={formInput}
                  value={contact.name}
                  onChange={(e) => updateContact({ name: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-1.5">
                <label className={formLabel}>Role</label>
                <input
                  type="text"
                  className={formInput}
                  value={contact.role}
                  onChange={(e) => updateContact({ role: e.target.value })}
                  placeholder="e.g. Energy Manager"
                />
              </div>
              <div className="space-y-1.5">
                <label className={formLabel}>Email</label>
                <input
                  type="email"
                  className={formInput}
                  value={contact.email}
                  onChange={(e) => updateContact({ email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className={formLabel}>Phone</label>
                <input
                  type="tel"
                  className={formInput}
                  value={contact.phone}
                  onChange={(e) => updateContact({ phone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
              <div className="flex items-end sm:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={contact.isPrimary}
                    onChange={(e) =>
                      updateContact({ isPrimary: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-border"
                  />
                  <span className={formLabel}>Primary contact for account</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <span className={labelClass}>Name</span>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {contact.name}
                </p>
              </div>
              <div className="space-y-1">
                <span className={labelClass}>Role</span>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {contact.role || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <span className={labelClass}>Email</span>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {contact.email || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <span className={labelClass}>Phone</span>
                <p className="text-sm font-mono text-gray-900 dark:text-gray-100">
                  {contact.phone || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <span className={labelClass}>Primary contact</span>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {contact.isPrimary ? "Yes" : "No"}
                </p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <span className={labelClass}>Account</span>
                <p className="text-sm">
                  <Link
                    href={`/crm/customer/accounts/${accountId}`}
                    className="font-medium text-[#006180] hover:underline dark:text-[#80E0FF]"
                  >
                    {accountName}
                  </Link>
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
