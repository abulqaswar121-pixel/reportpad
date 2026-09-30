alter table public.exchange_rates enable row level security;
create policy exchange_rates_public_read on public.exchange_rates for select to anon, authenticated using (true);
grant all on public.exchange_rates to service_role;