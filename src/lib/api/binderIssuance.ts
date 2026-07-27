/**
 * Typed calls for /api/es/binder-issuance (Backend-AI-OS,
 * verticals/es/workflows/binder_issuance/router.py). The fifth E&S
 * workflow — see docs/FE_CONTRACT_binder_issuance.md in the backend repo.
 */
import { api } from "./client";
import type { components } from "./schema";

// Qualified with the module path — every ES workflow router defines its own
// `ReviewItemOut`/`RunRequest` classes (see marketMatching.ts's comment).
export type ReviewItemOut =
  components["schemas"]["verticals__es__workflows__binder_issuance__router__ReviewItemOut"];
export type BindCoordinationPayload = components["schemas"]["BindCoordinationPayload"];
export type DiscrepancyOut = components["schemas"]["DiscrepancyOut"];
export type OngoingObligationOut = components["schemas"]["OngoingObligationOut"];
export type DiscrepancyResolution = "accept_carrier_version" | "flag_carrier_error";
export type PolicyDiscrepancyResolution = "accept_issued_version" | "flag_carrier_error";

const BASE = "/api/es/binder-issuance";

export function listBinderIssuance() {
  return api.get<ReviewItemOut[]>(BASE);
}

/** Issuance-overdue status and obligation reminders are recomputed against
 * today's real date server-side on every call. */
export function getBinderIssuance(itemId: string) {
  return api.get<ReviewItemOut>(`${BASE}/${itemId}`);
}

export function runBinderIssuance(scenarioRef: string) {
  return api.post<ReviewItemOut>(`${BASE}/run`, { scenario_ref: scenarioRef });
}

/** Required before Placement Confirmation can fire (BI-06's gate). */
export function resolveConfirmationDiscrepancy(itemId: string, resolution: DiscrepancyResolution) {
  return api.post<ReviewItemOut>(`${BASE}/${itemId}/resolve-confirmation-discrepancy`, {
    resolution,
  });
}

/** Required before Policy Documents Delivered can fire (BI-06's gate). */
export function resolvePolicyDiscrepancy(itemId: string, resolution: PolicyDiscrepancyResolution) {
  return api.post<ReviewItemOut>(`${BASE}/${itemId}/resolve-policy-discrepancy`, { resolution });
}

export function escalateBinderIssuance(itemId: string) {
  return api.post<ReviewItemOut>(`${BASE}/${itemId}/escalate`);
}

export interface FixtureScenario {
  ref: string;
  label: string;
}

/** The 6 Workflow_14 fixture scenarios (see
 * Data sets/Workflow 5/binder_issuance_dataset/README.md). */
export const FIXTURE_SCENARIOS: FixtureScenario[] = [
  { ref: "scenario_01", label: "Continental Freight → Vantage — clean bind" },
  { ref: "scenario_02", label: "Oakwood Apartment Homes → Coastal Mutual — blocked (inspection)" },
  { ref: "scenario_03", label: "Delta Electric → Ironclad — bind confirmation discrepancy" },
  { ref: "scenario_04", label: "Summit Roofing → Ironclad — clean bind + ongoing obligation" },
  { ref: "scenario_05", label: "Clearpath Bookkeeping → Apex Excess Lines — overdue issuance" },
  {
    ref: "scenario_06",
    label: "Oakwood Apartment Homes → Coastal Mutual (later) — issued-policy discrepancy",
  },
];
