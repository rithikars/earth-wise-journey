import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useAuth } from "@/contexts/AuthContext"

interface EcoPointsContextType {
  points: number
  awardVideoPoints: (lessonId: string) => Promise<void>
  awardQuizPoints: (lessonId: string, correct: number, total: number) => Promise<void>
  awardTaskPoints: (lessonId: string) => Promise<void>
  refreshPoints: () => Promise<void>
  isLoading: boolean
}

const EcoPointsContext = createContext<EcoPointsContextType | undefined>(undefined)

export const useEcoPoints = () => {
  const context = useContext(EcoPointsContext)
  if (!context) {
    throw new Error("useEcoPoints must be used within an EcoPointsProvider")
  }
  return context
}

interface EcoPointsProviderProps {
  children: ReactNode
}

export const EcoPointsProvider = ({ children }: EcoPointsProviderProps) => {
  const [points, setPoints] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user, session } = useAuth()

  const checkAuth = () => {
    if (!user || !session) {
      throw new Error('SIGN_IN_REQUIRED')
    }
  }

  const refreshPoints = async () => {
    try {
      if (!user || !session) {
        setPoints(0)
        return
      }
      const { data, error } = await supabase.rpc('get_total_points')
      if (error) throw error
      setPoints(data || 0)
    } catch (error) {
      console.error('Error fetching points:', error)
      setPoints(0)
    }
  }

  const awardVideoPoints = async (lessonId: string) => {
    setIsLoading(true)
    try {
      checkAuth()
      const { data, error } = await supabase.rpc('award_video_points', { lesson_id: lessonId })
      if (error) throw error
      
      setPoints(data || 0)
      toast({
        title: "Video Complete!",
        description: "You earned 25 eco points! 🌱",
        duration: 3000
      })
    } catch (error: any) {
      console.error('Error awarding video points:', error)
      const msg = error?.message || ''
      if (!msg.includes('duplicate key')) {
        const needsSignIn = msg === 'SIGN_IN_REQUIRED' || msg === 'Not authenticated' || msg.includes('Anonymous sign-ins are disabled')
        toast({
          title: needsSignIn ? "Sign in required" : "Error",
          description: needsSignIn ? "Please sign in to earn Eco Points." : "Failed to award points. Please try again.",
          variant: "destructive",
          action: needsSignIn ? (
            <ToastAction altText="Sign in" onClick={() => { window.location.href = '/signin' }}>
              Sign in
            </ToastAction>
          ) : undefined
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const awardQuizPoints = async (lessonId: string, correct: number, total: number) => {
    setIsLoading(true)
    try {
      checkAuth()
      const { data, error } = await supabase.rpc('award_quiz_points', {
        lesson_id: lessonId,
        correct,
        total
      })
      if (error) throw error
      
      const percentage = (correct / total) * 100
      let earnedPoints = 10
      if (percentage >= 90) earnedPoints = 50
      else if (percentage >= 70) earnedPoints = 40
      else if (percentage >= 50) earnedPoints = 25
      
      setPoints(data || 0)
      toast({
        title: "Quiz Complete!",
        description: `You earned ${earnedPoints} eco points! 🌱`,
        duration: 3000
      })
    } catch (error: any) {
      console.error('Error awarding quiz points:', error)
      const msg = error?.message || ''
      if (!msg.includes('duplicate key')) {
        const needsSignIn = msg === 'SIGN_IN_REQUIRED' || msg === 'Not authenticated' || msg.includes('Anonymous sign-ins are disabled')
        toast({
          title: needsSignIn ? "Sign in required" : "Error",
          description: needsSignIn ? "Please sign in to earn Eco Points." : "Failed to award points. Please try again.",
          variant: "destructive",
          action: needsSignIn ? (
            <ToastAction altText="Sign in" onClick={() => { window.location.href = '/signin' }}>
              Sign in
            </ToastAction>
          ) : undefined
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const awardTaskPoints = async (lessonId: string) => {
    setIsLoading(true)
    try {
      checkAuth()
      const { data, error } = await supabase.rpc('award_task_points', { lesson_id: lessonId })
      if (error) throw error
      
      setPoints(data || 0)
      toast({
        title: "Task Verified!",
        description: "You earned 70 eco points! 🌱",
        duration: 3000
      })
    } catch (error: any) {
      console.error('Error awarding task points:', error)
      const msg = error?.message || ''
      if (!msg.includes('duplicate key')) {
        const needsSignIn = msg === 'SIGN_IN_REQUIRED' || msg === 'Not authenticated' || msg.includes('Anonymous sign-ins are disabled')
        toast({
          title: needsSignIn ? "Sign in required" : "Error",
          description: needsSignIn ? "Please sign in to earn Eco Points." : "Failed to award points. Please try again.",
          variant: "destructive",
          action: needsSignIn ? (
            <ToastAction altText="Sign in" onClick={() => { window.location.href = '/signin' }}>
              Sign in
            </ToastAction>
          ) : undefined
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Load initial points when user changes
    refreshPoints()
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('eco-points-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'eco_point_events'
        },
        () => {
          refreshPoints()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  return (
    <EcoPointsContext.Provider
      value={{
        points,
        awardVideoPoints,
        awardQuizPoints,
        awardTaskPoints,
        refreshPoints,
        isLoading
      }}
    >
      {children}
    </EcoPointsContext.Provider>
  )
}