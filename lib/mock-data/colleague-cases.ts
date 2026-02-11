// ─────────────────────────────────────────────────────────────────────────────
// Case mock data — imported from colleague's crm-react project
// Used by the new CRM pages (communications, performance, etc.)
// ─────────────────────────────────────────────────────────────────────────────

export type CaseRecord = {
  id: string;
  account: string;
  accountId: string | null;
  caseClass: string;
  reason: string;
  status: string;
  priority: string;
  sla: string;
  slaStatus: "ok" | "warning" | "danger";
  firstResponseHours: number;
  owner: string | null;
  ownerInitials: string;
  team: string;
  triage: boolean;
  channel: string;
  match: string;
  createdAt: string;
};

export const CASES: CaseRecord[] = [
  {
    id: "VE-2024-0842",
    account: "Veolia Energy",
    accountId: "TA-10042",
    caseClass: "Operational",
    reason: "Meter Transfer",
    status: "In Progress",
    priority: "High",
    sla: "4h remaining",
    slaStatus: "warning",
    firstResponseHours: 1.2,
    owner: "Sarah Mitchell",
    ownerInitials: "SM",
    team: "Operations",
    triage: false,
    channel: "Email",
    match: "High",
    createdAt: "2024-12-04T09:12:00Z",
  },
  {
    id: "VE-2024-0841",
    account: "Energy Plus Co",
    accountId: "TA-10038",
    caseClass: "Billing",
    reason: "Billing Inquiry",
    status: "New",
    priority: "Medium",
    sla: "22h remaining",
    slaStatus: "ok",
    firstResponseHours: 2.0,
    owner: "John Davis",
    ownerInitials: "JD",
    team: "AM Team",
    triage: false,
    channel: "Form",
    match: "Medium",
    createdAt: "2024-12-04T08:45:00Z",
  },
  {
    id: "VE-2024-0840",
    account: "Green Solutions",
    accountId: "TA-10025",
    caseClass: "Onboarding",
    reason: "New Site Roll-in",
    status: "Waiting Customer",
    priority: "Low",
    sla: "48h remaining",
    slaStatus: "ok",
    firstResponseHours: 3.1,
    owner: null,
    ownerInitials: "--",
    team: "Operations",
    triage: true,
    channel: "Manual",
    match: "High",
    createdAt: "2024-12-03T14:30:00Z",
  },
  {
    id: "VE-2024-0838",
    account: "Unallocated",
    accountId: null,
    caseClass: "Service",
    reason: "General Inquiry",
    status: "On Hold",
    priority: "High",
    sla: "OVERDUE",
    slaStatus: "danger",
    firstResponseHours: 4.0,
    owner: "AM Team",
    ownerInitials: "AM",
    team: "AM Team",
    triage: true,
    channel: "Phone",
    match: "None",
    createdAt: "2024-12-03T11:10:00Z",
  },
  {
    id: "VE-2024-0835",
    account: "Aurora Power",
    accountId: "TA-10019",
    caseClass: "Billing",
    reason: "Statement Dispute",
    status: "In Progress",
    priority: "Critical",
    sla: "1h remaining",
    slaStatus: "warning",
    firstResponseHours: 0.8,
    owner: "Lisa Chen",
    ownerInitials: "LC",
    team: "Finance",
    triage: false,
    channel: "Email",
    match: "High",
    createdAt: "2024-12-03T10:15:00Z",
  },
  {
    id: "VE-2024-0832",
    account: "New Wave Energy",
    accountId: "TA-10055",
    caseClass: "Operational",
    reason: "Meter Investigation",
    status: "Resolved",
    priority: "Medium",
    sla: "Completed",
    slaStatus: "ok",
    firstResponseHours: 1.4,
    owner: "Sarah Mitchell",
    ownerInitials: "SM",
    team: "Operations",
    triage: false,
    channel: "Email",
    match: "Medium",
    createdAt: "2024-12-02T15:00:00Z",
  },
];

export type CaseDetail = {
  id: string;
  subject: string;
  customer: string;
  accountId: string;
  status: string;
  statusClass: string;
  slaLabel: string;
  slaClass: string;
  priority: string;
  owner: string;
  responseDue: string;
  resolutionDue: string;
  caseClass: string;
  primaryReason: string;
  secondaryReason: string;
  createdChannel: string;
  accountMatch: string;
  policy: string;
  openedAt: string;
  firstResponseAt: string;
  resolvedAt: string;
  closedAt: string;
};

export const CASE_DETAILS: Record<string, CaseDetail> = {
  "VE-2024-0842": {
    id: "VE-2024-0842",
    subject: "Meter transfer request - Site B",
    customer: "Veolia Energy",
    accountId: "TA-10042",
    status: "In Progress",
    statusClass: "in-progress",
    slaLabel: "SLA at Risk",
    slaClass: "breach",
    priority: "High",
    owner: "Sarah Mitchell",
    responseDue: "4h remaining",
    resolutionDue: "36h remaining",
    caseClass: "Operational",
    primaryReason: "Meter Transfer",
    secondaryReason: "Site B",
    createdChannel: "Email",
    accountMatch: "High (domain)",
    policy: "Standard B2B SLA",
    openedAt: "09:12 AM",
    firstResponseAt: "09:13 AM",
    resolvedAt: "—",
    closedAt: "—",
  },
  "VE-2024-0841": {
    id: "VE-2024-0841",
    subject: "Billing inquiry - November charges",
    customer: "Energy Plus Co",
    accountId: "TA-10038",
    status: "New",
    statusClass: "new",
    slaLabel: "SLA On Track",
    slaClass: "new",
    priority: "Medium",
    owner: "John Davis",
    responseDue: "22h remaining",
    resolutionDue: "48h remaining",
    caseClass: "Billing",
    primaryReason: "Billing Inquiry",
    secondaryReason: "November Charges",
    createdChannel: "Form",
    accountMatch: "Medium (email)",
    policy: "Priority Accounts",
    openedAt: "08:45 AM",
    firstResponseAt: "—",
    resolvedAt: "—",
    closedAt: "—",
  },
  "VE-2024-0840": {
    id: "VE-2024-0840",
    subject: "New site roll-in request",
    customer: "Green Solutions",
    accountId: "TA-10025",
    status: "Waiting Customer",
    statusClass: "waiting",
    slaLabel: "SLA On Track",
    slaClass: "new",
    priority: "Low",
    owner: "Unassigned",
    responseDue: "48h remaining",
    resolutionDue: "5d remaining",
    caseClass: "Onboarding",
    primaryReason: "New Site Roll-in",
    secondaryReason: "Connection Check",
    createdChannel: "Manual",
    accountMatch: "High (historical)",
    policy: "Standard C&I",
    openedAt: "02:30 PM",
    firstResponseAt: "—",
    resolvedAt: "—",
    closedAt: "—",
  },
  "VE-2024-0838": {
    id: "VE-2024-0838",
    subject: "General inquiry - Service availability",
    customer: "Unallocated",
    accountId: "No account number",
    status: "On Hold",
    statusClass: "hold",
    slaLabel: "SLA Breached",
    slaClass: "breach",
    priority: "High",
    owner: "AM Team",
    responseDue: "OVERDUE",
    resolutionDue: "OVERDUE",
    caseClass: "Service",
    primaryReason: "General Inquiry",
    secondaryReason: "Availability",
    createdChannel: "Phone",
    accountMatch: "None",
    policy: "Standard C&I",
    openedAt: "11:10 AM",
    firstResponseAt: "—",
    resolvedAt: "—",
    closedAt: "—",
  },
};
