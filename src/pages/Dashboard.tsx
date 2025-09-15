import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, PlayCircle, Clock, Users, Star } from "lucide-react"
import { Link } from "react-router-dom"

const Dashboard = () => {
  // Sample course data - in a real app this would come from an API
  const course = {
    id: "climate-change-101",
    title: "Climate Change Fundamentals",
    description: "Understanding the science behind climate change, its impacts, and actionable solutions for a sustainable future.",
    duration: "4 weeks",
    lessons: 12,
    difficulty: "Beginner",
    enrolled: 1250,
    rating: 4.8,
    progress: 0, // User hasn't started yet
    thumbnail: "/placeholder.svg"
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="bg-gradient-hero rounded-2xl p-8 text-center text-primary-foreground shadow-nature">
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              Welcome to Your Learning Journey! 🌱
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Start building your environmental knowledge and earn eco points along the way.
            </p>
          </div>
        </div>

        {/* Current Course */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Your Course</h2>
          </div>
          
          <Card className="shadow-card hover:shadow-nature transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl text-foreground">{course.title}</CardTitle>
                  <CardDescription className="text-muted-foreground max-w-2xl">
                    {course.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="ml-4">
                  {course.difficulty}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm">{course.lessons} lessons</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{course.enrolled.toLocaleString()} enrolled</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="h-4 w-4 fill-current text-gold" />
                  <span className="text-sm">{course.rating}/5</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={`/course/${course.id}`} className="flex-1">
                  <Button variant="hero" size="lg" className="w-full">
                    <PlayCircle className="h-5 w-5" />
                    Start Learning
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="sm:w-auto">
                  Course Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Coming Soon */}
        <section>
          <div className="text-center bg-gradient-earth rounded-2xl p-12 shadow-card">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 bg-gradient-eco rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="h-10 w-10 text-success-foreground" />
              </div>
              
              <h3 className="text-2xl font-bold text-foreground">More Courses Coming Soon!</h3>
              <p className="text-muted-foreground">
                We're working hard to bring you more amazing environmental sustainability courses. 
                Stay tuned for updates!
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <Badge variant="outline">Renewable Energy</Badge>
                <Badge variant="outline">Sustainable Agriculture</Badge>
                <Badge variant="outline">Water Conservation</Badge>
                <Badge variant="outline">Waste Management</Badge>
                <Badge variant="outline">Biodiversity</Badge>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard