revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.hash_secret(text) from public, anon, authenticated;
revoke all on function public.verify_secret(text, text) from public, anon, authenticated;
revoke all on function public.is_class_school_owner(uuid) from public, anon, authenticated;
revoke all on function public.is_class_teacher(uuid) from public, anon, authenticated;
revoke all on function public.is_school_owner(uuid) from public, anon, authenticated;
revoke all on function public.is_student_school_owner(uuid) from public, anon, authenticated;
revoke all on function public.is_student_teacher(uuid) from public, anon, authenticated;
revoke all on function public.user_is_school_member(uuid) from public, anon, authenticated;

revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

alter function public.handle_new_user() set search_path = public;
alter function public.hash_secret(text) set search_path = public, extensions;
alter function public.verify_secret(text, text) set search_path = public, extensions;
alter function public.is_class_school_owner(uuid) set search_path = public;
alter function public.is_class_teacher(uuid) set search_path = public;
alter function public.is_school_owner(uuid) set search_path = public;
alter function public.is_student_school_owner(uuid) set search_path = public;
alter function public.is_student_teacher(uuid) set search_path = public;
alter function public.user_is_school_member(uuid) set search_path = public;