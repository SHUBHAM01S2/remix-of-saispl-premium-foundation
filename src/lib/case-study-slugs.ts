// Known case study slugs available at /our-works/$caseStudyId.
// Kept in sync with src/routes/our-works.$caseStudyId.tsx
export const KNOWN_CASE_STUDY_SLUGS = new Set<string>([
  "global-trade-platform",
  "medicare-connect",
  "finvue-analytics",
  "logistics-hub-ai",
  "aura-mobile-experience",
  "retailflow-erp",
  "greenenergy-portal",
  "nexgen-brand-identity",
]);

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Returns the case-study slug for a project title if a matching case study exists. */
export function resolveCaseStudySlug(title: string): string | null {
  const slug = slugifyTitle(title);
  return KNOWN_CASE_STUDY_SLUGS.has(slug) ? slug : null;
}
