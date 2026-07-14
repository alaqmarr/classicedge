import prisma from "@/lib/prisma"
import { ProductForm } from "./ProductForm"

export const dynamic = "force-dynamic"

export default async function NewProductPage() {
  const availableConsumables = await prisma.consumable.findMany({
    select: { id: true, name: true, category: true },
    orderBy: { name: 'asc' }
  })

  return <ProductForm availableConsumables={availableConsumables} />
}
