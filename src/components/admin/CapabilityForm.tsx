import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  CAPABILITY_ICONS,
  upsertCapability,
  type Capability,
} from "@/lib/capabilities-admin.functions";
import { iconForCapability } from "@/lib/capability-icons";

type Props = { existing?: Capability };

export function CapabilityForm({ existing }: Props) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const upsertFn = useServerFn(upsertCapability);

  const [tag, setTag] = useState(existing?.tag ?? "");
  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [meta, setMeta] = useState(existing?.meta ?? "");
  const [icon, setIcon] = useState(existing?.icon ?? "Globe");
  const [sortOrder, setSortOrder] = useState<number>(existing?.sort_order ?? 0);
  const [isActive, setIsActive] = useState(existing?.is_active ?? true);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      upsertFn({
        data: {
          id: existing?.id,
          tag,
          title,
          description,
          meta,
          icon,
          sort_order: sortOrder,
          is_active: isActive,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "capabilities"] });
      qc.invalidateQueries({ queryKey: ["public", "capabilities"] });
      navigate({ to: "/admin/capabilities" });
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Save failed"),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      className="space-y-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tag" required>
          <input
            required
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="e.g. Engineering"
            className={inputCls}
          />
        </Field>
        <Field label="Title" required>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Web & Software Development"
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Description" required>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={inputCls}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Meta (footer text)">
          <input
            value={meta}
            onChange={(e) => setMeta(e.target.value)}
            placeholder="e.g. React · Node · TS"
            className={inputCls}
          />
        </Field>
        <Field label="Sort order">
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
            className={inputCls}
          />
        </Field>
        <Field label="Active">
          <label className="mt-2 inline-flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <span className="text-sm text-foreground">Visible on site</span>
          </label>
        </Field>
      </div>

      <Field label="Icon" required>
        <div className="mt-1 grid grid-cols-4 gap-2 sm:grid-cols-8">
          {CAPABILITY_ICONS.map((name) => {
            const Icon = iconForCapability(name);
            const active = name === icon;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setIcon(name)}
                title={name}
                className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-[10px] transition ${
                  active
                    ? "border-brand bg-brand/10 text-foreground"
                    : "border-input text-muted-foreground hover:bg-accent"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="truncate">{name}</span>
              </button>
            );
          })}
        </div>
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {existing ? "Save Changes" : "Create Capability"}
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/admin/capabilities" })}
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
