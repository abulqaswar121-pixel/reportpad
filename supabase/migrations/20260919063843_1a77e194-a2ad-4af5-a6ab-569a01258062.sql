create schema if not exists private;

grant usage on schema private to authenticated;

create or replace function private.has_role(requested_user_id uuid, requested_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = requested_user_id and role = requested_role
  );
$$;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select private.has_role(auth.uid(), 'admin'::public.app_role);
$$;

revoke all on function private.has_role(uuid, public.app_role) from public, anon;
revoke all on function private.is_admin() from public, anon;
grant execute on function private.has_role(uuid, public.app_role) to authenticated;
grant execute on function private.is_admin() to authenticated;

create or replace function public.has_role(requested_user_id uuid, requested_role public.app_role)
returns boolean
language sql
stable
security invoker
set search_path = public, private
as $$
  select private.has_role(requested_user_id, requested_role);
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public, private
as $$
  select private.is_admin();
$$;

revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;