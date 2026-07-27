/**
 * Typed calls for /api/es/endorsement (Backend-AI-OS,
 * verticals/es/workflows/endorsement/router.py). The sixth E&S workflow —
 * see docs/FE_CONTRACT_endorsement.md in the backend repo.
 */
import { api } from "./client";
import type { components } from "./schema";

// Qualified with the module path — every ES workflow router defines its own
// `ReviewItemOut`/`RunRequest` classes (see marketMatching.ts's comment).
// `DiscrepancyOut` needs the same treatment — binder_issuance defines its
// own class with the same name.
export type ReviewItemOut =
  components["schemas"]["verticals__es__workflows__endorsement__router__ReviewItemOut"];
export type EndorsementRequestPayload = components["schemas"]["EndorsementRequestPayload"];
export type DiscrepancyOut =
  components["schemas"]["verticals__es__workflows__endorsement__schema__DiscrepancyOut"];
export type DiscrepancyResolution = "accept_carrier_issuance" | "flag_carrier_error";

const BASE = "/api/es/endorsement";

export function listEndorsement() {
  return api.get<ReviewItemOut[]>(BASE);
}

export function getEndorsement(itemId: string) {
  return api.get<ReviewItemOut>(`${BASE}/${itemId}`);
}

export function runEndorsement(scenarioRef: string) {
  return api.post<ReviewItemOut>(`${BASE}/run`, { scenario_ref: scenarioRef });
}

/** Required before the ENDORSEMENT_CONFIRMED downstream trigger can fire. */
export function resolveDiscrepancy(itemId: string, resolution: DiscrepancyResolution) {
  return api.post<ReviewItemOut>(`${BASE}/${itemId}/resolve-discrepancy`, { resolution });
}

/** Senior/admin only — project-wide SEND rule. */
export function sendEndorsement(itemId: string) {
  return api.post<ReviewItemOut>(`${BASE}/${itemId}/send`);
}

export function escalateEndorsement(itemId: string) {
  return api.post<ReviewItemOut>(`${BASE}/${itemId}/escalate`);
}

export interface FixtureScenario {
  ref: string;
  label: string;
}

/** The 6 Workflow_15 fixture scenarios (see
 * Data sets/Workflow 6/endorsement_dataset/README.md). */
export const FIXTURE_SCENARIOS: FixtureScenario[] = [
  { ref: "scenario_01", label: "Continental Freight — add additional insured (routine)" },
  { ref: "scenario_02", label: "Summit Roofing — limit increase (UW review required)" },
  { ref: "scenario_03", label: "Delta Electric — new operations class (appetite unknown)" },
  { ref: "scenario_04", label: "Oakwood Apartment Homes — add location (material, in appetite)" },
  { ref: "scenario_05", label: "Continental Freight — issued endorsement missing an item" },
  { ref: "scenario_06", label: "Clearpath Bookkeeping — headcount update (routine control case)" },
];
