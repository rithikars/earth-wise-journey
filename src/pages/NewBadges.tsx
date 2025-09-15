import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/enhanced-button"
import { Award, Lock, Star, Trophy, Crown, Leaf, Target, CheckCircle2 } from "lucide-react"
import { useEcoPoints } from "@/contexts/EcoPointsContext"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

interface BadgeData {
  id: string
  name: string
  description: string
  pointsRequired: number
  icon: any
  unlocked: boolean
}

interface CouponData {
  id: string
  title: string
  description: string
  code: string
  rankRequired: number
  isAvailable: boolean
}

const NewBadges = () => {
  const { totalPoints } = useEcoPoints()
  const { user } = useAuth()
  const [userRank, setUserRank] = useState(1)
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([])

  // Badge definitions
  const badgeDefinitions: BadgeData[] = [
    {
      id: "first-steps",
      name: "First Steps",
      description: "Earned your first 100 Eco Points",
      pointsRequired: 100,
      icon: Leaf,
      unlocked: false
    },
    {
      id: "eco-explorer",
      name: "Eco Explorer", 
      description: "Reached 700 Eco Points",
      pointsRequired: 700,
      icon: Target,
      unlocked: false
    },
    {
      id: "green-warrior",
      name: "Green Warrior",
      description: "Achieved 1200 Eco Points", 
      pointsRequired: 1200,
      icon: Award,
      unlocked: false
    },
    {
      id: "sustainability-champion",
      name: "Sustainability Champion",
      description: "Earned 1800 Eco Points",
      pointsRequired: 1800,
      icon: Trophy,
      unlocked: false
    },
    {
      id: "eco-master",
      name: "Eco Master",
      description: "Reached 2500 Eco Points",
      pointsRequired: 2500,
      icon: Star,
      unlocked: false
    },
    {
      id: "planet-guardian",
      name: "Planet Guardian",
      description: "Achieved 5000 Eco Points",
      pointsRequired: 5000,
      icon: Crown,
      unlocked: false
    }
  ]

  // Sample coupons
  const coupons: CouponData[] = [
    {
      id: "evergreen-discount",
      title: "Evergreen University Store",
      description: "20% off sustainable products",
      code: "one-jvyo-pzn",
      rankRequired: 2,
      isAvailable: userRank >= 2
    },
    {
      id: "campus-cafe",
      title: "Campus Eco Café",
      description: "Free reusable coffee cup",
      code: "eco-cafe-free",
      rankRequired: 3,
      isAvailable: userRank >= 3
    },
    {
      id: "bike-share",
      title: "University Bike Share",
      description: "1 month free membership",
      code: "bike-month-free",
      rankRequired: 4,
      isAvailable: userRank >= 4
    }
  ]

  // Calculate rank based on points
  const calculateRank = (points: number) => {
    if (points < 100) return 1
    if (points < 250) return 2
    if (points < 500) return 3
    if (points < 1000) return 4
    if (points < 2500) return 5
    return 6
  }

  // Update badges based on points
  const updateBadges = () => {
    const updated = badgeDefinitions.map(badge => ({
      ...badge,
      unlocked: totalPoints >= badge.pointsRequired
    }))
    return updated
  }

  useEffect(() => {
    const newRank = calculateRank(totalPoints)
    setUserRank(newRank)
  }, [totalPoints])

  const badges = updateBadges()
  const unlockedCount = badges.filter(b => b.unlocked).length

  const getRankName = (rank: number) => {
    const ranks = ["", "Seedling", "Sprout", "Sapling", "Tree Guardian", "Forest Keeper", "Planet Guardian"]
    return ranks[rank] || "Unknown"
  }

  const getProgressToNextBadge = () => {
    const nextBadge = badges.find(b => !b.unlocked)
    if (!nextBadge) return null
    
    const progress = (totalPoints / nextBadge.pointsRequired) * 100
    const remaining = nextBadge.pointsRequired - totalPoints
    
    return { progress: Math.min(progress, 100), remaining, badge: nextBadge }
  }

  const nextBadgeProgress = getProgressToNextBadge()

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
              Track your environmental journey and unlock exclusive rewards!
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-gradient-eco rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-6 w-6 text-success-foreground" />
              </div>
              <p className="text-3xl font-bold text-foreground">{totalPoints.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Eco Points</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-6 w-6 text-primary-foreground" />
              </div>
              <p className="text-3xl font-bold text-foreground">Rank {userRank}</p>
              <p className="text-sm text-muted-foreground">{getRankName(userRank)}</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-primary-foreground" />
              </div>
              <p className="text-3xl font-bold text-foreground">{unlockedCount}</p>
              <p className="text-sm text-muted-foreground">Badges Earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress to Next Badge */}
        {nextBadgeProgress && (
          <Card className="mb-8 shadow-card">
            <CardHeader>
              <CardTitle>Progress to Next Badge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{nextBadgeProgress.badge.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {nextBadgeProgress.remaining} points needed
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-gradient-eco h-3 rounded-full transition-all duration-500"
                    style={{ width: `${nextBadgeProgress.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Badges Grid */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle>Your Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => {
                const IconComponent = badge.icon
                return (
                  <div
                    key={badge.id}
                    className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                      badge.unlocked
                        ? 'bg-gradient-eco border-success shadow-glow animate-pulse'
                        : 'bg-muted border-border opacity-60'
                    }`}
                  >
                    {!badge.unlocked && (
                      <div className="absolute top-4 right-4">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="text-center space-y-3">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                        badge.unlocked ? 'bg-success-foreground' : 'bg-muted-foreground/20'
                      }`}>
                        <IconComponent className={`h-8 w-8 ${
                          badge.unlocked ? 'text-success' : 'text-muted-foreground'
                        }`} />
                      </div>
                      
                      <div>
                        <h3 className={`font-bold text-lg ${
                          badge.unlocked ? 'text-success-foreground' : 'text-muted-foreground'
                        }`}>
                          {badge.name}
                        </h3>
                        <p className={`text-sm ${
                          badge.unlocked ? 'text-success-foreground/80' : 'text-muted-foreground'
                        }`}>
                          {badge.description}
                        </p>
                        <p className={`text-xs mt-2 ${
                          badge.unlocked ? 'text-success-foreground/60' : 'text-muted-foreground'
                        }`}>
                          {badge.pointsRequired} points required
                        </p>
                      </div>
                      
                      {badge.unlocked && (
                        <Badge className="bg-success-foreground/20 text-success-foreground border-0">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Unlocked
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Coupons & Rewards */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>University Coupons & Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    coupon.isAvailable
                      ? 'bg-gradient-earth border-primary shadow-card'
                      : 'bg-muted border-border opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className={`font-bold text-lg ${
                        coupon.isAvailable ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {coupon.title}
                      </h3>
                      <p className={`text-sm ${
                        coupon.isAvailable ? 'text-muted-foreground' : 'text-muted-foreground'
                      }`}>
                        {coupon.description}
                      </p>
                      {coupon.isAvailable && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Code: {coupon.code}</Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      {coupon.isAvailable ? (
                        <Badge className="bg-primary text-primary-foreground">
                          Available
                        </Badge>
                      ) : (
                        <div className="space-y-1">
                          <Lock className="h-5 w-5 text-muted-foreground mx-auto" />
                          <Badge variant="outline">
                            Rank {coupon.rankRequired} required
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {coupons.filter(c => !c.isAvailable).length > 0 && (
              <div className="mt-6 text-center text-muted-foreground">
                <p className="text-sm">
                  Keep earning Eco Points to unlock more exclusive university rewards!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default NewBadges