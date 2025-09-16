// --- Supabase Schema (SQL) ---
// eco_points table: stores each user's total eco points
/*
create table eco_points (
  user_id uuid primary key references auth.users(id) on delete cascade,
  total_points integer not null default 0,
  updated_at timestamp with time zone default now()
);

-- quiz_attempts table: stores per-user, per-quiz attempts
create table quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  quiz_id uuid not null,
  score integer not null,
  created_at timestamp with time zone default now(),
  unique (user_id, quiz_id)
);
*/

// --- updateEcoPoints function (TypeScript) ---
import { supabase } from "@/integrations/supabase/client";

/**
 * Updates eco points for a user based on activity.
 * @param userId - User's UUID
 * @param activityType - "video" | "quiz" | "task"
 * @param options - For "quiz": { quizId: string, score: number }
 *                  For "video" and "task": { lessonId: string }
 */
export async function updateEcoPoints(
  userId: string,
  activityType: "video" | "quiz" | "task",
  options: { quizId?: string; score?: number; lessonId?: string }
): Promise<number | null> {
  if (!userId) return null;

  let delta = 0;

  if (activityType === "video") {
    delta = 25;
    // Optionally: check if already awarded for this lesson
  } else if (activityType === "quiz") {
    const { quizId, score } = options;
    if (!quizId || typeof score !== "number") return null;

    // Clamp score to 10-50
    const newPoints = Math.max(10, Math.min(50, score));
    // Get previous attempt
    const { data: prev, error: prevErr } = await supabase
      .from("quiz_attempts")
      .select("score")
      .eq("user_id", userId)
      .eq("quiz_id", quizId)
      .single();

    let prevPoints = 0;
    if (prev && typeof prev.score === "number") {
      prevPoints = Math.max(10, Math.min(50, prev.score));
    }

    delta = newPoints - prevPoints;

    // Upsert quiz_attempts
    await supabase.from("quiz_attempts").upsert(
      [
        {
          user_id: userId,
          quiz_id: quizId,
          score: score,
        },
      ],
      { onConflict: "user_id,quiz_id" }
    );
  } else if (activityType === "task") {
    delta = 70;
    // Optionally: check if already awarded for this lesson
  }

  // Fetch current points
  const { data: eco, error: ecoErr } = await supabase
    .from("eco_points")
    .select("total_points")
    .eq("user_id", userId)
    .single();

  let current = eco && typeof eco.total_points === "number" ? eco.total_points : 0;
  let newTotal = Math.max(0, current + delta);

  // Upsert eco_points
  await supabase.from("eco_points").upsert([
    {
      user_id: userId,
      total_points: newTotal,
      updated_at: new Date().toISOString(),
    },
  ]);

  return newTotal;
}

// --- Badge Calculation Helper ---
/**
 * Returns badge number (0 = no badge, 1 = first badge, etc.) based on total points.
 */
export function getBadgeLevel(totalPoints: number): number {
  if (totalPoints < 30) return 0;
  return 1 + Math.floor((totalPoints - 30) / 350);
}

// --- Navbar with Real-Time Eco Points ---
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function EcoPointsNavbar() {
  const { user } = useAuth();
  const [ecoPoints, setEcoPoints] = useState<number>(0);

  useEffect(() => {
    if (!user) return;

    // Initial fetch
    supabase
      .from("eco_points")
      .select("total_points")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        setEcoPoints(data?.total_points ?? 0);
      });

    // Real-time subscription
    const channel = supabase
      .channel("eco_points_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "eco_points",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newPoints =
            payload.new?.total_points ?? payload.old?.total_points ?? 0;
          setEcoPoints(Math.max(0, newPoints));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <nav className="navbar">
      <span>
        Eco Points: <b>{ecoPoints}</b>
      </span>
      {/* ...other navbar items... */}
    </nav>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
