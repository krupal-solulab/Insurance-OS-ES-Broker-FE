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
  status: "New" | "Extracting" | "Matched" | "In review" | "Packaged" | "Quoted" | "Bound" | "No market";
  score: number;
  appetite: "Strong fit" | "Marginal fit" | "Out of appetite";
  recommendation: "Proceed to market" | "Request info" | "No market";
  lob: string;
  topMarket: string;
  marketsInAppetite: number;
};

export const submissions: Submission[] = [
  { id: "SUB-24019", agent: "Ana Ruiz", agency: "Marsh Southeast", insured: "Palmetto Cold Storage LLC", industry: "Warehousing / cold storage", state: "FL", tiv: "$42.8M", premium: "$182,000 – $196,000", effective: "Feb 12, 2026", received: "2h ago", status: "Matched", score: 82, appetite: "Strong fit", recommendation: "Proceed to market", lob: "Property + GL", topMarket: "Kinsale Insurance", marketsInAppetite: 4 },
  { id: "SUB-24018", agent: "Michael Chen", agency: "HUB International", insured: "Ridgeline Contractors, Inc.", industry: "General contractor", state: "CO", tiv: "$18.2M", premium: "$91,000 – $102,000", effective: "Mar 01, 2026", received: "3h ago", status: "In review", score: 71, appetite: "Marginal fit", recommendation: "Request info", lob: "GL + Excess", topMarket: "Markel", marketsInAppetite: 2 },
  { id: "SUB-24017", agent: "Priya Natarajan", agency: "Alliant Insurance", insured: "Bayou Marine Services", industry: "Marine terminal ops", state: "LA", tiv: "$61.4M", premium: "—", effective: "Jan 30, 2026", received: "5h ago", status: "Extracting", score: 0, appetite: "Strong fit", recommendation: "Proceed to market", lob: "Property + Marine", topMarket: "Argo Group", marketsInAppetite: 0 },
  { id: "SUB-24016", agent: "Jordan Blake", agency: "Gallagher", insured: "Highline Hospitality Group", industry: "Hotels / restaurants", state: "NV", tiv: "$88.0M", premium: "$405,000 – $448,500", effective: "Feb 20, 2026", received: "8h ago", status: "Quoted", score: 76, appetite: "Strong fit", recommendation: "Proceed to market", lob: "Property + Liquor", topMarket: "James River Insurance", marketsInAppetite: 5 },
  { id: "SUB-24015", agent: "Sofia Alvarez", agency: "Hilb Group", insured: "Northwind Wood Products", industry: "Sawmill / wood mfg", state: "OR", tiv: "$27.5M", premium: "—", effective: "Feb 04, 2026", received: "1d ago", status: "No market", score: 38, appetite: "Out of appetite", recommendation: "No market", lob: "Property", topMarket: "—", marketsInAppetite: 0 },
  { id: "SUB-24014", agent: "Ken Whitaker", agency: "Baldwin Risk Partners", insured: "Ironclad Salvage & Recycling", industry: "Metal recycling", state: "TX", tiv: "$14.6M", premium: "$74,000 – $86,000", effective: "Feb 15, 2026", received: "1d ago", status: "In review", score: 58, appetite: "Marginal fit", recommendation: "Request info", lob: "GL + Property", topMarket: "Ategrity Specialty", marketsInAppetite: 2 },
  { id: "SUB-24013", agent: "Emma O'Neill", agency: "Risk Strategies", insured: "Cedar Grove Assisted Living", industry: "Senior care", state: "PA", tiv: "$22.1M", premium: "$118,400", effective: "Mar 10, 2026", received: "2d ago", status: "Bound", score: 84, appetite: "Strong fit", recommendation: "Proceed to market", lob: "GL + Prof Liab", topMarket: "Berkley Specialty", marketsInAppetite: 6 },
  { id: "SUB-24012", agent: "Diego Fernandes", agency: "NFP", insured: "Copperline Data Center Ops", industry: "Data center", state: "VA", tiv: "$134.9M", premium: "$584,000 – $612,300", effective: "Feb 28, 2026", received: "2d ago", status: "Quoted", score: 88, appetite: "Strong fit", recommendation: "Proceed to market", lob: "Property + Cyber", topMarket: "Beazley", marketsInAppetite: 5 },
];

