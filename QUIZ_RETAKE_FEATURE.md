# Quiz Retake Feature Implementation

## Overview
This document describes the implementation of the quiz retake functionality that allows users to retake quizzes and have their Eco Points updated accordingly.

## Features Implemented

### 1. Frontend Changes

#### Quiz.tsx
- Added "Retake Quiz" button on the quiz results screen
- Added retake state management (`isRetake` state)
- Added visual indicators for retake attempts (badge in quiz header)
- Added toast notifications for retake actions
- Modified quiz completion logic to use different point awarding functions based on retake status

#### EcoPointsContext.tsx
- Added `retakeQuizPoints` function to handle quiz retakes
- Updated context interface to include the new function
- Integrated with Supabase `retake_quiz_points` RPC function

### 2. Backend Changes

#### Database Migration
- Created new migration: `20250116000000_add_quiz_retake_support.sql`
- Updated `award_quiz_points` function to replace old points instead of ignoring them
- Added new `retake_quiz_points` function specifically for retake scenarios
- Updated Supabase types to include the new function

### 3. Key Features

#### Point Replacement Logic
- When a user retakes a quiz, the old Eco Points are replaced with new points
- Points are not added on top of existing points
- The system maintains accurate point tracking across retakes

#### User Experience
- Clear visual indicators when retaking a quiz
- Toast notifications for retake actions
- Seamless quiz reset functionality
- Maintains all existing quiz functionality

#### Database Integrity
- Uses Supabase RPC functions for secure point management
- Maintains referential integrity with existing point tracking
- Supports real-time point updates

## Usage

1. Complete a quiz normally
2. On the results screen, click "Retake Quiz" button
3. The quiz resets to the first question
4. Complete the quiz again
5. New points replace the old points for that specific quiz
6. Total Eco Points are updated accordingly

## Technical Details

### Database Functions
- `award_quiz_points`: Updated to replace points on conflict
- `retake_quiz_points`: New function specifically for retakes
- Both functions update `lesson_progress` and `eco_point_events` tables

### State Management
- `isRetake`: Boolean flag to track retake status
- Quiz state reset on retake (questions, answers, progress)
- Different toast messages for first attempt vs retake

### Security
- All point operations go through Supabase RPC functions
- Row Level Security (RLS) policies maintained
- No direct client-side point manipulation

## Migration Instructions

To apply the database changes:
```bash
npx supabase db push
```

Or manually run the migration file in your Supabase dashboard.

## Testing

The feature can be tested by:
1. Taking a quiz and noting the points earned
2. Clicking "Retake Quiz" on the results screen
3. Completing the quiz again with different answers
4. Verifying that the new points replace the old ones
5. Checking that total points are updated correctly
