import { Navbar } from "@/components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useMemo, useState } from "react"

type RegionKey = "north_india" | "south_india" | "east_india" | "west_india" | "central_india"

interface CommunityTaskDef {
  id: string
  title: string
  problem: string
  instructions: string
}

const REGION_TASKS: Record<RegionKey, CommunityTaskDef[]> = {
  north_india: [
    {
      id: "deforestation_plant_sapling",
      title: "Plant a Sapling",
      problem: "Deforestation",
      instructions: "Plant a sapling in your backyard, school, or community."
    },
    {
      id: "air_pollution_clean_air_poster",
      title: "Make a Clean Air Poster",
      problem: "Air Pollution",
      instructions: "Create a poster/drawing about reducing smoke and pollution."
    }
  ],
  south_india: [
    {
      id: "water_scarcity_collect_rainwater",
      title: "Collect Rainwater",
      problem: "Water Scarcity",
      instructions: "Collect rainwater in a small container or bottle at home."
    },
    {
      id: "plastic_pollution_collect_plastic",
      title: "Collect Plastic Waste",
      problem: "Plastic Pollution",
      instructions: "Collect 5–10 pieces of plastic from your home or neighborhood."
    }
  ],
  central_india: [
    {
      id: "deforestation_plant_tree",
      title: "Plant a Small Tree",
      problem: "Deforestation",
      instructions: "Plant a small tree or potted plant."
    },
    {
      id: "soil_health_compost_jar",
      title: "Make a Compost Jar",
      problem: "Soil Health / Composting",
      instructions: "Make a compost jar with leftover vegetable peels."
    }
  ],
  east_india: [
    {
      id: "flooding_clean_debris",
      title: "Clean Debris",
      problem: "Flooding / Water Contamination",
      instructions: "Clean debris from a pond, garden, or roadside drain."
    },
    {
      id: "industrial_pollution_river_poster",
      title: "Save Our Rivers Poster",
      problem: "Industrial Pollution Awareness",
      instructions: "Draw a poster about 'Save Our Rivers' or similar campaign."
    }
  ],
  west_india: [
    {
      id: "water_scarcity_collect_greywater",
      title: "Collect Greywater",
      problem: "Water Scarcity",
      instructions: "Collect greywater in a bucket for plants."
    },
    {
      id: "urban_air_pollution_indoor_plant",
      title: "Plant an Indoor Air-Purifying Plant",
      problem: "Urban Air Pollution",
      instructions: "Plant an indoor air-purifying plant (e.g., aloe vera, money plant)."
    }
  ]
}

const CommunityTasks = () => {
  const { user } = useAuth()
  const [region, setRegion] = useState<RegionKey | null>(null)

  useEffect(() => {
    const r = (user?.user_metadata?.region || "") as string
    if (r && ["north_india","south_india","east_india","west_india","central_india"].includes(r)) {
      setRegion(r as RegionKey)
    }
  }, [user])

  const tasks = useMemo(() => {
    if (!region) return []
    return REGION_TASKS[region]
  }, [region])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Community Tasks {region ? `- ${region.replace("_", " ")}` : ""}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!region && (
              <p className="text-muted-foreground">Region not set. Update your profile to see tasks for your area.</p>
            )}
            {tasks.map((t) => (
              <Link key={t.id} to={`/community-tasks/${t.id}`} className="block p-4 rounded-lg border hover:bg-accent transition-colors">
                <div className="font-semibold text-foreground">{t.problem}: {t.title}</div>
                <div className="text-sm text-muted-foreground">{t.instructions}</div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default CommunityTasks


