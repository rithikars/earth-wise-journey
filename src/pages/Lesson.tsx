import { useParams, Link } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VideoPlayer } from "@/components/VideoPlayer"
import { ArrowLeft, Brain } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

const Lesson = () => {
  const { lessonId } = useParams()
  const { user } = useAuth()
  const [isQuizCompleted, setIsQuizCompleted] = useState(false)
  
  // Sample lesson data - in a real app this would come from an API
  const lesson = {
    id: lessonId,
    title: "Introduction to Climate Science",
    description: "Understanding the greenhouse effect and basic climate principles that drive our planet's climate system.",
    videoId: "dQw4w9WgXcQ", // Sample YouTube video ID
    duration: "15 min",
    points: 50,
    completed: false
  }

  const videoUrl = `https://www.youtube.com/embed/${lesson.videoId}`

  useEffect(() => {
    const loadQuizCompletion = async () => {
      if (!user || !lessonId) return
      const { data } = await supabase
        .from('lesson_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .maybeSingle()
      setIsQuizCompleted(!!data)
    }
    loadQuizCompletion()
  }, [user, lessonId])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/course/climate-change-101">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </Link>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {lesson.title}
              </h1>
              <p className="text-muted-foreground text-lg">
                {lesson.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="ml-4">
                +{lesson.points} eco points
              </Badge>
              {isQuizCompleted && (
                <Badge variant="default">Quiz Completed</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="mb-8">
          <VideoPlayer 
            src={videoUrl} 
            lessonId={lessonId || ""} 
            title={lesson.title}
          />
        </div>

        {/* Real-World Task moved to dedicated page */}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link to={`/quiz/${lesson.id}`} className="flex-1">
            <Button variant="hero" size="lg" className="w-full">
              <Brain className="h-5 w-5 mr-2" />
              Take Quiz to Test Your Knowledge
            </Button>
          </Link>
        </div>

        {/* Learning Objectives */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Learning Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Understand the basic principles of the greenhouse effect
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Identify key greenhouse gases and their sources
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Explain how climate systems regulate Earth's temperature
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Recognize the connection between human activities and climate change
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default Lesson