-- Sales Partner Dashboard + Admin Referral Management (V1)
-- Run this in the Supabase SQL editor.

-- =========================================================
-- Enums
-- =========================================================
do $$ begin
  create type public.referral_status as enum
    ('new','contacted','in_discussion','won','lost','onboarding');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.referral_deal_stage as enum
    ('lead','qualified','proposal','negotiation','closed_won','closed_lost');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.referral_payout_status as enum
    ('pending','approved','paid','on_hold');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.partner_status as enum ('active','paused');
exception when duplicate_object then null; end $$;

-- =========================================================
-- Sales partners
-- =========================================================
create table if not exists public.sales_partners (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null unique references auth.users(id) on delete cascade,
  full_name     text not null,
  company       text,
  email         text not null,
  phone         text,
  payout_method text,               -- upi | bank | paypal | other
  payout_details jsonb default '{}'::jsonb,
  default_commission_pct numeric(5,2) default 10,
  status        public.partner_status not null default 'active',
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

grant select, insert, update, delete on public.sales_partners to authenticated;
grant all on public.sales_partners to service_role;
alter table public.sales_partners enable row level security;

drop policy if exists "partner reads own row" on public.sales_partners;
create policy "partner reads own row" on public.sales_partners
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "partner updates own row" on public.sales_partners;
create policy "partner updates own row" on public.sales_partners
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "admin full sales_partners" on public.sales_partners;
create policy "admin full sales_partners" on public.sales_partners
  for all to authenticated
  using (exists (select 1 from public.admins a where a.id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.id = auth.uid()));

-- =========================================================
-- Referrals
-- =========================================================
create table if not exists public.referrals (
  id                uuid primary key default gen_random_uuid(),
  partner_id        uuid not null references public.sales_partners(id) on delete cascade,
  client_name       text not null,
  company           text,
  email             text,
  phone             text,
  service_interested text,
  package_selected  text,
  source            text,
  referral_date     date not null default (now()::date),
  status            public.referral_status not null default 'new',
  deal_stage        public.referral_deal_stage not null default 'lead',
  deal_value        numeric(12,2),
  commission_pct    numeric(5,2),
  commission_amount numeric(12,2),
  payout_status     public.referral_payout_status not null default 'pending',
  notes             text,
  onboarding_id     uuid references public.client_onboarding(id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists referrals_partner_idx on public.referrals(partner_id, created_at desc);
create index if not exists referrals_status_idx  on public.referrals(status);

grant select, insert, update, delete on public.referrals to authenticated;
grant all on public.referrals to service_role;
alter table public.referrals enable row level security;

drop policy if exists "partner reads own referrals" on public.referrals;
create policy "partner reads own referrals" on public.referrals
  for select to authenticated using (
    exists (select 1 from public.sales_partners p
            where p.id = referrals.partner_id and p.user_id = auth.uid())
  );

drop policy if exists "partner inserts own referrals" on public.referrals;
create policy "partner inserts own referrals" on public.referrals
  for insert to authenticated with check (
    exists (select 1 from public.sales_partners p
            where p.id = referrals.partner_id and p.user_id = auth.uid())
  );

-- Partners may edit only lightweight fields (notes) via server fn;
-- broad UPDATE by partners is allowed but sensitive fields are protected in the app layer.
drop policy if exists "partner updates own referrals" on public.referrals;
create policy "partner updates own referrals" on public.referrals
  for update to authenticated
  using (
    exists (select 1 from public.sales_partners p
            where p.id = referrals.partner_id and p.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.sales_partners p
            where p.id = referrals.partner_id and p.user_id = auth.uid())
  );

drop policy if exists "admin full referrals" on public.referrals;
create policy "admin full referrals" on public.referrals
  for all to authenticated
  using (exists (select 1 from public.admins a where a.id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.id = auth.uid()));

-- =========================================================
-- Referral activity log
-- =========================================================
create table if not exists public.referral_activity (
  id           uuid primary key default gen_random_uuid(),
  referral_id  uuid not null references public.referrals(id) on delete cascade,
  actor_id     uuid,
  actor_role   text,               -- 'admin' | 'partner' | 'system'
  type         text not null,      -- 'status_change' | 'stage_change' | 'note' | 'payout' | 'created' | 'commission'
  payload      jsonb default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

create index if not exists referral_activity_referral_idx
  on public.referral_activity(referral_id, created_at desc);

grant select, insert on public.referral_activity to authenticated;
grant all on public.referral_activity to service_role;
alter table public.referral_activity enable row level security;

drop policy if exists "partner reads own activity" on public.referral_activity;
create policy "partner reads own activity" on public.referral_activity
  for select to authenticated using (
    exists (
      select 1 from public.referrals r
      join public.sales_partners p on p.id = r.partner_id
      where r.id = referral_activity.referral_id and p.user_id = auth.uid()
    )
  );

drop policy if exists "admin full activity" on public.referral_activity;
create policy "admin full activity" on public.referral_activity
  for all to authenticated
  using (exists (select 1 from public.admins a where a.id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.id = auth.uid()));

-- =========================================================
-- Triggers
-- =========================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists sales_partners_touch on public.sales_partners;
create trigger sales_partners_touch before update on public.sales_partners
  for each row execute function public.touch_updated_at();

drop trigger if exists referrals_touch on public.referrals;
create trigger referrals_touch before update on public.referrals
  for each row execute function public.touch_updated_at();

-- Auto-compute commission_amount when deal_value / commission_pct change.
create or replace function public.referrals_compute_commission()
returns trigger language plpgsql as $$
begin
  if new.deal_value is not null and new.commission_pct is not null then
    new.commission_amount := round(new.deal_value * new.commission_pct / 100.0, 2);
  end if;
  return new;
end $$;

drop trigger if exists referrals_commission on public.referrals;
create trigger referrals_commission before insert or update on public.referrals
  for each row execute function public.referrals_compute_commission();

-- Log status/stage changes automatically.
create or replace function public.referrals_log_change()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    insert into public.referral_activity(referral_id, actor_id, actor_role, type, payload)
    values (new.id, auth.uid(), 'system', 'created',
            jsonb_build_object('status', new.status, 'stage', new.deal_stage));
  elsif tg_op = 'UPDATE' then
    if new.status is distinct from old.status then
      insert into public.referral_activity(referral_id, actor_id, actor_role, type, payload)
      values (new.id, auth.uid(), 'system', 'status_change',
              jsonb_build_object('from', old.status, 'to', new.status));
    end if;
    if new.deal_stage is distinct from old.deal_stage then
      insert into public.referral_activity(referral_id, actor_id, actor_role, type, payload)
      values (new.id, auth.uid(), 'system', 'stage_change',
              jsonb_build_object('from', old.deal_stage, 'to', new.deal_stage));
    end if;
    if new.payout_status is distinct from old.payout_status then
      insert into public.referral_activity(referral_id, actor_id, actor_role, type, payload)
      values (new.id, auth.uid(), 'system', 'payout',
              jsonb_build_object('from', old.payout_status, 'to', new.payout_status));
    end if;
    if new.commission_amount is distinct from old.commission_amount then
      insert into public.referral_activity(referral_id, actor_id, actor_role, type, payload)
      values (new.id, auth.uid(), 'system', 'commission',
              jsonb_build_object('amount', new.commission_amount, 'pct', new.commission_pct));
    end if;
  end if;
  return new;
end $$;

drop trigger if exists referrals_log on public.referrals;
create trigger referrals_log after insert or update on public.referrals
  for each row execute function public.referrals_log_change();
