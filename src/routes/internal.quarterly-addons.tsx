import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Lock, Plus, Trash2, CalendarClock, User } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";

const ADDON_TYPES = [
  "New seasonal landing page",
  "WhatsApp broadcast campaign setup",
  "Speed and SEO audit + implementation",
  "Year-end website refresh",
] as const;

const STATUSES = ["Scheduled", "In Progress", "Completed"] as const;
type Status = (typeof STATUSES)[number];

type Addon = {
  id: string;
  client_name: string;
  quarter: string;
  addon_type: (typeof ADDON_TYPES)[number];
  status: Status;
  scheduled_date: string | null;
  completed_date: string | null;
  created_at: string;
};

export const Route = createFileRoute("/internal/quarterly-addons")({
  head: () => ({
    meta: [
      { title: "Internal — Quarterly Retention Add-ons" },
      { name: "robots", content: "noindex,nofollow,noarchive" },
    ],
  }),
  component: QuarterlyAddonsAdmin,
});

function QuarterlyAddonsAdmin() {
  const [rows, setRows] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientFilter, setClientFilter] = useState("");
  const [quarterFilter, setQuarterFilter] = useState("");
  const [form, setForm] = useState({
    client_name: "",
    quarter: currentQuarter(),
    addon_type: ADDON_TYPES[0] as (typeof ADDON_TYPES)[number],
    scheduled_date: "",
  });

  async function load() {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("quarterly_addons")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as Addon[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const clients = useMemo(
    () => Array.from(new Set(rows.map((r) => r.client_name))).sort(),
    [rows],
  );
  const quarters = useMemo(
    () => Array.from(new Set(rows.map((r) => r.quarter))).sort(),
    [rows],
  );

  const filtered = rows.filter(
    (r) =>
      (!clientFilter || r.client_name === clientFilter) &&
      (!quarterFilter || r.quarter === quarterFilter),
  );

  const byStatus = (s: Status) => filtered.filter((r) => r.status === s);

  async function addAddon(e: React.FormEvent) {
    e.preventDefault();
    if (!form.client_name.trim() || !form.quarter.trim()) {
      toast.error("Client name and quarter are required.");
      return;
    }
    const { error } = await (supabase as any).from("quarterly_addons").insert({
      client_name: form.client_name.trim(),
      quarter: form.quarter.trim(),
      addon_type: form.addon_type,
      status: "Scheduled",
      scheduled_date: form.scheduled_date || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Add-on scheduled.");
    setForm({ ...form, client_name: "", scheduled_date: "" });
    load();
  }

  async function updateStatus(id: string, status: Status) {
    const patch: Partial<Addon> = { status };
    if (status === "Completed") patch.completed_date = new Date().toISOString().slice(0, 10);
    const { error } = await (supabase as any)
      .from("quarterly_addons")
      .update(patch)
      .eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  async function removeRow(id: string) {
    const { error } = await (supabase as any).from("quarterly_addons").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div className="bg-background py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
            <Lock className="h-3.5 w-3.5" />
            Internal — Admin Only
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Quarterly Retention Add-ons
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track scheduled and completed retention add-ons per client, per quarter.
          </p>
        </ScrollReveal>

        {/* Add form */}
        <div className="mt-8 rounded-2xl border border-border/50 bg-surface p-5">
          <form onSubmit={addAddon} className="grid grid-cols-1 gap-3 md:grid-cols-5">
            <input
              type="text"
              placeholder="Client name"
              value={form.client_name}
              onChange={(e) => setForm({ ...form, client_name: e.target.value })}
              className={inputCls}
              required
            />
            <input
              type="text"
              placeholder="Quarter (e.g. Q3-2026)"
              value={form.quarter}
              onChange={(e) => setForm({ ...form, quarter: e.target.value })}
              className={inputCls}
              required
            />
            <select
              value={form.addon_type}
              onChange={(e) =>
                setForm({ ...form, addon_type: e.target.value as (typeof ADDON_TYPES)[number] })
              }
              className={inputCls}
            >
              {ADDON_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={form.scheduled_date}
              onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
              className={inputCls}
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground hover:bg-cta/90"
            >
              <Plus className="h-4 w-4" /> Schedule
            </button>
          </form>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className={inputCls + " min-w-[10rem]"}
            >
              <option value="">All clients</option>
              {clients.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
            <select
              value={quarterFilter}
              onChange={(e) => setQuarterFilter(e.target.value)}
              className={inputCls + " min-w-[10rem]"}
            >
              <option value="">All quarters</option>
              {quarters.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>
          {(clientFilter || quarterFilter) && (
            <button
              onClick={() => {
                setClientFilter("");
                setQuarterFilter("");
              }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear filters
            </button>
          )}
          <span className="ml-auto text-xs text-muted-foreground">
            {loading ? "Loading…" : `${filtered.length} add-on(s)`}
          </span>
        </div>

        {/* Kanban */}
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {STATUSES.map((status) => (
            <Column
              key={status}
              status={status}
              items={byStatus(status)}
              onMove={updateStatus}
              onDelete={removeRow}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Column({
  status,
  items,
  onMove,
  onDelete,
}: {
  status: Status;
  items: Addon[];
  onMove: (id: string, s: Status) => void;
  onDelete: (id: string) => void;
}) {
  const tone =
    status === "Scheduled"
      ? "border-sky-400/30 text-sky-300"
      : status === "In Progress"
        ? "border-amber-400/30 text-amber-300"
        : "border-emerald-400/30 text-emerald-300";

  return (
    <div className="rounded-2xl border border-border/50 bg-surface p-4">
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${tone}`}
        >
          {status}
        </span>
        <span className="text-xs text-muted-foreground">{items.length}</span>
      </div>
      <div className="mt-4 space-y-3">
        {items.length === 0 && (
          <p className="rounded-lg border border-dashed border-border/50 px-3 py-6 text-center text-xs text-muted-foreground">
            Nothing here.
          </p>
        )}
        {items.map((a) => (
          <div key={a.id} className="rounded-xl border border-border/50 bg-background p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{a.client_name}</p>
                <p className="text-xs text-muted-foreground">{a.quarter}</p>
              </div>
              <button
                onClick={() => onDelete(a.id)}
                className="text-muted-foreground hover:text-red-400"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-sm text-foreground">{a.addon_type}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              {a.scheduled_date && <span>Scheduled: {a.scheduled_date}</span>}
              {a.completed_date && <span>Completed: {a.completed_date}</span>}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {STATUSES.filter((s) => s !== a.status).map((s) => (
                <button
                  key={s}
                  onClick={() => onMove(a.id, s)}
                  className="rounded-md border border-border bg-surface px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
                >
                  → {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputCls =
  "rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand";

function currentQuarter() {
  const d = new Date();
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `Q${q}-${d.getFullYear()}`;
}
