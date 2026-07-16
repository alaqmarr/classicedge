import prisma from "@/lib/prisma"
import { ProductForm, FormValues } from "../../new/ProductForm"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [availableConsumables, product] = await Promise.all([
    prisma.consumable.findMany({
      select: { id: true, name: true, category: true },
      orderBy: { name: 'asc' }
    }),
    prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        resources: true,
        specifications: true,
        consumables: true,
        models: {
          include: {
            resources: true,
            specifications: true,
            consumables: true
          }
        }
      }
    })
  ]);

  if (!product) {
    notFound();
  }

  const initialData: Partial<FormValues> = {
    name: product.name,
    description: product.description || "",
    keywords: product.keywords || "",
    images: product.images.map(img => ({ url: img.url, preview: img.url })),
    resources: product.resources.map(res => ({ name: res.name, url: res.url })),
    specifications: product.specifications.map(s => ({ key: s.key, value: s.value || "" })),
    consumables: product.consumables.map(c => c.id),
    models: product.models.map(m => ({
      modelName: m.modelName,
      specifications: m.specifications.map(s => ({ key: s.key, value: s.value || "" })),
      resources: m.resources.map(res => ({ name: res.name, url: res.url })),
      consumables: m.consumables.map(c => c.id)
    }))
  };

  return <ProductForm availableConsumables={availableConsumables} initialData={initialData} productId={product.id} />
}
