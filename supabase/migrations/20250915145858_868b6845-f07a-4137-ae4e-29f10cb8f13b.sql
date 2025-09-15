-- Fix ambiguous parameter names in award_* functions by renaming args and qualifying usage

-- QUIZ POINTS
CREATE OR REPLACE FUNCTION public.award_quiz_points(
  _lesson_id text,
  _correct integer,
  _total integer
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  uid uuid := auth.uid();
  pct numeric;
  pts integer;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF _total <= 0 THEN
    RAISE EXCEPTION 'Total questions must be > 0';
  END IF;

  pct := (_correct::numeric * 100) / _total::numeric;
  IF pct >= 90 THEN pts := 50;
  ELSIF pct >= 70 THEN pts := 40;
  ELSIF pct >= 50 THEN pts := 25;
  ELSE pts := 10; END IF;

  INSERT INTO public.lesson_progress (user_id, lesson_id, quiz_score)
  VALUES (uid, _lesson_id, _correct)
  ON CONFLICT (user_id, lesson_id)
    DO UPDATE SET quiz_score = GREATEST(excluded.quiz_score, public.lesson_progress.quiz_score), updated_at = now();

  INSERT INTO public.eco_point_events (user_id, lesson_id, event_type, points)
  VALUES (uid, _lesson_id, 'quiz_complete', pts)
  ON CONFLICT (user_id, lesson_id, event_type) DO NOTHING;

  RETURN public.get_total_points();
END;
$$;

-- VIDEO POINTS
CREATE OR REPLACE FUNCTION public.award_video_points(
  _lesson_id text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.lesson_progress (user_id, lesson_id, video_completed)
  VALUES (uid, _lesson_id, true)
  ON CONFLICT (user_id, lesson_id)
    DO UPDATE SET video_completed = true, updated_at = now();

  INSERT INTO public.eco_point_events (user_id, lesson_id, event_type, points)
  VALUES (uid, _lesson_id, 'video_complete', 25)
  ON CONFLICT (user_id, lesson_id, event_type) DO NOTHING;

  RETURN public.get_total_points();
END;
$$;

-- TASK POINTS
CREATE OR REPLACE FUNCTION public.award_task_points(
  _lesson_id text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.lesson_progress (user_id, lesson_id, task_verified)
  VALUES (uid, _lesson_id, true)
  ON CONFLICT (user_id, lesson_id)
    DO UPDATE SET task_verified = true, updated_at = now();

  INSERT INTO public.eco_point_events (user_id, lesson_id, event_type, points)
  VALUES (uid, _lesson_id, 'task_verified', 70)
  ON CONFLICT (user_id, lesson_id, event_type) DO NOTHING;

  RETURN public.get_total_points();
END;
$$;