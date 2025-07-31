export interface CreateUserInput {
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface CreateSessionInput {
  title: string
  tags: string[]
  json_file_url: string
}

export interface UpdateSessionInput {
  sessionId: string
  title?: string
  tags?: string[]
  json_file_url?: string
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters long" }
  }
  return { valid: true }
}

export function validateSessionInput(input: CreateSessionInput): { valid: boolean; message?: string } {
  if (!input.title || input.title.trim().length === 0) {
    return { valid: false, message: "Title is required" }
  }

  if (input.title.trim().length > 200) {
    return { valid: false, message: "Title must be less than 200 characters" }
  }

  if (input.tags && input.tags.length > 10) {
    return { valid: false, message: "Maximum 10 tags allowed" }
  }

  if (input.json_file_url && input.json_file_url.length > 500) {
    return { valid: false, message: "JSON file URL must be less than 500 characters" }
  }

  return { valid: true }
}
