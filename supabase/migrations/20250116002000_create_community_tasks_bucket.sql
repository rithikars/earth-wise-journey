-- Create storage bucket for community tasks photos
insert into storage.buckets (id, name, public) values ('community-tasks', 'community-tasks', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload to their own folder (userId/filename)
create policy if not exists "Allow insert own community tasks photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'community-tasks' and (auth.uid()::text = split_part(name, '/', 1))
  );

create policy if not exists "Allow read public community tasks photos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'community-tasks');


