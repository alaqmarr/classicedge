"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { extractKeywords } from "@/lib/keywords"
import { generateSlug } from "@/lib/slugify"

async function getUniqueProductId(name: string): Promise<string> {
  let baseSlug = generateSlug(name);
  if (!baseSlug) baseSlug = "product";
  
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await prisma.product.findUnique({ where: { id: slug }, select: { id: true } });
    if (!existing) return slug;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}

export type SpecificationInput = {
  key: string;
  value: string;
};

export type ProductModelInput = {
  modelName: string;
  specifications: SpecificationInput[];
};

export async function createProduct(data: {
  name: string;
  description?: string;
  keywords?: string;
  coverImage?: string;
  models: ProductModelInput[];
}) {
  try {
    const productId = await getUniqueProductId(data.name);

    const product = await prisma.product.create({
      data: {
        id: productId,
        name: data.name,
        description: data.description,
        keywords: data.keywords || extractKeywords(data.name, data.description),
        coverImage: data.coverImage,
        models: {
          create: data.models.map(model => {
            const modelId = `${productId}-${generateSlug(model.modelName) || "model"}`;
            return {
              id: modelId,
              modelName: model.modelName,
              specifications: {
                create: model.specifications.map((spec, index) => ({
                  id: `${modelId}-spec-${index}`,
                  key: spec.key,
                  value: spec.value
                }))
              }
            };
          })
        }
      }
    });
    
    revalidatePath("/admin/products");
    revalidatePath("/products");
    
    return { success: true, product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function getProducts() {
  return await prisma.product.findMany({
    include: {
      models: {
        include: {
          specifications: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}
