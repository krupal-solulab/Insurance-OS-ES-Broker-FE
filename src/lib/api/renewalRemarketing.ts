/**
 * Typed calls for /api/es/renewal-remarketing (Backend-AI-OS,
 * verticals/es/workflows/renewal_remarketing/router.py). The seventh E&S
 * workflow — see docs/FE_CONTRACT_renewal_remarketing.md in the backend
 * repo. An orchestration workflow: `initiate-remarket` genuinely
 * re-invokes MarketMatchingPipeline, so a successful call also creates a
 * new item visible at /api/es/market-matching.
 */
import { api } from "./client";
import type { components } from "./schema";

// Qualified with the module path — every ES workflow router defines its own
// `ReviewItemOut`/`RunRequest` classes (see marketMatching.ts's comment).
export type ReviewItemOut =
  components["schemas"]["verticals__es__workflows__renewal_remarketing__router__ReviewItemOut"];
export type RemarketDecisionPayload = components["schemas"]["RemarketDecisionPayload"];
export type ComparisonOutputOut = components["schemas"]["ComparisonOutputOut"];

const BASE = "/api/es/renewal-remarketing";

export function listRenewalRemarketing() {
  return api.get<ReviewItemOut[]>(BASE);
}

export function getRenewalRemarketing(itemId: string) {
  return api.get<ReviewItemOut>(`${BASE}/${itemId}`);
}

export function runRenewalRemarketing(scenarioRef: string) {
  return api.post<ReviewItemOut>(`${BASE}/run`, { scenario_ref: scenarioRef });
}

export interface LiveBind {
  bind_id: string;
  named_insured: string | null;
  carrier_name: string | null;
}

/** Every real Binder Issuance bind for this tenant, for the "Check live
 * renewal" picker. */
export function listLiveBinds() {
  return api.get<LiveBind[]>(`${BASE}/live-binds`);
}

/** Additive alongside the fixture-scenario run above: a real trigger-stage
 * review built from an ACTUAL Binder Issuance bind + real Endorsement
 * Processing history for it — genuine Binder Issuance/Endorsement
 * Processing -> Renewal Remarketing hand-off (FR-2), not another fixture
 * scenario. */
export function runRenewalRemarketingLive(bindId: string) {
  return api.post<ReviewItemOut>(`${BASE}/run-live`, { bind_id: bindId });
}

/** "Approve light check" / "Approve full remarket" — both use this same
 * action. Genuinely re-invokes MarketMatchingPipeline; 409s if the decision
 * was NO_REMARKET. */
export function initiateRemarket(itemId: string) {
  return api.post<ReviewItemOut>(`${BASE}/${itemId}/initiate-remarket`);
}

export function acceptIncumbent(itemId: string) {
  return api.post<ReviewItemOut>(`${BASE}/${itemId}/accept-incumbent`);
}

export function escalateRenewalRemarketing(itemId: string) {
  return api.post<ReviewItemOut>(`${BASE}/${itemId}/escalate`);
}

export interface FixtureScenario {
  ref: string;
  label: string;
}

/** The 6 Workflow_16 fixture scenarios (see
 * Data sets/Workflow 7/renewal_remarketing_dataset/README.md). */
export const FIXTURE_SCENARIOS: FixtureScenario[] = [
  { ref: "scenario_01", label: "Continental Freight — flat exposure, no losses (no remarket)" },
  {
    ref: "scenario_02",
    label: "Summit Roofing — 58.5% increase, continued severity (full remarket)",
  },
  {
    ref: "scenario_03",
    label: "Oakwood Apartment Homes — favorable change, larger size band (light check)",
  },
  { ref: "scenario_04", label: "Delta Electric — incumbent silent 25 days out (urgent remarket)" },
  {
    ref: "scenario_05",
    label: "Summit Roofing — post-remarket comparison (exception-quote flagging)",
  },
  {
    ref: "scenario_06",
    label: "Clearpath Bookkeeping — remarketing history shows no value (no remarket)",
  },
];
