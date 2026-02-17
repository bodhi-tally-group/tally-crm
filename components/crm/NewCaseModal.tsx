"use client";

import React from "react";
import Button from "@/components/Button/Button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { mockAccounts } from "@/lib/mock-data/accounts";
import {
  CASE_TYPE_GROUPS,
  CASE_GROUP_TO_TYPE,
  CASE_TYPE_TO_GROUP,
  CASE_GROUP_TO_REASON,
} from "@/lib/mock-data/case-types";
import type { CaseItem, CasePriority, CaseStatus, CaseType } from "@/types/crm";

const CASE_PRIORITIES: CasePriority[] = ["Critical", "High", "Medium", "Low"];
const CASE_ORIGINS = ["Phone", "Email", "Web", "Chat", "Social Media"] as const;
const CASE_REASONS = [
  "Billing Dispute",
  "Service Quality",
  "Meter Issue",
  "Rate Review",
  "New Connection",
  "Contract Amendment",
  "Payment Issue",
  "General Enquiry",
  "Other",
] as const;
const OWNER_OPTIONS = ["Priya Sharma", "Daniel Cooper", "John Smith", "Unassigned"];
const CASE_STATUSES: CaseStatus[] = ["New", "In Progress", "Pending", "Resolved", "Closed"];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export interface NewCaseModalProps {
  onClose: () => void;
  onCreate: (newCase: CaseItem) => void;
  caseCount: number;
}

