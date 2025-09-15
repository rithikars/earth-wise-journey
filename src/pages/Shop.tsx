import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Star, Gift, Award, Leaf, TreePine } from "lucide-react"

const Shop = () => {
  // Sample shop items - in a real app this would come from an API
  const shopItems = [
    {
      id: "badge-1",
      name: "Earth Protector Badge",
      description: "Show your commitment to environmental protection",
      price: 100,
      type: "badge",
      icon: <Award className="h-8 w-8 text-success" />,
      available: true
    },
    {
      id: "badge-2", 
      name: "Climate Champion Badge",
      description: "Awarded to those fighting climate change",
      price: 200,
      type: "badge", 
      icon: <Star className="h-8 w-8 text-gold" />,
      available: true
    },
    {
      id: "tree-1",
      name: "Virtual Tree Planting",
      description: "Plant a real tree and track its growth",
      price: 500,
      type: "impact",
      icon: <TreePine className="h-8 w-8 text-success" />,
      available: true
    },
    {
      id: "title-1",
      name: "Sustainability Expert Title",
      description: "Unlock the 'Sustainability Expert' profile title",
      price: 300,
      type: "title",
      icon: <Leaf className="h-8 w-8 text-primary" />,
      available: true
    },
    {
      id: "badge-3",
      name: "Ocean Guardian Badge", 
      description: "Protect marine ecosystems and biodiversity",
      price: 250,
      type: "badge",
      icon: <Award className="h-8 w-8 text-accent-bright" />,
      available: false
    },
    {
      id: "donation-1",
      name: "Carbon Offset Donation",
      description: "Offset 1 ton of CO2 through verified projects",
      price: 750,
      type: "impact", 
      icon: <Gift className="h-8 w-8 text-gold" />,
      available: true
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
            <ShoppingBag className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              Eco Rewards Shop 🛒
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Spend your eco points on badges, real environmental impact, and exclusive rewards!
            </p>
          </div>
        </div>

        {/* Current Balance */}
        <Card className="mb-8 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  Your Eco Points Balance
                </h2>
                <p className="text-sm text-muted-foreground">
                  Earn more points by completing lessons and quizzes!
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 text-gold fill-current" />
                  <span className="text-3xl font-bold text-foreground">250</span>
                </div>
                <p className="text-sm text-muted-foreground">Eco Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shop Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shopItems.map((item) => (
            <Card 
              key={item.id} 
              className={`shadow-card hover:shadow-nature transition-all duration-300 ${
                !item.available ? 'opacity-60' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <Badge 
                        className={`${getTypeColor(item.type)} text-xs mt-1`}
                      >
                        {getTypeLabel(item.type)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-gold fill-current" />
                    <span className="font-semibold text-foreground">
                      {item.price} points
                    </span>
                  </div>
                  
                  {item.available ? (
                    <Button 
                      variant={250 >= item.price ? "eco" : "outline"}
                      size="sm"
                      disabled={250 < item.price}
                    >
                      {250 >= item.price ? "Purchase" : "Not Enough Points"}
                    </Button>
                  ) : (
                    <Badge variant="secondary">
                      Coming Soon
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Earn More Points CTA */}
        <Card className="mt-12 bg-gradient-earth shadow-card">
          <CardContent className="p-8 text-center">
            <Leaf className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Need More Eco Points?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Complete more lessons, ace your quizzes, and earn achievements to unlock 
              all the amazing rewards in our eco shop!
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

export default Shop