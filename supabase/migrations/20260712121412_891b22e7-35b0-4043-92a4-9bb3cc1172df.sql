CREATE OR REPLACE FUNCTION public.referrals_compute_commission()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
begin
  if new.status = 'lost' then
    new.commission_amount := 0;
  elsif new.deal_value is not null and new.commission_pct is not null then
    new.commission_amount := round(new.deal_value * new.commission_pct / 100.0, 2);
  end if;
  return new;
end
$function$;

-- Zero out commission on existing lost referrals
UPDATE public.referrals SET commission_amount = 0 WHERE status = 'lost' AND coalesce(commission_amount, 0) <> 0;