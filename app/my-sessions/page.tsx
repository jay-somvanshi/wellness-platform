"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"

interface Session {
  _id: string
  title: string
  tags: string[]
  json_file_url: string
  status: "draft" | "published"
  created_at: string
  updated_at: string
}

export default function MySessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchMySessions()
  }, [])

  const fetchMySessions = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (!token) return

      const res = await fetch("/api/my-sessions", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setSessions(data.sessions || [])
    } catch (error) {
      console.error("Error fetching sessions:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (!token) return

      const res = await fetch(`/api/my-sessions/${sessionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        setSessions(sessions.filter((s) => s._id !== sessionId))
        toast({
          title: "Session deleted",
          description: "Your session has been successfully deleted.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete session.",
        variant: "destructive",
      })
    }
  }

  const publishSession = async (sessionId: string) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (!token) return

      const res = await fetch("/api/my-sessions/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId }),
      })

      if (res.ok) {
        setSessions(sessions.map((s) => (s._id === sessionId ? { ...s, status: "published" } : s)))
        toast({
          title: "Session published",
          description: "Your session is now visible to everyone.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish session.",
        variant: "destructive",
      })
    }
  }

  const drafts = sessions.filter((s) => s.status === "draft")
  const published = sessions.filter((s) => s.status === "published")

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Sessions</h1>
              <p className="text-gray-600">Manage your wellness sessions and drafts</p>
            </div>

            <Button asChild className="mt-4 md:mt-0">
              <Link href="/my-sessions/new">
                <Plus className="h-4 w-4 mr-2" />
                Create New Session
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="space-y-8">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-full"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Drafts */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Drafts ({drafts.length})</h2>
                {drafts.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500 mb-4">No drafts yet</p>
                      <Button asChild>
                        <Link href="/my-sessions/new">Create your first session</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {drafts.map((session) => (
                      <SessionCard
                        key={session._id}
                        session={session}
                        onDelete={deleteSession}
                        onPublish={publishSession}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Published */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Published ({published.length})</h2>
                {published.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">No published sessions yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {published.map((session) => (
                      <SessionCard key={session._id} session={session} onDelete={deleteSession} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

function SessionCard({
  session,
  onDelete,
  onPublish,
}: {
  session: Session
  onDelete: (id: string) => void
  onPublish?: (id: string) => void
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="line-clamp-2 text-lg">{session.title}</CardTitle>
            <CardDescription>
              {session.status === "draft" ? "Last saved" : "Published"}{" "}
              {new Date(session.updated_at).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge variant={session.status === "published" ? "default" : "secondary"}>{session.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {session.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {session.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{session.tags.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
            <Link href={`/my-sessions/${session._id}`}>
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Link>
          </Button>

          {session.status === "draft" && onPublish && (
            <Button size="sm" onClick={() => onPublish(session._id)} className="flex-1">
              <Eye className="h-3 w-3 mr-1" />
              Publish
            </Button>
          )}

          <Button variant="destructive" size="sm" onClick={() => onDelete(session._id)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
