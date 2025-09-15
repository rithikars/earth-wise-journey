import { Button } from "@/components/ui/enhanced-button"
import { Leaf, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const SignIn = () => {
  return (
    <div className="min-h-screen bg-gradient-earth flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card rounded-2xl shadow-nature p-8 space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Leaf className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                AgroLearn
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-foreground">
              Welcome Back!
            </h1>
            <p className="text-muted-foreground">
              Ready to continue your environmental sustainability journey?
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-gradient-earth rounded-xl border border-border">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-eco rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-success-foreground" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  Quick Entry
                </h2>
                <p className="text-sm text-muted-foreground">
                  For now, just click the button below to enter your learning dashboard!
                </p>
              </div>
            </div>

            <Link to="/dashboard" className="block">
              <Button variant="hero" size="xl" className="w-full">
                Enter Learning Platform
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn