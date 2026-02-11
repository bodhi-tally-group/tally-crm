// ─────────────────────────────────────────────────────────────────────────────
// Opportunity mock data — imported from colleague's crm-react project
// Used by the Opportunities kanban/list pages
// ─────────────────────────────────────────────────────────────────────────────

export type OpportunityRecord = {
  id: string;
  name: string;
  owner: string;
  status: "lead" | "open" | "won" | "lost" | "deferred";
  stage: "Initial" | "Qualification" | "Proposal" | "Contract";
  value: number;
  startDate: string;
  probability: number;
  cycleDays?: number;
  detailUrl?: string;
};

export const OPPORTUNITIES: OpportunityRecord[] = [
  {
    id: "OPP-2025-0034",
    name: "Veolia Energy - Multi-site rollout",
    owner: "Sarah Mitchell",
    status: "lead",
    stage: "Initial",
    value: 1200000,
    startDate: "2025-03-01",
    probability: 35,
    cycleDays: 48,
    detailUrl: "/crm/opportunities/OPP-2025-0034",
  },
  {
    id: "OPP-2025-0031",
    name: "Aurora Power - Fleet onboarding",
    owner: "John Davis",
    status: "lead",
    stage: "Initial",
    value: 540000,
    startDate: "2025-04-01",
    probability: 30,
    cycleDays: 40,
  },
  {
    id: "OPP-2025-0028",
    name: "Energy Plus Co - Rate review",
    owner: "Lisa Chen",
    status: "open",
    stage: "Qualification",
    value: 980000,
    startDate: "2025-02-15",
    probability: 55,
    cycleDays: 52,
  },
  {
    id: "OPP-2025-0022",
    name: "Green Solutions - New site bundle",
    owner: "Sarah Mitchell",
    status: "open",
    stage: "Qualification",
    value: 310000,
    startDate: "2025-03-20",
    probability: 45,
    cycleDays: 33,
  },
  {
    id: "OPP-2025-0019",
    name: "New Wave Energy - C&I package",
    owner: "John Davis",
    status: "open",
    stage: "Proposal",
    value: 1600000,
    startDate: "2025-01-20",
    probability: 70,
    cycleDays: 60,
  },
  {
    id: "OPP-2025-0014",
    name: "Metro Utilities - Metering services",
    owner: "Lisa Chen",
    status: "open",
    stage: "Proposal",
    value: 420000,
    startDate: "2025-02-28",
    probability: 62,
    cycleDays: 49,
  },
  {
    id: "OPP-2025-0011",
    name: "Veolia Energy - Renewals FY26",
    owner: "Sarah Mitchell",
    status: "won",
    stage: "Contract",
    value: 2100000,
    startDate: "2025-04-01",
    probability: 100,
    cycleDays: 72,
    detailUrl: "/crm/opportunities/OPP-2025-0011",
  },
  {
    id: "OPP-2025-0009",
    name: "CityGrid - Renewal",
    owner: "John Davis",
    status: "lost",
    stage: "Contract",
    value: 780000,
    startDate: "2025-02-10",
    probability: 0,
    cycleDays: 58,
  },
  {
    id: "OPP-2025-0006",
    name: "Metro Build - Expansion phase",
    owner: "Lisa Chen",
    status: "deferred",
    stage: "Qualification",
    value: 610000,
    startDate: "2025-05-10",
    probability: 20,
    cycleDays: 44,
  },
];

export const OPPORTUNITY_STAGES: OpportunityRecord["stage"][] = [
  "Initial",
  "Qualification",
  "Proposal",
  "Contract",
];

export type OpportunityDetail = {
  id: string;
  name: string;
  owner: string;
  status: "Lead" | "Open" | "Won" | "Lost" | "Deferred";
  stage: OpportunityRecord["stage"];
  value: number;
  startDate: string;
  contractsSigned: string;
  accountCreationBlocked: boolean;
};

export const OPPORTUNITY_DETAILS: Record<string, OpportunityDetail> = {
  "OPP-2025-0034": {
    id: "OPP-2025-0034",
    name: "Veolia Energy - Multi-site rollout",
    owner: "Sarah Mitchell",
    status: "Open",
    stage: "Qualification",
    value: 1200000,
    startDate: "2025-03-01",
    contractsSigned: "No",
    accountCreationBlocked: true,
  },
  "OPP-2025-0011": {
    id: "OPP-2025-0011",
    name: "Veolia Energy - Renewals FY26",
    owner: "Sarah Mitchell",
    status: "Won",
    stage: "Contract",
    value: 2100000,
    startDate: "2025-04-01",
    contractsSigned: "Yes",
    accountCreationBlocked: false,
  },
};
