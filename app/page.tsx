import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { Heart, Users, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Wellness Journey
            <span className="text-primary block">Starts Here</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create, share, and discover wellness sessions. From yoga to meditation, build your perfect wellness routine
            with our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">Explore Sessions</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Personalized Sessions</CardTitle>
              <CardDescription>Create custom wellness sessions tailored to your needs and preferences</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Community Driven</CardTitle>
              <CardDescription>Share your sessions with others and discover new wellness practices</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Auto-Save Drafts</CardTitle>
              <CardDescription>Never lose your work with our intelligent auto-save feature</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your Wellness?</h2>
          <p className="text-gray-600 mb-6">Join thousands of users creating and sharing their wellness journey</p>
          <Button size="lg" asChild>
            <Link href="/register">Start Your Journey</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
