import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/enhanced-button"
import { Award, Crown, Leaf, Lock, Star, Trophy, Gift, Zap } from "lucide-react"
import { useEcoPoints } from "@/contexts/EcoPointsContext"

interface BadgeData {
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  pointsRequired: number
  unlocked: boolean
}

interface Coupon {
  id: string
  title: string
  description: string
  code: string
  discount: string
  university: string
}

const Badges = () => {
  const { totalPoints } = useEcoPoints()
  const [userRank, setUserRank] = useState(1)
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([])

  // Badge unlock rules
  const badges: BadgeData[] = [
    {
      name: "First Steps",
      description: "Complete your first lesson",
      icon: Leaf,
      pointsRequired: 100,
      unlocked: totalPoints >= 100
    },
    {
      name: "Knowledge Seeker",
      description: "Earn 700 eco points",
      icon: Star,
      pointsRequired: 700,
      unlocked: totalPoints >= 700
    },
    {
      name: "Eco Warrior",
      description: "Earn 1200 eco points",
      icon: Award,
      pointsRequired: 1200,
      unlocked: totalPoints >= 1200
    },
    {
      name: "Climate Champion",
      description: "Earn 1800 eco points",
      icon: Trophy,
      pointsRequired: 1800,
      unlocked: totalPoints >= 1800
    },
    {
      name: "Sustainability Master",
      description: "Earn 2400 eco points",
      icon: Crown,
      pointsRequired: 2400,
      unlocked: totalPoints >= 2400
    },
    {
      name: "Earth Guardian",
      description: "Earn 3000 eco points",
      icon: Zap,
      pointsRequired: 3000,
      unlocked: totalPoints >= 3000
    }
  ]

  // Calculate rank based on eco points
  useEffect(() => {
    let rank = 1
    if (totalPoints >= 100) rank = 2
    if (totalPoints >= 250) rank = 3
    if (totalPoints >= 500) rank = 4
    if (totalPoints >= 1000) rank = 5
    if (totalPoints >= 2500) rank = 6
    if (totalPoints >= 5000) rank = 7
    setUserRank(rank)

    // Sample coupons based on rank
    const coupons: Coupon[] = []
    if (rank >= 2) {
      coupons.push({
        id: "1",
        title: "Campus Cafe Discount",
        description: "10% off all sustainable food options",
        code: "ECO10",
        discount: "10%",
        university: "Your University"
      })
    }
    if (rank >= 4) {
      coupons.push({
        id: "2", 
        title: "Green Transportation",
        description: "Free bike rental for 1 week",
        code: "BIKE7DAY",
        discount: "100%",
        university: "Your University"
      })
    }
    if (rank >= 6) {
      coupons.push({
        id: "3",
        title: "Sustainability Store",
        description: "25% off eco-friendly products",
        code: "SUSTAIN25",
        discount: "25%", 
        university: "Your University"
      })
    }
    setAvailableCoupons(coupons)
  }, [totalPoints])

  const getRankName = (rank: number) => {
    const ranks = ["", "Seedling", "Sprout", "Sapling", "Young Tree", "Mature Tree", "Ancient Oak", "Forest Guardian"]
    return ranks[rank] || "Forest Guardian"
  }

  const getNextRankPoints = (rank: number) => {
    const thresholds = [0, 100, 250, 500, 1000, 2500, 5000, Infinity]
    return thresholds[rank] || Infinity
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="text-center bg-gradient-hero rounded-2xl p-8 text-primary-foreground shadow-nature">
            <Award className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              Badges & Achievements 🏆
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Track your progress and unlock rewards as you advance in your sustainability journey!
            </p>
          </div>
        </div>

        {/* Current Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-eco rounded-full flex items-center justify-center mx-auto mb-3">
                <Leaf className="h-8 w-8 text-success-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">{totalPoints.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Eco Points</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="h-8 w-8 text-primary-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">Rank {userRank}</p>
              <p className="text-sm text-muted-foreground">{getRankName(userRank)}</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-8 w-8 text-primary-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">{badges.filter(b => b.unlocked).length}</p>
              <p className="text-sm text-muted-foreground">Badges Unlocked</p>
            </CardContent>
          </Card>
        </div>

        {/* Badges Section */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle>Your Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((badge) => {
                const IconComponent = badge.icon
                return (
                  <div
                    key={badge.name}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      badge.unlocked
                        ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-glow animate-pulse'
                        : 'border-muted bg-muted/50 opacity-60'
                    }`}
                  >
                    <div className="text-center space-y-3">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                        badge.unlocked ? 'bg-gradient-eco' : 'bg-muted'
                      }`}>
                        {badge.unlocked ? (
                          <IconComponent className="h-8 w-8 text-success-foreground" />
                        ) : (
                          <Lock className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div>
                        <h3 className={`font-bold ${badge.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {badge.name}
                        </h3>
                        <p className={`text-sm ${badge.unlocked ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                          {badge.description}
                        </p>
                      </div>

                      <Badge variant={badge.unlocked ? "default" : "secondary"}>
                        {badge.unlocked ? "Unlocked" : `${badge.pointsRequired} points`}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Coupons Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              University Coupons & Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            {availableCoupons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableCoupons.map((coupon) => (
                  <div key={coupon.id} className="border rounded-lg p-4 bg-gradient-to-br from-primary/5 to-success/5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-foreground">{coupon.title}</h3>
                        <p className="text-sm text-muted-foreground">{coupon.description}</p>
                      </div>
                      <Badge variant="secondary">{coupon.discount} OFF</Badge>
                    </div>
                    
                    <div className="bg-muted rounded p-2 text-center mb-3">
                      <p className="text-xs text-muted-foreground">Coupon Code</p>
                      <p className="font-mono font-bold text-foreground">{coupon.code}</p>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full">
                      Redeem Now
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Coupons Available Yet</h3>
                <p className="text-sm">
                  Earn more points to unlock exclusive university discounts and rewards!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default Badges