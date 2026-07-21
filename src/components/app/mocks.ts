// Realistic-ish wholesale / E&S broker mock data for the Coverline prototype.

export type Submission = {
  id: string;
  agent: string;
  agency: string;
  insured: string;
  industry: string;
  state: string;
  tiv: string;
  premium: string;
  effective: string;
  received: string;
  status:
    "New" | "Extracting" | "Matched" | "In review" | "Packaged" | "Quoted" | "Bound" | "No market";
  score: number;
  appetite: "Strong fit" | "Marginal fit" | "Out of appetite";
  recommendation: "Proceed to market" | "Request info" | "No market";
  lob: string;
  topMarket: string;
  marketsInAppetite: number;
};

export const submissions: Submission[] = [
  {
    id: "SUB-24019",
    agent: "Ana Ruiz",
    agency: "Marsh Southeast",
    insured: "Palmetto Cold Storage LLC",
    industry: "Warehousing / cold storage",
    state: "FL",
    tiv: "$42.8M",
    premium: "$182,000 – $196,000",
    effective: "Feb 12, 2026",
    received: "2h ago",
    status: "Matched",
    score: 82,
    appetite: "Strong fit",
    recommendation: "Proceed to market",
    lob: "Property + GL",
    topMarket: "Kinsale Insurance",
    marketsInAppetite: 4,
  },
  {
    id: "SUB-24018",
    agent: "Michael Chen",
    agency: "HUB International",
    insured: "Ridgeline Contractors, Inc.",
    industry: "General contractor",
    state: "CO",
    tiv: "$18.2M",
    premium: "$91,000 – $102,000",
    effective: "Mar 01, 2026",
    received: "3h ago",
    status: "In review",
    score: 71,
    appetite: "Marginal fit",
    recommendation: "Request info",
    lob: "GL + Excess",
    topMarket: "Markel",
    marketsInAppetite: 2,
  },
  {
    id: "SUB-24017",
    agent: "Priya Natarajan",
    agency: "Alliant Insurance",
    insured: "Bayou Marine Services",
    industry: "Marine terminal ops",
    state: "LA",
    tiv: "$61.4M",
    premium: "—",
    effective: "Jan 30, 2026",
    received: "5h ago",
    status: "Extracting",
    score: 0,
    appetite: "Strong fit",
    recommendation: "Proceed to market",
    lob: "Property + Marine",
    topMarket: "Argo Group",
    marketsInAppetite: 0,
  },
  {
    id: "SUB-24016",
    agent: "Jordan Blake",
    agency: "Gallagher",
    insured: "Highline Hospitality Group",
    industry: "Hotels / restaurants",
    state: "NV",
    tiv: "$88.0M",
    premium: "$405,000 – $448,500",
    effective: "Feb 20, 2026",
    received: "8h ago",
    status: "Quoted",
    score: 76,
    appetite: "Strong fit",
    recommendation: "Proceed to market",
    lob: "Property + Liquor",
    topMarket: "James River Insurance",
    marketsInAppetite: 5,
  },
  {
    id: "SUB-24015",
    agent: "Sofia Alvarez",
    agency: "Hilb Group",
    insured: "Northwind Wood Products",
    industry: "Sawmill / wood mfg",
    state: "OR",
    tiv: "$27.5M",
    premium: "—",
    effective: "Feb 04, 2026",
    received: "1d ago",
    status: "No market",
    score: 38,
    appetite: "Out of appetite",
    recommendation: "No market",
    lob: "Property",
    topMarket: "—",
    marketsInAppetite: 0,
  },
  {
    id: "SUB-24014",
    agent: "Ken Whitaker",
    agency: "Baldwin Risk Partners",
    insured: "Ironclad Salvage & Recycling",
    industry: "Metal recycling",
    state: "TX",
    tiv: "$14.6M",
    premium: "$74,000 – $86,000",
    effective: "Feb 15, 2026",
    received: "1d ago",
    status: "In review",
    score: 58,
    appetite: "Marginal fit",
    recommendation: "Request info",
    lob: "GL + Property",
    topMarket: "Ategrity Specialty",
    marketsInAppetite: 2,
  },
  {
    id: "SUB-24013",
    agent: "Emma O'Neill",
    agency: "Risk Strategies",
    insured: "Cedar Grove Assisted Living",
    industry: "Senior care",
    state: "PA",
    tiv: "$22.1M",
    premium: "$118,400",
    effective: "Mar 10, 2026",
    received: "2d ago",
    status: "Bound",
    score: 84,
    appetite: "Strong fit",
    recommendation: "Proceed to market",
    lob: "GL + Prof Liab",
    topMarket: "Berkley Specialty",
    marketsInAppetite: 6,
  },
  {
    id: "SUB-24012",
    agent: "Diego Fernandes",
    agency: "NFP",
    insured: "Copperline Data Center Ops",
    industry: "Data center",
    state: "VA",
    tiv: "$134.9M",
    premium: "$584,000 – $612,300",
    effective: "Feb 28, 2026",
    received: "2d ago",
    status: "Quoted",
    score: 88,
    appetite: "Strong fit",
    recommendation: "Proceed to market",
    lob: "Property + Cyber",
    topMarket: "Beazley",
    marketsInAppetite: 5,
  },
];

