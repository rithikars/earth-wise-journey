import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Star, Gift, Award, Leaf, TreePine } from "lucide-react"

const Badges = () => {
  // Sample badge items - in a real app this would come from an API
  const earnedBadges = [
    {
      id: "badge-1",
      name: "First Steps",
      description: "Completed your first lesson",
      earned: true,
      icon: <Award className="h-8 w-8 text-success" />,
      earnedDate: "2024-01-15"
    },
    {
      id: "badge-2", 
      name: "Quiz Master",
      description: "Scored 100% on a quiz",
      earned: true,
      icon: <Star className="h-8 w-8 text-gold" />,
      earnedDate: "2024-01-16"
    }
  ]

  const availableBadges = [
    {
      id: "badge-3",
      name: "Climate Champion",
      description: "Complete 5 lessons on climate change",
      earned: false,
      icon: <Leaf className="h-8 w-8 text-primary" />,
      requirement: "Complete 5 lessons"
    },
    {
      id: "badge-4",
      name: "Earth Protector",
      description: "Complete 3 real-world tasks",
      earned: false,
      icon: <TreePine className="h-8 w-8 text-success" />,
      requirement: "3 real-world tasks"
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "badge":
        return "bg-gradient-gold text-gold-foreground"
      case "impact":
        return "bg-gradient-eco text-success-foreground"
      case "title":
        return "bg-gradient-hero text-primary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "badge":
        return "Badge"
      case "impact":
        return "Real Impact"
      case "title":
        return "Profile Title"
      default:
        return "Item"
    }
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
              Earned Badges 🏅
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Showcase your environmental achievements and unlock new badges as you learn!
            </p>
          </div>
        </div>

        {/* Current Balance */}
        <Card className="mb-8 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  Your Badges Collection
                </h2>
                <p className="text-sm text-muted-foreground">
                  Earn badges by completing lessons, quizzes, and real-world tasks!
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-gold fill-current" />
                  <span className="text-3xl font-bold text-foreground">2</span>
                </div>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Earned Badges */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle>Your Earned Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {earnedBadges.map((badge) => (
                <Card key={badge.id} className="bg-gradient-gold shadow-card">
                  <CardContent className="p-4 text-center">
                    <div className="w-16 h-16 bg-gold-foreground/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      {badge.icon}
                    </div>
                    <h3 className="font-bold text-gold-foreground mb-2">{badge.name}</h3>
                    <p className="text-sm text-gold-foreground/80 mb-2">{badge.description}</p>
                    <p className="text-xs text-gold-foreground/60">Earned: {badge.earnedDate}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Badges */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Badges to Earn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableBadges.map((badge) => (
                <Card key={badge.id} className="shadow-card opacity-60 hover:opacity-80 transition-opacity">
                  <CardContent className="p-4 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                      {badge.icon}
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{badge.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {badge.requirement}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Earn More Badges CTA */}
        <Card className="mt-12 bg-gradient-earth shadow-card">
          <CardContent className="p-8 text-center">
            <Award className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Unlock More Badges!
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Complete more lessons, ace your quizzes, and finish real-world tasks to unlock 
              amazing environmental achievement badges!
            </p>
            <Button variant="hero" size="lg">
              Continue Learning
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default Badges