export type Document = {
  name: string;
  kind: "ACORD 125" | "ACORD 140" | "Loss Run" | "SOV" | "Financials" | "Email" | "Inspection";
  pages: number;
  extractedFields: number;
  confidence: number;
};

export const submissionDocs: Document[] = [
  { name: "ACORD_125_Palmetto.pdf", kind: "ACORD 125", pages: 4, extractedFields: 42, confidence: 0.98 },
  { name: "ACORD_140_Palmetto.pdf", kind: "ACORD 140", pages: 3, extractedFields: 28, confidence: 0.96 },
  { name: "Palmetto_SOV_2026.xlsx", kind: "SOV", pages: 1, extractedFields: 117, confidence: 0.94 },
  { name: "Loss_Run_5yr.pdf", kind: "Loss Run", pages: 6, extractedFields: 34, confidence: 0.91 },
  { name: "Financials_FY24.pdf", kind: "Financials", pages: 12, extractedFields: 61, confidence: 0.88 },
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
};

// Ranked carrier panel for SUB-24019 · Palmetto Cold Storage LLC
export const submissionMarkets: Market[] = [
  { carrier: "Kinsale Insurance", fit: "Strong fit", score: 91, capacity: "$50M primary", estPremium: "$182,000 – $196,000", turnaround: "3–5 business days", missingInfo: [] },
  { carrier: "James River Insurance", fit: "Strong fit", score: 84, capacity: "$25M primary / $25M excess", estPremium: "$178,000 – $205,000", turnaround: "5–7 business days", missingInfo: ["Updated sprinkler inspection"] },
  { carrier: "Ategrity Specialty", fit: "Marginal fit", score: 68, capacity: "$15M primary", estPremium: "$195,000 – $230,000", turnaround: "7–10 business days", missingInfo: ["5-yr loss run addendum", "Refrigeration monitoring cert"] },
  { carrier: "Markel", fit: "Marginal fit", score: 61, capacity: "$10M primary", estPremium: "$205,000 – $240,000", turnaround: "10+ business days", missingInfo: ["Signed financials FY24"] },
  { carrier: "Palomar Specialty", fit: "Out of appetite", score: 34, capacity: "Class excluded — cold storage", estPremium: "—", turnaround: "—", missingInfo: [] },
];

export const matchRules = [
  { rule: "TIV under $75M (Kinsale cold-storage treaty)", pass: true, detail: "$42.8M — well within treaty capacity" },
  { rule: "State: FL permitted, outside named-storm exclusion zone", pass: true, detail: "Jacksonville — allowed" },
  { rule: "Class: cold storage / refrigerated warehousing in appetite", pass: true, detail: "NAICS 493120 — actively sought class for this carrier" },
  { rule: "5yr loss ratio < 60%", pass: true, detail: "38% actual" },
  { rule: "No open claim > $250k", pass: false, detail: "One open flood claim, reserved $180k — under threshold, soft flag only" },
  { rule: "Sprinklered ≥ 80% of TIV", pass: true, detail: "92% sprinklered per SOV" },
];

export type Quote = {
  carrier: string;
  premium: string;
  deductible: string;
  limit: string;
  subjectivities: string[];
  materiality: "Standard" | "Material" | "Deal-breaker";
  validUntil: string;
  status: "Quoted" | "Declined" | "Bound";
};

// Carrier responses for SUB-24016 · Highline Hospitality Group
export const quotes: Quote[] = [
  { carrier: "James River Insurance", premium: "$421,000", deductible: "$10,000", limit: "$1M / $2M liquor liability", subjectivities: ["Signed application", "Liquor license copy"], materiality: "Standard", validUntil: "Feb 06, 2026", status: "Quoted" },
  { carrier: "Markel", premium: "$448,500", deductible: "$10,000", limit: "$1M / $2M liquor liability", subjectivities: ["Signed application", "4yr prior liquor liability loss runs", "Written security plan for main venue"], materiality: "Material", validUntil: "Feb 10, 2026", status: "Quoted" },
  { carrier: "Ategrity Specialty", premium: "—", deductible: "—", limit: "—", subjectivities: [], materiality: "Standard", validUntil: "—", status: "Declined" },
];

export type Binder = {
  id: string;
  insured: string;
  carrier: string;
  premium: string;
  effective: string;
  subjectivitiesCleared: number;
  subjectivitiesTotal: number;
  status: "Subjectivities open" | "Ready to bind" | "Bound — awaiting policy" | "Issued";
};