export type Document = {
  name: string;
  kind: "ACORD 125" | "ACORD 140" | "Loss Run" | "SOV" | "Financials" | "Email" | "Inspection";
  pages: number;
  extractedFields: number;
  confidence: number;
};

export const submissionDocs: Document[] = [
  {
    name: "ACORD_125_Palmetto.pdf",
    kind: "ACORD 125",
    pages: 4,
    extractedFields: 42,
    confidence: 0.98,
  },
  {
    name: "ACORD_140_Palmetto.pdf",
    kind: "ACORD 140",
    pages: 3,
    extractedFields: 28,
    confidence: 0.96,
  },
  { name: "Palmetto_SOV_2026.xlsx", kind: "SOV", pages: 1, extractedFields: 117, confidence: 0.94 },
  { name: "Loss_Run_5yr.pdf", kind: "Loss Run", pages: 6, extractedFields: 34, confidence: 0.91 },
  {
    name: "Financials_FY24.pdf",
    kind: "Financials",
    pages: 12,
    extractedFields: 61,
    confidence: 0.88,
  },
  { name: "Agent_Cover_Email.eml", kind: "Email", pages: 1, extractedFields: 9, confidence: 0.99 },
];

export type Market = {
  carrier: string;
  fit: "Strong fit" | "Marginal fit" | "Out of appetite";
  score: number;
  capacity: string;
  estPremium: string;
  turnaround: string;
  missingInfo: string[];
  /** Full per-carrier document checklist — missingInfo is the not-yet-satisfied subset of this. */
  requirements: string[];
  /** Free-text appetite/underwriting-note context specific to this carrier and submission. */
  appetiteNotes: string;
  /** This carrier's stated document format/version preferences. */
  formatPreference: string;
  /** Whether this carrier's paper requires diligent-search documentation for a non-admitted placement. */
  diligentSearchRequired: boolean;
  /** Pass A of the matching engine — class code / state licensing / premium band. A failure here gates the carrier out before soft scoring runs. */
  hardExclusions: { label: string; pass: boolean; detail: string }[];
  /** Pass B of the matching engine — sub-factors whose points sum to `score`. Empty when Pass A failed (soft scoring never ran). */
  softScoreFactors: { label: string; detail: string; points: number }[];
  /** Grounded, cited reasoning shown inline in the ranked shortlist. */
  reasoning: string;
  reasoningSource?: { doc: string; page: number };
};

