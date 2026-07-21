import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
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
  TrendingUp,
  TrendingDown,
  Ban,
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
import {
  carrierPerformance,
  retailAgents,
  decisionsLog,
  midTermChanges,
  monthlyPipeline,
  remarketing,
  stateMix,
  submissionDocs,
  submissionMarkets,
  submissions,
  quotes,
  binders,
  diligentSearch,
  appetiteSignals,
  type Market,
  type Submission,
  type Binder,
  type Discrepancy,
  type MidTermChange,
  type Remarket,
  type DiligentSearchRecord,
  type DiligentSearchStateDetail,
  pipelineCompleteness,
  placementCycle,
} from "./mocks";
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
    <section className={`rounded-2xl border border-border bg-background p-5 ${className}`}>
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

function Chip({
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
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${map[tone]}`}
    >
      {children}
    </span>
  );
}

function Button({ children, variant = "secondary", className = "", ...p }: any) {
  const base = "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition";
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

function Tabs({
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
          className={`rounded-md px-3 py-1.5 transition ${value === t ? "bg-background font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
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
        <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
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

const RECOMMENDED_CARRIERS = ["Kinsale Insurance", "James River Insurance", "Ategrity Specialty"];

export function SubmissionMarketMatching() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>(submissions[0].id);
  const s = submissions.find((x) => x.id === selected)!;
  const [tab, setTab] = useState("Documents");
  const [selectedCarriers, setSelectedCarriers] = useState<string[]>(RECOMMENDED_CARRIERS);
  const [log, setLog] = useState<LogEntry[]>(() => [
    {
      at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      who: "AI (Matching/Ranking Core)",
      what: `Ranked shortlist produced — ${submissionMarkets.filter((m) => m.fit !== "Out of appetite").length} of ${submissionMarkets.length} carriers in appetite`,
      ctx: `${s.id} · ${s.insured}`,
      conf: "94%",
    },
  ]);

  function toggleCarrier(carrier: string) {
    setSelectedCarriers((prev) =>
      prev.includes(carrier) ? prev.filter((c) => c !== carrier) : [...prev, carrier],
    );
  }

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

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        eyebrow="Workflow 01 · Built"
        title="Submission Market Matching"
        description="Email → extraction → carrier panel ranking → per-carrier missing-info check. Every retail submission, ranked against your whole panel, every time."
        actions={
          <>
            <Button variant="secondary">
              <Upload className="h-4 w-4" />
              Upload submission
            </Button>
            <Button variant="primary">
              <Sparkles className="h-4 w-4" />
              Run batch matching
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <FiltersRow items={["All open", "Strong fit", "Marginal fit", "Needs info", "No market"]} />
        <div className="w-72">
          <SearchBar placeholder="Search by insured, agent, id…" />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)]">
        {/* Inbox */}
        <Panel title="Submission inbox" subtitle="24 today · 12 awaiting review">
          <div className="divide-y divide-border">
            {submissions.map((row) => (
              <button
                key={row.id}
                onClick={() => setSelected(row.id)}
                className={`flex w-full items-start gap-3 py-3 text-left transition hover:bg-secondary/40 ${
                  selected === row.id ? "bg-secondary/50" : ""
                }`}
              >
                <div
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${row.status === "New" || row.status === "Extracting" ? "bg-accent" : "bg-transparent"}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium">{row.insured}</span>
                    <span className="text-[11px] text-muted-foreground">{row.received}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{row.agency}</span>·<span>{row.state}</span>·
                    <span className="font-mono">{row.premium}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Chip
                      tone={
                        row.appetite === "Strong fit"
                          ? "success"
                          : row.appetite === "Marginal fit"
                            ? "warn"
                            : "danger"
                      }
                    >
                      {row.appetite}
                    </Chip>
                    <Chip>{row.status}</Chip>
                    {row.score > 0 && (
                      <Chip
                        tone={row.score >= 80 ? "success" : row.score >= 60 ? "warn" : "danger"}
                      >
                        Score {row.score}
                      </Chip>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        {/* Detail */}
        <div className="space-y-5">
          <Panel>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] font-mono text-muted-foreground">{s.id}</div>
                <h2 className="mt-1 font-serif text-2xl leading-tight">{s.insured}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {s.industry}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {s.state}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Effective {s.effective}
                  </span>
                  <span>TIV {s.tiv}</span>
                  <span>Est. premium {s.premium}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary">Request info</Button>
                <Button variant="danger">No market</Button>
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
                      "Sam D. (Broker)",
                      `Selected ${selectedCarriers.length} carrier${selectedCarriers.length === 1 ? "" : "s"} for packaging — ${selectedCarriers.join(", ")}`,
                      `${s.id} · proceeding to Package Assembly`,
                    );
                    navigate({
                      to: "/app/workflows/$slug",
                      params: { slug: "package-assembly" },
                      search: { submissionId: s.id, carriers: selectedCarriers.join(",") },
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
                label="Best-fit score"
                value={s.score.toString()}
                sub={`Top market · ${s.topMarket}`}
                tone={s.score >= 80 ? "success" : "warn"}
              />
              <MetricTile
                label="Panel fit"
                value={s.appetite}
                sub={`${s.marketsInAppetite} of 5 markets in appetite`}
                tone={s.appetite === "Strong fit" ? "success" : "warn"}
              />
              <MetricTile
                label="Recommendation"
                value={s.recommendation}
                sub="AI + broker co-sign"
                tone={
                  s.recommendation === "Proceed to market"
                    ? "success"
                    : s.recommendation === "No market"
                      ? "danger"
                      : "warn"
                }
              />
            </div>
          </Panel>

          <ProcessAnim
            steps={[
              { label: "Email ingested from retail agent (Marsh Southeast)", kind: "extraction" },
              { label: "6 attachments classified · 291 fields extracted", kind: "extraction" },
              { label: "ACORD 125 / 140 parsed · loss run reconciled", kind: "extraction" },
              { label: "Cross-document validation passed (0 conflicts)", kind: "extraction" },
              { label: "Carrier panel ranked · 4 of 5 markets in appetite", kind: "matching" },
              {
                label: "Per-carrier missing-info identified · recommendation drafted",
                kind: "matching",
              },
            ]}
          />

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
              {tab === "Documents" && <DocumentsTab />}
              {tab === "Carrier ranking" && (
                <CarrierRankingTab
                  selected={selectedCarriers}
                  onToggle={toggleCarrier}
                  insured={s.insured}
                  state={s.state}
                />
              )}
              {tab === "Match rules" && <MatchRulesTab insured={s.insured} state={s.state} />}
              {tab === "AI recommendation" && (
                <MatchRecommendationTab
                  selected={selectedCarriers}
                  onToggle={toggleCarrier}
                  onLog={appendLog}
                />
              )}
              {tab === "Activity" && <ActivityTab log={log} onLog={appendLog} submission={s} />}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function DocumentsTab() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs font-medium">6 documents · 291 fields extracted</div>
          <FoundationBadge kind="extraction" />
        </div>
        <ul className="space-y-2 text-sm">
          {submissionDocs.map((d) => (
            <li
              key={d.name}
              className="flex items-center gap-3 rounded-lg border border-border p-3"
            >
              <div className="grid h-8 w-8 place-items-center rounded-md bg-secondary">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{d.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  {d.kind} · {d.pages}p · {d.extractedFields} fields
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-xs font-mono ${d.confidence > 0.95 ? "text-success" : d.confidence > 0.9 ? "text-warn" : "text-destructive"}`}
                >
                  {(d.confidence * 100).toFixed(0)}%
                </div>
                <div className="text-[10px] text-muted-foreground">confidence</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="mb-2 text-xs font-medium">Document viewer · ACORD_125_Palmetto.pdf</div>
        <div className="relative overflow-hidden rounded-lg border border-border bg-paper">
          <div className="grid grid-cols-2 gap-6 p-6 font-mono text-[11px] text-ink-soft">
            <div>
              <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Named Insured
              </div>
              <div className="rounded bg-accent/15 px-1 py-0.5 text-foreground">
                Palmetto Cold Storage LLC
              </div>
              <div className="mt-3 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                FEIN
              </div>
              <div className="rounded bg-accent/15 px-1 py-0.5 text-foreground">58-1298347</div>
              <div className="mt-3 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Mailing address
              </div>
              <div className="rounded bg-accent/15 px-1 py-0.5 text-foreground">
                4210 Warehouse Rd, Jacksonville FL 32218
              </div>
              <div className="mt-3 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Business type
              </div>
              <div className="rounded bg-accent/15 px-1 py-0.5 text-foreground">
                Cold storage warehousing (NAICS 493120)
              </div>
            </div>
            <div>
              <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Effective / Expiration
              </div>
              <div className="rounded bg-accent/15 px-1 py-0.5 text-foreground">
                02/12/2026 – 02/12/2027
              </div>
              <div className="mt-3 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Prior carrier
              </div>
              <div className="rounded bg-accent/15 px-1 py-0.5 text-foreground">
                Kinsale Insurance
              </div>
              <div className="mt-3 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Prior premium
              </div>
              <div className="rounded bg-accent/15 px-1 py-0.5 text-foreground">$168,900</div>
              <div className="mt-3 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Annual revenue
              </div>
              <div className="rounded bg-accent/15 px-1 py-0.5 text-foreground">$41,200,000</div>
            </div>
          </div>
          <div className="absolute right-3 top-3 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">
            42 fields highlighted
          </div>
        </div>
        <div className="mt-2 text-[10px] text-muted-foreground">
          Every highlighted field is a citation — click to jump to the source page.
        </div>
      </div>
    </div>
  );
}

function CarrierRankingTab({
  selected,
  onToggle,
  insured,
  state,
}: {
  selected: string[];
  onToggle: (carrier: string) => void;
  insured: string;
  state: string;
}) {
  const dsRecord = diligentSearch.find((d) => d.insured === insured);
  const dsState = dsRecord?.states.find((s) => s.state === state);
  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs font-medium">
            Ranked carrier panel · 4 of 5 in appetite · {selected.length} selected for packaging
          </div>
          <FoundationBadge kind="matching" />
        </div>
        <ul className="space-y-2">
          {submissionMarkets.map((m, i) => {
            const selectable = m.fit !== "Out of appetite";
            const isChecked = selected.includes(m.carrier);
            return (
              <li
                key={m.carrier}
                className={`rounded-lg border p-3 text-sm ${m.fit === "Out of appetite" ? "border-border opacity-60" : isChecked ? "border-accent/40 bg-accent/5" : "border-border"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {selectable ? (
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => onToggle(m.carrier)}
                        aria-label={`Select ${m.carrier} for packaging`}
                      />
                    ) : (
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-secondary text-[11px] font-mono">
                        {i + 1}
                      </span>
                    )}
                    <span className="font-medium">{m.carrier}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip
                      tone={
                        m.fit === "Strong fit"
                          ? "success"
                          : m.fit === "Marginal fit"
                            ? "warn"
                            : "danger"
                      }
                    >
                      {m.fit}
                    </Chip>
                    <span className="font-mono text-xs text-muted-foreground">{m.score}</span>
                  </div>
                </div>
                <div className="mt-2 grid gap-1 text-[11px] text-muted-foreground sm:grid-cols-3">
                  <span>Capacity: {m.capacity}</span>
                  <span>Est. premium: {m.estPremium}</span>
                  <span>Turnaround: {m.turnaround}</span>
                </div>
                <div className="mt-2 text-[11px]">
                  {m.reasoningSource ? (
                    <SourceCitation doc={m.reasoningSource.doc} page={m.reasoningSource.page}>
                      {m.reasoning}
                    </SourceCitation>
                  ) : (
                    <span className="text-muted-foreground">{m.reasoning}</span>
                  )}
                </div>
                {m.missingInfo.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.missingInfo.map((mi) => (
                      <Chip key={mi} tone="warn">
                        <AlertTriangle className="h-2.5 w-2.5" />
                        {mi}
                      </Chip>
                    ))}
                  </div>
                )}

                {selectable && (
                  <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-border pt-2 text-[11px]">
                    <details className="min-w-0 flex-1">
                      <summary className="cursor-pointer select-none text-muted-foreground hover:text-foreground">
                        Requirements · {m.requirements.length - m.missingInfo.length} of{" "}
                        {m.requirements.length} on file
                      </summary>
                      <ul className="mt-1.5 space-y-1 pl-1">
                        {m.requirements.map((req) => {
                          const missing = m.missingInfo.includes(req);
                          return (
                            <li key={req} className="flex items-center gap-1.5">
                              {missing ? (
                                <AlertTriangle className="h-3 w-3 shrink-0 text-warn" />
                              ) : (
                                <CheckCircle2 className="h-3 w-3 shrink-0 text-success" />
                              )}
                              <span
                                className={missing ? "text-foreground" : "text-muted-foreground"}
                              >
                                {req}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </details>

                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">Diligent search:</span>
                      {!m.diligentSearchRequired ? (
                        <span className="text-muted-foreground">Not required</span>
                      ) : dsState?.evidenceSufficient || dsState?.status === "Exempt" ? (
                        <Chip tone="success">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          {dsState.status === "Exempt"
                            ? "Exempt"
                            : `Satisfied (${dsState.declinationsOnFile}/${dsState.requiredDeclinations})`}
                        </Chip>
                      ) : (
                        <Chip tone="warn">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          {dsState
                            ? `Not yet — ${dsState.declinationsOnFile}/${dsState.requiredDeclinations}`
                            : "Status unknown"}
                        </Chip>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <div className="mb-2 text-xs font-medium">Why this ranking</div>
        <div className="space-y-2 text-sm">
          <Consistency
            label="Class fit"
            ok
            detail="Cold storage / refrigerated warehousing is an actively sought class for the top 2 carriers"
          />
          <Consistency
            label="Capacity fit"
            ok
            detail="$42.8M TIV sits well inside Kinsale's $50M treaty and James River's combined $50M layer"
          />
          <Consistency
            label="Loss history"
            ok
            detail="38% 5yr loss ratio clears every panel carrier's threshold"
          />
          <Consistency
            label="Missing info"
            warn
            detail="James River and Ategrity need supplemental docs before they'll firm a quote — routed to Package Assembly"
          />
          <Consistency
            label="Palomar Specialty"
            detail="Class-excluded per their current appetite profile — excluded automatically, not scored"
          />
        </div>
      </div>
    </div>
  );
}

function MatchRulesTab({ insured, state }: { insured: string; state: string }) {
  const [carrier, setCarrier] = useState(submissionMarkets[0].carrier);
  const m = submissionMarkets.find((x) => x.carrier === carrier)!;
  const dsRecord = diligentSearch.find((d) => d.insured === insured);
  const dsState = dsRecord?.states.find((s) => s.state === state);
  const hardPassed = m.hardExclusions.every((h) => h.pass);
  const scoreSum = m.softScoreFactors.reduce((sum, f) => sum + f.points, 0);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-medium">Matching engine · 3 passes, per carrier</div>
        <FoundationBadge kind="matching" />
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {submissionMarkets.map((mk) => (
          <button
            key={mk.carrier}
            onClick={() => setCarrier(mk.carrier)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              carrier === mk.carrier
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background hover:bg-secondary"
            }`}
          >
            {mk.carrier}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Pass A · Hard exclusion — class code, state licensing, premium band
          </div>
          <ul className="divide-y divide-border rounded-lg border border-border">
            {m.hardExclusions.map((h) => (
              <li key={h.label} className="flex items-start gap-3 p-3 text-sm">
                {h.pass ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                )}
                <div className="flex-1">
                  <div className="font-medium">{h.label}</div>
                  <div className="text-[11px] text-muted-foreground">{h.detail}</div>
                </div>
                <Chip tone={h.pass ? "success" : "danger"}>{h.pass ? "Pass" : "Excluded"}</Chip>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Pass B · Soft scoring — severity margin, completeness, hit rate, appetite confidence
          </div>
          {!hardPassed ? (
            <div className="flex items-start gap-2 rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              Not run — {m.carrier} was excluded at the hard-exclusion pass above, so soft scoring
              never started.
            </div>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {m.softScoreFactors.map((f) => (
                <li key={f.label} className="flex items-start gap-3 p-3 text-sm">
                  <div className="flex-1">
                    <div className="font-medium">{f.label}</div>
                    <div className="text-[11px] text-muted-foreground">{f.detail}</div>
                  </div>
                  <span className="font-mono text-xs text-success">+{f.points}</span>
                </li>
              ))}
              <li className="flex items-center justify-between p-3 text-sm">
                <span className="font-medium">Fit score</span>
                <span className="font-mono text-sm">
                  {scoreSum} <span className="text-muted-foreground">= {m.score}</span>
                </span>
              </li>
            </ul>
          )}
        </div>

        <div>
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Pass C · Diligent-search flag (MM-07) — independent of ranking outcome
          </div>
          {!m.diligentSearchRequired ? (
            <div className="rounded-lg border border-border p-3 text-sm text-muted-foreground">
              Not required for this carrier's paper.
            </div>
          ) : dsState?.evidenceSufficient || dsState?.status === "Exempt" ? (
            <div className="flex items-start gap-2 rounded-lg border border-success/30 bg-success/5 p-3 text-sm text-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <div>
                {dsState.status === "Exempt"
                  ? "Exempt for this state/class."
                  : `Satisfied — ${dsState.declinationsOnFile}/${dsState.requiredDeclinations} declinations on file with sufficient evidence.`}
                <div className="mt-1 text-[11px] text-muted-foreground">
                  This is checked independently and does not affect the fit score above — a carrier
                  can be a strong fit while diligent search is still pending.
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-lg border border-warn/30 bg-warn/5 p-3 text-sm text-foreground">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
              <div>
                {dsState
                  ? `Not yet satisfied — ${dsState.declinationsOnFile}/${dsState.requiredDeclinations} declinations on file.`
                  : "Status unknown."}
                <div className="mt-1 text-[11px] text-muted-foreground">
                  This is checked independently and does not affect the fit score above.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MatchRecommendationTab({
  selected,
  onToggle,
  onLog,
}: {
  selected: string[];
  onToggle: (carrier: string) => void;
  onLog: (who: string, what: string, ctx: string, conf?: string) => void;
}) {
  const [overrideCarrier, setOverrideCarrier] = useState("");
  const [overrideNote, setOverrideNote] = useState("");
  const [overrideConfirmed, setOverrideConfirmed] = useState(false);
  const overridable = submissionMarkets.filter((m) => m.fit !== "Out of appetite");

  function confirmOverride() {
    if (!overrideCarrier || !overrideNote.trim()) return;
    if (!selected.includes(overrideCarrier)) onToggle(overrideCarrier);
    onLog(
      "Sam D. (Broker)",
      `Override — selected ${overrideCarrier} ahead of the AI ranking`,
      `Rationale: "${overrideNote.trim()}"`,
    );
    setOverrideConfirmed(true);
    setOverrideCarrier("");
    setOverrideNote("");
    setTimeout(() => setOverrideConfirmed(false), 2500);
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border-2 border-success/40 bg-success/5 p-4 md:col-span-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <div className="font-serif text-xl">Proceed to market</div>
          <Chip tone="success">94% confidence</Chip>
        </div>
        <p className="mt-3 text-sm text-foreground">
          Palmetto Cold Storage is a well-protected FL warehousing risk with a clean 5-year loss
          history (38% LR), 92% sprinklered TIV, and revenue growth of 11% CAGR. Four of five panel
          carriers are in appetite; Kinsale Insurance is the strongest fit with no outstanding
          missing info. Recommend packaging for Kinsale, James River, and Ategrity in parallel to
          maximize competitive tension.
        </p>
        <div className="mt-4 grid gap-2 text-xs text-muted-foreground">
          <div>
            <b className="text-foreground">Suggested package priority:</b> Kinsale Insurance (ready
            now) → James River Insurance (needs sprinkler inspection) → Ategrity Specialty (needs
            loss run addendum + monitoring cert).
          </div>
          <div>
            <b className="text-foreground">Suggested subjectivities to pre-empt:</b> updated
            sprinkler inspection, confirmation of continuous refrigeration monitoring.
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-dashed border-border bg-background p-3">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Override ranking — broker judgment overrules the AI
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Select any carrier from the panel, including one the AI ranked lower, and explain why.
            This adds the carrier to your packaging selection and is written to the activity log.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <select
              value={overrideCarrier}
              onChange={(e) => setOverrideCarrier(e.target.value)}
              className="rounded-lg border border-border bg-background p-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-56"
            >
              <option value="">Select a carrier…</option>
              {overridable.map((m) => (
                <option key={m.carrier} value={m.carrier}>
                  {m.carrier} · fit {m.score}
                </option>
              ))}
            </select>
            <textarea
              value={overrideNote}
              onChange={(e) => setOverrideNote(e.target.value)}
              placeholder="Required — why override the AI ranking? (e.g. broker relationship, capacity need, timing)"
              rows={1}
              className="flex-1 resize-none rounded-lg border border-border bg-background p-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Button
              variant="secondary"
              disabled={!overrideCarrier || !overrideNote.trim()}
              title={
                !overrideCarrier || !overrideNote.trim()
                  ? "Select a carrier and add a rationale note first"
                  : undefined
              }
              onClick={confirmOverride}
            >
              Confirm override
            </Button>
            {overrideConfirmed && (
              <span className="inline-flex items-center gap-1 text-[11px] text-success">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Logged to Activity
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-border p-4">
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Broker decision
        </div>
        <div className="mt-3 space-y-2 text-sm">
          <Button
            variant="primary"
            className="w-full justify-center"
            onClick={() =>
              onLog(
                "Sam D. (Broker)",
                "Approved AI recommendation — proceed to market",
                "SUB-24019 · Palmetto Cold Storage",
              )
            }
          >
            Approve recommendation
          </Button>
          <Button
            variant="secondary"
            className="w-full justify-center"
            onClick={() =>
              onLog(
                "Sam D. (Broker)",
                "Requested changes to carrier selection",
                "SUB-24019 · Palmetto Cold Storage",
              )
            }
          >
            Modify carrier selection
          </Button>
          <Button
            variant="secondary"
            className="w-full justify-center"
            onClick={() =>
              onLog("Sam D. (Broker)", "Sent to peer review", "SUB-24019 · Palmetto Cold Storage")
            }
          >
            Send to peer review
          </Button>
          <Button
            variant="danger"
            className="w-full justify-center"
            onClick={() =>
              onLog("Sam D. (Broker)", "Override — no market", "SUB-24019 · Palmetto Cold Storage")
            }
          >
            Override — no market
          </Button>
        </div>
        <div className="mt-4 text-[11px] text-muted-foreground">
          Every decision, including overrides, is written to the audit log with a rationale prompt.
        </div>
      </div>
    </div>
  );
}

function ActivityTab({
  log,
  onLog,
  submission,
}: {
  log: LogEntry[];
  onLog: (who: string, what: string, ctx: string, conf?: string) => void;
  submission: Submission;
}) {
  const [outcomeLogged, setOutcomeLogged] = useState(false);

  function recordOutcome(outcome: "Quoted" | "Bound" | "Declined") {
    onLog(
      "Sam D. (Broker)",
      `Recorded eventual outcome — ${outcome}`,
      `${submission.id} · ${submission.topMarket}`,
    );
    setOutcomeLogged(true);
    setTimeout(() => setOutcomeLogged(false), 2500);
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-dashed border-border bg-secondary/30 p-3">
        <div className="text-[11px] text-muted-foreground">
          Record the eventual outcome once it's known, so it's on the record alongside the shortlist
          and the broker's selection.
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="secondary"
            className="!py-1 !text-xs"
            onClick={() => recordOutcome("Quoted")}
          >
            Quoted
          </Button>
          <Button
            variant="secondary"
            className="!py-1 !text-xs"
            onClick={() => recordOutcome("Bound")}
          >
            Bound
          </Button>
          <Button
            variant="secondary"
            className="!py-1 !text-xs"
            onClick={() => recordOutcome("Declined")}
          >
            Declined
          </Button>
          {outcomeLogged && <CheckCircle2 className="h-4 w-4 text-success" />}
        </div>
      </div>

      <ul className="divide-y divide-border">
        {log.slice(0, 10).map((d, i) => (
          <li key={i} className="flex items-start gap-3 py-3 text-sm">
            <span className="font-mono text-xs text-muted-foreground">{d.at}</span>
            <div className="flex-1">
              <div>
                <b>{d.who}</b> — {d.what}
              </div>
              <div className="text-[11px] text-muted-foreground">{d.ctx}</div>
            </div>
            {d.conf !== "—" && <Chip tone="neutral">{d.conf}</Chip>}
          </li>
        ))}
      </ul>
      <div className="mt-3 text-[10px] text-muted-foreground">
        This shortlist, selection, and outcome history is the foundation for Carrier Appetite
        Intelligence (roadmap workflow #7) — v1 doesn't act on it yet, it's only logged here.
      </div>
    </div>
  );
}

/* ============================================================
   2. Submission Package Assembly
   ============================================================ */

type PackageStatus = "READY" | "READY_WITH_GAP" | "BLOCKED";

type LogEntry = { at: string; who: string; what: string; ctx: string; conf: string };

// Shared fields with a direct extracted source — PA-02 auto-fills these and cites
// the source document. Illustrative example data (Palmetto Cold Storage LLC).
const BASE_SUPPLEMENTAL_FIELDS: { label: string; value: string; doc: string; page: number }[] = [
  {
    label: "Named insured",
    value: "Palmetto Cold Storage LLC",
    doc: "ACORD_125_Palmetto.pdf",
    page: 1,
  },
  { label: "FEIN", value: "58-1298347", doc: "ACORD_125_Palmetto.pdf", page: 1 },
  {
    label: "Mailing address",
    value: "4210 Warehouse Rd, Jacksonville FL 32218",
    doc: "ACORD_125_Palmetto.pdf",
    page: 1,
  },
  {
    label: "Requested effective date",
    value: "02/12/2026",
    doc: "ACORD_125_Palmetto.pdf",
    page: 2,
  },
  {
    label: "TIV / locations",
    value: "$42.8M across 14 locations",
    doc: "Palmetto_SOV_2026.xlsx",
    page: 1,
  },
  { label: "Sprinklered %", value: "92%", doc: "Palmetto_SOV_2026.xlsx", page: 1 },
  {
    label: "Prior carrier / premium",
    value: "Kinsale Insurance · $168,900",
    doc: "ACORD_140_Palmetto.pdf",
    page: 2,
  },
  { label: "5yr loss ratio", value: "38%", doc: "Loss_Run_5yr.pdf", page: 4 },
];

// Carrier-specific fields with no extracted source — PA-02 leaves these for manual entry.
const CARRIER_MANUAL_FIELDS: Record<string, { label: string; placeholder: string }[]> = {
  "Kinsale Insurance": [
    {
      label: "Refrigeration monitoring vendor & install date",
      placeholder: "e.g. ColdChain Sensors, installed 01/2025",
    },
  ],
  "James River Insurance": [
    {
      label: "Sprinkler inspection date & inspector",
      placeholder: "Pending — inspection not yet scheduled",
    },
  ],
  "Ategrity Specialty": [
    { label: "Loss-run addendum reference #", placeholder: "e.g. LR-ADD-2026-0142" },
    { label: "Refrigeration monitoring cert #", placeholder: "e.g. RMC-88214" },
  ],
  Markel: [{ label: "Countersignature date", placeholder: "Pending broker countersignature" }],
};

// PA-05: one deliberate format mismatch (Ategrity) so the warn state is real, not theoretical.
const FORMAT_ISSUES: Record<string, string | null> = {
  "Kinsale Insurance": null,
  "James River Insurance": null,
  "Ategrity Specialty":
    "Loss run currently on file as a raw PDF export — Ategrity requires their carrier-formatted loss run before they'll accept the package.",
  Markel: null,
};

function buildCoverLetter(market: Market, submission: Submission): string {
  const outstanding = market.missingInfo;
  const statusLine =
    outstanding.length > 0
      ? `Still finalizing ${outstanding.join(" and ")} — will follow up the moment ${outstanding.length > 1 ? "they're" : "it's"} in hand.`
      : "Full package attached, nothing outstanding on our end.";
  return `Hi team — submitting ${submission.insured} (${submission.state}) for your review. ${submission.tiv} TIV, ${submission.industry.toLowerCase()}. ${market.appetiteNotes} ${statusLine} Requested effective date ${submission.effective} — happy to jump on a call this week.`;
}

function buildInitialLog(carrierNames: string[], submission: Submission): LogEntry[] {
  const now = new Date();
  return carrierNames.map((carrier, i) => ({
    at: new Date(now.getTime() - i * 60_000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    who: "AI (Matching/Ranking Core)",
    what: "Package generated — PA-01 through PA-06 run",
    ctx: `${carrier} · ${submission.id}`,
    conf: "—",
  }));
}

function PackageStatusBadge({ status }: { status: PackageStatus }) {
  const map = {
    READY: { label: "Ready to send", tone: "success" as const, Icon: CheckCircle2 },
    READY_WITH_GAP: { label: "Ready with gap", tone: "warn" as const, Icon: AlertTriangle },
    BLOCKED: { label: "Blocked", tone: "danger" as const, Icon: XCircle },
  };
  const { label, tone, Icon } = map[status];
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
  market,
  submission,
  onLog,
}: {
  market: Market;
  submission: Submission;
  onLog: (who: string, what: string, ctx: string) => void;
}) {
  const [receivedDocs, setReceivedDocs] = useState<Set<string>>(new Set());
  const [manualValues, setManualValues] = useState<Record<string, string>>({});
  const [coverLetter, setCoverLetter] = useState(() => buildCoverLetter(market, submission));
  const [regenerating, setRegenerating] = useState(false);
  const [regenError, setRegenError] = useState("");
  const [sentAt, setSentAt] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [lastLoggedLetter, setLastLoggedLetter] = useState(() =>
    buildCoverLetter(market, submission),
  );
  const [outcome, setOutcome] = useState<"Quoted" | "Bound" | "Declined" | null>(null);

  const outstandingDocs = market.missingInfo.filter((d) => !receivedDocs.has(d));
  const manualFields = CARRIER_MANUAL_FIELDS[market.carrier] ?? [];
  const unfilledFields = manualFields.filter((f) => !manualValues[f.label]?.trim());
  const dsRecord = diligentSearch.find((d) => d.insured === submission.insured);
  const dsState = dsRecord?.states.find((s) => s.state === submission.state);
  const dsSatisfied = dsState ? dsState.evidenceSufficient || dsState.status === "Exempt" : false;
  const formatIssue = FORMAT_ISSUES[market.carrier] ?? null;

  const status: PackageStatus =
    outstandingDocs.length > 0 || (market.diligentSearchRequired && !dsSatisfied)
      ? "BLOCKED"
      : unfilledFields.length > 0 || formatIssue
        ? "READY_WITH_GAP"
        : "READY";

  function markReceived(doc: string) {
    setReceivedDocs((prev) => new Set(prev).add(doc));
    onLog("Sam D. (Broker)", `Marked "${doc}" as received`, `${market.carrier} package`);
  }

  function handleLetterBlur() {
    if (coverLetter !== lastLoggedLetter) {
      onLog("Sam D. (Broker)", "Edited cover letter", `${market.carrier} package`);
      setLastLoggedLetter(coverLetter);
      setConfirmed(false);
    }
  }

  function confirmContents() {
    setConfirmed(true);
    onLog("Sam D. (Broker)", "Confirmed package contents", `${market.carrier} package`);
  }

  function recordOutcome(next: "Quoted" | "Bound" | "Declined") {
    setOutcome(next);
    onLog("Sam D. (Broker)", `Recorded eventual outcome — ${next}`, `${market.carrier} package`);
  }

  async function regenerate() {
    setRegenerating(true);
    setRegenError("");
    try {
      // TODO: replace with a real drafting call once Package Assembly has a backend —
      // this only re-runs the same local template, it doesn't call an LLM.
      const next = await simulateRequest(buildCoverLetter(market, submission));
      setCoverLetter(next);
      setLastLoggedLetter(next);
      setConfirmed(false);
      onLog("AI (Matching/Ranking Core)", "Cover letter regenerated", `${market.carrier} package`);
    } catch (err) {
      setRegenError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setRegenerating(false);
    }
  }

  function copyCoverLetter() {
    navigator.clipboard
      .writeText(coverLetter)
      .then(() => toast.success("Cover letter copied"))
      .catch(() => toast.error("Couldn't copy — select the text and copy manually."));
  }

  function markSent() {
    const stamp = new Date().toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setSentAt(stamp);
    onLog("Sam D. (Broker)", "Marked package as sent", `${market.carrier} package`);
  }

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl">{market.carrier}</h3>
            <PackageStatusBadge status={status} />
          </div>
          <p className="mt-1 max-w-xl text-[12px] text-muted-foreground">{market.appetiteNotes}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
            <span>Capacity: {market.capacity}</span>
            <span>Turnaround: {market.turnaround}</span>
          </div>
        </div>
        <FoundationBadge kind="matching" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* PA-01 / PA-03 */}
        <div>
          <div className="mb-2 text-xs font-medium">Document completeness · PA-01</div>
          <ul className="divide-y divide-border rounded-lg border border-border text-sm">
            {market.requirements.map((doc) => {
              const missing = outstandingDocs.includes(doc);
              return (
                <li key={doc} className="flex items-center gap-3 p-3">
                  {missing ? (
                    <AlertTriangle className="h-4 w-4 shrink-0 text-warn" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  )}
                  <span className="flex-1">{doc}</span>
                  {missing ? (
                    <Button
                      variant="secondary"
                      className="!py-1 !text-xs"
                      onClick={() => markReceived(doc)}
                    >
                      Mark as received
                    </Button>
                  ) : (
                    <Chip tone="success">On file</Chip>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-4 mb-2 flex items-center gap-2 text-xs font-medium">
            Format &amp; version compliance · PA-05
          </div>
          {formatIssue ? (
            <div className="flex items-start gap-2 rounded-lg border border-warn/30 bg-warn/5 p-3 text-[12px] text-foreground">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
              {formatIssue}
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-lg border border-success/30 bg-success/5 p-3 text-[12px] text-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              Matches stated preference: {market.formatPreference}
            </div>
          )}

          <div className="mt-4 mb-2 text-xs font-medium">Diligent search · PA-06</div>
          {!market.diligentSearchRequired ? (
            <div className="rounded-lg border border-border p-3 text-[12px] text-muted-foreground">
              Not required for this carrier's paper.
            </div>
          ) : dsSatisfied ? (
            <div className="flex items-start gap-2 rounded-lg border border-success/30 bg-success/5 p-3 text-[12px] text-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              Attached — {dsState?.declinationsOnFile}/{dsState?.requiredDeclinations} declinations
              on file, evidence sufficient.
            </div>
          ) : (
            <div className="flex items-start justify-between gap-2 rounded-lg border border-warn/30 bg-warn/5 p-3 text-[12px] text-foreground">
              <span className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
                Not attached — {dsState?.declinationsOnFile ?? 0}/
                {dsState?.requiredDeclinations ?? "?"} declinations on file.
              </span>
              <Link
                to="/app/workflows/$slug"
                params={{ slug: "diligent-search" }}
                className="shrink-0 whitespace-nowrap text-accent underline-offset-2 hover:underline"
              >
                Complete in Diligent Search →
              </Link>
            </div>
          )}
        </div>

        {/* PA-02 */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-medium">Supplemental form · PA-02</div>
            <span className="rounded-full border border-border px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
              Illustrative
            </span>
          </div>
          <div className="grid gap-3 rounded-lg border border-border p-4 text-sm sm:grid-cols-2">
            {BASE_SUPPLEMENTAL_FIELDS.map((f) => (
              <div key={f.label}>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {f.label}
                </div>
                <SourceCitation doc={f.doc} page={f.page}>
                  {f.value}
                </SourceCitation>
              </div>
            ))}
            {manualFields.map((f) => (
              <div key={f.label}>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {f.label} <span className="text-warn">· manual</span>
                </div>
                <input
                  value={manualValues[f.label] ?? ""}
                  onChange={(e) =>
                    setManualValues((prev) => ({ ...prev, [f.label]: e.target.value }))
                  }
                  onBlur={() =>
                    manualValues[f.label]?.trim() &&
                    onLog("Sam D. (Broker)", `Filled "${f.label}"`, `${market.carrier} package`)
                  }
                  placeholder={f.placeholder}
                  className="w-full rounded border border-dashed border-warn/40 bg-background px-1.5 py-0.5 text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            ))}
          </div>
          <div className="mt-1 text-[10px] text-muted-foreground">
            Highlighted fields are auto-filled and cited to source — click one to jump to it. Dashed
            fields have no extracted source and need your input.
          </div>
        </div>
      </div>

      {/* PA-04 */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs font-medium">Cover letter draft · PA-04</div>
          <span className="rounded-full border border-border px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
            Illustrative
          </span>
        </div>
        <textarea
          rows={4}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          onBlur={handleLetterBlur}
          className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        {regenError && (
          <div
            role="alert"
            className="mt-2 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-[12px] text-destructive"
          >
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            {regenError}
          </div>
        )}
        <div className="mt-2 flex justify-end gap-2">
          <Button variant="ghost" onClick={regenerate} disabled={regenerating}>
            {regenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {regenerating ? "Regenerating…" : "Regenerate"}
          </Button>
        </div>
      </div>

      {/* Broker review: confirm contents (step 5) is distinct from send (step 6) */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-background p-3">
        <div className="text-[11px] text-muted-foreground">
          {confirmed ? (
            <span className="inline-flex items-center gap-1.5 text-success">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Package contents confirmed — ready to compile and send.
            </span>
          ) : (
            "Review the completeness checklist, fields, and cover letter above, then confirm before sending."
          )}
        </div>
        <Button
          variant={confirmed ? "secondary" : "primary"}
          disabled={status === "BLOCKED" || confirmed}
          title={status === "BLOCKED" ? "Resolve the blocked items above first" : undefined}
          onClick={confirmContents}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          {confirmed ? "Contents confirmed" : "Confirm package contents"}
        </Button>
      </div>

      {/* Send boundary — non-negotiable: assemble/draft only, broker sends manually */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-border bg-secondary/30 p-3">
        <div className="flex items-start gap-2 text-[11px] text-muted-foreground">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Coverline drafts and assembles — you send it, by email or {market.carrier}'s portal.
          Nothing here transmits automatically.
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={copyCoverLetter}>
            <Copy className="h-3.5 w-3.5" />
            Copy cover letter
          </Button>
          {sentAt ? (
            <Chip tone="success">
              <CheckCircle2 className="h-3 w-3" />
              Sent {sentAt}
            </Chip>
          ) : (
            <Button
              variant={confirmed ? "primary" : "secondary"}
              disabled={!confirmed}
              title={
                !confirmed
                  ? "Confirm package contents first"
                  : "You confirm this was sent — nothing sends automatically"
              }
              onClick={markSent}
            >
              <Clock className="h-3.5 w-3.5" />
              Mark as sent
            </Button>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border p-3 text-[11px]">
        <span className="text-muted-foreground">Record eventual outcome:</span>
        <Button
          variant="ghost"
          className="!py-1 !text-xs"
          disabled={!sentAt}
          onClick={() => recordOutcome("Quoted")}
        >
          Quoted
        </Button>
        <Button
          variant="ghost"
          className="!py-1 !text-xs"
          disabled={!sentAt}
          onClick={() => recordOutcome("Bound")}
        >
          Bound
        </Button>
        <Button
          variant="ghost"
          className="!py-1 !text-xs"
          disabled={!sentAt}
          onClick={() => recordOutcome("Declined")}
        >
          Declined
        </Button>
        {!sentAt && <span className="text-muted-foreground">(available once marked as sent)</span>}
        {outcome && <Chip tone={outcome === "Declined" ? "danger" : "success"}>{outcome}</Chip>}
      </div>
    </Panel>
  );
}

export function PackageAssembly({ search = {} }: { search?: Record<string, unknown> }) {
  const navigate = useNavigate();
  const goToMatching = () =>
    navigate({ to: "/app/workflows/$slug", params: { slug: "submission-matching" } });
  const submissionId = typeof search.submissionId === "string" ? search.submissionId : undefined;
  const submission = submissions.find((s) => s.id === submissionId) ?? submissions[0];

  const rawCarriers = typeof search.carriers === "string" ? search.carriers : undefined;
  const carrierNames =
    rawCarriers === undefined ? RECOMMENDED_CARRIERS : rawCarriers.split(",").filter(Boolean);
  const markets = carrierNames
    .map((name) => submissionMarkets.find((m) => m.carrier === name))
    .filter((m): m is Market => Boolean(m));

  const [loading, setLoading] = useState(true);
  const [log, setLog] = useState<LogEntry[]>(() => buildInitialLog(carrierNames, submission));

  // Simulated "running PA-01…PA-06" pass — mirrors the ProcessAnim convention used
  // elsewhere in the app, and gives this page a real (if brief) loading state.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(t);
  }, [submissionId, rawCarriers]);

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

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        eyebrow="Workflow 02"
        title="Submission Package Assembly"
        description="Turn a carrier selection from Market Matching into carrier-specific packages — completeness check, bounded auto-fill, and a drafted cover letter, reviewed and sent independently per carrier."
        actions={
          <Button variant="secondary" onClick={goToMatching}>
            ← Back to Market Matching
          </Button>
        }
      />

      <div className="mb-5">
        <ProcessAnim
          steps={[
            {
              label: `Carrier selection received from Market Matching · ${markets.length} carrier${markets.length === 1 ? "" : "s"}`,
              kind: "matching",
            },
            {
              label: "Document completeness checked independently per carrier (PA-01)",
              kind: "extraction",
            },
            {
              label:
                "Supplemental forms auto-filled — extracted fields only, nothing invented (PA-02)",
              kind: "extraction",
            },
            {
              label:
                "Cover letter drafted per carrier, tailored to appetite + risk profile (PA-04)",
              kind: "matching",
            },
          ]}
        />
      </div>

      {markets.length === 0 ? (
        <Panel>
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-secondary">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="font-serif text-lg">No carriers selected</div>
            <p className="max-w-md text-sm text-muted-foreground">
              Package Assembly needs at least one carrier from Market Matching. Go back and select
              the carriers you want to package for.
            </p>
            <Button variant="primary" onClick={goToMatching}>
              Go to Market Matching <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Panel>
      ) : loading ? (
        <div className="space-y-4">
          {markets.map((m) => (
            <Panel key={m.carrier}>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl">{m.carrier}</h3>
                <Chip>Received</Chip>
              </div>
              <p className="mt-1 max-w-xl text-[12px] text-muted-foreground">{m.appetiteNotes}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                <span>{m.requirements.length} requirements on record</span>
                <span>
                  Diligent search:{" "}
                  {m.diligentSearchRequired ? "required for this paper" : "not required"}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3 border-t border-border pt-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Running PA-01 through PA-06 for {m.carrier}…
              </div>
            </Panel>
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {markets.map((m) => (
            <CarrierPackageCard
              key={m.carrier}
              market={m}
              submission={submission}
              onLog={appendLog}
            />
          ))}
        </div>
      )}

      <div className="mt-6">
        <Panel
          title="Activity"
          subtitle="Package status at generation, broker edits, and outcomes — logged per carrier"
          actions={<FoundationBadge kind="matching" />}
        >
          <ul className="divide-y divide-border">
            {log.slice(0, 8).map((d, i) => (
              <li key={i} className="flex items-start gap-3 py-3 text-sm">
                <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">{d.at}</span>
                <div className="flex-1">
                  <div>
                    <b>{d.who}</b> — {d.what}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{d.ctx}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-[10px] text-muted-foreground">
            Session-only for this prototype — not yet persisted to the shared Feedback/Eval store.
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ============================================================
   3. Retail Agent Communication Copilot
   ============================================================ */

type Trigger = { source: string; detail: string };
type FollowUpConfig = { carrier: string; window: string; elapsed: boolean };

const copilotThreads: {
  id: number;
  agent: string;
  agency: string;
  subject: string;
  unread: boolean;
  snippet: string;
  when: string;
  tenureYears: number;
  trigger: Trigger;
  groundedIn?: { doc: string; page: number };
  followUp?: FollowUpConfig;
}[] = [
  {
    id: 1,
    agent: "Ana Ruiz",
    agency: "Marsh Southeast",
    subject: "Palmetto Cold Storage — market Q&A",
    unread: true,
    snippet: "Confirming spoilage sub-limit at $500k…",
    when: "8:42 AM",
    tenureYears: 4,
    trigger: {
      source: "Market Matching",
      detail: "Carrier panel ranked · Kinsale Insurance #1 fit, 4 of 5 carriers in appetite",
    },
    groundedIn: { doc: "Palmetto_SOV_2026.xlsx", page: 1 },
  },
  {
    id: 2,
    agent: "Michael Chen",
    agency: "HUB International",
    subject: "Ridgeline Contractors — missing SOV",
    unread: true,
    snippet: "Attached is the schedule you requested…",
    when: "8:11 AM",
    tenureYears: 2,
    trigger: {
      source: "Market Matching",
      detail: "Per-carrier missing-info identified — SOV and 5-yr loss run outstanding for Markel",
    },
    groundedIn: { doc: "ACORD_125_Palmetto.pdf", page: 1 },
    followUp: { carrier: "Markel", window: "10+ business days", elapsed: true },
  },
  {
    id: 3,
    agent: "Priya Natarajan",
    agency: "Alliant Insurance",
    subject: "Bayou Marine — placement update",
    unread: false,
    snippet: "Any early read on markets?…",
    when: "Yesterday",
    tenureYears: 6,
    trigger: {
      source: "Market Matching",
      detail: "Carrier panel ranking in progress — no shortlist finalized yet",
    },
    followUp: { carrier: "Argo Group", window: "5–7 business days", elapsed: false },
  },
  {
    id: 4,
    agent: "Jordan Blake",
    agency: "Gallagher",
    subject: "Highline Hospitality — no-market notice",
    unread: false,
    snippet: "Understood, thanks for the quick turn…",
    when: "Jan 09",
    tenureYears: 3,
    trigger: {
      source: "Market Matching",
      detail: "Zero-match result — 0 of 5 panel carriers in appetite for this exposure",
    },
  },
];

const initialCopilotDrafts = [
  {
    id: "d1",
    title: "Quote summary",
    tone: "Warm",
    body: "Hi Ana, great news on Palmetto Cold Storage — Kinsale Insurance has come back with indicated terms of $187,400, including the $500k spoilage sub-limit you asked about. Two more markets are still reviewing. Happy to walk through it on a call.",
  },
  {
    id: "d2",
    title: "Missing info request",
    tone: "Direct",
    body: "Hi Michael, to keep Ridgeline Contractors moving with our panel we still need a current SOV and 5-year loss run. Would you be able to send those today so we can get markets responding by Wednesday?",
  },
  {
    id: "d3",
    title: "No-market notice",
    tone: "Considerate",
    body: "Hi Jordan, thanks for thinking of us on Highline Hospitality. After running it across our panel, this one falls outside every carrier's current appetite for the liquor liability exposure — we'd love to see the rest of your submissions this quarter.",
    noMarketRule: true,
  },
];

const TRIGGER_SOURCE_LABEL: Record<string, string> = {
  "quote-summary": "Quote Comparison",
  "placement-confirmation": "Binder & Policy Issuance — Placement Confirmation",
  "policy-docs-delivered": "Binder & Policy Issuance — Policy Documents Delivered",
  "endorsement-confirmed": "Endorsement / Mid-Term Change Processing",
};

export function RetailAgentCopilot({ search = {} }: { search?: Record<string, unknown> }) {
  // Handoff: Quote Comparison's "Present to retail agent" and Binder & Issuance's two
  // BI-06 triggers all navigate here with a real trigger, replacing the manual-log
  // fallback below for whichever thread matches the insured.
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
        }
      : null;

  const matchedThreadId =
    externalTrigger &&
    (copilotThreads.find(
      (t) =>
        externalTrigger.insured &&
        t.subject.toLowerCase().includes(externalTrigger.insured.toLowerCase().split(" ")[0]),
    )?.id ??
      (externalTrigger.kind === "quote-summary" ? 4 : undefined));

  const [active, setActive] = useState(matchedThreadId ?? 1);
  const thread = copilotThreads.find((t) => t.id === active)!;
  const relationship = retailAgents.find((a) => a.agency === thread.agency);
  const isTriggeredThread = Boolean(externalTrigger) && active === matchedThreadId;
  const displayTrigger: Trigger =
    isTriggeredThread && externalTrigger
      ? {
          source: TRIGGER_SOURCE_LABEL[externalTrigger.kind],
          detail:
            externalTrigger.kind === "quote-summary"
              ? `Broker selected ${externalTrigger.carrier} to present — ${externalTrigger.premium}`
              : externalTrigger.kind === "placement-confirmation"
                ? `Clean bind confirmed with ${externalTrigger.carrier} — ${externalTrigger.premium}`
                : externalTrigger.kind === "policy-docs-delivered"
                  ? `Policy documents reconciled against bound terms and forwarded — ${externalTrigger.carrier}`
                  : `Endorsement confirmed and reconciled item by item — ${externalTrigger.carrier}`,
        }
      : thread.trigger;

  const [drafts, setDrafts] = useState(() => {
    if (!externalTrigger) return initialCopilotDrafts;
    if (externalTrigger.kind === "quote-summary") {
      return [
        {
          id: "triggered-quote",
          title: "Quote summary (from Quote Comparison)",
          tone: "Warm",
          body: `Hi Jordan, wanted to pass along that ${externalTrigger.carrier} came back with a quote at ${externalTrigger.premium} on Highline Hospitality. Happy to walk through terms whenever works for you.`,
        },
        ...initialCopilotDrafts,
      ];
    }
    if (externalTrigger.kind === "placement-confirmation") {
      return [
        {
          id: "triggered-placement",
          title: "Placement Confirmation (from Binder & Issuance)",
          tone: "Warm",
          body: `Hi team, confirming ${externalTrigger.insured || "the account"} is now bound with ${externalTrigger.carrier} at ${externalTrigger.premium}. Binder and full terms to follow shortly.`,
        },
        ...initialCopilotDrafts,
      ];
    }
    if (externalTrigger.kind === "policy-docs-delivered") {
      return [
        {
          id: "triggered-docs",
          title: "Policy Documents Delivered (from Binder & Issuance)",
          tone: "Warm",
          body: `Hi team, the issued policy for ${externalTrigger.insured || "the account"} has been reconciled against the bound terms and is attached. Let us know if you have any questions.`,
        },
        ...initialCopilotDrafts,
      ];
    }
    return [
      {
        id: "triggered-endorsement",
        title: "Endorsement Confirmed (from Endorsement Processing)",
        tone: "Warm",
        body: `Hi team, the mid-term change for ${externalTrigger.insured || "the account"} has been issued by ${externalTrigger.carrier} and reconciled item by item against your original request. Updated endorsement attached.`,
      },
      ...initialCopilotDrafts,
    ];
  });
  const [composeText, setComposeText] = useState(
    "Draft attached — please review and send when ready.",
  );
  const [composeBaseline, setComposeBaseline] = useState(
    "Draft attached — please review and send when ready.",
  );

  const [messages, setMessages] = useState([
    {
      id: "m1",
      body: "Thanks Ana — reviewing now, we're ranking it across our panel and should have indicated terms within the hour. Palmetto's loss history and sprinkler profile look strong across every carrier we'd send it to. We can confirm the $500k spoilage sub-limit is a standard ask.",
      sentAt: null as string | null,
      regenerating: false,
    },
    {
      id: "m2",
      body: "After — per our standard process we don't disclose the carrier name until you've confirmed broker of record on this account. Once that's on file we'll name Kinsale Insurance directly in the terms letter.",
      sentAt: null as string | null,
      regenerating: false,
    },
  ]);

  const [followUpSent, setFollowUpSent] = useState<Record<number, boolean>>({});
  const [manualTriggerOpen, setManualTriggerOpen] = useState(false);
  const [manualCarrier, setManualCarrier] = useState("");
  const [manualPremium, setManualPremium] = useState("");
  const [manualOutcome, setManualOutcome] = useState<"Quoted" | "Bound">("Quoted");

  const [log, setLog] = useState<LogEntry[]>(() => [
    {
      at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      who: "AI (Matching/Ranking Core)",
      what: `Draft generated — triggered by ${displayTrigger.source}`,
      ctx: `${thread.agent} · ${thread.subject}`,
      conf: "91%",
    },
  ]);

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

  function sendMessage(id: string) {
    const msg = messages.find((m) => m.id === id);
    if (!msg || msg.sentAt) return;
    const stamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, sentAt: stamp } : m)));
    appendLog(
      "Sam D. (Broker)",
      "Sent — broker-approved draft",
      `${thread.agent} · ${thread.subject}`,
    );
  }

  async function regenerateMessage(id: string) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, regenerating: true } : m)));
    try {
      const msg = messages.find((m) => m.id === id)!;
      const next = await simulateRequest(msg.body);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, body: next, regenerating: false } : m)),
      );
      appendLog(
        "AI (Matching/Ranking Core)",
        "Draft regenerated",
        `${thread.agent} · ${thread.subject}`,
      );
    } catch {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, regenerating: false } : m)));
      toast.error("Regeneration failed — try again.");
    }
  }

  function editMessage(id: string) {
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;
    setComposeText(msg.body);
    setComposeBaseline(msg.body);
    toast("Loaded into the reply box below for editing");
  }

  function applyDraft(id: string) {
    const d = drafts.find((x) => x.id === id);
    if (!d) return;
    setComposeText(d.body);
    setComposeBaseline(d.body);
    appendLog(
      "Sam D. (Broker)",
      `Selected "${d.title}" draft for this thread`,
      `${thread.agent} · ${thread.subject}`,
    );
  }

  function sendCompose() {
    const editDistance = Math.abs(composeText.length - composeBaseline.length);
    appendLog(
      "Sam D. (Broker)",
      editDistance === 0
        ? "Sent — no edits from AI draft"
        : `Sent — edited (${editDistance} characters different from AI draft)`,
      `${thread.agent} · ${thread.subject}`,
    );
    toast.success("Marked as sent");
    setComposeBaseline(composeText);
  }

  function generateFollowUp() {
    if (!thread.followUp || followUpSent[thread.id]) return;
    const stamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setDrafts((prev) => [
      {
        id: `followup-${thread.id}`,
        title: "No-response follow-up",
        tone: "Direct",
        body: `Hi ${thread.agent.split(" ")[0]}, following up on ${thread.subject.split(" — ")[0]} — haven't heard back from ${thread.followUp!.carrier} within their stated ${thread.followUp!.window} acceptance window. Wanted to check in before we nudge them directly.`,
      },
      ...prev,
    ]);
    setFollowUpSent((prev) => ({ ...prev, [thread.id]: true }));
    appendLog(
      "AI (Matching/Ranking Core)",
      `No-response follow-up generated (1 of 1 max) — ${thread.followUp.carrier}'s ${thread.followUp.window} window elapsed with no reply`,
      `${thread.agent} · ${thread.subject}`,
    );
    toast(`Follow-up drafted at ${stamp}`);
  }

  function logManualTrigger() {
    if (!manualCarrier.trim() || !manualPremium.trim()) return;
    const draftId = `manual-${Date.now() % 100000}`;
    setDrafts((prev) => [
      {
        id: draftId,
        title: "Quote summary",
        tone: "Warm",
        body: `Hi ${thread.agent.split(" ")[0]}, wanted to pass along that ${manualCarrier.trim()} came back ${manualOutcome === "Quoted" ? "with a quote" : "and bound"} at ${manualPremium.trim()} on ${thread.subject.split(" — ")[0]}. Happy to walk through terms whenever works for you.`,
      },
      ...prev,
    ]);
    appendLog(
      "Sam D. (Broker)",
      `Manually logged outcome — ${manualCarrier.trim()} ${manualOutcome.toLowerCase()} at ${manualPremium.trim()} (Quote Comparison not yet built — manual trigger)`,
      `${thread.agent} · ${thread.subject}`,
    );
    setManualCarrier("");
    setManualPremium("");
    setManualTriggerOpen(false);
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        eyebrow="Workflow 03"
        title="Retail Agent Communication Copilot"
        description="AI drafts every retail-agent-facing email — status update, missing-info request, no-market notice, quote summary — you approve before it sends."
        actions={
          <Button variant="primary">
            <MessageSquare className="h-4 w-4" />
            New email
          </Button>
        }
      />

      <div className="grid gap-0 overflow-hidden rounded-2xl border border-border bg-background lg:grid-cols-[280px_minmax(0,1fr)_340px]">
        {/* Threads */}
        <div className="border-r border-border">
          <div className="border-b border-border p-3">
            <SearchBar placeholder="Search retail agents…" />
          </div>
          <ul className="divide-y divide-border">
            {copilotThreads.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`flex w-full flex-col gap-1 p-3 text-left ${active === t.id ? "bg-secondary/60" : "hover:bg-secondary/30"}`}
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {t.agent} · {t.agency}
                  </span>
                  <span>{t.when}</span>
                </div>
                <div className={`text-sm ${t.unread ? "font-semibold" : ""}`}>{t.subject}</div>
                <div className="truncate text-[11px] text-muted-foreground">{t.snippet}</div>
              </button>
            ))}
          </ul>
        </div>

        {/* Conversation */}
        <div className="flex min-h-[520px] flex-col">
          <div className="border-b border-border p-4">
            <div className="text-xs text-muted-foreground">
              To: {thread.agent} &lt;{thread.agent.toLowerCase().replace(" ", ".")}@
              {thread.agency.toLowerCase().split(" ")[0]}.com&gt;
            </div>
            <div className="font-serif text-lg">{thread.subject}</div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px]">
              <Radar className="h-3 w-3 text-accent" />
              <span className="text-muted-foreground">Triggered by:</span>
              <span className="font-medium text-foreground">{displayTrigger.source}</span>
              <span className="text-muted-foreground">— {displayTrigger.detail}</span>
              {isTriggeredThread && (
                <Chip tone="accent">
                  <ArrowRight className="h-2.5 w-2.5" />
                  Linked from{" "}
                  {externalTrigger?.kind === "quote-summary"
                    ? "Quote Comparison"
                    : externalTrigger?.kind === "endorsement-confirmed"
                      ? "Endorsement Processing"
                      : "Binder & Issuance"}
                </Chip>
              )}
            </div>
          </div>

          {thread.followUp && (
            <div className="border-b border-border bg-secondary/30 p-3 text-[11px]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  No-response follow-up monitor · {thread.followUp.carrier}'s acceptance window:{" "}
                  {thread.followUp.window}
                </span>
                <Chip tone={thread.followUp.elapsed ? "warn" : "neutral"}>
                  {thread.followUp.elapsed
                    ? "Window elapsed — no reply"
                    : "Within window — waiting"}
                </Chip>
              </div>
              {!followUpSent[thread.id] ? (
                <Button
                  variant="secondary"
                  className="mt-2 !py-1 !text-xs"
                  disabled={!thread.followUp.elapsed}
                  title={
                    !thread.followUp.elapsed
                      ? "Still within the carrier's acceptance window"
                      : undefined
                  }
                  onClick={generateFollowUp}
                >
                  Generate follow-up (broker still approves — 1 max)
                </Button>
              ) : (
                <div className="mt-2 flex items-center gap-1.5 text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Follow-up generated — added to Suggested drafts
                </div>
              )}
            </div>
          )}

          <div className="flex-1 space-y-4 overflow-y-auto p-4 text-sm">
            <Bubble from="ana" name={thread.agent} at="8:12 AM">
              Hi team — sending over {thread.subject.split(" — ")[0]}. Any early read on this one?
            </Bubble>
            {messages.map((m, i) => (
              <Bubble
                key={m.id}
                from="you"
                name="Coverline AI · drafted"
                at={i === 0 ? "8:14 AM" : "8:42 AM"}
                ai
              >
                {m.body}
                {thread.groundedIn && (
                  <div className="mt-2">
                    <SourceCitation doc={thread.groundedIn.doc} page={thread.groundedIn.page}>
                      Grounded in {thread.groundedIn.doc} p.{thread.groundedIn.page} — no fabricated
                      specifics
                    </SourceCitation>
                  </div>
                )}
                {m.id === "m2" && (
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Lock className="h-3 w-3" /> Carrier-name disclosure gate —
                    compliance-controlled, cannot be bypassed from this draft.
                  </div>
                )}
                <div className="mt-2 flex items-center gap-2 text-xs">
                  {m.sentAt ? (
                    <Chip tone="success">
                      <CheckCircle2 className="h-3 w-3" />
                      Sent {m.sentAt}
                    </Chip>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        disabled={m.regenerating}
                        onClick={() => regenerateMessage(m.id)}
                      >
                        {m.regenerating ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          "Regenerate"
                        )}
                      </Button>
                      <Button variant="secondary" onClick={() => editMessage(m.id)}>
                        Edit
                      </Button>
                      <Button variant="primary" onClick={() => sendMessage(m.id)}>
                        Send <Send className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              </Bubble>
            ))}
          </div>
          <div className="border-t border-border p-3">
            <div className="rounded-xl border border-border bg-background p-2">
              <div className="mb-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                <FoundationBadge kind="extraction" />
                <span>·</span>
                <span>AI writer will cite the SOV and loss run in your reply</span>
              </div>
              <textarea
                rows={3}
                value={composeText}
                onChange={(e) => setComposeText(e.target.value)}
                className="w-full resize-none rounded bg-transparent p-2 text-sm outline-none"
              />
              <div className="flex items-center gap-2 border-t border-border pt-2">
                <Button variant="ghost">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost">
                  <Sparkles className="h-4 w-4" />
                  Improve
                </Button>
                <Button variant="ghost">Rewrite tone</Button>
                <div className="ml-auto">
                  <Button variant="primary" onClick={sendCompose}>
                    Send <Send className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Context + AI drafts */}
        <div className="space-y-5 border-l border-border p-4">
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Context behind this draft
            </div>
            <div className="space-y-2 rounded-lg border border-border p-3 text-[11px]">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium">{thread.agency}</span>
              </div>
              {relationship ? (
                <div className="text-muted-foreground">
                  Relationship: {thread.tenureYears} years · {relationship.submissions} submissions
                  · {relationship.bound} bound · {relationship.hitRate} hit rate · avg response{" "}
                  {relationship.avgResponseTime}
                </div>
              ) : (
                <div className="text-muted-foreground">
                  Relationship: {thread.tenureYears} years on file
                </div>
              )}
              <div className="text-muted-foreground">
                Thread history: {messages.length + 1} messages · last reply {thread.when}
              </div>
              {thread.followUp && (
                <div className="text-muted-foreground">
                  Carrier acceptance window: {thread.followUp.carrier} · {thread.followUp.window}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Suggested drafts
              </div>
              <FoundationBadge kind="matching" />
            </div>
            <div className="space-y-3">
              {drafts.map((d) => (
                <div key={d.id} className="rounded-lg border border-border p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{d.title}</div>
                    <Chip tone="accent">{d.tone}</Chip>
                  </div>
                  {d.noMarketRule && (
                    <div
                      className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground"
                      title="No carrier names disclosed in aggregate-framed no-market notices, pending compliance resolution"
                    >
                      <ShieldAlert className="h-3 w-3" />
                      Aggregate framing · Rule RA-TN-06 · pending compliance resolution
                    </div>
                  )}
                  <p className="mt-1.5 line-clamp-3 text-[11px] text-muted-foreground">{d.body}</p>
                  <div className="mt-2 flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      className="!py-1 !text-xs"
                      onClick={() => toast(d.title, { description: d.body })}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="secondary"
                      className="!py-1 !text-xs"
                      onClick={() => applyDraft(d.id)}
                    >
                      Use draft
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-dashed border-border p-3 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Manual fallback — use this when a quote/bind outcome didn't come through Quote
                Comparison automatically.
              </span>
              <Button
                variant="ghost"
                className="!py-1 !text-xs"
                onClick={() => setManualTriggerOpen((v) => !v)}
              >
                {manualTriggerOpen ? "Cancel" : "Log outcome"}
              </Button>
            </div>
            {manualTriggerOpen && (
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
                <Button
                  variant="primary"
                  className="w-full justify-center !py-1 !text-xs"
                  disabled={!manualCarrier.trim() || !manualPremium.trim()}
                  onClick={logManualTrigger}
                >
                  Log &amp; draft
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <Panel
          title="Activity"
          subtitle="Draft generated, broker edits, and send timestamps — same feedback-loop pattern as other workflows"
          actions={<FoundationBadge kind="matching" />}
        >
          <ul className="divide-y divide-border">
            {log.slice(0, 8).map((d, i) => (
              <li key={i} className="flex items-start gap-3 py-3 text-sm">
                <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">{d.at}</span>
                <div className="flex-1">
                  <div>
                    <b>{d.who}</b> — {d.what}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{d.ctx}</div>
                </div>
                {d.conf !== "—" && <Chip tone="neutral">{d.conf}</Chip>}
              </li>
            ))}
          </ul>
          <div className="mt-3 text-[10px] text-muted-foreground">
            Session-only for this prototype — feeds the same Feedback/Eval store pattern as other
            workflows, not yet persisted.
          </div>
        </Panel>
      </div>
    </div>
  );
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

function parsePremium(str: string): number | null {
  const n = Number(str.replace(/[^0-9.]/g, ""));
  return str === "—" || isNaN(n) ? null : n;
}

const MATERIALITY_RANK = { Standard: 0, Material: 1, "Deal-breaker": 2 } as const;

function ValidityChip({ dateStr }: { dateStr: string }) {
  const days = daysUntil(dateStr);
  if (days === null) return <span className="text-muted-foreground">—</span>;
  if (days < 0)
    return (
      <Chip tone="danger">
        <XCircle className="h-2.5 w-2.5" />
        Expired {Math.abs(days)}d ago
      </Chip>
    );
  if (days <= 3)
    return (
      <Chip tone="danger">
        <AlertTriangle className="h-2.5 w-2.5" />
        Expires in {days}d
      </Chip>
    );
  if (days <= 7)
    return (
      <Chip tone="warn">
        <Clock className="h-2.5 w-2.5" />
        Expires in {days}d
      </Chip>
    );
  return (
    <Chip tone="success">
      <Clock className="h-2.5 w-2.5" />
      Expires in {days}d
    </Chip>
  );
}

export function QuoteComparison() {
  const navigate = useNavigate();
  const responded = quotes.filter((q) => q.status !== "Declined").length;
  const liveQuotes = quotes.filter((q) => q.status !== "Declined");
  const declinedQuotes = quotes.filter((q) => q.status === "Declined");

  // QC-06: a genuine trade-off only exists if no quote dominates every other
  // quote on both premium and subjectivity burden. Computed, not defaulted —
  // if one quote is both cheaper and lower-materiality, that's a single clear
  // recommendation, not a multi-option choice.
  function dominates(a: (typeof quotes)[number], b: (typeof quotes)[number]) {
    const aPrem = parsePremium(a.premium);
    const bPrem = parsePremium(b.premium);
    if (aPrem === null || bPrem === null) return false;
    const aRank = MATERIALITY_RANK[a.materiality];
    const bRank = MATERIALITY_RANK[b.materiality];
    return aPrem <= bPrem && aRank <= bRank && (aPrem < bPrem || aRank < bRank);
  }
  const dominantQuote = liveQuotes.find((a) => liveQuotes.every((b) => a === b || dominates(a, b)));
  const outputMode: "single" | "tradeoff" =
    liveQuotes.length <= 1 || dominantQuote ? "single" : "tradeoff";
  const urgentQuotes = liveQuotes.filter((q) => {
    const d = daysUntil(q.validUntil);
    return d !== null && d <= 3;
  });

  const [log, setLog] = useState<LogEntry[]>(() => [
    {
      at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      who: "AI (Matching/Ranking Core)",
      what: `Comparison output produced — ${liveQuotes.length} quote${liveQuotes.length === 1 ? "" : "s"}, ${declinedQuotes.length} declination${declinedQuotes.length === 1 ? "" : "s"} · mode: ${outputMode === "single" ? "single primary recommendation" : "multi-option trade-off"}`,
      ctx: "SUB-24016 · Highline Hospitality Group",
      conf: "94%",
    },
  ]);
  const [bindOutcome, setBindOutcome] = useState<string | null>(null);

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

  function presentToAgent() {
    appendLog(
      "Sam D. (Broker)",
      "Presented James River Insurance to retail agent — handed off to Retail Agent Copilot",
      "SUB-24016 · Highline Hospitality Group",
    );
    navigate({
      to: "/app/workflows/$slug",
      params: { slug: "agent-copilot" },
      search: {
        trigger: "quote-summary",
        carrier: "James River Insurance",
        premium: "$421,000",
        submissionId: "SUB-24016",
      },
    });
  }

  function requestRevised() {
    appendLog(
      "Sam D. (Broker)",
      "Requested revised terms from carriers",
      "SUB-24016 · Highline Hospitality Group",
    );
    toast("Logged — following up with carriers is out of scope for automation in v1");
  }

  function declineAllRemarket() {
    appendLog(
      "Sam D. (Broker)",
      "Declined all quotes — remarketing",
      "SUB-24016 · Highline Hospitality Group",
    );
    toast("Logged — remarket via Market Matching or Renewal Remarketing");
  }

  function recordBindOutcome(outcome: "Bound" | "Lost to another market") {
    setBindOutcome(outcome);
    appendLog(
      "Sam D. (Broker)",
      `Recorded eventual outcome — ${outcome}`,
      "SUB-24016 · Highline Hospitality Group",
    );
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        eyebrow="Workflow 04"
        title="Quote Comparison & Recommendation"
        description="Carrier quote and declination emails ingested, terms normalized to one schema, subjectivities classified by materiality — with a drafted recommendation."
        actions={
          <Button variant="primary">
            <Send className="h-4 w-4" />
            Send comparison to agent
          </Button>
        }
      />

      <div className="mb-5">
        <ProcessAnim
          steps={[
            {
              label: "3 carrier response emails ingested · Highline Hospitality Group",
              kind: "extraction",
            },
            {
              label: "Premium, deductible, and limit terms normalized to one schema",
              kind: "extraction",
            },
            {
              label:
                "Subjectivities classified by materiality (Standard / Material / Deal-breaker)",
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
            { label: "Recommendation drafted — 94% confidence", kind: "matching" },
          ]}
        />
      </div>

      {urgentQuotes.length > 0 && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border-2 border-destructive/40 bg-destructive/5 p-3 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div>
            <b>Validity urgency (QC-07):</b> {urgentQuotes.map((q) => q.carrier).join(", ")}{" "}
            expiring within 3 days — this tracking runs on every quote regardless of whether a
            multi-quote comparison exists.
          </div>
        </div>
      )}

      <div
        className={`mb-5 rounded-xl border p-3 text-sm ${outputMode === "single" ? "border-success/30 bg-success/5" : "border-warn/30 bg-warn/5"}`}
      >
        <div className="flex items-center gap-2 font-medium">
          {outputMode === "single" ? (
            <CheckCircle2 className="h-4 w-4 text-success" />
          ) : (
            <Info className="h-4 w-4 text-warn" />
          )}
          Output mode (QC-06):{" "}
          {outputMode === "single" ? "Single primary recommendation" : "Multi-option trade-off"}
        </div>
        <p className="mt-1 text-[12px] text-muted-foreground">
          {outputMode === "single"
            ? `Computed, not defaulted — ${dominantQuote?.carrier} dominates on both premium and subjectivity burden (QC-01), so no genuine trade-off exists here.`
            : "Computed, not defaulted — no quote dominates on both premium and subjectivity burden, so this is presented as an explicit multi-option choice."}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <MetricTile
          label="Markets responded"
          value={`${responded} of ${quotes.length}`}
          sub="1 declined — Ategrity Specialty"
          tone="success"
        />
        <MetricTile label="Premium spread" value="$27,500" sub="$421,000 – $448,500" tone="warn" />
        <MetricTile
          label="Recommended carrier"
          value="James River"
          sub="Lowest premium, standard subjectivities only"
          tone="success"
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Panel
          title="Normalized quote comparison"
          subtitle="Highline Hospitality Group · SUB-24016"
          actions={<FoundationBadge kind="matching" />}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-2 text-left">Carrier</th>
                  <th className="py-2 text-right">Premium</th>
                  <th className="py-2 text-right">Deductible</th>
                  <th className="py-2 text-left pl-4">Limit</th>
                  <th className="py-2 text-left pl-4">Endorsements</th>
                  <th className="py-2 text-left pl-4">Effective</th>
                  <th className="py-2 text-left pl-4">Subjectivities</th>
                  <th className="py-2 text-left pl-4">Materiality</th>
                  <th className="py-2 text-left pl-4">Valid until</th>
                  <th className="py-2 text-left pl-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {quotes.map((q) => (
                  <tr key={q.carrier} className={q.status === "Declined" ? "opacity-50" : ""}>
                    <td className="py-2.5 font-medium">{q.carrier}</td>
                    <td className="py-2.5 text-right font-mono">{q.premium}</td>
                    <td className="py-2.5 text-right font-mono">{q.deductible}</td>
                    <td className="py-2.5 pl-4 text-xs">{q.limit}</td>
                    <td className="py-2.5 pl-4 text-xs text-muted-foreground">{q.endorsements}</td>
                    <td className="py-2.5 pl-4 text-xs">{q.effectiveDate}</td>
                    <td className="py-2.5 pl-4 text-xs text-muted-foreground">
                      {q.subjectivities.length ? q.subjectivities.join("; ") : "—"}
                    </td>
                    <td className="py-2.5 pl-4">
                      <Chip
                        tone={
                          q.materiality === "Deal-breaker"
                            ? "danger"
                            : q.materiality === "Material"
                              ? "warn"
                              : "success"
                        }
                      >
                        {q.materiality}
                      </Chip>
                    </td>
                    <td className="py-2.5 pl-4 text-xs">
                      <div>{q.validUntil}</div>
                      <ValidityChip dateStr={q.validUntil} />
                    </td>
                    <td className="py-2.5 pl-4">
                      <Chip
                        tone={
                          q.status === "Quoted"
                            ? "accent"
                            : q.status === "Bound"
                              ? "success"
                              : "danger"
                        }
                      >
                        {q.status}
                      </Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {declinedQuotes.length > 0 && (
            <div className="mt-5 border-t border-border pt-4">
              <div className="mb-2 text-xs font-medium">
                Declination detail · QC-03 (log only, no action in v1)
              </div>
              <ul className="space-y-2">
                {declinedQuotes.map((q) => (
                  <li key={q.carrier} className="rounded-lg border border-border p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{q.carrier}</span>
                      {q.appetiteConsistency && (
                        <Chip
                          tone={
                            q.appetiteConsistency.status === "Consistent"
                              ? "success"
                              : q.appetiteConsistency.status === "Inconsistent"
                                ? "warn"
                                : "neutral"
                          }
                        >
                          Appetite: {q.appetiteConsistency.status}
                        </Chip>
                      )}
                    </div>
                    <div className="mt-1 text-[12px] text-muted-foreground">
                      <b className="text-foreground">Stated reason:</b>{" "}
                      {q.declineReason ?? "No reason given in the decline email."}
                    </div>
                    {q.appetiteConsistency && (
                      <div className="mt-1 text-[12px] text-muted-foreground">
                        <b className="text-foreground">Consistency check:</b>{" "}
                        {q.appetiteConsistency.note}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Panel>

        <Panel title="AI recommendation">
          <div className="rounded-xl border-2 border-success/40 bg-success/5 p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <div className="font-serif text-lg">Present James River</div>
              <Chip tone="success">94%</Chip>
            </div>
            <p className="mt-2 text-sm">
              James River is $27,500 lower with only standard subjectivities (signed application,
              liquor license copy). Markel's price is close but adds two material subjectivities — a
              4-year loss run pull and a written security plan — that would add turnaround risk
              before the effective date.
            </p>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <Button variant="primary" className="w-full justify-center" onClick={presentToAgent}>
              Present to retail agent
            </Button>
            <Button variant="secondary" className="w-full justify-center" onClick={requestRevised}>
              Request revised terms
            </Button>
            <Button variant="danger" className="w-full justify-center" onClick={declineAllRemarket}>
              Decline all — remarket
            </Button>
          </div>
          <div className="mt-3 text-[10px] text-muted-foreground">
            "Present to retail agent" hands this off to the Retail Agent Copilot's Quote Summary
            draft —{" "}
            <Link
              to="/app/workflows/$slug"
              params={{ slug: "agent-copilot" }}
              className="text-accent underline-offset-2 hover:underline"
            >
              open Copilot →
            </Link>
          </div>
        </Panel>
      </div>

      <div className="mt-5">
        <Panel
          title="Activity"
          subtitle="Comparison output, broker selection, and eventual bind outcome — same feedback-loop pattern as other workflows"
          actions={<FoundationBadge kind="matching" />}
        >
          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border p-3 text-[11px]">
            <span className="text-muted-foreground">Record eventual outcome:</span>
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
            {bindOutcome && (
              <Chip tone={bindOutcome === "Bound" ? "success" : "danger"}>{bindOutcome}</Chip>
            )}
          </div>
          <ul className="divide-y divide-border">
            {log.slice(0, 8).map((d, i) => (
              <li key={i} className="flex items-start gap-3 py-3 text-sm">
                <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">{d.at}</span>
                <div className="flex-1">
                  <div>
                    <b>{d.who}</b> — {d.what}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{d.ctx}</div>
                </div>
                {d.conf !== "—" && <Chip tone="neutral">{d.conf}</Chip>}
              </li>
            ))}
          </ul>
          <div className="mt-3 text-[10px] text-muted-foreground">
            Session-only for this prototype — feeds the same Feedback/Eval store pattern as other
            workflows, not yet persisted.
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ============================================================
   5. Binder & Policy Issuance Coordination
   ============================================================ */

type BinderOverride = {
  subjectivities?: Record<string, boolean>;
  bindResolution?: Discrepancy["resolution"];
  docsReceivedDate?: string | null;
  docDiscrepancy?: Discrepancy | null;
  docResolution?: Discrepancy["resolution"];
  obligationStatus?: Record<string, "Pending" | "Satisfied">;
  placementConfirmationSent?: boolean;
  policyDocsDeliveredSent?: boolean;
};

// Merges a binder's base mock data with whatever the broker has actually done
// this session (resolutions, clearances, simulated arrivals). Plain data
// derivation, not a React hook — deliberately not named `use...` after the
// last false-positive with the hooks-naming lint rule.
function deriveBinderState(binder: Binder, ov: BinderOverride) {
  const subjectivities = binder.subjectivities.map((s) => ({
    ...s,
    cleared: ov.subjectivities?.[s.label] ?? s.cleared,
  }));
  const unresolvedMaterial = subjectivities.filter((s) => s.tier === "Material" && !s.cleared);
  const allCleared = subjectivities.every((s) => s.cleared);

  const bindDiscrepancy: Discrepancy | null = binder.bindDiscrepancy
    ? {
        ...binder.bindDiscrepancy,
        resolution: ov.bindResolution ?? binder.bindDiscrepancy.resolution,
      }
    : null;
  const bindClean = !bindDiscrepancy || bindDiscrepancy.resolution !== "Unresolved";

  const docsReceivedDate =
    ov.docsReceivedDate !== undefined ? ov.docsReceivedDate : binder.docsReceivedDate;
  const baseDocDiscrepancy =
    ov.docDiscrepancy !== undefined ? ov.docDiscrepancy : binder.docDiscrepancy;
  const docDiscrepancy: Discrepancy | null = baseDocDiscrepancy
    ? { ...baseDocDiscrepancy, resolution: ov.docResolution ?? baseDocDiscrepancy.resolution }
    : null;
  const docsClean = !docDiscrepancy || docDiscrepancy.resolution !== "Unresolved";
  const docsExpectedDays = daysUntil(binder.docsExpectedBy);
  const docsOverdue = !docsReceivedDate && docsExpectedDays !== null && docsExpectedDays < 0;

  const obligations = binder.postBindObligations.map((o) => ({
    ...o,
    status: ov.obligationStatus?.[o.label] ?? o.status,
    overdue:
      (ov.obligationStatus?.[o.label] ?? o.status) === "Pending" && (daysUntil(o.dueBy) ?? 0) < 0,
  }));

  const placementConfirmationSent =
    ov.placementConfirmationSent ?? binder.placementConfirmationSent;
  const policyDocsDeliveredSent = ov.policyDocsDeliveredSent ?? binder.policyDocsDeliveredSent;

  return {
    subjectivities,
    unresolvedMaterial,
    allCleared,
    bindDiscrepancy,
    bindClean,
    docsReceivedDate,
    docDiscrepancy,
    docsClean,
    docsOverdue,
    obligations,
    placementConfirmationSent,
    policyDocsDeliveredSent,
  };
}

function DiscrepancyBlock({
  title,
  discrepancy,
  onResolve,
}: {
  title: string;
  discrepancy: Discrepancy;
  onResolve: (resolution: Discrepancy["resolution"]) => void;
}) {
  const resolved = discrepancy.resolution !== "Unresolved";
  return (
    <div
      className={`rounded-lg border p-3 text-sm ${resolved ? "border-success/30 bg-success/5" : "border-2 border-destructive/40 bg-destructive/5"}`}
    >
      <div className="flex items-center gap-2 font-medium">
        {resolved ? (
          <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
        ) : (
          <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
        )}
        {title} — {discrepancy.field} mismatch
      </div>
      <div className="mt-2 grid grid-cols-2 gap-3 rounded-md border border-border bg-background p-2 text-xs">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Requested
          </div>
          <div className="font-mono">{discrepancy.requested}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Carrier confirmed
          </div>
          <div className="font-mono">{discrepancy.confirmed}</div>
        </div>
      </div>
      {resolved ? (
        <div className="mt-2 text-[11px] text-muted-foreground">
          Resolution: {discrepancy.resolution}
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            className="!py-1 !text-xs"
            onClick={() => onResolve("Accepted carrier terms")}
          >
            Accept carrier's terms
          </Button>
          <Button
            variant="danger"
            className="!py-1 !text-xs"
            onClick={() => onResolve("Disputed — pending carrier")}
          >
            Dispute — flag for follow-up
          </Button>
        </div>
      )}
    </div>
  );
}

export function BinderIssuance() {
  const navigate = useNavigate();
  const [sel, setSel] = useState(binders[0].id);
  const b = binders.find((x) => x.id === sel)!;
  const [overrides, setOverrides] = useState<Record<string, BinderOverride>>({});
  const ov = overrides[b.id] ?? {};
  const view = deriveBinderState(b, ov);

  const [log, setLog] = useState<LogEntry[]>(() => [
    {
      at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      who: "AI (Matching/Ranking Core)",
      what: "Bind order generated matching selected quote terms exactly (BI-01)",
      ctx: `${b.id} · ${b.insured}`,
      conf: "—",
    },
  ]);

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

  function patch(binderId: string, patchOv: BinderOverride) {
    setOverrides((prev) => ({ ...prev, [binderId]: { ...prev[binderId], ...patchOv } }));
  }

  function toggleSubjectivity(label: string, cleared: boolean) {
    patch(b.id, { subjectivities: { ...ov.subjectivities, [label]: cleared } });
    appendLog(
      "Sam D. (Broker)",
      `${cleared ? "Cleared" : "Reopened"} subjectivity "${label}"`,
      `${b.id} · ${b.insured}`,
    );
  }

  function resolveBind(resolution: Discrepancy["resolution"]) {
    patch(b.id, { bindResolution: resolution });
    appendLog(
      "Sam D. (Broker)",
      `Resolved bind-confirmation discrepancy (BI-03) — ${resolution}`,
      `${b.id} · ${view.bindDiscrepancy?.field}: requested ${view.bindDiscrepancy?.requested} vs confirmed ${view.bindDiscrepancy?.confirmed}`,
    );
  }

  function resolveDoc(resolution: Discrepancy["resolution"]) {
    patch(b.id, { docResolution: resolution });
    appendLog(
      "Sam D. (Broker)",
      `Resolved issued-policy discrepancy (BI-05) — ${resolution}`,
      `${b.id} · ${view.docDiscrepancy?.field}: requested ${view.docDiscrepancy?.requested} vs confirmed ${view.docDiscrepancy?.confirmed}`,
    );
  }

  function simulateDocsArrived() {
    patch(b.id, {
      docsReceivedDate: "Feb 03, 2026",
      docDiscrepancy: {
        field: "Effective date",
        requested: b.effective,
        confirmed: "Mar 03, 2026",
        resolution: "Unresolved",
      },
    });
    appendLog(
      "AI (Extraction Core)",
      "Policy documents received — reconciling against confirmed bind terms (BI-05)",
      `${b.id} · ${b.insured}`,
    );
  }

  function setObligation(label: string, status: "Pending" | "Satisfied") {
    patch(b.id, { obligationStatus: { ...ov.obligationStatus, [label]: status } });
    appendLog(
      "Sam D. (Broker)",
      `Post-bind obligation "${label}" marked ${status}`,
      `${b.id} · ${b.insured}`,
    );
  }

  function sendPlacementConfirmation() {
    patch(b.id, { placementConfirmationSent: true });
    appendLog(
      "Sam D. (Broker)",
      "Sent Placement Confirmation to Retail Agent Copilot (BI-06)",
      `${b.id} · ${b.insured}`,
    );
    navigate({
      to: "/app/workflows/$slug",
      params: { slug: "agent-copilot" },
      search: {
        trigger: "placement-confirmation",
        carrier: b.carrier,
        insured: b.insured,
        premium: b.premium,
      },
    });
  }

  function sendPolicyDocsDelivered() {
    patch(b.id, { policyDocsDeliveredSent: true });
    appendLog(
      "Sam D. (Broker)",
      "Sent Policy Documents Delivered to Retail Agent Copilot, forwarding final docs (BI-06)",
      `${b.id} · ${b.insured}`,
    );
    navigate({
      to: "/app/workflows/$slug",
      params: { slug: "agent-copilot" },
      search: {
        trigger: "policy-docs-delivered",
        carrier: b.carrier,
        insured: b.insured,
        premium: b.premium,
      },
    });
  }

  const steps = [
    { label: "Selected quote received", done: true, note: `${b.carrier} · ${b.premium}` },
    {
      label: "Pre-bind subjectivity status (BI-02, inherited from QC-02)",
      done: view.allCleared,
      active: !view.allCleared,
      note:
        view.unresolvedMaterial.length > 0
          ? `BLOCKED — material subjectivity unresolved: ${view.unresolvedMaterial.map((s) => s.label).join(", ")}`
          : `${view.subjectivities.filter((s) => s.cleared).length} of ${view.subjectivities.length} cleared`,
    },
    {
      label: "Bind order generated & sent to carrier (BI-01)",
      done: view.allCleared,
      active: false,
      note: view.allCleared
        ? "Matches selected quote terms exactly — sent manually by broker"
        : "Blocked until subjectivities clear",
    },
    {
      label: "Carrier bind confirmation reconciled (BI-03)",
      done: (b.status === "Bound — awaiting policy" || b.status === "Issued") && view.bindClean,
      active: (b.status === "Bound — awaiting policy" || b.status === "Issued") && !view.bindClean,
      note: view.bindDiscrepancy
        ? view.bindClean
          ? `Discrepancy resolved — ${view.bindDiscrepancy.resolution}`
          : "Material mismatch found — resolve before this reads as a clean bind"
        : b.status === "Ready to bind" || b.status === "Subjectivities open"
          ? "Not yet bound"
          : "Checked line-by-line against agreed terms — clean",
    },
  ];

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        eyebrow="Workflow 05"
        title="Binder & Policy Issuance Coordination"
        description="From selected quote to bound policy — subjectivity clearance, carrier bind confirmation, and issued-policy reconciliation, all checked against what was actually agreed, never assumed."
        actions={
          <Button
            variant="primary"
            disabled={view.unresolvedMaterial.length > 0}
            title={
              view.unresolvedMaterial.length > 0
                ? "Blocked — resolve the unresolved material subjectivity first"
                : undefined
            }
          >
            Issue binder
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <Panel title="In-progress binders">
          <ul className="divide-y divide-border">
            {binders.map((r) => (
              <button
                key={r.id}
                onClick={() => setSel(r.id)}
                className={`w-full py-3 text-left ${sel === r.id ? "bg-secondary/50" : "hover:bg-secondary/30"}`}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{r.insured}</span>
                  <span className="text-[11px] text-muted-foreground">{r.effective}</span>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {r.id} · {r.carrier}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Chip
                    tone={
                      r.status === "Issued"
                        ? "success"
                        : r.status === "Ready to bind"
                          ? "accent"
                          : "warn"
                    }
                  >
                    {r.status}
                  </Chip>
                  <span className="text-xs font-mono">{r.premium}</span>
                </div>
              </button>
            ))}
          </ul>
        </Panel>

        <div className="space-y-5">
          <Panel
            title={`${b.insured} · bind workflow`}
            subtitle={`${b.id} · ${b.carrier}`}
            actions={<FoundationBadge kind="matching" />}
          >
            <ol className="space-y-3">
              {steps.map((s, i) => (
                <li key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs ${
                      s.done
                        ? "bg-success text-background"
                        : s.active
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {s.done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm ${s.active ? "font-medium" : ""}`}>{s.label}</div>
                    <div className="text-[11px] text-muted-foreground">{s.note}</div>
                  </div>
                </li>
              ))}
            </ol>

            {!view.allCleared && (
              <div className="mt-3 space-y-2 rounded-lg border border-dashed border-border p-3">
                <div className="text-xs font-medium">Clear subjectivities</div>
                {view.subjectivities
                  .filter((s) => !s.cleared)
                  .map((s) => (
                    <div key={s.label} className="flex items-center justify-between gap-2 text-sm">
                      <span className="flex items-center gap-2">
                        <Chip tone={s.tier === "Material" ? "danger" : "neutral"}>{s.tier}</Chip>
                        {s.label}
                      </span>
                      <Button
                        variant="secondary"
                        className="!py-1 !text-xs"
                        onClick={() => toggleSubjectivity(s.label, true)}
                      >
                        Mark cleared
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </Panel>

          {view.bindDiscrepancy && (
            <DiscrepancyBlock
              title="Bind confirmation vs requested terms"
              discrepancy={view.bindDiscrepancy}
              onResolve={resolveBind}
            />
          )}

          {view.bindClean && (b.status === "Bound — awaiting policy" || b.status === "Issued") && (
            <div
              className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm ${view.docsOverdue ? "border-2 border-destructive/40 bg-destructive/5" : "border-border"}`}
            >
              <div>
                <div className="font-medium">Policy document arrival (BI-04)</div>
                <div className="text-[11px] text-muted-foreground">
                  {view.docsReceivedDate
                    ? `Received ${view.docsReceivedDate}`
                    : view.docsOverdue
                      ? `Overdue — carrier's stated delivery date (${b.docsExpectedBy}) has passed with nothing received`
                      : `Expected by ${b.docsExpectedBy} — monitoring against carrier's stated timeline`}
                </div>
              </div>
              {view.docsOverdue && !view.docsReceivedDate && (
                <Button
                  variant="secondary"
                  className="!py-1 !text-xs"
                  onClick={simulateDocsArrived}
                >
                  Simulate docs arrived
                </Button>
              )}
            </div>
          )}

          {view.docDiscrepancy && (
            <DiscrepancyBlock
              title="Issued policy vs confirmed bind terms"
              discrepancy={view.docDiscrepancy}
              onResolve={resolveDoc}
            />
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <Panel title="AI bind recommendation">
              <div className="rounded-xl border-2 border-success/40 bg-success/5 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <div className="font-serif text-lg">
                    {b.status === "Ready to bind" ? "Ready to bind" : b.status}
                  </div>
                </div>
                <p className="mt-2 text-sm">
                  {view.subjectivities.filter((s) => s.cleared).length} of{" "}
                  {view.subjectivities.length} subjectivities satisfied. Premium {b.premium},
                  effective {b.effective}. Never treats a carrier document as authoritative without
                  reconciling it against the terms actually agreed.
                </p>
              </div>
            </Panel>
            <Panel title="Retail Agent Comms triggers (BI-06)">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-2 rounded-lg border border-border p-3">
                  <div>
                    <div className="font-medium">Placement Confirmation</div>
                    <div className="text-[11px] text-muted-foreground">Fires on clean bind</div>
                  </div>
                  {view.placementConfirmationSent ? (
                    <Chip tone="success">
                      <CheckCircle2 className="h-3 w-3" />
                      Sent
                    </Chip>
                  ) : (
                    <Button
                      variant="secondary"
                      className="!py-1 !text-xs"
                      disabled={!view.bindClean}
                      onClick={sendPlacementConfirmation}
                    >
                      Send
                    </Button>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 rounded-lg border border-border p-3">
                  <div>
                    <div className="font-medium">Policy Documents Delivered</div>
                    <div className="text-[11px] text-muted-foreground">
                      Fires on clean doc reconciliation, forwards final docs
                    </div>
                  </div>
                  {view.policyDocsDeliveredSent ? (
                    <Chip tone="success">
                      <CheckCircle2 className="h-3 w-3" />
                      Sent
                    </Chip>
                  ) : (
                    <Button
                      variant="secondary"
                      className="!py-1 !text-xs"
                      disabled={!view.docsReceivedDate || !view.docsClean}
                      title={
                        !view.docsReceivedDate
                          ? "Docs not yet received"
                          : !view.docsClean
                            ? "Resolve the doc discrepancy first"
                            : undefined
                      }
                      onClick={sendPolicyDocsDelivered}
                    >
                      Send
                    </Button>
                  )}
                </div>
              </div>
            </Panel>
          </div>

          <Panel
            title="Post-bind obligation tracking (BI-07)"
            subtitle="Own timeline — independent of the bind/issuance steps above"
          >
            {view.obligations.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No post-bind obligations tracked yet for this record.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {view.obligations.map((o) => (
                  <li
                    key={o.label}
                    className="flex items-center justify-between gap-3 py-3 text-sm"
                  >
                    <div>
                      <div className="font-medium">{o.label}</div>
                      <div className="text-[11px] text-muted-foreground">Due {o.dueBy}</div>
                    </div>
                    {o.status === "Satisfied" ? (
                      <Chip tone="success">Satisfied</Chip>
                    ) : o.overdue ? (
                      <div className="flex items-center gap-2">
                        <Chip tone="danger">Overdue</Chip>
                        <Button
                          variant="secondary"
                          className="!py-1 !text-xs"
                          onClick={() => setObligation(o.label, "Satisfied")}
                        >
                          Mark satisfied
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Chip tone="neutral">Pending</Chip>
                        <Button
                          variant="secondary"
                          className="!py-1 !text-xs"
                          onClick={() => setObligation(o.label, "Satisfied")}
                        >
                          Mark satisfied
                        </Button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel
            title="Audit log (BI-08 / E&O record)"
            subtitle="Every step, every discrepancy found, and how it was resolved — proof terms were actively verified, not assumed"
            actions={<FoundationBadge kind="matching" />}
          >
            <ul className="divide-y divide-border">
              {log.slice(0, 10).map((d, i) => (
                <li key={i} className="flex items-start gap-3 py-3 text-sm">
                  <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">{d.at}</span>
                  <div className="flex-1">
                    <div>
                      <b>{d.who}</b> — {d.what}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{d.ctx}</div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-[10px] text-muted-foreground">
              Session-only for this prototype — feeds the same Feedback/Eval store pattern as other
              workflows. This is the most E&O-relevant record in the suite: it documents that every
              carrier claim was checked against what was actually agreed, not taken on faith.
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   6. Endorsement / Mid-Term Change Processing
   ============================================================ */

type EndorsementOverride = {
  itemResolution?: Record<string, Discrepancy["resolution"]>;
  endorsementConfirmedSent?: boolean;
};

// Same shape as deriveBinderState — plain data derivation, not a hook.
function deriveEndorsementState(e: MidTermChange, ov: EndorsementOverride) {
  const items = e.items.map((it) => ({
    ...it,
    discrepancy: it.discrepancy
      ? {
          ...it.discrepancy,
          resolution: ov.itemResolution?.[it.label] ?? it.discrepancy.resolution,
        }
      : null,
  }));
  const unresolvedItems = items.filter((it) => it.discrepancy?.resolution === "Unresolved");
  const reconciliationClean = e.carrierStatus === "Issued" && unresolvedItems.length === 0;

  const route: "a" | "b" | "c" =
    e.touchesExposure && e.appetiteRecheck === "Outside appetite"
      ? "c"
      : e.classification === "UW-review-required" ||
          (e.touchesExposure && e.appetiteRecheck === "Unknown")
        ? "b"
        : "a";

  const endorsementConfirmedSent = ov.endorsementConfirmedSent ?? e.endorsementConfirmedSent;

  return { items, unresolvedItems, reconciliationClean, route, endorsementConfirmedSent };
}

export function EndorsementProcessing() {
  const navigate = useNavigate();
  const [sel, setSel] = useState(midTermChanges[0].id);
  const e = midTermChanges.find((x) => x.id === sel)!;
  const [overrides, setOverrides] = useState<Record<string, EndorsementOverride>>({});
  const ov = overrides[e.id] ?? {};
  const view = deriveEndorsementState(e, ov);

  const [log, setLog] = useState<LogEntry[]>(() => {
    const at = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return [
      {
        at,
        who: "AI (Extraction Core)",
        what: "Issued endorsement reconciled item by item (EP-05) — 1 of 2 items clean, 1 flagged (excess layer attachment mismatch)",
        ctx: "MTC-8811 · Ridgeline Contractors, Inc.",
        conf: "—",
      },
      {
        at,
        who: "AI (Extraction Core)",
        what: "Issued endorsement reconciled item by item (EP-05) — clean, matches request exactly",
        ctx: "MTC-8812 · Cedar Grove Assisted Living",
        conf: "—",
      },
      {
        at,
        who: "AI (Extraction Core)",
        what: "Issued endorsement reconciled item by item (EP-05) — clean, matches request exactly",
        ctx: "MTC-8814 · Palmetto Cold Storage LLC",
        conf: "—",
      },
      {
        at,
        who: "AI (Matching/Ranking Core)",
        what: "Classified UW-review-required (EP-01) · appetite recheck: Unknown — logged as a signal for the deferred Carrier Appetite Intelligence workflow (EP-11, same idea as QC-03)",
        ctx: "MTC-8811 · Ridgeline Contractors, Inc.",
        conf: "—",
      },
      {
        at,
        who: "AI (Matching/Ranking Core)",
        what: "Classified UW-review-required (EP-01) · appetite recheck: Outside appetite — routed to (c), broker prompted for a new Submission Market Matching pass (EP-07)",
        ctx: "MTC-8813 · Highline Hospitality Group",
        conf: "—",
      },
      {
        at,
        who: "AI (Matching/Ranking Core)",
        what: "Classified Routine (EP-01) · appetite recheck not applicable — no class/state/severity exposure change",
        ctx: "MTC-8812 · Cedar Grove Assisted Living",
        conf: "—",
      },
      {
        at,
        who: "AI (Matching/Ranking Core)",
        what: "Classified Routine (EP-01) · appetite recheck: Within appetite — routed to (a) quick send (EP-07)",
        ctx: "MTC-8814 · Palmetto Cold Storage LLC",
        conf: "—",
      },
    ];
  });

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

  function patch(changeId: string, patchOv: EndorsementOverride) {
    setOverrides((prev) => ({ ...prev, [changeId]: { ...prev[changeId], ...patchOv } }));
  }

  function resolveItem(label: string, resolution: Discrepancy["resolution"]) {
    patch(e.id, { itemResolution: { ...ov.itemResolution, [label]: resolution } });
    const item = e.items.find((i) => i.label === label);
    appendLog(
      "Sam D. (Broker)",
      `Resolved issued-endorsement discrepancy (EP-05) — ${resolution}`,
      `${e.id} · ${item?.discrepancy?.field}: requested ${item?.discrepancy?.requested} vs confirmed ${item?.discrepancy?.confirmed}`,
    );
  }

  function sendEndorsementConfirmed() {
    patch(e.id, { endorsementConfirmedSent: true });
    appendLog(
      "Sam D. (Broker)",
      "Sent endorsement-confirmed trigger to Retail Agent Comms (EP-10)",
      `${e.id} · ${e.insured}`,
    );
    navigate({
      to: "/app/workflows/$slug",
      params: { slug: "agent-copilot" },
      search: {
        trigger: "endorsement-confirmed",
        carrier: e.carrier,
        insured: e.insured,
      },
    });
  }

  function startMarketMatchingHandoff() {
    appendLog(
      "Sam D. (Broker)",
      "Started a new Submission Market Matching pass for the increased exposure (EP-07c, out of scope — handoff only)",
      `${e.id} · ${e.insured}`,
    );
    toast("Handoff logged — a new Submission Market Matching pass would begin for this exposure.");
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        eyebrow="Workflow 06"
        title="Endorsement / Mid-Term Change Processing"
        description="AI classifies materiality, rechecks appetite against the carrier's current profile, and reconciles the issued endorsement item by item before any trigger fires — never assuming appetite fit from absent data, never trusting a carrier's issued document without reconciling it."
        actions={<Button variant="secondary">Return to agent</Button>}
      />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <Panel title="Open mid-term change requests">
          <ul className="divide-y divide-border">
            {midTermChanges.map((r) => (
              <button
                key={r.id}
                onClick={() => setSel(r.id)}
                className={`w-full py-3 text-left ${sel === r.id ? "bg-secondary/50" : "hover:bg-secondary/30"}`}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{r.insured}</span>
                  <span className="text-[11px] text-muted-foreground">{r.requested}</span>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {r.id} · {r.carrier}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Chip tone="accent">{r.type}</Chip>
                  <Chip
                    tone={
                      r.materiality === "Complex"
                        ? "danger"
                        : r.materiality === "Material"
                          ? "warn"
                          : "success"
                    }
                  >
                    {r.materiality}
                  </Chip>
                </div>
              </button>
            ))}
          </ul>
        </Panel>

        <div className="space-y-5">
          <Panel>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-mono text-muted-foreground">
                  {e.id} · Policy {e.policy} · {e.carrier}
                </div>
                <h2 className="mt-1 font-serif text-2xl">{e.insured}</h2>
                <div className="mt-1 text-xs text-muted-foreground">
                  Requested change: {e.type} · Requested effective {e.requestedEffectiveDate} (EP-02
                  extraction)
                </div>
              </div>
            </div>
          </Panel>

          <Panel
            title="AI Difference Engine"
            subtitle="Before → After"
            actions={<FoundationBadge kind="extraction" />}
          >
            <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-border text-sm">
              <div className="bg-secondary/60 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Change
              </div>
              <div className="bg-secondary/60 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                In-force policy
              </div>
              <div className="bg-secondary/60 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                After endorsement
              </div>
              <Row label="Locations" prior="14" now="15" change="+1 · Ocala FL" />
              <Row label="TIV" prior="$42.8M" now="$45.2M" change="+$2.4M" />
              <Row label="Sprinklered" prior="92%" now="93%" change="+1pp" positive />
              <Row
                label="Premium"
                prior="$187,400"
                now="$201,600"
                change={
                  e.premiumBearing
                    ? "Premium-bearing — see proration inputs (EP-06)"
                    : "No premium impact"
                }
                strong
              />
            </div>
          </Panel>

          <div className="grid gap-5 md:grid-cols-2">
            <Panel
              title="Classification (EP-01)"
              actions={
                <div className="flex items-center gap-2">
                  <Chip
                    tone={
                      e.materiality === "Complex"
                        ? "danger"
                        : e.materiality === "Material"
                          ? "warn"
                          : "success"
                    }
                  >
                    {e.materiality}
                  </Chip>
                  <Chip tone={e.classification === "Routine" ? "success" : "warn"}>
                    {e.classification}
                  </Chip>
                </div>
              }
            >
              <p className="text-sm text-muted-foreground">
                {e.materiality === "Complex"
                  ? "Multi-part request — each item reconciled independently below once the carrier responds."
                  : e.materiality === "Material"
                    ? "Changes total exposure or limits enough to require a full appetite recheck before drafting."
                    : "No change to exposure basis — routed for a light-touch approval."}{" "}
                Classified by type first, then materiality within type — independent of the appetite
                outcome below.
              </p>
            </Panel>

            <Panel title="Appetite recheck (EP-02)" actions={<FoundationBadge kind="matching" />}>
              {!e.touchesExposure ? (
                <div className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
                  Not applicable — this change doesn't touch class, state, or severity exposure, so
                  no appetite recheck was triggered.
                </div>
              ) : (
                <div
                  className={`rounded-lg border p-3 text-sm ${
                    e.appetiteRecheck === "Within appetite"
                      ? "border-success/30 bg-success/5"
                      : e.appetiteRecheck === "Outside appetite"
                        ? "border-2 border-destructive/40 bg-destructive/5"
                        : "border-2 border-warn/40 bg-warn/5"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 font-medium ${
                      e.appetiteRecheck === "Within appetite"
                        ? "text-success"
                        : e.appetiteRecheck === "Outside appetite"
                          ? "text-destructive"
                          : "text-warn"
                    }`}
                  >
                    {e.appetiteRecheck === "Within appetite" ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                    ) : e.appetiteRecheck === "Outside appetite" ? (
                      <Ban className="h-4 w-4 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                    )}
                    {e.appetiteRecheck}
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {e.appetiteReasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Panel>
          </div>

          <Panel title="Premium impact & proration (EP-03 / EP-06)">
            <div className="flex items-center gap-2 text-sm font-medium">
              {e.premiumBearing ? (
                <TrendingUp className="h-4 w-4 text-accent" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-success" />
              )}
              {e.premiumBearing ? "Premium-bearing change" : "Not premium-bearing"}
            </div>
            {e.premiumBearing && e.prorationInputs && (
              <>
                <p className="mt-1 text-xs text-muted-foreground">
                  Mid-term premium-bearing change — proration inputs only. No final prorated figure
                  is calculated here.
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>
                    Remaining days in term:{" "}
                    <span className="font-mono">{e.prorationInputs.remainingDaysInTerm}</span>
                  </li>
                  <li>
                    Annual premium basis:{" "}
                    <span className="font-mono">{e.prorationInputs.annualPremiumBasis}</span>
                  </li>
                  <li>
                    Requested effective date:{" "}
                    <span className="font-mono">{e.prorationInputs.effectiveDate}</span>
                  </li>
                </ul>
              </>
            )}
          </Panel>

          <Panel title="Broker review routing (EP-07)">
            {view.route === "a" && (
              <div className="rounded-lg border border-success/30 bg-success/5 p-3 text-sm">
                <div className="flex items-center gap-2 font-medium text-success">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  (a) Routine, in appetite — quick review + send
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {e.carrierStatus === "Issued"
                    ? "Already sent and issued — no underwriting escalation was needed."
                    : "Draft matches the agent's request exactly and can go straight to the carrier."}
                </p>
              </div>
            )}
            {view.route === "b" && (
              <div className="rounded-lg border-2 border-warn/40 bg-warn/5 p-3 text-sm">
                <div className="flex items-center gap-2 font-medium text-warn">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  (b) UW-review-required or appetite-unknown — send with full context
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {e.carrierStatus === "Issued"
                    ? "Sent to the carrier's UW team with full context — not a standard endorsement request."
                    : "Routed to the carrier's UW team with full context, not a standard endorsement request."}
                </p>
              </div>
            )}
            {view.route === "c" && (
              <div className="rounded-lg border-2 border-destructive/40 bg-destructive/5 p-3 text-sm">
                <div className="flex items-center gap-2 font-medium text-destructive">
                  <Ban className="h-4 w-4 shrink-0" />
                  (c) Outside appetite — new exposure needs its own submission
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Not drafted or sent to the carrier as an endorsement. Broker should start a new
                  Submission Market Matching pass for the increased exposure (out of scope here —
                  handoff only).
                </p>
                <Button
                  variant="secondary"
                  className="mt-3 !py-1 !text-xs"
                  onClick={startMarketMatchingHandoff}
                >
                  Start new Submission Market Matching pass
                </Button>
              </div>
            )}
          </Panel>

          <Panel title="Carrier response (EP-08)">
            {e.carrierStatus === "Pending broker decision" && (
              <div className="flex items-center gap-2 rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
                <Info className="h-4 w-4 shrink-0" />
                Not yet sent — awaiting the broker's routing decision above.
              </div>
            )}
            {e.carrierStatus === "Issued" && (
              <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 p-3 text-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                Carrier issued the endorsement — reconciling item by item below, never assumed
                correct.
              </div>
            )}
            {e.carrierStatus === "Declined" && (
              <div className="flex items-center gap-2 rounded-lg border-2 border-destructive/40 bg-destructive/5 p-3 text-sm">
                <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                Carrier declined — returned a decision on the material change instead of issuing.
              </div>
            )}
          </Panel>

          <Panel
            title="Item-level reconciliation (EP-05)"
            subtitle={
              view.items.length > 1
                ? "Multi-part request — each item reconciled independently"
                : undefined
            }
          >
            <div className="space-y-3">
              {view.items.map((it) =>
                it.issued === null ? (
                  <div
                    key={it.label}
                    className="flex items-center gap-2 rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground"
                  >
                    <Info className="h-4 w-4 shrink-0" />
                    {it.label} — awaiting carrier response
                  </div>
                ) : it.discrepancy ? (
                  <DiscrepancyBlock
                    key={it.label}
                    title={it.label}
                    discrepancy={it.discrepancy}
                    onResolve={(r) => resolveItem(it.label, r)}
                  />
                ) : (
                  <div key={it.label} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                    {it.label} — issued matches request exactly
                  </div>
                ),
              )}
            </div>
          </Panel>

          <Panel title="Retail Agent Comms trigger (EP-10)">
            <div className="flex items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm">
              <div>
                <div className="font-medium">Endorsement confirmed</div>
                <div className="text-[11px] text-muted-foreground">
                  Fires on clean item-level reconciliation; held on any unresolved discrepancy —
                  same gating discipline as Binder & Issuance
                </div>
              </div>
              {view.endorsementConfirmedSent ? (
                <Chip tone="success">
                  <CheckCircle2 className="h-3 w-3" />
                  Sent
                </Chip>
              ) : (
                <Button
                  variant="secondary"
                  className="!py-1 !text-xs"
                  disabled={!view.reconciliationClean}
                  title={
                    !view.reconciliationClean
                      ? "Resolve the item-level discrepancy first"
                      : undefined
                  }
                  onClick={sendEndorsementConfirmed}
                >
                  Send
                </Button>
              )}
            </div>
          </Panel>

          <Panel
            title="Audit log (EP-11 / E&O record)"
            subtitle="Every classification decision, appetite outcome, and reconciliation result — including appetite-unknown resolutions logged as a signal for Carrier Appetite Intelligence"
            actions={<FoundationBadge kind="matching" />}
          >
            <ul className="divide-y divide-border">
              {log.slice(0, 10).map((d, i) => (
                <li key={i} className="flex items-start gap-3 py-3 text-sm">
                  <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">{d.at}</span>
                  <div className="flex-1">
                    <div>
                      <b>{d.who}</b> — {d.what}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{d.ctx}</div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-[10px] text-muted-foreground">
              Session-only for this prototype — feeds the same Feedback/Eval store pattern as other
              workflows.
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   7. Renewal Remarketing
   ============================================================ */

type RemarketOverride = {
  remarketedTimesInHistory?: number;
  finalDecision?: "Approved" | "Non-renewed" | "Info requested";
};

// Same shape as deriveBinderState/deriveEndorsementState — plain data derivation.
function deriveRemarketState(r: Remarket, ov: RemarketOverride) {
  const daysSinceRequested = -(daysUntil(r.renewalTermsRequestedDate) ?? 0);
  const nonResponseFlagged =
    !r.renewalTermsReceivedDate && daysSinceRequested > r.renewalTermsWindowDays;
  const remarketedTimesInHistory = ov.remarketedTimesInHistory ?? r.remarketedTimesInHistory;
  const finalDecision = ov.finalDecision ?? null;
  return { daysSinceRequested, nonResponseFlagged, remarketedTimesInHistory, finalDecision };
}

function usd(value: string): number | null {
  if (!/\d/.test(value)) return null;
  return Number(value.replace(/[^0-9.-]/g, ""));
}

export function RenewalRemarketing() {
  const [selected, setSelected] = useState(remarketing[0].id);
  const r = remarketing.find((x) => x.id === selected)!;
  const [overrides, setOverrides] = useState<Record<string, RemarketOverride>>({});
  const ov = overrides[r.id] ?? {};
  const view = deriveRemarketState(r, ov);

  const [log, setLog] = useState<LogEntry[]>(() => {
    const at = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return [
      {
        at,
        who: "AI (Matching/Ranking Core)",
        what: "Trigger level URGENT_REMARKET (RR-04) · incumbent silent non-response flagged (RR-07)",
        ctx: "RMK-24-4099 · Ridgeline Contractors, Inc.",
        conf: "—",
      },
      {
        at,
        who: "AI (Matching/Ranking Core)",
        what: "Remarket executed (FULL_REMARKET) — 2 of 3 markets quoted, 1 decline; incumbent's renewal offer remained most competitive",
        ctx: "RMK-24-4101 · Highline Hospitality Group",
        conf: "—",
      },
      {
        at,
        who: "AI (Matching/Ranking Core)",
        what: "Trigger level FULL_REMARKET (RR-04) — loss ratio trend 33%→37%→42% plus new location exposure",
        ctx: "RMK-24-4101 · Highline Hospitality Group",
        conf: "—",
      },
      {
        at,
        who: "AI (Matching/Ranking Core)",
        what: "Remarket executed (LIGHT_REMARKET_CHECK) — 2 of 2 markets quoted, 1 exception-based, incumbent's renewal offer remained most competitive",
        ctx: "RMK-24-4102 · Palmetto Cold Storage LLC",
        conf: "—",
      },
      {
        at,
        who: "AI (Matching/Ranking Core)",
        what: "Trigger level LIGHT_REMARKET_CHECK (RR-04) — payroll +14%, loss ratio trend 31%→34%→38%",
        ctx: "RMK-24-4102 · Palmetto Cold Storage LLC",
        conf: "—",
      },
      {
        at,
        who: "AI (Matching/Ranking Core)",
        what: "Trigger level NO_REMARKET (RR-04) — stable exposure and loss trend, incumbent responsive",
        ctx: "RMK-24-4100 · Cedar Grove Assisted Living",
        conf: "—",
      },
      {
        at,
        who: "AI (Matching/Ranking Core)",
        what: "Trigger level NO_REMARKET (RR-04) — clean loss trend, incumbent responsive, monitoring the cyber sublimit ask",
        ctx: "RMK-24-4098 · Copperline Data Center Ops",
        conf: "—",
      },
    ];
  });

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

  function patch(remarketId: string, patchOv: RemarketOverride) {
    setOverrides((prev) => ({ ...prev, [remarketId]: { ...prev[remarketId], ...patchOv } }));
  }

  function finalizeDecision(decision: "Approved" | "Non-renewed" | "Info requested") {
    patch(r.id, { finalDecision: decision });
    appendLog(
      "Sam D. (Broker)",
      `Final renewal decision (RR-09): ${decision}`,
      `${r.id} · ${r.insured}`,
    );
    if (decision === "Approved" && r.triggerLevel !== "NO_REMARKET") {
      const next = view.remarketedTimesInHistory + 1;
      patch(r.id, { remarketedTimesInHistory: next });
      appendLog(
        "AI (Matching/Ranking Core)",
        `History updated (RR-08 write) — remarketed ${next} time${next === 1 ? "" : "s"} in the last 3 years`,
        `${r.id} · ${r.insured}`,
      );
    }
  }

  function reinvokeMarketMatching() {
    appendLog(
      "Sam D. (Broker)",
      "Approved — re-invoked Submission Market Matching (RR-05) against the account's current profile",
      `${r.id} · ${r.insured}`,
    );
    toast("Handoff logged — Submission Market Matching would re-run against the current profile.");
  }

  function initiateUrgentRemarket() {
    appendLog(
      "Sam D. (Broker)",
      "Initiated remarket immediately (URGENT), in parallel with continued incumbent follow-up",
      `${r.id} · ${r.insured}`,
    );
    toast("Handoff logged — remarket initiated now, incumbent follow-up continues in parallel.");
  }

  const triggerTone =
    r.triggerLevel === "NO_REMARKET"
      ? "success"
      : r.triggerLevel === "LIGHT_REMARKET_CHECK"
        ? "accent"
        : r.triggerLevel === "FULL_REMARKET"
          ? "warn"
          : "danger";

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        eyebrow="Workflow 07"
        title="Renewal Remarketing"
        description="Detects exposure and loss changes plus incumbent responsiveness on bound policies approaching renewal, and produces a graduated remarket recommendation."
        actions={
          <Button variant="primary">
            <Sparkles className="h-4 w-4" />
            Run remarket review
          </Button>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)]">
        <Panel title="Renewal pipeline" subtitle="Next 60 days">
          <ul className="divide-y divide-border">
            {remarketing.map((row) => (
              <button
                key={row.id}
                onClick={() => setSelected(row.id)}
                className={`flex w-full flex-col gap-1 py-3 text-left transition ${selected === row.id ? "bg-secondary/50" : "hover:bg-secondary/30"}`}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{row.insured}</span>
                  <span className="text-xs text-accent">{row.change}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Exp {row.expiring}</span>
                  <span>LR {row.lossRatio}</span>
                </div>
                <Chip
                  tone={
                    row.triggerLevel === "NO_REMARKET"
                      ? "success"
                      : row.triggerLevel === "LIGHT_REMARKET_CHECK"
                        ? "accent"
                        : row.triggerLevel === "FULL_REMARKET"
                          ? "warn"
                          : "danger"
                  }
                >
                  {row.triggerLabel}
                </Chip>
              </button>
            ))}
          </ul>
        </Panel>

        <div className="space-y-5">
          <Panel>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-mono text-muted-foreground">
                  {r.id} · Incumbent {r.incumbentCarrier}
                </div>
                <h2 className="mt-1 font-serif text-2xl">{r.insured}</h2>
                <div className="mt-1 text-xs text-muted-foreground">
                  Expires {r.expiring} · Loss ratio 5yr {r.lossRatio}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => finalizeDecision("Info requested")}>
                  Request information
                </Button>
                <Button variant="danger" onClick={() => finalizeDecision("Non-renewed")}>
                  Non-renew
                </Button>
                <Button variant="primary" onClick={() => finalizeDecision("Approved")}>
                  Approve recommendation
                </Button>
              </div>
            </div>
            {view.finalDecision && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 p-2 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                Final renewal decision recorded: {view.finalDecision} (RR-09, logged below)
              </div>
            )}
          </Panel>

          <Panel
            title="Side-by-side comparison"
            subtitle="Prior term vs. renewal submission"
            actions={<FoundationBadge kind="extraction" />}
          >
            <p className="mb-2 text-[11px] text-muted-foreground">
              Current profile built from the bound record (Binder & Issuance) plus mid-term
              endorsement history (Endorsement Processing) — not just the original bind terms.
            </p>
            <div className="grid grid-cols-3 gap-0 overflow-hidden rounded-lg border border-border text-sm">
              <div className="bg-secondary/60 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Attribute
              </div>
              <div className="bg-secondary/60 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Prior term
              </div>
              <div className="bg-secondary/60 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Renewal
              </div>
              <Row label="Named insured" prior={r.insured} now={r.insured} />
              <Row label="Locations" prior="12" now="14" change="+2" />
              <Row label="TIV" prior="$38.4M" now="$42.8M" change="+11.5%" />
              <Row label="Payroll" prior="$4.2M" now="$4.8M" change="+14.3%" />
              <Row label="Sprinklered TIV" prior="88%" now="92%" change="+4pp" positive />
              <Row
                label="Loss ratio trend (RR-02)"
                prior={r.lossRatioHistory[0]}
                now={r.lossRatioHistory.join(" → ")}
              />
              <Row
                label="Incumbent responsiveness"
                prior="—"
                now={r.incumbentResponsive ? "Responsive" : "Non-responsive — see RR-07 below"}
              />
              <Row
                label="Indicated premium"
                prior={r.priorPremium}
                now={r.indicated}
                change={r.change}
                strong
              />
            </div>
          </Panel>

          <div className="grid gap-5 md:grid-cols-2">
            <Panel
              title="AI remarket recommendation"
              actions={<Chip tone={triggerTone}>{r.triggerLabel}</Chip>}
            >
              <p className="text-sm text-foreground">
                {r.triggerLevel === "NO_REMARKET" &&
                  "Exposure and loss trend are stable and the incumbent remains responsive — recommend renewing as-is with no remarket effort."}
                {r.triggerLevel === "LIGHT_REMARKET_CHECK" &&
                  "Rate change and exposure growth justify a light competitive check against 1–2 alternate markets, without disrupting the incumbent relationship."}
                {r.triggerLevel === "FULL_REMARKET" &&
                  "Loss trend deterioration plus a real exposure change justify shopping the full panel before the expiring date, while the incumbent stays responsive."}
                {r.triggerLevel === "URGENT_REMARKET" &&
                  "Incumbent has gone non-responsive and loss trend has deteriorated — this is a lapse-risk situation. Elevated priority: initiate a remarket immediately."}
              </p>
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                <li>· Flag: {r.flag}</li>
                <li>
                  · Remarketing-history weighting (RR-08): this account has been remarketed{" "}
                  {view.remarketedTimesInHistory} time
                  {view.remarketedTimesInHistory === 1 ? "" : "s"} in the last 3 years — written by
                  this workflow's own decision log below, not a separately maintained counter.
                </li>
              </ul>
            </Panel>
            <Panel title="Retail agent context">
              <div className="text-sm">
                <div className="font-medium">Ana Ruiz · Marsh Southeast</div>
                <div className="text-[11px] text-muted-foreground">
                  Agent for 4 years · 28 bound placements
                </div>
              </div>
              <div className="mt-3 rounded-lg border border-border bg-secondary/40 p-3 text-sm text-ink-soft">
                "Insured is expanding into a third Jacksonville location. Would appreciate spoilage
                sub-limit confirmation and a 15-day extension if bind slips past the expiring date."
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="secondary">
                  <MessageSquare className="h-4 w-4" />
                  Reply in Copilot
                </Button>
                <Button variant="secondary">View full history</Button>
              </div>
            </Panel>
          </div>

          <Panel title="Incumbent monitoring (RR-03 / RR-07)">
            <div className="flex items-center gap-2 text-sm">
              {r.incumbentAppetiteRecheck.status === "Confirmed" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              ) : (
                <AlertTriangle className="h-4 w-4 shrink-0 text-warn" />
              )}
              Incumbent appetite recheck: {r.incumbentAppetiteRecheck.status}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {r.incumbentAppetiteRecheck.reasoning}
            </p>
            {view.nonResponseFlagged ? (
              <div className="mt-3 flex items-start gap-2 rounded-lg border-2 border-destructive/40 bg-destructive/5 p-3 text-sm">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <div>
                  <div className="font-medium text-destructive">Silent non-response (RR-07)</div>
                  <div className="text-[11px] text-muted-foreground">
                    Renewal terms requested {r.renewalTermsRequestedDate}, {view.daysSinceRequested}{" "}
                    days elapsed against a {r.renewalTermsWindowDays}-day window despite broker
                    follow-up — nothing received.
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 text-xs text-muted-foreground">
                Renewal terms{" "}
                {r.renewalTermsReceivedDate
                  ? `received ${r.renewalTermsReceivedDate}`
                  : "still within the expected window"}
                .
              </div>
            )}
          </Panel>

          <Panel title="Broker review routing (RR-06 branches)">
            {r.triggerLevel === "NO_REMARKET" && (
              <div className="rounded-lg border border-success/30 bg-success/5 p-3 text-sm">
                <div className="flex items-center gap-2 font-medium text-success">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  (a) No remarket — review incumbent terms and accept
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  No remarket effort needed this cycle. Use the header actions below to record the
                  final decision.
                </p>
              </div>
            )}
            {(r.triggerLevel === "LIGHT_REMARKET_CHECK" || r.triggerLevel === "FULL_REMARKET") && (
              <div className="rounded-lg border-2 border-warn/40 bg-warn/5 p-3 text-sm">
                <div className="flex items-center gap-2 font-medium text-warn">
                  <TrendingUp className="h-4 w-4 shrink-0" />
                  (b) {r.triggerLevel === "LIGHT_REMARKET_CHECK"
                    ? "Light check"
                    : "Full remarket"}{" "}
                  — approve to re-invoke Market Matching
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Approving re-invokes Submission Market Matching (RR-05) against the account's
                  current profile.
                </p>
                <Button
                  variant="secondary"
                  className="mt-3 !py-1 !text-xs"
                  onClick={reinvokeMarketMatching}
                >
                  Approve — re-invoke Market Matching
                </Button>
              </div>
            )}
            {r.triggerLevel === "URGENT_REMARKET" && (
              <div className="rounded-lg border-2 border-destructive/40 bg-destructive/5 p-3 text-sm">
                <div className="flex items-center gap-2 font-medium text-destructive">
                  <Ban className="h-4 w-4 shrink-0" />
                  (c) Urgent — elevated priority, lapse risk
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Broker should initiate a remarket immediately, in parallel with continued
                  incumbent follow-up — don't wait for a response before shopping the account.
                </p>
                <Button
                  variant="danger"
                  className="mt-3 !py-1 !text-xs"
                  onClick={initiateUrgentRemarket}
                >
                  Initiate remarket now
                </Button>
              </div>
            )}
          </Panel>

          <Panel
            title="Remarket comparison — alternatives vs. incumbent renewal offer (RR-06)"
            subtitle="Reuses Quote Comparison's normalization discipline"
          >
            {r.remarketQuotes.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No remarket executed this cycle — {r.triggerLevel}.
              </div>
            ) : (
              <>
                <div className="mb-3 rounded-lg border border-border bg-secondary/30 p-3 text-sm">
                  <div className="font-medium">{r.incumbentCarrier} — renewal offer</div>
                  <div className="text-[11px] text-muted-foreground">
                    Premium {r.indicated} (prior {r.priorPremium}, {r.change})
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="py-2 text-left">Carrier</th>
                        <th className="py-2 text-right">Premium</th>
                        <th className="py-2 text-right">vs. incumbent</th>
                        <th className="py-2 text-right">Deductible</th>
                        <th className="py-2 text-left pl-4">Limit</th>
                        <th className="py-2 text-left pl-4">Materiality</th>
                        <th className="py-2 text-left pl-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {r.remarketQuotes.map((q) => {
                        const incumbentValue = usd(r.indicated);
                        const quoteValue = usd(q.premium);
                        const delta =
                          incumbentValue !== null && quoteValue !== null
                            ? quoteValue - incumbentValue
                            : null;
                        return (
                          <tr
                            key={q.carrier}
                            className={q.status === "Declined" ? "opacity-50" : ""}
                          >
                            <td className="py-2.5 font-medium">
                              <div className="flex items-center gap-2">
                                {q.carrier}
                                {q.exceptionBased && <Chip tone="warn">Exception-based</Chip>}
                              </div>
                            </td>
                            <td className="py-2.5 text-right font-mono">{q.premium}</td>
                            <td className="py-2.5 text-right font-mono text-xs">
                              {delta === null
                                ? "—"
                                : `${delta < 0 ? "-" : "+"}$${Math.abs(delta).toLocaleString()}`}
                            </td>
                            <td className="py-2.5 text-right font-mono">{q.deductible}</td>
                            <td className="py-2.5 pl-4 text-xs">{q.limit}</td>
                            <td className="py-2.5 pl-4">
                              <Chip
                                tone={
                                  q.materiality === "Deal-breaker"
                                    ? "danger"
                                    : q.materiality === "Material"
                                      ? "warn"
                                      : "success"
                                }
                              >
                                {q.materiality}
                              </Chip>
                            </td>
                            <td className="py-2.5 pl-4">
                              <Chip tone={q.status === "Quoted" ? "accent" : "danger"}>
                                {q.status}
                              </Chip>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Panel>

          <Panel
            title="Decision log (RR-09 / E&O record)"
            subtitle="Trigger level, remarket outcome, and final decision — this is what RR-08 reads next cycle"
            actions={<FoundationBadge kind="matching" />}
          >
            <ul className="divide-y divide-border">
              {log.slice(0, 10).map((d, i) => (
                <li key={i} className="flex items-start gap-3 py-3 text-sm">
                  <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">{d.at}</span>
                  <div className="flex-1">
                    <div>
                      <b>{d.who}</b> — {d.what}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{d.ctx}</div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-[10px] text-muted-foreground">
              Session-only for this prototype — feeds the same Feedback/Eval store pattern as other
              workflows.
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   8. Diligent Search & Compliance Documentation
   ============================================================ */

const STATUS_PRIORITY: DiligentSearchStateDetail["status"][] = [
  "Gathering evidence",
  "Ready to file",
  "Filed",
  "Exempt",
];

// Worst-of-states summary for the queue chip — derived, not stored twice.
function overallStatus(record: DiligentSearchRecord): DiligentSearchStateDetail["status"] {
  return record.states.reduce(
    (worst, s) =>
      STATUS_PRIORITY.indexOf(s.status) < STATUS_PRIORITY.indexOf(worst) ? s.status : worst,
    "Exempt" as DiligentSearchStateDetail["status"],
  );
}

function stateSatisfied(s: DiligentSearchStateDetail) {
  return s.requirementStatus !== "Required" || s.evidenceSufficient;
}

export function DiligentSearchCompliance() {
  const [sel, setSel] = useState(diligentSearch[0].id);
  const d = diligentSearch.find((x) => x.id === sel)!;
  const [selState, setSelState] = useState<string | null>(null);
  const [escalated, setEscalated] = useState<Record<string, boolean>>({});

  const activeStateName =
    selState && d.states.some((s) => s.state === selState) ? selState : d.states[0].state;
  const state = d.states.find((s) => s.state === activeStateName)!;
  const escalationKey = `${d.id}-${state.state}`;
  const isEscalated = escalated[escalationKey] ?? state.escalation?.escalated ?? false;

  const unsatisfiedStates = d.states.filter((s) => !stateSatisfied(s));
  const canGenerate = unsatisfiedStates.length === 0;

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        eyebrow="Workflow 08"
        title="Diligent Search & Compliance Documentation"
        description="Per-state diligent-search requirements, declination evidence sufficiency, and compliant surplus-lines documentation — gated so nothing generates on incomplete evidence. Submissions enter this workflow from Submission Market Matching's MM-07 diligent-search flag — fully processed here, not just logged upstream."
        actions={
          <Button variant="primary" disabled={!canGenerate}>
            <FileSearch className="h-4 w-4" />
            Generate documentation
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

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <Panel title="Diligent search queue">
          <ul className="divide-y divide-border">
            {diligentSearch.map((r) => {
              const rStatus = overallStatus(r);
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    setSel(r.id);
                    setSelState(null);
                  }}
                  className={`w-full py-3 text-left ${sel === r.id ? "bg-secondary/50" : "hover:bg-secondary/30"}`}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{r.insured}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {r.states.length > 1
                        ? `${r.states[0].state} +${r.states.length - 1} more`
                        : r.states[0].state}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {r.id} ·{" "}
                    {r.states.length > 1
                      ? `${r.states.filter(stateSatisfied).length} of ${r.states.length} states clear`
                      : `${r.states[0].declinationsOnFile} of ${r.states[0].requiredDeclinations} declinations on file`}
                  </div>
                  <div className="mt-1">
                    <Chip
                      tone={
                        rStatus === "Filed" || rStatus === "Exempt"
                          ? "success"
                          : rStatus === "Ready to file"
                            ? "accent"
                            : "warn"
                      }
                    >
                      {rStatus}
                    </Chip>
                  </div>
                </button>
              );
            })}
          </ul>
        </Panel>

        <div className="space-y-5">
          <Panel>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-mono text-muted-foreground">
                  {d.id} · {d.states.length} state{d.states.length > 1 ? "s" : ""}
                </div>
                <h2 className="mt-1 font-serif text-2xl">{d.insured}</h2>
              </div>
              <Chip
                tone={
                  overallStatus(d) === "Filed" || overallStatus(d) === "Exempt"
                    ? "success"
                    : overallStatus(d) === "Ready to file"
                      ? "accent"
                      : "warn"
                }
              >
                {overallStatus(d)}
              </Chip>
            </div>
          </Panel>

          <Panel
            title="Per-state breakdown (DS-01 / DS-02)"
            actions={<FoundationBadge kind="matching" />}
          >
            <ul className="divide-y divide-border rounded-lg border border-border">
              {d.states.map((s) => (
                <li key={s.state}>
                  <button
                    onClick={() => setSelState(s.state)}
                    className={`flex w-full items-start justify-between gap-3 p-3 text-left text-sm ${s.state === activeStateName ? "bg-secondary/50" : "hover:bg-secondary/30"}`}
                  >
                    <div>
                      <div className="font-medium">{s.state}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {s.requirementStatus === "Required"
                          ? `Requires ${s.requiredDeclinations} declinations (DS-01)`
                          : s.requirementStatus === "Export-list eligible"
                            ? "Export-list eligible — no declinations needed (DS-02)"
                            : "Not required for this class/TIV (DS-01)"}
                      </div>
                    </div>
                    <Chip
                      tone={
                        s.status === "Filed" || s.status === "Exempt"
                          ? "success"
                          : s.status === "Ready to file"
                            ? "accent"
                            : "warn"
                      }
                    >
                      {s.status}
                    </Chip>
                  </button>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title={`${state.state} requirement`}
            subtitle={
              d.states.length > 1 ? "Selected state — click another above to switch" : undefined
            }
          >
            {state.requirementStatus !== "Required" ? (
              <p className="text-sm text-foreground">
                {state.requirementStatus === "Export-list eligible"
                  ? `${state.state} allows this class onto its export list — pre-approved for non-admitted placement without a declination search (DS-02).`
                  : `${state.state} does not require diligent-search documentation for this class of business at this TIV — confirmed not required against the current per-state requirement reference (DS-01).`}
              </p>
            ) : (
              <p className="text-sm text-foreground">
                {state.state} requires <b>{state.requiredDeclinations} declinations</b> from
                admitted markets before this risk can be placed non-admitted (DS-01).{" "}
                {state.declinationsOnFile} of {state.requiredDeclinations} are on file with
                sufficient written evidence.
              </p>
            )}
          </Panel>

          {state.requirementStatus === "Required" && (
            <Panel title="Declination evidence tracker">
              <ul className="divide-y divide-border rounded-lg border border-border">
                {Array.from({ length: state.requiredDeclinations }).map((_, i) => {
                  const has = i < state.declinationsOnFile;
                  const sufficient =
                    has && (state.evidenceSufficient || i < state.declinationsOnFile - 1);
                  return (
                    <li key={i} className="flex items-start gap-3 p-3 text-sm">
                      {has ? (
                        sufficient ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        ) : (
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
                        )
                      ) : (
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">Declination {i + 1}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {has
                            ? sufficient
                              ? "Written evidence on file — sufficient"
                              : "On file but evidence insufficient — see missing evidence detail below"
                            : "Not yet received"}
                        </div>
                      </div>
                      {!has && (
                        <Button variant="secondary" className="!py-1 !text-xs">
                          Chase market
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Panel>
          )}

          {state.missingDeclinations.length > 0 && (
            <Panel title="Missing evidence detail">
              <ul className="space-y-3">
                {state.missingDeclinations.map((md) => (
                  <li
                    key={md.market}
                    className="rounded-lg border-2 border-warn/40 bg-warn/5 p-3 text-sm"
                  >
                    <div className="flex items-center gap-2 font-medium text-warn">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      {md.market}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      <b>What's wrong:</b> {md.issue}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      <b>Needed to satisfy {state.state}'s minimum:</b> {md.neededEvidence}
                    </div>
                  </li>
                ))}
              </ul>
              {state.escalation && (
                <div className="mt-3 rounded-lg border border-border p-3 text-sm">
                  <div className="flex items-center gap-2 font-medium">
                    <Gavel className="h-4 w-4 shrink-0 text-accent" />
                    Ambiguous determination
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{state.escalation.reason}</p>
                  {isEscalated ? (
                    <div className="mt-2">
                      <Chip tone="accent">Escalated to compliance — awaiting legal review</Chip>
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      className="mt-2 !py-1 !text-xs"
                      onClick={() => setEscalated((prev) => ({ ...prev, [escalationKey]: true }))}
                    >
                      <Gavel className="h-3.5 w-3.5" />
                      Escalate to compliance
                    </Button>
                  )}
                </div>
              )}
            </Panel>
          )}

          <Panel
            title="Record retention (DS-05)"
            subtitle="Illustrative reference — verify against current state statute text"
          >
            <div className="flex items-start gap-2 rounded-lg border border-border p-3 text-sm">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <div className="font-medium">{state.retention.period}</div>
                <div className="text-[11px] text-muted-foreground">{state.retention.rule}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  The final record (or exemption determination) for {state.state} is retained
                  accordingly once filed or confirmed exempt.
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="Compliant documentation">
            {canGenerate ? (
              <div className="rounded-xl border-2 border-success/40 bg-success/5 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <div className="font-serif text-lg">Ready to generate</div>
                </div>
                <p className="mt-2 text-sm">
                  Surplus lines affidavit and diligent-search record will cite every declination on
                  file with source and date. Nothing is generated from summary or verbal evidence.
                </p>
                <div className="mt-3">
                  <Button variant="primary">
                    Generate affidavit <FileSearch className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-warn/40 bg-warn/5 p-4">
                <div className="flex items-center gap-2">
                  <Ban className="h-5 w-5 text-warn" />
                  <div className="font-serif text-lg">Generation blocked</div>
                </div>
                <p className="mt-2 text-sm">
                  {unsatisfiedStates.map((s) => s.state).join(", ")} still{" "}
                  {unsatisfiedStates.length > 1 ? "need" : "needs"} sufficient evidence before
                  documentation can be generated
                  {d.states.length > unsatisfiedStates.length
                    ? ` — ${d.states
                        .filter(stateSatisfied)
                        .map((s) => s.state)
                        .join(
                          ", ",
                        )} ${d.states.filter(stateSatisfied).length > 1 ? "are" : "is"} already clear`
                    : ""}
                  . This gate cannot be overridden from this screen.
                </p>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   9. Carrier Appetite Intelligence Tracking
   ============================================================ */

const APPETITE_BATCH_RUN = {
  lastRunAt: "Feb 03, 2026 · 06:00 ET",
  nextRunAt: "Feb 04, 2026 · 06:00 ET",
  cadence: "Daily batch",
};

export function CarrierAppetiteIntelligence() {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
  const [handedOff, setHandedOff] = useState<Record<string, boolean>>({});

  function dismiss(id: string) {
    setDismissed((prev) => ({ ...prev, [id]: true }));
  }

  function approveAndHandOff(id: string) {
    setHandedOff((prev) => ({ ...prev, [id]: true }));
    navigate({ to: "/app/workflows/$slug", params: { slug: "submission-matching" } });
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        eyebrow="Workflow 09"
        title="Carrier Appetite Intelligence Tracking"
        description="Aggregates signals already logged by Quote Comparison and Renewal Remarketing, and surfaces well-evidenced appetite-shift suggestions for human review."
        actions={
          <Button variant="primary">
            <Download className="h-4 w-4" />
            Export signal log
          </Button>
        }
      />

      <div className="mb-5 flex items-start gap-3 rounded-xl border border-border bg-secondary/40 p-4 text-sm">
        <Radar className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <div>
          <div className="font-medium">v1 scope, kept narrow on purpose</div>
          <div className="text-[11px] text-muted-foreground">
            This workflow only aggregates, suggests, and auto-updates exactly two metadata fields —
            carrier fit score and last-signal date. Treat that as binding, not a starting point to
            expand from.
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3 shrink-0" />
            {APPETITE_BATCH_RUN.cadence} — not real-time. Aggregates QC-03 and RR-08 signals logged
            since the last run. Last run {APPETITE_BATCH_RUN.lastRunAt} · next run{" "}
            {APPETITE_BATCH_RUN.nextRunAt}.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <GovKpi label="Signals this month" value="24" sub="From Quote Comparison + Remarketing" />
        <GovKpi label="Pending review" value="2" sub="Awaiting broker approval" />
        <GovKpi label="Class-level signals" value="16" sub="66% of total" />
        <GovKpi label="Auto-updates applied" value="8" sub="Fit score + last-signal date only" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Panel title="Appetite signal review queue" actions={<FoundationBadge kind="matching" />}>
          <ul className="divide-y divide-border">
            {appetiteSignals.map((s) => {
              const status = dismissed[s.id] ? "Dismissed" : s.status;
              return (
                <li key={s.id} className="py-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{s.carrier}</span>
                        <Chip tone={s.scope === "Class-level" ? "accent" : "neutral"}>
                          {s.scope}
                        </Chip>
                      </div>
                      <div className="text-[11px] text-muted-foreground">{s.classOrAccount}</div>
                      <div className="mt-1 flex items-center gap-1.5">
                        {s.signal.includes("expanding") ? (
                          <TrendingUp className="h-3.5 w-3.5 text-success" />
                        ) : s.signal.includes("tightening") ? (
                          <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                        ) : (
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <span>{s.signal}</span>
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        Evidence: {s.evidence}
                      </div>
                      <div className="mt-1 text-[11px]">
                        <b>Suggested:</b> {s.suggestedAction}
                      </div>
                      {handedOff[s.id] && !dismissed[s.id] && (
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-accent">
                          <ArrowRight className="h-3 w-3 shrink-0" />
                          Routed to Submission Market Matching (Match Rules) — apply the change
                          there. This page never edits the profile directly.
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <Chip
                        tone={
                          status === "Approved"
                            ? "success"
                            : status === "Dismissed"
                              ? "danger"
                              : "warn"
                        }
                      >
                        {status}
                      </Chip>
                      {status === "Pending review" && (
                        <div className="flex gap-1">
                          <Button
                            variant="secondary"
                            className="!py-1 !text-xs"
                            onClick={() => dismiss(s.id)}
                          >
                            Dismiss
                          </Button>
                          <Button
                            variant="primary"
                            className="!py-1 !text-xs"
                            onClick={() => approveAndHandOff(s.id)}
                            title="Routes to the Carrier Appetite Profile interface in Submission Market Matching — no edit happens here"
                          >
                            Approve → apply in profile
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
        <Panel
          title="Suppressed from auto-signal"
          subtitle="Low submission volume — human review required"
        >
          <ul className="divide-y divide-border text-sm">
            <li className="flex items-center justify-between py-3">
              <span>Ategrity Specialty · Marine terminal ops</span>
              <Chip>3 subs / 90d</Chip>
            </li>
            <li className="flex items-center justify-between py-3">
              <span>Palomar Specialty · Environmental</span>
              <Chip>1 sub / 90d</Chip>
            </li>
          </ul>
          <div className="mt-3 text-[11px] text-muted-foreground">
            Volume below the confidence threshold — signals here are logged but never
            auto-suggested.
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel
          title="Decision timeline"
          subtitle="Every AI and human decision, fully auditable"
          actions={<FoundationBadge kind="matching" />}
        >
          <ul className="divide-y divide-border">
            {decisionsLog.map((d, i) => (
              <li key={i} className="flex items-start gap-3 py-3 text-sm">
                <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">{d.at}</span>
                <div className="flex-1">
                  <div>
                    <b>{d.who}</b> — {d.what}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{d.ctx}</div>
                </div>
                {d.conf !== "—" && <Chip>{d.conf}</Chip>}
                <button className="text-[11px] text-muted-foreground hover:text-foreground">
                  View trail →
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

/* ============================================================
   10. Pipeline & Carrier Performance Reporting
   ============================================================ */

const funnel = [
  { stage: "Submissions", count: 274 },
  { stage: "Matched ≥1 market", count: 241 },
  { stage: "Packaged", count: 198 },
  { stage: "Quoted", count: 156 },
  { stage: "Bound", count: 104 },
];

const REPORT_PERIODS = ["Trailing 30 days", "Trailing 90 days", "Trailing 12 months", "YTD"];
const REPORT_GENERATED_AT = "Feb 03, 2026 · 14:22 ET";

function overallCompleteness(rows: typeof pipelineCompleteness) {
  return Math.round(rows.reduce((sum, r) => sum + r.completePct, 0) / rows.length);
}

export function PipelineCarrierReporting() {
  const max = funnel[0].count;
  const [scope, setScope] = useState<{ mode: "Scheduled" | "On-demand"; period: string }>({
    mode: "On-demand",
    period: "Trailing 30 days",
  });

  const overall = overallCompleteness(pipelineCompleteness);
  const worst = [...pipelineCompleteness]
    .filter((w) => w.gap)
    .sort((a, b) => a.completePct - b.completePct)[0];
  const binderGap = pipelineCompleteness.find((w) => w.workflow === "Binder & Policy Issuance");
  const remarketGap = pipelineCompleteness.find((w) => w.workflow === "Renewal Remarketing");

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        eyebrow="Workflow 10"
        title="Pipeline & Carrier Performance Reporting"
        description="Aggregates logs from all six prior workflows into a funnel view, carrier hit-rate comparison, and remarketing value report — scheduled or on-demand, for a selected reporting period."
        actions={
          <Button variant="secondary">
            <Download className="h-4 w-4" />
            Export book pack
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-secondary/40 p-4 text-sm">
        <div className="flex flex-wrap items-center gap-3">
          <Tabs
            tabs={["Scheduled", "On-demand"]}
            value={scope.mode}
            onChange={(v) => setScope((p) => ({ ...p, mode: v as "Scheduled" | "On-demand" }))}
          />
          <Tabs
            tabs={REPORT_PERIODS}
            value={scope.period}
            onChange={(v) => setScope((p) => ({ ...p, period: v }))}
          />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3 shrink-0" />
          Pulls logs from all six prior workflows for the selected period.{" "}
          {scope.mode === "Scheduled"
            ? "Scheduled — next run Mon 06:00 ET."
            : `On-demand — generated now, ${REPORT_GENERATED_AT}.`}
        </div>
      </div>

      <div className="mb-5">
        <Panel
          title="Data completeness (PR-06)"
          subtitle="Checked before any calculation below runs — not a footnote"
          actions={<FoundationBadge kind="matching" />}
        >
          <div
            className={`mb-3 flex items-start gap-2 rounded-lg border-2 p-3 text-sm ${overall === 100 ? "border-success/40 bg-success/5" : "border-warn/40 bg-warn/5"}`}
          >
            {overall === 100 ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
            )}
            <div>
              <b>Overall: {overall}% complete.</b>{" "}
              {worst
                ? `${worst.workflow} has the largest gap — ${worst.gap}.`
                : "All six source workflows are fully complete for this period."}
            </div>
          </div>
          <ul className="divide-y divide-border">
            {pipelineCompleteness.map((w) => (
              <li key={w.workflow} className="flex items-center justify-between gap-3 py-2 text-sm">
                <div className="flex-1">
                  <div className="font-medium">{w.workflow}</div>
                  {w.gap && <div className="text-[11px] text-warn">{w.gap}</div>}
                </div>
                <Chip tone={w.completePct === 100 ? "success" : "warn"}>{w.completePct}%</Chip>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <GovKpi
          label="Bound premium YTD"
          value="$48.2M"
          sub={binderGap?.gap ? `+14% YoY · Binder: ${binderGap.gap}` : "+14% YoY"}
        />
        <GovKpi label="Hit ratio" value="38.4%" sub="+1.7pp" />
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Avg placement cycle (PR-03)
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl leading-none">
              {placementCycle.delayExcluded}d
            </span>
            <span className="text-[11px] text-muted-foreground">delay-excluded</span>
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Raw {placementCycle.raw}d · excludes {placementCycle.avgBrokerAgentDelay}d avg
            broker/agent delay · target {placementCycle.target}
          </div>
        </div>
        <GovKpi
          label="Renewal retention"
          value="92%"
          sub={remarketGap?.gap ? `+3pp · Remarketing: ${remarketGap.gap}` : "+3pp"}
        />
        <GovKpi label="Policies in force" value="2,148" sub="+118 net" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Panel
          className="lg:col-span-2"
          title="Submission → bound funnel"
          subtitle={`${scope.period} · 104 of 274 submissions bound (38.0%)`}
        >
          <div className="space-y-3 pt-2">
            {funnel.map((f) => (
              <div key={f.stage} className="flex items-center gap-3 text-sm">
                <div className="w-40 shrink-0 text-xs text-muted-foreground">{f.stage}</div>
                <div className="h-6 flex-1 overflow-hidden rounded-md bg-secondary">
                  <div
                    className="flex h-full items-center justify-end bg-accent px-2 text-[10px] font-mono text-accent-foreground"
                    style={{ width: `${(f.count / max) * 100}%` }}
                  >
                    {f.count}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[10px] text-muted-foreground">
            Low-volume annotation: state- and class-level cuts below 10 submissions/mo are flagged,
            not silently averaged in.
          </div>
        </Panel>
        <Panel title="Premium by state · $M">
          <div className="space-y-2">
            {stateMix.map((s) => {
              const max2 = Math.max(...stateMix.map((x) => x.premium));
              return (
                <div key={s.state} className="flex items-center gap-3 text-xs">
                  <div className="w-8">{s.state}</div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-foreground"
                      style={{ width: `${(s.premium / max2) * 100}%` }}
                    />
                  </div>
                  <div className="w-12 text-right font-mono">${s.premium.toFixed(1)}M</div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Panel title="Carrier hit-rate comparison">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-2 text-left">Carrier</th>
                <th className="py-2 text-right">Submissions</th>
                <th className="py-2 text-right">Quoted</th>
                <th className="py-2 text-right">Bound</th>
                <th className="py-2 text-right">Hit ratio</th>
                <th className="py-2 text-right">Avg turnaround</th>
                <th className="py-2 text-right">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {carrierPerformance.map((c) => (
                <tr key={c.carrier} className="hover:bg-secondary/40">
                  <td className="py-2.5 font-medium">{c.carrier}</td>
                  <td className="py-2.5 text-right">{c.submissions}</td>
                  <td className="py-2.5 text-right">{c.quoted}</td>
                  <td className="py-2.5 text-right">{c.bound}</td>
                  <td className="py-2.5 text-right font-mono">{c.hitRate}</td>
                  <td className="py-2.5 text-right font-mono">{c.avgTurnaround}</td>
                  <td className="py-2.5 text-right font-mono">{c.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
        <Panel title="Remarketing value report" actions={<FoundationBadge kind="matching" />}>
          <div className="space-y-3 text-sm">
            <div className="rounded-lg border border-border p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Accounts remarketed, {scope.period}
              </div>
              <div className="mt-1 font-serif text-2xl">18</div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Premium improvement captured
              </div>
              <div className="mt-1 font-serif text-2xl">$212k</div>
              <div className="text-[11px] text-muted-foreground">
                vs. incumbent's initial renewal indication
              </div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Retention on remarketed accounts
              </div>
              <div className="mt-1 font-serif text-2xl">78%</div>
              <div className="text-[11px] text-muted-foreground">
                Moved to a new market but stayed on the book
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Top retail agencies">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-2 text-left">Agency</th>
                <th className="py-2 text-right">Submissions</th>
                <th className="py-2 text-right">Packaged</th>
                <th className="py-2 text-right">Bound</th>
                <th className="py-2 text-right">Hit ratio</th>
                <th className="py-2 text-right">Avg response time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {retailAgents.map((a) => (
                <tr key={a.agency} className="hover:bg-secondary/40">
                  <td className="py-2.5 font-medium">{a.agency}</td>
                  <td className="py-2.5 text-right">{a.submissions}</td>
                  <td className="py-2.5 text-right">{a.packaged}</td>
                  <td className="py-2.5 text-right">{a.bound}</td>
                  <td className="py-2.5 text-right font-mono">{a.hitRate}</td>
                  <td className="py-2.5 text-right font-mono">{a.avgResponseTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Executive AI insight" actions={<FoundationBadge kind="matching" />}>
          <p className="text-sm">
            Placement cycle is averaging 6.4 days against a 2–3 day target — Ategrity Specialty's
            9.4-day turnaround is the single largest drag on the panel average. Kinsale Insurance is
            the strongest overall channel (42% hit ratio, 4.1-day turnaround) — recommend routing
            more marginal-fit cold-storage and habitational risk to them first. Watch item: CO
            contractor excess hit ratio has fallen 6pp since the last appetite signal from Markel.
          </p>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary">Generate board pack</Button>
            <Button variant="ghost">Share with team</Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
