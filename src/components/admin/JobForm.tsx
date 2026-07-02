import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  upsertJobOpening,
  JOB_TYPES,
  type JobOpening,
} from "@/lib/jobs-admin.functions";

type Props = { existing?: JobOpening };

export function JobForm({ existing }: Props) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const upsertFn = useServerFn(upsertJobOpening);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [department, setDepartment] = useState(existing?.department ?? "");
  const [location, setLocation] = useState(existing?.location ?? "");
  const [type, setType] = useState(existing?.type ?? "Full-time");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [isActive, setIsActive] = useState(existing?.is_active ?? true);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      upsertFn({
        data: {
          id: existing?.id,
          title,
          department,
          location,
          type,
          description: description || null,
          is_active: isActive,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "jobs"] });
      navigate({ to: "/shivi/jobs" });
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
        <Field label="Title" required>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
            placeholder="Senior Frontend Engineer"
          />
        </Field>
        <Field label="Department" required>
          <input
            required
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className={inputCls}
            placeholder="Engineering"
          />
        </Field>
        <Field label="Location" required>
          <input
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={inputCls}
            placeholder="Remote / Mumbai, India"
          />
        </Field>
        <Field label="Type" required>
          <select
            required
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={inputCls}
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Status">
        <label className="mt-2 inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-input"
          />
          <span className="text-sm text-foreground">
            Active (visible on public careers page)
          </span>
        </label>
      </Field>

      <Field label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={8}
          className={inputCls}
          placeholder="Role responsibilities, requirements, benefits…"
        />
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {existing ? "Save Changes" : "Create Job"}
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/shivi/jobs" })}
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
