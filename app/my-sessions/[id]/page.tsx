"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Save, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Session {
  _id: string
  title: string
  tags: string[]
  json_file_url: string
  status: "draft" | "published"
}

export default function EditSessionPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [session, setSession] = useState<Session | null>(null)
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState("")
  const [jsonFileUrl, setJsonFileUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState("")

  useEffect(() => {
    if (params.id && params.id !== "new") {
      fetchSession()
    } else {
      setLoading(false)
    }
  }, [params.id])

  // Auto-save functionality
  useEffect(() => {
    if (!loading && (title || tags || jsonFileUrl) && params.id !== "new") {
      const timeoutId = setTimeout(() => {
        autoSave()
      }, 5000) // Auto-save after 5 seconds of inactivity

      return () => clearTimeout(timeoutId)
    }
  }, [title, tags, jsonFileUrl, loading, params.id])

  const fetchSession = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (!token) {
        router.push("/login")
        return
      }

      const res = await fetch(`/api/my-sessions/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        const data = await res.json()
        setSession(data.session)
        setTitle(data.session.title)
        setTags(data.session.tags.join(", "))
        setJsonFileUrl(data.session.json_file_url)
      } else {
        router.push("/my-sessions")
      }
    } catch (error) {
      console.error("Error fetching session:", error)
      router.push("/my-sessions")
    } finally {
      setLoading(false)
    }
  }

  const autoSave = async () => {
    if (!title.trim()) return

    try {
      setAutoSaveStatus("Saving...")
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (!token) return

      await fetch("/api/my-sessions/save-draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId: params.id !== "new" ? params.id : undefined,
          title: title.trim(),
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          json_file_url: jsonFileUrl.trim(),
        }),
      })

      setAutoSaveStatus("Saved")
      setTimeout(() => setAutoSaveStatus(""), 2000)
    } catch (error) {
      setAutoSaveStatus("Error saving")
      setTimeout(() => setAutoSaveStatus(""), 2000)
    }
  }

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your session.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (!token) {
        router.push("/login")
        return
      }

      const res = await fetch("/api/my-sessions/save-draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId: params.id !== "new" ? params.id : undefined,
          title: title.trim(),
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          json_file_url: jsonFileUrl.trim(),
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Draft saved",
          description: "Your session has been saved as a draft.",
        })

        if (params.id === "new") {
          router.push(`/my-sessions/${data.session._id}`)
        }
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your session.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (!token) {
        router.push("/login")
        return
      }

      // First save as draft if it's a new session
      let sessionId = params.id
      if (params.id === "new") {
        const saveRes = await fetch("/api/my-sessions/save-draft", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            tags: tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
            json_file_url: jsonFileUrl.trim(),
          }),
        })

        const saveData = await saveRes.json()
        if (!saveRes.ok) throw new Error(saveData.error)
        sessionId = saveData.session._id
      }

      // Then publish
      const res = await fetch("/api/my-sessions/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId }),
      })

      if (res.ok) {
        toast({
          title: "Session published",
          description: "Your session is now visible to everyone.",
        })
        router.push("/my-sessions")
      } else {
        const data = await res.json()
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish session.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/my-sessions">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to My Sessions
                  </Link>
                </Button>

                {session && (
                  <Badge variant={session.status === "published" ? "default" : "secondary"}>{session.status}</Badge>
                )}
              </div>

              {autoSaveStatus && (
                <div className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">{autoSaveStatus}</div>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{params.id === "new" ? "Create New Session" : "Edit Session"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter session title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="yoga, meditation, relaxation (comma-separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">Separate tags with commas</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jsonUrl">JSON File URL</Label>
                  <Textarea
                    id="jsonUrl"
                    placeholder="https://example.com/session-data.json"
                    value={jsonFileUrl}
                    onChange={(e) => setJsonFileUrl(e.target.value)}
                    rows={3}
                  />
                  <p className="text-sm text-gray-500">URL to your session configuration JSON file</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    onClick={handleSaveDraft}
                    disabled={saving}
                    variant="outline"
                    className="flex-1 bg-transparent"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Draft"}
                  </Button>

                  <Button onClick={handlePublish} disabled={saving} className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    {saving ? "Publishing..." : "Publish"}
                  </Button>
                </div>

                <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                  <strong>Auto-save:</strong> Your changes are automatically saved every 5 seconds while you type.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
