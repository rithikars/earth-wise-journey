import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { badgeVariants } from "@/components/ui/badge"
import { Button } from "@/components/ui/enhanced-button"
import { Award, Crown, Leaf, Lock, Star, Trophy, Gift, Zap } from "lucide-react"
import { useEcoPoints } from "@/contexts/EcoPointsContext"
import { useToast } from "@/hooks/use-toast"

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
  cost: number
}

const Badges = () => {
  const { totalPoints } = useEcoPoints()
  const { toast } = useToast()
  const [userRank, setUserRank] = useState(1)
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([])
  // Track current spendable points vs lifetime points
  const [currentPoints, setCurrentPoints] = useState(0)
  const [lifetimePoints, setLifetimePoints] = useState(0)

  // Keep current and lifetime points in sync with backend total
  useEffect(() => {
    // Sync increases from backend; don't overwrite local deductions
    setCurrentPoints((prev) => Math.max(prev, totalPoints))
    // lifetime never decreases
    setLifetimePoints((prev) => Math.max(prev, totalPoints))
  }, [totalPoints])

  // Badge unlock rules (first at 100, then +350 each thereafter)
  const baseBadges = [
    { name: "First Steps", icon: Leaf },
    { name: "Knowledge Seeker", icon: Star },
    { name: "Eco Warrior", icon: Award },
    { name: "Climate Champion", icon: Trophy },
    { name: "Sustainability Master", icon: Crown },
    { name: "Earth Guardian", icon: Zap }
  ] as const

  const badges: BadgeData[] = baseBadges.map((b, index) => {
    const pointsRequired = 100 + (index * 350)
    return {
      name: b.name,
      description: index === 0
        ? "Requires 100 eco points"
        : `Requires 350 eco points (after previous badge)` ,
      icon: b.icon,
      pointsRequired,
      unlocked: lifetimePoints >= pointsRequired
    }
  })

  // Calculate rank based on HIGHEST lifetime eco points
  useEffect(() => {
    let rank = 1
    if (lifetimePoints >= 100) rank = 2
    if (lifetimePoints >= 250) rank = 3
    if (lifetimePoints >= 500) rank = 4
    if (lifetimePoints >= 1000) rank = 5
    if (lifetimePoints >= 2500) rank = 6
    if (lifetimePoints >= 5000) rank = 7
    setUserRank(rank)

    // Static coupon catalog regardless of rank; show always
    const coupons: Coupon[] = [
      {
        id: "evergreen",
        title: "Evergreen — ₹20 Buy anything you want!",
        description: "Feel rewarded for going green.",
        cost: 350
      },
      {
        id: "subway",
        title: "Subway — ₹100 off any meal",
        description: "Fuel up sustainably.",
        cost: 2000
      }
    ]
    setAvailableCoupons(coupons)
  }, [lifetimePoints])

  const getRankName = (rank: number) => {
    const ranks = ["", "Seedling", "Sprout", "Sapling", "Young Tree", "Mature Tree", "Ancient Oak", "Forest Guardian"]
    return ranks[rank] || "Forest Guardian"
  }

  const getNextRankPoints = (rank: number) => {
    const thresholds = [0, 100, 250, 500, 1000, 2500, 5000, Infinity]
    return thresholds[rank] || Infinity
  }

  const handleRedeem = (coupon: Coupon) => {
    if (currentPoints < coupon.cost) {
      toast({
        title: "Not enough points",
        description: `You need ${coupon.cost} points to redeem this coupon.`,
        variant: "destructive"
      })
      return
    }
    setCurrentPoints((prev) => prev - coupon.cost)
    // lifetimePoints unchanged
    toast({
      title: "Coupon redeemed!",
      description: "Great job! Keep going green! 🌿",
    })
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
            <p className="mt-2 text-primary-foreground/90 font-medium">Great job! Keep going green! 🌱</p>
          </div>
        </div>

        {/* Current Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-eco rounded-full flex items-center justify-center mx-auto mb-3">
                <Leaf className="h-8 w-8 text-success-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">{currentPoints.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Current Eco Points</p>
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
                        <p className="text-xs text-muted-foreground mt-1">Minimum: {badge.pointsRequired} points</p>
                      </div>

                      <div className={badgeVariants({ variant: badge.unlocked ? "default" : "secondary" })}>
                        {badge.unlocked ? "Unlocked" : "Locked"}
                      </div>
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
                {availableCoupons.map((coupon) => {
                  const canRedeem = currentPoints >= coupon.cost
                  return (
                    <div key={coupon.id} className="border rounded-lg p-4 bg-gradient-to-br from-primary/5 to-success/5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-foreground">{coupon.title}</h3>
                          <p className="text-sm text-muted-foreground">{coupon.description}</p>
                        </div>
                        <div className={badgeVariants({ variant: "secondary" })}>Cost: {coupon.cost} pts</div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">Minimum credits required: {coupon.cost} points</p>
                      <Button
                        variant={canRedeem ? "default" : "outline"}
                        size="sm"
                        className={`w-full ${canRedeem ? 'animate-pulse' : ''}`}
                        onClick={() => handleRedeem(coupon)}
                        disabled={!canRedeem}
                      >
                        {canRedeem ? 'Redeem Now' : 'Insufficient Points'}
                      </Button>
                    </div>
                  )
                })}
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