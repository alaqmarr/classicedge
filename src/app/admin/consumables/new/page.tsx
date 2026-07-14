import prisma from "@/lib/prisma";
import { NewConsumableClient } from "./NewConsumableClient";

export const dynamic = "force-dynamic";

export default async function NewConsumablePage() {
  const products = await prisma.product.findMany({
    include: {
      models: true
    }
  });

  return <NewConsumableClient products={products} />;
}
