# Sales Partner Dashboard + Admin Referral Management — V1

Build a role-scoped referral platform on top of the existing SAISPL admin/auth stack. Sales partners get their own dashboard scoped to their own referrals; admins get a full-visibility management console with filters, detail views and payout state.

## Roles & Auth

- Extend the existing user_roles setup with a new `app_role`: `sales_partner`.
- Reuse the current `has_role()` security-definer function and Supabase auth (email/password).
- Sales partners sign in through the existing `/auth` page and land on a new `/partner` protected subtree (under `_authenticated/`).
- Admins keep full access under `/admin/*`.
- Add a "Wrong role" fallback like the existing client-on-admin notice for partners hitting `/admin` and vice versa.

## Data model (new tables in `public`)

1. `sales_partners`
   - `id`, `user_id` (FK auth.users, unique), `full_name`, `company`, `email`, `phone`, `payout_method` (upi/bank/paypal enum), `payout_details jsonb`, `default_commission_pct numeric`, `status` (active/paused), timestamps.
2. `referrals`
   - `id`, `partner_id` (FK sales_partners), `client_name`, `company`, `email`, `phone`, `service_interested`, `package_selected`, `source` (text: linkedin/whatsapp/etc), `referral_date`, `status` (enum), `deal_stage` (enum), `deal_value numeric`, `commission_pct numeric`, `commission_amount numeric` (generated or updated), `payout_status` (enum), `notes text`, `onboarding_id` (nullable FK client_onboarding), timestamps.
   - `status` enum: `new | contacted | in_discussion | won | lost | onboarding`
   - `deal_stage` enum: `lead | qualified | proposal | negotiation | closed_won | closed_lost`
   - `payout_status` enum: `pending | approved | paid | on_hold`
3. `referral_activity`
   - `id`, `referral_id`, `actor_id`, `actor_role`, `type` (status_change/note/payout/assignment), `payload jsonb`, `created_at`. Used for the activity history on the detail page.

RLS:
- Partners: SELECT/UPDATE own row in `sales_partners`; SELECT/INSERT/UPDATE own `referrals` (partner_id = their sales_partners.id); SELECT own `referral_activity`.
- Admins: full CRUD on all three via `has_role(auth.uid(), 'admin')`.
- Explicit GRANTs to `authenticated` and `service_role`.

## Sales Partner side (`/partner/*`)

- `/partner` — Dashboard home: stat cards (total leads, active, pending, won, lost, conversion rate %), recent referrals, earnings snapshot.
- `/partner/referrals` — My referrals table with search, status filter, add-referral button.
- `/partner/referrals/new` — Submit a new referral (client + service + notes).
- `/partner/referrals/$id` — Read-only detail: client info, current status, deal stage, activity history, commission info.
- `/partner/earnings` — Table of won referrals with commission amount and payout_status; totals by state.
- `/partner/profile` — Edit contact + payout details.

Partners cannot edit status/deal stage/commission — those are admin-controlled.

## Admin side (`/admin/affiliates/*`)

Add a new nav group "Partners" in the existing admin sidebar with:
- `/admin/affiliates` — Overview: KPIs across all partners (total partners, active partners, total referrals, won this month, pending payouts, aggregate deal value); top partners leaderboard.
- `/admin/affiliates/partners` — Sales persons list with search, status, referral count, won count, total commission.
- `/admin/affiliates/partners/$id` — Partner detail: profile, all their referrals, performance.
- `/admin/affiliates/referrals` — All referrals table with filters (partner, status, package, date range) + search + CSV export.
- `/admin/affiliates/referrals/$id` — Full detail view: referral source, client details, package, current onboarding link, notes, activity timeline, editable status/deal stage/commission/payout controls, "Convert to client onboarding" action.
- `/admin/affiliates/payouts` — Payout queue: pending/approved/paid, mark-as-paid action; writes to activity log.

Keep the existing `/admin/affiliate-enquiries` page untouched (it handles inbound applications) and add an admin action there to "Approve as Sales Partner" that provisions a `sales_partners` row + grants the `sales_partner` role.

## Server functions (`src/lib/*.functions.ts`)

- `partners.functions.ts` — partner-scoped queries (`getMyPartnerProfile`, `getMyStats`, `listMyReferrals`, `getMyReferral`, `createReferral`, `updateMyProfile`, `getMyEarnings`).
- `admin-partners.functions.ts` — admin-scoped queries (`adminListPartners`, `adminGetPartner`, `adminListReferrals` with filters, `adminGetReferral`, `adminUpdateReferralStatus`, `adminUpdateCommission`, `adminUpdatePayoutStatus`, `adminApprovePartner`, `adminExportReferralsCsv`).
- All use `requireSupabaseAuth` middleware; admin fns check `has_role('admin')` inside handler.

## UI shell

- Match the existing dark, premium admin/client-portal look: same typography, cards, chips, tables, sidebar pattern.
- Status chips reuse the palette conventions in existing pages (blue=new, amber=in-progress, emerald=won, rose=lost, violet=onboarding, zinc=closed).
- Sales partner shell mirrors `client-portal.tsx` structure (sidebar + main), admin section reuses the existing admin sidebar/shell.

## Out of scope for V1 (called out in your brief)

- Automated payout processing / Stripe transfers.
- Multi-tier partner programs and sub-affiliates.
- Public tracking links & cookie-based attribution.
- Complex commission rules (tiered %, product-specific overrides).

## Migration & rollout order

1. SQL migration: enum extension, three new tables, RLS, GRANTs, triggers for `updated_at` and activity logging on `referrals`.
2. Server functions.
3. Admin routes + nav integration + approve-as-partner action.
4. Partner subtree + login flow.
5. Wire referral → optional `client_onboarding` link (admin action).

Approve this and I'll build it end-to-end in that order.
