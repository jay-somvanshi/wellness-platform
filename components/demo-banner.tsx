"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export function DemoBanner() {
  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <strong>Demo Mode:</strong> Use these accounts to test all features:
        <br />📧 <strong>demo@wellness.com</strong> / 🔑 <strong>demo123</strong>
        <br />📧 <strong>instructor@wellness.com</strong> / 🔑 <strong>demo123</strong>
      </AlertDescription>
    </Alert>
  )
}