export const binders: Binder[] = [
  { id: "BND-5512", insured: "Palmetto Cold Storage LLC", carrier: "Kinsale Insurance", premium: "$187,400", effective: "Feb 12, 2026", subjectivitiesCleared: 4, subjectivitiesTotal: 4, status: "Ready to bind" },
  { id: "BND-5511", insured: "Highline Hospitality Group", carrier: "James River Insurance", premium: "$421,000", effective: "Feb 20, 2026", subjectivitiesCleared: 2, subjectivitiesTotal: 3, status: "Subjectivities open" },
  { id: "BND-5510", insured: "Cedar Grove Assisted Living", carrier: "Berkley Specialty", premium: "$118,400", effective: "Mar 10, 2026", subjectivitiesCleared: 3, subjectivitiesTotal: 3, status: "Bound — awaiting policy" },
  { id: "BND-5509", insured: "Copperline Data Center Ops", carrier: "Beazley", premium: "$612,300", effective: "Feb 28, 2026", subjectivitiesCleared: 5, subjectivitiesTotal: 5, status: "Issued" },
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
  { id: "MTC-8814", policy: "KIN-24-P-00812", insured: "Palmetto Cold Storage LLC", carrier: "Kinsale Insurance", type: "Add location", requested: "Today", impact: "+$14,200 premium", materiality: "Material", appetiteRecheck: "Still in appetite" },
  { id: "MTC-8813", policy: "JRI-24-P-00776", insured: "Highline Hospitality Group", carrier: "James River Insurance", type: "Increase liquor liability limit", requested: "Yesterday", impact: "+$9,600 premium", materiality: "Material", appetiteRecheck: "Still in appetite" },
  { id: "MTC-8812", policy: "BRK-24-P-00758", insured: "Cedar Grove Assisted Living", carrier: "Berkley Specialty", type: "Add named insured", requested: "2d ago", impact: "No premium change", materiality: "Non-material", appetiteRecheck: "Still in appetite" },
  { id: "MTC-8811", policy: "MRK-24-P-00741", insured: "Ridgeline Contractors, Inc.", carrier: "Markel", type: "Remove vehicle + reduce excess layer", requested: "3d ago", impact: "-$1,140 premium", materiality: "Complex", appetiteRecheck: "Marginal — review" },
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
  { id: "RMK-24-4102", insured: "Palmetto Cold Storage LLC", incumbentCarrier: "Kinsale Insurance", expiring: "Feb 12, 2026", priorPremium: "$168,900", indicated: "$187,400", change: "+10.9%", lossRatio: "38%", flag: "Payroll +14%", incumbentResponsive: true, trigger: "Monitor" },
  { id: "RMK-24-4101", insured: "Highline Hospitality Group", incumbentCarrier: "James River Insurance", expiring: "Feb 20, 2026", priorPremium: "$388,200", indicated: "$421,000", change: "+8.4%", lossRatio: "42%", flag: "New location added", incumbentResponsive: true, trigger: "Remarket — competitive check" },
  { id: "RMK-24-4100", insured: "Cedar Grove Assisted Living", incumbentCarrier: "Berkley Specialty", expiring: "Mar 10, 2026", priorPremium: "$112,700", indicated: "$118,400", change: "+5.1%", lossRatio: "29%", flag: "Clean", incumbentResponsive: true, trigger: "Renew as-is" },
  { id: "RMK-24-4099", insured: "Ridgeline Contractors, Inc.", incumbentCarrier: "Markel", expiring: "Mar 01, 2026", priorPremium: "$91,400", indicated: "$96,200", change: "+5.3%", lossRatio: "44%", flag: "Class code change", incumbentResponsive: false, trigger: "Remarket — active shop" },
  { id: "RMK-24-4098", insured: "Copperline Data Center Ops", incumbentCarrier: "Beazley", expiring: "Feb 28, 2026", priorPremium: "$584,100", indicated: "$612,300", change: "+4.8%", lossRatio: "12%", flag: "Cyber sublimit request", incumbentResponsive: true, trigger: "Renew as-is" },
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
  { id: "DS-3301", insured: "Palmetto Cold Storage LLC", state: "FL", requiredDeclinations: 3, declinationsOnFile: 3, evidenceSufficient: true, status: "Ready to file" },
  { id: "DS-3300", insured: "Highline Hospitality Group", state: "NV", requiredDeclinations: 3, declinationsOnFile: 2, evidenceSufficient: false, status: "Gathering evidence" },
  { id: "DS-3299", insured: "Ridgeline Contractors, Inc.", state: "CO", requiredDeclinations: 1, declinationsOnFile: 1, evidenceSufficient: true, status: "Filed" },
  { id: "DS-3298", insured: "Bayou Marine Services", state: "LA", requiredDeclinations: 0, declinationsOnFile: 0, evidenceSufficient: true, status: "Exempt" },
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
  { id: "SIG-441", carrier: "Kinsale Insurance", classOrAccount: "Cold storage / refrigerated warehousing", signal: "Appetite appears to be expanding", evidence: "3 of 3 recent cold-storage submissions quoted within 5 days · 0 declinations in 90 days", suggestedAction: "Raise class-level fit score +8", scope: "Class-level", status: "Pending review" },
  { id: "SIG-440", carrier: "Markel", classOrAccount: "Contractor excess — CO", signal: "Appetite appears to be tightening", evidence: "2 declinations in 30 days citing loss trend, both CO contractor excess", suggestedAction: "Lower class-level fit score −10 · flag for review", scope: "Class-level", status: "Pending review" },
  { id: "SIG-439", carrier: "James River Insurance", classOrAccount: "Highline Hospitality Group", signal: "Non-responsive on renewal remarket", evidence: "No reply to remarket inquiry after 12 business days · 2 follow-ups sent", suggestedAction: "Flag account for competitive remarket next cycle", scope: "Account-specific", status: "Approved" },
];

