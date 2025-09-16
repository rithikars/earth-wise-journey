-- Add coupon redemption functionality
-- This migration adds a function to redeem coupons by deducting eco points

-- First, update the event_type check constraint to include 'coupon_redemption'
ALTER TABLE public.eco_point_events 
DROP CONSTRAINT IF EXISTS eco_point_events_event_type_check;

ALTER TABLE public.eco_point_events 
ADD CONSTRAINT eco_point_events_event_type_check 
CHECK (event_type IN ('video_complete','quiz_complete','task_verified','manual_adjustment','coupon_redemption'));

-- Create function to redeem coupons
CREATE OR REPLACE FUNCTION public.redeem_coupon(
  _coupon_id text,
  _points_cost integer
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  uid uuid := auth.uid();
  current_total integer;
  new_total integer;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  IF _points_cost <= 0 THEN
    RAISE EXCEPTION 'Points cost must be positive';
  END IF;

  -- Get current total points
  current_total := public.get_total_points();
  
  -- Check if user has enough points
  IF current_total < _points_cost THEN
    RAISE EXCEPTION 'Insufficient points. Required: %, Available: %', _points_cost, current_total;
  END IF;

  -- Insert negative points event for redemption
  INSERT INTO public.eco_point_events (user_id, lesson_id, event_type, points, metadata)
  VALUES (uid, _coupon_id, 'coupon_redemption', -_points_cost, jsonb_build_object('coupon_id', _coupon_id, 'redeemed_at', now()))
  ON CONFLICT (user_id, lesson_id, event_type) DO NOTHING;

  -- Return new total points
  RETURN public.get_total_points();
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.redeem_coupon(text, integer) TO authenticated;
