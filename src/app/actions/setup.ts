"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const setupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function createFirstAdmin(data: z.infer<typeof setupSchema>) {
  try {
    // Verify that NO users exist
    const userCount = await prisma.user.count()
    if (userCount > 0) {
      return { success: false, error: "Setup has already been completed. Admin account exists." }
    }

    const { email, password } = setupSchema.parse(data)
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      }
    })

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    console.error("Error creating admin:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
