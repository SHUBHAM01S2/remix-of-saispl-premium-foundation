import { Globe2 } from "lucide-react";

export function GlobalReachNote({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-start gap-3 rounded-full border border-brand/30 bg-brand/5 px-4 py-2 text-sm text-foreground ${className}`}
    >
      <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
      <span>
        Serving clients across <strong className="font-semibold">US, UK, Europe, and Asia</strong> —
        flexible engagement models available.
      </span>
    </div>
  );
}
