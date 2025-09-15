import { Star, Award } from "lucide-react"

interface EcoPointsBarProps {
  points: number
  level?: string
}

export const EcoPointsBar = ({ points, level = "Seedling" }: EcoPointsBarProps) => {
  return (
    <div className="flex items-center gap-3 bg-gradient-gold rounded-full px-4 py-2 shadow-glow">
      <Star className="h-5 w-5 text-gold-foreground fill-current" />
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gold-foreground">
          {points} Eco Points
        </span>
        <div className="h-4 w-px bg-gold-foreground/20" />
        <div className="flex items-center gap-1">
          <Award className="h-4 w-4 text-gold-foreground" />
          <span className="text-xs font-medium text-gold-foreground/80">
            {level}
          </span>
        </div>
      </div>
    </div>
  )
}