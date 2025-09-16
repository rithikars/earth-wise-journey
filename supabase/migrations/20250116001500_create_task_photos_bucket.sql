-- Create storage bucket for community task photos
insert into storage.buckets (id, name, public) values ('task-photos', 'task-photos', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload to their own folder
create policy if not exists "Allow insert own task photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'task-photos' and (auth.uid()::text = split_part(name, '/', 1))
  );

create policy if not exists "Allow read public task photos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'task-photos');


