-- Create eco_point_events table to track point awards per event
create table public.eco_point_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  lesson_id text,
  event_type text not null check (event_type in ('video_complete','quiz_complete','task_verified','manual_adjustment')),
  points integer not null,
  metadata jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, lesson_id, event_type)
);

-- Create lesson_progress table to track lesson states
create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  lesson_id text not null,
  video_completed boolean not null default false,
  quiz_score integer,
  task_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

-- Trigger function to auto update updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public;

-- Attach trigger to lesson_progress
create trigger trg_lesson_progress_updated_at
before update on public.lesson_progress
for each row execute function public.update_updated_at_column();

-- Enable RLS
alter table public.eco_point_events enable row level security;
alter table public.lesson_progress enable row level security;

-- RLS policies for lesson_progress (users can manage their own progress)
create policy "Select own lesson_progress"
  on public.lesson_progress for select using (auth.uid() = user_id);

create policy "Insert own lesson_progress"
  on public.lesson_progress for insert with check (auth.uid() = user_id);

create policy "Update own lesson_progress"
  on public.lesson_progress for update using (auth.uid() = user_id);

-- RLS policies for eco_point_events (read own only). No direct inserts to avoid client tampering
create policy "Select own eco_point_events"
  on public.eco_point_events for select using (auth.uid() = user_id);

-- Helper: compute total points for current user
create or replace function public.get_total_points()
returns integer
language sql
security definer set search_path = public as $$
  select coalesce(sum(points), 0)::integer from public.eco_point_events where user_id = auth.uid();
$$;

-- Award video completion points and mark progress
create or replace function public.award_video_points(lesson_id text)
returns integer
language plpgsql
security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.lesson_progress (user_id, lesson_id, video_completed)
  values (uid, award_video_points.lesson_id, true)
  on conflict (user_id, lesson_id)
    do update set video_completed = true, updated_at = now();

  insert into public.eco_point_events (user_id, lesson_id, event_type, points)
  values (uid, award_video_points.lesson_id, 'video_complete', 25)
  on conflict (user_id, lesson_id, event_type) do nothing;

  return public.get_total_points();
end;
$$;

-- Map quiz score to points: >=90 -> 50, >=70 -> 40, >=50 -> 25, else 10
create or replace function public.award_quiz_points(lesson_id text, correct integer, total integer)
returns integer
language plpgsql
security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  pct numeric;
  pts integer;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;
  if total <= 0 then
    raise exception 'Total questions must be > 0';
  end if;
  pct := (correct::numeric * 100) / total::numeric;
  if pct >= 90 then pts := 50;
  elsif pct >= 70 then pts := 40;
  elsif pct >= 50 then pts := 25;
  else pts := 10; end if;

  insert into public.lesson_progress (user_id, lesson_id, quiz_score)
  values (uid, award_quiz_points.lesson_id, correct)
  on conflict (user_id, lesson_id)
    do update set quiz_score = greatest(excluded.quiz_score, public.lesson_progress.quiz_score), updated_at = now();

  insert into public.eco_point_events (user_id, lesson_id, event_type, points)
  values (uid, award_quiz_points.lesson_id, 'quiz_complete', pts)
  on conflict (user_id, lesson_id, event_type) do nothing;

  return public.get_total_points();
end;
$$;

-- Award task verification points and mark as verified
create or replace function public.award_task_points(lesson_id text)
returns integer
language plpgsql
security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.lesson_progress (user_id, lesson_id, task_verified)
  values (uid, award_task_points.lesson_id, true)
  on conflict (user_id, lesson_id)
    do update set task_verified = true, updated_at = now();

  insert into public.eco_point_events (user_id, lesson_id, event_type, points)
  values (uid, award_task_points.lesson_id, 'task_verified', 70)
  on conflict (user_id, lesson_id, event_type) do nothing;

  return public.get_total_points();
end;
$$;

-- Performance and realtime setup for eco_point_events
alter table public.eco_point_events replica identity full;
alter publication supabase_realtime add table public.eco_point_events;

-- Helpful indexes
create index idx_eco_events_user on public.eco_point_events(user_id);
create index idx_eco_events_user_lesson on public.eco_point_events(user_id, lesson_id);
create index idx_lesson_progress_user on public.lesson_progress(user_id);