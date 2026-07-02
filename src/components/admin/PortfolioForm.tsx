import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  upsertPortfolioProject,
  type PortfolioProject,
} from "@/lib/portfolio-admin.functions";

const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10; // ~10 years
const PORTFOLIO_CATEGORIES = ["Website", "Portal", "Automation", "SEO"] as const;

async function uploadFile(file: File, folder: "thumbnails" | "screenshots"): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("portfolio")
    .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
  if (upErr) throw upErr;
  const { data, error: signErr } = await supabase.storage
    .from("portfolio")
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (signErr) throw signErr;
  return data.signedUrl;
}

type Props = { existing?: PortfolioProject };

export function PortfolioForm({ existing }: Props) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const upsertFn = useServerFn(upsertPortfolioProject);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [clientIndustry, setClientIndustry] = useState(existing?.client_industry ?? "");
  const [category, setCategory] = useState(existing?.category ?? "");
  const [challenge, setChallenge] = useState(existing?.challenge ?? "");
  const [solution, setSolution] = useState(existing?.solution ?? "");
  const [results, setResults] = useState(existing?.results ?? "");
  const [isFeatured, setIsFeatured] = useState(existing?.is_featured ?? false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(existing?.thumbnail_url ?? null);
  const [screenshotUrls, setScreenshotUrls] = useState<string[]>(existing?.screenshot_urls ?? []);

  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingShots, setUploadingShots] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      upsertFn({
        data: {
          id: existing?.id,
          title,
          client_industry: clientIndustry,
          category,
          thumbnail_url: thumbnailUrl,
          screenshot_urls: screenshotUrls,
          challenge: challenge || null,
          solution: solution || null,
          results: results || null,
          is_featured: isFeatured,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "portfolio"] });
      navigate({ to: "/admin/portfolio" });
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Save failed"),
  });

  const handleThumbnail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumb(true);
    setError(null);
    try {
      const url = await uploadFile(file, "thumbnails");
      setThumbnailUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingThumb(false);
      e.target.value = "";
    }
  };

  const handleScreenshots = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadingShots(true);
    setError(null);
    try {
      const urls = await Promise.all(files.map((f) => uploadFile(f, "screenshots")));
      setScreenshotUrls((prev) => [...prev, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingShots(false);
      e.target.value = "";
    }
  };

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
          />
        </Field>
        <Field label="Client Industry" required>
          <input
            required
            value={clientIndustry}
            onChange={(e) => setClientIndustry(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Category" required>
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputCls}
          >
            <option value="">Select category</option>
            {PORTFOLIO_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
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

      <Field label="Thumbnail">
        <div className="flex items-center gap-4">
          {thumbnailUrl ? (
            <div className="relative">
              <img src={thumbnailUrl} alt="" className="h-24 w-24 rounded-md border border-border object-cover" />
              <button
                type="button"
                onClick={() => setThumbnailUrl(null)}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white"
                aria-label="Remove thumbnail"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : null}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent">
            {uploadingThumb ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            <span>{uploadingThumb ? "Uploading…" : thumbnailUrl ? "Replace" : "Upload thumbnail"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleThumbnail} disabled={uploadingThumb} />
          </label>
        </div>
      </Field>

      <Field label="Screenshots">
        <div className="flex flex-wrap gap-3">
          {screenshotUrls.map((url, i) => (
            <div key={url} className="relative">
              <img src={url} alt="" className="h-24 w-24 rounded-md border border-border object-cover" />
              <button
                type="button"
                onClick={() => setScreenshotUrls((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white"
                aria-label="Remove screenshot"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className="inline-flex h-24 w-24 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-input bg-background text-muted-foreground hover:bg-accent">
            {uploadingShots ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleScreenshots} disabled={uploadingShots} />
          </label>
        </div>
      </Field>

      <Field label="Challenge">
        <textarea value={challenge} onChange={(e) => setChallenge(e.target.value)} rows={3} className={inputCls} />
      </Field>
      <Field label="Solution">
        <textarea value={solution} onChange={(e) => setSolution(e.target.value)} rows={3} className={inputCls} />
      </Field>
      <Field label="Results">
        <textarea value={results} onChange={(e) => setResults(e.target.value)} rows={3} className={inputCls} />
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {existing ? "Save Changes" : "Create Project"}
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/admin/portfolio" })}
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
