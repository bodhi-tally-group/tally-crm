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
  { id: "org-006", name: "Melbourne Recycled Energy Solutions" },
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
    legalBusinessName: "Bowen Basin Mining Pty Ltd",
    parentAccountId: "acc-001b",
    parentAccountName: "Peak Downs Site",
    customerType: "QLD Industrial Customer",
    accountStatus: "Billing",
    isClosed: false,
    accountSyncStatus: true,
    consolidateToParent: false,
    isDirectDebit: true,
    terms: "CSEnergy14",
    serviceReferenceNumber: "SR-0045721",
    lifeSupport: false,
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
    legalBusinessName: "Bowen Basin Mining Pty Ltd",
    parentAccountId: "acc-001",
    parentAccountName: "Bowen Basin Mining Corp",
    customerType: "QLD Industrial Customer",
    accountStatus: "Billing",
    isClosed: false,
    accountSyncStatus: true,
    consolidateToParent: true,
    isDirectDebit: true,
    terms: "CSEnergy14",
    serviceReferenceNumber: "SR-0045722",
    lifeSupport: false,
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
    legalBusinessName: "Boyne Smelter Ltd",
    customerType: "QLD Industrial Customer",
    accountStatus: "Billing",
    isClosed: false,
    accountSyncStatus: true,
    consolidateToParent: false,
    isDirectDebit: true,
    terms: "GladstoneAlum2025",
    serviceReferenceNumber: "SR-0045890",
    lifeSupport: false,
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
    legalBusinessName: "Mackay Sugar Limited",
    customerType: "QLD Industrial Customer",
    accountStatus: "Billing",
    isClosed: false,
    accountSyncStatus: true,
    consolidateToParent: false,
    isDirectDebit: false,
    terms: "CSEnergy14",
    serviceReferenceNumber: "SR-0046102",
    lifeSupport: false,
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
    legalBusinessName: "Brisbane Convention Centre Pty Ltd",
    customerType: "QLD Retail Customer",
    accountStatus: "Billing",
    isClosed: false,
    accountSyncStatus: true,
    consolidateToParent: false,
    isDirectDebit: true,
    terms: "BCC-Commercial-24",
    serviceReferenceNumber: "SR-0046350",
    lifeSupport: false,
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
    legalBusinessName: "Townsville Port Corporation",
    customerType: "QLD Industrial Customer",
    accountStatus: "Billing",
    isClosed: false,
    accountSyncStatus: true,
    consolidateToParent: false,
    isDirectDebit: true,
    terms: "TPA-Port-2026",
    serviceReferenceNumber: "SR-0046510",
    lifeSupport: false,
  },
  // ─── Melbourne Recycled Energy Solutions (org-006): 20 accounts, 40 staff, linked accounts, shared contacts ───
  ...(() => {
    const ORG_ID = "org-006";
    const accountNumbers = [123, 287, 341, 456, 502, 618, 729, 834, 901, 1024, 1156, 1203, 1387, 1422, 1555, 1691, 1788, 1844, 1920, 2055];
    const types = ["Industrial", "Commercial", "Residential"] as const;
    const energyTypes = ["Electricity", "Gas", "Dual Fuel"] as const;
    const statuses = ["Active", "Active", "Active", "Suspended"] as const;

    const staff: Contact[] = [
      { id: "con-mres-001", name: "Emma Richardson", role: "Operations Manager", email: "e.richardson@mres.com.au", phone: "03 8642 1001", isPrimary: false },
      { id: "con-mres-002", name: "Liam O'Brien", role: "Site Coordinator", email: "l.obrien@mres.com.au", phone: "03 8642 1002", isPrimary: false },
      { id: "con-mres-003", name: "Olivia Chen", role: "Energy Analyst", email: "o.chen@mres.com.au", phone: "03 8642 1003", isPrimary: false },
      { id: "con-mres-004", name: "Noah Williams", role: "Account Manager", email: "n.williams@mres.com.au", phone: "03 8642 1004", isPrimary: false },
      { id: "con-mres-005", name: "Ava Thompson", role: "Sustainability Lead", email: "a.thompson@mres.com.au", phone: "03 8642 1005", isPrimary: false },
      { id: "con-mres-006", name: "Lucas Martinez", role: "Technical Officer", email: "l.martinez@mres.com.au", phone: "03 8642 1006", isPrimary: false },
      { id: "con-mres-007", name: "Sophie Anderson", role: "Contracts Administrator", email: "s.anderson@mres.com.au", phone: "03 8642 1007", isPrimary: false },
      { id: "con-mres-008", name: "Mason Taylor", role: "Metering Specialist", email: "m.taylor@mres.com.au", phone: "03 8642 1008", isPrimary: false },
      { id: "con-mres-009", name: "Isabella Nguyen", role: "Customer Success", email: "i.nguyen@mres.com.au", phone: "03 8642 1009", isPrimary: false },
      { id: "con-mres-010", name: "Ethan Davis", role: "Compliance Officer", email: "e.davis@mres.com.au", phone: "03 8642 1010", isPrimary: false },
      { id: "con-mres-011", name: "Mia Wilson", role: "Billing Coordinator", email: "m.wilson@mres.com.au", phone: "03 8642 1011", isPrimary: false },
      { id: "con-mres-012", name: "James Brown", role: "Field Technician", email: "j.brown@mres.com.au", phone: "03 8642 1012", isPrimary: false },
      { id: "con-mres-013", name: "Charlotte Lee", role: "Procurement Manager", email: "c.lee@mres.com.au", phone: "03 8642 1013", isPrimary: false },
      { id: "con-mres-014", name: "Benjamin Clarke", role: "Project Lead", email: "b.clarke@mres.com.au", phone: "03 8642 1014", isPrimary: false },
      { id: "con-mres-015", name: "Amelia White", role: "Data Analyst", email: "a.white@mres.com.au", phone: "03 8642 1015", isPrimary: false },
      { id: "con-mres-016", name: "Henry King", role: "Facilities Coordinator", email: "h.king@mres.com.au", phone: "03 8642 1016", isPrimary: false },
      { id: "con-mres-017", name: "Chloe Harris", role: "Renewables Advisor", email: "c.harris@mres.com.au", phone: "03 8642 1017", isPrimary: false },
      { id: "con-mres-018", name: "Alexander Scott", role: "Maintenance Supervisor", email: "a.scott@mres.com.au", phone: "03 8642 1018", isPrimary: false },
      { id: "con-mres-019", name: "Grace Green", role: "Customer Service Lead", email: "g.green@mres.com.au", phone: "03 8642 1019", isPrimary: false },
      { id: "con-mres-020", name: "William Adams", role: "Energy Engineer", email: "w.adams@mres.com.au", phone: "03 8642 1020", isPrimary: false },
      { id: "con-mres-021", name: "Zoe Baker", role: "Scheduling Coordinator", email: "z.baker@mres.com.au", phone: "03 8642 1021", isPrimary: false },
      { id: "con-mres-022", name: "Jack Nelson", role: "Safety Officer", email: "j.nelson@mres.com.au", phone: "03 8642 1022", isPrimary: false },
      { id: "con-mres-023", name: "Lily Carter", role: "Accounts Payable", email: "l.carter@mres.com.au", phone: "03 8642 1023", isPrimary: false },
      { id: "con-mres-024", name: "Oliver Mitchell", role: "Grid Operations", email: "o.mitchell@mres.com.au", phone: "03 8642 1024", isPrimary: false },
      { id: "con-mres-025", name: "Harper Roberts", role: "Stakeholder Manager", email: "h.roberts@mres.com.au", phone: "03 8642 1025", isPrimary: false },
      { id: "con-mres-026", name: "Leo Turner", role: "Installation Lead", email: "l.turner@mres.com.au", phone: "03 8642 1026", isPrimary: false },
      { id: "con-mres-027", name: "Ella Phillips", role: "Reporting Analyst", email: "e.phillips@mres.com.au", phone: "03 8642 1027", isPrimary: false },
      { id: "con-mres-028", name: "Sebastian Campbell", role: "Quality Assurance", email: "s.campbell@mres.com.au", phone: "03 8642 1028", isPrimary: false },
      { id: "con-mres-029", name: "Scarlett Parker", role: "Training Coordinator", email: "s.parker@mres.com.au", phone: "03 8642 1029", isPrimary: false },
      { id: "con-mres-030", name: "Jack Evans", role: "Logistics Coordinator", email: "j.evans@mres.com.au", phone: "03 8642 1030", isPrimary: false },
      { id: "con-mres-031", name: "Ruby Edwards", role: "Environmental Officer", email: "r.edwards@mres.com.au", phone: "03 8642 1031", isPrimary: false },
      { id: "con-mres-032", name: "Daniel Collins", role: "Systems Administrator", email: "d.collins@mres.com.au", phone: "03 8642 1032", isPrimary: false },
      { id: "con-mres-033", name: "Evie Stewart", role: "Client Relations", email: "e.stewart@mres.com.au", phone: "03 8642 1033", isPrimary: false },
      { id: "con-mres-034", name: "Matthew Sanchez", role: "Meter Reader", email: "m.sanchez@mres.com.au", phone: "03 8642 1034", isPrimary: false },
      { id: "con-mres-035", name: "Freya Morris", role: "Tariff Specialist", email: "f.morris@mres.com.au", phone: "03 8642 1035", isPrimary: false },
      { id: "con-mres-036", name: "Joseph Rogers", role: "Dispatch Officer", email: "j.rogers@mres.com.au", phone: "03 8642 1036", isPrimary: false },
      { id: "con-mres-037", name: "Ivy Reed", role: "Documentation Officer", email: "i.reed@mres.com.au", phone: "03 8642 1037", isPrimary: false },
      { id: "con-mres-038", name: "Samuel Cook", role: "Asset Manager", email: "s.cook@mres.com.au", phone: "03 8642 1038", isPrimary: false },
      { id: "con-mres-039", name: "Poppy Morgan", role: "Reception & Admin", email: "p.morgan@mres.com.au", phone: "03 8642 1039", isPrimary: false },
      { id: "con-mres-040", name: "David Bell", role: "Senior Operations", email: "d.bell@mres.com.au", phone: "03 8642 1040", isPrimary: false },
    ];

    // 10 shared contacts (001–010): each assigned to 3 or 4 accounts
    const sharedContactAccountIndices: number[][] = [
      [0, 1, 2, 3],       // Emma Richardson – 4 accounts
      [1, 2, 3, 4],       // Liam O'Brien – 4 accounts
      [3, 4, 5],          // Olivia Chen – 3 accounts
      [5, 6, 7, 8],       // Noah Williams – 4 accounts
      [7, 8, 9],          // Ava Thompson – 3 accounts
      [9, 10, 11, 12],     // Lucas Martinez – 4 accounts
      [11, 12, 13],       // Sophie Anderson – 3 accounts
      [13, 14, 15, 16],   // Mason Taylor – 4 accounts
      [15, 16, 17],       // Isabella Nguyen – 3 accounts
      [17, 18, 19],       // Ethan Davis – 3 accounts
    ];

    const accountIds = accountNumbers.map((_, i) => `acc-mres-${String(i + 1).padStart(3, "0")}`);

    // Linked account groups (some accounts linked for shared sites / consolidated billing)
    const linkedAccountIds: (string[] | undefined)[] = [
      [accountIds[1]],                    // 0 ↔ 1
      [accountIds[0], accountIds[2]],     // 1 ↔ 0, 2
      [accountIds[1], accountIds[3]],     // 2 ↔ 1, 3
      [accountIds[2], accountIds[4]],     // 3 ↔ 2, 4
      [accountIds[3]],                   // 4 ↔ 3
      [accountIds[6], accountIds[7]],     // 5 ↔ 6, 7
      [accountIds[5], accountIds[7]],     // 6 ↔ 5, 7
      [accountIds[5], accountIds[6]],     // 7 ↔ 5, 6
      [accountIds[9]],                    // 8 ↔ 9
      [accountIds[8], accountIds[10]],    // 9 ↔ 8, 10
      [accountIds[9]],                    // 10 ↔ 9
      [accountIds[12], accountIds[13]],   // 11 ↔ 12, 13
      [accountIds[11], accountIds[13]],   // 12 ↔ 11, 13
      [accountIds[11], accountIds[12]],   // 13 ↔ 11, 12
      [accountIds[15]],                    // 14 ↔ 15
      [accountIds[14], accountIds[16]],   // 15 ↔ 14, 16
      [accountIds[15]],                    // 16 ↔ 15
      [accountIds[18]],                    // 17 ↔ 18
      [accountIds[17], accountIds[19]],   // 18 ↔ 17, 19
      [accountIds[18]],                    // 19 ↔ 18
    ];

    return accountNumbers.map((num, i) => {
      const sharedContacts: Contact[] = [];
      for (let s = 0; s < sharedContactAccountIndices.length; s++) {
        if (sharedContactAccountIndices[s].includes(i)) {
          sharedContacts.push({ ...staff[s], isPrimary: false });
        }
      }
      const dedicatedIdx = 10 + (i % 15) * 2;
      const d1 = staff[dedicatedIdx];
      const d2 = staff[dedicatedIdx + 1];
      const dedicatedContacts: Contact[] = [d1, d2].filter(Boolean).map((c, idx) => ({ ...c, isPrimary: false }));
      const allContacts: Contact[] = [...sharedContacts, ...dedicatedContacts];
      if (allContacts.length > 0) {
        (allContacts[0] as Contact).isPrimary = true;
      }
      const primaryContact = allContacts[0];
      const type = types[i % types.length];
      const linked = linkedAccountIds[i];
      const firstLinkedId = linked?.[0];
      const firstLinkedIdx = firstLinkedId ? accountIds.indexOf(firstLinkedId) : -1;
      const parentAccountName = firstLinkedIdx >= 0 ? `MRES Site ${accountNumbers[firstLinkedIdx]}` : undefined;
      return {
        id: accountIds[i],
        orgId: ORG_ID,
        name: `MRES Site ${num}`,
        accountNumber: `MRES ${num}`,
        type,
        status: statuses[i % statuses.length],
        sites: [{ id: `site-mres-${i + 1}`, name: `Site ${num}` }],
        nmis: [`3${String(100000000 + i).padStart(9, "0")}`],
        energyType: energyTypes[i % energyTypes.length],
        primaryContact: primaryContact as Contact,
        contacts: allContacts as Contact[],
        linkedAccountIds: linkedAccountIds[i],
        address: `${100 + i * 50} Recycling Way, Melbourne VIC 3000`,
        annualConsumption: `${(1 + (i % 5)) * 500000} kWh`,
        accountBalance: i % 4 === 0 ? "$0.00" : `-$${(i + 1) * 1200}.00`,
        lastPaymentDate: "15/02/2026",
        lastPaymentAmount: `$${(i + 1) * 850}.00`,
        contractEndDate: "30/06/2027",
        legalBusinessName: "Melbourne Recycled Energy Solutions Pty Ltd",
        parentAccountId: firstLinkedId,
        parentAccountName,
        customerType: type === "Residential" ? "VIC Retail Customer" : type === "Commercial" ? "VIC Commercial Customer" : "VIC Industrial Customer",
        accountStatus: "Billing",
        isClosed: false,
        accountSyncStatus: i % 5 !== 2,
        consolidateToParent: (linked?.length ?? 0) > 0 && i % 3 === 0,
        isDirectDebit: i % 3 !== 1,
        terms: `MRES-${type === "Residential" ? "RES" : type === "Commercial" ? "COM" : "IND"}-2026`,
        serviceReferenceNumber: `SR-MRES-${num}`,
        lifeSupport: i % 7 === 3,
      } satisfies Account;
    });
  })(),
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
