import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Get all published sessions with user email
    const sessions = await db
      .collection("sessions")
      .aggregate([
        { $match: { status: "published" } },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $project: {
            title: 1,
            tags: 1,
            json_file_url: 1,
            status: 1,
            created_at: 1,
            updated_at: 1,
            user_email: { $arrayElemAt: ["$user.email", 0] },
          },
        },
        { $sort: { created_at: -1 } },
      ])
      .toArray()

    return NextResponse.json({
      success: true,
      sessions: sessions.map((session) => ({
        ...session,
        _id: session._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
