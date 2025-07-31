"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing token on mount
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        // Verify token and get user info
        fetch("/api/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.user) {
              setUser(data.user)
            } else {
              localStorage.removeItem("token")
            }
          })
          .catch(() => localStorage.removeItem("token"))
          .finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", data.token)
        }
        setUser(data.user)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", data.token)
        }
        setUser(data.user)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
