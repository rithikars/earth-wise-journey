-- Add grade and region fields to user profiles
-- Grade options: 'elementary_1_4', 'middle_5_8', 'high_9_12', 'college'
-- Region options: 'north_india','south_india','east_india','west_india','central_india'

alter table public.profiles
  add column if not exists grade text check (grade in ('elementary_1_4','middle_5_8','high_9_12','college')),
  add column if not exists region text check (region in ('north_india','south_india','east_india','west_india','central_india'));

-- Ensure existing rows remain valid (nullable allowed at creation). UI enforces required on signup.