export default function NewCaseModal({ onClose, onCreate, caseCount }: NewCaseModalProps) {
  const [contactName, setContactName] = React.useState("");
  const [contactId, setContactId] = React.useState("");
  const [accountId, setAccountId] = React.useState("");
  const [siteId, setSiteId] = React.useState("");
  const [webEmail, setWebEmail] = React.useState("");
  const [status, setStatus] = React.useState<CaseStatus>("New");
  const [caseOrigin, setCaseOrigin] = React.useState("");
  const [caseGroup, setCaseGroup] = React.useState("");
  const [caseType, setCaseType] = React.useState("");
  const [priority, setPriority] = React.useState<CasePriority>("Medium");
  const [caseReason, setCaseReason] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [owner, setOwner] = React.useState(OWNER_OPTIONS[0] ?? "");
  const [caseDocumentationFiles, setCaseDocumentationFiles] = React.useState<File[]>([]);
  const caseDocInputRef = React.useRef<HTMLInputElement>(null);

  const [accountSearch, setAccountSearch] = React.useState("");
  const [accountDropdownOpen, setAccountDropdownOpen] = React.useState(false);
  const accountInputRef = React.useRef<HTMLInputElement>(null);

  const filteredAccounts = React.useMemo(() => {
    if (!accountSearch) return mockAccounts;
    const q = accountSearch.toLowerCase();
    return mockAccounts.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.accountNumber.toLowerCase().includes(q)
    );
  }, [accountSearch]);

  const selectedAccount = mockAccounts.find((a) => a.id === accountId);

  const availableSites = React.useMemo(
    () => selectedAccount?.sites ?? [],
    [selectedAccount]
  );
  const [siteDropdownOpen, setSiteDropdownOpen] = React.useState(false);
  const siteDropdownRef = React.useRef<HTMLDivElement>(null);

  const availableContacts = React.useMemo(() => {
    if (!accountId || !siteId) return [];
    const acc = mockAccounts.find((a) => a.id === accountId);
    return acc?.contacts ?? [];
  }, [accountId, siteId]);

  const [contactDropdownOpen, setContactDropdownOpen] = React.useState(false);
  const contactDropdownRef = React.useRef<HTMLDivElement>(null);

  const [emailDropdownOpen, setEmailDropdownOpen] = React.useState(false);
  const emailDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        accountInputRef.current &&
        !accountInputRef.current.parentElement?.contains(e.target as Node)
      ) {
        setAccountDropdownOpen(false);
      }
      if (
        siteDropdownRef.current &&
        !siteDropdownRef.current.contains(e.target as Node)
      ) {
        setSiteDropdownOpen(false);
      }
      if (
        contactDropdownRef.current &&
        !contactDropdownRef.current.contains(e.target as Node)
      ) {
        setContactDropdownOpen(false);
      }
      if (
        emailDropdownRef.current &&
        !emailDropdownRef.current.contains(e.target as Node)
      ) {
        setEmailDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const saveAndNewRef = React.useRef(false);

  const resetForm = () => {
    setContactName("");
    setContactId("");
    setAccountId("");
    setSiteId("");
    setAccountSearch("");
    setWebEmail("");
    setStatus("New");
    setCaseOrigin("");
    setCaseGroup("");
    setCaseType("");
    setPriority("Medium");
    setCaseReason("");
    setSubject("");
    setDescription("");
    setOwner(OWNER_OPTIONS[0] ?? "");
    setCaseDocumentationFiles([]);
  };

  const buildCase = (): CaseItem => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return {
      id: `case-${String(caseCount + 1).padStart(3, "0")}`,
      caseNumber: `CS-2026-${String(caseCount + 1847).padStart(6, "0")}`,
      accountId: accountId || "acc-001",
      accountName: selectedAccount?.name ?? "Unknown Account",
      type: (CASE_GROUP_TO_TYPE[caseGroup] ?? CASE_GROUP_TO_TYPE[CASE_TYPE_TO_GROUP[caseType]] ?? "Enquiry") as CaseType,
      subType: caseType || caseReason || "General Enquiry",
      status,
      priority,
      slaStatus: "On Track",
      slaDeadline: "",
      slaTimeRemaining: "4d 0h",
      owner,
      team: "Large Market Support",
      createdDate: dateStr,
      updatedDate: dateStr,
      description,
      resolution: "",
      communications: [],
      activities: [],
      attachments: caseDocumentationFiles.map((file, i) => ({
        id: `att-${Date.now()}-${i}`,
        name: file.name,
        type: file.type || "application/octet-stream",
        size: formatFileSize(file.size),
        uploadedBy: owner,
        uploadedDate: new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "2-digit", year: "numeric" }),
      })),
      relatedCases: [],
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(buildCase());
    if (saveAndNewRef.current) {
      resetForm();
      saveAndNewRef.current = false;
    } else {
      onClose();
    }
  };

  const formInput =
    "h-10 w-full rounded-density-md border border-border bg-white px-3 outline-none placeholder:text-muted-foreground focus:border-[#2C365D] focus:ring-1 focus:ring-[#2C365D] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";
  const formLabel = "text-sm font-medium text-gray-900 dark:text-gray-100";
  const sectionHeading =
    "col-span-2 pt-1 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-gray-400";
  const sectionHeadingWithDivider =
    "col-span-2 pt-4 pb-1.5 mt-1 border-b border-border mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:border-gray-700 dark:text-gray-400";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-case-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="max-h-[90vh] w-full max-w-[720px] overflow-y-auto rounded-xl border border-border bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4 dark:border-gray-700">
          <h2
            id="new-case-modal-title"
            className="text-lg font-bold text-gray-900 dark:text-gray-100"
          >
            New Case
          </h2>
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
          <div className="px-6 py-4 space-y-4">
            <div className="space-y-1">
              <label className={formLabel}>Case Owner</label>
              <div className="relative max-w-xs">
                <select
                  className={cn(formInput, "cursor-pointer appearance-none pr-9")}
                  style={{ fontSize: "var(--tally-font-size-sm)" }}
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                >
                  {OWNER_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
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

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-0">
              <div className={sectionHeadingWithDivider}>Case Information</div>

              <div className="relative space-y-1.5">
                <label className={formLabel}>
                  Account Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={accountInputRef}
                    type="text"
                    className={formInput}
                    style={{ fontSize: "var(--tally-font-size-sm)" }}
                    value={selectedAccount ? selectedAccount.name : accountSearch}
                    onChange={(e) => {
                      setAccountId("");
                      setAccountSearch(e.target.value);
                      setAccountDropdownOpen(true);
                    }}
                    onFocus={() => {
                      if (selectedAccount) {
                        setAccountSearch(selectedAccount.name);
                        setAccountId("");
                      }
                      setAccountDropdownOpen(true);
                    }}
                    placeholder="Search Accounts..."
                    required
                  />
                  <Icon
                    name="search"
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                </div>
                {accountDropdownOpen && (
                  <div className="absolute left-0 top-full z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-md border border-border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                    {filteredAccounts.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No accounts found
                      </div>
                    ) : (
                      filteredAccounts.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => {
                            setAccountId(a.id);
                            setAccountSearch("");
                            setSiteId("");
                            setContactId("");
                            setContactName("");
                            setWebEmail("");
                            setAccountDropdownOpen(false);
                          }}
                        >
                          <Icon name="domain" size={14} className="text-muted-foreground" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{a.name}</p>
                            <p className="text-xs text-muted-foreground">{a.accountNumber}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="relative space-y-1.5" ref={siteDropdownRef}>
                <label className={formLabel}>Site</label>
                <div className="relative">
                  <button
                    type="button"
                    className={cn(formInput, "flex items-center justify-between text-left cursor-pointer")}
                    style={{ fontSize: "var(--tally-font-size-sm)" }}
                    onClick={() => setSiteDropdownOpen((o) => !o)}
                  >
                    <span className={!siteId ? "text-muted-foreground" : ""}>
                      {siteId ? availableSites.find((s) => s.id === siteId)?.name ?? siteId : "Select site"}
                    </span>
                    <Icon name="expand_more" size={16} className="text-muted-foreground shrink-0" />
                  </button>
                </div>
                {siteDropdownOpen && (
                  <div className="absolute left-0 top-full z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-md border border-border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                    {availableSites.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        {accountId ? "No sites for this account" : "Select an account first"}
                      </div>
                    ) : (
                      availableSites.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => {
                            setSiteId(s.id);
                            setContactId("");
                            setContactName("");
                            setWebEmail("");
                            setSiteDropdownOpen(false);
                          }}
                        >
                          <Icon name="place" size={14} className="text-muted-foreground" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">{s.name}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="relative space-y-1.5" ref={contactDropdownRef}>
                <label className={formLabel}>Contact Name</label>
                <div className="relative">
                  <button
                    type="button"
                    className={cn(formInput, "flex items-center justify-between text-left cursor-pointer")}
                    style={{ fontSize: "var(--tally-font-size-sm)" }}
                    onClick={() => setContactDropdownOpen((o) => !o)}
                  >
                    <span className={!contactName ? "text-muted-foreground" : ""}>
                      {contactName || "Select contact"}
                    </span>
                    <Icon name="expand_more" size={16} className="text-muted-foreground shrink-0" />
                  </button>
                </div>
                {contactDropdownOpen && (
                  <div className="absolute left-0 top-full z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-md border border-border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                    {availableContacts.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        {accountId && siteId ? "No contacts for this account" : "Select an account and site first"}
                      </div>
                    ) : (
                      availableContacts.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => {
                            setContactId(c.id);
                            setContactName(c.name);
                            setWebEmail(c.email);
                            setContactDropdownOpen(false);
                          }}
                        >
                          <Icon name="person" size={14} className="text-muted-foreground" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{c.name}</p>
                            <p className="text-xs text-muted-foreground">{c.email}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="relative space-y-1.5" ref={emailDropdownRef}>
                <label className={formLabel}>Email</label>
                <div className="relative">
                  <button
                    type="button"
                    className={cn(formInput, "flex items-center justify-between text-left cursor-pointer")}
                    style={{ fontSize: "var(--tally-font-size-sm)" }}
                    onClick={() => setEmailDropdownOpen((o) => !o)}
                  >
                    <span className={!webEmail ? "text-muted-foreground" : ""}>
                      {webEmail || "Select email"}
                    </span>
                    <Icon name="expand_more" size={16} className="text-muted-foreground shrink-0" />
                  </button>
                </div>
                {emailDropdownOpen && (
                  <div className="absolute left-0 top-full z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-md border border-border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                    {availableContacts.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        {accountId && siteId ? "No contacts for this account" : "Select an account and site first"}
                      </div>
                    ) : (
                      availableContacts.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => {
                            setContactId(c.id);
                            setContactName(c.name);
                            setWebEmail(c.email);
                            setEmailDropdownOpen(false);
                          }}
                        >
                          <Icon name="mail" size={14} className="text-muted-foreground" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{c.name}</p>
                            <p className="text-xs text-muted-foreground">{c.email}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className={sectionHeadingWithDivider}>Additional Information</div>

              <div className="space-y-1">
                <label className={formLabel}>Status <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    className={cn(formInput, "cursor-pointer appearance-none pr-9", "disabled:cursor-not-allowed disabled:opacity-60")}
                    style={{ fontSize: "var(--tally-font-size-sm)" }}
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CaseStatus)}
                    disabled
                  >
                    {CASE_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
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

              <div className="space-y-1 col-span-2">
                <label className={formLabel}>Case Documentation</label>
                <input
                  ref={caseDocInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    const chosen = e.target.files;
                    if (chosen?.length) {
                      setCaseDocumentationFiles((prev) => [...prev, ...Array.from(chosen)]);
                      e.target.value = "";
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => caseDocInputRef.current?.click()}
                  className={cn(
                    formInput,
                    "flex cursor-pointer items-center gap-2 border-dashed text-left text-muted-foreground hover:border-[#2C365D] hover:bg-gray-50/50 hover:text-gray-700 dark:hover:bg-gray-800/50 dark:hover:text-gray-300"
                  )}
                  style={{ fontSize: "var(--tally-font-size-sm)" }}
                >
                  <Icon name="upload" size={20} className="shrink-0" />
                  <span>Choose files from device</span>
                </button>
                {caseDocumentationFiles.length > 0 && (
                  <ul className="mt-2 space-y-1.5 rounded-md border border-border bg-gray-50/50 py-2 px-3 dark:border-gray-700 dark:bg-gray-800/30">
                    {caseDocumentationFiles.map((file, index) => (
                      <li
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between gap-2 text-sm"
                      >
                        <span className="truncate text-gray-700 dark:text-gray-300" title={file.name}>
                          {file.name}
                        </span>
                        <span className="shrink-0 text-muted-foreground">{formatFileSize(file.size)}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setCaseDocumentationFiles((prev) => prev.filter((_, i) => i !== index))
                          }
                          className="shrink-0 rounded p-1 text-muted-foreground hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                          aria-label={`Remove ${file.name}`}
                        >
                          <Icon name="close" size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-1">
                <label className={formLabel}>Case Origin <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    className={cn(formInput, "cursor-pointer appearance-none pr-9")}
                    style={{ fontSize: "var(--tally-font-size-sm)" }}
                    value={caseOrigin}
                    onChange={(e) => setCaseOrigin(e.target.value)}
                    required
                  >
                    <option value="">--None--</option>
                    {CASE_ORIGINS.map((o) => (
                      <option key={o} value={o}>
                        {o}
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

              <div className="space-y-1">
                <label className={formLabel}>Case Group</label>
                <div className="relative">
                  <select
                    className={cn(formInput, "cursor-pointer appearance-none pr-9")}
                    style={{ fontSize: "var(--tally-font-size-sm)" }}
                    value={caseGroup}
                    onChange={(e) => {
                      const nextGroup = e.target.value;
                      setCaseGroup(nextGroup);
                      const typesInGroup = CASE_TYPE_GROUPS[nextGroup] ?? [];
                      if (caseType && !typesInGroup.includes(caseType)) {
                        setCaseType("");
                      }
                    }}
                  >
                    <option value="">--Select case group--</option>
                    {Object.keys(CASE_TYPE_GROUPS).map((groupName) => (
                      <option key={groupName} value={groupName}>
                        {groupName}
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

              <div className="space-y-1">
                <label className={formLabel}>Case Type</label>
                <div className="relative">
                  <select
                    className={cn(
                      formInput,
                      "cursor-pointer appearance-none pr-9",
                      !caseGroup && "cursor-not-allowed opacity-60"
                    )}
                    style={{ fontSize: "var(--tally-font-size-sm)" }}
                    value={caseType}
                    disabled={!caseGroup}
                    onChange={(e) => {
                      const typeName = e.target.value;
                      setCaseType(typeName);
                      if (caseGroup && CASE_GROUP_TO_REASON[caseGroup]) {
                        setCaseReason(CASE_GROUP_TO_REASON[caseGroup]);
                      }
                    }}
                  >
                    <option value="">
                      {caseGroup ? "--Select case type--" : "Select case group first"}
                    </option>
                    {(CASE_TYPE_GROUPS[caseGroup] ?? []).map((typeName) => (
                      <option key={typeName} value={typeName}>
                        {typeName}
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

              <div className="space-y-1">
                <label className={formLabel}>Priority</label>
                <div className="relative">
                  <select
                    className={cn(formInput, "cursor-pointer appearance-none pr-9")}
                    style={{ fontSize: "var(--tally-font-size-sm)" }}
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as CasePriority)}
                  >
                    {CASE_PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
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

              <div className="space-y-1">
                <label className={formLabel}>Case Reason</label>
                <div className="relative">
                  <select
                    className={cn(formInput, "cursor-pointer appearance-none pr-9")}
                    style={{ fontSize: "var(--tally-font-size-sm)" }}
                    value={caseReason}
                    onChange={(e) => setCaseReason(e.target.value)}
                  >
                    <option value="">--None--</option>
                    {CASE_REASONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
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

              <div className={sectionHeadingWithDivider}>Description Information</div>

              <div className="col-span-2 space-y-1.5">
                <label className={formLabel}>Subject</label>
                <input
                  type="text"
                  className={formInput}
                  style={{ fontSize: "var(--tally-font-size-sm)" }}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of the case"
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className={formLabel}>Description</label>
                <textarea
                  className={cn(formInput, "h-24 resize-none py-2")}
                  style={{ fontSize: "var(--tally-font-size-sm)" }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the case..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-border px-6 py-3 dark:border-gray-700">
            <Button variant="outline" size="md" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="outline"
              size="md"
              type="submit"
              onClick={() => {
                saveAndNewRef.current = true;
              }}
            >
              Save &amp; New
            </Button>
            <Button
              size="md"
              type="submit"
              onClick={() => {
                saveAndNewRef.current = false;
              }}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
