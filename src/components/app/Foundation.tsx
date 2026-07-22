import {
  Scan,
  Gavel,
  Sparkles,
  ShieldCheck,
  FileText,
  Layers,
  ArrowRight,
  CheckCircle2,
  Send,
  Download,
  Mail,
} from "lucide-react";
import { PageHeader } from "./AppShell";
import { Panel } from "./Workflows";
import { useState } from "react";

const extractionCaps = [
  {
    title: "Email ingestion",
    desc: "Submission mailboxes are read the moment they arrive.",
    metric: "12.4k / mo",
  },
  {
    title: "OCR",
    desc: "Scanned PDFs and handwritten forms parsed into structured data.",
    metric: "99.1% char acc.",
  },
  {
    title: "ACORD extraction",
    desc: "ACORD 125 / 126 / 130 / 140 / 25 / 175 supported out of the box.",
    metric: "24 forms",
  },
  {
    title: "Loss run extraction",
    desc: "Multi-year loss runs from every major carrier reconciled into a single schema.",
    metric: "38 carriers",
  },
  {
    title: "Financials extraction",
    desc: "P&L, balance sheet, and payroll audits parsed with cross-year deltas.",
    metric: "5yr history",
  },
  {
    title: "Schedule of Values",
    desc: "Location-level TIV, occupancy, construction, protection extracted from any SOV format.",
    metric: "Excel + PDF",
  },
  {
    title: "Document classification",
    desc: "Every attachment auto-classified before parsing.",
    metric: "22 classes",
  },
  {
    title: "Cross-document validation",
    desc: "Revenue, address, TIV reconciled across every document.",
    metric: "0-conflict target",
  },
  {
    title: "Confidence scoring",
    desc: "Every field carries a confidence score and a citation to the source page.",
    metric: "Per-field",
  },
  {
    title: "Source citations",
    desc: "Click any extracted field to jump to the exact source in the document viewer.",
    metric: "Traceable",
  },
];

const matchingCaps = [
  {
    title: "Carrier appetite profiles",
    desc: "A manually-curated appetite schema per carrier — class, capacity, state, exclusions.",
  },
  {
    title: "Hard-exclusion rules",
    desc: "Instant disqualification for out-of-appetite class, state, or TIV — no scoring wasted.",
  },
  {
    title: "Soft-scoring ranking",
    desc: "Every non-excluded carrier ranked by composite fit score, explainable factor by factor.",
  },
  {
    title: "Per-carrier missing-info detection",
    desc: "Each carrier's supplemental requirements checked against what's already been extracted.",
  },
  {
    title: "AI explanations",
    desc: "Every ranking includes a plain-English rationale + citations.",
  },
  {
    title: "Human review",
    desc: "Every recommendation routes to a broker before it becomes external action.",
  },
  { title: "Decision logging", desc: "Immutable log of every AI and human decision, exportable." },
  {
    title: "Audit trail",
    desc: "Rule-level explanations, override rationales, and citations tied to each submission.",
  },
];

