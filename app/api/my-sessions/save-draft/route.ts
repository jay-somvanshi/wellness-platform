import { type NextRequest, NextResponse } from "next/server"
import { verifyTokenFromRequest } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { validateSessionInput } from "@/lib/validations"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const decoded = verifyTokenFromRequest(request)
    const { sessionId, title, tags, json_file_url } = await request.json()

    // Validation
    const validation = validateSessionInput({ title, tags, json_file_url })
    if (!validation.valid) {
      return NextResponse.json({ error: validation.message }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const now = new Date()

    if (sessionId) {
      // Update existing session
      const result = await db.collection("sessions").findOneAndUpdate(
        {
          _id: new ObjectId(sessionId),
          user_id: new ObjectId(decoded.userId),
        },
        {
          $set: {
            title: title.trim(),
            tags: tags || [],
            json_file_url: json_file_url || "",
            updated_at: now,
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
    } else {
      // Create new session
      const result = await db.collection("sessions").insertOne({
        user_id: new ObjectId(decoded.userId),
        title: title.trim(),
        tags: tags || [],
        json_file_url: json_file_url || "",
        status: "draft",
        created_at: now,
        updated_at: now,
      })

      const newSession = await db.collection("sessions").findOne({ _id: result.insertedId })

      return NextResponse.json({
        success: true,
        session: {
          ...newSession,
          _id: newSession!._id.toString(),
        },
      })
    }
  } catch (error) {
    console.error("Save draft error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
