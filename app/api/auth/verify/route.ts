import { type NextRequest, NextResponse } from "next/server"
import { verifyTokenFromRequest } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const decoded = verifyTokenFromRequest(request)
    const { db } = await connectToDatabase()

    // Verify user still exists
    const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
