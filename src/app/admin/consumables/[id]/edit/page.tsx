import prisma from "@/lib/prisma";
import { ConsumableForm } from "../../new/NewConsumableClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditConsumablePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [products, consumable] = await Promise.all([
    prisma.product.findMany({
      include: {
        models: true
      }
    }),
    prisma.consumable.findUnique({
      where: { id },
      include: {
        products: true,
        models: true
      }
    })
  ]);

  if (!consumable) {
    notFound();
  }

  return <ConsumableForm products={products} initialData={consumable} consumableId={consumable.id} />;
}