// Ranked carrier panel for SUB-24019 · Palmetto Cold Storage LLC
export const submissionMarkets: Market[] = [
  {
    carrier: "Kinsale Insurance",
    fit: "Strong fit",
    score: 91,
    capacity: "$50M primary",
    estPremium: "$182,000 – $196,000",
    turnaround: "3–5 business days",
    missingInfo: [],
    requirements: [
      "ACORD 125",
      "ACORD 140",
      "Schedule of Values",
      "5-yr Loss Run",
      "Financials FY24",
      "Kinsale cold-storage supplemental form",
    ],
    appetiteNotes:
      "Actively growing the cold-storage book — standard subjectivities only, no additional asks expected.",
    formatPreference: "ACORD 125/140 as signed PDF; SOV as Excel, not PDF.",
    diligentSearchRequired: true,
    hardExclusions: [
      {
        label: "Class code",
        pass: true,
        detail: "Cold storage / refrigerated warehousing — actively sought class",
      },
      {
        label: "State licensing",
        pass: true,
        detail: "Licensed excess & surplus lines carrier in FL",
      },
      {
        label: "Premium band",
        pass: true,
        detail: "$182k–196k sits mid-band for Kinsale's cold-storage treaty ($50k–$500k)",
      },
    ],
    softScoreFactors: [
      {
        label: "Severity margin",
        detail: "38% 5yr loss ratio vs. Kinsale's 60% treaty threshold — wide margin",
        points: 26,
      },
      {
        label: "Submission completeness",
        detail: "100% of Kinsale's requirements on file — no gaps",
        points: 24,
      },
      {
        label: "Historical hit rate",
        detail: "42% hit rate on Kinsale's cold-storage book (carrier performance log)",
        points: 22,
      },
      {
        label: "Appetite confidence",
        detail: "Class-level appetite signal trending positive this quarter",
        points: 19,
      },
    ],
    reasoning:
      "Cold storage is an actively sought class per Kinsale's appetite guide; the 38% five-year loss ratio clears their 60% treaty threshold with room to spare.",
    reasoningSource: { doc: "Loss_Run_5yr.pdf", page: 4 },
  },
  {
    carrier: "James River Insurance",
    fit: "Strong fit",
    score: 84,
    capacity: "$25M primary / $25M excess",
    estPremium: "$178,000 – $205,000",
    turnaround: "5–7 business days",
    missingInfo: ["Updated sprinkler inspection"],
    requirements: [
      "ACORD 125",
      "ACORD 140",
      "Schedule of Values",
      "5-yr Loss Run",
      "Financials FY24",
      "Updated sprinkler inspection",
      "James River supplemental form",
    ],
    appetiteNotes:
      "Strong fit, but wants a current sprinkler inspection on file before firming any cold-storage quote.",
    formatPreference:
      "Accepts ACORD 125/140 as PDF or their own supplemental app; SOV in either format.",
    diligentSearchRequired: true,
    hardExclusions: [
      {
        label: "Class code",
        pass: true,
        detail: "Cold storage / refrigerated warehousing in appetite",
      },
      {
        label: "State licensing",
        pass: true,
        detail: "Licensed excess & surplus lines carrier in FL",
      },
      {
        label: "Premium band",
        pass: true,
        detail: "$178k–205k within James River's cold-storage band",
      },
    ],
    softScoreFactors: [
      {
        label: "Severity margin",
        detail: "38% 5yr loss ratio vs. their 55% threshold",
        points: 23,
      },
      {
        label: "Submission completeness",
        detail: "5 of 6 requirements on file — sprinkler inspection still outstanding",
        points: 17,
      },
      {
        label: "Historical hit rate",
        detail: "39% hit rate on James River's cold-storage book (carrier performance log)",
        points: 22,
      },
      {
        label: "Appetite confidence",
        detail: "Strong class-level appetite signal, no recent declinations",
        points: 22,
      },
    ],
    reasoning:
      "Strong class fit, but the sprinkler protection picture can't be fully corroborated until the updated inspection report is on file.",
    reasoningSource: { doc: "Palmetto_SOV_2026.xlsx", page: 1 },
  },
  {
    carrier: "Ategrity Specialty",
    fit: "Marginal fit",
    score: 68,
    capacity: "$15M primary",
    estPremium: "$195,000 – $230,000",
    turnaround: "7–10 business days",
    missingInfo: ["5-yr loss run addendum", "Refrigeration monitoring cert"],
    requirements: [
      "ACORD 125",
      "ACORD 140",
      "Schedule of Values",
      "5-yr Loss Run",
      "5-yr loss run addendum",
      "Refrigeration monitoring cert",
      "Financials FY24",
      "Ategrity supplemental form",
    ],
    appetiteNotes:
      "Marginal fit for large-TIV cold storage — wants a loss-run addendum and monitoring cert before quoting.",
    formatPreference:
      "Requires their own supplemental form in addition to ACORD 125/140; loss run must be carrier-formatted, not a raw PDF export.",
    diligentSearchRequired: true,
    hardExclusions: [
      {
        label: "Class code",
        pass: true,
        detail: "Cold storage permitted, but treated as a non-core class",
      },
      {
        label: "State licensing",
        pass: true,
        detail: "Licensed excess & surplus lines carrier in FL",
      },
      {
        label: "Premium band",
        pass: true,
        detail: "$195k–230k near the upper edge of Ategrity's typical cold-storage band",
      },
    ],
    softScoreFactors: [
      {
        label: "Severity margin",
        detail: "TIV concentration is larger than their typical cold-storage line — thinner margin",
        points: 16,
      },
      {
        label: "Submission completeness",
        detail: "6 of 8 requirements on file — loss-run addendum and monitoring cert outstanding",
        points: 12,
      },
      {
        label: "Historical hit rate",
        detail: "25% hit rate on Ategrity's cold-storage book (carrier performance log)",
        points: 16,
      },
      {
        label: "Appetite confidence",
        detail: "Opportunistic rather than core appetite for this class",
        points: 24,
      },
    ],
    reasoning:
      "Marginal — TIV concentration is larger than their typical cold-storage line, and they're waiting on loss-run and monitoring documentation before committing capacity.",
    reasoningSource: { doc: "Palmetto_SOV_2026.xlsx", page: 1 },
  },
  {
    carrier: "Markel",
    fit: "Marginal fit",
    score: 61,
    capacity: "$10M primary",
    estPremium: "$205,000 – $240,000",
    turnaround: "10+ business days",
    missingInfo: ["Signed financials FY24"],
    requirements: [
      "ACORD 125",
      "ACORD 140",
      "Schedule of Values",
      "5-yr Loss Run",
      "Signed financials FY24",
      "Markel supplemental form",
    ],
    appetiteNotes:
      "Marginal fit; wants a countersigned financials package before they'll engage the carrier's own underwriting team.",
    formatPreference: "ACORD 125/140 as PDF; financials must be signed, not a draft.",
    diligentSearchRequired: true,
    hardExclusions: [
      { label: "Class code", pass: true, detail: "Cold storage permitted on a case-by-case basis" },
      {
        label: "State licensing",
        pass: true,
        detail: "Licensed excess & surplus lines carrier in FL",
      },
      { label: "Premium band", pass: true, detail: "$205k–240k within Markel's cold-storage band" },
    ],
    softScoreFactors: [
      {
        label: "Severity margin",
        detail: "38% 5yr loss ratio vs. their 50% threshold",
        points: 15,
      },
      {
        label: "Submission completeness",
        detail: "5 of 6 requirements on file — signed financials still outstanding",
        points: 14,
      },
      {
        label: "Historical hit rate",
        detail: "36% hit rate on Markel's cold-storage book (carrier performance log)",
        points: 18,
      },
      {
        label: "Appetite confidence",
        detail: "Case-by-case appetite, not a standing class preference",
        points: 14,
      },
    ],
    reasoning:
      "Marginal — appetite for this class is case-by-case rather than a standing preference, and they want a countersigned financials package before engaging.",
    reasoningSource: { doc: "Financials_FY24.pdf", page: 1 },
  },
  {
    carrier: "Palomar Specialty",
    fit: "Out of appetite",
    score: 34,
    capacity: "Class excluded — cold storage",
    estPremium: "—",
    turnaround: "—",
    missingInfo: [],
    requirements: [],
    appetiteNotes:
      "Cold storage is currently class-excluded per their appetite profile — do not package.",
    formatPreference: "—",
    diligentSearchRequired: false,
    hardExclusions: [
      {
        label: "Class code",
        pass: false,
        detail:
          "Cold storage / refrigerated warehousing is class-excluded on Palomar's current appetite profile",
      },
      {
        label: "State licensing",
        pass: true,
        detail: "Licensed excess & surplus lines carrier in FL",
      },
      {
        label: "Premium band",
        pass: true,
        detail: "Would sit within band, but moot given the class exclusion",
      },
    ],
    softScoreFactors: [],
    reasoning:
      "Cold storage is excluded outright on Palomar's current appetite profile — the engine stops at the hard-exclusion pass, so no soft score was run.",
  },
];

