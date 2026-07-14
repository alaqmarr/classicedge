"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { extractKeywords } from "@/lib/keywords";
import { generateSlug } from "@/lib/slugify";

async function getUniqueConsumableId(name: string): Promise<string> {
  let baseSlug = generateSlug(name);
  if (!baseSlug) baseSlug = "consumable";
  
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await prisma.consumable.findUnique({ where: { id: slug }, select: { id: true } });
    if (!existing) return slug;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}

export async function createConsumable(data: {
  name: string;
  description?: string;
  keywords?: string;
  image?: string;
  price?: number | null;
  productIds: string[];
  modelIds: string[];
}) {
  try {
    const consumableId = await getUniqueConsumableId(data.name);

    const consumable = await prisma.consumable.create({
      data: {
        id: consumableId,
        name: data.name,
        description: data.description || null,
        keywords: data.keywords || extractKeywords(data.name, data.description || ""),
        image: data.image || null,
        products: {
          connect: data.productIds.map(id => ({ id }))
        },
        models: {
          connect: data.modelIds.map(id => ({ id }))
        }
      }
    });

    revalidatePath("/admin/consumables");
    revalidatePath("/consumables");
    revalidatePath("/products/[id]", "page");
    
    return { success: true, consumable };
  } catch (error: any) {
    console.error("Error creating consumable:", error);
    return { success: false, error: "Failed to create consumable" };
  }
}
