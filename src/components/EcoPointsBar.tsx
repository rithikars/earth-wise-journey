import { Leaf } from "lucide-react"
import { useEcoPoints } from "@/contexts/EcoPointsContext"

export const EcoPointsBar = () => {
  const { totalPoints, loading } = useEcoPoints()

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-eco text-success-foreground shadow-glow transition-all duration-300 hover:shadow-nature">
      <Leaf className="h-5 w-5 text-success-foreground" />
      <span className="font-semibold text-sm">
        {loading ? "..." : totalPoints.toLocaleString()}
      </span>
      <span className="text-xs opacity-90">
        Eco Points
      </span>
    </div>
  )
}