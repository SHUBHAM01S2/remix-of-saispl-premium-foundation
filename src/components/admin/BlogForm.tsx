import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2, Upload, X, Bold, Italic, List, ListOrdered,
  Heading2, Heading3, Link as LinkIcon, Quote, Pilcrow, Eye, Pencil,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BLOG_PROSE_CLASSES } from "@/lib/blog-content-styles";
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

function toDateTimeInput(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function fromDateTimeInput(value: string): string | null {
  return value ? new Date(value).toISOString() : null;
}

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
  const [publishedAt, setPublishedAt] = useState(toDateTimeInput(existing?.published_at ?? null));

  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Sync content into the contentEditable div whenever we (re)mount it —
  // e.g. on initial load, or when switching back from Preview to Write.
  useEffect(() => {
    if (showPreview) return;
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML === content) return;
    const clean = sanitizePastedHtml(content ?? "");
    editorRef.current.innerHTML = clean;
    if (clean !== content) setContent(clean);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPreview]);

  useEffect(() => {
    // Force Enter to insert <p> (Chrome defaults to <div>) so spacing is
    // consistent with the public post rendering.
    try {
      document.execCommand("defaultParagraphSeparator", false, "p");
    } catch {
      /* older browsers — no-op */
    }
  }, []);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  const buildMutation = (overridePublishedAt?: string | null) =>
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
        published_at:
          overridePublishedAt === undefined
            ? fromDateTimeInput(publishedAt)
            : overridePublishedAt,
      },
    });

  const contentIsEmpty = (html: string) => {
    if (!html) return true;
    const text = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
    return text.length === 0;
  };

  const mutation = useMutation({
    mutationFn: (variant: "save" | "publish" | "draft") => {
      if (variant === "publish") {
        if (!title.trim()) throw new Error("Title is required to publish.");
        if (contentIsEmpty(content)) throw new Error("Content is required to publish.");
        if (!publishedAt) {
          throw new Error(
            "Set a Published at date/time before publishing (or click Publish Now after choosing one).",
          );
        }
        const iso = fromDateTimeInput(publishedAt)!;
        return buildMutation(iso);
      }
      if (variant === "draft") {
        setPublishedAt("");
        return buildMutation(null);
      }
      return buildMutation();
    },
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

  // Convert plain text into safe paragraph HTML. Blank lines split paragraphs;
  // single newlines become <br>. Escapes HTML.
  const plainTextToHtml = (text: string): string => {
    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const paras = text.replace(/\r\n?/g, "\n").split(/\n{2,}/);
    return paras
      .map((p) => `<p>${esc(p).replace(/\n/g, "<br>") || "<br>"}</p>`)
      .join("");
  };

  // Whitelist-based sanitizer. Anything not in ALLOWED is unwrapped (its text
  // survives, its formatting is dropped). All attributes are stripped except
  // href on <a>. This kills black-on-black inline colors and zero line-height
  // styles from Word / Google Docs pastes.
  const ALLOWED = new Set([
    "P", "BR", "H1", "H2", "H3", "H4", "STRONG", "B", "EM", "I", "U",
    "A", "UL", "OL", "LI", "BLOCKQUOTE", "CODE", "PRE", "HR",
  ]);
  const FORBIDDEN = new Set(["SCRIPT", "STYLE", "META", "LINK", "IFRAME", "OBJECT", "EMBED"]);

  const sanitizePastedHtml = (html: string): string => {
    if (typeof window === "undefined") return html;
    const doc = new DOMParser().parseFromString(html, "text/html");

    const walk = (root: Element) => {
      // Collect elements depth-first so unwrap of an outer element doesn't
      // invalidate iteration.
      const all: Element[] = [];
      const stack: Element[] = [root];
      while (stack.length) {
        const el = stack.pop()!;
        for (const child of Array.from(el.children)) {
          all.push(child);
          stack.push(child);
        }
      }
      // Process deepest first so unwrapping works cleanly.
      for (let i = all.length - 1; i >= 0; i--) {
        const el = all[i];
        const tag = el.tagName;
        if (FORBIDDEN.has(tag)) {
          el.remove();
          continue;
        }
        // Strip every attribute except href on <a>.
        for (const attr of Array.from(el.attributes)) {
          if (tag === "A" && attr.name === "href") continue;
          el.removeAttribute(attr.name);
        }
        if (!ALLOWED.has(tag)) {
          // Unwrap: replace with children.
          const parent = el.parentNode;
          if (!parent) continue;
          while (el.firstChild) parent.insertBefore(el.firstChild, el);
          parent.removeChild(el);
        }
      }
    };

    walk(doc.body);

    let out = doc.body.innerHTML.trim();
    // Collapse runs of empty paragraphs.
    out = out.replace(/(<p>\s*<\/p>\s*){2,}/g, "<p></p>");
    return out;
  };

  const insertHtmlAtCaret = (html: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      editor.insertAdjacentHTML("beforeend", html);
      return;
    }
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const frag = range.createContextualFragment(html);
    const lastNode = frag.lastChild;
    range.insertNode(frag);
    if (lastNode) {
      range.setStartAfter(lastNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");

    let cleaned = "";
    if (html) {
      cleaned = sanitizePastedHtml(html);
      // If HTML sanitization stripped everything meaningful, fall back to text.
      const textOnly = cleaned.replace(/<[^>]*>/g, "").trim();
      if (!textOnly && text) cleaned = plainTextToHtml(text);
    } else if (text) {
      cleaned = plainTextToHtml(text);
    }

    if (!cleaned) return;
    insertHtmlAtCaret(cleaned);
    if (editorRef.current) setContent(editorRef.current.innerHTML);
  };

  const toolBtn =
    "inline-flex h-8 w-8 items-center justify-center rounded border border-input bg-background text-foreground hover:bg-accent";


  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate("save");
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

      <Field label="Published at">
        <div className="flex items-center gap-2">
          <input
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            className={inputCls}
          />
          <button
            type="button"
            onClick={() => setPublishedAt(toDateTimeInput(new Date().toISOString()))}
            className="whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-accent"
          >
            Set to now
          </button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Leave empty to save as draft. A date/time is required to publish.
        </p>
      </Field>

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
            <button type="button" title="Paragraph" className={toolBtn} onClick={() => exec("formatBlock", "P")}>
              <Pilcrow className="h-4 w-4" />
            </button>
            <button type="button" title="Heading 2" className={toolBtn} onClick={() => exec("formatBlock", "H2")}>
              <Heading2 className="h-4 w-4" />
            </button>
            <button type="button" title="Heading 3" className={toolBtn} onClick={() => exec("formatBlock", "H3")}>
              <Heading3 className="h-4 w-4" />
            </button>
            <span className="mx-1 h-5 w-px bg-border" />
            <button type="button" title="Bold (Ctrl+B)" className={toolBtn} onClick={() => exec("bold")}>
              <Bold className="h-4 w-4" />
            </button>
            <button type="button" title="Italic (Ctrl+I)" className={toolBtn} onClick={() => exec("italic")}>
              <Italic className="h-4 w-4" />
            </button>
            <span className="mx-1 h-5 w-px bg-border" />
            <button type="button" title="Bulleted list" className={toolBtn} onClick={() => exec("insertUnorderedList")}>
              <List className="h-4 w-4" />
            </button>
            <button type="button" title="Numbered list" className={toolBtn} onClick={() => exec("insertOrderedList")}>
              <ListOrdered className="h-4 w-4" />
            </button>
            <button type="button" title="Quote" className={toolBtn} onClick={() => exec("formatBlock", "BLOCKQUOTE")}>
              <Quote className="h-4 w-4" />
            </button>
            <button type="button" title="Insert link" className={toolBtn} onClick={insertLink}>
              <LinkIcon className="h-4 w-4" />
            </button>
            <div className="ml-auto flex items-center gap-1 rounded-md border border-input p-0.5">
              <button
                type="button"
                title="Edit"
                onClick={() => setShowPreview(false)}
                className={
                  "inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium " +
                  (!showPreview ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")
                }
              >
                <Pencil className="h-3.5 w-3.5" /> Write
              </button>
              <button
                type="button"
                title="Preview"
                onClick={() => setShowPreview(true)}
                className={
                  "inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium " +
                  (showPreview ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")
                }
              >
                <Eye className="h-3.5 w-3.5" /> Preview
              </button>
            </div>
          </div>

          {showPreview ? (
            content && content.replace(/<[^>]*>/g, "").trim().length > 0 ? (
              <div
                className={`min-h-[280px] px-4 py-4 ${BLOG_PROSE_CLASSES}`}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="min-h-[280px] px-4 py-4 text-sm italic text-muted-foreground">
                Nothing to preview yet.
              </div>
            )
          ) : (
            <div
              ref={editorRef}
              contentEditable
              onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
              onPaste={handlePaste}
              className={`min-h-[280px] px-4 py-4 outline-none ${BLOG_PROSE_CLASSES}`}
              suppressContentEditableWarning
            />
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          The preview uses the same styling as the public blog post page.
        </p>
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {existing ? "Save Changes" : "Create Post"}
        </button>
        {(() => {
          const canPublish =
            !!title.trim() && !contentIsEmpty(content) && !!publishedAt;
          const reason = !title.trim()
            ? "Add a title before publishing"
            : contentIsEmpty(content)
              ? "Add some content before publishing"
              : !publishedAt
                ? "Set a Published at date/time before publishing"
                : "";
          return (
            <button
              type="button"
              disabled={mutation.isPending || !canPublish}
              onClick={() => mutation.mutate("publish")}
              title={reason || undefined}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {publishedAt ? "Save & Publish" : "Publish Now"}
            </button>
          );
        })()}
        {publishedAt && (
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate("draft")}
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-60"
          >
            Move to Draft
          </button>
        )}
        <button
          type="button"
          onClick={() => navigate({ to: "/admin/blog" })}
          className="ml-auto rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
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