export type Quote = {
  carrier: string;
  premium: string;
  deductible: string;
  limit: string;
  endorsements: string;
  effectiveDate: string;
  subjectivities: string[];
  materiality: "Standard" | "Material" | "Deal-breaker";
  validUntil: string;
  status: "Quoted" | "Declined" | "Bound";
  /** QC-03, declinations only — the carrier's stated reason, if one was given. */
  declineReason?: string;
  /** QC-03, declinations only — consistency check against this carrier's known appetite. Log only, no action in v1. */
  appetiteConsistency?: { status: "Consistent" | "Inconsistent" | "Unclear"; note: string };
};

// Carrier responses for SUB-24016 · Highline Hospitality Group
export const quotes: Quote[] = [
  {
    carrier: "James River Insurance",
    premium: "$421,000",
    deductible: "$10,000",
    limit: "$1M / $2M liquor liability",
    endorsements: "Assault & battery sublimit $250k, liquor liability follow-form",
    effectiveDate: "Feb 20, 2026",
    subjectivities: ["Signed application", "Liquor license copy"],
    materiality: "Standard",
    validUntil: "Feb 06, 2026",
    status: "Quoted",
  },
  {
    carrier: "Markel",
    premium: "$448,500",
    deductible: "$10,000",
    limit: "$1M / $2M liquor liability",
    endorsements: "Assault & battery sublimit $100k, security services exclusion",
    effectiveDate: "Feb 20, 2026",
    subjectivities: [
      "Signed application",
      "4yr prior liquor liability loss runs",
      "Written security plan for main venue",
    ],
    materiality: "Material",
    validUntil: "Feb 10, 2026",
    status: "Quoted",
  },
  {
    carrier: "Ategrity Specialty",
    premium: "—",
    deductible: "—",
    limit: "—",
    endorsements: "—",
    effectiveDate: "—",
    subjectivities: [],
    materiality: "Standard",
    validUntil: "—",
    status: "Declined",
    declineReason:
      "Liquor liability limits requested exceed Ategrity's current treaty capacity for hospitality accounts over $50M TIV.",
    appetiteConsistency: {
      status: "Consistent",
      note: "Matches Ategrity's stated appetite profile — they've stepped back from large-TIV hospitality/liquor liability risk over the past two quarters. Not a surprise decline; no follow-up action in v1.",
    },
  },
];

