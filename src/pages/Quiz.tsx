import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Brain, CheckCircle2, X, Trophy } from "lucide-react"
import { useEcoPoints } from "@/contexts/EcoPointsContext"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

const Quiz = () => {
  const { lessonId } = useParams()
  const { user } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const { awardQuizPoints } = useEcoPoints()

  // Sample quiz data - in a real app this would come from an API
  const quizData = {
    title: "Climate Science Quiz",
    lessonTitle: "Introduction to Climate Science",
    questions: [
      {
        id: "q1",
        question: "What is the primary cause of the greenhouse effect?",
        options: [
          "Solar radiation heating Earth's surface",
          "Atmospheric gases trapping heat",
          "Ocean currents distributing heat",
          "Mountain ranges blocking wind"
        ],
        correctAnswer: 1,
        explanation: "The greenhouse effect is primarily caused by atmospheric gases that trap heat radiated from Earth's surface."
      },
      {
        id: "q2", 
        question: "Which gas contributes most to human-caused climate change?",
        options: [
          "Water vapor",
          "Carbon dioxide",
          "Methane",
          "Ozone"
        ],
        correctAnswer: 1,
        explanation: "Carbon dioxide (CO2) is the most significant greenhouse gas from human activities, primarily from burning fossil fuels."
      },
      {
        id: "q3",
        question: "What percentage of climate scientists agree that human activities are the primary cause of recent climate change?",
        options: [
          "Around 50%",
          "Around 75%",
          "Around 90%",
          "Over 97%"
        ],
        correctAnswer: 3,
        explanation: "Over 97% of actively publishing climate scientists agree that human activities are the primary driver of recent climate change."
      },
      {
        id: "q4",
        question: "Which of the following is NOT a direct effect of climate change?",
        options: [
          "Rising sea levels",
          "Increased extreme weather events", 
          "Ocean acidification",
          "Ozone layer depletion"
        ],
        correctAnswer: 3,
        explanation: "Ozone layer depletion is primarily caused by CFCs and other chemicals, not directly by climate change."
      },
      {
        id: "q5",
        question: "What is the most effective individual action to reduce your carbon footprint?",
        options: [
          "Recycling more",
          "Using LED light bulbs",
          "Reducing energy consumption and using renewable energy",
          "Buying organic food"
        ],
        correctAnswer: 2,
        explanation: "Reducing overall energy consumption and switching to renewable energy sources has the greatest impact on reducing individual carbon footprints."
      }
    ]
  }

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value)
  }

  const handleNextQuestion = async () => {
    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)
    setSelectedAnswer("")
    
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
      
      // Award quiz points when quiz is completed
      if (lessonId) {
        const score = calculateScore(newAnswers)
        await awardQuizPoints(lessonId, score, quizData.questions.length)
        
        // Persist quiz completion to Supabase (lesson_progress)
        if (user) {
          try {
            await supabase.from('lesson_progress').upsert({
              user_id: user.id,
              lesson_id: lessonId,
              quiz_score: score,
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id,lesson_id' })
          } catch (e) {
            // no-op: persistence failure should not block UX
          }
        }
        
        const scoreInfo = getScoreMessage(score)
        toast({
          title: "Quiz Complete! 🎉",
          description: `You earned ${scoreInfo.points} Eco Points!`,
        })
      }
    }
  }

  const calculateScore = (answersArray = answers) => {
    let correct = 0
    answersArray.forEach((answer, index) => {
      if (parseInt(answer) === quizData.questions[index].correctAnswer) {
        correct++
      }
    })
    return correct
  }


  const getScoreMessage = (score: number) => {
    const percentage = (score / quizData.questions.length) * 100
    if (percentage >= 90) return { message: "Excellent! You're a climate science expert!", color: "text-success", points: 50 }
    if (percentage >= 70) return { message: "Great job! You have a solid understanding.", color: "text-success", points: 40 }
    if (percentage >= 50) return { message: "Good effort! Keep learning to improve.", color: "text-gold", points: 25 }
    return { message: "Keep studying! Practice makes perfect.", color: "text-destructive", points: 10 }
  }

  if (showResults) {
    const score = calculateScore()
    const scoreInfo = getScoreMessage(score)
    
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="shadow-nature">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-10 w-10 text-gold-foreground" />
              </div>
              <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            </CardHeader>
            
            <CardContent className="text-center space-y-6">
              <div className="space-y-2">
                <p className="text-3xl font-bold text-foreground">
                  {score} / {quizData.questions.length}
                </p>
                <p className={`text-lg font-medium ${scoreInfo.color}`}>
                  {scoreInfo.message}
                </p>
              </div>
              
              <div className="bg-gradient-gold rounded-lg p-4">
                <p className="text-gold-foreground font-semibold">
                  You earned {scoreInfo.points} Eco Points! 🌱
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {quizData.questions.map((question, index) => (
                  <div key={question.id} className="text-left p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {parseInt(answers[index]) === question.correctAnswer ? (
                        <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-destructive flex-shrink-0" />
                      )}
                      <span className="font-medium text-sm">Question {index + 1}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {question.question}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {question.explanation}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={`/lesson/${lessonId}`} className="flex-1">
                  <Button variant="outline" size="lg" className="w-full">
                    Back to Lesson
                  </Button>
                </Link>
                <Link to="/course/climate-change-101" className="flex-1">
                  <Button variant="hero" size="lg" className="w-full">
                    Continue Course
                  </Button>
                </Link>
                <Link to={`/task/${lessonId}`} className="flex-1">
                  <Button variant="hero" size="lg" className="w-full">
                    Do Real-World Task
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const question = quizData.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to={`/lesson/${lessonId}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lesson
            </Button>
          </Link>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {quizData.title}
              </h1>
              <p className="text-muted-foreground">
                {quizData.lessonTitle}
              </p>
            </div>
            <Badge variant="outline">
              Question {currentQuestion + 1} of {quizData.questions.length}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-6">
            <div 
              className="bg-gradient-eco h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              {question.question}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 rounded-lg hover:bg-muted transition-colors">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="flex-1 cursor-pointer text-foreground"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            <div className="flex justify-end">
              <Button 
                variant="hero" 
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                size="lg"
              >
                {currentQuestion === quizData.questions.length - 1 ? "Finish Quiz" : "Next Question"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default Quiz