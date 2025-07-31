import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"
import { signToken } from "@/lib/auth"
import { validateEmail, validatePassword } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.message }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 })
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12)

    // Create user
    const result = await db.collection("users").insertOne({
      email: email.toLowerCase(),
      password_hash,
      created_at: new Date(),
      updated_at: new Date(),
    })

    // Generate JWT token
    const token = signToken({
      userId: result.insertedId.toString(),
      email: email.toLowerCase(),
    })

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: result.insertedId.toString(),
        email: email.toLowerCase(),
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