export function ExtractionCore() {
  return (
    <div className="mx-auto max-w-[1400px] animate-in fade-in-0 duration-500">
      <PageHeader
        eyebrow="Foundation · Shared platform capability"
        title="Extraction Core"
        description="One AI extraction platform reused by every Coverline workflow — from submissions to endorsements to renewals. Shared with the MGA vertical."
        actions={
          <>
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-1 text-[11px]">
              <Scan className="h-3 w-3 text-accent" />
              Used by 8 workflows
            </span>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Panel title="What it does">
          <p className="text-sm text-ink-soft">
            Extraction Core reads the messy inputs of the E&S world — retail-agent emails, ACORD
            forms, SOVs, loss runs, financials, carrier quote/declination emails, bind confirmations
            — and turns them into a consistent, cited data model that every downstream workflow can
            trust.
          </p>
          <div className="mt-4 grid gap-3">
            <MiniStat label="Documents processed / mo" value="47,820" />
            <MiniStat label="Median extraction latency" value="18s" />
            <MiniStat label="Field-level confidence ≥ 95%" value="94.2%" />
            <MiniStat label="Human corrections applied" value="1.8% of fields" />
          </div>
        </Panel>

        <Panel title="Capabilities">
          <ul className="grid gap-3 sm:grid-cols-2">
            {extractionCaps.map((c) => (
              <li key={c.title} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-medium">{c.title}</div>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-mono">
                    {c.metric}
                  </span>
                </div>
                <p className="mt-1 text-[12px] text-muted-foreground">{c.desc}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-5">
        <Panel title="Reused by">
          <div className="flex flex-wrap gap-2">
            {[
              "Market Matching",
              "Package Assembly",
              "Agent Copilot",
              "Quote Comparison",
              "Binder & Issuance",
              "Endorsement Processing",
              "Renewal Remarketing",
              "Diligent Search",
            ].map((w) => (
              <span
                key={w}
                className="rounded-full border border-border bg-secondary px-3 py-1 text-xs"
              >
                {w}
              </span>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between rounded-lg border border-border p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-serif text-lg">{value}</span>
    </div>
  );
}

export function MatchingRankingCore() {
  return (
    <div className="mx-auto max-w-[1400px] animate-in fade-in-0 duration-500">
      <PageHeader
        eyebrow="Foundation · Shared platform capability"
        title="Matching/Ranking Core"
        description="The carrier-panel ranking engine, appetite-profile schema, and audit spine every Coverline wholesale/E&S workflow shares."
        actions={
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-1 text-[11px]">
            <Gavel className="h-3 w-3 text-accent" />
            Used by every workflow
          </span>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Panel title="Capabilities">
          <ul className="grid gap-3 sm:grid-cols-2">
            {matchingCaps.map((c) => (
              <li key={c.title} className="rounded-xl border border-border p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  <div className="font-medium">{c.title}</div>
                </div>
                <p className="mt-1 text-[12px] text-muted-foreground">{c.desc}</p>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Carrier appetite profiles" subtitle="Manually-curated · broker-tunable">
          <ul className="divide-y divide-border">
            {[
              {
                rule: "Kinsale — cold storage / refrigerated warehousing",
                version: "v3.2",
                eval: "2,148",
              },
              {
                rule: "James River — liquor liability, hospitality",
                version: "v2.8",
                eval: "1,984",
              },
              { rule: "Markel — contractor excess", version: "v1.6", eval: "2,110" },
              { rule: "Palomar Specialty — cold storage excluded", version: "v1.0", eval: "412" },
              { rule: "Ategrity — habitational / senior care", version: "v2.1", eval: "1,206" },
              {
                rule: "Berkley Specialty — senior care professional liab.",
                version: "v4.0",
                eval: "1,842",
              },
            ].map((r) => (
              <li key={r.rule} className="flex items-center gap-3 py-3 text-sm">
                <div className="flex-1">
                  <div className="font-medium">{r.rule}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {r.eval} evaluations · {r.version}
                  </div>
                </div>
                <button className="rounded-md border border-border px-2 py-1 text-[11px] transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  Edit
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
   AI Assistant · full-page copilot
   ============================================================ */

export function AssistantPage() {
  const [msg, setMsg] = useState("");
  const suggested = [
    "Summarize submission SUB-24019 and rank the carrier panel",
    "Explain why Northwind Wood Products has no market",
    "Compare the 3 carrier quotes on Highline Hospitality",
    "Draft a no-market notice to Gallagher on Highline",
    "Explain the diligent search status for Bayou Marine Services",
    "Which carriers are trending toward tighter appetite this month?",
    "Identify missing documents on SUB-24017",
    "Summarize the remarket recommendation for Ridgeline Contractors",
    "Summarize the pipeline for the January exec review",
  ];
  return (
    <div className="mx-auto max-w-[1200px] animate-in fade-in-0 duration-500">
      <PageHeader
        eyebrow="Global AI"
        title="Coverline AI Assistant"
        description="One assistant with full context on your placement book — every submission, quote, and decision cited to the source."
      />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Panel className="min-h-[520px]">
          <div className="space-y-4 text-sm">
            <div className="rounded-xl border border-border bg-secondary/40 p-4">
              <div className="mb-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3 w-3 text-accent" /> Coverline AI
              </div>
              <p>
                Good morning Sam. You have 12 submissions awaiting review, 7 renewals up for
                remarket review in the next 30 days, and 2 diligent-search records waiting on
                declination evidence. What would you like to work on?
              </p>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[75%] rounded-xl border border-accent/25 bg-accent/5 p-3">
                Summarize submission SUB-24019 and tell me what's missing before I can package it.
              </div>
            </div>
            <div className="rounded-xl border border-border bg-secondary/40 p-4">
              <div className="mb-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3 w-3 text-accent" /> Coverline AI
              </div>
              <p>
                <b>SUB-24019 · Palmetto Cold Storage LLC</b> — FL warehousing risk from Marsh
                Southeast. TIV $42.8M across 14 locations, sprinklered 92%. Five-year loss ratio
                38%. Ranked against the panel, 4 of 5 carriers are in appetite — Kinsale Insurance
                is the top fit at score 82, ready to package with no missing info.
              </p>
              <p className="mt-2">
                James River and Ategrity Specialty need a fresh sprinkler inspection and a loss run
                addendum, respectively, before they'll firm a quote.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <button className="rounded-md border border-border bg-background px-2.5 py-1.5 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  Draft chase email
                </button>
                <button className="rounded-md border border-border bg-background px-2.5 py-1.5 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  Open submission
                </button>
                <button className="rounded-md border border-border bg-background px-2.5 py-1.5 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  Approve recommendation
                </button>
              </div>
              <div className="mt-3 text-[10px] text-muted-foreground">
                Cited: ACORD_125_Palmetto.pdf p.2 · Loss_Run_5yr.pdf p.4 · Palmetto_SOV_2026.xlsx
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-border p-2 transition-[box-shadow] focus-within:ring-2 focus-within:ring-ring">
            <textarea
              rows={3}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Ask about a submission, carrier panel, retail agent, or the pipeline…"
              className="w-full resize-none bg-transparent p-2 text-sm outline-none"
            />
            <div className="flex items-center gap-2 border-t border-border pt-2">
              <button className="rounded-md p-1.5 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <FileText className="h-4 w-4" />
              </button>
              <button className="rounded-md p-1.5 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Layers className="h-4 w-4" />
              </button>
              <div className="ml-auto">
                <button className="inline-flex items-center gap-2 rounded-md bg-foreground px-3 py-1.5 text-sm text-background transition active:scale-[0.98] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  Send <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Suggested prompts">
          <ul className="space-y-2">
            {suggested.map((s) => (
              <li key={s}>
                <button
                  onClick={() => setMsg(s)}
                  className="group flex w-full items-start gap-2 rounded-lg border border-border p-3 text-left text-sm transition-colors hover:border-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                  <span className="flex-1">{s}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition group-hover:opacity-100" />
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
   Analytics
   ============================================================ */

export function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-[1400px] animate-in fade-in-0 duration-500">
      <PageHeader
        eyebrow="Analytics"
        title="Book analytics"
        description="Real-time cuts across premium, hit ratio, placement cycle, carrier mix, and geography."
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        }
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          { l: "Bound YTD", v: "$48.2M" },
          { l: "Hit ratio", v: "38.4%" },
          { l: "Placement cycle", v: "6.4d" },
          { l: "Retention", v: "92%" },
          { l: "PIF", v: "2,148" },
        ].map((k) => (
          <div key={k.l} className="rounded-xl border border-border bg-background p-4">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{k.l}</div>
            <div className="mt-2 font-serif text-3xl leading-none">{k.v}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Panel title="Placement cycle trend · rolling 12 mo" className="lg:col-span-2">
          <svg viewBox="0 0 600 220" className="h-56 w-full">
            <polyline
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2.5"
              points="0,90 50,92 100,85 150,88 200,78 250,72 300,68 350,65 400,60 450,55 500,52 550,48 600,45"
            />
            <line x1="0" y1="200" x2="600" y2="200" stroke="var(--color-border)" />
            <line
              x1="0"
              y1="50"
              x2="600"
              y2="50"
              stroke="var(--color-border)"
              strokeDasharray="4 4"
            />
            <text x="4" y="48" fontSize="10" fill="var(--color-muted-foreground)">
              Target 2–3 days
            </text>
          </svg>
        </Panel>
        <Panel title="Class mix">
          <ul className="space-y-2 text-sm">
            {[
              ["Habitational", 26],
              ["Contractors / excess", 21],
              ["Hospitality / liquor liab.", 17],
              ["Vacant property", 12],
              ["Environmental", 10],
              ["Other E&S", 14],
            ].map(([n, v]) => (
              <li key={n as string} className="flex items-center gap-3">
                <div className="w-32 text-xs">{n}</div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-foreground transition-[width] duration-700 ease-out"
                    style={{ width: `${(v as number) * 2.5}%` }}
                  />
                </div>
                <div className="w-8 text-right font-mono text-xs">{v}%</div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

/* ============================================================
   Settings
   ============================================================ */

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-[900px] animate-in fade-in-0 duration-500">
      <PageHeader eyebrow="Settings" title="Workspace settings" />
      <div className="space-y-5">
        <Panel title="Organization">
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <Field label="Organization name" value="Meridian Specialty Wholesale" />
            <Field label="Surplus lines license #" value="SL-55648" />
            <Field label="Jurisdictions" value="FL · TX · GA · NC · CO · VA · PA · NY · CA · LA" />
            <Field label="Carrier panel" value="42 markets across E&S / specialty lines" />
          </div>
        </Panel>
        <Panel title="Team">
          <ul className="divide-y divide-border text-sm">
            {[
              ["Sam Delgado", "Sr. Wholesale Broker", "Admin"],
              ["Marcus Webb", "Wholesale Broker", "Editor"],
              ["Elena Cho", "Junior Broker", "Editor"],
              ["Renee Park", "Compliance", "Viewer"],
            ].map((r) => (
              <li key={r[0]} className="flex items-center gap-3 py-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-xs text-background">
                  {r[0]
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{r[0]}</div>
                  <div className="text-[11px] text-muted-foreground">{r[1]}</div>
                </div>
                <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px]">
                  {r[2]}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Notifications">
          <div className="space-y-2 text-sm">
            {[
              "New submissions from priority retail agents",
              "Remarket reviews due in 30 days",
              "AI recommendation confidence below 80%",
              "Diligent search evidence missing",
              "Override submitted",
            ].map((n) => (
              <label
                key={n}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <span>{n}</span>
                <input type="checkbox" defaultChecked className="accent-accent" />
              </label>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}
