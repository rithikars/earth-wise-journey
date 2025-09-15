import { Link, useLocation } from "react-router-dom"
import { Leaf, ShoppingBag, Trophy, Home } from "lucide-react"
import { EcoPointsBar } from "./EcoPointsBar"

export const Navbar = () => {
  const location = useLocation()
  
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
            <EcoPointsBar points={250} level="Seedling" />
            
            <div className="flex items-center gap-1">
              <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              
              <Link to="/shop" className={navLinkClass("/shop")}>
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Shop</span>
              </Link>
              
              <Link to="/leaderboard" className={navLinkClass("/leaderboard")}>
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Leaderboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}