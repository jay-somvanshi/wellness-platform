import { type NextRequest, NextResponse } from "next/server"
import { verifyTokenFromRequest } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const decoded = verifyTokenFromRequest(request)
    const { db } = await connectToDatabase()

    // Get user's sessions (both draft and published)
    const sessions = await db
      .collection("sessions")
      .find({ user_id: new ObjectId(decoded.userId) })
      .sort({ updated_at: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      sessions: sessions.map((session) => ({
        ...session,
        _id: session._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching user sessions:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
