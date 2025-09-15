import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  PlayCircle, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  BookOpen, 
  Brain,
  ArrowLeft 
} from "lucide-react"

const Course = () => {
  const { courseId } = useParams()
  
  // Sample lesson data - in a real app this would come from an API
  const lessons = [
    {
      id: "lesson-1",
      title: "Introduction to Climate Science",
      description: "Understanding the greenhouse effect and basic climate principles",
      duration: "15 min",
      videoCompleted: false,
      quizCompleted: false,
      videoId: "dQw4w9WgXcQ" // Sample YouTube video ID
    },
    {
      id: "lesson-2", 
      title: "Global Warming vs Climate Change",
      description: "Distinguishing between global warming and broader climate change",
      duration: "12 min",
      videoCompleted: true,
      quizCompleted: false,
      videoId: "dQw4w9WgXcQ"
    },
    {
      id: "lesson-3",
      title: "Human Impact on Climate",
      description: "How human activities contribute to climate change",
      duration: "18 min", 
      videoCompleted: true,
      quizCompleted: true,
      videoId: "dQw4w9WgXcQ"
    },
    {
      id: "lesson-4",
      title: "Climate Change Indicators",
      description: "Observable signs of climate change around the world",
      duration: "20 min",
      videoCompleted: false,
      quizCompleted: false,
      videoId: "dQw4w9WgXcQ"
    },
    {
      id: "lesson-5",
      title: "Solutions and Mitigation",
      description: "Strategies for reducing and adapting to climate change",
      duration: "16 min",
      videoCompleted: false,
      quizCompleted: false,
      videoId: "dQw4w9WgXcQ"
    }
  ]

  const courseTitle = "Climate Change Fundamentals"
  const completedLessons = lessons.filter(l => l.videoCompleted && l.quizCompleted).length
  const totalLessons = lessons.length
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="bg-gradient-hero rounded-2xl p-8 text-primary-foreground shadow-nature">
            <h1 className="text-3xl font-bold mb-2">{courseTitle}</h1>
            <p className="text-primary-foreground/90 mb-6">
              Master the fundamentals of climate science and learn about sustainable solutions.
            </p>
            
            <div className="flex items-center gap-6">
              <div className="text-sm">
                <span className="font-semibold">{completedLessons}</span> of{" "}
                <span className="font-semibold">{totalLessons}</span> lessons completed
              </div>
              <div className="flex-1 max-w-xs">
                <div className="bg-primary-foreground/20 rounded-full h-2">
                  <div 
                    className="bg-primary-foreground rounded-full h-2 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
              <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
                {progressPercentage}% Complete
              </Badge>
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <Card key={lesson.id} className="shadow-card hover:shadow-nature transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                        {index + 1}
                      </span>
                      <Link 
                        to={`/lesson/${lesson.id}`}
                        className="text-xl font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {lesson.title}
                      </Link>
                    </div>
                    <CardDescription className="ml-11 text-muted-foreground">
                      {lesson.description}
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-3 ml-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{lesson.duration}</span>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <span className="hidden sm:inline mr-2">Choose Action</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link to={`/lesson/${lesson.id}`} className="w-full">
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Watch Video Lesson
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/quiz/${lesson.id}`} className="w-full">
                            <Brain className="h-4 w-4 mr-2" />
                            Take Quiz
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between ml-11">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        lesson.videoCompleted ? 'bg-success' : 'bg-muted'
                      }`} />
                      <span className="text-sm text-muted-foreground">Video</span>
                      {lesson.videoCompleted && (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        lesson.quizCompleted ? 'bg-success' : 'bg-muted'
                      }`} />
                      <span className="text-sm text-muted-foreground">Quiz</span>
                      {lesson.quizCompleted && (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      )}
                    </div>
                  </div>
                  
                  <Link to={`/lesson/${lesson.id}`}>
                    <Button variant="ghost" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Start Lesson
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Course Completion */}
        {completedLessons === totalLessons && (
          <Card className="mt-8 bg-gradient-eco shadow-glow">
            <CardContent className="p-8 text-center text-success-foreground">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Course Completed! 🎉</h3>
              <p className="mb-4">
                Congratulations! You've mastered Climate Change Fundamentals and earned 500 eco points!
              </p>
              <Button variant="hero" size="lg">
                View Certificate
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

export default Course