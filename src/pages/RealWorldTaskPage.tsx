import { useParams, Link } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RealWorldTask } from "@/components/RealWorldTask"
import { ArrowLeft, ListChecks } from "lucide-react"

const RealWorldTaskPage = () => {
  const { lessonId } = useParams()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to={lessonId ? `/quiz/${lessonId}` : "/dashboard"}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quiz
            </Button>
          </Link>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <ListChecks className="h-6 w-6 text-primary" />
              Real-World Task
            </h1>
            <p className="text-muted-foreground">
              Put your learning into action. Complete the task below and submit a photo for verification to earn Eco Points.
            </p>
          </div>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Submit Your Task</CardTitle>
          </CardHeader>
          <CardContent>
            <RealWorldTask 
              lessonId={lessonId || ""}
              taskDescription="Take a photo showing how you've applied today's lesson in your daily life. For example: using reusable containers, reducing energy consumption, or implementing a sustainable practice you learned about."
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default RealWorldTaskPage


