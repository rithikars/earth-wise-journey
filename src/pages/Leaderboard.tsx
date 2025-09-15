import { Navbar } from "@/components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Star, Crown } from "lucide-react"

const Leaderboard = () => {
  // Sample leaderboard data - in a real app this would come from an API
  const leaderboardData = [
    {
      id: "user-1",
      name: "You",
      ecoPoints: 250,
      level: "Seedling",
      badges: ["First Steps", "Quiz Master"],
      completedCourses: 0,
      rank: 1,
      isCurrentUser: true
    }
    // More users would be added here in a real application
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-gold" />
      case 2:
        return <Trophy className="h-6 w-6 text-muted-foreground" />
      case 3:
        return <Medal className="h-6 w-6 text-muted-foreground" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankBackground = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return "bg-gradient-hero"
    if (rank === 1) return "bg-gradient-gold"
    if (rank === 2) return "bg-gradient-earth"
    return "bg-card"
  }

  const getRankTextColor = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return "text-primary-foreground"
    if (rank === 1) return "text-gold-foreground"
    return "text-foreground"
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="text-center bg-gradient-hero rounded-2xl p-8 text-primary-foreground shadow-nature">
            <Trophy className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              Eco Champions Leaderboard 🌍
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              See how you rank among fellow environmental stewards on your sustainability journey!
            </p>
          </div>
        </div>

        {/* Your Stats */}
        <Card className="mb-8 shadow-nature">
          <CardHeader>
            <CardTitle className="text-center">Your Environmental Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center mx-auto">
                  <Star className="h-6 w-6 text-gold-foreground" />
                </div>
                <p className="text-2xl font-bold text-foreground">250</p>
                <p className="text-sm text-muted-foreground">Eco Points</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 bg-gradient-eco rounded-full flex items-center justify-center mx-auto">
                  <Crown className="h-6 w-6 text-success-foreground" />
                </div>
                <p className="text-2xl font-bold text-foreground">#1</p>
                <p className="text-sm text-muted-foreground">Global Rank</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto">
                  <Award className="h-6 w-6 text-primary-foreground" />
                </div>
                <p className="text-2xl font-bold text-foreground">2</p>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <Medal className="h-6 w-6 text-primary-foreground" />
                </div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Courses Done</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Global Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboardData.map((user) => (
                <div
                  key={user.id}
                  className={`${getRankBackground(user.rank, user.isCurrentUser)} rounded-xl p-6 shadow-card transition-all duration-300 hover:shadow-nature`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12">
                        {getRankIcon(user.rank)}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-bold text-lg ${getRankTextColor(user.rank, user.isCurrentUser)}`}>
                            #{user.rank} {user.name}
                          </h3>
                          {user.isCurrentUser && (
                            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
                              You
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm ${getRankTextColor(user.rank, user.isCurrentUser)} opacity-80`}>
                          Level: {user.level}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getRankTextColor(user.rank, user.isCurrentUser)}`}>
                        {user.ecoPoints.toLocaleString()}
                      </p>
                      <p className={`text-sm ${getRankTextColor(user.rank, user.isCurrentUser)} opacity-80`}>
                        eco points
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {user.badges.map((badge, index) => (
                      <Badge 
                        key={index} 
                        variant={user.isCurrentUser ? "secondary" : "outline"}
                        className={user.isCurrentUser ? "bg-primary-foreground/20 text-primary-foreground border-0" : ""}
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Coming Soon Message */}
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">More Eco Warriors Coming Soon!</h3>
                <p className="text-sm">
                  Invite your friends to join AgroLearn and see who can make the biggest environmental impact!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Levels */}
        <Card className="mt-8 shadow-card">
          <CardHeader>
            <CardTitle>Achievement Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-eco">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success-foreground rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-success">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-success-foreground">Seedling</p>
                    <p className="text-sm text-success-foreground/80">0 - 500 points</p>
                  </div>
                </div>
                <Badge className="bg-success-foreground/20 text-success-foreground border-0">
                  Current Level
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-background">2</span>
                  </div>
                  <div>
                    <p className="font-semibold">Sprout</p>
                    <p className="text-sm text-muted-foreground">500 - 1,500 points</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-background">3</span>
                  </div>
                  <div>
                    <p className="font-semibold">Tree Guardian</p>
                    <p className="text-sm text-muted-foreground">1,500 - 5,000 points</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-background">4</span>
                  </div>
                  <div>
                    <p className="font-semibold">Eco Champion</p>
                    <p className="text-sm text-muted-foreground">5,000+ points</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default Leaderboard