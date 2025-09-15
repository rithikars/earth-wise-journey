-- Update quiz points function to award 0 points for 0 correct answers
CREATE OR REPLACE FUNCTION public.award_quiz_points(_lesson_id text, _correct integer, _total integer)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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

  -- If no correct answers, award 0 points
  IF _correct = 0 THEN 
    pts := 0;
  ELSE
    pct := (_correct::numeric * 100) / _total::numeric;
    IF pct >= 90 THEN pts := 50;
    ELSIF pct >= 70 THEN pts := 40;
    ELSIF pct >= 50 THEN pts := 25;
    ELSE pts := 10; END IF;
  END IF;

  INSERT INTO public.lesson_progress (user_id, lesson_id, quiz_score)
  VALUES (uid, _lesson_id, _correct)
  ON CONFLICT (user_id, lesson_id)
    DO UPDATE SET quiz_score = GREATEST(excluded.quiz_score, public.lesson_progress.quiz_score), updated_at = now();

  -- Only insert points if points > 0
  IF pts > 0 THEN
    INSERT INTO public.eco_point_events (user_id, lesson_id, event_type, points)
    VALUES (uid, _lesson_id, 'quiz_complete', pts)
    ON CONFLICT (user_id, lesson_id, event_type) DO NOTHING;
  END IF;

  RETURN public.get_total_points();
END;
$function$;