export type Discrepancy = {
  field: string;
  requested: string;
  confirmed: string;
  resolution: "Unresolved" | "Accepted carrier terms" | "Disputed — pending carrier";
};

export type Subjectivity = { label: string; tier: "Material" | "Routine"; cleared: boolean };

export type PostBindObligation = { label: string; dueBy: string; status: "Pending" | "Satisfied" };

export type Binder = {
  id: string;
  insured: string;
  carrier: string;
  premium: string;
  effective: string;
  /** BI-02 — inherited from Quote Comparison's QC-02 tiering. An unresolved Material item blocks bind-order generation. */
  subjectivities: Subjectivity[];
  /** BI-03 — carrier bind confirmation vs originally requested terms. Null until a bind confirmation exists. */
  bindDiscrepancy: Discrepancy | null;
  /** BI-04 — carrier's stated policy-document delivery date, for overdue monitoring. */
  docsExpectedBy: string;
  docsReceivedDate: string | null;
  /** BI-05 — issued policy docs vs confirmed bind terms. Null until docs arrive. */
  docDiscrepancy: Discrepancy | null;
  /** BI-07 — tracked on its own timeline, independent of the bind/issuance steps. */
  postBindObligations: PostBindObligation[];
  /** BI-06 — the two distinct Retail Agent Comms triggers. */
  placementConfirmationSent: boolean;
  policyDocsDeliveredSent: boolean;
  status: "Subjectivities open" | "Ready to bind" | "Bound — awaiting policy" | "Issued";
};

