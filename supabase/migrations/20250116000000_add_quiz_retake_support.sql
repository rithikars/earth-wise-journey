-- Add support for quiz retakes by updating the award_quiz_points function
-- to replace old points instead of ignoring them

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

  -- Update lesson progress with new quiz score (always update, not just if higher)
  insert into public.lesson_progress (user_id, lesson_id, quiz_score)
  values (uid, award_quiz_points.lesson_id, correct)
  on conflict (user_id, lesson_id)
    do update set quiz_score = excluded.quiz_score, updated_at = now();

  -- Update eco point events - replace old points with new ones
  insert into public.eco_point_events (user_id, lesson_id, event_type, points)
  values (uid, award_quiz_points.lesson_id, 'quiz_complete', pts)
  on conflict (user_id, lesson_id, event_type) 
    do update set points = excluded.points, created_at = now();

  return public.get_total_points();
end;
$$;

-- Add a new function specifically for retaking quizzes
-- This function explicitly handles the retake scenario
create or replace function public.retake_quiz_points(lesson_id text, correct integer, total integer)
returns integer
language plpgsql
security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  pct numeric;
  pts integer;
  old_points integer := 0;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;
  if total <= 0 then
    raise exception 'Total questions must be > 0';
  end if;
  
  -- Get the old points for this quiz
  select points into old_points 
  from public.eco_point_events 
  where user_id = uid and lesson_id = retake_quiz_points.lesson_id and event_type = 'quiz_complete';
  
  pct := (correct::numeric * 100) / total::numeric;
  if pct >= 90 then pts := 50;
  elsif pct >= 70 then pts := 40;
  elsif pct >= 50 then pts := 25;
  else pts := 10; end if;

  -- Update lesson progress with new quiz score
  insert into public.lesson_progress (user_id, lesson_id, quiz_score)
  values (uid, retake_quiz_points.lesson_id, correct)
  on conflict (user_id, lesson_id)
    do update set quiz_score = excluded.quiz_score, updated_at = now();

  -- Update eco point events - replace old points with new ones
  insert into public.eco_point_events (user_id, lesson_id, event_type, points)
  values (uid, retake_quiz_points.lesson_id, 'quiz_complete', pts)
  on conflict (user_id, lesson_id, event_type) 
    do update set points = excluded.points, created_at = now();

  return public.get_total_points();
end;
$$;
