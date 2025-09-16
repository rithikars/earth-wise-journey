import { useParams, Link } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

const TASKS: Record<string, { problem: string; title: string; instructions: string }> = {
  deforestation_plant_sapling: { problem: "Deforestation", title: "Plant a Sapling", instructions: "Plant a sapling in your backyard, school, or community." },
  air_pollution_clean_air_poster: { problem: "Air Pollution", title: "Make a Clean Air Poster", instructions: "Create a poster/drawing about reducing smoke and pollution." },
  water_scarcity_collect_rainwater: { problem: "Water Scarcity", title: "Collect Rainwater", instructions: "Collect rainwater in a small container or bottle at home." },
  plastic_pollution_collect_plastic: { problem: "Plastic Pollution", title: "Collect Plastic Waste", instructions: "Collect 5–10 pieces of plastic from your home or neighborhood." },
  deforestation_plant_tree: { problem: "Deforestation", title: "Plant a Small Tree", instructions: "Plant a small tree or potted plant." },
  soil_health_compost_jar: { problem: "Soil Health / Composting", title: "Make a Compost Jar", instructions: "Make a compost jar with leftover vegetable peels." },
  flooding_clean_debris: { problem: "Flooding / Water Contamination", title: "Clean Debris", instructions: "Clean debris from a pond, garden, or roadside drain." },
  industrial_pollution_river_poster: { problem: "Industrial Pollution Awareness", title: "Save Our Rivers Poster", instructions: "Draw a poster about 'Save Our Rivers' or similar campaign." },
  water_scarcity_collect_greywater: { problem: "Water Scarcity", title: "Collect Greywater", instructions: "Collect greywater in a bucket for plants." },
  urban_air_pollution_indoor_plant: { problem: "Urban Air Pollution", title: "Plant an Indoor Air-Purifying Plant", instructions: "Plant an indoor air-purifying plant (e.g., aloe vera, money plant)." }
}

const CommunityTaskDetail = () => {
  const { taskId } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const task = useMemo(() => (taskId ? TASKS[taskId] : undefined), [taskId])

  const handleUpload = async () => {
    if (!user) {
      toast({ title: "Please sign in", description: "You must be signed in to upload.", variant: "destructive" })
      return
    }
    if (!file || !taskId) {
      toast({ title: "No file selected", description: "Choose a photo to upload.", variant: "destructive" })
      return
    }
    try {
      const path = `${user.id}/${taskId}-${Date.now()}-${file.name}`
      const { error: storageErr } = await supabase.storage.from("task-photos").upload(path, file, { upsert: false })
      if (storageErr) throw storageErr

      const { data: publicUrlData } = supabase.storage.from("task-photos").getPublicUrl(path)
      const photoUrl = publicUrlData.publicUrl

      const { error: insertErr } = await supabase
        .from("real_world_tasks")
        .insert({ user_id: user.id, lesson_id: taskId, photo_url: photoUrl, verification_status: "pending" })
      if (insertErr) throw insertErr

      toast({ title: "Uploaded!", description: "Your task proof has been submitted for review." })
      setFile(null)
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message || "Please try again.", variant: "destructive" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{task ? `${task.problem}: ${task.title}` : "Task"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {task ? (
              <>
                <p className="text-muted-foreground">Problem: {task.problem}</p>
                <p className="text-foreground">Instructions: {task.instructions}</p>
                <div className="space-y-2">
                  <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  <Button variant="hero" size="lg" onClick={handleUpload} disabled={!file}>Upload Photo</Button>
                </div>
                <div>
                  <Link to="/community-tasks" className="text-sm text-muted-foreground hover:text-primary">← Back to Community Tasks</Link>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Task not found.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default CommunityTaskDetail