export const binders: Binder[] = [
  {
    id: "BND-5512",
    insured: "Palmetto Cold Storage LLC",
    carrier: "Kinsale Insurance",
    premium: "$187,400",
    effective: "Feb 12, 2026",
    subjectivities: [
      { label: "Signed application", tier: "Routine", cleared: true },
      { label: "Sprinkler certification on file", tier: "Routine", cleared: true },
      { label: "Refrigeration monitoring cert", tier: "Routine", cleared: true },
      { label: "Down payment received", tier: "Material", cleared: true },
    ],
    bindDiscrepancy: null,
    docsExpectedBy: "Mar 05, 2026",
    docsReceivedDate: null,
    docDiscrepancy: null,
    postBindObligations: [],
    placementConfirmationSent: false,
    policyDocsDeliveredSent: false,
    status: "Ready to bind",
  },
  {
    id: "BND-5511",
    insured: "Highline Hospitality Group",
    carrier: "James River Insurance",
    premium: "$421,000",
    effective: "Feb 20, 2026",
    subjectivities: [
      { label: "Signed application", tier: "Routine", cleared: true },
      { label: "Liquor license copy", tier: "Routine", cleared: true },
      { label: "4yr prior liquor liability loss runs", tier: "Material", cleared: false },
    ],
    bindDiscrepancy: null,
    docsExpectedBy: "—",
    docsReceivedDate: null,
    docDiscrepancy: null,
    postBindObligations: [],
    placementConfirmationSent: false,
    policyDocsDeliveredSent: false,
    status: "Subjectivities open",
  },
  {
    id: "BND-5510",
    insured: "Cedar Grove Assisted Living",
    carrier: "Berkley Specialty",
    premium: "$118,400",
    effective: "Mar 10, 2026",
    subjectivities: [
      { label: "Signed application", tier: "Routine", cleared: true },
      { label: "Certificate of insurance provided", tier: "Routine", cleared: true },
      { label: "Prior carrier loss run", tier: "Material", cleared: true },
    ],
    bindDiscrepancy: {
      field: "Deductible",
      requested: "$10,000",
      confirmed: "$15,000",
      resolution: "Unresolved",
    },
    docsExpectedBy: "Mar 20, 2026",
    docsReceivedDate: null,
    docDiscrepancy: null,
    postBindObligations: [
      {
        label: "Submit signed application copy to carrier",
        dueBy: "Jan 28, 2026",
        status: "Pending",
      },
      { label: "Provide updated loss control report", dueBy: "Mar 01, 2026", status: "Pending" },
    ],
    placementConfirmationSent: false,
    policyDocsDeliveredSent: false,
    status: "Bound — awaiting policy",
  },
  {
    id: "BND-5509",
    insured: "Copperline Data Center Ops",
    carrier: "Beazley",
    premium: "$612,300",
    effective: "Feb 28, 2026",
    subjectivities: [
      { label: "Signed application", tier: "Routine", cleared: true },
      { label: "Network security questionnaire", tier: "Material", cleared: true },
      { label: "Prior cyber loss run", tier: "Routine", cleared: true },
      { label: "COI provided", tier: "Routine", cleared: true },
      { label: "Down payment received", tier: "Material", cleared: true },
    ],
    bindDiscrepancy: null,
    docsExpectedBy: "Jan 30, 2026",
    docsReceivedDate: null,
    docDiscrepancy: null,
    postBindObligations: [
      {
        label: "Confirm cyber sublimit endorsement wording",
        dueBy: "Feb 10, 2026",
        status: "Pending",
      },
    ],
    placementConfirmationSent: true,
    policyDocsDeliveredSent: false,
    status: "Bound — awaiting policy",
  },
];

export type MidTermChange = {
  id: string;
  policy: string;
  insured: string;
  carrier: string;
  type: string;
  requested: string;
  impact: string;
  materiality: "Non-material" | "Material" | "Complex";
  appetiteRecheck: "Still in appetite" | "Marginal — review" | "Out of appetite";
};

export const midTermChanges: MidTermChange[] = [
  {
    id: "MTC-8814",
    policy: "KIN-24-P-00812",
    insured: "Palmetto Cold Storage LLC",
    carrier: "Kinsale Insurance",
    type: "Add location",
    requested: "Today",
    impact: "+$14,200 premium",
    materiality: "Material",
    appetiteRecheck: "Still in appetite",
  },
  {
    id: "MTC-8813",
    policy: "JRI-24-P-00776",
    insured: "Highline Hospitality Group",
    carrier: "James River Insurance",
    type: "Increase liquor liability limit",
    requested: "Yesterday",
    impact: "+$9,600 premium",
    materiality: "Material",
    appetiteRecheck: "Still in appetite",
  },
  {
    id: "MTC-8812",
    policy: "BRK-24-P-00758",
    insured: "Cedar Grove Assisted Living",
    carrier: "Berkley Specialty",
    type: "Add named insured",
    requested: "2d ago",
    impact: "No premium change",
    materiality: "Non-material",
    appetiteRecheck: "Still in appetite",
  },
  {
    id: "MTC-8811",
    policy: "MRK-24-P-00741",
    insured: "Ridgeline Contractors, Inc.",
    carrier: "Markel",
    type: "Remove vehicle + reduce excess layer",
    requested: "3d ago",
    impact: "-$1,140 premium",
    materiality: "Complex",
    appetiteRecheck: "Marginal — review",
  },
];

export type Remarket = {
  id: string;
  insured: string;
  incumbentCarrier: string;
  expiring: string;
  priorPremium: string;
  indicated: string;
  change: string;
  lossRatio: string;
  flag: string;
  incumbentResponsive: boolean;
  trigger: "Renew as-is" | "Monitor" | "Remarket — competitive check" | "Remarket — active shop";
};

