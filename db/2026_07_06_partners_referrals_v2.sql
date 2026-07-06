-- V2 for Sales Partner / Referrals:
--   1. Auto-sync deal_stage from status
--   2. Payout state-machine (pending → approved → paid, or on_hold)
--      with timestamps + approver/payer audit
--   3. Better activity audit: record real actor role (admin vs partner)
--   4. Track last_status_change_at / last_activity_at
--
-- Safe to re-run.

-- =========================================================
-- 1. Columns
-- =========================================================
alter table public.referrals
  add column if not exists payout_approved_at   timestamptz,
  add column if not exists payout_approved_by   uuid,
  add column if not exists payout_paid_at       timestamptz,
  add column if not exists payout_paid_by       uuid,
  add column if not exists last_status_change_at timestamptz,
  add column if not exists last_activity_at      timestamptz not null default now();

-- =========================================================
-- 2. Sync deal_stage <- status (only when caller didn't set stage explicitly)
-- =========================================================
create or replace function public.referrals_sync_stage()
returns trigger language plpgsql as $$
declare
  target public.referral_deal_stage;
begin
  if tg_op = 'UPDATE' and new.status is not distinct from old.status then
    return new;
  end if;
  -- Only auto-move stage if the caller did NOT also change stage in the same update
  if tg_op = 'UPDATE' and new.deal_stage is distinct from old.deal_stage then
    return new;
  end if;

  target := case new.status
    when 'new'           then 'lead'::public.referral_deal_stage
    when 'contacted'     then 'qualified'::public.referral_deal_stage
    when 'in_discussion' then 'proposal'::public.referral_deal_stage
    when 'onboarding'    then 'closed_won'::public.referral_deal_stage
    when 'won'           then 'closed_won'::public.referral_deal_stage
    when 'lost'          then 'closed_lost'::public.referral_deal_stage
    else new.deal_stage
  end;

  new.deal_stage := target;

  if tg_op = 'UPDATE' then
    new.last_status_change_at := now();
  end if;
  return new;
end $$;

drop trigger if exists referrals_sync_stage on public.referrals;
create trigger referrals_sync_stage
  before insert or update on public.referrals
  for each row execute function public.referrals_sync_stage();

-- =========================================================
-- 3. Payout state-machine
--    Allowed transitions:
--      pending  → approved | on_hold
--      approved → paid | pending | on_hold
--      on_hold  → pending | approved
--      paid     → (locked; only admin service_role can override)
-- =========================================================
create or replace function public.referrals_payout_gate()
returns trigger language plpgsql as $$
begin
  if tg_op = 'UPDATE' and new.payout_status is distinct from old.payout_status then
    if old.payout_status = 'paid' then
      raise exception 'Payout already marked as paid; cannot change without service-role override';
    end if;

    if new.payout_status = 'paid' and old.payout_status <> 'approved' then
      raise exception 'Payout must be approved before it can be marked as paid';
    end if;

    if new.payout_status = 'approved' then
      new.payout_approved_at := coalesce(new.payout_approved_at, now());
      new.payout_approved_by := coalesce(new.payout_approved_by, auth.uid());
    end if;

    if new.payout_status = 'paid' then
      new.payout_paid_at := coalesce(new.payout_paid_at, now());
      new.payout_paid_by := coalesce(new.payout_paid_by, auth.uid());
    end if;

    if new.payout_status = 'pending' then
      new.payout_approved_at := null;
      new.payout_approved_by := null;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists referrals_payout_gate on public.referrals;
create trigger referrals_payout_gate
  before update on public.referrals
  for each row execute function public.referrals_payout_gate();

-- =========================================================
-- 4. Better activity logger: infer actor_role, always bump last_activity_at
-- =========================================================
create or replace function public.referrals_log_change()
returns trigger language plpgsql
security definer
set search_path = public
as $$
declare
  role_text text;
begin
  if auth.uid() is null then
    role_text := 'system';
  elsif exists (select 1 from public.admins a where a.id = auth.uid()) then
    role_text := 'admin';
  else
    role_text := 'partner';
  end if;

  if tg_op = 'INSERT' then
    insert into public.referral_activity(referral_id, actor_id, actor_role, type, payload)
    values (new.id, auth.uid(), role_text, 'created',
            jsonb_build_object('status', new.status, 'stage', new.deal_stage));
  elsif tg_op = 'UPDATE' then
    if new.status is distinct from old.status then
      insert into public.referral_activity(referral_id, actor_id, actor_role, type, payload)
      values (new.id, auth.uid(), role_text, 'status_change',
              jsonb_build_object('from', old.status, 'to', new.status));
    end if;
    if new.deal_stage is distinct from old.deal_stage then
      insert into public.referral_activity(referral_id, actor_id, actor_role, type, payload)
      values (new.id, auth.uid(), role_text, 'stage_change',
              jsonb_build_object('from', old.deal_stage, 'to', new.deal_stage));
    end if;
    if new.payout_status is distinct from old.payout_status then
      insert into public.referral_activity(referral_id, actor_id, actor_role, type, payload)
      values (new.id, auth.uid(), role_text, 'payout',
              jsonb_build_object('from', old.payout_status, 'to', new.payout_status));
    end if;
    if new.commission_amount is distinct from old.commission_amount then
      insert into public.referral_activity(referral_id, actor_id, actor_role, type, payload)
      values (new.id, auth.uid(), role_text, 'commission',
              jsonb_build_object(
                'from', old.commission_amount, 'to', new.commission_amount,
                'pct', new.commission_pct));
    end if;
    if new.deal_value is distinct from old.deal_value then
      insert into public.referral_activity(referral_id, actor_id, actor_role, type, payload)
      values (new.id, auth.uid(), role_text, 'deal_value',
              jsonb_build_object('from', old.deal_value, 'to', new.deal_value));
    end if;
  end if;

  return new;
end $$;

-- Touch last_activity_at whenever any activity row is written.
create or replace function public.referrals_bump_last_activity()
returns trigger language plpgsql as $$
begin
  update public.referrals
    set last_activity_at = now()
  where id = new.referral_id;
  return new;
end $$;

drop trigger if exists referral_activity_bump on public.referral_activity;
create trigger referral_activity_bump
  after insert on public.referral_activity
  for each row execute function public.referrals_bump_last_activity();
