import jwt from "jsonwebtoken"
import type { NextRequest } from "next/server"

export interface JWTPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

export function signToken(payload: { userId: string; email: string }): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined")
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  })
}

export function verifyToken(token: string): JWTPayload {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined")
  }

  return jwt.verify(token, process.env.JWT_SECRET) as JWTPayload
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  return authHeader.replace("Bearer ", "")
}

export function verifyTokenFromRequest(request: NextRequest): JWTPayload {
  const token = getTokenFromRequest(request)
  if (!token) {
    throw new Error("No token provided")
  }

  return verifyToken(token)
}
