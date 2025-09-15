import { Leaf, Award } from "lucide-react"
import { useEcoPoints } from "@/contexts/EcoPointsContext"

interface EcoPointsBarProps {
  level?: string
}

export const EcoPointsBar = ({ level = "Seedling" }: EcoPointsBarProps) => {
  const { points } = useEcoPoints()
  return (
    <div className="flex items-center gap-3 bg-gradient-eco rounded-full px-4 py-2 shadow-glow">
      <Leaf className="h-5 w-5 text-success-foreground" />
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-success-foreground">
          {points} Eco Points
        </span>
        <div className="h-4 w-px bg-success-foreground/20" />
        <div className="flex items-center gap-1">
          <Award className="h-4 w-4 text-success-foreground" />
          <span className="text-xs font-medium text-success-foreground/80">
            {level}
          </span>
        </div>
      </div>
    </div>
  )
}