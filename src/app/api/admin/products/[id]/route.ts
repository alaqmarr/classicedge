import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();

    // First delete all related entries that we will recreate
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.resource.deleteMany({ where: { productId: id } });
    await prisma.specification.deleteMany({ where: { productId: id } });
    await prisma.productFeature.deleteMany({ where: { productId: id } });
    await prisma.productModel.deleteMany({ where: { productId: id } });

    // Then update the product and recreate relationships
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        coverImage: data.images[0] || null,
        keywords: data.keywords || null,
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
          set: [],
          connect: data.consumables.map((cid: string) => ({ id: cid }))
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
               connect: model.consumables.map((cid: string) => ({ id: cid }))
            }
          }))
        }
      }
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
    revalidatePath("/admin/products");

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to update product", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
