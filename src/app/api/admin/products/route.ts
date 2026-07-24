import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        keywords: data.keywords || null,
        coverImage: data.images[0] || null,
        images: {
          create: data.images.map((url: string) => ({ url }))
        },
        resources: {
          create: data.resources.map((r: any) => ({ name: r.name, url: r.url }))
        },
        specifications: {
          create: data.specifications.map((s: any) => ({ key: s.key, value: s.value }))
        },
        features: {
          create: data.features?.map((f: any) => ({ text: f.text })) || []
        },
        consumables: {
          connect: data.consumables.map((id: string) => ({ id }))
        },
        models: {
          create: data.models.map((model: any) => ({
            modelName: model.modelName,
            specifications: {
              create: model.specifications.map((s: any) => ({ key: s.key, value: s.value }))
            },
            resources: {
              create: model.resources.map((r: any) => ({ name: r.name, url: r.url }))
            },
            consumables: {
               connect: model.consumables.map((id: string) => ({ id }))
            }
          }))
        }
      }
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to create product", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
