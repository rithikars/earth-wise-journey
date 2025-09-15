-- Create real-world tasks table
CREATE TABLE public.real_world_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id TEXT NOT NULL,
  photo_url TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE public.real_world_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for real-world tasks
CREATE POLICY "Users can view their own tasks" 
ON public.real_world_tasks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks" 
ON public.real_world_tasks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
ON public.real_world_tasks 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create user ranks table
CREATE TABLE public.user_ranks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  current_rank INTEGER NOT NULL DEFAULT 1 CHECK (current_rank >= 1 AND current_rank <= 6),
  lifetime_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_ranks ENABLE ROW LEVEL SECURITY;

-- Create policies for user ranks
CREATE POLICY "Users can view their own rank" 
ON public.user_ranks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rank" 
ON public.user_ranks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rank" 
ON public.user_ranks 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create badges table
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  points_required INTEGER NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_name)
);

-- Enable RLS
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Create policies for user badges
CREATE POLICY "Users can view their own badges" 
ON public.user_badges 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own badges" 
ON public.user_badges 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Update the existing profile creation trigger to include default rank
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)));
  
  -- Create default user rank
  INSERT INTO public.user_ranks (user_id, current_rank, lifetime_points)
  VALUES (NEW.id, 1, 0);
  
  RETURN NEW;
END;
$function$;

-- Function to verify real-world task and award points
CREATE OR REPLACE FUNCTION public.verify_task_and_award_points(_task_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  task_record real_world_tasks%ROWTYPE;
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get the task
  SELECT * INTO task_record FROM public.real_world_tasks WHERE id = _task_id AND user_id = uid;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Task not found';
  END IF;
  
  IF task_record.verification_status = 'verified' THEN
    RAISE EXCEPTION 'Task already verified';
  END IF;

  -- Update task as verified
  UPDATE public.real_world_tasks 
  SET verification_status = 'verified', 
      verified_by = uid, 
      verified_at = now(),
      points_awarded = 70,
      updated_at = now()
  WHERE id = _task_id;

  -- Award points
  INSERT INTO public.eco_point_events (user_id, lesson_id, event_type, points)
  VALUES (uid, task_record.lesson_id, 'task_verified', 70)
  ON CONFLICT (user_id, lesson_id, event_type) DO NOTHING;
  
  -- Update lesson progress
  INSERT INTO public.lesson_progress (user_id, lesson_id, task_verified)
  VALUES (uid, task_record.lesson_id, true)
  ON CONFLICT (user_id, lesson_id)
    DO UPDATE SET task_verified = true, updated_at = now();

  RETURN public.get_total_points();
END;
$function$;

-- Add trigger for updating timestamps
CREATE TRIGGER update_real_world_tasks_updated_at
BEFORE UPDATE ON public.real_world_tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_ranks_updated_at
BEFORE UPDATE ON public.user_ranks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();