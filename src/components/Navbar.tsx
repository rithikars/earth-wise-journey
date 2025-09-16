import { Link, useLocation, useNavigate } from "react-router-dom"
import { Leaf, Trophy, Award, LogOut } from "lucide-react"
import { EcoPointsBar } from "@/components/EcoPointsBar"
import { Button } from "@/components/ui/enhanced-button"
import { useAuth } from "@/contexts/AuthContext"

export const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  
  const isActive = (path: string) => location.pathname === path

  const navLinkClass = (path: string) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
      isActive(path)
        ? "bg-primary text-primary-foreground shadow-nature"
        : "text-foreground hover:bg-accent hover:text-accent-foreground"
    }`

  return (
    <nav className="bg-card border-b border-border shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              AgroLearn
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <Link to="/badges" className={navLinkClass("/badges")}>
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Badges</span>
              </Link>
              
              <Link to="/leaderboard" className={navLinkClass("/leaderboard")}>
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Leaderboard</span>
              </Link>
            </div>
            
            <div className="ml-auto">
              <EcoPointsBar />
            </div>

            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await signOut()
                  navigate("/")
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}