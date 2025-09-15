import { ReactNode } from "react"
import { useAuth } from "@/contexts/AuthContext"

interface AuthGateProps {
  children: ReactNode
}

export const AuthGate = ({ children }: AuthGateProps) => {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-pulse text-sm opacity-70">Initializing...</div>
      </div>
    )
  }

  return <>{children}</>
}
