import { useState, useMemo } from "react"
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
import { useAuth } from "@/contexts/AuthContext"

const Quiz = () => {
  const { lessonId } = useParams()
  const { user } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [isRetake, setIsRetake] = useState(false)
  const { awardQuizPoints, retakeQuizPoints } = useEcoPoints()

  // Build quiz sets based on user grade
  const userGrade = (user?.user_metadata?.grade || "") as string
  const difficulty: "easy" | "moderate" | "hard" = useMemo(() => {
    if (userGrade === "elementary_1_4") return "easy"
    if (userGrade === "middle_5_8") return "moderate"
    if (userGrade === "high_9_12" || userGrade === "college") return "hard"
    return "moderate"
  }, [userGrade])

  const quizData = useMemo(() => {
    const base = {
      title: "Climate Science Quiz",
      lessonTitle: "Introduction to Climate Science",
    }
    if (difficulty === "easy") {
      return {
        ...base,
        questions: [
          {
            id: "q1",
            question: "What is climate?",
            options: [
              "The weather today",
              "The usual weather of a place over a long time",
              "The temperature at night",
              "The type of soil"
            ],
            correctAnswer: 1,
            explanation: "Climate is the usual weather of a place over a long time."
          },
          {
            id: "q2",
            question: "Which of the following affects climate?",
            options: ["Mountains", "Ice cream", "A bicycle", "A pencil"],
            correctAnswer: 0,
            explanation: "Mountains can affect climate by influencing wind and rainfall patterns."
          },
          {
            id: "q3",
            question: "Why should we care about the climate?",
            options: [
              "It helps us watch TV",
              "It affects plants, animals, and people",
              "It makes food taste better",
              "It tells us the time"
            ],
            correctAnswer: 1,
            explanation: "Climate affects living things and our daily lives."
          },
          {
            id: "q4",
            question: "What is global warming?",
            options: [
              "The Earth getting colder",
              "The Earth getting hotter over time",
              "Ice melting in your fridge",
              "Rain every day"
            ],
            correctAnswer: 1,
            explanation: "Global warming is the Earth's average temperature rising over time."
          },
          {
            id: "q5",
            question: "Which helps the environment?",
            options: [
              "Throwing plastic in the river",
              "Planting trees",
              "Wasting water",
              "Leaving lights on all day"
            ],
            correctAnswer: 1,
            explanation: "Planting trees helps the environment."
          }
        ]
      }
    }
    if (difficulty === "moderate") {
      return {
        ...base,
        questions: [
          {
            id: "q1",
            question: "What is the difference between weather and climate?",
            options: [
              "Weather is long-term, climate is short-term",
              "Weather is about animals, climate is about plants",
              "Weather is short-term, climate is long-term",
              "Weather is always sunny, climate is always rainy"
            ],
            correctAnswer: 2,
            explanation: "Weather is short-term; climate is long-term patterns."
          },
          {
            id: "q2",
            question: "What mainly causes global warming?",
            options: ["Greenhouse gases like CO₂", "Water vapor", "Soil erosion", "Volcano eruptions"],
            correctAnswer: 0,
            explanation: "Greenhouse gases like CO₂ trap heat."
          },
          {
            id: "q3",
            question: "How does climate change affect animals?",
            options: ["Animals get stronger", "Animals have fewer homes", "Animals always sleep", "Animals don’t need food anymore"],
            correctAnswer: 1,
            explanation: "Habitat loss reduces places for animals to live."
          },
          {
            id: "q4",
            question: "What are greenhouse gases?",
            options: [
              "Gases in glasshouses",
              "Gases that trap heat in the atmosphere",
              "Gases that cool the Earth",
              "Gases in balloons"
            ],
            correctAnswer: 1,
            explanation: "They trap heat in the atmosphere."
          },
          {
            id: "q5",
            question: "Humans contribute to climate change by:",
            options: ["Using bicycles", "Planting more trees", "Driving cars that emit CO₂", "Drinking water"],
            correctAnswer: 2,
            explanation: "Car emissions add CO₂ to the atmosphere."
          }
        ]
      }
    }
    // hard
    return {
      ...base,
      questions: [
        {
          id: "q1",
          question: "The greenhouse effect is:",
          options: [
            "Heat trapped by greenhouse gases in the atmosphere",
            "Cooling of the Earth",
            "Heat from underground lava",
            "Wind blowing from the ocean"
          ],
          correctAnswer: 0,
          explanation: "Greenhouse gases trap heat and warm the Earth."
        },
        {
          id: "q2",
          question: "Climate change differs from global warming because:",
          options: [
            "Global warming is short-term; climate change is long-term",
            "Global warming refers to Earth’s rising temperature; climate change refers to long-term weather patterns",
            "They are the same thing",
            "Climate change happens only in winter"
          ],
          correctAnswer: 1,
          explanation: "Global warming is one part of climate change."
        },
        {
          id: "q3",
          question: "Deforestation contributes to climate change by:",
          options: [
            "Increasing CO₂ in the atmosphere",
            "Absorbing more CO₂",
            "Making more oxygen",
            "Creating clouds"
          ],
          correctAnswer: 0,
          explanation: "Removing trees reduces CO₂ uptake and can increase CO₂."
        },
        {
          id: "q4",
          question: "Climate models are used to:",
          options: [
            "Predict future climate changes",
            "Make toys",
            "Measure air pressure today",
            "Design buildings"
          ],
          correctAnswer: 0,
          explanation: "Models project future climate under scenarios."
        },
        {
          id: "q5",
          question: "One major impact of climate change on humans is:",
          options: [
            "More floods and heatwaves",
            "Less sunshine",
            "Increased earthquakes",
            "Faster animal growth"
          ],
          correctAnswer: 0,
          explanation: "Extreme events like floods and heatwaves increase."
        }
      ]
    }
  }, [difficulty])

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