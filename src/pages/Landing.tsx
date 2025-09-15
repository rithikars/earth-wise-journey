import { Button } from "@/components/ui/enhanced-button"
import { Leaf, ArrowRight, Globe, Users, BookOpen } from "lucide-react"
import { Link } from "react-router-dom"
import heroImage from "@/assets/hero-environmental.jpg"

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Header */}
      <header className="relative bg-card/80 backdrop-blur-sm shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                AgroLearn
              </span>
            </div>
            
            <Link to="/signin">
              <Button variant="hero" size="lg">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Environmental
                  <span className="block bg-gradient-hero bg-clip-text text-transparent">
                    Sustainability
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Learn how to protect our planet through interactive courses, 
                  earn eco points, and join a community committed to sustainable living.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signin">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    Start Learning Today
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={heroImage}
                alt="Environmental sustainability hero"
                className="rounded-2xl shadow-nature w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-hero/10 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              Why Choose AgroLearn?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform combines cutting-edge education with gamification 
              to make learning about sustainability engaging and rewarding.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6 rounded-xl bg-gradient-earth shadow-card hover:shadow-nature transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-eco rounded-full flex items-center justify-center mx-auto">
                <Globe className="h-8 w-8 text-success-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Interactive Learning</h3>
              <p className="text-muted-foreground">
                Engage with immersive video lessons and hands-on quizzes designed 
                to deepen your understanding of environmental sustainability.
              </p>
            </div>
            
            <div className="text-center space-y-4 p-6 rounded-xl bg-gradient-earth shadow-card hover:shadow-nature transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="h-8 w-8 text-gold-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Gamified Experience</h3>
              <p className="text-muted-foreground">
                Earn eco points, unlock achievements, and compete on leaderboards 
                while making a positive impact on the environment.
              </p>
            </div>
            
            <div className="text-center space-y-4 p-6 rounded-xl bg-gradient-earth shadow-card hover:shadow-nature transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Community Driven</h3>
              <p className="text-muted-foreground">
                Join thousands of eco-warriors committed to creating a sustainable 
                future for our planet through education and action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-6 w-6" />
            <span className="text-lg font-semibold">AgroLearn</span>
          </div>
          <p className="text-primary-foreground/80">
            Empowering the next generation of environmental stewards.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Landing