import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { SetupForm } from "./SetupForm"

export default async function SetupPage() {
  const userCount = await prisma.user.count()
  
  if (userCount > 0) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-[#02060d] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Initial Setup</h1>
          <p className="text-slate-400">Create the first administrator account</p>
        </div>
        
        <SetupForm />
      </div>
    </div>
  )
}
