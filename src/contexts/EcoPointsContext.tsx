import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

interface EcoPointsContextType {
  totalPoints: number
  awardVideoPoints: (lessonId: string) => Promise<void>
  awardQuizPoints: (lessonId: string, correct: number, total: number) => Promise<void>
  awardTaskPoints: (lessonId: string) => Promise<void>
  redeemCoupon: (couponId: string, pointsCost: number) => Promise<void>
  loading: boolean
}

const EcoPointsContext = createContext<EcoPointsContextType | undefined>(undefined)

export function useEcoPoints() {
  const context = useContext(EcoPointsContext)
  if (context === undefined) {
    throw new Error('useEcoPoints must be used within an EcoPointsProvider')
  }
  return context
}

interface EcoPointsProviderProps {
  children: ReactNode
}

export function EcoPointsProvider({ children }: EcoPointsProviderProps) {
  const [totalPoints, setTotalPoints] = useState(0)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fetchTotalPoints = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase.rpc('get_total_points')
      if (error) throw error
      setTotalPoints(data || 0)
    } catch (error) {
      console.error('Error fetching total points:', error)
    }
  }

  const awardVideoPoints = async (lessonId: string) => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase.rpc('award_video_points', {
        _lesson_id: lessonId
      })
      if (error) throw error
      setTotalPoints(data || 0)
    } catch (error) {
      console.error('Error awarding video points:', error)
    } finally {
      setLoading(false)
    }
  }

  const awardQuizPoints = async (lessonId: string, correct: number, total: number) => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase.rpc('award_quiz_points', {
        _lesson_id: lessonId,
        _correct: correct,
        _total: total
      })
      if (error) throw error
      setTotalPoints(data || 0)
    } catch (error) {
      console.error('Error awarding quiz points:', error)
    } finally {
      setLoading(false)
    }
  }

  const awardTaskPoints = async (lessonId: string) => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase.rpc('award_task_points', {
        _lesson_id: lessonId
      })
      if (error) throw error
      setTotalPoints(data || 0)
    } catch (error) {
      console.error('Error awarding task points:', error)
    } finally {
      setLoading(false)
    }
  }

  const redeemCoupon = async (couponId: string, pointsCost: number) => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase.rpc('redeem_coupon', {
        _coupon_id: couponId,
        _points_cost: pointsCost
      })
      if (error) throw error
      setTotalPoints(data || 0)
    } catch (error) {
      console.error('Error redeeming coupon:', error)
      throw error // Re-throw so the calling component can handle it
    } finally {
      setLoading(false)
    }
  }

  // Fetch points when user changes
  useEffect(() => {
    if (user) {
      fetchTotalPoints()
    } else {
      setTotalPoints(0)
    }
  }, [user])

  // Set up real-time subscription for point updates
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('eco_point_events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'eco_point_events',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchTotalPoints()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const value = {
    totalPoints,
    awardVideoPoints,
    awardQuizPoints,
    awardTaskPoints,
    redeemCoupon,
    loading
  }

  return <EcoPointsContext.Provider value={value}>{children}</EcoPointsContext.Provider>
}