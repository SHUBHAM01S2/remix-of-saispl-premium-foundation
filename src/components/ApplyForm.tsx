import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface ApplyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: string;
}

const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function ApplyForm({ open, onOpenChange, position }: ApplyFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setResume(null);
    setSubmitting(false);
  };

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(false), 4500);
    return () => clearTimeout(t);
  }, [success]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const cover = String(fd.get("cover_message") || "").trim();

    if (!name || !email) {
      toast.error("Name and email are required.");
      return;
    }

    if (resume) {
      if (resume.size > MAX_RESUME_BYTES) {
        toast.error("Resume must be under 5 MB.");
        return;
      }
      if (!ALLOWED_TYPES.includes(resume.type)) {
        toast.error("Resume must be a PDF or Word document.");
        return;
      }
    }

    setSubmitting(true);
    try {
      let resume_url: string | null = null;
      if (resume) {
        const ext = resume.name.split(".").pop()?.toLowerCase() || "pdf";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("resumes")
          .upload(path, resume, {
            contentType: resume.type,
            upsert: false,
          });
        if (upErr) throw upErr;
        resume_url = path;
      }

      const { error } = await (supabase as any)
        .from("career_applications")
        .insert({
          name,
          email,
          phone: phone || null,
          position_applied: position,
          resume_url,
          cover_message: cover || null,
        });
      if (error) throw error;

      form.reset();
      reset();
      onOpenChange(false);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <>
    <Dialog open={open} onOpenChange={(v) => { if (!submitting) { onOpenChange(v); if (!v) reset(); } }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Apply for {position}</DialogTitle>
          <DialogDescription>
            Fill in the details below and attach your resume. We review every application.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="apply-name">Full name *</Label>
            <Input id="apply-name" name="name" required maxLength={100} />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="apply-email">Email *</Label>
              <Input id="apply-email" name="email" type="email" required maxLength={255} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="apply-phone">Phone</Label>
              <Input id="apply-phone" name="phone" type="tel" maxLength={30} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="apply-resume">Resume (PDF / DOC, max 5 MB)</Label>
            <label
              htmlFor="apply-resume"
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border bg-surface px-3 py-2.5 text-sm text-muted-foreground hover:bg-surface-elevated"
            >
              <Upload className="h-4 w-4" />
              <span className="truncate">
                {resume ? resume.name : "Click to upload your resume"}
              </span>
            </label>
            <input
              id="apply-resume"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="apply-cover">Cover message</Label>
            <Textarea
              id="apply-cover"
              name="cover_message"
              rows={4}
              maxLength={2000}
              placeholder="Tell us why you'd be a great fit."
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-lg bg-cta px-6 py-3 text-sm font-semibold text-cta-foreground transition-all hover:bg-cta/90 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>

    <Dialog open={success} onOpenChange={setSuccess}>
      <DialogContent className="sm:max-w-md border-emerald-500/20 bg-background/95 backdrop-blur">
        <div className="flex flex-col items-center text-center py-4">
          <div className="relative mb-5">
            <span className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
              <CheckCircle2 className="h-9 w-9 text-emerald-400" />
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl">Thank you for applying</DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-relaxed">
              We've received your application and our team will review it shortly.
              <br />
              <span className="mt-2 block text-muted-foreground">
                If your profile matches the role, we'll contact you with the next steps.
              </span>
            </DialogDescription>
          </DialogHeader>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="mt-6 inline-flex items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-8 py-2.5 text-sm font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
