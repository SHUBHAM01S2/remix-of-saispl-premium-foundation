import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  upsertReport,
  type ClientReport,
  slugifyClient,
} from "@/lib/reports-admin.functions";

type Props = { existing?: ClientReport };

function toMonthInput(iso: string): string {
  // month stored as date (YYYY-MM-DD); input[type=month] wants YYYY-MM
  return iso.slice(0, 7);
}

function fromMonthInput(value: string): string {
  // YYYY-MM -> YYYY-MM-01
  return `${value}-01`;
}

export function ReportForm({ existing }: Props) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const upsertFn = useServerFn(upsertReport);

  const [clientName, setClientName] = useState(existing?.client_name ?? "");
  const [month, setMonth] = useState<string>(
    existing?.month
      ? toMonthInput(existing.month)
      : new Date().toISOString().slice(0, 7),
  );
  const [uptime, setUptime] = useState<string>(
    String(existing?.uptime_percentage ?? 100),
  );
  const [visitors, setVisitors] = useState<string>(
    String(existing?.site_visitors ?? 0),
  );
  const [leads, setLeads] = useState<string>(
    String(existing?.leads_from_forms ?? 0),
  );
  const [whatsapp, setWhatsapp] = useState<string>(
    String(existing?.whatsapp_taps ?? 0),
  );
  const [topPages, setTopPages] = useState<string>(
    (existing?.top_pages ?? []).join("\n"),
  );
  const [workDone, setWorkDone] = useState(existing?.work_done_this_month ?? "");
  const [recommendation, setRecommendation] = useState(
    existing?.next_month_recommendation ?? "",
  );
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      upsertFn({
        data: {
          id: existing?.id,
          client_name: clientName,
          month: fromMonthInput(month),
          uptime_percentage: Number(uptime) || 0,
          site_visitors: Number(visitors) || 0,
          leads_from_forms: Number(leads) || 0,
          whatsapp_taps: Number(whatsapp) || 0,
          top_pages: topPages
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          work_done_this_month: workDone || null,
          next_month_recommendation: recommendation || null,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "reports"] });
      navigate({ to: "/admin/reports" });
    },
    onError: (e) => setError(e instanceof Error ? e.message : "Failed to save"),
  });

  const slugPreview = clientName ? slugifyClient(clientName) : "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        mutation.mutate();
      }}
      className="space-y-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Client name" required>
          <input
            type="text"
            required
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className={inputCls}
          />
          {slugPreview && (
            <p className="mt-1 text-xs text-muted-foreground">
              Report URL: <code>/client-reports/{slugPreview}</code>
            </p>
          )}
        </Field>
        <Field label="Month" required>
          <input
            type="month"
            required
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Uptime %">
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={uptime}
            onChange={(e) => setUptime(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Site visitors">
          <input
            type="number"
            min="0"
            value={visitors}
            onChange={(e) => setVisitors(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Leads generated">
          <input
            type="number"
            min="0"
            value={leads}
            onChange={(e) => setLeads(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="WhatsApp taps">
          <input
            type="number"
            min="0"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Top pages (one per line)">
        <textarea
          rows={3}
          value={topPages}
          onChange={(e) => setTopPages(e.target.value)}
          placeholder={"/\n/services\n/contact"}
          className={inputCls}
        />
      </Field>

      <Field label="Work done this month">
        <textarea
          rows={5}
          value={workDone}
          onChange={(e) => setWorkDone(e.target.value)}
          placeholder="Bullet list or paragraphs describing work completed…"
          className={inputCls}
        />
      </Field>

      <Field label="Next month's recommendation">
        <textarea
          rows={4}
          value={recommendation}
          onChange={(e) => setRecommendation(e.target.value)}
          placeholder="What we recommend for next month…"
          className={inputCls}
        />
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-60"
        >
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {existing ? "Save changes" : "Create report"}
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/admin/reports" })}
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}
