import { useState } from "react"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Upload, CheckCircle2, Camera, Award } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useEcoPoints } from "@/contexts/EcoPointsContext"
import { toast } from "@/components/ui/use-toast"

interface RealWorldTaskProps {
  lessonId: string
  taskDescription: string
}

export const RealWorldTask = ({ lessonId, taskDescription }: RealWorldTaskProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [taskStatus, setTaskStatus] = useState<'pending' | 'uploaded' | 'verified'>('pending')
  const [taskId, setTaskId] = useState<string | null>(null)
  
  const { user } = useAuth()
  const { awardTaskPoints } = useEcoPoints()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !user) return

    setUploading(true)
    try {
      // Create unique filename
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${user.id}/${lessonId}/${Date.now()}.${fileExt}`
      
      // For now, we'll just save the task without file upload
      // In a real app, you'd upload to Supabase Storage first
      const { data, error } = await supabase
        .from('real_world_tasks')
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          photo_url: fileName, // In real app, this would be the storage URL
          verification_status: 'pending'
        })
        .select('id')
        .single()

      if (error) throw error

      setTaskId(data.id)
      setTaskStatus('uploaded')
      toast({
        title: "Photo Uploaded! 📸",
        description: "Your real-world task photo has been submitted for verification.",
      })
    } catch (error) {
      console.error('Error uploading task:', error)
      toast({
        title: "Upload Failed",
        description: "Failed to upload your photo. Please try again.",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleVerify = async () => {
    if (!taskId || !user) return

    setVerifying(true)
    try {
      const { data, error } = await supabase.rpc('verify_task_and_award_points', {
        _task_id: taskId
      })

      if (error) throw error

      setTaskStatus('verified')
      toast({
        title: "Task Verified! 🎉",
        description: "Congratulations! You earned 70 Eco Points for completing this real-world task!",
      })
    } catch (error) {
      console.error('Error verifying task:', error)
      toast({
        title: "Verification Failed",
        description: "Failed to verify your task. Please try again.",
        variant: "destructive"
      })
    } finally {
      setVerifying(false)
    }
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Real-World Task
          </CardTitle>
          <Badge 
            variant={taskStatus === 'verified' ? 'default' : 'outline'}
            className={taskStatus === 'verified' ? 'bg-gradient-eco text-success-foreground' : ''}
          >
            {taskStatus === 'verified' ? '+70 Eco Points' : '+70 Points Available'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-gradient-earth rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-2">Your Task:</h4>
          <p className="text-muted-foreground">{taskDescription}</p>
        </div>

        {taskStatus === 'pending' && (
          <div className="space-y-4">
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="cursor-pointer"
              />
            </div>
            
            {imagePreview && (
              <div>
                <img 
                  src={imagePreview} 
                  alt="Task preview" 
                  className="w-full max-w-md mx-auto rounded-lg shadow-card"
                />
              </div>
            )}
            
            {selectedFile && (
              <Button 
                onClick={handleUpload} 
                disabled={uploading}
                variant="hero"
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Upload Photo"}
              </Button>
            )}
          </div>
        )}

        {taskStatus === 'uploaded' && (
          <div className="space-y-4">
            {imagePreview && (
              <div>
                <img 
                  src={imagePreview} 
                  alt="Uploaded task" 
                  className="w-full max-w-md mx-auto rounded-lg shadow-card"
                />
              </div>
            )}
            
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Great job! Now verify your task completion to earn your Eco Points.
              </p>
              
              <Button 
                onClick={handleVerify} 
                disabled={verifying}
                variant="hero"
                size="lg"
                className="w-full"
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                {verifying ? "Verifying..." : "Verify Task Completion"}
              </Button>
            </div>
          </div>
        )}

        {taskStatus === 'verified' && (
          <div className="text-center space-y-4">
            {imagePreview && (
              <div>
                <img 
                  src={imagePreview} 
                  alt="Verified task" 
                  className="w-full max-w-md mx-auto rounded-lg shadow-card"
                />
              </div>
            )}
            
            <div className="bg-gradient-eco rounded-lg p-6">
              <Award className="h-12 w-12 mx-auto mb-4 text-success-foreground" />
              <h3 className="text-xl font-bold text-success-foreground mb-2">
                Task Complete! 🎉
              </h3>
              <p className="text-success-foreground/90">
                You've successfully completed this real-world environmental task and earned 70 Eco Points!
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}