import { ReactNode, useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

interface AuthGateProps {
  children: ReactNode
}

export const AuthGate = ({ children }: AuthGateProps) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    const init = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        if (!sessionData.session) {
          // Attempt anonymous sign-in so RPCs with auth.uid() work
          await supabase.auth.signInAnonymously()
        }
      } catch (err) {
        console.error("Auth initialization failed", err)
      } finally {
        if (mounted) setReady(true)
      }
    }
    init()
    return () => {
      mounted = false
    }
  }, [])

  if (!ready) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-pulse text-sm opacity-70">Initializing...</div>
      </div>
    )
  }

  return <>{children}</>
}
