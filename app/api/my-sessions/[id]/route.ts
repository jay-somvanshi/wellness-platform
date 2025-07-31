import { type NextRequest, NextResponse } from "next/server"
import { verifyTokenFromRequest } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = verifyTokenFromRequest(request)
    const { db } = await connectToDatabase()

    const session = await db.collection("sessions").findOne({
      _id: new ObjectId(params.id),
      user_id: new ObjectId(decoded.userId),
    })

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      session: {
        ...session,
        _id: session._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error fetching session:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = verifyTokenFromRequest(request)
    const { db } = await connectToDatabase()

    const result = await db.collection("sessions").deleteOne({
      _id: new ObjectId(params.id),
      user_id: new ObjectId(decoded.userId),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Session deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting session:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = verifyTokenFromRequest(request)
    const { title, tags, json_file_url } = await request.json()
    const { db } = await connectToDatabase()

    const result = await db.collection("sessions").findOneAndUpdate(
      {
        _id: new ObjectId(params.id),
        user_id: new ObjectId(decoded.userId),
      },
      {
        $set: {
          title: title?.trim(),
          tags: tags || [],
          json_file_url: json_file_url || "",
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
    console.error("Error updating session:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