export const remarketing: Remarket[] = [
  {
    id: "RMK-24-4102",
    insured: "Palmetto Cold Storage LLC",
    incumbentCarrier: "Kinsale Insurance",
    expiring: "Feb 12, 2026",
    priorPremium: "$168,900",
    indicated: "$187,400",
    change: "+10.9%",
    lossRatio: "38%",
    flag: "Payroll +14%",
    incumbentResponsive: true,
    trigger: "Monitor",
  },
  {
    id: "RMK-24-4101",
    insured: "Highline Hospitality Group",
    incumbentCarrier: "James River Insurance",
    expiring: "Feb 20, 2026",
    priorPremium: "$388,200",
    indicated: "$421,000",
    change: "+8.4%",
    lossRatio: "42%",
    flag: "New location added",
    incumbentResponsive: true,
    trigger: "Remarket — competitive check",
  },
  {
    id: "RMK-24-4100",
    insured: "Cedar Grove Assisted Living",
    incumbentCarrier: "Berkley Specialty",
    expiring: "Mar 10, 2026",
    priorPremium: "$112,700",
    indicated: "$118,400",
    change: "+5.1%",
    lossRatio: "29%",
    flag: "Clean",
    incumbentResponsive: true,
    trigger: "Renew as-is",
  },
  {
    id: "RMK-24-4099",
    insured: "Ridgeline Contractors, Inc.",
    incumbentCarrier: "Markel",
    expiring: "Mar 01, 2026",
    priorPremium: "$91,400",
    indicated: "$96,200",
    change: "+5.3%",
    lossRatio: "44%",
    flag: "Class code change",
    incumbentResponsive: false,
    trigger: "Remarket — active shop",
  },
  {
    id: "RMK-24-4098",
    insured: "Copperline Data Center Ops",
    incumbentCarrier: "Beazley",
    expiring: "Feb 28, 2026",
    priorPremium: "$584,100",
    indicated: "$612,300",
    change: "+4.8%",
    lossRatio: "12%",
    flag: "Cyber sublimit request",
    incumbentResponsive: true,
    trigger: "Renew as-is",
  },
];

export type DiligentSearchRecord = {
  id: string;
  insured: string;
  state: string;
  requiredDeclinations: number;
  declinationsOnFile: number;
  evidenceSufficient: boolean;
  status: "Gathering evidence" | "Ready to file" | "Filed" | "Exempt";
};

export const diligentSearch: DiligentSearchRecord[] = [
  {
    id: "DS-3301",
    insured: "Palmetto Cold Storage LLC",
    state: "FL",
    requiredDeclinations: 3,
    declinationsOnFile: 3,
    evidenceSufficient: true,
    status: "Ready to file",
  },
  {
    id: "DS-3300",
    insured: "Highline Hospitality Group",
    state: "NV",
    requiredDeclinations: 3,
    declinationsOnFile: 2,
    evidenceSufficient: false,
    status: "Gathering evidence",
  },
  {
    id: "DS-3299",
    insured: "Ridgeline Contractors, Inc.",
    state: "CO",
    requiredDeclinations: 1,
    declinationsOnFile: 1,
    evidenceSufficient: true,
    status: "Filed",
  },
  {
    id: "DS-3298",
    insured: "Bayou Marine Services",
    state: "LA",
    requiredDeclinations: 0,
    declinationsOnFile: 0,
    evidenceSufficient: true,
    status: "Exempt",
  },
];

export type AppetiteSignal = {
  id: string;
  carrier: string;
  classOrAccount: string;
  signal: string;
  evidence: string;
  suggestedAction: string;
  scope: "Class-level" | "Account-specific";
  status: "Pending review" | "Approved" | "Dismissed";
};

export const appetiteSignals: AppetiteSignal[] = [
  {
    id: "SIG-441",
    carrier: "Kinsale Insurance",
    classOrAccount: "Cold storage / refrigerated warehousing",
    signal: "Appetite appears to be expanding",
    evidence:
      "3 of 3 recent cold-storage submissions quoted within 5 days · 0 declinations in 90 days",
    suggestedAction: "Raise class-level fit score +8",
    scope: "Class-level",
    status: "Pending review",
  },
  {
    id: "SIG-440",
    carrier: "Markel",
    classOrAccount: "Contractor excess — CO",
    signal: "Appetite appears to be tightening",
    evidence: "2 declinations in 30 days citing loss trend, both CO contractor excess",
    suggestedAction: "Lower class-level fit score −10 · flag for review",
    scope: "Class-level",
    status: "Pending review",
  },
  {
    id: "SIG-439",
    carrier: "James River Insurance",
    classOrAccount: "Highline Hospitality Group",
    signal: "Non-responsive on renewal remarket",
    evidence: "No reply to remarket inquiry after 12 business days · 2 follow-ups sent",
    suggestedAction: "Flag account for competitive remarket next cycle",
    scope: "Account-specific",
    status: "Approved",
  },
];

