do $$
declare
  target_table text;
  policy_row record;
begin
  foreach target_table in array array[
    'schools', 'classes', 'class_teachers', 'students', 'grades', 'comments', 'settings', 'subscriptions', 'traits',
    'ms_halqahs', 'ms_reports', 'ms_students', 'teacher_sessions'
  ] loop
    for policy_row in
      select policyname from pg_policies where schemaname = 'public' and tablename = target_table
    loop
      execute format('drop policy if exists %I on public.%I', policy_row.policyname, target_table);
    end loop;
    execute format('create policy %I on public.%I for all to anon, authenticated using (false) with check (false)', 'legacy_locked_' || target_table, target_table);
  end loop;
end $$;

drop policy if exists "School owners can delete their logos" on storage.objects;
drop policy if exists "School owners can update their logos" on storage.objects;
drop policy if exists "School owners can upload their logos" on storage.objects;
drop policy if exists "School owners can view their logos" on storage.objects;