export const carrierPerformance = [
  { carrier: "Kinsale Insurance", submissions: 148, quoted: 96, bound: 62, hitRate: "42%", avgTurnaround: "4.1 days", premium: "$4.8M" },
  { carrier: "James River Insurance", submissions: 132, quoted: 88, bound: 51, hitRate: "39%", avgTurnaround: "5.6 days", premium: "$4.1M" },
  { carrier: "Markel", submissions: 121, quoted: 74, bound: 44, hitRate: "36%", avgTurnaround: "7.8 days", premium: "$3.6M" },
  { carrier: "Berkley Specialty", submissions: 98, quoted: 61, bound: 39, hitRate: "40%", avgTurnaround: "5.2 days", premium: "$3.2M" },
  { carrier: "Ategrity Specialty", submissions: 87, quoted: 41, bound: 22, hitRate: "25%", avgTurnaround: "9.4 days", premium: "$1.9M" },
];

export const retailAgents = [
  { agency: "Marsh Southeast", submissions: 74, packaged: 61, bound: 28, hitRate: "38%", avgResponseTime: "1h 12m" },
  { agency: "HUB International", submissions: 62, packaged: 50, bound: 21, hitRate: "34%", avgResponseTime: "1h 40m" },
  { agency: "Alliant Insurance", submissions: 58, packaged: 47, bound: 19, hitRate: "33%", avgResponseTime: "2h 05m" },
  { agency: "Gallagher", submissions: 49, packaged: 38, bound: 16, hitRate: "33%", avgResponseTime: "1h 58m" },
  { agency: "Risk Strategies", submissions: 41, packaged: 30, bound: 11, hitRate: "27%", avgResponseTime: "2h 30m" },
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
  { at: "09:42", who: "AI (Matching/Ranking Core)", what: "Ranked carrier panel — Kinsale #1 fit", ctx: "SUB-24019 · Palmetto Cold Storage", conf: "94%" },
  { at: "09:41", who: "AI (Extraction Core)", what: "Cross-doc validation passed", ctx: "SUB-24019 · 6 documents", conf: "97%" },
  { at: "09:28", who: "Sam D. (Wholesale Broker)", what: "Approved remarket recommendation — renew as-is", ctx: "RMK-24-4100 · Cedar Grove", conf: "—" },
  { at: "09:11", who: "AI (Matching/Ranking Core)", what: "Flagged out of appetite — no market", ctx: "SUB-24015 · Northwind Wood Products", conf: "88%" },
  { at: "08:52", who: "AI (Extraction Core)", what: "Loss run parsed (5 yr)", ctx: "SUB-24018 · Ridgeline Contractors", conf: "91%" },
  { at: "08:33", who: "Marcus W. (Broker)", what: "Override — added marginal-fit market to panel", ctx: "SUB-24014 · Ironclad Salvage", conf: "—" },
];
