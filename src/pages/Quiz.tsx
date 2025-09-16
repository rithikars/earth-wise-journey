import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Brain, CheckCircle2, X, Trophy, RotateCcw } from "lucide-react"
import { useEcoPoints } from "@/contexts/EcoPointsContext"
import { toast } from "@/components/ui/use-toast"

const Quiz = () => {
  const { lessonId } = useParams()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [isRetake, setIsRetake] = useState(false)
  const { awardQuizPoints, retakeQuizPoints } = useEcoPoints()

  // Sample quiz data - in a real app this would come from an API
  const quizData = {
    title: "Climate Science Quiz",
    lessonTitle: "Introduction to Climate Science",
    questions: [
      {
        id: "q1",
        question: "What is the main difference between climate and weather?",
        options: [
          "Weather refers to long-term patterns, climate to short-term conditions",
          "Climate refers to long-term patterns, weather to short-term conditions",
          "Both are the same",
          "Weather only refers to rainfall"
        ],
        correctAnswer: 1,
        explanation: "Climate refers to long-term patterns of temperature, precipitation, and other atmospheric conditions, while weather refers to short-term conditions that can change from day to day."
      },
      {
        id: "q2", 
        question: "Which of the following best defines climate change?",
        options: [
          "A natural seasonal shift in temperature",
          "A short-term change in weather patterns",
          "Long-term changes in global or regional climate patterns",
          "A sudden storm event"
        ],
        correctAnswer: 2,
        explanation: "Climate change refers to long-term changes in global or regional climate patterns, particularly the warming trend observed since the mid-20th century."
      },
      {
        id: "q3",
        question: "Which human activity is the largest contributor to climate change?",
        options: [
          "Planting trees",
          "Burning fossil fuels",
          "Recycling waste",
          "Using solar energy"
        ],
        correctAnswer: 1,
        explanation: "Burning fossil fuels (coal, oil, and natural gas) is the largest contributor to climate change, releasing greenhouse gases like carbon dioxide into the atmosphere."
      },
      {
        id: "q4",
        question: "Global warming is a part of:",
        options: [
          "Climate change",
          "Ozone depletion",
          "Air pollution",
          "Weather forecasting"
        ],
        correctAnswer: 0,
        explanation: "Global warming is a component of climate change, specifically referring to the long-term increase in Earth's average surface temperature."
      },
      {
        id: "q5",
        question: "Which of the following gases is a major greenhouse gas?",
        options: [
          "Oxygen (O₂)",
          "Nitrogen (N₂)",
          "Carbon dioxide (CO₂)",
          "Hydrogen (H₂)"
        ],
        correctAnswer: 2,
        explanation: "Carbon dioxide (CO₂) is a major greenhouse gas that traps heat in Earth's atmosphere, contributing significantly to the greenhouse effect and climate change."
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
        
        if (isRetake) {
          await retakeQuizPoints(lessonId, score, quizData.questions.length)
        } else {
          await awardQuizPoints(lessonId, score, quizData.questions.length)
        }
        
        const scoreInfo = getScoreMessage(score)
        toast({
          title: isRetake ? "Quiz Retaken! 🔄" : "Quiz Complete! 🎉",
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

  const handleRetakeQuiz = () => {
    // Reset quiz state
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer("")
    setShowResults(false)
    setIsRetake(true)
    
    // Show a toast to indicate the quiz is being reset
    toast({
      title: "Quiz Reset! 🔄",
      description: "Starting fresh - good luck!",
    })
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
              <CardTitle className="text-2xl">
                {isRetake ? "Quiz Retaken!" : "Quiz Complete!"}
              </CardTitle>
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
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={handleRetakeQuiz}
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake Quiz
                </Button>
                <Link to={`/lesson/${lessonId}`} className="flex-1">
                  <Button variant="outline" size="lg" className="w-full">
                    Back to Lesson
                  </Button>
                </Link>
                <Link to={`/community-tasks`} className="flex-1">
                  <Button variant="hero" size="lg" className="w-full">
                    Explore Community Tasks
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
                {isRetake && (
                  <Badge variant="secondary" className="ml-2">
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Retake
                  </Badge>
                )}
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