import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload, X, Bold, Italic, List, ListOrdered, Heading2, Link as LinkIcon, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  upsertBlogPost,
  BLOG_CATEGORIES,
  type BlogPost,
} from "@/lib/blog-admin.functions";

const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uploadCover(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `blog/covers/${crypto.randomUUID()}.${ext}`;
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

type Props = { existing?: BlogPost };

export function BlogForm({ existing }: Props) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const upsertFn = useServerFn(upsertBlogPost);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!existing);
  const [excerpt, setExcerpt] = useState(existing?.excerpt ?? "");
  const [content, setContent] = useState(existing?.content ?? "");
  const [category, setCategory] = useState(existing?.category ?? "");
  const [authorName, setAuthorName] = useState(existing?.author_name ?? "");
  const [coverUrl, setCoverUrl] = useState<string | null>(existing?.cover_image_url ?? null);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && content) {
      editorRef.current.innerHTML = content;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  const mutation = useMutation({
    mutationFn: () =>
      upsertFn({
        data: {
          id: existing?.id,
          title,
          slug,
          excerpt: excerpt || null,
          content: content || null,
          category: category || null,
          cover_image_url: coverUrl,
          author_name: authorName || null,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "blog"] });
      navigate({ to: "/admin/blog" });
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Save failed"),
  });

  const handleCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setError(null);
    try {
      const url = await uploadCover(file);
      setCoverUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  };

  const exec = (cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    if (editorRef.current) setContent(editorRef.current.innerHTML);
  };

  const insertLink = () => {
    const url = prompt("Enter URL");
    if (url) exec("createLink", url);
  };

  const toolBtn =
    "inline-flex h-8 w-8 items-center justify-center rounded border border-input bg-background text-foreground hover:bg-accent";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      className="space-y-6"
    >
      <Field label="Title" required>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputCls}
          placeholder="Your post title"
        />
      </Field>

      <Field label="Slug" required>
        <input
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          className={inputCls}
          placeholder="auto-generated-from-title"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Auto-generated from title. Lowercase letters, numbers, and hyphens only.
        </p>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputCls}
          >
            <option value="">— Select category —</option>
            {BLOG_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Author">
          <input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className={inputCls}
            placeholder="Author name"
          />
        </Field>
      </div>

      <Field label="Cover Image">
        <div className="flex items-center gap-4">
          {coverUrl ? (
            <div className="relative">
              <img src={coverUrl} alt="" className="h-24 w-40 rounded-md border border-border object-cover" />
              <button
                type="button"
                onClick={() => setCoverUrl(null)}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white"
                aria-label="Remove cover"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : null}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent">
            {uploadingCover ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            <span>{uploadingCover ? "Uploading…" : coverUrl ? "Replace" : "Upload cover"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleCover} disabled={uploadingCover} />
          </label>
        </div>
      </Field>

      <Field label="Excerpt">
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className={inputCls}
          placeholder="Short summary shown in listings"
        />
      </Field>

      <Field label="Content">
        <div className="rounded-md border border-input bg-background">
          <div className="flex flex-wrap items-center gap-1 border-b border-input px-2 py-1.5">
            <button type="button" title="Heading" className={toolBtn} onClick={() => exec("formatBlock", "H2")}>
              <Heading2 className="h-4 w-4" />
            </button>
            <button type="button" title="Bold" className={toolBtn} onClick={() => exec("bold")}>
              <Bold className="h-4 w-4" />
            </button>
            <button type="button" title="Italic" className={toolBtn} onClick={() => exec("italic")}>
              <Italic className="h-4 w-4" />
            </button>
            <button type="button" title="Bulleted list" className={toolBtn} onClick={() => exec("insertUnorderedList")}>
              <List className="h-4 w-4" />
            </button>
            <button type="button" title="Numbered list" className={toolBtn} onClick={() => exec("insertOrderedList")}>
              <ListOrdered className="h-4 w-4" />
            </button>
            <button type="button" title="Quote" className={toolBtn} onClick={() => exec("formatBlock", "BLOCKQUOTE")}>
              <Quote className="h-4 w-4" />
            </button>
            <button type="button" title="Link" className={toolBtn} onClick={insertLink}>
              <LinkIcon className="h-4 w-4" />
            </button>
          </div>
          <div
            ref={editorRef}
            contentEditable
            onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
            className="prose prose-sm min-h-[280px] max-w-none px-3 py-3 text-sm text-foreground outline-none dark:prose-invert"
            suppressContentEditableWarning
          />
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
          {existing ? "Save Changes" : "Create Post"}
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/admin/blog" })}
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