export const carrierPerformance = [
  {
    carrier: "Kinsale Insurance",
    submissions: 148,
    quoted: 96,
    bound: 62,
    hitRate: "42%",
    avgTurnaround: "4.1 days",
    premium: "$4.8M",
  },
  {
    carrier: "James River Insurance",
    submissions: 132,
    quoted: 88,
    bound: 51,
    hitRate: "39%",
    avgTurnaround: "5.6 days",
    premium: "$4.1M",
  },
  {
    carrier: "Markel",
    submissions: 121,
    quoted: 74,
    bound: 44,
    hitRate: "36%",
    avgTurnaround: "7.8 days",
    premium: "$3.6M",
  },
  {
    carrier: "Berkley Specialty",
    submissions: 98,
    quoted: 61,
    bound: 39,
    hitRate: "40%",
    avgTurnaround: "5.2 days",
    premium: "$3.2M",
  },
  {
    carrier: "Ategrity Specialty",
    submissions: 87,
    quoted: 41,
    bound: 22,
    hitRate: "25%",
    avgTurnaround: "9.4 days",
    premium: "$1.9M",
  },
];

export const retailAgents = [
  {
    agency: "Marsh Southeast",
    submissions: 74,
    packaged: 61,
    bound: 28,
    hitRate: "38%",
    avgResponseTime: "1h 12m",
  },
  {
    agency: "HUB International",
    submissions: 62,
    packaged: 50,
    bound: 21,
    hitRate: "34%",
    avgResponseTime: "1h 40m",
  },
  {
    agency: "Alliant Insurance",
    submissions: 58,
    packaged: 47,
    bound: 19,
    hitRate: "33%",
    avgResponseTime: "2h 05m",
  },
  {
    agency: "Gallagher",
    submissions: 49,
    packaged: 38,
    bound: 16,
    hitRate: "33%",
    avgResponseTime: "1h 58m",
  },
  {
    agency: "Risk Strategies",
    submissions: 41,
    packaged: 30,
    bound: 11,
    hitRate: "27%",
    avgResponseTime: "2h 30m",
  },
];

export const stateMix = [
  { state: "TX", premium: 4.6 },
  { state: "FL", premium: 4.1 },
  { state: "CA", premium: 3.4 },
  { state: "GA", premium: 2.2 },
  { state: "NY", premium: 2.0 },
  { state: "PA", premium: 1.6 },
  { state: "NC", premium: 1.4 },
  { state: "CO", premium: 1.1 },
  { state: "VA", premium: 0.9 },
  { state: "LA", premium: 0.7 },
];

export const monthlyPipeline = [
  { m: "Jul", subs: 182, bound: 68 },
  { m: "Aug", subs: 204, bound: 79 },
  { m: "Sep", subs: 221, bound: 84 },
  { m: "Oct", subs: 240, bound: 91 },
  { m: "Nov", subs: 258, bound: 96 },
  { m: "Dec", subs: 231, bound: 88 },
  { m: "Jan", subs: 274, bound: 104 },
];

export const decisionsLog = [
  {
    at: "09:42",
    who: "AI (Matching/Ranking Core)",
    what: "Ranked carrier panel — Kinsale #1 fit",
    ctx: "SUB-24019 · Palmetto Cold Storage",
    conf: "94%",
  },
  {
    at: "09:41",
    who: "AI (Extraction Core)",
    what: "Cross-doc validation passed",
    ctx: "SUB-24019 · 6 documents",
    conf: "97%",
  },
  {
    at: "09:28",
    who: "Sam D. (Wholesale Broker)",
    what: "Approved remarket recommendation — renew as-is",
    ctx: "RMK-24-4100 · Cedar Grove",
    conf: "—",
  },
  {
    at: "09:11",
    who: "AI (Matching/Ranking Core)",
    what: "Flagged out of appetite — no market",
    ctx: "SUB-24015 · Northwind Wood Products",
    conf: "88%",
  },
  {
    at: "08:52",
    who: "AI (Extraction Core)",
    what: "Loss run parsed (5 yr)",
    ctx: "SUB-24018 · Ridgeline Contractors",
    conf: "91%",
  },
  {
    at: "08:33",
    who: "Marcus W. (Broker)",
    what: "Override — added marginal-fit market to panel",
    ctx: "SUB-24014 · Ironclad Salvage",
    conf: "—",
  },
];
