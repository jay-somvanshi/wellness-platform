import { type NextRequest, NextResponse } from "next/server"
import { verifyTokenFromRequest } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const decoded = verifyTokenFromRequest(request)
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("sessions").findOneAndUpdate(
      {
        _id: new ObjectId(sessionId),
        user_id: new ObjectId(decoded.userId),
      },
      {
        $set: {
          status: "published",
          published_at: new Date(),
          updated_at: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    if (!result) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      session: {
        ...result,
        _id: result._id.toString(),
      },
    })
  } catch (error) {
    console.error("Publish session error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
