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
  matchRules,
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

  function toggleCarrier(carrier: string) {
    setSelectedCarriers((prev) =>
      prev.includes(carrier) ? prev.filter((c) => c !== carrier) : [...prev, carrier],
    );
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
                  onClick={() =>
                    navigate({
                      to: "/app/workflows/$slug",
                      params: { slug: "package-assembly" },
                      search: { submissionId: s.id, carriers: selectedCarriers.join(",") },
                    })
                  }
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
                />
              )}
              {tab === "Match rules" && <MatchRulesTab />}
              {tab === "AI recommendation" && <MatchRecommendationTab />}
              {tab === "Activity" && <ActivityTab />}
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
}: {
  selected: string[];
  onToggle: (carrier: string) => void;
  insured: string;
}) {
  const dsRecord = diligentSearch.find((d) => d.insured === insured);
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
                      ) : dsRecord?.evidenceSufficient || dsRecord?.status === "Exempt" ? (
                        <Chip tone="success">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          {dsRecord.status === "Exempt"
                            ? "Exempt"
                            : `Satisfied (${dsRecord.declinationsOnFile}/${dsRecord.requiredDeclinations})`}
                        </Chip>
                      ) : (
                        <Chip tone="warn">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          {dsRecord
                            ? `Not yet — ${dsRecord.declinationsOnFile}/${dsRecord.requiredDeclinations}`
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

function MatchRulesTab() {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-medium">
          Match rules · top carrier (Kinsale Insurance) · 5 of 6 pass
        </div>
        <FoundationBadge kind="matching" />
      </div>
      <ul className="divide-y divide-border rounded-lg border border-border">
        {matchRules.map((r) => (
          <li key={r.rule} className="flex items-start gap-3 p-3 text-sm">
            {r.pass ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
            )}
            <div className="flex-1">
              <div className="font-medium">{r.rule}</div>
              <div className="text-[11px] text-muted-foreground">{r.detail}</div>
            </div>
            <Chip tone={r.pass ? "success" : "warn"}>{r.pass ? "Pass" : "Review"}</Chip>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MatchRecommendationTab() {
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
      </div>
      <div className="rounded-xl border border-border p-4">
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Broker decision
        </div>
        <div className="mt-3 space-y-2 text-sm">
          <Button variant="primary" className="w-full justify-center">
            Approve recommendation
          </Button>
          <Button variant="secondary" className="w-full justify-center">
            Modify carrier selection
          </Button>
          <Button variant="secondary" className="w-full justify-center">
            Send to peer review
          </Button>
          <Button variant="danger" className="w-full justify-center">
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

function ActivityTab() {
  return (
    <ul className="divide-y divide-border">
      {decisionsLog.slice(0, 5).map((d, i) => (
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

  const outstandingDocs = market.missingInfo.filter((d) => !receivedDocs.has(d));
  const manualFields = CARRIER_MANUAL_FIELDS[market.carrier] ?? [];
  const unfilledFields = manualFields.filter((f) => !manualValues[f.label]?.trim());
  const dsRecord = diligentSearch.find((d) => d.insured === submission.insured);
  const dsSatisfied = dsRecord
    ? dsRecord.evidenceSufficient || dsRecord.status === "Exempt"
    : false;
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

  async function regenerate() {
    setRegenerating(true);
    setRegenError("");
    try {
      // TODO: replace with a real drafting call once Package Assembly has a backend —
      // this only re-runs the same local template, it doesn't call an LLM.
      const next = await simulateRequest(buildCoverLetter(market, submission));
      setCoverLetter(next);
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
              Attached — {dsRecord?.declinationsOnFile}/{dsRecord?.requiredDeclinations}{" "}
              declinations on file, evidence sufficient.
            </div>
          ) : (
            <div className="flex items-start justify-between gap-2 rounded-lg border border-warn/30 bg-warn/5 p-3 text-[12px] text-foreground">
              <span className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
                Not attached — {dsRecord?.declinationsOnFile ?? 0}/
                {dsRecord?.requiredDeclinations ?? "?"} declinations on file.
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

      {/* Send boundary — non-negotiable: assemble/draft only, broker sends manually */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-border bg-secondary/30 p-3">
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
              variant={status === "BLOCKED" ? "secondary" : "primary"}
              disabled={status === "BLOCKED"}
              title={
                status === "BLOCKED"
                  ? "Resolve the blocked items above first"
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
              <div className="flex items-center gap-3 py-8 text-sm text-muted-foreground">
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

export function RetailAgentCopilot() {
  const threads = [
    {
      id: 1,
      agent: "Ana Ruiz · Marsh Southeast",
      subject: "Palmetto Cold Storage — market Q&A",
      unread: true,
      snippet: "Confirming spoilage sub-limit at $500k…",
      when: "8:42 AM",
    },
    {
      id: 2,
      agent: "Michael Chen · HUB International",
      subject: "Ridgeline Contractors — missing SOV",
      unread: true,
      snippet: "Attached is the schedule you requested…",
      when: "8:11 AM",
    },
    {
      id: 3,
      agent: "Priya Natarajan · Alliant",
      subject: "Bayou Marine — placement update",
      unread: false,
      snippet: "Any early read on markets?…",
      when: "Yesterday",
    },
    {
      id: 4,
      agent: "Jordan Blake · Gallagher",
      subject: "Highline Hospitality — no-market notice",
      unread: false,
      snippet: "Understood, thanks for the quick turn…",
      when: "Jan 09",
    },
  ];
  const [active, setActive] = useState(1);
  const drafts = [
    {
      title: "Quote summary",
      tone: "Warm",
      body: "Hi Ana, great news on Palmetto Cold Storage — Kinsale Insurance has come back with indicated terms of $187,400, including the $500k spoilage sub-limit you asked about. Two more markets are still reviewing. Happy to walk through it on a call.",
    },
    {
      title: "Missing info request",
      tone: "Direct",
      body: "Hi Michael, to keep Ridgeline Contractors moving with our panel we still need a current SOV and 5-year loss run. Would you be able to send those today so we can get markets responding by Wednesday?",
    },
    {
      title: "No-market notice",
      tone: "Considerate",
      body: "Hi Jordan, thanks for thinking of us on Highline Hospitality. After running it across our panel, this one falls outside every carrier's current appetite for the liquor liability exposure — we'd love to see the rest of your submissions this quarter.",
    },
  ];
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

      <div className="grid gap-0 overflow-hidden rounded-2xl border border-border bg-background lg:grid-cols-[280px_minmax(0,1fr)_320px]">
        {/* Threads */}
        <div className="border-r border-border">
          <div className="border-b border-border p-3">
            <SearchBar placeholder="Search retail agents…" />
          </div>
          <ul className="divide-y divide-border">
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`flex w-full flex-col gap-1 p-3 text-left ${active === t.id ? "bg-secondary/60" : "hover:bg-secondary/30"}`}
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t.agent}</span>
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
              To: Ana Ruiz &lt;ana.ruiz@marsh.com&gt;
            </div>
            <div className="font-serif text-lg">Palmetto Cold Storage — market Q&A</div>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto p-4 text-sm">
            <Bubble from="ana" name="Ana Ruiz" at="8:12 AM">
              Hi team — sending over Palmetto Cold Storage. Two new locations in Jacksonville.
              Insured would love to confirm the spoilage sub-limit at $500k. Any early read on
              markets?
            </Bubble>
            <Bubble from="you" name="Coverline AI · drafted" at="8:14 AM" ai>
              Thanks Ana — reviewing now, we're ranking it across our panel and should have
              indicated terms within the hour. Palmetto's loss history and sprinkler profile look
              strong across every carrier we'd send it to. We can confirm the $500k spoilage
              sub-limit is a standard ask.
              <div className="mt-2 flex gap-2 text-xs">
                <Button variant="ghost">Regenerate</Button>
                <Button variant="secondary">Edit</Button>
                <Button variant="primary">
                  Send <Send className="h-3 w-3" />
                </Button>
              </div>
            </Bubble>
            <Bubble from="ana" name="Ana Ruiz" at="8:31 AM">
              Perfect, thank you. Also — will the carrier be disclosed before we get terms, or
              after?
            </Bubble>
            <Bubble from="you" name="Coverline AI · drafted" at="8:42 AM" ai>
              After — per our standard process we don't disclose the carrier name until you've
              confirmed broker of record on this account. Once that's on file we'll name Kinsale
              Insurance directly in the terms letter.
              <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                <Lock className="h-3 w-3" /> Carrier-name disclosure gate — compliance-controlled,
                cannot be bypassed from this draft.
              </div>
              <div className="mt-2 flex gap-2 text-xs">
                <Button variant="ghost">Regenerate</Button>
                <Button variant="secondary">Edit</Button>
                <Button variant="primary">
                  Send <Send className="h-3 w-3" />
                </Button>
              </div>
            </Bubble>
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
                defaultValue="Draft attached — please review and send when ready."
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
                  <Button variant="primary">
                    Send <Send className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI drafts */}
        <div className="border-l border-border p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Suggested drafts
            </div>
            <FoundationBadge kind="matching" />
          </div>
          <div className="space-y-3">
            {drafts.map((d) => (
              <div key={d.title} className="rounded-lg border border-border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{d.title}</div>
                  <Chip tone="accent">{d.tone}</Chip>
                </div>
                <p className="mt-1.5 line-clamp-3 text-[11px] text-muted-foreground">{d.body}</p>
                <div className="mt-2 flex justify-end gap-1">
                  <Button variant="ghost" className="!py-1 !text-xs">
                    Preview
                  </Button>
                  <Button variant="secondary" className="!py-1 !text-xs">
                    Use draft
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
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
          AR
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

export function QuoteComparison() {
  const responded = quotes.filter((q) => q.status !== "Declined").length;
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
            { label: "Recommendation drafted — 94% confidence", kind: "matching" },
          ]}
        />
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
                    <td className="py-2.5 pl-4 text-xs">{q.validUntil}</td>
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
            <Button variant="primary" className="w-full justify-center">
              Present to retail agent
            </Button>
            <Button variant="secondary" className="w-full justify-center">
              Request revised terms
            </Button>
            <Button variant="danger" className="w-full justify-center">
              Decline all — remarket
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ============================================================
   5. Binder & Policy Issuance Coordination
   ============================================================ */

export function BinderIssuance() {
  const [sel, setSel] = useState(binders[0].id);
  const b = binders.find((x) => x.id === sel)!;
  const steps = [
    { label: "Selected quote received", done: true, note: `${b.carrier} · ${b.premium}` },
    {
      label: "Bind request sent to carrier",
      done: true,
      note: "Sent with signed application + subjectivity tracker",
    },
    {
      label: "Subjectivity clearance",
      done: b.subjectivitiesCleared === b.subjectivitiesTotal,
      active: b.subjectivitiesCleared < b.subjectivitiesTotal,
      note: `${b.subjectivitiesCleared} of ${b.subjectivitiesTotal} cleared`,
    },
    {
      label: "Carrier bind confirmation reconciled",
      done: b.status === "Bound — awaiting policy" || b.status === "Issued",
      active: b.status === "Ready to bind",
      note: "Checked line-by-line against agreed terms — 0 discrepancies",
    },
    {
      label: "Issued policy reconciled against binder",
      done: b.status === "Issued",
      active: b.status === "Bound — awaiting policy",
      note: "Declarations page compared to bound terms",
    },
    {
      label: "Retail agent & insured notified",
      done: b.status === "Issued",
      note: "One-click notification",
    },
  ];
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        eyebrow="Workflow 05"
        title="Binder & Policy Issuance Coordination"
        description="From selected quote to bound policy — subjectivity clearance, carrier bind confirmation, and issued-policy reconciliation, all checked against what was actually agreed."
        actions={<Button variant="primary">Issue binder</Button>}
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
                  {s.active && (
                    <Button variant="primary" className="!py-1 !text-xs">
                      Run
                    </Button>
                  )}
                </li>
              ))}
            </ol>
          </Panel>

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
                  {b.subjectivitiesCleared} of {b.subjectivitiesTotal} subjectivities satisfied.
                  Premium {b.premium}, effective {b.effective}. Never treats a carrier document as
                  authoritative without reconciling it against the terms actually agreed.
                </p>
              </div>
            </Panel>
            <Panel title="Policy issuance">
              <div className="space-y-2 text-sm">
                <ProgressRow
                  label="Bind confirmation reconciled"
                  pct={b.status === "Subjectivities open" ? 40 : 100}
                />
                <ProgressRow
                  label="Policy jacket assembly"
                  pct={b.status === "Issued" ? 100 : 70}
                />
                <ProgressRow
                  label="Declarations reconciliation"
                  pct={
                    b.status === "Issued" ? 100 : b.status === "Bound — awaiting policy" ? 55 : 0
                  }
                />
                <ProgressRow label="Surplus lines filing" pct={b.status === "Issued" ? 100 : 30} />
                <ProgressRow
                  label="PAS / book-of-record write-back"
                  pct={b.status === "Issued" ? 100 : 0}
                />
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   6. Endorsement / Mid-Term Change Processing
   ============================================================ */

export function EndorsementProcessing() {
  const [sel, setSel] = useState(midTermChanges[0].id);
  const e = midTermChanges.find((x) => x.id === sel)!;
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        eyebrow="Workflow 06"
        title="Endorsement / Mid-Term Change Processing"
        description="AI classifies materiality, rechecks appetite against the carrier's current profile, and reconciles multi-part requests item by item before pricing the change."
        actions={<Button variant="primary">Approve endorsement</Button>}
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
                <div className="mt-1 text-xs text-muted-foreground">Requested change: {e.type}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary">Return to agent</Button>
                <Button variant="primary">Approve · issue endorsement</Button>
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
              <Row label="Premium" prior="$187,400" now="$201,600" change="+$14,200" strong />
            </div>
          </Panel>

          <div className="grid gap-5 md:grid-cols-3">
            <Panel
              title="Materiality classification"
              actions={
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
              }
            >
              <p className="text-sm text-muted-foreground">
                {e.materiality === "Complex"
                  ? "Multi-part request — each item reconciled independently below before a combined price is drafted."
                  : e.materiality === "Material"
                    ? "Changes total exposure or limits enough to require a full appetite recheck before pricing."
                    : "No change to exposure basis — priced automatically, routed for a light-touch approval."}
              </p>
            </Panel>
            <Panel title="Appetite recheck" actions={<FoundationBadge kind="matching" />}>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  New location within {e.carrier}'s permitted state list
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  TIV still under carrier's treaty cap
                </li>
                <li className="flex items-center gap-2">
                  <Chip
                    tone={
                      e.appetiteRecheck === "Still in appetite"
                        ? "success"
                        : e.appetiteRecheck === "Marginal — review"
                          ? "warn"
                          : "danger"
                    }
                  >
                    {e.appetiteRecheck}
                  </Chip>
                </li>
              </ul>
            </Panel>
            <Panel title="Item-level reconciliation">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {e.type.split(" + ")[0]} — reconciled
                </li>
                {e.type.includes("+") && (
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    {e.type.split(" + ")[1]} — reconciled independently
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  Combined premium impact: {e.impact}
                </li>
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   7. Renewal Remarketing
   ============================================================ */

export function RenewalRemarketing() {
  const [selected, setSelected] = useState(remarketing[0].id);
  const r = remarketing.find((x) => x.id === selected)!;
  const triggerTone =
    r.trigger === "Renew as-is"
      ? "success"
      : r.trigger === "Monitor"
        ? "neutral"
        : r.trigger === "Remarket — competitive check"
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
                    row.trigger === "Renew as-is"
                      ? "success"
                      : row.trigger === "Monitor"
                        ? "neutral"
                        : row.trigger === "Remarket — competitive check"
                          ? "warn"
                          : "danger"
                  }
                >
                  {row.trigger}
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
                <Button variant="secondary">Request information</Button>
                <Button variant="danger">Non-renew</Button>
                <Button variant="primary">Approve recommendation</Button>
              </div>
            </div>
          </Panel>

          <Panel
            title="Side-by-side comparison"
            subtitle="Prior term vs. renewal submission"
            actions={<FoundationBadge kind="extraction" />}
          >
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
                label="Incumbent responsiveness"
                prior="—"
                now={r.incumbentResponsive ? "Responsive" : "Non-responsive — 12+ business days"}
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
              actions={<Chip tone={triggerTone}>{r.trigger}</Chip>}
            >
              <p className="text-sm text-foreground">
                {r.trigger === "Renew as-is" &&
                  "Exposure and loss trend are stable and the incumbent remains responsive — recommend renewing as-is with no remarket effort."}
                {r.trigger === "Monitor" &&
                  "Exposure growth is within normal range and the incumbent is responsive. No remarket action needed this cycle — flagged for a closer look next renewal if the trend continues."}
                {r.trigger === "Remarket — competitive check" &&
                  "Rate change and exposure growth justify a light competitive check against 1–2 alternate markets, without disrupting the incumbent relationship."}
                {r.trigger === "Remarket — active shop" &&
                  "Incumbent has gone non-responsive and loss trend has deteriorated — recommend an active shop across the full panel before the expiring date."}
              </p>
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                <li>· Flag: {r.flag}</li>
                <li>
                  · Remarketing-history weighting: this account has been remarketed 0 times in the
                  last 3 years
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
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   8. Diligent Search & Compliance Documentation
   ============================================================ */

export function DiligentSearchCompliance() {
  const [sel, setSel] = useState(diligentSearch[0].id);
  const d = diligentSearch.find((x) => x.id === sel)!;
  const canGenerate = d.status === "Exempt" || d.evidenceSufficient;
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        eyebrow="Workflow 08"
        title="Diligent Search & Compliance Documentation"
        description="Per-state diligent-search requirements, declination evidence sufficiency, and compliant surplus-lines documentation — gated so nothing generates on incomplete evidence."
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
            {diligentSearch.map((r) => (
              <button
                key={r.id}
                onClick={() => setSel(r.id)}
                className={`w-full py-3 text-left ${sel === r.id ? "bg-secondary/50" : "hover:bg-secondary/30"}`}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{r.insured}</span>
                  <span className="text-[11px] text-muted-foreground">{r.state}</span>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {r.id} · {r.declinationsOnFile} of {r.requiredDeclinations} declinations on file
                </div>
                <div className="mt-1">
                  <Chip
                    tone={
                      r.status === "Filed" || r.status === "Exempt"
                        ? "success"
                        : r.status === "Ready to file"
                          ? "accent"
                          : "warn"
                    }
                  >
                    {r.status}
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
                  {d.id} · {d.state}
                </div>
                <h2 className="mt-1 font-serif text-2xl">{d.insured}</h2>
              </div>
              <Chip
                tone={
                  d.status === "Filed" || d.status === "Exempt"
                    ? "success"
                    : d.status === "Ready to file"
                      ? "accent"
                      : "warn"
                }
              >
                {d.status}
              </Chip>
            </div>
          </Panel>

          <Panel title="Per-state requirement" actions={<FoundationBadge kind="matching" />}>
            {d.status === "Exempt" ? (
              <p className="text-sm text-foreground">
                {d.state} does not require diligent-search documentation for this class of business
                at this TIV — confirmed exempt against the current per-state requirement reference.
                No declinations needed.
              </p>
            ) : (
              <p className="text-sm text-foreground">
                {d.state} requires <b>{d.requiredDeclinations} declinations</b> from admitted
                markets before this risk can be placed non-admitted. {d.declinationsOnFile} of{" "}
                {d.requiredDeclinations} are on file with sufficient written evidence.
              </p>
            )}
          </Panel>

          {d.status !== "Exempt" && (
            <Panel title="Declination evidence tracker">
              <ul className="divide-y divide-border rounded-lg border border-border">
                {Array.from({ length: d.requiredDeclinations }).map((_, i) => {
                  const has = i < d.declinationsOnFile;
                  const sufficient = has && (d.evidenceSufficient || i < d.declinationsOnFile - 1);
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
                              : "On file but evidence insufficient — needs a dated written declination, not a verbal note"
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
                  Evidence is insufficient for at least one required declination. Chase the
                  outstanding market(s) before documentation can be generated — this gate cannot be
                  overridden from this screen.
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

export function CarrierAppetiteIntelligence() {
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
            {appetiteSignals.map((s) => (
              <li key={s.id} className="py-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{s.carrier}</span>
                      <Chip tone={s.scope === "Class-level" ? "accent" : "neutral"}>{s.scope}</Chip>
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
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Chip
                      tone={
                        s.status === "Approved"
                          ? "success"
                          : s.status === "Dismissed"
                            ? "danger"
                            : "warn"
                      }
                    >
                      {s.status}
                    </Chip>
                    {s.status === "Pending review" && (
                      <div className="flex gap-1">
                        <Button variant="secondary" className="!py-1 !text-xs">
                          Dismiss
                        </Button>
                        <Button variant="primary" className="!py-1 !text-xs">
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
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

export function PipelineCarrierReporting() {
  const max = funnel[0].count;
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        eyebrow="Workflow 10"
        title="Pipeline & Carrier Performance Reporting"
        description="Aggregates every pipeline workflow's logs into a funnel view, carrier hit-rate comparison, and remarketing value report."
        actions={
          <Button variant="secondary">
            <Download className="h-4 w-4" />
            Export book pack
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <GovKpi label="Bound premium YTD" value="$48.2M" sub="+14% YoY" />
        <GovKpi label="Hit ratio" value="38.4%" sub="+1.7pp" />
        <GovKpi label="Avg placement cycle" value="6.4 days" sub="Target 2–3 days" />
        <GovKpi label="Renewal retention" value="92%" sub="+3pp" />
        <GovKpi label="Policies in force" value="2,148" sub="+118 net" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Panel
          className="lg:col-span-2"
          title="Submission → bound funnel"
          subtitle="Trailing 30 days · 104 of 274 submissions bound (38.0%)"
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
                Accounts remarketed, trailing 12mo
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
