import prisma from "@/lib/prisma";
import { ConsumableForm } from "./NewConsumableClient";

export const dynamic = "force-dynamic";

export default async function NewConsumablePage() {
  const products = await prisma.product.findMany({
    include: {
      models: true
    }
  });

  return <ConsumableForm products={products} />;
}
