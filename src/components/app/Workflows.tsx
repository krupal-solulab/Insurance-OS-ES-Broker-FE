import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  FIXTURE_SUBMISSION_REFS,
  actOnMarketMatching,
  getMarketMatching,
  listDocuments,
  listMarketMatching,
  runMarketMatching,
  type CarrierMatchOut,
  type DiligentSearchOut,
  type ExcludedCarrierOut,
  type MarketMatchingPayload,
  type ReviewActionVerb,
} from "@/lib/api/marketMatching";
import {
  FIXTURE_SCENARIO_REFS,
  actOnPackageAssembly,
  getPackageAssembly,
  listPackageAssembly,
  runPackageAssembly,
  runPackageAssemblyFromMarketMatching,
  type PackageActionVerb,
  type PackageAssemblyPayload,
} from "@/lib/api/packageAssembly";
import {
  FIXTURE_TRIGGERS,
  actOnAgentCommunication,
  complianceClear,
  getAgentCommunication,
  listAgentCommunication,
  runAgentCommunication,
  type AgentCommActionVerb,
} from "@/lib/api/agentCommunication";
import {
  FIXTURE_SCENARIOS as QUOTE_FIXTURE_SCENARIOS,
  getQuoteComparison,
  listQuoteComparison,
  markLapsed,
  requestRevisedTerms,
  runQuoteComparison,
  selectQuote,
  type ComparisonPayload,
  type ExtractedQuoteOut,
  type FixtureScenario,
} from "@/lib/api/quoteComparison";
import {
  FIXTURE_SCENARIOS as BINDER_FIXTURE_SCENARIOS,
  escalateBinderIssuance,
  getBinderIssuance,
  listBinderIssuance,
  resolveConfirmationDiscrepancy,
  resolvePolicyDiscrepancy,
  runBinderIssuance,
  runBinderIssuanceFromQuote,
  type BindCoordinationPayload,
  type DiscrepancyOut,
  type DiscrepancyResolution,
  type FixtureScenario as BinderFixtureScenario,
  type PolicyDiscrepancyResolution,
} from "@/lib/api/binderIssuance";
import {
  FIXTURE_SCENARIOS as ENDORSEMENT_FIXTURE_SCENARIOS,
  escalateEndorsement,
  getEndorsement,
  listEndorsement,
  resolveDiscrepancy as resolveEndorsementDiscrepancy,
  runEndorsement,
  sendEndorsement,
  type DiscrepancyResolution as EndorsementDiscrepancyResolution,
  type EndorsementRequestPayload,
  type FixtureScenario as EndorsementFixtureScenario,
} from "@/lib/api/endorsement";
import {
  FIXTURE_SCENARIOS as RENEWAL_FIXTURE_SCENARIOS,
  acceptIncumbent,
  escalateRenewalRemarketing,
  getRenewalRemarketing,
  initiateRemarket,
  listRenewalRemarketing,
  runRenewalRemarketing,
  type ComparisonOutputOut,
  type FixtureScenario as RenewalFixtureScenario,
  type RemarketDecisionPayload,
} from "@/lib/api/renewalRemarketing";
import {
  FIXTURE_SCENARIOS as COMPLIANCE_FIXTURE_SCENARIOS,
  approveDiligentSearch,
  escalateDiligentSearch,
  getDiligentSearch,
  listDiligentSearch,
  runDiligentSearch,
  type ComplianceRecordPayload,
  type FixtureScenario as ComplianceFixtureScenario,
  type StateDeterminationOut,
} from "@/lib/api/diligentSearch";
import {
  FIXTURE_SCENARIOS as APPETITE_FIXTURE_SCENARIOS,
  approveCarrierAppetiteIntelligence,
  dismissCarrierAppetiteIntelligence,
  getCarrierAppetiteIntelligence,
  listCarrierAppetiteIntelligence,
  runCarrierAppetiteIntelligence,
  runCarrierAppetiteIntelligenceLive,
  type CarrierAppetiteEvaluationPayload,
  type EvidenceItemOut,
  type FixtureScenario as AppetiteFixtureScenario,
} from "@/lib/api/carrierAppetiteIntelligence";
import {
  FIXTURE_SCENARIOS as REPORTING_FIXTURE_SCENARIOS,
  getPipelineReporting,
  listPipelineReporting,
  runPipelineReporting,
  runPipelineReportingLive,
  type CarrierPerformanceOut,
  type FixtureScenario as ReportingFixtureScenario,
  type FunnelStageOut,
  type PipelineReportPayload,
  type RemarketOutcomeOut,
} from "@/lib/api/pipelineReporting";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  FileText,
  Sparkles,
  Filter,
  Search,
  Upload,
  Paperclip,
  Send,
  Building2,
  MapPin,
  Calendar,
  Download,
  ShieldCheck,
  ShieldAlert,
  Gavel,
  Scan,
  MessageSquare,
  FileSearch,
  XCircle,
  Radar,
  Lock,
  Copy,
  Loader2,
  Clock,
  Package,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { simulateRequest } from "@/lib/simulate";
import { PageHeader } from "./AppShell";
import type { ReactNode } from "react";

/* ============================================================
   Reusable primitives shared across every workflow
   ============================================================ */

export function Panel({
  title,
  subtitle,
  actions,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-border bg-background p-5 shadow-sm ${className}`}
    >
      {(title || actions) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="font-serif text-lg leading-tight">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function Chip({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "success" | "warn" | "danger";
}) {
  const map: Record<string, string> = {
    neutral: "bg-secondary text-foreground border-border",
    accent: "bg-accent/10 text-accent border-accent/25",
    success: "bg-success/10 text-success border-success/25",
    warn: "bg-warn/10 text-warn border-warn/25",
    danger: "bg-destructive/10 text-destructive border-destructive/25",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors ${map[tone]}`}
    >
      {children}
    </span>
  );
}

function Button({ children, variant = "secondary", className = "", ...p }: any) {
  const base =
    "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-[color,background-color,border-color,box-shadow,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100";
  const styles: Record<string, string> = {
    primary: "bg-foreground text-background hover:opacity-90",
    secondary: "border border-border bg-background hover:bg-secondary",
    ghost: "hover:bg-secondary",
    danger: "border border-destructive/40 text-destructive hover:bg-destructive/10",
    accent: "bg-accent text-accent-foreground hover:opacity-90",
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...p}>
      {children}
    </button>
  );
}

function FoundationBadge({ kind }: { kind: "extraction" | "matching" }) {
  const isExt = kind === "extraction";
  return (
    <Link
      to="/app/foundation/$slug"
      params={{ slug: isExt ? "extraction-core" : "matching-core" }}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-foreground hover:border-foreground/40"
      title="Reused platform capability"
    >
      {isExt ? <Scan className="h-3 w-3 text-accent" /> : <Gavel className="h-3 w-3 text-accent" />}
      {isExt ? "Extraction Core" : "Matching/Ranking Core"}
    </Link>
  );
}

function SearchBar({ placeholder = "Search…" }: { placeholder?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm">
      <Search className="h-3.5 w-3.5 text-muted-foreground" />
      <input placeholder={placeholder} className="flex-1 bg-transparent outline-none" />
    </div>
  );
}

function FiltersRow({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Filter className="h-3.5 w-3.5 text-muted-foreground" />
      {items.map((i, idx) => (
        <Chip key={i} tone={idx === 0 ? "accent" : "neutral"}>
          {i}
        </Chip>
      ))}
    </div>
  );
}

