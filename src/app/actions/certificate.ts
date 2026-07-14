"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { generateSlug } from "@/lib/slugify"

async function getUniqueCertificateId(title: string): Promise<string> {
  let baseSlug = generateSlug(title);
  if (!baseSlug) baseSlug = "certificate";
  
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await prisma.certificate.findUnique({ where: { id: slug }, select: { id: true } });
    if (!existing) return slug;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}

export async function getCertificates() {
  return await prisma.certificate.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function createCertificate(data: {
  title: string;
  image: string;
}) {
  try {
    const certificateId = await getUniqueCertificateId(data.title);

    const certificate = await prisma.certificate.create({
      data: {
        id: certificateId,
        ...data
      }
    });
    
    revalidatePath("/admin/certificates");
    revalidatePath("/certificates");
    
    return { success: true, certificate };
  } catch (error) {
    console.error("Error creating certificate:", error);
    return { success: false, error: "Failed to create certificate" };
  }
}
