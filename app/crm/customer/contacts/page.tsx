"use client";

import React from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/Table/Table";
import { Icon } from "@/components/ui/icon";
import Button from "@/components/Button/Button";
import { cn } from "@/lib/utils";
import {
  getAllContactsWithAccount,
  getAccountById,
  getAccountsByOrgId,
  mockAccounts,
  mockOrgs,
  type ContactWithAccount,
} from "@/lib/mock-data/accounts";
import type { Contact } from "@/types/crm";

type ContactSortField = "name" | "org" | "role" | "email" | "phone";
type SortDirection = "asc" | "desc";

/* ─── New Contact Modal ───────────────────────────────────────────────── */

function NewContactModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (cwa: ContactWithAccount) => void;
}) {
  const [orgId, setOrgId] = React.useState("");
  const [accountId, setAccountId] = React.useState("");
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [isPrimary, setIsPrimary] = React.useState(false);

  const accountsForOrg = React.useMemo(
    () => (orgId ? getAccountsByOrgId(orgId) : []),
    [orgId]
  );

  const handleOrgChange = (newOrgId: string) => {
    setOrgId(newOrgId);
    setAccountId("");
  };

  const formInput =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const formLabel = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !accountId) return;
    const account = getAccountById(accountId);
    if (!account) return;
    const contact: Contact = {
      id: `con-new-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      email: email.trim(),
      phone: phone.trim(),
      isPrimary,
    };
    onAdd({ contact, account });
    setOrgId("");
    setAccountId("");
    setName("");
    setRole("");
    setEmail("");
    setPhone("");
    setIsPrimary(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-contact-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="max-h-[90vh] w-full max-w-[400px] overflow-y-auto rounded-xl border border-border bg-card shadow-xl dark:border-gray-700 dark:bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-6 dark:border-gray-700">
          <div className="space-y-1.5">
            <h2
              id="new-contact-modal-title"
              className="font-bold text-gray-900 dark:text-gray-100"
              style={{
                fontSize: "var(--tally-font-size-3xl)",
                lineHeight: "var(--tally-line-height-tight)",
              }}
            >
              Add New Contact
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter contact details below
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-6 py-6">
            <div className="space-y-1.5">
              <label className={formLabel}>
                Org <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className={cn(formInput, "cursor-pointer appearance-none pr-9")}
                  value={orgId}
                  onChange={(e) => handleOrgChange(e.target.value)}
                  required
                >
                  <option value="">Select org</option>
                  {mockOrgs.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
                <Icon
                  name="expand_more"
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={formLabel}>
                Account <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className={cn(formInput, "cursor-pointer appearance-none pr-9")}
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  required
                  disabled={!orgId}
                >
                  <option value="">
                    {orgId ? "Select account" : "Select org first"}
                  </option>
                  {accountsForOrg.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
                <Icon
                  name="expand_more"
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={formLabel}>
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={formInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className={formLabel}>Role</label>
              <input
                type="text"
                className={formInput}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Energy Manager"
              />
            </div>

            <div className="space-y-1.5">
              <label className={formLabel}>Email</label>
              <input
                type="email"
                className={formInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className={formLabel}>Phone</label>
              <input
                type="tel"
                className={formInput}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="new-contact-primary"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <label htmlFor="new-contact-primary" className={formLabel}>
                Primary contact for account
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-border px-6 py-4 dark:border-gray-700">
            <Button variant="outline" size="md" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button size="md" type="submit">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ContactManagementPage() {
  const [search, setSearch] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [sortField, setSortField] = React.useState<ContactSortField>("name");
  const [sortDir, setSortDir] = React.useState<SortDirection>("asc");
  const [localContacts, setLocalContacts] = React.useState<ContactWithAccount[]>(
    []
  );

  const contactsWithAccount = React.useMemo(
    () => [...getAllContactsWithAccount(), ...localContacts],
    [localContacts]
  );

  const handleSort = (field: ContactSortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = React.useMemo(() => {
    let result = contactsWithAccount;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (cwa) =>
          cwa.contact.name.toLowerCase().includes(q) ||
          cwa.contact.email.toLowerCase().includes(q) ||
          cwa.account.name.toLowerCase().includes(q) ||
          cwa.contact.role.toLowerCase().includes(q)
      );
    }
    const dir = sortDir === "asc" ? 1 : -1;
    result = [...result].sort((a, b) => {
      switch (sortField) {
        case "name":
          return dir * a.contact.name.localeCompare(b.contact.name);
        case "org":
          return dir * a.account.name.localeCompare(b.account.name);
        case "role":
          return dir * (a.contact.role || "").localeCompare(b.contact.role || "");
        case "email":
          return dir * (a.contact.email || "").localeCompare(b.contact.email || "");
        case "phone":
          return dir * (a.contact.phone || "").localeCompare(b.contact.phone || "");
        default:
          return 0;
      }
    });
    return result;
  }, [contactsWithAccount, search, sortField, sortDir]);

  const renderSortHeader = (
    field: ContactSortField,
    label: string,
    className?: string
  ) => (
    <TableHead key={field} className={className}>
      <button
        type="button"
        onClick={() => handleSort(field)}
        className="inline-flex items-center gap-1 font-medium hover:text-gray-900 dark:hover:text-gray-100"
      >
        {label}
        {sortField === field && (
          <Icon
            name={sortDir === "asc" ? "arrow_upward" : "arrow_downward"}
            size={14}
          />
        )}
      </button>
    </TableHead>
  );

  const handleAddContact = (cwa: ContactWithAccount) => {
    setLocalContacts((prev) => [...prev, cwa]);
  };

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
              Contact management
            </h1>
            <p
              className="mt-density-xs text-muted-foreground"
              style={{ fontSize: "var(--tally-font-size-sm)" }}
            >
              People associated with orgs and accounts
            </p>
          </div>
          <div className="flex items-center gap-density-md">
            <div className="relative w-64 min-w-[200px]">
              <Icon
                name="search"
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="search"
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-density-md border border-border bg-white py-2 pl-9 pr-3 outline-none placeholder:text-muted-foreground focus:border-[#2C365D] focus:ring-1 focus:ring-[#2C365D] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                style={{ fontSize: "var(--tally-font-size-sm)" }}
              />
            </div>
            <Button
              size="md"
              className="gap-1.5"
              onClick={() => setModalOpen(true)}
            >
              <Icon name="add" size={18} className="mr-1" />
              Add New Contact
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-white dark:border-gray-700 dark:bg-gray-900">
          <Table dense>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {renderSortHeader("name", "Contact name")}
                {renderSortHeader("org", "Org")}
                {renderSortHeader("role", "Role")}
                {renderSortHeader("email", "Email")}
                {renderSortHeader("phone", "Phone")}
                <TableHead className="w-10" aria-hidden />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(({ contact, account }: ContactWithAccount) => (
                <TableRow key={`${account.id}-${contact.id}`}>
                  <TableCell>
                    <Link
                      href={`/crm/customer/contacts/${contact.id}`}
                      className="font-medium text-[#006180] hover:underline dark:text-[#80E0FF]"
                    >
                      {contact.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/crm/customer/accounts/${account.id}`}
                      className="text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100"
                    >
                      {account.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {contact.role || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {contact.email || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {contact.phone || "—"}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/crm/customer/contacts/${contact.id}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                      aria-label={`Open ${contact.name} details`}
                    >
                      <Icon name="chevron_right" size={18} />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No contacts match your search.
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <NewContactModal
          onClose={() => setModalOpen(false)}
          onAdd={handleAddContact}
        />
      )}
    </div>
  );
}
