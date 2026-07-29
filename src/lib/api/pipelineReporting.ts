/**
 * Typed calls for /api/es/pipeline-reporting (Backend-AI-OS,
 * verticals/es/workflows/pipeline_reporting/router.py). The 10th and last
 * workflow on the original E&S roadmap — see
 * docs/FE_CONTRACT_pipeline_reporting.md in the backend repo.
 *
 * Pure aggregation/reporting: only run/list/detail, no approve/escalate —
 * a report isn't a determination a human approves or declines.
 */
import { api } from "./client";
import type { components } from "./schema";

// Qualified with the module path — every ES workflow router defines its own
// `ReviewItemOut`/`RunRequest` classes (see marketMatching.ts's comment).
export type ReviewItemOut =
  components["schemas"]["verticals__es__workflows__pipeline_reporting__router__ReviewItemOut"];
export type PipelineReportPayload = components["schemas"]["PipelineReportPayload"];
export type FunnelStageOut = components["schemas"]["FunnelStageOut"];
export type CarrierPerformanceOut = components["schemas"]["CarrierPerformanceOut"];
export type RemarketOutcomeOut = components["schemas"]["RemarketOutcomeOut"];

const BASE = "/api/es/pipeline-reporting";

export function listPipelineReporting() {
  return api.get<ReviewItemOut[]>(BASE);
}

export function getPipelineReporting(itemId: string) {
  return api.get<ReviewItemOut>(`${BASE}/${itemId}`);
}

export function runPipelineReporting(scenarioRef: string) {
  return api.post<ReviewItemOut>(`${BASE}/run`, { scenario_ref: scenarioRef });
}

/** Additive alongside the fixture-scenario run above: builds one report
 * from real cross-workflow data already logged for this tenant (Market
 * Matching, Package Assembly, Quote Comparison, Binder Issuance, Renewal
 * Remarketing) — genuine aggregation, not another fixture scenario. */
export function runPipelineReportingLive() {
  return api.post<ReviewItemOut>(`${BASE}/run-live`);
}

export interface FixtureScenario {
  ref: string;
  label: string;
}

/** The 4 Workflow_19 fixture scenarios (see
 * Data sets/Workflow 10/pipeline_reporting_dataset/README.md). */
export const FIXTURE_SCENARIOS: FixtureScenario[] = [
  { ref: "scenario_01", label: "Q3 clean funnel — complete data baseline" },
  { ref: "scenario_02", label: "Carrier hit-rate — one low-volume carrier" },
  { ref: "scenario_03", label: "Q3 funnel with a 2-week logging gap (release gate)" },
  { ref: "scenario_04", label: "Remarketing value — $0-savings, confirmed-incumbent case" },
];
