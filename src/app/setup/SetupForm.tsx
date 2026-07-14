"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { createFirstAdmin } from "@/app/actions/setup"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const setupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SetupValues = z.infer<typeof setupSchema>

export function SetupForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<SetupValues>({
    resolver: zodResolver(setupSchema)
  })

  const onSubmit = async (data: SetupValues) => {
    setIsSubmitting(true)
    try {
      const res = await createFirstAdmin({
        email: data.email,
        password: data.password
      })
      
      if (res.success) {
        toast.success("Admin account created! You can now login.")
        router.push("/admin/login")
      } else {
        toast.error(res.error || "Failed to create account")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
        <input 
          {...register("email")}
          type="email" 
          className="w-full bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
          placeholder="admin@classicedge.com"
        />
        {errors.email && <span className="text-red-400 text-xs mt-1">{errors.email.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
        <input 
          {...register("password")}
          type="password" 
          className="w-full bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
          placeholder="••••••••"
        />
        {errors.password && <span className="text-red-400 text-xs mt-1">{errors.password.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Confirm Password</label>
        <input 
          {...register("confirmPassword")}
          type="password" 
          className="w-full bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
          placeholder="••••••••"
        />
        {errors.confirmPassword && <span className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</span>}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
        {isSubmitting ? "Creating Account..." : "Complete Setup"}
      </button>
    </form>
  )
}
