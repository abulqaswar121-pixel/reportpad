alter function public.create_storefront_order(text, uuid, jsonb, jsonb, uuid, public.payment_provider, jsonb) set schema private;
alter function public.effective_subscription_status(uuid) set schema private;
alter function public.refresh_vendor_subscription(uuid) set schema private;
alter function public.request_vendor_payout(uuid, numeric) set schema private;
alter function public.vendor_has_platform_access(uuid) set schema private;
alter function public.vendor_ngn_ledger(uuid) set schema private;
alter function public.vendor_transition_order(uuid, public.order_status, text) set schema private;

create function public.create_storefront_order(requested_vendor_slug text, requested_checkout_token uuid, customer jsonb, destination jsonb, requested_zone_id uuid, requested_provider public.payment_provider, requested_items jsonb)
returns jsonb language sql volatile security invoker set search_path=public as $$
  select private.create_storefront_order(requested_vendor_slug, requested_checkout_token, customer, destination, requested_zone_id, requested_provider, requested_items);
$$;
create function public.effective_subscription_status(target_vendor_id uuid)
returns public.subscription_status language sql stable security invoker set search_path=public as $$
  select private.effective_subscription_status(target_vendor_id);
$$;
create function public.refresh_vendor_subscription(target_vendor_id uuid)
returns public.subscription_status language sql volatile security invoker set search_path=public as $$
  select private.refresh_vendor_subscription(target_vendor_id);
$$;
create function public.request_vendor_payout(target_account_id uuid, requested_amount numeric)
returns public.payouts language sql volatile security invoker set search_path=public as $$
  select * from private.request_vendor_payout(target_account_id, requested_amount);
$$;
create function public.vendor_has_platform_access(target_vendor_id uuid)
returns boolean language sql stable security invoker set search_path=public as $$
  select private.vendor_has_platform_access(target_vendor_id);
$$;
create function public.vendor_ngn_ledger(target_vendor_id uuid)
returns table(gross numeric, platform_fees numeric, processing_fees numeric, paid_out numeric, pending_payouts numeric, available numeric)
language sql stable security invoker set search_path=public as $$
  select * from private.vendor_ngn_ledger(target_vendor_id);
$$;
create function public.vendor_transition_order(target_order_id uuid, new_status public.order_status, note text)
returns public.orders language sql volatile security invoker set search_path=public as $$
  select * from private.vendor_transition_order(target_order_id, new_status, note);
$$;

grant usage on schema private to anon, authenticated, service_role;

revoke execute on function private.create_storefront_order(text, uuid, jsonb, jsonb, uuid, public.payment_provider, jsonb) from public;
revoke execute on function private.effective_subscription_status(uuid) from public;
revoke execute on function private.refresh_vendor_subscription(uuid) from public, anon;
revoke execute on function private.request_vendor_payout(uuid, numeric) from public, anon;
revoke execute on function private.vendor_has_platform_access(uuid) from public;
revoke execute on function private.vendor_ngn_ledger(uuid) from public, anon;
revoke execute on function private.vendor_transition_order(uuid, public.order_status, text) from public, anon;

grant execute on function private.create_storefront_order(text, uuid, jsonb, jsonb, uuid, public.payment_provider, jsonb) to anon, authenticated, service_role;
grant execute on function private.effective_subscription_status(uuid) to anon, authenticated, service_role;
grant execute on function private.vendor_has_platform_access(uuid) to anon, authenticated, service_role;
grant execute on function private.refresh_vendor_subscription(uuid) to authenticated, service_role;
grant execute on function private.request_vendor_payout(uuid, numeric) to authenticated, service_role;
grant execute on function private.vendor_ngn_ledger(uuid) to authenticated, service_role;
grant execute on function private.vendor_transition_order(uuid, public.order_status, text) to authenticated, service_role;

revoke execute on function public.refresh_vendor_subscription(uuid) from public, anon;
revoke execute on function public.request_vendor_payout(uuid, numeric) from public, anon;
revoke execute on function public.vendor_ngn_ledger(uuid) from public, anon;
revoke execute on function public.vendor_transition_order(uuid, public.order_status, text) from public, anon;
grant execute on function public.create_storefront_order(text, uuid, jsonb, jsonb, uuid, public.payment_provider, jsonb) to anon, authenticated, service_role;
grant execute on function public.effective_subscription_status(uuid) to anon, authenticated, service_role;
grant execute on function public.vendor_has_platform_access(uuid) to anon, authenticated, service_role;
grant execute on function public.refresh_vendor_subscription(uuid) to authenticated, service_role;
grant execute on function public.request_vendor_payout(uuid, numeric) to authenticated, service_role;
grant execute on function public.vendor_ngn_ledger(uuid) to authenticated, service_role;
grant execute on function public.vendor_transition_order(uuid, public.order_status, text) to authenticated, service_role;
