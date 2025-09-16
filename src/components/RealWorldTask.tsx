import { useState, useRef } from "react"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Upload, Check, Clock, X } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "@/components/ui/use-toast"

interface RealWorldTaskProps {
  lessonId: string
  taskDescription: string
}

export const RealWorldTask = ({ lessonId, taskDescription }: RealWorldTaskProps) => {
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [taskStatus, setTaskStatus] = useState<'pending' | 'uploaded' | 'verified' | 'rejected'>('pending')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadPhoto = async () => {
    if (!photoFile) return
    if (!user) {
      toast({
        title: "Upload Failed",
        description: "You must be signed in to upload.",
        variant: "destructive"
      })
      return
    }
    if (!lessonId) {
      toast({
        title: "Upload Failed",
        description: "Missing lesson identifier.",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)
    try {
      // Upload to Supabase Storage (prefer task-photos, fallback to community-tasks)
      const path = `${user.id}/${lessonId}-${Date.now()}-${photoFile.name}`
      const buckets = ["task-photos", "community-tasks"] as const

      let usedBucket: typeof buckets[number] | null = null
      let lastErr: any = null

      for (const bucket of buckets) {
        const { error: storageErr } = await supabase.storage
          .from(bucket)
          .upload(path, photoFile, { upsert: false, contentType: photoFile.type || "image/jpeg", cacheControl: "3600" })

        if (!storageErr) {
          usedBucket = bucket
          break
        }

        lastErr = storageErr
        const message = (storageErr as any)?.message?.toLowerCase?.() || ""
        if (!message.includes("bucket") || !message.includes("not") || !message.includes("found")) {
          // Not a bucket-not-found error; stop trying fallbacks
          break
        }
      }

      if (!usedBucket) {
        throw new Error(lastErr?.message || "Upload failed. Storage bucket unavailable.")
      }

      const { data: publicUrlData } = supabase.storage.from(usedBucket).getPublicUrl(path)
      const photoUrl = publicUrlData.publicUrl

      // Upsert task record to avoid unique constraint issues on re-submit
      const { error } = await supabase
        .from('real_world_tasks')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          photo_url: photoUrl,
          verification_status: 'pending'
        }, { onConflict: 'user_id,lesson_id' })

      if (error) {
        throw new Error(error.message || "Failed to save task record.")
      }

      setTaskStatus('uploaded')
      toast({
        title: "Photo Uploaded! 📷",
        description: `Your photo was saved to ${usedBucket} and submitted for verification.`,
      })
    } catch (error: any) {
      console.error('Upload error:', error)
      toast({
        title: "Upload Failed",
        description: error?.message || "An error occurred while uploading your photo.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const verifyTask = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('real_world_tasks')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single()

      if (error || !data) {
        toast({
          title: "Verification Failed",
          description: "Task not found.",
          variant: "destructive"
        })
        return
      }

      const { error: verifyError } = await supabase.rpc('verify_task_and_award_points', {
        _task_id: data.id
      })

      if (verifyError) {
        toast({
          title: "Verification Failed",
          description: verifyError.message,
          variant: "destructive"
        })
      } else {
        setTaskStatus('verified')
        toast({
          title: "Task Verified! 🎉",
          description: "You earned 70 Eco Points for completing this real-world task!",
        })
      }
    } catch (error) {
      console.error('Verification error:', error)
    }
  }

  const getStatusBadge = () => {
    switch (taskStatus) {
      case 'pending':
        return <Badge variant="secondary">Not Started</Badge>
      case 'uploaded':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="h-3 w-3 mr-1" />Pending Verification</Badge>
      case 'verified':
        return <Badge variant="default" className="bg-green-600"><Check className="h-3 w-3 mr-1" />Verified (+70 points)</Badge>
      case 'rejected':
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="secondary">Not Started</Badge>
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
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{taskDescription}</p>
        
        {taskStatus === 'pending' && (
          <>
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
              {photoPreview ? (
                <div className="space-y-4">
                  <img src={photoPreview} alt="Task photo" className="max-w-full h-48 object-cover rounded-lg mx-auto" />
                  <p className="text-sm text-muted-foreground">Photo selected and ready to upload</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Take a photo of your completed task</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                <Camera className="h-4 w-4 mr-2" />
                {photoFile ? 'Change Photo' : 'Take Photo'}
              </Button>
              
              {photoFile && (
                <Button
                  variant="hero"
                  onClick={uploadPhoto}
                  disabled={isUploading}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Submit'}
                </Button>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </>
        )}
        
        {taskStatus === 'uploaded' && photoPreview && (
          <div className="space-y-4">
            <img src={photoPreview} alt="Submitted task photo" className="max-w-full h-48 object-cover rounded-lg" />
            <Button onClick={verifyTask} variant="hero" className="w-full">
              <Check className="h-4 w-4 mr-2" />
              Verify Task Completion
            </Button>
          </div>
        )}
        
        {taskStatus === 'verified' && photoPreview && (
          <div className="space-y-4">
            <img src={photoPreview} alt="Verified task photo" className="max-w-full h-48 object-cover rounded-lg" />
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-800 font-semibold">Task completed and verified!</p>
              <p className="text-green-600 text-sm">You earned 70 Eco Points</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}