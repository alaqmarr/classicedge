"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getContacts() {
  return await prisma.contactInfo.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function createContact(data: {
  title: string;
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl?: string;
}) {
  try {
    const contact = await prisma.contactInfo.create({
      data
    });
    
    revalidatePath("/admin/contact");
    revalidatePath("/contact");
    revalidatePath("/");
    
    return { success: true, contact };
  } catch (error) {
    console.error("Error creating contact:", error);
    return { success: false, error: "Failed to create contact" };
  }
}
