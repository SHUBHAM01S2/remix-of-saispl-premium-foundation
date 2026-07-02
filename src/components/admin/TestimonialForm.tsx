import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Star } from "lucide-react";
import {
  upsertTestimonial,
  type Testimonial,
} from "@/lib/testimonials-admin.functions";

type Props = { existing?: Testimonial };

export function TestimonialForm({ existing }: Props) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const upsertFn = useServerFn(upsertTestimonial);

  const [clientName, setClientName] = useState(existing?.client_name ?? "");
  const [company, setCompany] = useState(existing?.company ?? "");
  const [country, setCountry] = useState(existing?.country ?? "");
  const [quote, setQuote] = useState(existing?.quote ?? "");
  const [rating, setRating] = useState<number>(existing?.rating ?? 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isFeatured, setIsFeatured] = useState(existing?.is_featured ?? false);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      upsertFn({
        data: {
          id: existing?.id,
          client_name: clientName,
          company: company || null,
          country: country || null,
          quote,
          rating,
          is_featured: isFeatured,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      navigate({ to: "/admin/testimonials" });
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
        <Field label="Client Name" required>
          <input
            required
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Company">
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Country">
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Featured">
          <label className="mt-2 inline-flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <span className="text-sm text-foreground">Mark as featured</span>
          </label>
        </Field>
      </div>

      <Field label="Star Rating" required>
        <div className="mt-1 flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
          {[1, 2, 3, 4, 5].map((n) => {
            const active = (hoverRating || rating) >= n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHoverRating(n)}
                className="p-1"
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
              >
                <Star
                  className={
                    active
                      ? "h-7 w-7 fill-amber-500 text-amber-500"
                      : "h-7 w-7 text-muted-foreground"
                  }
                />
              </button>
            );
          })}
          <span className="ml-2 text-sm text-muted-foreground">{rating} / 5</span>
        </div>
      </Field>

      <Field label="Quote" required>
        <textarea
          required
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          rows={5}
          className={inputCls}
          placeholder="What did the client say?"
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
          {existing ? "Save Changes" : "Create Testimonial"}
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/admin/testimonials" })}
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
