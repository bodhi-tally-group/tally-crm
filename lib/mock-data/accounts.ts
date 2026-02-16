import type { Account, Contact, Org } from "@/types/crm";

export interface ContactWithAccount {
  contact: Contact;
  account: Account;
}

export const mockOrgs: Org[] = [
  { id: "org-001", name: "Bowen Basin Mining Corp" },
  { id: "org-002", name: "Gladstone Aluminium" },
  { id: "org-003", name: "Mackay Sugar" },
  { id: "org-004", name: "Brisbane Convention Centre" },
  { id: "org-005", name: "Townsville Port Authority" },
];

export const mockAccounts: Account[] = [
  {
    id: "acc-001",
    orgId: "org-001",
    name: "Bowen Basin Mining Corp",
    accountNumber: "LM-0045721",
    type: "Industrial",
    status: "Active",
    sites: [
      { id: "site-acc001-1", name: "Moranbah Main Site" },
      { id: "site-acc001-2", name: "Peak Downs" },
    ],
    nmis: ["3012345678", "3012345679"],
    energyType: "Electricity",
    primaryContact: {
      id: "con-001",
      name: "James Whitfield",
      role: "Energy Manager",
      email: "j.whitfield@bowenbasin.com.au",
      phone: "07 4921 3300",
      isPrimary: true,
    },
    contacts: [
      {
        id: "con-001",
        name: "James Whitfield",
        role: "Energy Manager",
        email: "j.whitfield@bowenbasin.com.au",
        phone: "07 4921 3300",
        isPrimary: true,
      },
      {
        id: "con-002",
        name: "Sarah Chen",
        role: "Finance Director",
        email: "s.chen@bowenbasin.com.au",
        phone: "07 4921 3301",
        isPrimary: false,
      },
    ],
    address: "145 Mining Access Rd, Moranbah QLD 4744",
    annualConsumption: "12,500,000 kWh",
    accountBalance: "-$45,230.00",
    lastPaymentDate: "28/01/2026",
    lastPaymentAmount: "$187,500.00",
    contractEndDate: "30/06/2027",
  },
  {
    id: "acc-001b",
    orgId: "org-001",
    name: "Peak Downs Site",
    accountNumber: "LM-0045722",
    type: "Industrial",
    status: "Active",
    sites: [{ id: "site-acc001b-1", name: "Peak Downs" }],
    nmis: ["3012345680"],
    energyType: "Electricity",
    primaryContact: {
      id: "con-001",
      name: "James Whitfield",
      role: "Energy Manager",
      email: "j.whitfield@bowenbasin.com.au",
      phone: "07 4921 3300",
      isPrimary: true,
    },
    contacts: [
      {
        id: "con-001",
        name: "James Whitfield",
        role: "Energy Manager",
        email: "j.whitfield@bowenbasin.com.au",
        phone: "07 4921 3300",
        isPrimary: true,
      },
    ],
    address: "Peak Downs Mine, QLD 4744",
    annualConsumption: "5,200,000 kWh",
    accountBalance: "-$18,000.00",
    lastPaymentDate: "28/01/2026",
    lastPaymentAmount: "$78,000.00",
    contractEndDate: "30/06/2027",
  },
  {
    id: "acc-002",
    orgId: "org-002",
    name: "Gladstone Aluminium Smelter",
    accountNumber: "LM-0045890",
    type: "Industrial",
    status: "Active",
    sites: [
      { id: "site-acc002-1", name: "Boyne Island Smelter" },
      { id: "site-acc002-2", name: "Power Station" },
    ],
    nmis: ["3098765432", "3098765433", "3098765434"],
    energyType: "Dual Fuel",
    primaryContact: {
      id: "con-003",
      name: "Michael Torres",
      role: "Procurement Manager",
      email: "m.torres@gladstone-aluminium.com.au",
      phone: "07 4972 1100",
      isPrimary: true,
    },
    contacts: [
      {
        id: "con-003",
        name: "Michael Torres",
        role: "Procurement Manager",
        email: "m.torres@gladstone-aluminium.com.au",
        phone: "07 4972 1100",
        isPrimary: true,
      },
      {
        id: "con-004",
        name: "Rebecca Liu",
        role: "Sustainability Officer",
        email: "r.liu@gladstone-aluminium.com.au",
        phone: "07 4972 1102",
        isPrimary: false,
      },
    ],
    address: "1 Smelter Rd, Boyne Island QLD 4680",
    annualConsumption: "45,000,000 kWh / 8,200,000 MJ",
    accountBalance: "$0.00",
    lastPaymentDate: "05/02/2026",
    lastPaymentAmount: "$1,245,000.00",
    contractEndDate: "31/12/2026",
  },
  {
    id: "acc-003",
    orgId: "org-003",
    name: "Mackay Sugar Mill Operations",
    accountNumber: "LM-0046102",
    type: "Industrial",
    status: "Active",
    sites: [{ id: "site-acc003-1", name: "Racecourse Mill" }],
    nmis: ["3054321098"],
    energyType: "Electricity",
    primaryContact: {
      id: "con-005",
      name: "David Patterson",
      role: "Operations Director",
      email: "d.patterson@mackaysugar.com.au",
      phone: "07 4944 2500",
      isPrimary: true,
    },
    contacts: [
      {
        id: "con-005",
        name: "David Patterson",
        role: "Operations Director",
        email: "d.patterson@mackaysugar.com.au",
        phone: "07 4944 2500",
        isPrimary: true,
      },
    ],
    address: "42 Mill Rd, Racecourse QLD 4740",
    annualConsumption: "8,750,000 kWh",
    accountBalance: "-$12,400.00",
    lastPaymentDate: "15/01/2026",
    lastPaymentAmount: "$95,000.00",
    contractEndDate: "30/09/2027",
  },
  {
    id: "acc-004",
    orgId: "org-004",
    name: "Brisbane Convention Centre",
    accountNumber: "LM-0046350",
    type: "Commercial",
    status: "Active",
    sites: [
      { id: "site-acc004-1", name: "South Brisbane Convention Centre" },
      { id: "site-acc004-2", name: "Exhibition Hall" },
    ],
    nmis: ["3067890123", "3067890124"],
    energyType: "Dual Fuel",
    primaryContact: {
      id: "con-006",
      name: "Amanda Foster",
      role: "Facilities Manager",
      email: "a.foster@brisbanecc.com.au",
      phone: "07 3308 3000",
      isPrimary: true,
      createDate: "16/07/2025 7:49 AM AEST",
      lifecycleStage: "Subscriber",
    },
    contacts: [
      {
        id: "con-006",
        name: "Amanda Foster",
        role: "Facilities Manager",
        email: "a.foster@brisbanecc.com.au",
        phone: "07 3308 3000",
        isPrimary: true,
        createDate: "16/07/2025 7:49 AM AEST",
        lifecycleStage: "Subscriber",
      },
      {
        id: "con-007",
        name: "Tom Richards",
        role: "CFO",
        email: "t.richards@brisbanecc.com.au",
        phone: "07 3308 3001",
        isPrimary: false,
      },
    ],
    address: "Merivale St, South Brisbane QLD 4101",
    annualConsumption: "3,200,000 kWh / 1,450,000 MJ",
    accountBalance: "-$8,200.00",
    lastPaymentDate: "01/02/2026",
    lastPaymentAmount: "$42,000.00",
    contractEndDate: "28/02/2027",
  },
  {
    id: "acc-005",
    orgId: "org-005",
    name: "Townsville Port Authority",
    accountNumber: "LM-0046510",
    type: "Industrial",
    status: "Active",
    sites: [
      { id: "site-acc005-1", name: "South Townsville Terminal" },
      { id: "site-acc005-2", name: "Bulk Handling" },
      { id: "site-acc005-3", name: "Administration" },
    ],
    nmis: ["3045678901", "3045678902", "3045678903"],
    energyType: "Electricity",
    primaryContact: {
      id: "con-008",
      name: "Karen Mitchell",
      role: "Infrastructure Manager",
      email: "k.mitchell@townsvilleport.com.au",
      phone: "07 4781 1500",
      isPrimary: true,
    },
    contacts: [
      {
        id: "con-008",
        name: "Karen Mitchell",
        role: "Infrastructure Manager",
        email: "k.mitchell@townsvilleport.com.au",
        phone: "07 4781 1500",
        isPrimary: true,
      },
    ],
    address: "Benwell Rd, South Townsville QLD 4810",
    annualConsumption: "6,800,000 kWh",
    accountBalance: "$0.00",
    lastPaymentDate: "10/02/2026",
    lastPaymentAmount: "$78,500.00",
    contractEndDate: "30/06/2028",
  },
];

export function getAccountById(id: string): Account | undefined {
  return mockAccounts.find((a) => a.id === id);
}

export function getOrgById(id: string): Org | undefined {
  return mockOrgs.find((o) => o.id === id);
}

export function getAccountsByOrgId(orgId: string): Account[] {
  return mockAccounts.filter((a) => a.orgId === orgId);
}

export function getAllContactsWithAccount(): ContactWithAccount[] {
  const result: ContactWithAccount[] = [];
  for (const account of mockAccounts) {
    for (const contact of account.contacts) {
      result.push({ contact, account });
    }
  }
  return result;
}

export function getContactWithAccount(contactId: string): ContactWithAccount | undefined {
  for (const account of mockAccounts) {
    const contact = account.contacts.find((c) => c.id === contactId);
    if (contact) return { contact, account };
  }
  return undefined;
}
