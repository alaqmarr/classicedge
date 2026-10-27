import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

const getConsumableCategories = unstable_cache(
  async () => {
    const consumables = await prisma.consumable.findMany({
      select: { category: true },
      where: { category: { not: null } },
      distinct: ["category"],
    });
    return consumables.map((c) => c.category).filter(Boolean) as string[];
  },
  ["consumable-categories"],
  { revalidate: 3600 }
);

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const consumableCategories = await getConsumableCategories();

  return (
    <>
      <Navbar consumableCategories={consumableCategories} />
      <main className="flex-1 flex flex-col pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