export function Tabs({
  tabs,
  value,
  onChange,
}: {
  tabs: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-secondary/60 p-1 text-xs">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`rounded-md px-3 py-1.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${value === t ? "bg-background font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function ProcessAnim({ steps }: { steps: { label: string; kind?: "extraction" | "matching" }[] }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-4">
      <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        <Sparkles className="h-3 w-3 text-accent" /> Live AI processing
      </div>
      <ol className="space-y-2 text-sm">
        {steps.map((s, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-background text-[11px] font-mono">
              {i + 1}
            </span>
            <span className="flex-1">{s.label}</span>
            {s.kind && <FoundationBadge kind={s.kind} />}
            <CheckCircle2 className="h-4 w-4 text-success" />
          </li>
        ))}
      </ol>
    </div>
  );
}

function MetricTile({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "success" | "warn" | "danger";
}) {
  const border =
    tone === "success"
      ? "border-success/30"
      : tone === "warn"
        ? "border-warn/30"
        : "border-destructive/30";
  return (
    <div className={`rounded-xl border ${border} bg-secondary/30 p-4`}>
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 font-serif text-2xl leading-none">{value}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function Row({
  label,
  prior,
  now,
  change,
  strong,
  positive,
}: {
  label: string;
  prior: string;
  now: string;
  change?: string;
  strong?: boolean;
  positive?: boolean;
}) {
  return (
    <>
      <div className="border-t border-border px-4 py-2.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={`border-t border-border px-4 py-2.5 ${strong ? "font-serif" : ""}`}>
        {prior}
      </div>
      <div className={`border-t border-border px-4 py-2.5 ${strong ? "font-serif" : ""}`}>
        <span className="mr-2">{now}</span>
        {change && (
          <span className={`text-[11px] font-mono ${positive ? "text-success" : "text-accent"}`}>
            {change}
          </span>
        )}
      </div>
    </>
  );
}

function ProgressRow({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span className="font-mono text-muted-foreground">{pct}%</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-accent transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function GovKpi({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 font-serif text-3xl leading-none">{value}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function Consistency({
  label,
  detail,
  ok,
  warn,
}: {
  label: string;
  detail: string;
  ok?: boolean;
  warn?: boolean;
}) {
  const Icon = warn ? AlertTriangle : ok ? CheckCircle2 : Info;
  const tone = warn ? "text-warn" : ok ? "text-success" : "text-muted-foreground";
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${tone}`} />
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-[11px] text-muted-foreground">{detail}</div>
      </div>
    </div>
  );
}

/* ============================================================
   1. Submission Market Matching
   ============================================================ */

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending review",
  approved: "Approved",
  overridden: "Overridden",
  escalated: "Escalated",
  sent: "Sent",
  issued: "Issued",
};

const ACTION_LABEL: Record<ReviewActionVerb, string> = {
  approve: "Approve",
  override: "Override",
  escalate: "Escalate",
  send: "Send",
  issue: "Issue",
};

function scorePct(score: number): number {
  return Math.round(score * 100);
}

/** Derived only from fields the API actually returns (matches[]/excluded[]/diligent_search) —
 * there is no top-level recommendation field in MarketMatchingPayload to read instead. */
function deriveOutcome(payload: MarketMatchingPayload | null | undefined): {
  label: string;
  tone: "success" | "warn" | "danger";
} {
  if (!payload) return { label: "Not yet run", tone: "warn" };
  if (payload.matches.length > 0) return { label: "Carriers matched", tone: "success" };
  if (payload.excluded.length === 0 && payload.diligent_search.note === "not evaluated") {
    return { label: "Missing ACORD — cannot evaluate", tone: "warn" };
  }
  return { label: "No market found", tone: "danger" };
}

export function SubmissionMarketMatching() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedCarriers, setSelectedCarriers] = useState<string[]>([]);
  const [tab, setTab] = useState("Carrier ranking");
  const [log, setLog] = useState<LogEntry[]>([]);

  const listQuery = useQuery({
    queryKey: ["market-matching", "list"],
    queryFn: listMarketMatching,
  });
  const items = listQuery.data ?? [];
  const selectedRow = items.find((i) => i.id === selectedId) ?? items[0];
  const firstItemId = listQuery.data?.[0]?.id;

  useEffect(() => {
    if (!selectedId && firstItemId) setSelectedId(firstItemId);
  }, [firstItemId, selectedId]);

  const detailQuery = useQuery({
    queryKey: ["market-matching", "detail", selectedRow?.id],
    queryFn: () => getMarketMatching(selectedRow!.id),
    enabled: Boolean(selectedRow?.id),
  });
  const payload = detailQuery.data?.payload;

  function appendLog(who: string, what: string, ctx: string, conf = "—") {
    setLog((prev) => [
      {
        at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        who,
        what,
        ctx,
        conf,
      },
      ...prev,
    ]);
  }

  function toggleCarrier(carrier: string) {
    setSelectedCarriers((prev) =>
      prev.includes(carrier) ? prev.filter((c) => c !== carrier) : [...prev, carrier],
    );
  }

  const unrunRefs = FIXTURE_SUBMISSION_REFS.filter(
    (ref) => !items.some((i) => i.submission_id === ref),
  );

  const runBatchMutation = useMutation({
    mutationFn: async () => {
      for (const ref of unrunRefs) await runMarketMatching(ref);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market-matching", "list"] });
      toast.success(
        unrunRefs.length
          ? `Ran matching for ${unrunRefs.length} fixture submission(s)`
          : "All fixture submissions already run",
      );
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Batch matching run failed");
    },
  });

  const outcome = deriveOutcome(payload);

  return (
    <div className="mx-auto max-w-[1500px] animate-in fade-in-0 duration-500">
      <PageHeader
        eyebrow="Workflow 01 · Live"
        title="Submission Market Matching"
        description="Wired to Backend-AI-OS's /api/es/market-matching — real ranked-carrier data from the Workflow_10 fixture set (submission_01..06). Sections the API has no data for yet say so explicitly rather than showing invented numbers."
        actions={
          <>
            <Button
              variant="secondary"
              disabled
              title="Not wired — there's no submission-upload endpoint yet, this pass only runs the Workflow_10 fixtures"
            >
              <Upload className="h-4 w-4" />
              Upload submission
            </Button>
            <Button
              variant="primary"
              disabled={runBatchMutation.isPending || unrunRefs.length === 0}
              onClick={() => runBatchMutation.mutate()}
            >
              {runBatchMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {unrunRefs.length === 0
                ? "All fixtures run"
                : `Run batch matching (${unrunRefs.length})`}
            </Button>
          </>
        }
      />

      {listQuery.isLoading && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading submissions from Backend-AI-OS…
        </div>
      )}
      {listQuery.isError && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          {listQuery.error instanceof Error
            ? listQuery.error.message
            : "Failed to load submissions."}
        </div>
      )}

      {!listQuery.isLoading && !listQuery.isError && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)]">
          {/* Inbox */}
          <Panel title="Submission inbox" subtitle={`${items.length} run · Workflow_10 fixtures`}>
            {items.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No submissions run yet — click "Run batch matching" to process the fixture set.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {items.map((row) => (
                  <button
                    key={row.id}
                    onClick={() => setSelectedId(row.id)}
                    className={`flex w-full items-start gap-3 py-3 text-left transition hover:bg-secondary/40 ${
                      selectedId === row.id ? "bg-secondary/50" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="truncate font-mono text-sm">
                        {row.submission_id ?? row.id}
                      </span>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Chip>{STATUS_LABEL[row.status] ?? row.status}</Chip>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Panel>

          {/* Detail */}
          {!selectedRow ? (
            <Panel>
              <div className="py-10 text-center text-sm text-muted-foreground">
                Select a submission from the inbox.
              </div>
            </Panel>
          ) : (
            <div className="space-y-5">
              <Panel>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono text-muted-foreground">
                      {selectedRow.id}
                    </div>
                    <h2 className="mt-1 font-serif text-2xl leading-tight">
                      {selectedRow.submission_id ?? "Unknown submission"}
                    </h2>
                    <div className="mt-2 text-[11px] text-muted-foreground">
                      Workflow_10 fixture — there's no submission-metadata endpoint yet, so only the
                      ranking data below is real; insured/industry/state/TIV/premium aren't shown
                      because the API has no such fields for this workflow.
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      disabled={selectedCarriers.length === 0}
                      title={
                        selectedCarriers.length === 0
                          ? "Select at least one carrier in Carrier ranking first"
                          : undefined
                      }
                      onClick={() => {
                        appendLog(
                          "You",
                          `Selected ${selectedCarriers.length} carrier${selectedCarriers.length === 1 ? "" : "s"} for packaging — ${selectedCarriers.join(", ")}`,
                          `${selectedRow.submission_id ?? selectedRow.id} · proceeding to Package Assembly`,
                        );
                        navigate({
                          to: "/app/workflows/$slug",
                          params: { slug: "package-assembly" },
                          search: {
                            submissionId: selectedRow.submission_id ?? selectedRow.id,
                            carriers: selectedCarriers.join(","),
                            marketMatchingItemId: selectedRow.id,
                          },
                        });
                      }}
                    >
                      Proceed to package
                      {selectedCarriers.length > 0 ? ` (${selectedCarriers.length})` : ""}{" "}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <MetricTile
                    label="Status"
                    value={STATUS_LABEL[selectedRow.status] ?? selectedRow.status}
                    sub="Review-item status"
                    tone="success"
                  />
                  <MetricTile
                    label="Top score"
                    value={
                      payload && payload.matches.length > 0
                        ? scorePct(payload.matches[0].score).toString()
                        : "—"
                    }
                    sub={
                      payload?.matches[0] ? payload.matches[0].carrier_name : "No carrier matched"
                    }
                    tone={payload && payload.matches.length > 0 ? "success" : "warn"}
                  />
                  <MetricTile
                    label="Outcome"
                    value={outcome.label}
                    sub={`${payload?.matches.length ?? 0} matched · ${payload?.excluded.length ?? 0} excluded`}
                    tone={outcome.tone}
                  />
                </div>
              </Panel>

              <Panel>
                <Tabs
                  tabs={[
                    "Documents",
                    "Carrier ranking",
                    "Match rules",
                    "AI recommendation",
                    "Activity",
                  ]}
                  value={tab}
                  onChange={setTab}
                />
                <div className="mt-5">
                  {detailQuery.isLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading submission detail…
                    </div>
                  )}
                  {detailQuery.isError && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      {detailQuery.error instanceof Error
                        ? detailQuery.error.message
                        : "Failed to load detail."}
                    </div>
                  )}
                  {!detailQuery.isLoading && !detailQuery.isError && payload && (
                    <>
                      {tab === "Documents" && <DocumentsTab itemId={selectedRow.id} />}
                      {tab === "Carrier ranking" && (
                        <CarrierRankingTab
                          matches={payload.matches}
                          excluded={payload.excluded}
                          diligentSearch={payload.diligent_search}
                          selected={selectedCarriers}
                          onToggle={toggleCarrier}
                        />
                      )}
                      {tab === "Match rules" && <MatchRulesTab excluded={payload.excluded} />}
                      {tab === "AI recommendation" && (
                        <MatchRecommendationTab
                          itemId={selectedRow.id}
                          outcome={outcome}
                          matchCount={payload.matches.length}
                          excludedCount={payload.excluded.length}
                          onActed={appendLog}
                        />
                      )}
                      {tab === "Activity" && <ActivityTab log={log} />}
                    </>
                  )}
                </div>
              </Panel>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DocumentsTab({ itemId }: { itemId: string }) {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const docsQuery = useQuery({
    queryKey: ["market-matching", "documents", itemId],
    queryFn: () => listDocuments(itemId),
  });
  const docs = docsQuery.data ?? [];
  const active = docs.find((d) => d.filename === selectedDoc) ?? docs[0];

  if (docsQuery.isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading documents…
      </div>
    );
  }
  if (docsQuery.isError) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <AlertTriangle className="h-4 w-4" />
        {docsQuery.error instanceof Error ? docsQuery.error.message : "Failed to load documents."}
      </div>
    );
  }
  if (docs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        No documents recorded for this submission — it was likely run before document persistence
        was added; re-run it to backfill.
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.6fr]">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs font-medium">{docs.length} document(s)</div>
          <FoundationBadge kind="extraction" />
        </div>
        <ul className="space-y-2 text-sm">
          {docs.map((d) => (
            <li key={d.filename}>
              <button
                onClick={() => setSelectedDoc(d.filename)}
                className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition hover:bg-secondary/40 ${
                  active?.filename === d.filename ? "border-accent/40 bg-accent/5" : "border-border"
                }`}
              >
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-secondary">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{d.filename}</div>
                  <div className="text-[11px] text-muted-foreground">{d.kind}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="mb-2 text-xs font-medium">{active?.filename ?? "Select a document"}</div>
        <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-paper p-4 font-mono text-[11px] text-ink-soft">
          {active?.content ?? ""}
        </pre>
        <div className="mt-2 text-[10px] text-muted-foreground">
          Real raw document content from the fixture set — not field-level citations (extraction
          doesn't track per-character source offsets, so there's no highlighted-field view here).
        </div>
      </div>
    </div>
  );
}

function CarrierRankingTab({
  matches,
  excluded,
  diligentSearch,
  selected,
  onToggle,
}: {
  matches: CarrierMatchOut[];
  excluded: ExcludedCarrierOut[];
  diligentSearch: DiligentSearchOut;
  selected: string[];
  onToggle: (carrier: string) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs font-medium">
            {matches.length} of {matches.length + excluded.length} carriers in appetite ·{" "}
            {selected.length} selected for packaging
          </div>
          <FoundationBadge kind="matching" />
        </div>
        {matches.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            No carrier on the current panel matched this submission's appetite data.
          </div>
        ) : (
          <ul className="space-y-2">
            {matches.map((m) => {
              const isChecked = selected.includes(m.carrier_name);
              return (
                <li
                  key={m.carrier_id}
                  className={`rounded-lg border p-3 text-sm ${isChecked ? "border-accent/40 bg-accent/5" : "border-border"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => onToggle(m.carrier_name)}
                        aria-label={`Select ${m.carrier_name} for packaging`}
                      />
                      <span className="font-medium">{m.carrier_name}</span>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {scorePct(m.score)}
                    </span>
                  </div>
                  {m.flags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.flags.map((f) => (
                        <Chip key={f} tone="warn">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          {f}
                        </Chip>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <div className="mb-2 text-xs font-medium">Excluded from panel</div>
          {excluded.length === 0 ? (
            <div className="text-sm text-muted-foreground">No carriers excluded.</div>
          ) : (
            <ul className="space-y-2">
              {excluded.map((e) => (
                <li key={e.carrier_id} className="rounded-lg border border-border p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{e.carrier_name}</span>
                    <Chip tone="danger">{e.rule}</Chip>
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{e.reason}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <div className="mb-2 text-xs font-medium">Diligent search (MM-07)</div>
          <div
            className={`rounded-lg border p-3 text-sm ${diligentSearch.compliant ? "border-success/30 bg-success/5" : "border-warn/30 bg-warn/5"}`}
          >
            <div className="flex items-center gap-2">
              {diligentSearch.compliant ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              ) : (
                <AlertTriangle className="h-4 w-4 shrink-0 text-warn" />
              )}
              <span className="font-medium">{diligentSearch.on_file} declination(s) on file</span>
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">{diligentSearch.note}</div>
          </div>
          <div className="mt-1 text-[10px] text-muted-foreground">
            Computed once per submission, independent of carrier ranking — not per-state (no
            per-state diligent-search reference data is returned by the API).
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchRulesTab({ excluded }: { excluded: ExcludedCarrierOut[] }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-medium">
          Hard-exclusion rules (MM-01..04) — why carriers didn't match
        </div>
        <FoundationBadge kind="matching" />
      </div>

      <div className="mb-4 flex items-start gap-2 rounded-lg border border-dashed border-border p-3 text-[11px] text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          The API returns the single deciding rule + reason for each excluded carrier, but not a
          full per-check pass/fail breakdown for matched carriers, nor the soft-scoring factor
          breakdown (severity margin, completeness, historical hit rate, appetite confidence) behind
          the final composite score — those are computed internally in <code>decision_core</code>{" "}
          but aren't part of <code>MarketMatchingPayload</code> today.
        </span>
      </div>

      {excluded.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No carriers were excluded for this submission.
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {excluded.map((e) => (
            <li key={e.carrier_id} className="flex items-start gap-3 p-3 text-sm">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <div className="flex-1">
                <div className="font-medium">{e.carrier_name}</div>
                <div className="text-[11px] text-muted-foreground">{e.reason}</div>
              </div>
              <Chip tone="danger">{e.rule}</Chip>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MatchRecommendationTab({
  itemId,
  outcome,
  matchCount,
  excludedCount,
  onActed,
}: {
  itemId: string;
  outcome: { label: string; tone: "success" | "warn" | "danger" };
  matchCount: number;
  excludedCount: number;
  onActed: (who: string, what: string, ctx: string) => void;
}) {
  const queryClient = useQueryClient();
  const [pendingAction, setPendingAction] = useState<ReviewActionVerb | null>(null);

  const actMutation = useMutation({
    mutationFn: (action: ReviewActionVerb) => actOnMarketMatching(itemId, action),
    onMutate: (action) => setPendingAction(action),
    onSuccess: (item, action) => {
      onActed(
        "You",
        `${ACTION_LABEL[action]} — POST /api/es/market-matching/${itemId}/${action}`,
        `Review item now "${item.status}"`,
      );
      toast.success(`${ACTION_LABEL[action]} succeeded`);
      queryClient.invalidateQueries({ queryKey: ["market-matching", "list"] });
      queryClient.invalidateQueries({ queryKey: ["market-matching", "detail", itemId] });
    },
    onError: (err: unknown, action) => {
      toast.error(err instanceof Error ? err.message : `${ACTION_LABEL[action]} failed`);
    },
    onSettled: () => setPendingAction(null),
  });

  const toneClass =
    outcome.tone === "success"
      ? "border-success/40 bg-success/5"
      : outcome.tone === "warn"
        ? "border-warn/40 bg-warn/5"
        : "border-destructive/40 bg-destructive/5";

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className={`rounded-xl border-2 p-4 md:col-span-2 ${toneClass}`}>
        <div className="flex items-center gap-2">
          {outcome.tone === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-success" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-warn" />
          )}
          <div className="font-serif text-xl">{outcome.label}</div>
        </div>
        <p className="mt-3 text-sm text-foreground">
          {matchCount} carrier(s) matched, {excludedCount} excluded on the current panel — derived
          directly from <code>GET /api/es/market-matching/{itemId}</code>.
        </p>
        <p className="mt-2 text-[11px] text-muted-foreground">
          There's no LLM-drafted narrative shown here: the pipeline computes one internally via{" "}
          <code>core.llm</code> (see <code>service.py</code>'s <code>draft()</code>), but it isn't
          persisted or returned by this endpoint today — so this summary is a plain client-side
          count, not the AI's own written recommendation.
        </p>
      </div>
      <div className="rounded-xl border border-border p-4">
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Review action
        </div>
        <div className="mt-3 space-y-2 text-sm">
          {(["approve", "escalate", "override", "send", "issue"] as ReviewActionVerb[]).map(
            (action) => (
              <Button
                key={action}
                variant={
                  action === "approve" ? "primary" : action === "override" ? "danger" : "secondary"
                }
                className="w-full justify-center"
                disabled={actMutation.isPending}
                onClick={() => actMutation.mutate(action)}
              >
                {pendingAction === action && <Loader2 className="h-4 w-4 animate-spin" />}
                {ACTION_LABEL[action]}
              </Button>
            ),
          )}
        </div>
        <div className="mt-4 text-[11px] text-muted-foreground">
          Junior role can approve/escalate; override/send/issue are senior/admin-only, enforced
          server-side — expect a 403 toast here with the seeded junior demo user.
        </div>
      </div>
    </div>
  );
}

function ActivityTab({ log }: { log: LogEntry[] }) {
  return (
    <div>
      <ul className="divide-y divide-border">
        {log.length === 0 ? (
          <li className="py-6 text-center text-sm text-muted-foreground">
            No activity yet this session.
          </li>
        ) : (
          log.slice(0, 20).map((d, i) => (
            <li key={i} className="flex items-start gap-3 py-3 text-sm">
              <span className="font-mono text-xs text-muted-foreground">{d.at}</span>
              <div className="flex-1">
                <div>
                  <b>{d.who}</b> — {d.what}
                </div>
                <div className="text-[11px] text-muted-foreground">{d.ctx}</div>
              </div>
            </li>
          ))
        )}
      </ul>
      <div className="mt-3 text-[10px] text-muted-foreground">
        Session-local log only — not persisted or read from Backend-AI-OS's audit module (
        <code>core.audit</code> isn't exposed via a route on this workflow yet).
      </div>
    </div>
  );
}

/* ============================================================
   2. Submission Package Assembly
   ============================================================ */

type LogEntry = { at: string; who: string; what: string; ctx: string; conf: string };

const PACKAGE_ACTION_LABEL: Record<PackageActionVerb, string> = {
  approve: "Approve",
  edit: "Log edit",
  send: "Mark as sent",
};

function PackageStatusBadge({ status }: { status: string }) {
  const map: Record<
    string,
    { label: string; tone: "success" | "warn" | "danger"; Icon: typeof CheckCircle2 }
  > = {
    READY: { label: "Ready to send", tone: "success", Icon: CheckCircle2 },
    READY_WITH_GAP: { label: "Ready with gap", tone: "warn", Icon: AlertTriangle },
    BLOCKED: { label: "Blocked", tone: "danger", Icon: XCircle },
  };
  const { label, tone, Icon } = map[status] ?? { label: status, tone: "warn" as const, Icon: Info };
  return (
    <Chip tone={tone}>
      <Icon className="h-3 w-3" />
      {label}
    </Chip>
  );
}

function SourceCitation({
  doc,
  page,
  children,
}: {
  doc: string;
  page: number;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => toast("Jumping to source", { description: `${doc} · p.${page}` })}
      className="w-full cursor-pointer rounded bg-accent/15 px-1.5 py-0.5 text-left text-foreground transition hover:bg-accent/25 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      title={`Source: ${doc}, p.${page} — click to jump to source`}
    >
      {children}
    </button>
  );
}

function CarrierPackageCard({
  itemId,
  payload,
  onActed,
}: {
  itemId: string;
  payload: PackageAssemblyPayload;
  onActed: (who: string, what: string, ctx: string) => void;
}) {
  const queryClient = useQueryClient();
  const [manualValues, setManualValues] = useState<Record<string, string>>({});
  const [pendingAction, setPendingAction] = useState<PackageActionVerb | null>(null);

  const actionMutation = useMutation({
    mutationFn: (action: "approve" | "send") => actOnPackageAssembly(itemId, action),
    onMutate: (action: "approve" | "send") => setPendingAction(action),
    onSuccess: (item, action) => {
      onActed(
        "You",
        `${PACKAGE_ACTION_LABEL[action]} — POST /api/es/package-assembly/${itemId}/${action}`,
        `${payload.carrier_name} package → status "${item.status}"`,
      );
      toast.success(`${PACKAGE_ACTION_LABEL[action]} succeeded`);
      queryClient.invalidateQueries({ queryKey: ["package-assembly"] });
    },
    onError: (err: unknown, action) => {
      toast.error(err instanceof Error ? err.message : `${PACKAGE_ACTION_LABEL[action]} failed`);
    },
    onSettled: () => setPendingAction(null),
  });

  const editLogMutation = useMutation({
    mutationFn: () => actOnPackageAssembly(itemId, "edit"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["package-assembly"] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to log edit");
    },
  });

  function handleManualFieldBlur(fieldName: string) {
    const value = manualValues[fieldName];
    if (!value?.trim()) return;
    onActed("You", `Filled "${fieldName.replace(/_/g, " ")}"`, `${payload.carrier_name} package`);
    editLogMutation.mutate();
  }

  function copyCoverLetter() {
    navigator.clipboard
      .writeText(payload.cover_letter.body)
      .then(() => toast.success("Cover letter copied"))
      .catch(() => toast.error("Couldn't copy — select the text and copy manually."));
  }

  const blocked = payload.status === "BLOCKED";

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl">{payload.carrier_name}</h3>
            <PackageStatusBadge status={payload.status} />
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {payload.submission_id ?? "unknown submission"} · package{" "}
            {payload.package_id.slice(0, 8)}…
          </div>
        </div>
        <FoundationBadge kind="matching" />
      </div>

      {blocked && payload.blocking_items.length > 0 && (
        <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <div className="text-xs font-medium text-destructive">
            {payload.blocking_items.length} item{payload.blocking_items.length === 1 ? "" : "s"}{" "}
            block this package
          </div>
          <ul className="mt-2 space-y-1 text-[12px] text-foreground">
            {payload.blocking_items.map((b) => (
              <li key={b.item} className="flex items-start gap-2">
                <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                <span>
                  <b>{b.item}</b> — {b.reason}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {payload.status === "READY_WITH_GAP" && payload.gap_items_disclosed.length > 0 && (
        <div className="mt-4 rounded-lg border border-warn/30 bg-warn/5 p-3">
          <div className="text-xs font-medium text-foreground">
            Disclosed gap{payload.gap_items_disclosed.length === 1 ? "" : "s"} — proactively noted
            in the cover letter, not hidden
          </div>
          <ul className="mt-2 space-y-1 text-[12px] text-foreground">
            {payload.gap_items_disclosed.map((g) => (
              <li key={g.item} className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warn" />
                {g.item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* PA-01 */}
        <div>
          <div className="mb-2 text-xs font-medium">Document completeness</div>
          <ul className="divide-y divide-border rounded-lg border border-border text-sm">
            {payload.document_checklist.map((d) => (
              <li key={d.document_type} className="flex items-center gap-3 p-3">
                {d.included ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                ) : (
                  <AlertTriangle className="h-4 w-4 shrink-0 text-warn" />
                )}
                <span className="flex-1">{d.document_type}</span>
                <Chip tone={d.included ? "success" : "warn"}>
                  {d.included ? "On file" : "Missing"}
                </Chip>
              </li>
            ))}
          </ul>

          <div className="mt-4 mb-2 text-xs font-medium">Diligent search</div>
          <div
            className={`rounded-lg border p-3 text-[12px] ${payload.diligent_search_attached ? "border-success/30 bg-success/5 text-foreground" : "border-border text-muted-foreground"}`}
          >
            {payload.diligent_search_attached ? (
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                Attached to this package
              </span>
            ) : (
              "Not attached"
            )}
          </div>
        </div>

        {/* PA-02 */}
        <div>
          <div className="mb-2 text-xs font-medium">Supplemental form</div>
          <div className="grid gap-3 rounded-lg border border-border p-4 text-sm sm:grid-cols-2">
            {payload.supplemental_form_fields.map((f) => (
              <div key={f.field_name}>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {f.field_name.replace(/_/g, " ")}
                  {!f.auto_filled && <span className="text-warn"> · manual</span>}
                </div>
                {f.auto_filled ? (
                  <div
                    className="rounded bg-accent/15 px-1.5 py-0.5 text-foreground"
                    title={f.source_citation ? `Source: ${f.source_citation}` : undefined}
                  >
                    {f.value}
                  </div>
                ) : (
                  <input
                    value={manualValues[f.field_name] ?? ""}
                    onChange={(e) =>
                      setManualValues((prev) => ({ ...prev, [f.field_name]: e.target.value }))
                    }
                    onBlur={() => handleManualFieldBlur(f.field_name)}
                    placeholder="No extracted source — enter manually"
                    className="w-full rounded border border-dashed border-warn/40 bg-background px-1.5 py-0.5 text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-1 text-[10px] text-muted-foreground">
            Highlighted fields are auto-filled and grounded to a real document (hover for source).
            Dashed fields have no extracted source — PA-02's grounding boundary — and stay empty
            until filled; typing logs a generic "edited" event (the API doesn't yet capture which
            field changed).
          </div>
        </div>
      </div>

      {/* PA-04 */}
      <div className="mt-5">
        <div className="mb-2 text-xs font-medium">Cover letter draft</div>
        <div className="whitespace-pre-wrap rounded-lg border border-border bg-background p-3 text-sm">
          {payload.cover_letter.body}
        </div>
        {payload.cover_letter.citations.length > 0 && (
          <div className="mt-1 text-[11px] text-muted-foreground">
            Citations: {payload.cover_letter.citations.map((c) => c.source).join(", ")}
          </div>
        )}
        <div className="mt-2 flex justify-end">
          <Button variant="secondary" onClick={copyCoverLetter}>
            <Copy className="h-3.5 w-3.5" />
            Copy cover letter
          </Button>
        </div>
      </div>

      {/* Send boundary — non-negotiable: assemble/draft only, broker sends manually */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-border bg-secondary/30 p-3">
        <div className="flex items-start gap-2 text-[11px] text-muted-foreground">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Coverline drafts and assembles — you send it. Nothing here transmits automatically.
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            disabled={blocked || actionMutation.isPending}
            title={blocked ? "Resolve the blocking items above first" : undefined}
            onClick={() => actionMutation.mutate("approve")}
          >
            {pendingAction === "approve" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <CheckCircle2 className="h-3.5 w-3.5" />
            Approve
          </Button>
          <Button
            variant="secondary"
            disabled={blocked || actionMutation.isPending}
            title={blocked ? "Resolve the blocking items above first" : undefined}
            onClick={() => actionMutation.mutate("send")}
          >
            {pendingAction === "send" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <Clock className="h-3.5 w-3.5" />
            Mark as sent
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Status log
        </div>
        <ul className="space-y-1 text-[11px] text-muted-foreground">
          {payload.status_log.map((s, i) => (
            <li key={i}>
              {new Date(s.timestamp).toLocaleString()} — {s.action} ({s.user})
            </li>
          ))}
        </ul>
        <div className="mt-1 text-[10px] text-muted-foreground">
          From the package's real backend record (generated at assembly time). Approve/edit/send are
          written to this tenant's audit log too, but the API doesn't yet append them to this list —
          the status badge above and the Activity panel below reflect them in the meantime.
        </div>
      </div>
    </Panel>
  );
}

export function PackageAssembly({ search = {} }: { search?: Record<string, unknown> }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const goToMatching = () =>
    navigate({ to: "/app/workflows/$slug", params: { slug: "submission-matching" } });

  const upstreamSubmissionId =
    typeof search.submissionId === "string" ? search.submissionId : undefined;
  const upstreamCarriers =
    typeof search.carriers === "string" ? search.carriers.split(",").filter(Boolean) : [];
  const upstreamMarketMatchingItemId =
    typeof search.marketMatchingItemId === "string" ? search.marketMatchingItemId : undefined;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);

  const listQuery = useQuery({
    queryKey: ["package-assembly", "list"],
    queryFn: listPackageAssembly,
  });
  const items = listQuery.data ?? [];

  const detailQuery = useQuery({
    queryKey: ["package-assembly", "detail", selectedId],
    queryFn: () => getPackageAssembly(selectedId!),
    enabled: Boolean(selectedId),
  });

  function appendLog(who: string, what: string, ctx: string) {
    setLog((prev) => [
      {
        at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        who,
        what,
        ctx,
        conf: "—",
      },
      ...prev,
    ]);
  }

  const runMutation = useMutation({
    mutationFn: (scenarioRef: string) => runPackageAssembly(scenarioRef),
    onSuccess: (createdItems, scenarioRef) => {
      queryClient.invalidateQueries({ queryKey: ["package-assembly"] });
      toast.success(
        `${scenarioRef}: assembled ${createdItems.length} package${createdItems.length === 1 ? "" : "s"}`,
      );
      if (createdItems[0]) setSelectedId(createdItems[0].id);
    },
    onError: (err: unknown, scenarioRef) => {
      toast.error(err instanceof Error ? err.message : `Failed to run ${scenarioRef}`);
    },
  });

  const runFromMarketMatchingMutation = useMutation({
    mutationFn: () => runPackageAssemblyFromMarketMatching(upstreamMarketMatchingItemId!),
    onSuccess: (createdItems) => {
      queryClient.invalidateQueries({ queryKey: ["package-assembly"] });
      toast.success(
        `Assembled ${createdItems.length} real package${createdItems.length === 1 ? "" : "s"} from Market Matching`,
      );
      if (createdItems[0]) setSelectedId(createdItems[0].id);
    },
    onError: (err: unknown) =>
      toast.error(err instanceof Error ? err.message : "Failed to assemble from this selection"),
  });

  return (
    <div className="mx-auto max-w-[1500px] animate-in fade-in-0 duration-500">
      <PageHeader
        eyebrow="Workflow 02 · Live"
        title="Submission Package Assembly"
        description="Wired to Backend-AI-OS's /api/es/package-assembly — real per-carrier packages from the Workflow_11 fixture scenarios."
        actions={
          <Button variant="secondary" onClick={goToMatching}>
            ← Back to Market Matching
          </Button>
        }
      />

      {(upstreamSubmissionId || upstreamCarriers.length > 0) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-secondary/40 p-3 text-[11px] text-muted-foreground">
          <div>
            Arrived from Market Matching —{" "}
            {upstreamCarriers.length > 0
              ? `${upstreamCarriers.length} carrier(s) selected for ${upstreamSubmissionId ?? "a submission"}`
              : upstreamSubmissionId}
            .
          </div>
          {upstreamMarketMatchingItemId ? (
            <Button
              variant="primary"
              className="!py-1 !text-xs"
              disabled={runFromMarketMatchingMutation.isPending}
              onClick={() => runFromMarketMatchingMutation.mutate()}
              title="Builds real package(s) from this Market Matching item's actual carrier matches, requirements, and persisted documents"
            >
              {runFromMarketMatchingMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              Assemble from this selection
            </Button>
          ) : (
            "No Market Matching review item id was passed — run one of the fixture scenarios below instead."
          )}
        </div>
      )}

      <Panel
        title="Scenario fixtures"
        subtitle="Workflow_11 — each already has a carrier selection baked in"
      >
        <div className="flex flex-wrap gap-2">
          {FIXTURE_SCENARIO_REFS.map((ref) => (
            <Button
              key={ref}
              variant="secondary"
              disabled={runMutation.isPending}
              onClick={() => runMutation.mutate(ref)}
            >
              {runMutation.isPending && runMutation.variables === ref ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Run {ref}
            </Button>
          ))}
        </div>
      </Panel>

      {listQuery.isLoading && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading packages…
        </div>
      )}
      {listQuery.isError && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          {listQuery.error instanceof Error ? listQuery.error.message : "Failed to load packages."}
        </div>
      )}

      {!listQuery.isLoading && !listQuery.isError && (
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)]">
          <Panel title="Packages" subtitle={`${items.length} generated`}>
            {items.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No packages yet — run a scenario above.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {items.map((row) => (
                  <button
                    key={row.id}
                    onClick={() => setSelectedId(row.id)}
                    className={`flex w-full items-start gap-3 py-3 text-left transition hover:bg-secondary/40 ${
                      selectedId === row.id ? "bg-secondary/50" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="truncate font-mono text-sm">
                        {row.submission_id ?? row.id}
                      </span>
                      <div className="mt-1.5">
                        <Chip>{row.status}</Chip>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Panel>

          <div className="space-y-5">
            {!selectedId ? (
              <Panel>
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Select a package from the list.
                </div>
              </Panel>
            ) : detailQuery.isLoading ? (
              <Panel>
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading package…
                </div>
              </Panel>
            ) : detailQuery.isError ? (
              <Panel>
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  {detailQuery.error instanceof Error
                    ? detailQuery.error.message
                    : "Failed to load package."}
                </div>
              </Panel>
            ) : detailQuery.data?.payload ? (
              <CarrierPackageCard
                itemId={detailQuery.data.id}
                payload={detailQuery.data.payload}
                onActed={appendLog}
              />
            ) : (
              <Panel>
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No package data for this item.
                </div>
              </Panel>
            )}

            <Panel
              title="Activity"
              subtitle="This session's actions"
              actions={<FoundationBadge kind="matching" />}
            >
              <ul className="divide-y divide-border">
                {log.length === 0 ? (
                  <li className="py-6 text-center text-sm text-muted-foreground">
                    No activity yet this session.
                  </li>
                ) : (
                  log.slice(0, 10).map((d, i) => (
                    <li key={i} className="flex items-start gap-3 py-3 text-sm">
                      <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                        {d.at}
                      </span>
                      <div className="flex-1">
                        <div>
                          <b>{d.who}</b> — {d.what}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{d.ctx}</div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   3. Retail Agent Communication Copilot
   ============================================================ */

type Trigger = { source: string; detail: string };

const TRIGGER_SOURCE_LABEL: Record<string, string> = {
  "quote-summary": "Quote Comparison",
  "placement-confirmation": "Binder & Policy Issuance — Placement Confirmation",
  "policy-docs-delivered": "Binder & Policy Issuance — Policy Documents Delivered",
  "endorsement-confirmed": "Endorsement / Mid-Term Change Processing",
};

export function RetailAgentCopilot({ search = {} }: { search?: Record<string, unknown> }) {
  const queryClient = useQueryClient();

  // Handoff: Quote Comparison's "Present to retail agent" and Binder & Issuance's/Endorsement
  // Processing's triggers navigate here with real submission data. Landing here never creates a
  // draft by itself — the broker must click "Import this trigger" below (same "nothing happens
  // without a click" rule as FR-20), which then calls the real POST /run endpoint.
  const triggerKind = search.trigger;
  const externalTrigger =
    triggerKind === "quote-summary" ||
    triggerKind === "placement-confirmation" ||
    triggerKind === "policy-docs-delivered" ||
    triggerKind === "endorsement-confirmed"
      ? {
          kind: triggerKind,
          carrier: typeof search.carrier === "string" ? search.carrier : "",
          premium: typeof search.premium === "string" ? search.premium : "",
          insured: typeof search.insured === "string" ? search.insured : "",
          submissionId: typeof search.submissionId === "string" ? search.submissionId : "",
        }
      : null;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newEmailOpen, setNewEmailOpen] = useState(false);
  const [handoffImported, setHandoffImported] = useState(false);

  const [composeText, setComposeText] = useState("");
  const [composeBaseline, setComposeBaseline] = useState("");

  const [manualOpen, setManualOpen] = useState(false);
  const [manualCarrier, setManualCarrier] = useState("");
  const [manualPremium, setManualPremium] = useState("");
  const [manualOutcome, setManualOutcome] = useState<"Quoted" | "Bound">("Quoted");
  const [manualContext, setManualContext] = useState("");

  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [followUpWindowDays, setFollowUpWindowDays] = useState("10");
  const [followUpElapsedDays, setFollowUpElapsedDays] = useState("12");

  const [log, setLog] = useState<LogEntry[]>([]);

  function appendLog(who: string, what: string, ctx: string) {
    setLog((prev) => [
      {
        at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        who,
        what,
        ctx,
        conf: "—",
      },
      ...prev,
    ]);
  }

  const listQuery = useQuery({
    queryKey: ["agent-communication", "list"],
    queryFn: listAgentCommunication,
  });
  const items = listQuery.data ?? [];

  useEffect(() => {
    if (!selectedId && listQuery.data && listQuery.data.length > 0) {
      setSelectedId(listQuery.data[0].id);
    }
  }, [listQuery.data, selectedId]);

  const detailQuery = useQuery({
    queryKey: ["agent-communication", "detail", selectedId],
    queryFn: () => getAgentCommunication(selectedId!),
    enabled: Boolean(selectedId),
  });
  const payload = detailQuery.data?.payload ?? null;
  const gated = Boolean(payload?.requires_compliance_review);

  const relatedItems = payload
    ? items.filter((row) => row.id !== selectedId && row.submission_id === payload.submission_id)
    : [];

  useEffect(() => {
    setComposeText(payload?.body ?? "");
    setComposeBaseline(payload?.body ?? "");
  }, [selectedId, payload?.body]);

  const runMutation = useMutation({
    mutationFn: (t: { trigger: Record<string, unknown>; label: string }) =>
      runAgentCommunication(t.trigger),
    onSuccess: (item, t) => {
      queryClient.invalidateQueries({ queryKey: ["agent-communication"] });
      toast.success(
        item.deduplicated
          ? `${t.label}: existing draft reused (deduplicated, FR-5)`
          : `${t.label}: draft generated`,
      );
      appendLog(
        "AI (Agent Communication)",
        item.deduplicated ? "Existing draft reused (FR-5)" : "Draft generated",
        t.label,
      );
      setSelectedId(item.id);
      setNewEmailOpen(false);
      setManualOpen(false);
      setFollowUpOpen(false);
    },
    onError: (err: unknown, t) => {
      toast.error(err instanceof Error ? err.message : `Failed to draft "${t.label}"`);
    },
  });

  const actionMutation = useMutation({
    mutationFn: (action: AgentCommActionVerb) => actOnAgentCommunication(selectedId!, action),
    onSuccess: (item, action) => {
      appendLog(
        "You",
        `${AGENT_ACTION_LABEL[action]} — POST /api/es/agent-communication/${selectedId}/${action}`,
        `Status now "${item.status}"`,
      );
      toast.success(`${AGENT_ACTION_LABEL[action]} succeeded`);
      queryClient.invalidateQueries({ queryKey: ["agent-communication"] });
    },
    onError: (err: unknown, action) => {
      toast.error(err instanceof Error ? err.message : `${AGENT_ACTION_LABEL[action]} failed`);
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => complianceClear(selectedId!),
    onSuccess: () => {
      appendLog(
        "You",
        "Compliance-clear",
        `POST /api/es/agent-communication/${selectedId}/compliance-clear`,
      );
      toast.success("Compliance gate cleared");
      queryClient.invalidateQueries({ queryKey: ["agent-communication"] });
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Compliance-clear failed (senior/admin only)",
      );
    },
  });

  function copyDraft() {
    navigator.clipboard
      .writeText(composeText)
      .then(() => toast.success("Draft copied"))
      .catch(() => toast.error("Couldn't copy — select the text and copy manually."));
  }

  function runManualTrigger() {
    if (!payload || !manualCarrier.trim() || !manualPremium.trim()) return;
    const isQuote = manualOutcome === "Quoted";
    const trigger: Record<string, unknown> = {
      trigger_type: isQuote ? "QUOTE_TERMS_SUMMARY" : "PLACEMENT_CONFIRMATION",
      source_workflow: "Manual broker input (Quote Comparison workflow not yet built)",
      submission_id: payload.submission_id,
      named_insured: payload.named_insured,
      retail_agent_name: payload.retail_agent_name,
      retail_agency: payload.retail_agency,
      carrier_name: manualCarrier.trim(),
    };
    if (isQuote) {
      trigger.quoted_terms = {
        premium: manualPremium.trim(),
        limits: "Not specified",
        prior_expiring_premium_context: "Not specified",
      };
      if (manualContext.trim()) trigger.quote_context = manualContext.trim();
    } else {
      trigger.bound_terms = {
        premium: manualPremium.trim(),
        limits: "Not specified",
        effective_date: "Not specified",
      };
    }
    runMutation.mutate({
      trigger,
      label: `${isQuote ? "Quote summary" : "Placement confirmation"} — ${manualCarrier.trim()}`,
    });
    setManualCarrier("");
    setManualPremium("");
    setManualContext("");
  }

  function runFollowUp() {
    if (!payload) return;
    const windowDays = Number(followUpWindowDays) || 0;
    const elapsedDays = Number(followUpElapsedDays) || 0;
    const trigger: Record<string, unknown> = {
      trigger_type: "NO_RESPONSE_FOLLOWUP",
      source_workflow: "Retail Agent Communication Copilot (No-Response Monitor)",
      submission_id: payload.submission_id,
      named_insured: payload.named_insured,
      retail_agent_name: payload.retail_agent_name,
      retail_agency: payload.retail_agency,
      carrier_name: payload.carrier_name ?? undefined,
      original_request_type: payload.trigger_type,
      days_since_original_request: elapsedDays,
      carrier_acceptance_window_days: windowDays,
      days_remaining_in_window: Math.max(windowDays - elapsedDays, 0),
    };
    runMutation.mutate({ trigger, label: "No-response follow-up" });
  }

  function importHandoffTrigger() {
    if (!externalTrigger) return;
    const base = {
      submission_id: externalTrigger.submissionId || undefined,
      named_insured: externalTrigger.insured || undefined,
      carrier_name: externalTrigger.carrier || undefined,
    };
    let trigger: Record<string, unknown>;
    if (externalTrigger.kind === "quote-summary") {
      trigger = {
        ...base,
        trigger_type: "QUOTE_TERMS_SUMMARY",
        source_workflow: "Quote Comparison",
        quoted_terms: { premium: externalTrigger.premium, limits: "Not specified" },
      };
    } else if (externalTrigger.kind === "placement-confirmation") {
      trigger = {
        ...base,
        trigger_type: "PLACEMENT_CONFIRMATION",
        source_workflow: "Binder & Policy Issuance",
        bound_terms: {
          premium: externalTrigger.premium,
          limits: "Not specified",
          effective_date: "Not specified",
        },
      };
    } else if (externalTrigger.kind === "policy-docs-delivered") {
      trigger = {
        ...base,
        trigger_type: "POLICY_DOCUMENTS_DELIVERED",
        source_workflow: "Binder & Policy Issuance",
        binder_number: "Not specified",
        verified_terms: `${externalTrigger.carrier} — ${externalTrigger.premium}`,
      };
    } else {
      trigger = {
        ...base,
        trigger_type: "ENDORSEMENT_CONFIRMED",
        source_workflow: "Endorsement Processing",
        endorsement_number: "Not specified",
        requested_change_detail: "Not specified",
        issued_items: [],
      };
    }
    runMutation.mutate({ trigger, label: TRIGGER_SOURCE_LABEL[externalTrigger.kind] });
    setHandoffImported(true);
  }

  return (
    <div className="mx-auto max-w-[1500px] animate-in fade-in-0 duration-500">
      <PageHeader
        eyebrow="Workflow 03"
        title="Retail Agent Communication Copilot"
        description="AI drafts every retail-agent-facing email — status update, missing-info request, no-market notice, quote summary — you approve before it sends."
        actions={
          <Button variant="primary" onClick={() => setNewEmailOpen((v) => !v)}>
            <MessageSquare className="h-4 w-4" />
            New email
          </Button>
        }
      />

      {newEmailOpen && (
        <div className="mt-4">
          <Panel
            title="Start a new communication"
            subtitle="Runs the real backend pipeline — POST /api/es/agent-communication/run"
            actions={
              <Button variant="ghost" onClick={() => setNewEmailOpen(false)}>
                Close
              </Button>
            }
          >
            <div className="flex flex-wrap gap-2">
              {FIXTURE_TRIGGERS.map((t) => (
                <Button
                  key={t.ref}
                  variant="secondary"
                  disabled={runMutation.isPending}
                  onClick={() => runMutation.mutate({ trigger: t.trigger, label: t.label })}
                >
                  {runMutation.isPending && runMutation.variables?.label === t.label ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {t.label}
                </Button>
              ))}
            </div>
            <div className="mt-3 text-[11px] text-muted-foreground">
              Or select an existing thread on the left and use "Log outcome" / "Generate
              follow-up" in the context panel to add a Quote/Terms Summary, Placement
              Confirmation, or No-Response Follow-up to it.
            </div>
          </Panel>
        </div>
      )}

      {externalTrigger && !handoffImported && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/30 bg-accent/5 p-3 text-sm">
          <div className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-accent" />
            Linked from {TRIGGER_SOURCE_LABEL[externalTrigger.kind]}
            {externalTrigger.insured ? ` — ${externalTrigger.insured}` : ""}
            {externalTrigger.carrier ? ` · ${externalTrigger.carrier}` : ""}
            {externalTrigger.premium ? ` · ${externalTrigger.premium}` : ""}
          </div>
          <Button variant="primary" disabled={runMutation.isPending} onClick={importHandoffTrigger}>
            {runMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Import this trigger
          </Button>
        </div>
      )}

      <div className="mt-4 grid gap-0 overflow-hidden rounded-2xl border border-border bg-background lg:grid-cols-[280px_minmax(0,1fr)_340px]">
        {/* Threads */}
        <div className="border-r border-border">
          <div className="border-b border-border p-3">
            <SearchBar placeholder="Search retail agents…" />
          </div>
          {listQuery.isLoading ? (
            <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : listQuery.isError ? (
            <div className="flex items-center gap-2 p-4 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              {listQuery.error instanceof Error ? listQuery.error.message : "Failed to load."}
            </div>
          ) : items.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No communications yet — click "New email" to draft one from a real trigger.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((row) => (
                <button
                  key={row.id}
                  onClick={() => setSelectedId(row.id)}
                  className={`flex w-full flex-col gap-1.5 p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${selectedId === row.id ? "bg-secondary/60" : "hover:bg-secondary/30"}`}
                >
                  <span className="truncate font-mono text-xs text-muted-foreground">
                    {row.submission_id ?? row.id}
                  </span>
                  <DraftStatusBadge status={row.status} />
                </button>
              ))}
            </ul>
          )}
        </div>

        {/* Conversation */}
        <div className="flex min-h-[520px] flex-col">
          {!selectedId ? (
            <div className="flex flex-1 items-center justify-center p-10 text-sm text-muted-foreground">
              Select a thread, or click "New email" to draft one.
            </div>
          ) : detailQuery.isLoading ? (
            <div className="flex flex-1 items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading draft…
            </div>
          ) : detailQuery.isError ? (
            <div className="flex flex-1 items-center justify-center gap-2 p-10 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              {detailQuery.error instanceof Error
                ? detailQuery.error.message
                : "Failed to load draft."}
            </div>
          ) : !payload ? (
            <div className="flex flex-1 items-center justify-center p-10 text-sm text-muted-foreground">
              No draft data for this item.
            </div>
          ) : (
            <>
              <div className="border-b border-border p-4">
                <div className="text-xs text-muted-foreground">
                  To: {payload.retail_agent_name ?? "Retail agent"}
                  {payload.retail_agency ? ` (${payload.retail_agency})` : ""}
                </div>
                <div className="font-serif text-lg">{payload.subject_line}</div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <Radar className="h-3 w-3 text-accent" />
                  <span className="text-muted-foreground">Triggered by:</span>
                  <span className="font-medium text-foreground">{payload.source_workflow}</span>
                  <span className="text-muted-foreground">— {payload.trigger_type}</span>
                  <DraftStatusBadge status={payload.status} />
                </div>
              </div>

              {gated && (
                <div className="border-b border-border bg-warn/10 p-3 text-[11px]">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warn" />
                    <div>
                      <b>Requires compliance review</b> — carrier names are withheld until a
                      senior/admin clears this (RA-TN-06). This banner stays until cleared.
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-1 space-y-4 overflow-y-auto p-4 text-sm">
                <Bubble from="you" name="Coverline AI · drafted" at="" ai>
                  {payload.body}
                  {payload.grounding_citations.length > 0 && (
                    <div className="mt-2 text-[11px] text-muted-foreground">
                      Grounded in:{" "}
                      {payload.grounding_citations
                        .map((c) => `${c.claim} (${c.source_field})`)
                        .join("; ")}
                    </div>
                  )}
                  <div className="mt-2 flex items-center gap-2 text-[11px]">
                    <span className="text-muted-foreground">Carrier names disclosed:</span>
                    {payload.carrier_names_disclosed ? (
                      <Chip tone="success">
                        Yes{payload.carrier_name ? ` — ${payload.carrier_name}` : ""}
                      </Chip>
                    ) : (
                      <Chip tone="neutral">No — aggregate framing only</Chip>
                    )}
                  </div>
                </Bubble>
              </div>

              <div className="border-t border-border p-3">
                <div className="rounded-xl border border-border bg-background p-2">
                  <div className="mb-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <FoundationBadge kind="matching" />
                    <span>Edit locally, then Copy to paste into your own email client</span>
                  </div>
                  <textarea
                    rows={4}
                    value={composeText}
                    onChange={(e) => setComposeText(e.target.value)}
                    className="w-full resize-none rounded bg-transparent p-2 text-sm outline-none"
                  />
                  <div className="flex flex-wrap items-center gap-2 border-t border-border pt-2">
                    <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
                      <Lock className="mt-0.5 h-3 w-3 shrink-0" />
                      Nothing here transmits automatically — approve/send are manual logs only
                      (FR-20). Send is senior/admin-only, enforced server-side — expect a 403
                      toast here with the seeded junior demo user; Approve/Edit/Discard work for
                      any role.
                    </div>
                    <div className="ml-auto flex flex-wrap items-center gap-2">
                      <Button variant="ghost" onClick={copyDraft}>
                        <Copy className="h-3.5 w-3.5" />
                        Copy draft
                      </Button>
                      <Button
                        variant="secondary"
                        disabled={actionMutation.isPending}
                        onClick={() => {
                          actionMutation.mutate("edit");
                          toast("Logged as edited — remember to Copy the updated text above");
                        }}
                      >
                        Log edit
                      </Button>
                      {gated && (
                        <Button
                          variant="secondary"
                          disabled={clearMutation.isPending}
                          onClick={() => clearMutation.mutate()}
                        >
                          {clearMutation.isPending && (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          )}
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Compliance-clear (senior/admin)
                        </Button>
                      )}
                      <Button
                        variant="primary"
                        disabled={gated || actionMutation.isPending}
                        title={gated ? "Requires compliance-clear first" : undefined}
                        onClick={() => actionMutation.mutate("send")}
                      >
                        Send <Send className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="danger"
                        disabled={actionMutation.isPending}
                        onClick={() => actionMutation.mutate("discard")}
                      >
                        Discard
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Context + real communication history */}
        <div className="space-y-5 border-l border-border p-4">
          {payload && (
            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Context behind this draft
              </div>
              <div className="space-y-2 rounded-lg border border-border p-3 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">{payload.named_insured ?? "Unknown insured"}</span>
                </div>
                <div className="text-muted-foreground">
                  Agent: {payload.retail_agent_name ?? "—"}
                  {payload.retail_agency ? ` (${payload.retail_agency})` : ""}
                </div>
                <div className="text-muted-foreground">
                  Submission: {payload.submission_id ?? "—"}
                </div>
                <div className="text-muted-foreground">
                  Generated: {new Date(payload.generated_timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {payload && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Other communications, same submission
                </div>
                <FoundationBadge kind="matching" />
              </div>
              {relatedItems.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-3 text-[11px] text-muted-foreground">
                  None yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {relatedItems.map((row) => (
                    <button
                      key={row.id}
                      onClick={() => setSelectedId(row.id)}
                      className="w-full rounded-lg border border-border p-2 text-left text-[11px] hover:bg-secondary/30"
                    >
                      <div className="flex items-center justify-between">
                        <span>{row.id}</span>
                        <DraftStatusBadge status={row.status} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="rounded-lg border border-dashed border-border p-3 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Manual fallback — log a quote/bind outcome that didn't come through Quote
                Comparison automatically (FR-2).
              </span>
              <Button
                variant="ghost"
                className="!py-1 !text-xs"
                disabled={!payload}
                title={!payload ? "Select a thread first" : undefined}
                onClick={() => setManualOpen((v) => !v)}
              >
                {manualOpen ? "Cancel" : "Log outcome"}
              </Button>
            </div>
            {manualOpen && payload && (
              <div className="mt-2 space-y-2">
                <input
                  value={manualCarrier}
                  onChange={(e) => setManualCarrier(e.target.value)}
                  placeholder="Carrier (e.g. Kinsale Insurance)"
                  className="w-full rounded border border-border bg-background p-1.5 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <div className="flex gap-2">
                  <input
                    value={manualPremium}
                    onChange={(e) => setManualPremium(e.target.value)}
                    placeholder="Premium (e.g. $187,400)"
                    className="flex-1 rounded border border-border bg-background p-1.5 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  <select
                    value={manualOutcome}
                    onChange={(e) => setManualOutcome(e.target.value as "Quoted" | "Bound")}
                    className="rounded border border-border bg-background p-1.5 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="Quoted">Quoted</option>
                    <option value="Bound">Bound</option>
                  </select>
                </div>
                {manualOutcome === "Quoted" && (
                  <textarea
                    rows={2}
                    value={manualContext}
                    onChange={(e) => setManualContext(e.target.value)}
                    placeholder="Pricing context / reason (optional, e.g. elevated severity from prior claims)"
                    className="w-full resize-none rounded border border-border bg-background p-1.5 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                )}
                <Button
                  variant="primary"
                  className="w-full justify-center !py-1 !text-xs"
                  disabled={
                    !manualCarrier.trim() || !manualPremium.trim() || runMutation.isPending
                  }
                  onClick={runManualTrigger}
                >
                  Log &amp; draft
                </Button>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-dashed border-border p-3 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                No-response follow-up — draft one more nudge if the agent hasn't replied within
                the carrier's acceptance window (FR-11/FR-12, at most one per thread).
              </span>
              <Button
                variant="ghost"
                className="!py-1 !text-xs"
                disabled={!payload}
                title={!payload ? "Select a thread first" : undefined}
                onClick={() => setFollowUpOpen((v) => !v)}
              >
                {followUpOpen ? "Cancel" : "Generate follow-up"}
              </Button>
            </div>
            {followUpOpen && payload && (
              <div className="mt-2 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    value={followUpWindowDays}
                    onChange={(e) => setFollowUpWindowDays(e.target.value)}
                    placeholder="Carrier's acceptance window (days)"
                    className="flex-1 rounded border border-border bg-background p-1.5 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  <input
                    type="number"
                    min={0}
                    value={followUpElapsedDays}
                    onChange={(e) => setFollowUpElapsedDays(e.target.value)}
                    placeholder="Days since original request"
                    className="flex-1 rounded border border-border bg-background p-1.5 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Days remaining in window:{" "}
                  {Math.max(
                    (Number(followUpWindowDays) || 0) - (Number(followUpElapsedDays) || 0),
                    0,
                  )}
                </div>
                <Button
                  variant="primary"
                  className="w-full justify-center !py-1 !text-xs"
                  disabled={runMutation.isPending}
                  onClick={runFollowUp}
                >
                  Generate follow-up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <Panel
          title="Activity"
          subtitle="Real actions this session — draft generated, edits logged, sends, compliance-clears (not yet a persisted history view)"
          actions={<FoundationBadge kind="matching" />}
        >
          <ul className="divide-y divide-border">
            {log.length === 0 ? (
              <li className="py-6 text-center text-sm text-muted-foreground">
                No activity yet this session.
              </li>
            ) : (
              log.slice(0, 8).map((d, i) => (
                <li key={i} className="flex items-start gap-3 py-3 text-sm">
                  <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                    {d.at}
                  </span>
                  <div className="flex-1">
                    <div>
                      <b>{d.who}</b> — {d.what}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{d.ctx}</div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

const AGENT_ACTION_LABEL: Record<AgentCommActionVerb, string> = {
  approve: "Approve",
  edit: "Log edit",
  send: "Mark as sent",
  discard: "Discard",
};

// Handles two different status vocabularies from the backend: the review-item-level
// ReviewStatus (lowercase — pending/approved/escalated/sent/issued, used by the thread list)
// and the richer payload-level DraftCommunicationOut.status (uppercase — DRAFT/
// UNDER_COMPLIANCE_REVIEW/APPROVED/SENT/DISCARDED, used in the detail view). Note the list's
// ReviewStatus has no "discarded" value, so a discarded item's list row still shows "Pending"
// — that's a real backend characteristic, not something the frontend can correct.
function DraftStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; tone: "success" | "warn" | "danger" | "neutral" }> = {
    PENDING: { label: "Pending", tone: "neutral" },
    DRAFT: { label: "Draft", tone: "neutral" },
    UNDER_COMPLIANCE_REVIEW: { label: "Under compliance review", tone: "warn" },
    APPROVED: { label: "Approved", tone: "success" },
    ESCALATED: { label: "Escalated", tone: "warn" },
    SENT: { label: "Sent", tone: "success" },
    ISSUED: { label: "Issued", tone: "success" },
    DISCARDED: { label: "Discarded", tone: "danger" },
  };
  const { label, tone } = map[status.toUpperCase()] ?? { label: status, tone: "neutral" as const };
  return <Chip tone={tone}>{label}</Chip>;
}

function Bubble({
  children,
  from,
  name,
  at,
  ai,
}: {
  children: ReactNode;
  from: "ana" | "you";
  name: string;
  at: string;
  ai?: boolean;
}) {
  const isYou = from === "you";
  return (
    <div className={`flex gap-3 ${isYou ? "justify-end" : ""}`}>
      {!isYou && (
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-medium">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-xl border ${isYou ? "border-accent/25 bg-accent/5" : "border-border bg-background"} p-3`}
      >
        <div className="mb-1 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground">{name}</span>
          {ai && (
            <Chip tone="accent">
              <Sparkles className="h-2.5 w-2.5" /> AI draft
            </Chip>
          )}
          <span>· {at}</span>
        </div>
        <div className="text-sm">{children}</div>
      </div>
      {isYou && (
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foreground text-xs font-medium text-background">
          SD
        </div>
      )}
    </div>
  );
}

/* ============================================================
   4. Quote Comparison & Recommendation
   ============================================================ */

// Illustrative "current date" for this demo's validity-window math (QC-07) —
// deliberately NOT the real system date, since the mock validUntil dates are
// set in Feb 2026 and would all read as expired against today's real date.
const MOCK_TODAY = new Date(2026, 1, 3);

function daysUntil(dateStr: string): number | null {
  if (!dateStr || dateStr === "—") return null;
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return null;
  return Math.ceil((target.getTime() - MOCK_TODAY.getTime()) / 86_400_000);
}

export function QuoteComparison() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newComparisonOpen, setNewComparisonOpen] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [bindOutcome, setBindOutcome] = useState<string | null>(null);

  function appendLog(who: string, what: string, ctx: string) {
    setLog((prev) => [
      {
        at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        who,
        what,
        ctx,
        conf: "—",
      },
      ...prev,
    ]);
  }

  const listQuery = useQuery({
    queryKey: ["quote-comparison", "list"],
    queryFn: listQuoteComparison,
  });
  const items = listQuery.data ?? [];

  useEffect(() => {
    if (!selectedId && listQuery.data && listQuery.data.length > 0) {
      setSelectedId(listQuery.data[0].id);
    }
  }, [listQuery.data, selectedId]);

  const detailQuery = useQuery({
    queryKey: ["quote-comparison", "detail", selectedId],
    queryFn: () => getQuoteComparison(selectedId!),
    enabled: Boolean(selectedId),
    refetchOnWindowFocus: true, // urgency is recomputed against today on every GET
  });
  const payload = detailQuery.data?.payload ?? null;

  const runMutation = useMutation({
    mutationFn: (s: FixtureScenario) => runQuoteComparison(s.ref),
    onSuccess: (item, s) => {
      queryClient.invalidateQueries({ queryKey: ["quote-comparison"] });
      toast.success(`${s.label}: comparison generated`);
      appendLog("AI (Matching/Ranking Core)", "Comparison generated", s.label);
      setSelectedId(item.id);
      setNewComparisonOpen(false);
    },
    onError: (err: unknown, s) => {
      toast.error(err instanceof Error ? err.message : `Failed to run "${s.label}"`);
    },
  });

  function recordBindOutcome(outcome: string) {
    setBindOutcome(outcome);
    appendLog(
      "You",
      `Recorded eventual outcome — ${outcome}`,
      payload?.named_insured ?? payload?.submission_id ?? "this comparison",
    );
  }

  return (
    <div className="mx-auto max-w-[1500px] animate-in fade-in-0 duration-500">
      <PageHeader
        eyebrow="Workflow 04"
        title="Quote Comparison & Recommendation"
        description="Carrier quote and declination emails ingested, terms normalized to one schema, subjectivities classified by materiality — with a drafted recommendation."
        actions={
          <Button variant="primary" onClick={() => setNewComparisonOpen((v) => !v)}>
            <Send className="h-4 w-4" />
            New comparison
          </Button>
        }
      />

      <div className="mb-5">
        <ProcessAnim
          steps={[
            {
              label: "Carrier response emails ingested and classified (quote vs. declination)",
              kind: "extraction",
            },
            {
              label: "Premium, deductible, limit, and endorsement terms normalized to one schema",
              kind: "extraction",
            },
            {
              label: "Subjectivities extracted individually and classified by materiality (QC-02)",
              kind: "matching",
            },
            {
              label:
                "Declination reason extracted · appetite consistency checked (QC-03, log only)",
              kind: "matching",
            },
            {
              label:
                "Validity windows tracked against today (QC-07) · output mode computed, not defaulted (QC-06)",
              kind: "matching",
            },
            { label: "Recommendation drafted, grounded in the extracted terms", kind: "matching" },
          ]}
        />
      </div>

      {newComparisonOpen && (
        <div className="mb-5">
          <Panel
            title="Start a new comparison"
            subtitle="Runs the real backend pipeline — POST /api/es/quote-comparison/run"
            actions={
              <Button variant="ghost" onClick={() => setNewComparisonOpen(false)}>
                Close
              </Button>
            }
          >
            <div className="flex flex-wrap gap-2">
              {QUOTE_FIXTURE_SCENARIOS.map((s) => (
                <Button
                  key={s.ref}
                  variant="secondary"
                  disabled={runMutation.isPending}
                  onClick={() => runMutation.mutate(s)}
                >
                  {runMutation.isPending && runMutation.variables?.ref === s.ref ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {s.label}
                </Button>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {listQuery.isLoading && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading comparisons…
        </div>
      )}
      {listQuery.isError && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          {listQuery.error instanceof Error
            ? listQuery.error.message
            : "Failed to load comparisons."}
        </div>
      )}

      {!listQuery.isLoading && !listQuery.isError && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)]">
          <Panel title="Comparisons" subtitle={`${items.length} generated`}>
            {items.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No comparisons yet — click "New comparison" to run one of the 6 real scenarios.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {items.map((row) => (
                  <button
                    key={row.id}
                    onClick={() => setSelectedId(row.id)}
                    className={`flex w-full items-start gap-3 py-3 text-left transition hover:bg-secondary/40 ${
                      selectedId === row.id ? "bg-secondary/50" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="truncate font-mono text-sm">
                        {row.submission_id ?? row.id}
                      </span>
                      <div className="mt-1.5">
                        <Chip>{row.status}</Chip>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Panel>

          <div className="space-y-5">
            {!selectedId ? (
              <Panel>
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Select a comparison from the list, or click "New comparison."
                </div>
              </Panel>
            ) : detailQuery.isLoading ? (
              <Panel>
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading comparison…
                </div>
              </Panel>
            ) : detailQuery.isError ? (
              <Panel>
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  {detailQuery.error instanceof Error
                    ? detailQuery.error.message
                    : "Failed to load comparison."}
                </div>
              </Panel>
            ) : payload ? (
              <LiveComparisonCard itemId={detailQuery.data!.id} payload={payload} onActed={appendLog} />
            ) : (
              <Panel>
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No comparison data for this item.
                </div>
              </Panel>
            )}

            <Panel
              title="Activity"
              subtitle="Comparison output, broker selection, and eventual bind outcome — same feedback-loop pattern as other workflows"
              actions={<FoundationBadge kind="matching" />}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border p-3 text-[11px]">
                <span className="text-muted-foreground">
                  Record eventual outcome (session log only — no backend field models this yet):
                </span>
                <Button
                  variant="ghost"
                  className="!py-1 !text-xs"
                  onClick={() => recordBindOutcome("Bound")}
                >
                  Bound
                </Button>
                <Button
                  variant="ghost"
                  className="!py-1 !text-xs"
                  onClick={() => recordBindOutcome("Lost to another market")}
                >
                  Lost to another market
                </Button>
                <Button
                  variant="ghost"
                  className="!py-1 !text-xs"
                  onClick={() => recordBindOutcome("Declined all — remarketing")}
                >
                  Declined all — remarketing
                </Button>
                {bindOutcome && (
                  <Chip tone={bindOutcome === "Bound" ? "success" : "danger"}>{bindOutcome}</Chip>
                )}
              </div>
              <ul className="divide-y divide-border">
                {log.length === 0 ? (
                  <li className="py-6 text-center text-sm text-muted-foreground">
                    No activity yet this session.
                  </li>
                ) : (
                  log.slice(0, 10).map((d, i) => (
                    <li key={i} className="flex items-start gap-3 py-3 text-sm">
                      <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                        {d.at}
                      </span>
                      <div className="flex-1">
                        <div>
                          <b>{d.who}</b> — {d.what}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{d.ctx}</div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
              <div className="mt-3 text-[10px] text-muted-foreground">
                Session-only for this prototype — feeds the same Feedback/Eval store pattern as
                other workflows, not yet persisted.
              </div>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}

const COMPARISON_MODE_LABEL: Record<
  string,
  { label: string; tone: "success" | "warn" | "danger" }
> = {
  SINGLE_RECOMMENDATION: { label: "Single primary recommendation", tone: "success" },
  MULTI_OPTION: { label: "Multi-option trade-off", tone: "warn" },
  SINGLE_QUOTE_URGENT: { label: "Single quote — urgent", tone: "danger" },
  SINGLE_QUOTE_ROUTINE: { label: "Single quote — routine", tone: "success" },
};

function ComparisonModeBadge({ mode }: { mode: string }) {
  const { label, tone } = COMPARISON_MODE_LABEL[mode] ?? { label: mode, tone: "neutral" as const };
  return <Chip tone={tone}>{label}</Chip>;
}

function LiveQuoteRow({
  quote,
  isSelected,
  isRecommended,
  onSelect,
  selecting,
}: {
  quote: ExtractedQuoteOut;
  isSelected: boolean;
  isRecommended: boolean;
  onSelect: () => void;
  selecting: boolean;
}) {
  const declined = quote.response_type === "DECLINATION";
  const routine = quote.subjectivities.filter((s) => s.materiality === "routine");
  const material = quote.subjectivities.filter((s) => s.materiality === "material");

  return (
    <li
      className={`rounded-lg border p-3 text-sm ${declined ? "border-border opacity-60" : isSelected ? "border-accent/40 bg-accent/5" : "border-border"}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">{quote.carrier_name}</span>
          {declined && <Chip tone="danger">Declined</Chip>}
          {isRecommended && !isSelected && (
            <Chip tone="accent">
              <Sparkles className="h-2.5 w-2.5" /> Recommended
            </Chip>
          )}
          {isSelected && (
            <Chip tone="success">
              <CheckCircle2 className="h-2.5 w-2.5" /> Selected
            </Chip>
          )}
        </div>
        {!declined && quote.premium != null && (
          <span className="font-mono text-xs">${quote.premium.toLocaleString()}</span>
        )}
      </div>

      {declined ? (
        <div className="mt-2 text-[12px] text-muted-foreground">
          <b className="text-foreground">Stated reason:</b>{" "}
          {quote.declination_reason ?? "No reason given in the decline email."}
          {quote.declination_appetite_consistency && (
            <div className="mt-1">
              <b className="text-foreground">Appetite consistency (QC-03, log only):</b>{" "}
              {quote.declination_appetite_consistency}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mt-2 grid gap-1 text-[11px] text-muted-foreground sm:grid-cols-2">
            {/* QC-05/FR-5: missing fields are flagged "Not stated," never blank/omitted —
                the backend already never fabricates a value, so null here is a real gap. */}
            <span>Limits: {quote.limits ?? "Not stated"}</span>
            <span>
              Deductible (all perils): {quote.deductibles?.all_perils ?? "Not stated"}
            </span>
            <span>Deductible (wind/hail): {quote.deductibles?.wind_hail ?? "Not stated"}</span>
            <span>Effective: {quote.effective_date ?? "Not stated"}</span>
            <span>Valid through: {quote.quote_valid_through ?? "Not stated"}</span>
          </div>
          {quote.key_endorsements.length > 0 && (
            <div className="mt-2 text-[11px] text-muted-foreground">
              Endorsements: {quote.key_endorsements.map((e) => `${e.type} (${e.basis})`).join("; ")}
            </div>
          )}
          {(routine.length > 0 || material.length > 0) && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {material.map((s, i) => (
                <Chip key={`m${i}`} tone="warn">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  {s.description}
                </Chip>
              ))}
              {routine.map((s, i) => (
                <Chip key={`r${i}`} tone="neutral">
                  {s.description}
                </Chip>
              ))}
            </div>
          )}
          <div className="mt-2">
            <Button
              variant={isSelected ? "secondary" : "primary"}
              className="!py-1 !text-xs"
              disabled={selecting}
              onClick={onSelect}
            >
              {selecting && <Loader2 className="h-3 w-3 animate-spin" />}
              {isSelected ? "Selected — re-select" : "Present this quote"}
            </Button>
          </div>
        </>
      )}
    </li>
  );
}

function LiveComparisonCard({
  itemId,
  payload,
  onActed,
}: {
  itemId: string;
  payload: ComparisonPayload;
  onActed: (who: string, what: string, ctx: string) => void;
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const who = payload.named_insured ?? payload.submission_id ?? itemId;

  const startBinderMutation = useMutation({
    mutationFn: () => runBinderIssuanceFromQuote(itemId),
    onSuccess: (item) => {
      toast.success("Real bind order started from this selected quote");
      onActed(
        "You",
        `Started binder — POST /api/es/binder-issuance/run-from-quote-comparison`,
        `${who} → Binder Issuance item ${item.id}`,
      );
      navigate({ to: "/app/workflows/$slug", params: { slug: "binder-issuance" } });
    },
    onError: (err: unknown) =>
      toast.error(err instanceof Error ? err.message : "Failed to start binder"),
  });

  const selectMutation = useMutation({
    mutationFn: (quoteId: string) => selectQuote(itemId, quoteId),
    onMutate: (quoteId: string) => setSelectingId(quoteId),
    onSuccess: (item, quoteId) => {
      onActed(
        "You",
        `Selected quote — POST /api/es/quote-comparison/${itemId}/select/${quoteId}. Fired a real QUOTE_TERMS_SUMMARY draft in Agent Communication (no navigation needed).`,
        `${who} → status "${item.status}"`,
      );
      toast.success(
        "Quote presented — a real draft was created in Agent Communication's Live drafts",
      );
      queryClient.invalidateQueries({ queryKey: ["quote-comparison"] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to select quote");
    },
    onSettled: () => setSelectingId(null),
  });

  const logMutation = useMutation({
    mutationFn: (action: "revise" | "lapse") =>
      action === "revise" ? requestRevisedTerms(itemId) : markLapsed(itemId),
    onSuccess: (item, action) => {
      onActed(
        "You",
        action === "revise" ? "Requested revised terms" : "Marked no action — quote will lapse",
        `${who} → status "${item.status}"`,
      );
      toast.success("Logged");
      queryClient.invalidateQueries({ queryKey: ["quote-comparison"] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Action failed");
    },
  });

  const urgent = payload.output_mode === "SINGLE_QUOTE_URGENT";

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl">{who}</h3>
            <ComparisonModeBadge mode={payload.output_mode} />
            <Chip>{payload.status}</Chip>
          </div>
        </div>
        <FoundationBadge kind="matching" />
      </div>

      {urgent && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border-2 border-destructive/40 bg-destructive/5 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div className="text-[12px] text-foreground">
            <b>Urgent — single quote (FR-22):</b> this needs its own attention, not just a
            comparison view.
          </div>
        </div>
      )}

      {!payload.comparability_assessment.directly_comparable && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-warn/40 bg-warn/10 p-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
          <div className="text-[12px] text-foreground">
            <b>Not directly comparable</b> — material differences:{" "}
            {payload.comparability_assessment.material_differences.join(", ")}. Never render this as
            "cheaper option" alone (QC-01).
          </div>
        </div>
      )}

      {payload.urgency_flags.length > 0 && (
        <div className="mt-3 space-y-1">
          {payload.urgency_flags.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-[12px] text-muted-foreground">
              <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warn" />
              <span>
                <b className="text-foreground">{f.flag_type}:</b> {f.detail}
              </span>
            </div>
          ))}
        </div>
      )}

      <ul className="mt-4 space-y-2">
        {payload.quotes.map((q) => (
          <LiveQuoteRow
            key={q.quote_id}
            quote={q}
            isSelected={payload.selected_quote_id === q.quote_id}
            isRecommended={payload.recommendation.primary_quote_id === q.quote_id}
            selecting={selectingId === q.quote_id}
            onSelect={() => selectMutation.mutate(q.quote_id)}
          />
        ))}
      </ul>

      <div className="mt-4 rounded-lg border border-border bg-secondary/30 p-3 text-[12px]">
        <b>Recommendation:</b> {payload.recommendation.reasoning.summary}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-3">
        <Button
          variant="secondary"
          disabled={logMutation.isPending}
          onClick={() => logMutation.mutate("revise")}
        >
          Request revised terms
        </Button>
        <Button
          variant="danger"
          disabled={logMutation.isPending}
          onClick={() => logMutation.mutate("lapse")}
        >
          Mark no action — will lapse
        </Button>
        {payload.selected_quote_id && (
          <Button
            variant="primary"
            disabled={startBinderMutation.isPending}
            onClick={() => startBinderMutation.mutate()}
            title="Builds a real Binder & Policy Issuance pre-bind pass from this selected quote's actual terms"
          >
            {startBinderMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            Start binder
          </Button>
        )}
      </div>
    </Panel>
  );
}

/* ============================================================
   5. Binder & Policy Issuance Coordination
   ============================================================ */

export function BinderIssuance() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newBinderOpen, setNewBinderOpen] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);

  function appendLog(who: string, what: string, ctx: string) {
    setLog((prev) => [
      {
        at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        who,
        what,
        ctx,
        conf: "—",
      },
      ...prev,
    ]);
  }

  const listQuery = useQuery({
    queryKey: ["binder-issuance", "list"],
    queryFn: listBinderIssuance,
  });
  const items = listQuery.data ?? [];

  useEffect(() => {
    if (!selectedId && listQuery.data && listQuery.data.length > 0) {
      setSelectedId(listQuery.data[0].id);
    }
  }, [listQuery.data, selectedId]);

  const detailQuery = useQuery({
    queryKey: ["binder-issuance", "detail", selectedId],
    queryFn: () => getBinderIssuance(selectedId!),
    enabled: Boolean(selectedId),
    refetchOnWindowFocus: true, // issuance-overdue/reminder status is recomputed on every GET
  });
  const payload = detailQuery.data?.payload ?? null;

  const runMutation = useMutation({
    mutationFn: (s: BinderFixtureScenario) => runBinderIssuance(s.ref),
    onSuccess: (item, s) => {
      queryClient.invalidateQueries({ queryKey: ["binder-issuance"] });
      toast.success(`${s.label}: coordination generated`);
      appendLog("AI (Matching/Ranking Core)", "Bind coordination record generated", s.label);
      setSelectedId(item.id);
      setNewBinderOpen(false);
    },
    onError: (err: unknown, s) =>
      toast.error(err instanceof Error ? err.message : `Failed to run "${s.label}"`),
  });

  return (
    <div className="mx-auto max-w-[1500px] animate-in fade-in-0 duration-500">
      <PageHeader
        eyebrow="Workflow 05"
        title="Binder & Policy Issuance Coordination"
        description="From selected quote to bound policy — subjectivity clearance, carrier bind confirmation, and issued-policy reconciliation, all checked against what was actually agreed, never assumed."
        actions={
          <Button variant="primary" onClick={() => setNewBinderOpen((v) => !v)}>
            <Sparkles className="h-4 w-4" />
            New binder
          </Button>
        }
      />

      {newBinderOpen && (
        <div className="mb-5">
          <Panel
            title="Start a new bind coordination"
            subtitle="Runs the real backend pipeline — POST /api/es/binder-issuance/run"
            actions={
              <Button variant="ghost" onClick={() => setNewBinderOpen(false)}>
                Close
              </Button>
            }
          >
            <div className="flex flex-wrap gap-2">
              {BINDER_FIXTURE_SCENARIOS.map((s) => (
                <Button
                  key={s.ref}
                  variant="secondary"
                  disabled={runMutation.isPending}
                  onClick={() => runMutation.mutate(s)}
                >
                  {runMutation.isPending && runMutation.variables?.ref === s.ref ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {s.label}
                </Button>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {listQuery.isLoading && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading binders…
        </div>
      )}
      {listQuery.isError && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          {listQuery.error instanceof Error ? listQuery.error.message : "Failed to load binders."}
        </div>
      )}

      {!listQuery.isLoading && !listQuery.isError && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)]">
          <Panel title="In-progress binders" subtitle={`${items.length} generated`}>
            {items.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No binders yet — click "New binder" to run one of the 6 real scenarios.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {items.map((row) => (
                  <button
                    key={row.id}
                    onClick={() => setSelectedId(row.id)}
                    className={`flex w-full items-start gap-3 py-3 text-left transition hover:bg-secondary/40 ${
                      selectedId === row.id ? "bg-secondary/50" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="truncate font-mono text-sm">
                        {row.submission_id ?? row.id}
                      </span>
                      <div className="mt-1.5">
                        <Chip>{row.status}</Chip>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Panel>

          <div className="space-y-5">
            {!selectedId ? (
              <Panel>
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Select a binder from the list, or click "New binder."
                </div>
              </Panel>
            ) : detailQuery.isLoading ? (
              <Panel>
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading binder…
                </div>
              </Panel>
            ) : detailQuery.isError ? (
              <Panel>
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  {detailQuery.error instanceof Error
                    ? detailQuery.error.message
                    : "Failed to load binder."}
                </div>
              </Panel>
            ) : payload ? (
              <LiveBinderCard itemId={detailQuery.data!.id} payload={payload} onActed={appendLog} />
            ) : (
              <Panel>
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No binder data for this item.
                </div>
              </Panel>
            )}

            <Panel
              title="Audit log (E&O record)"
              subtitle="Every step, every discrepancy found, and how it was resolved — proof terms were actively verified, not assumed"
              actions={<FoundationBadge kind="matching" />}
            >
              <ul className="divide-y divide-border">
                {log.length === 0 ? (
                  <li className="py-6 text-center text-sm text-muted-foreground">
                    No activity yet this session.
                  </li>
                ) : (
                  log.slice(0, 10).map((d, i) => (
                    <li key={i} className="flex items-start gap-3 py-3 text-sm">
                      <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                        {d.at}
                      </span>
                      <div className="flex-1">
                        <div>
                          <b>{d.who}</b> — {d.what}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{d.ctx}</div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
              <div className="mt-3 text-[10px] text-muted-foreground">
                Session-only for this prototype — feeds the same Feedback/Eval store pattern as
                other workflows. This is the most E&O-relevant record in the suite: it documents
                that every carrier claim was checked against what was actually agreed, not taken
                on faith.
              </div>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}

function LiveDiscrepancyBlock({
  title,
  discrepancy,
  resolving,
  onResolve,
  acceptLabel,
}: {
  title: string;
  discrepancy: DiscrepancyOut;
  resolving: boolean;
  onResolve: (resolution: string) => void;
  acceptLabel: string;
}) {
  return (
    <div className="rounded-lg border-2 border-destructive/40 bg-destructive/5 p-3 text-sm">
      <div className="flex items-center gap-2 font-medium">
        <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
        {title} — {discrepancy.field} mismatch
      </div>
      <div className="mt-2 grid grid-cols-2 gap-3 rounded-md border border-border bg-background p-2 text-xs">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Requested/bound
          </div>
          <div className="font-mono">{discrepancy.requested_or_bound}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Confirmed/issued
          </div>
          <div className="font-mono">{discrepancy.confirmed_or_issued}</div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          className="!py-1 !text-xs"
          disabled={resolving}
          onClick={() =>
            onResolve(
              acceptLabel === "accept_carrier_version"
                ? "accept_carrier_version"
                : "accept_issued_version",
            )
          }
        >
          {resolving && <Loader2 className="h-3 w-3 animate-spin" />}
          {acceptLabel === "accept_carrier_version"
            ? "Accept carrier's version"
            : "Accept issued version"}
        </Button>
        <Button
          variant="danger"
          className="!py-1 !text-xs"
          disabled={resolving}
          onClick={() => onResolve("flag_carrier_error")}
        >
          Flag as carrier error
        </Button>
      </div>
    </div>
  );
}

function LiveBinderCard({
  itemId,
  payload,
  onActed,
}: {
  itemId: string;
  payload: BindCoordinationPayload;
  onActed: (who: string, what: string, ctx: string) => void;
}) {
  const queryClient = useQueryClient();
  const [resolvingSection, setResolvingSection] = useState<"confirmation" | "policy" | null>(null);
  const who = payload.named_insured ?? payload.submission_id ?? itemId;
  const unresolvedMaterial = payload.pre_bind_subjectivities.filter(
    (s) => s.status === "open" && s.materiality === "material",
  );

  const confirmationMutation = useMutation({
    mutationFn: (resolution: DiscrepancyResolution) =>
      resolveConfirmationDiscrepancy(itemId, resolution),
    onMutate: () => setResolvingSection("confirmation"),
    onSuccess: (item, resolution) => {
      onActed(
        "You",
        `Resolved bind-confirmation discrepancy — ${resolution}`,
        `${who} → status "${item.status}"`,
      );
      toast.success("Resolved — Placement Confirmation released if this was the only blocker");
      queryClient.invalidateQueries({ queryKey: ["binder-issuance"] });
    },
    onError: (err: unknown) =>
      toast.error(err instanceof Error ? err.message : "Resolution failed"),
    onSettled: () => setResolvingSection(null),
  });

  const policyMutation = useMutation({
    mutationFn: (resolution: PolicyDiscrepancyResolution) =>
      resolvePolicyDiscrepancy(itemId, resolution),
    onMutate: () => setResolvingSection("policy"),
    onSuccess: (item, resolution) => {
      onActed(
        "You",
        `Resolved issued-policy discrepancy — ${resolution}`,
        `${who} → status "${item.status}"`,
      );
      toast.success("Resolved — Policy Documents Delivered released if this was the only blocker");
      queryClient.invalidateQueries({ queryKey: ["binder-issuance"] });
    },
    onError: (err: unknown) =>
      toast.error(err instanceof Error ? err.message : "Resolution failed"),
    onSettled: () => setResolvingSection(null),
  });

  const escalateMutation = useMutation({
    mutationFn: () => escalateBinderIssuance(itemId),
    onSuccess: (item) => {
      onActed("You", "Escalated to principal", `${who} → status "${item.status}"`);
      toast.success("Escalated");
      queryClient.invalidateQueries({ queryKey: ["binder-issuance"] });
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Escalate failed"),
  });

  function copyBindOrder() {
    const t = payload.requested_bind_terms;
    const lines = [
      `Bind order — ${who}`,
      `Carrier: ${payload.carrier_name}`,
      `Premium: ${t.premium ?? "Not specified"}`,
      `Limits: ${t.limits ?? "Not specified"}`,
      `Deductible (all perils): ${t.deductible_all_perils ?? "Not specified"}`,
      `Deductible (wind/hail): ${t.deductible_wind_hail ?? "Not specified"}`,
      `Effective date: ${t.effective_date ?? "Not specified"}`,
    ].join("\n");
    navigator.clipboard
      .writeText(lines)
      .then(() => toast.success("Bind order details copied"))
      .catch(() => toast.error("Couldn't copy — select the text and copy manually."));
  }

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl">{who}</h3>
            <Chip
              tone={
                payload.bind_order_status === "BLOCKED"
                  ? "danger"
                  : payload.bind_order_status === "SENT"
                    ? "success"
                    : "neutral"
              }
            >
              {payload.bind_order_status}
            </Chip>
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">{payload.carrier_name}</div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={copyBindOrder}>
            <Copy className="h-3.5 w-3.5" />
            Copy bind order
          </Button>
          <FoundationBadge kind="matching" />
        </div>
      </div>

      {unresolvedMaterial.length > 0 && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border-2 border-destructive/40 bg-destructive/5 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div className="text-[12px] text-foreground">
            <b>Blocked — unresolved material subjectivity:</b>{" "}
            {unresolvedMaterial.map((s) => s.description).join("; ")}
          </div>
        </div>
      )}

      {payload.carrier_confirmation.reconciliation_status === "DISCREPANCY_FLAGGED" &&
        payload.carrier_confirmation.discrepancy_detail.map((d, i) => (
          <div key={i} className="mt-4">
            <LiveDiscrepancyBlock
              title="Bind confirmation vs requested terms"
              discrepancy={d}
              resolving={resolvingSection === "confirmation"}
              acceptLabel="accept_carrier_version"
              onResolve={(r) => confirmationMutation.mutate(r as DiscrepancyResolution)}
            />
          </div>
        ))}

      {payload.issued_policy_reconciliation.status === "POLICY_DISCREPANCY_FLAGGED" &&
        payload.issued_policy_reconciliation.discrepancy_detail.map((d, i) => (
          <div key={i} className="mt-4">
            <LiveDiscrepancyBlock
              title="Issued policy vs confirmed bind terms"
              discrepancy={d}
              resolving={resolvingSection === "policy"}
              acceptLabel="accept_issued_version"
              onResolve={(r) => policyMutation.mutate(r as PolicyDiscrepancyResolution)}
            />
          </div>
        ))}

      {payload.policy_issuance.overdue_alert_fired && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-warn/40 bg-warn/10 p-3">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
          <div className="text-[12px] text-foreground">
            <b>Policy issuance overdue</b> — expected by {payload.policy_issuance.expected_by_date},
            not yet received.
          </div>
        </div>
      )}

      {payload.post_bind_ongoing_obligations.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-xs font-medium">Post-bind ongoing obligations</div>
          <ul className="space-y-2">
            {payload.post_bind_ongoing_obligations.map((o, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm"
              >
                <div>
                  <div>{o.description}</div>
                  {o.due_date && (
                    <div className="text-[11px] text-muted-foreground">Due {o.due_date}</div>
                  )}
                </div>
                <Chip
                  tone={o.status === "completed" ? "success" : o.reminder_due ? "warn" : "neutral"}
                >
                  {o.status === "completed"
                    ? "Completed"
                    : o.reminder_due
                      ? "Reminder due"
                      : "Open"}
                </Chip>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 grid gap-2 text-[11px] text-muted-foreground sm:grid-cols-2">
        <span>
          Placement Confirmation fired:{" "}
          {payload.downstream_triggers_fired.placement_confirmation ? "yes" : "no"}
        </span>
        <span>
          Policy Documents Delivered fired:{" "}
          {payload.downstream_triggers_fired.policy_documents_delivered ? "yes" : "no"}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-border pt-3">
        <Button
          variant="secondary"
          disabled={escalateMutation.isPending}
          onClick={() => escalateMutation.mutate()}
        >
          {escalateMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Escalate to principal
        </Button>
      </div>
    </Panel>
  );
}

/* ============================================================
   6. Endorsement / Mid-Term Change Processing
   ============================================================ */

export function EndorsementProcessing() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);

  function appendLog(who: string, what: string, ctx: string) {
    setLog((prev) => [
      {
        at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        who,
        what,
        ctx,
        conf: "—",
      },
      ...prev,
    ]);
  }

  const listQuery = useQuery({ queryKey: ["endorsement", "list"], queryFn: listEndorsement });
  const items = listQuery.data ?? [];

  useEffect(() => {
    if (!selectedId && listQuery.data && listQuery.data.length > 0) {
      setSelectedId(listQuery.data[0].id);
    }
  }, [listQuery.data, selectedId]);

  const detailQuery = useQuery({
    queryKey: ["endorsement", "detail", selectedId],
    queryFn: () => getEndorsement(selectedId!),
    enabled: Boolean(selectedId),
  });
  const payload = detailQuery.data?.payload ?? null;

  const runMutation = useMutation({
    mutationFn: (s: EndorsementFixtureScenario) => runEndorsement(s.ref),
    onSuccess: (item, s) => {
      queryClient.invalidateQueries({ queryKey: ["endorsement"] });
      toast.success(`${s.label}: request processed`);
      appendLog("AI (Matching/Ranking Core)", "Endorsement request processed", s.label);
      setSelectedId(item.id);
      setNewRequestOpen(false);
    },
    onError: (err: unknown, s) =>
      toast.error(err instanceof Error ? err.message : `Failed to run "${s.label}"`),
  });

  return (
    <div className="mx-auto max-w-[1500px] animate-in fade-in-0 duration-500">
      <PageHeader
        eyebrow="Workflow 06"
        title="Endorsement / Mid-Term Change Processing"
        description="AI classifies materiality, rechecks appetite against the carrier's current profile, and reconciles the issued endorsement item by item before any trigger fires — never assuming appetite fit from absent data, never trusting a carrier's issued document without reconciling it."
        actions={
          <Button variant="primary" onClick={() => setNewRequestOpen((v) => !v)}>
            <Sparkles className="h-4 w-4" />
            New endorsement request
          </Button>
        }
      />

      {newRequestOpen && (
        <div className="mb-5">
          <Panel
            title="Start a new endorsement request"
            subtitle="Runs the real backend pipeline — POST /api/es/endorsement/run"
            actions={
              <Button variant="ghost" onClick={() => setNewRequestOpen(false)}>
                Close
              </Button>
            }
          >
            <div className="flex flex-wrap gap-2">
              {ENDORSEMENT_FIXTURE_SCENARIOS.map((s) => (
                <Button
                  key={s.ref}
                  variant="secondary"
                  disabled={runMutation.isPending}
                  onClick={() => runMutation.mutate(s)}
                >
                  {runMutation.isPending && runMutation.variables?.ref === s.ref ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {s.label}
                </Button>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {listQuery.isLoading && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading endorsement requests…
        </div>
      )}
      {listQuery.isError && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          {listQuery.error instanceof Error ? listQuery.error.message : "Failed to load requests."}
        </div>
      )}

      {!listQuery.isLoading && !listQuery.isError && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)]">
          <Panel title="Open mid-term change requests" subtitle={`${items.length} generated`}>
            {items.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No requests yet — click "New endorsement request" to run one of the 6 real
                scenarios.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {items.map((row) => (
                  <button
                    key={row.id}
                    onClick={() => setSelectedId(row.id)}
                    className={`flex w-full items-start gap-3 py-3 text-left transition hover:bg-secondary/40 ${
                      selectedId === row.id ? "bg-secondary/50" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="truncate font-mono text-sm">
                        {row.submission_id ?? row.id}
                      </span>
                      <div className="mt-1.5">
                        <Chip>{row.status}</Chip>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Panel>

          <div className="space-y-5">
            {!selectedId ? (
              <Panel>
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Select a request from the list, or click "New endorsement request."
                </div>
              </Panel>
            ) : detailQuery.isLoading ? (
              <Panel>
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading request…
                </div>
              </Panel>
            ) : detailQuery.isError ? (
              <Panel>
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  {detailQuery.error instanceof Error
                    ? detailQuery.error.message
                    : "Failed to load request."}
                </div>
              </Panel>
            ) : payload ? (
              <LiveEndorsementCard
                itemId={detailQuery.data!.id}
                payload={payload}
                onActed={appendLog}
              />
            ) : (
              <Panel>
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No request data for this item.
                </div>
              </Panel>
            )}

            <Panel
              title="Audit log (E&O record)"
              subtitle="Every classification decision, appetite outcome, and reconciliation result — including appetite-unknown resolutions logged as a signal for Carrier Appetite Intelligence"
              actions={<FoundationBadge kind="matching" />}
            >
              <ul className="divide-y divide-border">
                {log.length === 0 ? (
                  <li className="py-6 text-center text-sm text-muted-foreground">
                    No activity yet this session.
                  </li>
                ) : (
                  log.slice(0, 10).map((d, i) => (
                    <li key={i} className="flex items-start gap-3 py-3 text-sm">
                      <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                        {d.at}
                      </span>
                      <div className="flex-1">
                        <div>
                          <b>{d.who}</b> — {d.what}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{d.ctx}</div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
              <div className="mt-3 text-[10px] text-muted-foreground">
                Session-only for this prototype — feeds the same Feedback/Eval store pattern as
                other workflows.
              </div>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}

const ENDORSEMENT_APPETITE_TONE: Record<string, "success" | "warn" | "danger"> = {
  WITHIN_APPETITE: "success",
  OUTSIDE_APPETITE: "danger",
  APPETITE_UNKNOWN: "warn",
  NOT_APPLICABLE: "success",
};

function LiveEndorsementCard({
  itemId,
  payload,
  onActed,
}: {
  itemId: string;
  payload: EndorsementRequestPayload;
  onActed: (who: string, what: string, ctx: string) => void;
}) {
  const queryClient = useQueryClient();
  const [resolving, setResolving] = useState(false);
  const who = payload.named_insured ?? itemId;
  const appetite = payload.appetite_recheck;
  const appetiteTone = ENDORSEMENT_APPETITE_TONE[appetite.outcome] ?? "warn";

  const resolveMutation = useMutation({
    mutationFn: (resolution: EndorsementDiscrepancyResolution) =>
      resolveEndorsementDiscrepancy(itemId, resolution),
    onMutate: () => setResolving(true),
    onSuccess: (item, resolution) => {
      onActed(
        "You",
        `Resolved item-level discrepancy — ${resolution}`,
        `${who} → status "${item.status}"`,
      );
      toast.success("Resolved — ENDORSEMENT_CONFIRMED released if this was the only blocker");
      queryClient.invalidateQueries({ queryKey: ["endorsement"] });
    },
    onError: (err: unknown) =>
      toast.error(err instanceof Error ? err.message : "Resolution failed"),
    onSettled: () => setResolving(false),
  });

  const sendMutation = useMutation({
    mutationFn: () => sendEndorsement(itemId),
    onSuccess: (item) => {
      onActed("You", "Sent endorsement request", `${who} → status "${item.status}"`);
      toast.success("Sent");
      queryClient.invalidateQueries({ queryKey: ["endorsement"] });
    },
    onError: (err: unknown) =>
      toast.error(err instanceof Error ? err.message : "Send failed (senior/admin only)"),
  });

  const escalateMutation = useMutation({
    mutationFn: () => escalateEndorsement(itemId),
    onSuccess: (item) => {
      onActed(
        "You",
        "Escalated to carrier's underwriting team",
        `${who} → status "${item.status}"`,
      );
      toast.success("Escalated");
      queryClient.invalidateQueries({ queryKey: ["endorsement"] });
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Escalate failed"),
  });

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl">{who}</h3>
            <Chip tone={payload.classification === "ROUTINE" ? "success" : "warn"}>
              {payload.classification}
            </Chip>
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {payload.carrier_name} · {payload.requested_change.type}:{" "}
            {payload.requested_change.detail}
          </div>
        </div>
        <FoundationBadge kind="matching" />
      </div>

      {appetite.applicable && (
        <div
          className={`mt-4 flex items-start gap-2 rounded-lg border p-3 ${
            appetiteTone === "warn"
              ? "border-2 border-warn/40 bg-warn/10"
              : appetiteTone === "danger"
                ? "border-2 border-destructive/40 bg-destructive/5"
                : "border-success/30 bg-success/5"
          }`}
        >
          <AlertTriangle
            className={`mt-0.5 h-4 w-4 shrink-0 ${
              appetiteTone === "success"
                ? "text-success"
                : appetiteTone === "danger"
                  ? "text-destructive"
                  : "text-warn"
            }`}
          />
          <div className="text-[12px] text-foreground">
            <b>Appetite recheck: {appetite.outcome.replace(/_/g, " ")}</b>
            {appetite.detail && <div className="mt-1 text-muted-foreground">{appetite.detail}</div>}
            {appetite.state_licensing_clarification_needed && (
              <div className="mt-1 text-muted-foreground">
                State-licensing clarification needed — new location's state not specified, must be
                confirmed before proceeding.
              </div>
            )}
          </div>
        </div>
      )}

      {payload.premium_impact.premium_bearing != null && (
        <div className="mt-4 rounded-lg border border-border p-3 text-[12px]">
          <b>
            {payload.premium_impact.premium_bearing ? "Premium-bearing" : "Not premium-bearing"}
          </b>
          {payload.premium_impact.proration_inputs && (
            <div className="mt-1 text-muted-foreground">
              Proration inputs only (no confirmed figure):{" "}
              {payload.premium_impact.proration_inputs.days_elapsed} of{" "}
              {payload.premium_impact.proration_inputs.term_total_days} days elapsed,{" "}
              {payload.premium_impact.proration_inputs.days_remaining} remaining.
            </div>
          )}
          {payload.premium_impact.proration_inputs?.unusual_timing_flag && (
            <div className="mt-2 flex items-start gap-2 rounded-md border border-warn/40 bg-warn/10 p-2 text-warn">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{payload.premium_impact.proration_inputs.unusual_timing_flag}</span>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 whitespace-pre-wrap rounded-lg border border-border bg-secondary/30 p-3 text-[12px]">
        {payload.drafted_request.body}
      </div>

      {payload.carrier_response.reconciliation_status === "DISCREPANCY_FLAGGED" && (
        <div className="mt-4 rounded-lg border-2 border-destructive/40 bg-destructive/5 p-3 text-sm">
          <div className="flex items-center gap-2 font-medium text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Item-level reconciliation discrepancy
          </div>
          <div className="mt-2 space-y-1 text-[12px]">
            <div className="text-muted-foreground">
              Requested items: {payload.requested_items.join(", ") || "—"}
            </div>
            <div className="text-muted-foreground">
              Issued items: {payload.carrier_response.issued_items.join(", ") || "—"}
            </div>
            {payload.carrier_response.discrepancy_detail.map((d, i) => (
              <div key={i} className="font-mono">
                Missing: {d.requested_item}
                {d.issued_item ? ` (issued as: ${d.issued_item})` : ""}
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              className="!py-1 !text-xs"
              disabled={resolving}
              onClick={() => resolveMutation.mutate("accept_carrier_issuance")}
            >
              {resolving && <Loader2 className="h-3 w-3 animate-spin" />}
              Accept carrier's issuance
            </Button>
            <Button
              variant="danger"
              className="!py-1 !text-xs"
              disabled={resolving}
              onClick={() => resolveMutation.mutate("flag_carrier_error")}
            >
              Flag as carrier error
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 text-[11px] text-muted-foreground">
        ENDORSEMENT_CONFIRMED fired: {payload.downstream_trigger_fired ? "yes" : "no"}
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-border pt-3">
        <Button
          variant="primary"
          disabled={sendMutation.isPending}
          onClick={() => sendMutation.mutate()}
        >
          {sendMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Send (senior/admin)
        </Button>
        <Button
          variant="secondary"
          disabled={escalateMutation.isPending}
          onClick={() => escalateMutation.mutate()}
        >
          {escalateMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Escalate to carrier UW
        </Button>
      </div>
    </Panel>
  );
}

/* ============================================================
   7. Renewal Remarketing
   ============================================================ */

export function RenewalRemarketing() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newReviewOpen, setNewReviewOpen] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);

  function appendLog(who: string, what: string, ctx: string) {
    setLog((prev) => [
      {
        at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        who,
        what,
        ctx,
        conf: "—",
      },
      ...prev,
    ]);
  }

  const listQuery = useQuery({
    queryKey: ["renewal-remarketing", "list"],
    queryFn: listRenewalRemarketing,
  });
  const items = listQuery.data ?? [];

  useEffect(() => {
    if (!selectedId && listQuery.data && listQuery.data.length > 0) {
      setSelectedId(listQuery.data[0].id);
    }
  }, [listQuery.data, selectedId]);

  const detailQuery = useQuery({
    queryKey: ["renewal-remarketing", "detail", selectedId],
    queryFn: () => getRenewalRemarketing(selectedId!),
    enabled: Boolean(selectedId),
  });
  const payload = detailQuery.data?.payload ?? null;

  const runMutation = useMutation({
    mutationFn: (s: RenewalFixtureScenario) => runRenewalRemarketing(s.ref),
    onSuccess: (item, s) => {
      queryClient.invalidateQueries({ queryKey: ["renewal-remarketing"] });
      toast.success(`${s.label}: review generated`);
      appendLog("AI (Matching/Ranking Core)", "Renewal review generated", s.label);
      setSelectedId(item.id);
      setNewReviewOpen(false);
    },
    onError: (err: unknown, s) =>
      toast.error(err instanceof Error ? err.message : `Failed to run "${s.label}"`),
  });

  return (
    <div className="mx-auto max-w-[1500px] animate-in fade-in-0 duration-500">
      <PageHeader
        eyebrow="Workflow 07"
        title="Renewal Remarketing"
        description="Detects exposure and loss changes plus incumbent responsiveness on bound policies approaching renewal, and produces a graduated remarket recommendation."
        actions={
          <Button variant="primary" onClick={() => setNewReviewOpen((v) => !v)}>
            <Sparkles className="h-4 w-4" />
            New renewal review
          </Button>
        }
      />

      {newReviewOpen && (
        <div className="mb-5">
          <Panel
            title="Start a new renewal review"
            subtitle="Runs the real backend pipeline — POST /api/es/renewal-remarketing/run"
            actions={
              <Button variant="ghost" onClick={() => setNewReviewOpen(false)}>
                Close
              </Button>
            }
          >
            <div className="flex flex-wrap gap-2">
              {RENEWAL_FIXTURE_SCENARIOS.map((s) => (
                <Button
                  key={s.ref}
                  variant="secondary"
                  disabled={runMutation.isPending}
                  onClick={() => runMutation.mutate(s)}
                >
                  {runMutation.isPending && runMutation.variables?.ref === s.ref ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {s.label}
                </Button>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {listQuery.isLoading && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading renewal reviews…
        </div>
      )}
      {listQuery.isError && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          {listQuery.error instanceof Error ? listQuery.error.message : "Failed to load reviews."}
        </div>
      )}

      {!listQuery.isLoading && !listQuery.isError && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)]">
          <Panel title="Renewal pipeline" subtitle={`${items.length} generated`}>
            {items.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No reviews yet — click "New renewal review" to run one of the 6 real scenarios.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {items.map((row) => (
                  <button
                    key={row.id}
                    onClick={() => setSelectedId(row.id)}
                    className={`flex w-full items-start gap-3 py-3 text-left transition hover:bg-secondary/40 ${
                      selectedId === row.id ? "bg-secondary/50" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="truncate font-mono text-sm">
                        {row.submission_id ?? row.id}
                      </span>
                      <div className="mt-1.5">
                        <Chip>{row.status}</Chip>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Panel>

          <div className="space-y-5">
            {!selectedId ? (
              <Panel>
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Select a review from the list, or click "New renewal review."
                </div>
              </Panel>
            ) : detailQuery.isLoading ? (
              <Panel>
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading review…
                </div>
              </Panel>
            ) : detailQuery.isError ? (
              <Panel>
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  {detailQuery.error instanceof Error
                    ? detailQuery.error.message
                    : "Failed to load review."}
                </div>
              </Panel>
            ) : payload ? (
              <LiveRenewalCard itemId={detailQuery.data!.id} payload={payload} onActed={appendLog} />
            ) : (
              <Panel>
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No review data for this item.
                </div>
              </Panel>
            )}

            <Panel
              title="Decision log (E&O record)"
              subtitle="Trigger level, remarket outcome, and final decision — this is what RR-08 reads next cycle"
              actions={<FoundationBadge kind="matching" />}
            >
              <ul className="divide-y divide-border">
                {log.length === 0 ? (
                  <li className="py-6 text-center text-sm text-muted-foreground">
                    No activity yet this session.
                  </li>
                ) : (
                  log.slice(0, 10).map((d, i) => (
                    <li key={i} className="flex items-start gap-3 py-3 text-sm">
                      <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                        {d.at}
                      </span>
                      <div className="flex-1">
                        <div>
                          <b>{d.who}</b> — {d.what}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{d.ctx}</div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
              <div className="mt-3 text-[10px] text-muted-foreground">
                Session-only for this prototype — feeds the same Feedback/Eval store pattern as
                other workflows.
              </div>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}

const RENEWAL_TRIGGER_TONE: Record<string, "success" | "accent" | "warn" | "danger"> = {
  NO_REMARKET: "success",
  LIGHT_REMARKET_CHECK: "accent",
  FULL_REMARKET: "warn",
  URGENT_REMARKET: "danger",
};

function LiveComparisonOption({
  label,
  option,
}: {
  label: string;
  option: NonNullable<ComparisonOutputOut["incumbent"]>;
}) {
  return (
    <div className="rounded-lg border border-border p-3 text-sm">
      <div className="flex items-center gap-2 font-medium">
        {label}: {option.carrier_name}
        {option.is_exception_based && <Chip tone="warn">Exception-based</Chip>}
      </div>
      <div className="mt-1 grid grid-cols-2 gap-1 text-[11px] text-muted-foreground">
        {option.premium != null && <span>Premium: ${option.premium.toLocaleString()}</span>}
        {option.deductible != null && (
          <span>Deductible: ${option.deductible.toLocaleString()}</span>
        )}
        {option.limits && <span className="col-span-2">Limits: {option.limits}</span>}
      </div>
      {option.exception_detail && (
        <div className="mt-2 text-[11px] text-muted-foreground">{option.exception_detail}</div>
      )}
    </div>
  );
}

function LiveRenewalCard({
  itemId,
  payload,
  onActed,
}: {
  itemId: string;
  payload: RemarketDecisionPayload;
  onActed: (who: string, what: string, ctx: string) => void;
}) {
  const queryClient = useQueryClient();
  const [pendingAction, setPendingAction] = useState<"initiate" | "accept" | "escalate" | null>(
    null,
  );
  const who = payload.named_insured ?? itemId;
  const level = payload.trigger_decision.level;
  const tone = RENEWAL_TRIGGER_TONE[level] ?? "warn";

  const initiateMutation = useMutation({
    mutationFn: () => initiateRemarket(itemId),
    onMutate: () => setPendingAction("initiate"),
    onSuccess: (item) => {
      onActed(
        "You",
        `Approved — re-invoked Market Matching (real item created at /api/es/market-matching)`,
        `${who} → status "${item.status}"`,
      );
      toast.success("Remarket initiated — a real Market Matching item was created");
      queryClient.invalidateQueries({ queryKey: ["renewal-remarketing"] });
    },
    onError: (err: unknown) =>
      toast.error(
        err instanceof Error ? err.message : "Initiate failed (NO_REMARKET can't initiate)",
      ),
    onSettled: () => setPendingAction(null),
  });

  const acceptMutation = useMutation({
    mutationFn: () => acceptIncumbent(itemId),
    onMutate: () => setPendingAction("accept"),
    onSuccess: (item) => {
      onActed("You", "Accepted incumbent renewal terms", `${who} → status "${item.status}"`);
      toast.success("Accepted incumbent terms");
      queryClient.invalidateQueries({ queryKey: ["renewal-remarketing"] });
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Accept failed"),
    onSettled: () => setPendingAction(null),
  });

  const escalateMutation = useMutation({
    mutationFn: () => escalateRenewalRemarketing(itemId),
    onMutate: () => setPendingAction("escalate"),
    onSuccess: (item) => {
      onActed("You", "Escalated urgent remarket", `${who} → status "${item.status}"`);
      toast.success("Escalated");
      queryClient.invalidateQueries({ queryKey: ["renewal-remarketing"] });
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Escalate failed"),
    onSettled: () => setPendingAction(null),
  });

  const comparison = payload.remarket_execution.comparison_output;

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl">{who}</h3>
            <Chip tone={tone}>{level.replace(/_/g, " ")}</Chip>
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {payload.incumbent_carrier_name}
          </div>
        </div>
        <FoundationBadge kind="matching" />
      </div>

      <div
        className={`mt-4 rounded-lg border p-3 text-[12px] ${
          level === "URGENT_REMARKET"
            ? "border-2 border-destructive/40 bg-destructive/5"
            : level === "NO_REMARKET"
              ? "border-success/30 bg-success/5"
              : "border-warn/40 bg-warn/5"
        }`}
      >
        {payload.trigger_decision.reasoning.summary}
        {payload.trigger_decision.reasoning.citations.length > 0 && (
          <ul className="mt-2 space-y-0.5 border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
            {payload.trigger_decision.reasoning.citations.map((c, i) => (
              <li key={i}>
                {c.claim} <span className="font-mono">({c.source})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 grid gap-2 text-[11px] text-muted-foreground sm:grid-cols-2">
        {payload.exposure_change.pct_change !== 0 && (
          <span>
            Exposure change: {payload.exposure_change.pct_change}%
            {payload.exposure_change.material ? " (material)" : ""}
          </span>
        )}
        {payload.loss_history_change.trend && (
          <span>Loss trend: {payload.loss_history_change.trend}</span>
        )}
        {payload.incumbent_status.non_response_flag && (
          <span className="text-destructive">Incumbent non-response flagged</span>
        )}
        {payload.remarketing_history_detail && (
          <span className="sm:col-span-2">History: {payload.remarketing_history_detail}</span>
        )}
      </div>

      {comparison && (
        <div className="mt-4">
          <div className="mb-2 text-xs font-medium">Post-remarket comparison</div>
          {!comparison.directly_comparable && comparison.material_differences.length > 0 && (
            <div className="mb-2 rounded-lg border border-warn/40 bg-warn/10 p-2 text-[11px] text-foreground">
              Not directly comparable — material differences:{" "}
              {comparison.material_differences.join(", ")}. Never default to the lower premium
              alone.
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            {comparison.incumbent && (
              <LiveComparisonOption label="Incumbent" option={comparison.incumbent} />
            )}
            {comparison.alternative && (
              <LiveComparisonOption label="Alternative" option={comparison.alternative} />
            )}
          </div>
        </div>
      )}

      {payload.remarket_execution.initiated && (
        <div className="mt-4 text-[11px] text-muted-foreground">
          Remarket initiated — Market Matching item:{" "}
          {payload.remarket_execution.market_matching_output_id}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-3">
        {level === "NO_REMARKET" ? (
          <Button
            variant="primary"
            disabled={pendingAction === "accept"}
            onClick={() => acceptMutation.mutate()}
          >
            {pendingAction === "accept" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Accept incumbent terms
          </Button>
        ) : (
          <Button
            variant={level === "URGENT_REMARKET" ? "danger" : "secondary"}
            disabled={pendingAction === "initiate"}
            onClick={() => initiateMutation.mutate()}
          >
            {pendingAction === "initiate" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {level === "FULL_REMARKET" ? "Approve full remarket" : "Approve light check"}
          </Button>
        )}
        {level === "URGENT_REMARKET" && (
          <Button
            variant="secondary"
            disabled={pendingAction === "escalate"}
            onClick={() => escalateMutation.mutate()}
          >
            {pendingAction === "escalate" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Escalate
          </Button>
        )}
      </div>
    </Panel>
  );
}

/* ============================================================
   8. Diligent Search & Compliance Documentation
   ============================================================ */

export function DiligentSearchCompliance() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newCheckOpen, setNewCheckOpen] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);

  function appendLog(who: string, what: string, ctx: string) {
    setLog((prev) => [
      {
        at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        who,
        what,
        ctx,
        conf: "—",
      },
      ...prev,
    ]);
  }

  const listQuery = useQuery({
    queryKey: ["diligent-search", "list"],
    queryFn: listDiligentSearch,
  });
  const items = listQuery.data ?? [];

  useEffect(() => {
    if (!selectedId && listQuery.data && listQuery.data.length > 0) {
      setSelectedId(listQuery.data[0].id);
    }
  }, [listQuery.data, selectedId]);

  const detailQuery = useQuery({
    queryKey: ["diligent-search", "detail", selectedId],
    queryFn: () => getDiligentSearch(selectedId!),
    enabled: Boolean(selectedId),
  });
  const payload = detailQuery.data?.payload ?? null;

  const runMutation = useMutation({
    mutationFn: (s: ComplianceFixtureScenario) => runDiligentSearch(s.ref),
    onSuccess: (item, s) => {
      queryClient.invalidateQueries({ queryKey: ["diligent-search"] });
      toast.success(`${s.label}: determination generated`);
      appendLog("AI (Matching/Ranking Core)", "Compliance determination generated", s.label);
      setSelectedId(item.id);
      setNewCheckOpen(false);
    },
    onError: (err: unknown, s) =>
      toast.error(err instanceof Error ? err.message : `Failed to run "${s.label}"`),
  });

  return (
    <div className="mx-auto max-w-[1500px] animate-in fade-in-0 duration-500">
      <PageHeader
        eyebrow="Workflow 08"
        title="Diligent Search & Compliance Documentation"
        description="Per-state diligent-search requirements, declination evidence sufficiency, and compliant surplus-lines documentation — gated so nothing generates on incomplete evidence. Submissions enter this workflow from Submission Market Matching's MM-07 diligent-search flag — fully processed here, not just logged upstream."
        actions={
          <Button variant="primary" onClick={() => setNewCheckOpen((v) => !v)}>
            <FileSearch className="h-4 w-4" />
            New compliance check
          </Button>
        }
      />

      <div className="mb-5 flex items-start gap-3 rounded-xl border border-border bg-secondary/40 p-4 text-sm">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <div>
          <div className="font-medium">Zero-tolerance gate</div>
          <div className="text-[11px] text-muted-foreground">
            This workflow will not generate surplus-lines documentation unless every required
            declination has sufficient written evidence on file, or the state is confirmed exempt
            for this class. No exceptions.
          </div>
        </div>
      </div>

      {newCheckOpen && (
        <div className="mb-5">
          <Panel
            title="Start a new compliance check"
            subtitle="Runs the real backend pipeline — POST /api/es/diligent-search/run"
            actions={
              <Button variant="ghost" onClick={() => setNewCheckOpen(false)}>
                Close
              </Button>
            }
          >
            <div className="flex flex-wrap gap-2">
              {COMPLIANCE_FIXTURE_SCENARIOS.map((s) => (
                <Button
                  key={s.ref}
                  variant="secondary"
                  disabled={runMutation.isPending}
                  onClick={() => runMutation.mutate(s)}
                >
                  {runMutation.isPending && runMutation.variables?.ref === s.ref ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {s.label}
                </Button>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {listQuery.isLoading && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading compliance records…
        </div>
      )}
      {listQuery.isError && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          {listQuery.error instanceof Error ? listQuery.error.message : "Failed to load records."}
        </div>
      )}

      {!listQuery.isLoading && !listQuery.isError && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)]">
          <Panel title="Diligent search queue" subtitle={`${items.length} generated`}>
            {items.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No records yet — click "New compliance check" to run one of the 4 real scenarios.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {items.map((row) => (
                  <button
                    key={row.id}
                    onClick={() => setSelectedId(row.id)}
                    className={`flex w-full items-start gap-3 py-3 text-left transition hover:bg-secondary/40 ${
                      selectedId === row.id ? "bg-secondary/50" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="truncate font-mono text-sm">
                        {row.submission_id ?? row.id}
                      </span>
                      <div className="mt-1.5">
                        <Chip>{row.status}</Chip>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Panel>

          <div className="space-y-5">
            {!selectedId ? (
              <Panel>
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Select a record from the list, or click "New compliance check."
                </div>
              </Panel>
            ) : detailQuery.isLoading ? (
              <Panel>
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading record…
                </div>
              </Panel>
            ) : detailQuery.isError ? (
              <Panel>
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  {detailQuery.error instanceof Error
                    ? detailQuery.error.message
                    : "Failed to load record."}
                </div>
              </Panel>
            ) : payload ? (
              <LiveComplianceCard
                itemId={detailQuery.data!.id}
                payload={payload}
                onActed={appendLog}
              />
            ) : (
              <Panel>
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No record data for this item.
                </div>
              </Panel>
            )}

            <Panel
              title="Activity"
              subtitle="Every classification decision and reconciliation outcome, this session"
              actions={<FoundationBadge kind="matching" />}
            >
              <ul className="divide-y divide-border">
                {log.length === 0 ? (
                  <li className="py-6 text-center text-sm text-muted-foreground">
                    No activity yet this session.
                  </li>
                ) : (
                  log.slice(0, 10).map((d, i) => (
                    <li key={i} className="flex items-start gap-3 py-3 text-sm">
                      <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                        {d.at}
                      </span>
                      <div className="flex-1">
                        <div>
                          <b>{d.who}</b> — {d.what}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{d.ctx}</div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
              <div className="mt-3 text-[10px] text-muted-foreground">
                Session-only for this prototype — feeds the same Feedback/Eval store pattern as
                other workflows.
              </div>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}

const COMPLIANCE_REQUIREMENT_TONE: Record<string, "success" | "warn" | "danger"> = {
  REQUIRED: "warn",
  EXEMPT: "success",
  PENDING_DETERMINATION: "danger",
};

const COMPLIANCE_OVERALL_TONE: Record<string, "success" | "warn" | "danger"> = {
  COMPLETE: "success",
  PARTIAL: "warn",
  BLOCKED: "danger",
};

function LiveStateDetermination({ s }: { s: StateDeterminationOut }) {
  const tone = COMPLIANCE_REQUIREMENT_TONE[s.requirement_status] ?? "warn";
  return (
    <li className="rounded-lg border border-border p-3 text-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">{s.state}</span>
        <Chip tone={tone}>{s.requirement_status.replace(/_/g, " ")}</Chip>
      </div>
      {s.exemption_basis && (
        <div className="mt-1 text-[11px] text-muted-foreground">
          <b className="text-foreground">Exemption basis:</b> {s.exemption_basis}
        </div>
      )}
      {s.requirement_status === "REQUIRED" && (
        <div className="mt-1 text-[11px] text-muted-foreground">
          {s.declinations_on_file.length} declination(s) on file
          {s.declinations_required != null ? ` of ${s.declinations_required} required` : ""} ·{" "}
          <Chip
            tone={
              s.sufficiency_status === "SUFFICIENT"
                ? "success"
                : s.sufficiency_status === "INSUFFICIENT"
                  ? "danger"
                  : "neutral"
            }
          >
            {s.sufficiency_status.replace(/_/g, " ")}
          </Chip>
        </div>
      )}
      {s.declinations_on_file.length > 0 && (
        <ul className="mt-2 space-y-1 text-[11px] text-muted-foreground">
          {s.declinations_on_file.map((dec, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {dec.written_evidence ? (
                <CheckCircle2 className="h-3 w-3 shrink-0 text-success" />
              ) : (
                <AlertTriangle className="h-3 w-3 shrink-0 text-warn" />
              )}
              {dec.carrier}
              {dec.date ? ` — ${dec.date}` : ""}
              {!dec.written_evidence && " (verbal only — not sufficient)"}
            </li>
          ))}
        </ul>
      )}
      {s.gap_detail && (
        <div className="mt-2 rounded-md border border-warn/30 bg-warn/5 p-2 text-[11px] text-foreground">
          {s.gap_detail}
        </div>
      )}
      <div className="mt-2 flex items-center gap-2 text-[11px]">
        <span className="text-muted-foreground">Document:</span>
        {s.document_generated ? (
          <Chip tone="success">
            <CheckCircle2 className="h-2.5 w-2.5" /> Generated
          </Chip>
        ) : (
          <Chip tone="neutral">Not generated</Chip>
        )}
      </div>
      {s.generated_document_text && (
        <div className="mt-2 whitespace-pre-wrap rounded-md border border-border bg-secondary/30 p-2 text-[11px]">
          {s.generated_document_text}
        </div>
      )}
      {s.retention_period_years == null ? (
        <div className="mt-2 text-[10px] text-muted-foreground">
          Retention period: not yet sourced (FR-8 — never guessed).
        </div>
      ) : (
        <div className="mt-2 text-[10px] text-muted-foreground">
          Retention period: {s.retention_period_years} years
        </div>
      )}
    </li>
  );
}

function LiveComplianceCard({
  itemId,
  payload,
  onActed,
}: {
  itemId: string;
  payload: ComplianceRecordPayload;
  onActed: (who: string, what: string, ctx: string) => void;
}) {
  const queryClient = useQueryClient();
  const [pendingAction, setPendingAction] = useState<"approve" | "escalate" | null>(null);
  const who = payload.named_insured ?? itemId;
  const hasPending = payload.state_determinations.some(
    (s) => s.requirement_status === "PENDING_DETERMINATION",
  );

  const approveMutation = useMutation({
    mutationFn: () => approveDiligentSearch(itemId),
    onMutate: () => setPendingAction("approve"),
    onSuccess: (item) => {
      onActed("You", "Approved compliance determination", `${who} → status "${item.status}"`);
      toast.success("Approved");
      queryClient.invalidateQueries({ queryKey: ["diligent-search"] });
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Approve failed"),
    onSettled: () => setPendingAction(null),
  });

  const escalateMutation = useMutation({
    mutationFn: () => escalateDiligentSearch(itemId),
    onMutate: () => setPendingAction("escalate"),
    onSuccess: (item) => {
      onActed(
        "You",
        "Escalated ambiguous determination to compliance/legal",
        `${who} → status "${item.status}"`,
      );
      toast.success("Escalated");
      queryClient.invalidateQueries({ queryKey: ["diligent-search"] });
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Escalate failed"),
    onSettled: () => setPendingAction(null),
  });

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl">{who}</h3>
            <Chip tone={COMPLIANCE_OVERALL_TONE[payload.overall_status] ?? "warn"}>
              {payload.overall_status}
            </Chip>
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {payload.state_determinations.length} state(s)
          </div>
        </div>
        <FoundationBadge kind="matching" />
      </div>

      {payload.overall_status === "BLOCKED" && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border-2 border-destructive/40 bg-destructive/5 p-3">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div className="text-[12px] text-foreground">
            <b>Zero-tolerance gate held.</b> No document generated for any state falling short of
            sufficient written evidence.
          </div>
        </div>
      )}

      <ul className="mt-4 space-y-2">
        {payload.state_determinations.map((s) => (
          <LiveStateDetermination key={s.state} s={s} />
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-3">
        <Button
          variant="primary"
          disabled={pendingAction === "approve"}
          onClick={() => approveMutation.mutate()}
        >
          {pendingAction === "approve" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Approve
        </Button>
        {hasPending && (
          <Button
            variant="secondary"
            disabled={pendingAction === "escalate"}
            onClick={() => escalateMutation.mutate()}
          >
            {pendingAction === "escalate" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <Gavel className="h-3.5 w-3.5" />
            Escalate ambiguous state to compliance
          </Button>
        )}
      </div>
    </Panel>
  );
}

/* ============================================================
   9. Carrier Appetite Intelligence Tracking
   ============================================================ */

export function CarrierAppetiteIntelligence() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const listQuery = useQuery({
    queryKey: ["carrier-appetite-intelligence", "list"],
    queryFn: listCarrierAppetiteIntelligence,
  });
  const items = listQuery.data ?? [];
  const suppressedCount = items.filter((i) => i.payload?.status === "SUPPRESSED").length;

  const detailQuery = useQuery({
    queryKey: ["carrier-appetite-intelligence", "detail", selectedId],
    queryFn: () => getCarrierAppetiteIntelligence(selectedId!),
    enabled: Boolean(selectedId),
  });

  function appendLog(who: string, what: string, ctx: string) {
    setLog((prev) => [
      {
        at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        who,
        what,
        ctx,
        conf: "—",
      },
      ...prev,
    ]);
  }

  const runMutation = useMutation({
    mutationFn: (s: AppetiteFixtureScenario) => runCarrierAppetiteIntelligence(s.ref),
    onSuccess: (item, s) => {
      queryClient.invalidateQueries({ queryKey: ["carrier-appetite-intelligence"] });
      appendLog(
        "You",
        `Ran appetite check — ${s.label}`,
        `→ ${item.payload?.pattern_type.replace(/_/g, " ") ?? "evaluated"}`,
      );
      toast.success(`${s.label}: evaluation complete`);
      setSelectedId(item.id);
      setPickerOpen(false);
    },
    onError: (err: unknown, s) =>
      toast.error(err instanceof Error ? err.message : `Failed to run "${s.label}"`),
  });

  const runLiveMutation = useMutation({
    mutationFn: runCarrierAppetiteIntelligenceLive,
    onSuccess: (createdItems) => {
      queryClient.invalidateQueries({ queryKey: ["carrier-appetite-intelligence"] });
      if (createdItems.length === 0) {
        toast.success("No real declination signals logged yet — run some Quote Comparison scenarios first.");
        return;
      }
      appendLog(
        "You",
        "Checked live signals",
        `→ ${createdItems.length} carrier${createdItems.length === 1 ? "" : "s"} evaluated from real Quote Comparison data`,
      );
      toast.success(`${createdItems.length} carrier${createdItems.length === 1 ? "" : "s"} evaluated from live data`);
      setSelectedId(createdItems[0].id);
    },
    onError: (err: unknown) =>
      toast.error(err instanceof Error ? err.message : "Failed to check live signals"),
  });

  return (
    <div className="mx-auto max-w-[1500px] animate-in fade-in-0 duration-500">
      <PageHeader
        eyebrow="Workflow 09"
        title="Carrier Appetite Intelligence Tracking"
        description="Aggregates signals already logged by Quote Comparison and Renewal Remarketing, and surfaces well-evidenced appetite-shift suggestions for human review."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              disabled={runLiveMutation.isPending}
              onClick={() => runLiveMutation.mutate()}
              title="Evaluates every carrier with a real declination signal already logged by Quote Comparison for this tenant"
            >
              {runLiveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Radar className="h-4 w-4" />
              )}
              Check live signals
            </Button>
            <Button variant="primary" onClick={() => setPickerOpen((v) => !v)}>
              <Sparkles className="h-4 w-4" />
              New appetite check
            </Button>
          </div>
        }
      />

      <div className="mb-5 flex items-start gap-3 rounded-xl border border-border bg-secondary/40 p-4 text-sm">
        <Radar className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <div>
          <div className="font-medium">v1 scope, kept narrow on purpose</div>
          <div className="text-[11px] text-muted-foreground">
            This workflow only aggregates, suggests, and auto-updates exactly two metadata fields —
            appetite confidence and last-signal date. Treat that as binding, not a starting point to
            expand from. Aggregates signals already logged by Quote Comparison (QC-03) and Renewal
            Remarketing (RR-08) — it never collects new signals of its own.
          </div>
        </div>
      </div>

      {pickerOpen && (
        <Panel title="Run an appetite check" subtitle="Real Workflow_18 fixture scenarios">
          <div className="flex flex-wrap gap-2">
            {APPETITE_FIXTURE_SCENARIOS.map((s) => (
              <Button
                key={s.ref}
                variant="secondary"
                disabled={runMutation.isPending}
                onClick={() => runMutation.mutate(s)}
              >
                {runMutation.isPending && runMutation.variables?.ref === s.ref ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {s.label}
              </Button>
            ))}
          </div>
        </Panel>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <GovKpi
          label="Evaluations run"
          value={String(items.length)}
          sub="From Quote Comparison + Remarketing signals"
        />
        <GovKpi
          label="Suppressed"
          value={String(suppressedCount)}
          sub={
            items.length > 0
              ? `${Math.round((suppressedCount / items.length) * 100)}% of total — expected`
              : "Default outcome"
          }
        />
        <GovKpi
          label="Pending review"
          value={String(items.filter((i) => i.payload?.status === "PENDING_REVIEW").length)}
          sub="Awaiting broker approval"
        />
        <GovKpi
          label="Auto-updated"
          value={String(
            items.filter((i) => i.payload?.status === "METADATA_AUTO_UPDATED").length,
          )}
          sub="Confidence + last-signal date only"
        />
      </div>

      {listQuery.isLoading && (
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading evaluations…
        </div>
      )}
      {listQuery.isError && (
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          {listQuery.error instanceof Error
            ? listQuery.error.message
            : "Failed to load evaluations."}
        </div>
      )}

      {!listQuery.isLoading && !listQuery.isError && (
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)]">
          <Panel
            title="Appetite evaluations"
            subtitle={`${items.length} generated`}
            actions={<FoundationBadge kind="matching" />}
          >
            {items.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No evaluations yet — run a scenario above.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {items.map((row) => (
                  <button
                    key={row.id}
                    onClick={() => setSelectedId(row.id)}
                    className={`flex w-full items-start gap-3 py-3 text-left transition hover:bg-secondary/40 ${
                      selectedId === row.id ? "bg-secondary/50" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="truncate font-mono text-sm">
                        {row.submission_id ?? row.id}
                      </span>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <Chip>{row.status}</Chip>
                        {row.payload?.pattern_type && (
                          <Chip tone={APPETITE_PATTERN_TONE[row.payload.pattern_type] ?? "warn"}>
                            {row.payload.pattern_type.replace(/_/g, " ")}
                          </Chip>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Panel>

          <div className="space-y-5">
            {!selectedId ? (
              <Panel>
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Select an evaluation from the list.
                </div>
              </Panel>
            ) : detailQuery.isLoading ? (
              <Panel>
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading evaluation…
                </div>
              </Panel>
            ) : detailQuery.isError ? (
              <Panel>
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  {detailQuery.error instanceof Error
                    ? detailQuery.error.message
                    : "Failed to load evaluation."}
                </div>
              </Panel>
            ) : detailQuery.data?.payload ? (
              <LiveSignalCard
                itemId={detailQuery.data.id}
                payload={detailQuery.data.payload}
                onActed={appendLog}
              />
            ) : (
              <Panel>
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No evaluation data for this item.
                </div>
              </Panel>
            )}

            <Panel
              title="Decision timeline"
              subtitle="Every AI and human decision, fully auditable"
              actions={<FoundationBadge kind="matching" />}
            >
              <ul className="divide-y divide-border">
                {log.length === 0 ? (
                  <li className="py-6 text-center text-sm text-muted-foreground">
                    No activity yet this session.
                  </li>
                ) : (
                  log.slice(0, 10).map((d, i) => (
                    <li key={i} className="flex items-start gap-3 py-3 text-sm">
                      <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                        {d.at}
                      </span>
                      <div className="flex-1">
                        <div>
                          <b>{d.who}</b> — {d.what}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{d.ctx}</div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}

const APPETITE_PATTERN_TONE: Record<string, "success" | "warn" | "danger"> = {
  CONFIRMED_CONSISTENT: "success",
  GENUINE_INCONSISTENCY: "warn",
  INSUFFICIENT_SIGNAL: "danger",
};

const APPETITE_STATUS_TONE: Record<string, "success" | "warn" | "danger" | "neutral"> = {
  SUPPRESSED: "neutral",
  METADATA_AUTO_UPDATED: "success",
  PENDING_REVIEW: "warn",
  APPROVED: "success",
  DISMISSED: "danger",
};

function LiveEvidenceRow({ e }: { e: EvidenceItemOut }) {
  return (
    <li className="flex items-center gap-2 text-[11px] text-muted-foreground">
      <span className="font-mono">{e.submission_id}</span>
      <span>{e.outcome}</span>
      {e.date && <span>· {e.date}</span>}
      {e.stated_reason && <span>— "{e.stated_reason}"</span>}
      {e.reason_scope && (
        <Chip tone={e.reason_scope === "class_level" ? "warn" : "neutral"}>
          {e.reason_scope.replace(/_/g, " ")}
        </Chip>
      )}
    </li>
  );
}

function LiveSignalCard({
  itemId,
  payload,
  onActed,
}: {
  itemId: string;
  payload: CarrierAppetiteEvaluationPayload;
  onActed: (who: string, what: string, ctx: string) => void;
}) {
  const queryClient = useQueryClient();
  const [pendingAction, setPendingAction] = useState<"approve" | "dismiss" | null>(null);
  const who = `${payload.carrier_name || payload.carrier_id} · ${payload.class_code}`;

  const approveMutation = useMutation({
    mutationFn: () => approveCarrierAppetiteIntelligence(itemId),
    onMutate: () => setPendingAction("approve"),
    onSuccess: (item) => {
      onActed(
        "You",
        "Approved appetite-shift suggestion (records approval only — no profile changed)",
        `${who} → status "${item.status}"`,
      );
      toast.success("Approved — a human still applies this manually to any real profile");
      queryClient.invalidateQueries({ queryKey: ["carrier-appetite-intelligence"] });
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Approve failed"),
    onSettled: () => setPendingAction(null),
  });

  const dismissMutation = useMutation({
    mutationFn: () => dismissCarrierAppetiteIntelligence(itemId),
    onMutate: () => setPendingAction("dismiss"),
    onSuccess: (item) => {
      onActed("You", "Dismissed appetite-shift suggestion", `${who} → status "${item.status}"`);
      toast.success("Dismissed");
      queryClient.invalidateQueries({ queryKey: ["carrier-appetite-intelligence"] });
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Dismiss failed"),
    onSettled: () => setPendingAction(null),
  });

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl">{who}</h3>
            <Chip tone={APPETITE_PATTERN_TONE[payload.pattern_type] ?? "warn"}>
              {payload.pattern_type.replace(/_/g, " ")}
            </Chip>
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            <Chip tone={APPETITE_STATUS_TONE[payload.status] ?? "neutral"}>{payload.status}</Chip>
          </div>
        </div>
        <FoundationBadge kind="matching" />
      </div>

      {payload.suggested_action && (
        <div className="mt-4 rounded-lg border-2 border-warn/40 bg-warn/5 p-3 text-[12px] text-foreground">
          <b>Suggested action (human-reviewed only):</b> {payload.suggested_action}
        </div>
      )}

      {payload.metadata_refresh && (
        <div className="mt-4 rounded-lg border border-success/30 bg-success/5 p-3 text-[12px]">
          <b>Metadata auto-refresh (only these two fields, ever):</b>
          <div className="mt-1 text-muted-foreground">
            appetite_confidence: {payload.metadata_refresh.appetite_confidence} · last updated:{" "}
            {payload.metadata_refresh.appetite_last_updated}
          </div>
        </div>
      )}

      {payload.evidence.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-xs font-medium">Evidence (every claim traces here)</div>
          <ul className="space-y-1 rounded-lg border border-border p-3">
            {payload.evidence.map((e, i) => (
              <LiveEvidenceRow key={i} e={e} />
            ))}
          </ul>
        </div>
      )}

      {payload.pattern_type === "GENUINE_INCONSISTENCY" && payload.status === "PENDING_REVIEW" && (
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <Button
            variant="primary"
            disabled={pendingAction === "approve"}
            onClick={() => approveMutation.mutate()}
          >
            {pendingAction === "approve" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Approve
          </Button>
          <Button
            variant="secondary"
            disabled={pendingAction === "dismiss"}
            onClick={() => dismissMutation.mutate()}
          >
            {pendingAction === "dismiss" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Dismiss
          </Button>
        </div>
      )}
    </Panel>
  );
}

/* ============================================================
   10. Pipeline & Carrier Performance Reporting
   ============================================================ */

export function PipelineCarrierReporting() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const listQuery = useQuery({
    queryKey: ["pipeline-reporting", "list"],
    queryFn: listPipelineReporting,
  });
  const items = listQuery.data ?? [];
  const gapCount = items.filter((i) => i.payload?.data_completeness.status === "PARTIAL").length;
  const lowVolumeCarrierCount = items.reduce(
    (sum, i) => sum + (i.payload?.carrier_performance.filter((c) => c.low_volume_flag).length ?? 0),
    0,
  );

  const detailQuery = useQuery({
    queryKey: ["pipeline-reporting", "detail", selectedId],
    queryFn: () => getPipelineReporting(selectedId!),
    enabled: Boolean(selectedId),
  });

  const runMutation = useMutation({
    mutationFn: (s: ReportingFixtureScenario) => runPipelineReporting(s.ref),
    onSuccess: (item, s) => {
      queryClient.invalidateQueries({ queryKey: ["pipeline-reporting"] });
      toast.success(`${s.label}: report generated`);
      setSelectedId(item.id);
      setPickerOpen(false);
    },
    onError: (err: unknown, s) =>
      toast.error(err instanceof Error ? err.message : `Failed to run "${s.label}"`),
  });

  const runLiveMutation = useMutation({
    mutationFn: runPipelineReportingLive,
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: ["pipeline-reporting"] });
      toast.success("Live report generated from real cross-workflow data");
      setSelectedId(item.id);
      setPickerOpen(false);
    },
    onError: (err: unknown) =>
      toast.error(err instanceof Error ? err.message : "Failed to generate live report"),
  });

  return (
    <div className="mx-auto max-w-[1500px] animate-in fade-in-0 duration-500">
      <PageHeader
        eyebrow="Workflow 10"
        title="Pipeline & Carrier Performance Reporting"
        description="Aggregates logs from all prior E&S workflows into a funnel view, carrier hit-rate comparison, and remarketing value report — with mandatory low-volume annotation and data-gap flagging."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              disabled={runLiveMutation.isPending}
              onClick={() => runLiveMutation.mutate()}
              title="Builds one report from real Market Matching / Package Assembly / Quote Comparison / Binder Issuance / Renewal Remarketing data for this tenant"
            >
              {runLiveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
              Generate live report
            </Button>
            <Button variant="primary" onClick={() => setPickerOpen((v) => !v)}>
              <Sparkles className="h-4 w-4" />
              New report
            </Button>
          </div>
        }
      />

      <div className="mb-5 flex items-start gap-3 rounded-xl border border-border bg-secondary/40 p-4 text-sm">
        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <div>
          <div className="font-medium">Pure aggregation, no forecasting (v1 scope)</div>
          <div className="text-[11px] text-muted-foreground">
            Pulls logs already produced by the prior E&S workflows for the selected period. No
            predictive forecasting, automated threshold alerting, or individual broker
            scorecarding. Revenue attribution (PR-04) is intentionally not built — it needs real
            commission-structure data from discovery, not an assumption.
          </div>
        </div>
      </div>

      {pickerOpen && (
        <Panel title="Generate a report" subtitle="Real Workflow_19 fixture scenarios">
          <div className="flex flex-wrap gap-2">
            {REPORTING_FIXTURE_SCENARIOS.map((s) => (
              <Button
                key={s.ref}
                variant="secondary"
                disabled={runMutation.isPending}
                onClick={() => runMutation.mutate(s)}
              >
                {runMutation.isPending && runMutation.variables?.ref === s.ref ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {s.label}
              </Button>
            ))}
          </div>
        </Panel>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <GovKpi
          label="Reports generated"
          value={String(items.length)}
          sub="Across all fixture scenarios"
        />
        <GovKpi
          label="Reports with a data gap"
          value={String(gapCount)}
          sub="PR-06 — flagged, never smoothed over"
        />
        <GovKpi
          label="Low-volume carrier flags"
          value={String(lowVolumeCarrierCount)}
          sub="PR-02 — annotated, never ranked at face value"
        />
        <GovKpi
          label="Revenue attribution (PR-04)"
          value="Not built"
          sub="Needs real commission data — by design"
        />
      </div>

      {listQuery.isLoading && (
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading reports…
        </div>
      )}
      {listQuery.isError && (
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          {listQuery.error instanceof Error ? listQuery.error.message : "Failed to load reports."}
        </div>
      )}

      {!listQuery.isLoading && !listQuery.isError && (
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)]">
          <Panel
            title="Reports"
            subtitle={`${items.length} generated`}
            actions={<FoundationBadge kind="matching" />}
          >
            {items.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No reports yet — run a scenario above.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {items.map((row) => (
                  <button
                    key={row.id}
                    onClick={() => setSelectedId(row.id)}
                    className={`flex w-full items-start gap-3 py-3 text-left transition hover:bg-secondary/40 ${
                      selectedId === row.id ? "bg-secondary/50" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="truncate font-mono text-sm">
                        {row.submission_id ?? row.id}
                      </span>
                      <div className="mt-1.5">
                        <Chip>{row.status}</Chip>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Panel>

          <div>
            {!selectedId ? (
              <Panel>
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Select a report from the list.
                </div>
              </Panel>
            ) : detailQuery.isLoading ? (
              <Panel>
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading report…
                </div>
              </Panel>
            ) : detailQuery.isError ? (
              <Panel>
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  {detailQuery.error instanceof Error
                    ? detailQuery.error.message
                    : "Failed to load report."}
                </div>
              </Panel>
            ) : detailQuery.data?.payload ? (
              <LiveReportCard payload={detailQuery.data.payload} />
            ) : (
              <Panel>
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No report data for this item.
                </div>
              </Panel>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LiveFunnelStage({ stage, max }: { stage: FunnelStageOut; max: number }) {
  const gap = stage.count == null;
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="w-40 shrink-0 text-xs text-muted-foreground">{stage.stage}</div>
      {gap ? (
        <div className="flex h-6 flex-1 items-center gap-1.5 rounded-md border-2 border-dashed border-warn/50 bg-warn/5 px-2 text-[11px] text-warn">
          <AlertTriangle className="h-3 w-3 shrink-0" />
          Data gap — never interpolated
        </div>
      ) : (
        <div className="h-6 flex-1 overflow-hidden rounded-md bg-secondary">
          <div
            className="flex h-full items-center justify-end bg-accent px-2 text-[10px] font-mono text-accent-foreground transition-[width] duration-700 ease-out"
            style={{ width: `${Math.max(4, (stage.count! / max) * 100)}%` }}
          >
            {stage.count}
          </div>
        </div>
      )}
      <div className="w-12 shrink-0 text-right font-mono text-[11px] text-muted-foreground">
        {stage.pct_of_prior_stage != null ? `${stage.pct_of_prior_stage}%` : "—"}
      </div>
    </div>
  );
}

const REMARKET_OUTCOME_TONE: Record<string, "success" | "accent" | "neutral"> = {
  savings_identified: "success",
  confirmation_value: "accent",
  not_remarketed: "neutral",
};

function LiveReportCard({ payload }: { payload: PipelineReportPayload }) {
  const hasGap = payload.data_completeness.status === "PARTIAL";
  const maxCount = Math.max(1, ...payload.funnel.map((f) => f.count ?? 0));

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl">{payload.period}</h3>
          <div className="mt-1 text-[11px] text-muted-foreground">{payload.report_id}</div>
        </div>
        <FoundationBadge kind="matching" />
      </div>

      <div
        className={`mt-4 flex items-start gap-2 rounded-lg border-2 p-3 text-sm ${
          hasGap ? "border-warn/40 bg-warn/5" : "border-success/30 bg-success/5"
        }`}
      >
        {hasGap ? (
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
        ) : (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
        )}
        <div>
          <b>Data completeness: {payload.data_completeness.status}</b>
          {payload.data_completeness.gaps.map((g, i) => (
            <div key={i} className="mt-1 text-[11px] text-foreground">
              {g.stage}: {g.reason}
            </div>
          ))}
        </div>
      </div>

      {payload.funnel.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs font-medium">
            <span>Submission → bound funnel</span>
            <span className="text-muted-foreground">
              Overall conversion:{" "}
              {payload.overall_conversion_pct != null
                ? `${payload.overall_conversion_pct}%`
                : "— (withheld, gap present)"}
            </span>
          </div>
          <div className="space-y-2">
            {payload.funnel.map((f) => (
              <LiveFunnelStage key={f.stage} stage={f} max={maxCount} />
            ))}
          </div>
        </div>
      )}

      {payload.carrier_performance.length > 0 && (
        <div className="mt-5">
          <div className="mb-2 text-xs font-medium">
            Carrier hit-rate comparison — sorted by volume, not rate
          </div>
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-1.5 text-left">Carrier</th>
                <th className="py-1.5 text-right">Submissions</th>
                <th className="py-1.5 text-right">Quote rate</th>
                <th className="py-1.5 text-right">Bind rate</th>
                <th className="py-1.5 text-right">Overall hit rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payload.carrier_performance.map((c: CarrierPerformanceOut) => (
                <tr key={c.carrier_name}>
                  <td className="py-2 font-medium">
                    <div className="flex items-center gap-2">
                      {c.carrier_name}
                      {c.low_volume_flag && <Chip tone="warn">Low volume</Chip>}
                    </div>
                  </td>
                  <td className="py-2 text-right tabular-nums">{c.submissions_approached}</td>
                  <td className="py-2 text-right font-mono">{c.quote_rate}%</td>
                  <td className="py-2 text-right font-mono">{c.bind_rate}%</td>
                  <td className="py-2 text-right font-mono">{c.overall_hit_rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {payload.remarketing_value.length > 0 && (
        <div className="mt-5">
          <div className="mb-2 text-xs font-medium">Remarketing value</div>
          <ul className="space-y-2">
            {payload.remarketing_value.map((r: RemarketOutcomeOut, i: number) => (
              <li key={i} className="rounded-lg border border-border p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{r.account}</span>
                  <Chip tone={REMARKET_OUTCOME_TONE[r.outcome_type] ?? "neutral"}>
                    {r.outcome_type.replace(/_/g, " ")}
                  </Chip>
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  Trigger: {r.trigger_level}
                  {r.savings_amount != null && ` · Savings: $${r.savings_amount.toLocaleString()}`}
                </div>
                {r.note && <div className="mt-1 text-[11px] text-muted-foreground">{r.note}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
  );
}

