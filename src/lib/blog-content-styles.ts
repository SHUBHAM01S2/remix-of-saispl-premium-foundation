// Shared Tailwind class string for rendered blog post body content.
// Used both in the admin editor (contentEditable + preview) and the public
// /blog/$slug body so what you type matches what visitors see.
export const BLOG_PROSE_CLASSES = [
  "text-base leading-relaxed text-foreground break-words",
  // Force old pasted Word/Google Docs inline styles (black text, tiny line-height)
  // to render visibly on the dark blog background.
  "[&_*]:!leading-relaxed [&_p]:!text-foreground [&_li]:!text-foreground [&_span]:!text-foreground",
  // Paragraphs
  "[&_p]:my-4 [&_p]:leading-relaxed",
  // Line breaks inside a paragraph
  "[&_br]:content-['']",
  // Headings
  "[&_h1]:mt-8 [&_h1]:mb-3 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:leading-tight",
  "[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight",
  "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-snug",
  // Lists
  "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1",
  "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1",
  "[&_li]:leading-relaxed",
  // Blockquote
  "[&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-brand/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:!text-muted-foreground",
  // Links
  "[&_a]:!text-brand [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80",
  // Inline formatting
  "[&_strong]:font-semibold [&_em]:italic",
  // Code
  "[&_code]:rounded [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em]",
  // Contenteditable Chrome quirk: wrap loose text in a div — give it paragraph spacing
  "[&_div]:my-4 [&_div]:leading-relaxed",
  // Images
  "[&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-lg",
].join(" ");
