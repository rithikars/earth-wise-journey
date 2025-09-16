import { useState, useEffect } from "react"
import { Button } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"


const SignIn = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [grade, setGrade] = useState("")
  const [region, setRegion] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { signIn, signUp, user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      navigate("/dashboard")
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          toast({
            title: "Display name required",
            description: "Please enter your display name",
            variant: "destructive"
          })
          return
        }
        if (!grade) {
          toast({
            title: "Grade required",
            description: "Please select your grade",
            variant: "destructive"
          })
          return
        }
        if (!region) {
          toast({
            title: "Region required",
            description: "Please select your region",
            variant: "destructive"
          })
          return
        }
        
        const { error } = await signUp(email, password, displayName, grade, region)
        if (error) {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive"
          })
        } else {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account.",
            variant: "default"
          })
          setIsSignUp(false)
        }
      } else {
        const { error } = await signIn(email, password)
        if (error) {
          toast({
            title: "Sign in failed", 
            description: error.message,
            variant: "destructive"
          })
        } else {
          toast({
            title: "Welcome back!",
            description: "You've successfully signed in.",
            variant: "default"
          })
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

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
              {isSignUp ? "Join AgroLearn" : "Welcome Back!"}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp 
                ? "Start your environmental sustainability journey today"
                : "Ready to continue your environmental sustainability journey?"
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-sm font-medium text-foreground">
                  Display Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Enter your display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="pl-10"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            {isSignUp && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Grade</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elementary_1_4">Elementary (1–4)</SelectItem>
                    <SelectItem value="middle_5_8">Middle School (5–8)</SelectItem>
                    <SelectItem value="high_9_12">High School (9–12)</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {isSignUp && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Region</Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="north_india">North India</SelectItem>
                    <SelectItem value="south_india">South India</SelectItem>
                    <SelectItem value="east_india">East India</SelectItem>
                    <SelectItem value="west_india">West India</SelectItem>
                    <SelectItem value="central_india">Central India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              variant="hero" 
              size="xl" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                "Loading..."
              ) : isSignUp ? (
                <>
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isSignUp 
                  ? "Already have an account? Sign in" 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </form>

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